# App Evolution — Deployment Guide

## Prerequisites

- Node.js 20+
- A Supabase project
- An Anthropic API key
- A Stripe account
- A Vercel account (recommended)

---

## 1. Clone & Install

```bash
git clone <your-repo>
cd app-evolution
npm install
```

---

## 2. Supabase Setup

### Create a new project at supabase.com

1. Go to **supabase.com** → New project
2. Copy your **Project URL** and **anon key** from Settings → API
3. Copy your **service_role key** (keep this secret!)

### Run migrations

```bash
# Install Supabase CLI
npm install -g supabase

# Login and link project
supabase login
supabase link --project-ref YOUR_PROJECT_REF

# Run migrations
supabase db push
```

Or manually run `supabase/migrations/001_initial.sql` in the Supabase SQL editor.

### Enable Google OAuth (optional)

1. Supabase → Authentication → Providers → Google
2. Add your Google OAuth credentials

---

## 3. Stripe Setup

1. Create products in Stripe Dashboard:
   - **Starter**: $49/month recurring
   - **Pro**: $149/month recurring
   - **Enterprise**: $499/month recurring

2. Copy the **price IDs** for each product

3. Set up webhook endpoint:
   - URL: `https://your-domain.com/api/stripe/webhook`
   - Events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`

---

## 4. Environment Variables

Copy `.env.example` to `.env.local` and fill in:

```bash
cp .env.example .env.local
```

Required variables:
```
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
ANTHROPIC_API_KEY=sk-ant-...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_STARTER=price_...
STRIPE_PRICE_PRO=price_...
STRIPE_PRICE_ENTERPRISE=price_...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 5. Local Development

```bash
npm run dev
```

Open http://localhost:3000

---

## 6. Deploy to Vercel

### Option A: Vercel CLI

```bash
npm install -g vercel
vercel
```

Follow prompts. Add all environment variables in the Vercel dashboard.

### Option B: GitHub Integration

1. Push to GitHub
2. Import repo in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically on push to main

---

## 7. Post-deployment

1. Update `NEXT_PUBLIC_APP_URL` to your production URL
2. Update Stripe webhook URL to production
3. Test the full analysis flow
4. Monitor logs in Vercel → Functions tab

---

## Architecture Overview

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   Next.js 14    │────▶│   Supabase DB    │     │  Anthropic API  │
│  (Vercel Edge)  │     │  (PostgreSQL)    │     │  (Claude AI)    │
│                 │     │                  │     │                 │
│  - App Router   │     │  - analyses      │     │  - Analysis     │
│  - API Routes   │────▶│  - profiles      │────▶│  - Wireframes   │
│  - Auth         │     │  - subscriptions │     │  - Code gen     │
└────────┬────────┘     └──────────────────┘     └─────────────────┘
         │
         ▼
┌─────────────────┐
│     Stripe      │
│   (Payments)    │
│                 │
│  - Subscriptions│
│  - Webhooks     │
└─────────────────┘
```

---

## Performance Considerations

- Analysis runs asynchronously (non-blocking response to client)
- Client polls `/api/projects/:id` every 3 seconds during processing
- Consider adding a job queue (BullMQ/Upstash) for production scale
- Enable Vercel Edge Runtime for static routes

---

## Scaling Checklist

- [ ] Add Redis/Upstash for job queue
- [ ] Add rate limiting (Upstash Ratelimit)
- [ ] Add Sentry for error monitoring
- [ ] Add PostHog for analytics
- [ ] Enable Vercel KV for session caching
- [ ] Set up database connection pooling (PgBouncer)
