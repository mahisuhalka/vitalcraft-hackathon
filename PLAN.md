# VitalCraft — Product Roadmap

VitalCraft is the event website and team portal for a 24-hour Hardware & Software hackathon organized by
IEEE EMBS – BMSIT&M. Milestone 1 delivered the full branded public site plus a working, clearly-labelled demo of
registration and the team dashboard. The remaining milestones add the live backend one self-contained piece at a time.

## Platform decision

The project is hosted on Netlify, so the roadmap uses Netlify's built-in services for the backend in place of the
Supabase/Vercel pieces from the original brief. The application stays a standard Next.js App Router project.

| Brief asked for            | Built with on Netlify                                                         |
| -------------------------- | ----------------------------------------------------------------------------- |
| Supabase Auth              | Netlify Identity (`@netlify/identity`) — email + password with confirmation   |
| Supabase Postgres + RLS    | Netlify Database (managed Postgres) + Drizzle ORM, migrations in `db/`        |
| Private Supabase Storage   | Netlify Blobs private store, accessed only through authorized server routes  |
| AI provider key            | Netlify AI Gateway (no key to manage; server-side only)                       |
| Vercel deployment          | Netlify (Next.js runtime auto-detected)                                       |

Authorization is enforced in one server-side data-access layer (every query is scoped by the signed-in user).
Postgres row-level security policies are added as a second line of defence where they fit.

## Route map

| Route                              | Who                | Purpose                                                 | Milestone |
| ---------------------------------- | ------------------ | ------------------------------------------------------- | --------- |
| `/`                                | Public             | Single-page event site (all sections)                   | 1 ✅      |
| `/register`                        | Leader             | Team registration (demo now, live in M2)                | 1 ✅ / 2  |
| `/dashboard`                       | Leader             | Team dashboard (demo now, live in M2)                   | 1 ✅ / 2  |
| `/login`, `/auth/callback`         | Leader             | Sign-in and confirmation/session flow                   | 2         |
| `/dashboard/idea`                  | Leader             | Idea form, deck upload, final submission, CraftCheck    | 3, 5      |
| `/api/decks/[id]`                  | Owner / organizer  | Authorized short-lived deck download                    | 3         |
| `/organizer`                       | Organizer          | Teams & submissions list, search, filters               | 4         |
| `/organizer/teams/[id]`            | Organizer          | Submission detail, deck, notes, provisional decision    | 4         |
| `/organizer/results`               | Organizer          | Publish results, view attendance confirmations          | 4         |

## Data model (Netlify Database)

- `organizer_memberships(user_id PK, role, created_at, created_by)` — explicit grant; never self-service.
- `teams(id uuid PK, reference unique, leader_user_id unique, team_name, leader_name, leader_email, college, track, team_size check 3–4, consent_at, created_at)`
- `team_members(id, team_id FK→teams ON DELETE CASCADE, position, name)` — unique `(team_id, position)`.
- `submissions(id, team_id FK unique, status check in draft/submitted/under_review, challenge_id, title, problem, users, solution, approach, resources, mvp, demo, submitted_at, updated_at)`
- `attachments(id, submission_id FK, blob_key unique, original_name, kind pdf/pptx, size_bytes, sha256, status pending/active/orphaned, created_at)`
- `reviews(id, team_id FK, author_user_id, note, created_at)` — organizer-only.
- `decisions(team_id PK FK, provisional check pending/shortlisted/waitlisted/not_shortlisted, published_value, published_at, attendance check pending/confirmed/declined, attendance_at)`
- `craftcheck_runs(id, team_id FK, input_hash, result jsonb, created_at)` + `rate_limits(key, window_start, count)` for durable rate limiting.

**Authorization summary**
- Participants can read/write only rows linked to their own `leader_user_id`; they never write role, ownership,
  decision or publication columns.
- Participant reads of `decisions` return only `published_value` (and only when `published_at` is set). Internal
  `reviews` and `provisional` decisions are never selected in participant code paths.
- Organizer routes require a row in `organizer_memberships`; being signed in is not enough. The first organizer is
  provisioned by a documented one-off SQL insert.
- Registration references are display identifiers, never credentials.

## Environment variables

| Variable                            | Scope       | Purpose                                                  |
| ----------------------------------- | ----------- | -------------------------------------------------------- |
| `NEXT_PUBLIC_VITALCRAFT_DEMO_MODE`  | public      | Explicitly enables the synthetic demo mode               |
| `VITALCRAFT_LIVE_BACKEND`           | server-only | Turns on live registration once M2–M3 are deployed       |
| Netlify Database / Identity / Blobs / AI Gateway | platform | Injected by Netlify; nothing to copy into the repo |

## Milestones

1. **Foundation, design system and public site** ✅ — Next.js + Tailwind pixel design system, original SVG/CSS
   block art, all public sections (Home, About, Tracks, Problem Statements, Timeline + countdowns + finale
   schedule, Prizes, FAQ, Footer), typed event config, structured challenge data, downloadable pitch-deck
   outline PDF, demo-mode registration (Zod-validated) and demo team dashboard.
2. **Auth, live registration and team dashboard** — Netlify Identity sign-in + confirmation callback, `teams` and
   `team_members` tables with migrations, server action that re-validates with the shared Zod schema, enforces the
   registration deadline and one-team-per-leader, generates the reference, and only redirects on a committed write.
   Same-origin checks on all mutations. Demo adapter stays isolated.
3. **Idea submission and private pitch decks** — draft/edit/final-submit flow with confirmation dialog, server-side
   deadline + lock enforcement, uploads to a private Blobs store under server-generated keys, extension/size/magic-byte
   checks (`%PDF-`; PPTX zip with `[Content_Types].xml` + `ppt/presentation.xml`, bounded entry count/size),
   replace-before-submit, orphan cleanup, and authorized short-lived downloads.
4. **Organizer review and results** — membership-gated organizer area, search by team/reference, filters by track
   and status, submission detail with deck access, internal notes, provisional decisions, explicit publish step,
   and finalist attendance confirm/decline on the team dashboard.
5. **CraftCheck (optional)** — rule-based self-reported readiness rubric scored in code (20/20/20/20/10/10 with
   0/50/100%), plus AI practice feedback via the AI Gateway on idea text only (no names, emails, members or decks),
   strict output schema validation, timeout/length limits, durable rate limiting, "outdated" marking on text
   change, and honest unavailable states. Never visible to judges and never affects selection.
6. **Tests and hardening** — focused tests (Vitest) for registration validation, persistence failure, ownership,
   unauthorized organizer access, upload validation and private access, deadlines and post-submit locks, hidden
   unpublished decisions/notes, publication, CraftCheck scoring, AI failure/invalid output; final README pass with
   organizer provisioning and an interview demo script.
