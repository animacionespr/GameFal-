-- ─── Extensions ────────────────────────────────────────────────────────────────
create extension if not exists "uuid-ossp";
create extension if not exists "pg_trgm";

-- ─── updated_at trigger function ────────────────────────────────────────────────
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ─── profiles ───────────────────────────────────────────────────────────────────
-- Extends auth.users; one row per authenticated user.
create table if not exists public.profiles (
  id             uuid        primary key references auth.users(id) on delete cascade,
  email          text        not null,
  full_name      text,
  avatar_url     text,
  plan           text        not null default 'free'
                               check (plan in ('free', 'starter', 'pro', 'enterprise')),
  analyses_used  integer     not null default 0,
  analyses_limit integer     not null default 3,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

comment on table public.profiles is
  'Public user profile extending auth.users. Tracks subscription plan and usage.';

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.handle_updated_at();

-- ─── analyses ───────────────────────────────────────────────────────────────────
-- Stores every analysis run and all generated phase outputs.
create table if not exists public.analyses (
  id                  uuid        primary key default uuid_generate_v4(),
  user_id             uuid        not null references public.profiles(id) on delete cascade,

  -- Input fields
  input_url           text,
  input_description   text,
  target_audience     text,
  goals               text[],

  -- Progress tracking
  status              text        not null default 'pending'
                                    check (status in (
                                      'pending',
                                      'analyzing',
                                      'generating_document',
                                      'generating_wireframes',
                                      'generating_code',
                                      'generating_roadmap',
                                      'completed',
                                      'failed'
                                    )),
  current_phase       integer     not null default 0,

  -- Phase outputs (jsonb allows flexible, typed storage)
  analysis_document   jsonb,      -- Phase 1 & 2: AnalysisDocument
  wireframes          jsonb,      -- Phase 3 & 4: WireframeSet
  generated_code      jsonb,      -- Phase 5 & 6: GeneratedCode
  roadmap             jsonb,      -- Phase 7: ProjectRoadmap

  -- Error handling
  error_message       text,

  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

comment on table public.analyses is
  'Stores all analysis projects including input, status, and all 7 generated phases.';
comment on column public.analyses.analysis_document is 'Phase 1 & 2 output: structured AnalysisDocument (features, UX issues, opportunities).';
comment on column public.analyses.wireframes         is 'Phase 3 & 4 output: WireframeSet (design system + per-screen wireframes).';
comment on column public.analyses.generated_code     is 'Phase 5 & 6 output: GeneratedCode (architecture + project files).';
comment on column public.analyses.roadmap            is 'Phase 7 output: ProjectRoadmap (milestones, items, KPIs).';

create trigger analyses_updated_at
  before update on public.analyses
  for each row execute function public.handle_updated_at();

-- ─── subscriptions ──────────────────────────────────────────────────────────────
-- Mirrors Stripe subscription data so the app can work offline from Stripe.
create table if not exists public.subscriptions (
  id                       uuid        primary key default uuid_generate_v4(),
  user_id                  uuid        not null unique references public.profiles(id) on delete cascade,
  stripe_customer_id       text,
  stripe_subscription_id   text        unique,
  plan                     text        not null default 'free'
                                         check (plan in ('free', 'starter', 'pro', 'enterprise')),
  status                   text        not null default 'active'
                                         check (status in ('active', 'trialing', 'past_due', 'cancelled', 'unpaid', 'incomplete')),
  current_period_start     timestamptz,
  current_period_end       timestamptz,
  created_at               timestamptz not null default now(),
  updated_at               timestamptz not null default now()
);

comment on table public.subscriptions is
  'Mirrors Stripe subscription state. Updated by the webhook handler on every billing event.';

create trigger subscriptions_updated_at
  before update on public.subscriptions
  for each row execute function public.handle_updated_at();

-- ─── Row-Level Security ──────────────────────────────────────────────────────────
alter table public.profiles      enable row level security;
alter table public.analyses      enable row level security;
alter table public.subscriptions enable row level security;

-- profiles: users can read and update their own row
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);

create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);

-- analyses: users can only see and manage their own analyses
create policy "analyses_select_own" on public.analyses
  for select using (auth.uid() = user_id);

create policy "analyses_insert_own" on public.analyses
  for insert with check (auth.uid() = user_id);

create policy "analyses_update_own" on public.analyses
  for update using (auth.uid() = user_id);

create policy "analyses_delete_own" on public.analyses
  for delete using (auth.uid() = user_id);

-- subscriptions: users can only read their own subscription
create policy "subscriptions_select_own" on public.subscriptions
  for select using (auth.uid() = user_id);

-- ─── Indexes ────────────────────────────────────────────────────────────────────
-- analyses: common query patterns
create index if not exists analyses_user_id_idx
  on public.analyses (user_id);

create index if not exists analyses_user_created_idx
  on public.analyses (user_id, created_at desc);

create index if not exists analyses_status_idx
  on public.analyses (status);

-- Full-text search on text inputs using pg_trgm
create index if not exists analyses_input_url_trgm_idx
  on public.analyses using gin (input_url gin_trgm_ops)
  where input_url is not null;

create index if not exists analyses_input_desc_trgm_idx
  on public.analyses using gin (input_description gin_trgm_ops)
  where input_description is not null;

-- GIN index for JSONB columns to speed up document lookups
create index if not exists analyses_document_gin_idx
  on public.analyses using gin (analysis_document)
  where analysis_document is not null;

-- subscriptions: lookup by Stripe IDs
create index if not exists subscriptions_user_id_idx
  on public.subscriptions (user_id);

create index if not exists subscriptions_stripe_customer_idx
  on public.subscriptions (stripe_customer_id)
  where stripe_customer_id is not null;

create index if not exists subscriptions_stripe_sub_idx
  on public.subscriptions (stripe_subscription_id)
  where stripe_subscription_id is not null;

-- ─── Function: check_analysis_limit ─────────────────────────────────────────────
-- Returns true when the user is within their plan quota.
-- Enterprise plan uses limit = -1 to mean "unlimited".
create or replace function public.check_analysis_limit(p_user_id uuid)
returns boolean
language plpgsql
security definer
as $$
declare
  v_used  integer;
  v_limit integer;
begin
  select analyses_used, analyses_limit
    into v_used, v_limit
    from public.profiles
   where id = p_user_id;

  if not found then
    return false;
  end if;

  -- -1 means unlimited (Enterprise plan)
  if v_limit = -1 then
    return true;
  end if;

  return v_used < v_limit;
end;
$$;

comment on function public.check_analysis_limit(uuid) is
  'Returns true when the given user still has analyses remaining under their plan quota. Enterprise plan (-1 limit) is always true.';

-- ─── Function: handle_new_user ───────────────────────────────────────────────────
-- Automatically creates a profile row whenever a new auth.users row is inserted.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'avatar_url'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

-- Trigger fires after every new auth user is created (OAuth, magic link, email/password)
create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
