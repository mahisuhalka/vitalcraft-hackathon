"use client";

import { useEffect, useState } from "react";

interface Props {
  target: string | null;
  end?: string | null;
  label: string;
  /** Shown once the target has passed (and the optional end has passed too). */
  pastMessage: string;
  /** Shown between target and end, when an end is configured. */
  liveMessage?: string;
}

function diff(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  return {
    days: Math.floor(s / 86400),
    hours: Math.floor((s % 86400) / 3600),
    minutes: Math.floor((s % 3600) / 60),
    seconds: s % 60,
  };
}

/**
 * Countdown that only renders for a valid configured date, and degrades
 * gracefully once the target has passed. Server render shows placeholders
 * to avoid hydration mismatch.
 */
export function Countdown({ target, end, label, pastMessage, liveMessage }: Props) {
  const targetMs = target ? new Date(target).getTime() : NaN;
  const endMs = end ? new Date(end).getTime() : NaN;
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  if (!target || Number.isNaN(targetMs)) return null;

  if (now !== null && now >= targetMs) {
    const live = !Number.isNaN(endMs) && now < endMs;
    return (
      <div className="vc-slot px-4 py-3 text-center" role="status">
        <p className="font-display text-lg font-bold text-emerald">{live && liveMessage ? liveMessage : pastMessage}</p>
      </div>
    );
  }

  const parts = now === null ? null : diff(targetMs - now);
  const cells: [string, number | undefined][] = [
    ["Days", parts?.days],
    ["Hours", parts?.hours],
    ["Mins", parts?.minutes],
    ["Secs", parts?.seconds],
  ];

  return (
    <div>
      <p className="sr-only" aria-live="off">
        {parts ? `${label}: ${parts.days} days, ${parts.hours} hours, ${parts.minutes} minutes remaining.` : label}
      </p>
      <ol className="grid grid-cols-4 gap-2" aria-hidden="true">
        {cells.map(([name, value]) => (
          <li key={name} className="vc-slot flex flex-col items-center px-1 py-2.5">
            <span className="font-pixel text-base text-gold tabular-nums sm:text-xl">
              {value === undefined ? "--" : String(value).padStart(2, "0")}
            </span>
            <span className="mt-1.5 font-display text-[11px] uppercase tracking-widest text-muted">{name}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
