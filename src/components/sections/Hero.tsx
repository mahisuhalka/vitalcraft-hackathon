import Link from "next/link";
import { EVENT } from "@/config/event";
import { Landscape, PixelClouds } from "@/components/Landscape";
import { Sprite } from "@/components/PixelArt";
import { StatusBadge } from "@/components/Badges";
import { formatDate, formatMoney } from "@/lib/format";

const STARS = Array.from({ length: 28 }, (_, i) => ({
  left: `${(i * 37) % 100}%`,
  top: `${(i * 53) % 60}%`,
  size: i % 5 === 0 ? 4 : 2,
}));

export function Hero() {
  const facts = [
    { label: "Grand Finale", value: EVENT.finale.displayDates, status: EVENT.finale.start.status },
    { label: "Venue", value: EVENT.venue.value, status: EVENT.venue.status },
    { label: "Prize pool", value: formatMoney(EVENT.prizes.pool.value), status: EVENT.prizes.pool.status },
    { label: "Register by", value: formatDate(EVENT.registrationDeadline.value), status: EVENT.registrationDeadline.status },
  ];

  return (
    <section
      id="home"
      aria-labelledby="hero-title"
      className="relative isolate overflow-hidden border-b-3 border-black bg-[linear-gradient(180deg,#0b1220_0%,#101a26_45%,#14201a_75%,#0e0d0c_100%)]"
    >
      {/* Decorative sky */}
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
        {STARS.map((s, i) => (
          <span
            key={i}
            className="absolute bg-parchment/60"
            style={{ left: s.left, top: s.top, width: s.size, height: s.size }}
          />
        ))}
        <div className="absolute right-[8%] top-16 h-16 w-16 bg-parchment/90 shadow-[0_0_0_8px_rgba(242,234,216,0.08),0_0_0_16px_rgba(242,234,216,0.04)] sm:h-20 sm:w-20">
          <span className="absolute left-3 top-3 h-3 w-3 bg-[#d8ceb6]" />
          <span className="absolute bottom-4 right-3 h-4 w-4 bg-[#d8ceb6]" />
        </div>
      </div>
      <PixelClouds />

      <div className="relative mx-auto grid max-w-7xl gap-12 px-4 pb-56 pt-16 sm:px-6 sm:pt-20 lg:grid-cols-[1.25fr_1fr] lg:items-center lg:pb-64">
        <div>
          <p className="inline-flex animate-rise items-center gap-2 border-2 border-black bg-black/40 px-3 py-1.5 font-display text-sm font-semibold uppercase tracking-[0.18em] text-diamond">
            <Sprite name="heart" size={16} />
            {EVENT.organizer} presents
          </p>
          <h1 id="hero-title" className="vc-wordmark mt-6 animate-rise text-[2.1rem] [animation-delay:80ms] min-[400px]:text-5xl sm:text-6xl lg:text-7xl">
            VitalCraft
          </h1>
          <p className="mt-6 max-w-xl animate-rise font-display text-2xl font-bold text-parchment [animation-delay:160ms] sm:text-3xl">
            {EVENT.heroHeadline}
          </p>
          <p className="mt-4 max-w-xl animate-rise text-lg text-muted [animation-delay:220ms]">
            A {EVENT.format.toLowerCase()} where teams of {EVENT.teamSize.value.min}–{EVENT.teamSize.value.max} turn real
            problems into working prototypes. {EVENT.tagline}
          </p>

          <ul className="mt-6 flex animate-rise flex-wrap gap-3 [animation-delay:260ms]" aria-label="Tracks">
            <li className="vc-badge vc-badge-hardware px-3 py-1 text-sm">
              <Sprite name="chip" size={18} /> Hardware track
            </li>
            <li className="vc-badge vc-badge-software px-3 py-1 text-sm">
              <Sprite name="monitor" size={18} /> Software track
            </li>
          </ul>

          <div className="mt-8 flex animate-rise flex-wrap gap-4 [animation-delay:320ms]">
            <Link href="/register" className="vc-btn vc-btn-primary px-6 py-3.5 text-base">
              Register Your Team
            </Link>
            <a href="#challenges" className="vc-btn px-6 py-3.5 text-base">
              Explore Problem Statements
            </a>
          </div>
        </div>

        {/* Quest card */}
        <aside className="vc-panel animate-rise p-5 [animation-delay:200ms] sm:p-6" aria-labelledby="quest-card-title">
          <div className="flex items-center justify-between gap-3 border-b-3 border-black pb-3">
            <h2 id="quest-card-title" className="font-display text-lg font-bold uppercase tracking-widest text-gold">
              Quest details
            </h2>
            <Sprite name="hourglass" size={22} className="animate-bob" />
          </div>
          <dl className="mt-4 grid gap-2.5">
            {facts.map((f) => (
              <div key={f.label} className="vc-slot flex flex-wrap items-center justify-between gap-x-3 gap-y-1 px-3 py-2.5">
                <dt className="font-display text-sm uppercase tracking-wider text-muted">{f.label}</dt>
                <dd className="flex items-center gap-2 font-bold text-parchment">
                  {f.value}
                </dd>
              </div>
            ))}
          </dl>
          <p className="mt-4 flex flex-wrap items-center gap-2 text-sm text-muted">
            <StatusBadge status="confirmed" /> details above are confirmed by the organizers.
          </p>
        </aside>
      </div>

      <Landscape seed={7} id="hero" className="absolute inset-x-0 bottom-0 h-48 w-full sm:h-56 lg:h-64" />
    </section>
  );
}
