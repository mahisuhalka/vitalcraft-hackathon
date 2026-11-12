import { EVENT } from "@/config/event";
import { SectionHeading, StatusBadge } from "@/components/Badges";
import { Sprite } from "@/components/PixelArt";
import { formatMoney } from "@/lib/format";

const TIER_SPRITE = { winner: "gem", "runner-up": "emerald", hardware: "chip", software: "monitor" } as const;

export function Prizes() {
  const { pool, split } = EVENT.prizes;
  const total = split.value.reduce((s, t) => s + t.amount, 0);
  return (
    <section id="prizes" aria-labelledby="prizes-title" className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
      <SectionHeading id="prizes-title" eyebrow="Prizes" title="50k Prize pool and rewards" />

      <div className="grid gap-8 lg:grid-cols-[1fr_1.4fr] lg:items-stretch">
        <div className="vc-panel relative flex flex-col items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_50%_40%,#3a2f12_0%,#1e1b18_65%)] p-8 text-center" data-reveal>
          <Sprite name="chest" size={160} className="animate-bob drop-shadow-[6px_6px_0_rgba(0,0,0,0.6)]" />
          <p className="mt-6 font-display text-sm uppercase tracking-[0.25em] text-muted">Total prize pool</p>
          <p className="mt-2 font-pixel text-3xl text-gold sm:text-4xl">{formatMoney(pool.value)}</p>
          <StatusBadge status={pool.status} className="mt-4" />
        </div>

        <div data-reveal>
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <h3 className="font-display text-xl font-bold text-parchment">How the chest could be split</h3>
            <StatusBadge status={split.status} />
          </div>
          <ul className="grid gap-4 sm:grid-cols-2">
            {split.value.map((tier) => (
              <li key={tier.id} className="vc-panel vc-card flex items-start gap-4 p-5">
                <div className="vc-slot shrink-0 p-2">
                  <Sprite name={TIER_SPRITE[tier.id as keyof typeof TIER_SPRITE] ?? "gem"} size={32} />
                </div>
                <div>
                  <h4 className="font-display text-lg font-bold text-parchment">{tier.title}</h4>
                  <p className="font-pixel text-sm leading-7 text-gold">{formatMoney(tier.amount)}</p>
                  <p className="text-sm text-muted">{tier.description}</p>
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-muted">
            {split.note} Proposed tiers add up to {formatMoney(total)}. No other rewards or benefits have been announced.
          </p>
        </div>
      </div>
    </section>
  );
}
