import { SectionHeading } from "@/components/Badges";
import { FAQ } from "@/data/faq";
import { EVENT } from "@/config/event";

export function Faq() {
  return (
    <section id="faq" aria-labelledby="faq-title" className="border-t-3 border-black bg-bedrock/70">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-24 sm:px-6 lg:grid-cols-[1fr_1.6fr]">
        <div>
          <SectionHeading id="faq-title" eyebrow="FAQ" title="Questions, answered">
            <p>Anything not covered here hasn&apos;t been confirmed yet and will be announced.</p>
          </SectionHeading>
          <div className="vc-panel p-5" data-reveal>
            <h3 className="font-display text-lg font-bold text-parchment">Suggested pitch-deck outline</h3>
            <p className="mt-1 text-sm text-muted">A one-page PDF with the seven slides reviewers will look for.</p>
            <a href={EVENT.pitchDeck.outlineUrl} download className="vc-btn vc-btn-gold vc-btn-sm mt-4">
              Download outline (PDF)
            </a>
          </div>
        </div>
        <div className="space-y-3" data-reveal>
          {FAQ.map((item) => (
            <details key={item.id} className="vc-panel group">
              <summary className="flex min-h-14 items-center justify-between gap-4 px-5 py-4">
                <span className="font-display text-lg font-bold text-parchment">{item.question}</span>
                <span
                  className="flex h-7 w-7 shrink-0 items-center justify-center border-2 border-black bg-panel-2 font-pixel text-xs text-emerald group-open:bg-emerald-deep group-open:text-white"
                  aria-hidden="true"
                >
                  <span className="group-open:hidden">+</span>
                  <span className="hidden group-open:inline">−</span>
                </span>
              </summary>
              <div className="space-y-3 border-t-3 border-black px-5 pb-5 pt-4 text-[16px] text-ink">
                {item.answer.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
