# App Evolution — Architecture Decision Records

## ADR-001: AI Provider — Anthropic Claude

**Decision**: Use Anthropic Claude (claude-sonnet-4-6) as the AI engine.

**Rationale**:
- 200K token context window handles large codebases
- Superior instruction following for structured JSON output
- Strong code generation capabilities
- Official SDK with TypeScript support

**Trade-off**: Higher cost than GPT-3.5, but analysis quality justifies it.

---

## ADR-002: Database — Supabase + PostgreSQL

**Decision**: Supabase as the BaaS platform.

**Rationale**:
- Built-in Row Level Security (RLS) for multi-tenant data isolation
- Real-time subscriptions (future: live progress updates)
- Built-in Auth with OAuth providers
- JSONB columns for flexible analysis storage
- Instant REST/GraphQL API

**Alternative considered**: PlanetScale (MySQL) — rejected: no JSONB support.

---

## ADR-003: Analysis Storage — JSONB vs Normalized Tables

**Decision**: Store analysis phases as JSONB columns in `analyses` table.

**Rationale**:
- Analysis schema evolves with AI prompts — JSONB avoids constant migrations
- Single row fetch returns complete project state
- GIN indexes enable JSON field searching
- Acceptable read performance for the access patterns (by user_id)

**Trade-off**: Less queryable than normalized tables. Accepted for v1.

---

## ADR-004: Async Analysis Processing

**Decision**: Fire-and-forget async processing, client polls for status.

**Rationale**:
- Analysis takes 2-5 minutes — HTTP timeout risk with synchronous approach
- Polling every 3s provides good UX without WebSocket complexity
- Server Actions aren't suitable for long-running operations
- Supabase Realtime could replace polling in v2

**Alternative considered**: WebSockets/SSE — overkill for v1, planned for v2.

---

## ADR-005: Authentication — Supabase Auth

**Decision**: Use Supabase Auth for all authentication.

**Rationale**:
- Zero-config social OAuth (Google, GitHub)
- JWT tokens automatically handled
- Row Level Security integrates natively
- Email confirmation flow included

---

## ADR-006: Payments — Stripe

**Decision**: Stripe for subscription management.

**Rationale**:
- Industry standard for SaaS billing
- Excellent webhook reliability
- Customer portal for self-service billing management
- Strong fraud prevention

---

## ADR-007: Frontend State — Zustand

**Decision**: Zustand for global client state.

**Rationale**:
- Minimal boilerplate vs Redux
- TypeScript-first
- Server-compatible (no hydration issues)
- Sufficient for current state needs (user, projects list)

---

## Data Flow

```
User submits URL/description
    │
    ▼
POST /api/analyze
    │
    ├── Validate input (Zod)
    ├── Check auth (Supabase)
    ├── Check plan limits
    ├── Create analyses row (status: "pending")
    └── Return { projectId } immediately (202)
         │
         ▼ (background)
    Phase 1: analyzeApplication() → Claude API
    Phase 2: Save document, update status → Supabase
    Phase 3: generateWireframes() → Claude API
    Phase 4: Save wireframes, update status → Supabase
    Phase 5: generateCode() → Claude API
    Phase 6: Save code, update status → Supabase
    Phase 7: generateRoadmap() → Claude API
         │
         ▼
    status: "completed" → Supabase
         │
    Client polling GET /api/projects/:id every 3s
         │
    Show results in tabs
```

---

## Security Model

1. **Authentication**: JWT via Supabase Auth
2. **Authorization**: RLS policies — users only see their own data
3. **API security**: All routes validate `supabase.auth.getUser()` before proceeding
4. **Input validation**: Zod schemas on all API inputs
5. **Stripe webhooks**: Signature verification with `STRIPE_WEBHOOK_SECRET`
6. **IP safety**: AI prompts explicitly instruct to never reproduce proprietary code

---

## Performance Targets

| Metric | Target | Strategy |
|--------|--------|----------|
| Page load | < 1.5s | Next.js RSC, edge runtime |
| Analysis start | < 500ms | Non-blocking, optimistic UI |
| Poll response | < 200ms | DB index on (user_id, id) |
| Full analysis | 2-5 min | Claude API inherent latency |

---

## Future Architecture (v2)

- **Job Queue**: Upstash QStash for reliable async processing
- **Real-time**: Supabase Realtime instead of polling
- **Caching**: Vercel KV for API response caching
- **Rate Limiting**: Upstash Ratelimit on API routes
- **Monitoring**: Sentry + PostHog + Vercel Analytics
- **Multi-region**: Vercel Edge Network + Supabase read replicas
