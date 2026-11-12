"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useRef } from "react";
import { EVENT } from "@/config/event";
import { findChallenge } from "@/data/challenges";
import { clearDemoData, useDemoTeam, type SelectionDecision, type SubmissionStatus } from "@/lib/demo/store";
import { formatDate, formatRange, isPast } from "@/lib/format";
import { useToast } from "@/components/Toast";
import { Sprite } from "@/components/PixelArt";
import { StatusBadge, TrackBadge } from "@/components/Badges";

const SUBMISSION_LABEL: Record<SubmissionStatus, string> = {
  not_started: "Not started",
  draft: "Draft",
  submitted: "Submitted",
  under_review: "Under review",
};

const DECISION_LABEL: Record<SelectionDecision, string> = {
  pending: "Pending",
  shortlisted: "Shortlisted",
  waitlisted: "Waitlisted",
  not_shortlisted: "Not shortlisted",
};

export function DemoDashboard() {
  const team = useDemoTeam();
  const params = useSearchParams();
  const router = useRouter();
  const toast = useToast();
  const confirmRef = useRef<HTMLDialogElement>(null);
  const justRegistered = params.get("registered") === "1";

  if (team === undefined) {
    return (
      <div className="grid gap-6 lg:grid-cols-3" aria-busy="true" aria-label="Loading dashboard">
        <div className="vc-panel h-40 animate-pulse lg:col-span-3" />
        <div className="vc-panel h-72 animate-pulse lg:col-span-2" />
        <div className="vc-panel h-72 animate-pulse" />
      </div>
    );
  }

  if (team === null) {
    return (
      <div className="vc-panel flex flex-col items-center p-10 text-center">
        <Sprite name="chest" size={96} />
        <h2 className="mt-6 text-3xl font-bold text-parchment">No team registered in this browser</h2>
        <p className="mt-2 max-w-lg text-muted">
          Register a synthetic demo team to see the dashboard — reference, track, submission status and results.
        </p>
        <Link href="/register" className="vc-btn vc-btn-primary mt-6">
          Register a demo team
        </Link>
      </div>
    );
  }

  const challenge = findChallenge(team.challengeId);
  const ideaDeadline = EVENT.ideaSubmissionDeadline;
  const submissionWindowOpen = ideaDeadline.value !== null && !isPast(ideaDeadline.value);

  async function copyRef() {
    try {
      await navigator.clipboard.writeText(team!.reference);
      toast("Reference copied to clipboard.", "success");
    } catch {
      toast("Couldn't access the clipboard — select the reference and copy it manually.", "error");
    }
  }

  return (
    <div className="space-y-6">
      {justRegistered ? (
        <div className="vc-panel flex items-start gap-4 bg-[#10331f] p-5" role="status">
          <Sprite name="emerald" size={32} />
          <div>
            <p className="font-display text-lg font-bold text-white">Demo team registered</p>
            <p className="text-sm text-ink">
              Your synthetic registration was saved in this browser. This is a simulation: nothing was sent to the
              organizers and no confirmation email was sent.
            </p>
          </div>
        </div>
      ) : null}

      {/* Header card */}
      <section className="vc-panel grid gap-6 p-6 sm:p-8 md:grid-cols-[1fr_auto] md:items-center" aria-labelledby="team-title">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <TrackBadge track={team.track} />
            <span className="vc-badge vc-badge-tba">Demo record</span>
          </div>
          <h2 id="team-title" className="mt-3 text-3xl font-bold text-parchment sm:text-4xl">
            {team.teamName}
          </h2>
          <p className="mt-1 text-muted">{team.college}</p>
        </div>
        <div className="vc-slot p-4">
          <p className="font-display text-xs uppercase tracking-widest text-muted">Registration reference</p>
          <div className="mt-2 flex items-center gap-3">
            <span className="font-pixel text-sm text-gold sm:text-base">{team.reference}</span>
            <button type="button" className="vc-btn vc-btn-sm" onClick={copyRef}>
              Copy
            </button>
          </div>
          <p className="mt-2 text-xs text-muted">For your records only — it is not a password.</p>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Next action */}
        <section className="vc-panel p-6 lg:col-span-2" aria-labelledby="next-title">
          <p className="vc-eyebrow">Next required action</p>
          <h2 id="next-title" className="mt-2 text-2xl font-bold text-parchment">
            Prepare your idea and pitch deck
          </h2>
          <p className="mt-2 text-muted">
            {submissionWindowOpen
              ? `Submit your idea before ${formatDate(ideaDeadline.value)}.`
              : "The idea-submission window hasn't been announced yet. Use the time to shape your problem, users and 24-hour MVP."}
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="button"
              className="vc-btn vc-btn-primary"
              aria-disabled="true"
              aria-describedby="idea-unavailable"
              onClick={() => toast("Idea submission opens once organizers announce the submission window.", "info")}
            >
              Start idea draft
            </button>
            <a href={EVENT.pitchDeck.outlineUrl} download className="vc-btn vc-btn-gold">
              Download pitch-deck outline
            </a>
          </div>
          <p id="idea-unavailable" className="mt-3 text-sm text-muted">
            Idea drafting is unavailable until the submission window is announced (deadline: {formatDate(ideaDeadline.value)}).
          </p>

          <dl className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="vc-slot p-4">
              <dt className="font-display text-xs uppercase tracking-widest text-muted">Idea submission</dt>
              <dd className="mt-1 font-display text-xl font-bold text-parchment">{SUBMISSION_LABEL[team.submissionStatus]}</dd>
            </div>
            <div className="vc-slot p-4">
              <dt className="font-display text-xs uppercase tracking-widest text-muted">Selection result</dt>
              <dd className="mt-1 font-display text-xl font-bold text-parchment">
                {team.publishedDecision ? DECISION_LABEL[team.publishedDecision] : "Not yet published"}
              </dd>
              <dd className="mt-1 text-xs text-muted">Results appear here only after organizers publish them.</dd>
            </div>
          </dl>
        </section>

        {/* Deadlines */}
        <section className="vc-panel p-6" aria-labelledby="deadlines-title">
          <div className="flex items-center gap-3">
            <Sprite name="hourglass" size={22} />
            <h2 id="deadlines-title" className="font-display text-xl font-bold text-parchment">
              Deadlines
            </h2>
          </div>
          <ul className="mt-4 space-y-3">
            {[
              { label: "Registration closes", date: formatDate(EVENT.registrationDeadline.value), status: EVENT.registrationDeadline.status },
              { label: "Idea & pitch deck", date: formatDate(ideaDeadline.value), status: ideaDeadline.status },
              {
                label: "Grand Finale",
                date: formatRange(EVENT.finale.start.value, EVENT.finale.end.value),
                status: EVENT.finale.start.status,
              },
            ].map((d) => (
              <li key={d.label} className="vc-slot p-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-bold">{d.label}</span>
                  <StatusBadge status={d.status} />
                </div>
                <p className="mt-1 font-display text-diamond">{d.date}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* Team details */}
      <section className="vc-panel p-6" aria-labelledby="details-title">
        <h2 id="details-title" className="font-display text-xl font-bold text-parchment">
          Team details
        </h2>
        <dl className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Item label="Leader" value={team.leaderName} />
          <Item label="Leader email" value={team.leaderEmail} />
          <Item label="Team size" value={`${team.teamSize} members`} />
          <Item label="Challenge" value={challenge ? challenge.title : "Decide later"} />
        </dl>
        <h3 className="mt-6 font-display text-sm font-bold uppercase tracking-widest text-muted">Members</h3>
        <ul className="mt-2 flex flex-wrap gap-2">
          <li className="vc-slot px-3 py-1.5">{team.leaderName} (leader)</li>
          {team.members.map((m, i) => (
            <li key={i} className="vc-slot px-3 py-1.5">
              {m}
            </li>
          ))}
        </ul>
      </section>

      <div className="flex flex-wrap items-center justify-between gap-4 border-t-3 border-black pt-6">
        <p className="text-sm text-muted">Demo records live only in this browser.</p>
        <button type="button" className="vc-btn vc-btn-sm" onClick={() => confirmRef.current?.showModal()}>
          Clear demo data
        </button>
      </div>

      <dialog ref={confirmRef} aria-labelledby="clear-title" className="vc-panel fixed inset-0 m-auto h-fit w-[min(28rem,calc(100vw-2rem))] p-6 text-ink">
        <h2 id="clear-title" className="text-2xl font-bold text-parchment">
          Clear demo data?
        </h2>
        <p className="mt-2 text-muted">This removes the synthetic team from this browser. It can&apos;t be undone.</p>
        <form method="dialog" className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            className="vc-btn vc-btn-primary"
            onClick={() => {
              clearDemoData();
              confirmRef.current?.close();
              toast("Demo data cleared.", "info");
              router.replace("/dashboard");
            }}
          >
            Yes, clear it
          </button>
          <button type="submit" className="vc-btn" autoFocus>
            Cancel
          </button>
        </form>
      </dialog>
    </div>
  );
}

function Item({ label, value }: { label: string; value: string }) {
  return (
    <div className="vc-slot p-3">
      <dt className="font-display text-xs uppercase tracking-widest text-muted">{label}</dt>
      <dd className="mt-1 break-words font-bold text-ink">{value}</dd>
    </div>
  );
}
