# AGENTS.md — VitalCraft

Start every session by reading **PLAN.md** and continuing from the next unfinished milestone. Milestone 1 is done.

## Architecture
- Next.js 15 App Router + TypeScript + Tailwind CSS v4 (CSS-first config in `src/app/globals.css`), npm.
- Hosted on Netlify. Backend milestones must use Netlify primitives: Netlify Identity (auth), Netlify Database +
  Drizzle (schema in `db/schema.ts`), private Netlify Blobs (pitch decks), Netlify AI Gateway (CraftCheck).
  Put server logic in Next.js route handlers or server actions, not a separate server.
- `/` is a single server-rendered page made of section components. `/register` and `/dashboard` render the
  demo flow when `NEXT_PUBLIC_VITALCRAFT_DEMO_MODE=true`, and an honest "unavailable" state otherwise.

## Key directories
- `src/config/event.ts` — **the only place for event facts and deadlines.** Each one has a `status` of
  confirmed, proposed or tba. Never hardcode dates or amounts in components.
- `src/config/site.ts` — demo-mode flag and live-backend check. `src/config/nav.ts` — nav items (shared by server and client components; never export data from "use client" files).
- `src/data/` — structured challenge and FAQ content.
- `src/lib/validation/registration.ts` — shared Zod schema (client now, server in M2; always re-validate on the server).
- `src/lib/demo/store.ts` — isolated demo adapter (browser localStorage). Never use it as a fallback for live failures.
- `src/components/` — `PixelArt.tsx` (sprites as string grids), `Landscape.tsx` (seeded SVG terrain),
  `sections/*` (public page), `register/`, `dashboard/`, `Toast.tsx`, `Countdown.tsx`.
- `scripts/generate-outline-pdf.mjs` — dependency-free PDF generator for `public/downloads/`.

## Conventions
- Design system classes use the `vc-` prefix (`vc-panel`, `vc-slot`, `vc-btn`, `vc-btn-primary`, `vc-badge-*`,
  `vc-input`). Don't use a `px-` prefix, because it clashes with Tailwind's padding utilities.
- Use pixel fonts (`font-pixel`, `font-display`) only for short text. Body text uses `font-sans` (Atkinson Hyperlegible).
- Button text colours pass WCAG AA. Check contrast before adding new tints.
- Use native `<dialog>` (with `fixed inset-0 m-auto h-fit`, because `vc-panel` sets `position: relative`) and `<details>`
  for accessibility.
- Mark decorative art `aria-hidden` and `pointer-events-none`. Gate motion with `prefers-reduced-motion`.
- Elements with `[data-reveal]` start hidden only when JS runs (`html.js`). Don't put `data-reveal` on items that
  mount after hydration, such as filtered lists.
- Never invent sponsors, judges, contacts, fees, meals or benefits. Footer links appear only when configured.
