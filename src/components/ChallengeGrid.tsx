"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { CHALLENGES, ILLUSTRATIVE_LABEL, OPEN_INNOVATION, type Challenge } from "@/data/challenges";
import { Sprite } from "@/components/PixelArt";
import { TrackBadge } from "@/components/Badges";

type Filter = "all" | "hardware" | "software";

function registerHref(c: Challenge) {
  const params = new URLSearchParams({ challenge: c.id });
  if (c.track !== "open") params.set("track", c.track);
  return `/register?${params.toString()}`;
}

export function ChallengeGrid() {
  const [filter, setFilter] = useState<Filter>("all");
  const [selected, setSelected] = useState<Challenge | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    if (selected && !d.open) d.showModal();
    if (!selected && d.open) d.close();
  }, [selected]);

  const open = (c: Challenge, e: React.MouseEvent<HTMLElement>) => {
    openerRef.current = e.currentTarget;
    setSelected(c);
  };
  const close = () => {
    setSelected(null);
    openerRef.current?.focus();
  };

  const list = CHALLENGES.filter((c) => filter === "all" || c.track === filter);
  const filters: { id: Filter; label: string }[] = [
    { id: "all", label: `All (${CHALLENGES.length})` },
    { id: "hardware", label: "Hardware" },
    { id: "software", label: "Software" },
  ];

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center gap-2" role="group" aria-label="Filter problem statements by track">
        {filters.map((f) => (
          <button
            key={f.id}
            type="button"
            aria-pressed={filter === f.id}
            onClick={() => setFilter(f.id)}
            className={`vc-btn vc-btn-sm ${filter === f.id ? "vc-btn-primary" : ""}`}
            data-pressed={filter === f.id}
          >
            {f.label}
          </button>
        ))}
        <p className="ml-auto text-sm text-muted" aria-live="polite">
          Showing {list.length} illustrative challenge{list.length === 1 ? "" : "s"}
        </p>
      </div>

      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((c) => (
          <li key={c.id} className="vc-panel vc-card flex flex-col p-5">
            <div className="mb-3 flex items-start justify-between gap-3">
              <TrackBadge track={c.track} />
              <Sprite name={c.track === "hardware" ? "chip" : "monitor"} size={26} />
            </div>
            <h3 className="text-xl font-bold text-parchment">{c.title}</h3>
            <p className="mt-2 flex-1 text-[15px] text-muted">{c.summary}</p>
            <p className="mt-4 text-xs italic text-stone-light">{ILLUSTRATIVE_LABEL}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <button type="button" className="vc-btn vc-btn-sm" onClick={(e) => open(c, e)} aria-haspopup="dialog">
                View details
              </button>
              <Link href={registerHref(c)} className="vc-btn vc-btn-sm vc-btn-primary">
                Choose this challenge
              </Link>
            </div>
          </li>
        ))}
      </ul>

      {/* Open innovation */}
      <div className="vc-panel mt-8 grid items-center gap-6 bg-[#132a1c] p-6 md:grid-cols-[auto_1fr_auto]" data-reveal>
        <Sprite name="bulb" size={56} />
        <div>
          <TrackBadge track="open" />
          <h3 className="mt-2 text-2xl font-bold text-parchment">{OPEN_INNOVATION.title}</h3>
          <p className="mt-2 max-w-2xl text-muted">{OPEN_INNOVATION.summary}</p>
        </div>
        <div className="flex flex-wrap gap-2 md:flex-col">
          <button type="button" className="vc-btn vc-btn-sm" onClick={(e) => open(OPEN_INNOVATION, e)} aria-haspopup="dialog">
            View details
          </button>
          <Link href={registerHref(OPEN_INNOVATION)} className="vc-btn vc-btn-sm vc-btn-primary">
            Choose this challenge
          </Link>
        </div>
      </div>

      <dialog
        ref={dialogRef}
        aria-labelledby="challenge-dialog-title"
        onClose={() => selected && close()}
        onClick={(e) => {
          if (e.target === dialogRef.current) close();
        }}
        className="vc-panel fixed inset-0 m-auto h-fit w-[min(42rem,calc(100vw-2rem))] max-h-[calc(100dvh-2rem)] overflow-y-auto p-0 text-ink backdrop:bg-black/70"
      >
        {selected ? (
          <div className="p-6 sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <TrackBadge track={selected.track} />
              <button type="button" onClick={close} className="vc-btn vc-btn-sm" aria-label="Close details">
                ×
              </button>
            </div>
            <h2 id="challenge-dialog-title" className="mt-4 text-2xl font-bold text-parchment sm:text-3xl">
              {selected.title}
            </h2>
            <p className="mt-3 text-[16px] leading-relaxed">{selected.description}</p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <section className="vc-slot p-4" aria-labelledby="dlg-users">
                <h3 id="dlg-users" className="font-display text-sm font-bold uppercase tracking-widest text-diamond">
                  Intended users
                </h3>
                <ul className="mt-2 list-inside list-[square] space-y-1 text-[15px]">
                  {selected.intendedUsers.map((u) => (
                    <li key={u}>{u}</li>
                  ))}
                </ul>
              </section>
              <section className="vc-slot p-4" aria-labelledby="dlg-scope">
                <h3 id="dlg-scope" className="font-display text-sm font-bold uppercase tracking-widest text-gold">
                  Suggested prototype scope
                </h3>
                <ul className="mt-2 list-inside list-[square] space-y-1 text-[15px]">
                  {selected.prototypeScope.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              </section>
            </div>

            <p className="mt-5 text-sm italic text-muted">{ILLUSTRATIVE_LABEL}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href={registerHref(selected)} className="vc-btn vc-btn-primary">
                Choose this challenge
              </Link>
              <button type="button" onClick={close} className="vc-btn">
                Back to list
              </button>
            </div>
          </div>
        ) : null}
      </dialog>
    </>
  );
}
