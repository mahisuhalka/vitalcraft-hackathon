import { EVENT } from "@/config/event";
import { SectionHeading, StatusBadge } from "@/components/Badges";
import { Sprite, type SpriteName } from "@/components/PixelArt";

const PILLARS: { icon: SpriteName; title: string; body: string }[] = [
  {
    icon: "hourglass",
    title: "A 24-hour finale",
    body: "Shortlisted teams spend 24 hours at BMSIT&M building, testing and demonstrating a working prototype — in hardware or software.",
  },
  {
    icon: "heart",
    title: "Team problem solving",
    body: `Teams of ${EVENT.teamSize.value.min}–${EVENT.teamSize.value.max} pick a challenge or propose their own, then scope an MVP they can realistically demo.`,
  },
  {
    icon: "emerald",
    title: "Blocks are the theme",
    body: "The pixel world is VitalCraft's visual identity. Your project does not need to be built in, or related to, any game.",
  },
];

export function About() {
  return (
    <section id="about" aria-labelledby="about-title" className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
      <SectionHeading id="about-title" eyebrow="About the event" title="What is VitalCraft?">
        <p>
          VitalCraft is a {EVENT.format} organized by {EVENT.organizer}. It brings together student builders to engineer
          practical, useful prototypes — from sensor-driven devices to accessible software platforms.
        </p>
      </SectionHeading>

      <ul className="grid gap-5 md:grid-cols-3">
        {PILLARS.map((p) => (
          <li key={p.title} className="vc-panel vc-card p-6" data-reveal>
            <div className="vc-slot inline-flex p-2.5">
              <Sprite name={p.icon} size={32} />
            </div>
            <h3 className="mt-4 text-2xl font-bold text-parchment">{p.title}</h3>
            <p className="mt-2 text-muted">{p.body}</p>
          </li>
        ))}
      </ul>

      {/* Journey as a crafting recipe */}
      <div className="vc-panel mt-10 p-6 sm:p-8" data-reveal>
        <div className="flex flex-wrap items-center gap-3">
          <h3 className="font-display text-xl font-bold text-parchment">The proposed event journey</h3>
          <StatusBadge status={EVENT.journey.status} />
        </div>
        <p className="mt-2 text-sm text-muted">{EVENT.journey.note}</p>
        <ol className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {EVENT.journey.value.map((step, i) => (
            <li key={step} className="relative">
              <div className="vc-slot flex h-full items-center gap-3 p-3 lg:flex-col lg:items-start">
                <span className="font-pixel text-sm text-gold" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="font-display text-lg font-semibold leading-tight text-ink">
                  <span className="sr-only">Step {i + 1}: </span>
                  {step}
                </span>
              </div>
              {i < EVENT.journey.value.length - 1 ? (
                <span
                  className="absolute -right-3 top-1/2 z-10 hidden -translate-y-1/2 font-pixel text-xs text-emerald lg:block"
                  aria-hidden="true"
                >
                  ▶
                </span>
              ) : null}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
