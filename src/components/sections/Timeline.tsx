import { EVENT } from "@/config/event";
import { SectionHeading, StatusBadge } from "@/components/Badges";
import { Countdown } from "@/components/Countdown";
import { Sprite } from "@/components/PixelArt";
import { formatDate, formatHour, formatRange } from "@/lib/format";

export function Timeline() {
  const schedule = EVENT.finaleSchedule;
  return (
    <section id="timeline" aria-labelledby="timeline-title" className="border-y-3 border-black bg-bedrock/70">
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
        <SectionHeading id="timeline-title" eyebrow="Timeline" title="The road to the Grand Finale">
          <p>
            Dates marked <em className="not-italic text-ink">To be announced</em> will be published by the organizers.
          </p>
        </SectionHeading>

        <div className="grid gap-8 lg:grid-cols-[1fr_1.3fr]">
          <div className="space-y-6">
            <div className="vc-panel p-6" data-reveal>
              <div className="flex items-center gap-3">
                <Sprite name="hourglass" size={26} />
                <h3 className="font-display text-xl font-bold text-parchment">Countdown to the finale</h3>
              </div>
              <p className="mt-1 text-sm text-muted">
                {EVENT.finale.displayDates} · {EVENT.venue.value}. {EVENT.finale.start.note} Counting to 00:00 IST.
              </p>
              <div className="mt-4">
                <Countdown target={EVENT.finale.start.value} end={EVENT.finale.end.value} label="Time until the Grand Finale"
                  liveMessage="The Grand Finale is underway — follow updates on this website."
                  pastMessage="The Grand Finale has concluded. Thank you to every team that crafted with us."
                />
              </div>
            </div>

            <div className="vc-panel p-6" data-reveal>
              <div className="flex items-center gap-3">
                <Sprite name="scroll" size={26} />
                <h3 className="font-display text-xl font-bold text-parchment">Registration deadline</h3>
              </div>
              <p className="mt-1 text-sm text-muted">{formatDate(EVENT.registrationDeadline.value)}. {EVENT.registrationDeadline.note}</p>
              <div className="mt-4">
                <Countdown target={EVENT.registrationDeadline.value} label="Time until registration closes"
                  pastMessage="Registration has closed."
                />
              </div>
            </div>
          </div>

          <ol className="relative space-y-4 border-l-4 border-dashed border-stone pl-6 sm:pl-8" data-reveal>
            {EVENT.timeline.map((stage, i) => (
              <li key={stage.id} className="relative">
                <span
                  className={`absolute -left-[38px] top-4 h-5 w-5 border-3 border-black sm:-left-[46px] ${
                    stage.date.status === "confirmed" ? "bg-emerald" : "bg-stone"
                  }`}
                  aria-hidden="true"
                />
                <div className="vc-panel vc-card p-4 sm:p-5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-xl font-bold text-parchment">
                      <span className="mr-2 font-pixel text-xs text-gold" aria-hidden="true">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {stage.title}
                    </h3>
                    <StatusBadge status={stage.date.status} />
                  </div>
                  <p className="mt-1 font-display text-lg text-diamond">{formatRange(stage.date.value, stage.endDate)}</p>
                  <p className="mt-1 text-[15px] text-muted">{stage.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <details className="vc-panel group mt-10" data-reveal>
          <summary className="flex min-h-14 items-center justify-between gap-4 px-5 py-4 sm:px-6">
            <span className="flex flex-wrap items-center gap-3">
              <span className="font-display text-xl font-bold text-parchment">Proposed 24-hour finale schedule</span>
              <StatusBadge status={schedule.status} />
            </span>
            <span className="font-pixel text-sm text-emerald transition-transform group-open:rotate-90" aria-hidden="true">
              ▶
            </span>
          </summary>
          <div className="border-t-3 border-black px-5 pb-6 pt-4 sm:px-6">
            <p className="text-sm text-muted">{schedule.note}</p>
            <ol className="mt-4 grid gap-2 md:grid-cols-2">
              {schedule.value.map((item) => (
                <li key={item.hour} className="vc-slot flex gap-4 p-3">
                  <span className="w-20 shrink-0 font-pixel text-xs leading-6 text-gold">{formatHour(item.hour)}</span>
                  <span>
                    <span className="block font-bold text-ink">{item.title}</span>
                    <span className="block text-sm text-muted">{item.detail}</span>
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </details>
      </div>
    </section>
  );
}
