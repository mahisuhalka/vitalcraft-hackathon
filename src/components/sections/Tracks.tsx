import Link from "next/link";
import { SectionHeading } from "@/components/Badges";
import { Sprite } from "@/components/PixelArt";

const TRACKS = [
  {
    id: "hardware",
    name: "Hardware Track",
    sprite: "chip" as const,
    accent: "text-gold",
    tint: "bg-[linear-gradient(160deg,#2b2112_0%,#1e1b18_55%)]",
    pitch: "Wire it, flash it, make it move. Build a physical prototype you can hold and demo.",
    directions: ["Embedded systems", "IoT", "Assistive devices", "Sensors and physical prototypes"],
  },
  {
    id: "software",
    name: "Software Track",
    sprite: "monitor" as const,
    accent: "text-diamond",
    tint: "bg-[linear-gradient(160deg,#0f2a2c_0%,#1e1b18_55%)]",
    pitch: "Ship a working tool people could actually use. Clean flows beat feature lists.",
    directions: ["Web and mobile applications", "AI and data tools", "Accessibility solutions", "Useful software platforms"],
  },
];

export function Tracks() {
  return (
    <section id="tracks" aria-labelledby="tracks-title" className="border-y-3 border-black bg-bedrock/70">
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
        <SectionHeading id="tracks-title" eyebrow="Two tracks" title="Pick your crafting table">
          <p>
            These are illustrative directions, not restrictions. Choose the track that matches what you plan to demo —
            projects don&apos;t have to be biomedical.
          </p>
        </SectionHeading>

        <div className="grid gap-6 lg:grid-cols-2">
          {TRACKS.map((t) => (
            <article key={t.id} className={`vc-panel vc-card group flex flex-col p-6 sm:p-8 ${t.tint}`} data-reveal aria-labelledby={`track-${t.id}`}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className={`font-display text-sm font-bold uppercase tracking-[0.2em] ${t.accent}`}>Track</p>
                  <h3 id={`track-${t.id}`} className="mt-1 text-3xl font-bold text-parchment sm:text-4xl">
                    {t.name}
                  </h3>
                </div>
                <div className="vc-slot p-3 transition-transform group-hover:-translate-y-1">
                  <Sprite name={t.sprite} size={56} />
                </div>
              </div>
              <p className="mt-4 text-lg text-ink">{t.pitch}</p>
              <ul className="mt-6 grid flex-1 gap-2 sm:grid-cols-2">
                {t.directions.map((d) => (
                  <li key={d} className="vc-slot flex items-center gap-3 px-3 py-2.5">
                    <span className={`inline-block h-2.5 w-2.5 shrink-0 ${t.id === "hardware" ? "bg-gold" : "bg-diamond"}`} aria-hidden="true" />
                    <span className="font-semibold">{d}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <Link href={`/register?track=${t.id}`} className={`vc-btn ${t.id === "hardware" ? "vc-btn-gold" : "vc-btn-diamond"}`}>
                  Choose this track <span className="sr-only">: {t.name}</span>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
