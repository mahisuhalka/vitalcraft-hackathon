# VitalCraft

**Craft ideas. Engineer impact.** — the website and team portal for VitalCraft, a 24-hour Hardware & Software
hackathon organized by **IEEE EMBS – BMSIT&M** (28–29 November 2026, BMSIT&M).

The site has a Minecraft-*inspired* pixel/block identity built from original CSS and SVG art. It isn't
affiliated with Mojang Studios or Microsoft and uses none of their assets.

https://vitalcraft-hackathon.netlify.app

## What works today

- **Public event site** (`/`): hero, About (with the proposed event journey), Hardware/Software tracks with
  "Choose this track", filterable problem statements with accessible detail dialogs and "Choose this challenge",
  timeline with live countdowns and an expandable proposed 24-hour schedule, prize chest, FAQ, and footer.
- **Pitch-deck outline**: a real PDF at `/downloads/vitalcraft-pitch-deck-outline.pdf`, generated locally by
  `npm run generate:outline`.
- **Demo registration** (`/register`): full registration form with Zod validation, linked field errors, an
  error summary, track/challenge preselection from query params, and a sample-data button.
- **Demo team dashboard** (`/dashboard`): team details, registration reference, track, submission status,
  deadlines, published result state and next action.

Demo mode must be turned on explicitly (`NEXT_PUBLIC_VITALCRAFT_DEMO_MODE=true`). It shows a persistent notice,
stores synthetic records only in the visitor's browser, and never submits anything. With demo mode off, `/register`
and `/dashboard` say that live registration isn't available yet, because the live backend isn't configured.

## Confirmed vs proposed details

All event facts live in `src/config/event.ts`. Each one is tagged `confirmed`, `proposed` or `tba`, and the UI
shows a matching badge.

- **Confirmed:** dates (28–29 Nov 2026), venue (BMSIT&M), ₹50,000 prize pool, registration deadline
  (15 Nov 2026), team size 3–4, two tracks.
- **Proposed:** the screening journey, the prize split, the finale run-of-show, the end-of-day IST cut-off time,
  pitch-deck formats (PDF/PPTX) and the 10 MB limit.
- **To be announced:** registration-open date, idea-submission deadline, screening and finalist-confirmation dates,
  and the finale start time.

Problem statements in `src/data/challenges.ts` are illustrative and say so on every card.

## Stack

Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · Zod · npm. Fonts come from `next/font`
(Press Start 2P for the wordmark and numbers, Pixelify Sans for headings, Atkinson Hyperlegible for body text).
The backend milestones use Netlify Identity, Netlify Database (Postgres + Drizzle), private Netlify Blobs and the
Netlify AI Gateway (see [PLAN.md](./PLAN.md)).

## Local development

```bash
npm install
cp .env.example .env.local      # demo mode on by default
npm run dev                     # http://localhost:3000
npm run typecheck               # TypeScript
npm run lint                    # ESLint
npm run build                   # production build
npm run generate:outline        # regenerate the pitch-deck outline PDF
```

Tests are added in milestone 6 (see PLAN.md).

## Environment variables

| Name | Scope | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_VITALCRAFT_DEMO_MODE` | public | `true` enables the synthetic demo mode |
| `VITALCRAFT_LIVE_BACKEND` | server-only | reserved for when the live backend ships |

Secrets are never put in `NEXT_PUBLIC_` variables.

## Deployment

The project deploys on Netlify. `netlify.toml` runs `npm run build` and turns on demo mode for this preview.

## Roadmap

These pieces are still to build: live sign-in and registration, idea submission with private pitch-deck uploads,
the organizer review and results-publishing area, the optional CraftCheck assistant, and the test suite.
[PLAN.md](./PLAN.md) covers them milestone by milestone, with the route map and data model.

## Known limitations (current milestone)

- Registration and the dashboard run on demo data only; no live sign-in or database yet.
- Idea submission is shown as unavailable until the organizers announce the submission window.
