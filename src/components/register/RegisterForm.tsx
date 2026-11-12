"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { EVENT, type TrackId } from "@/config/event";
import { CHALLENGES, OPEN_INNOVATION } from "@/data/challenges";
import { registrationSchema, toFieldErrors, type FieldErrors } from "@/lib/validation/registration";
import { SAMPLE_REGISTRATION, clearDemoData, saveDemoRegistration, useDemoTeam } from "@/lib/demo/store";
import { useToast } from "@/components/Toast";
import { Sprite } from "@/components/PixelArt";

const { min, max } = EVENT.teamSize.value;
const SIZES = Array.from({ length: max - min + 1 }, (_, i) => min + i);

interface Props {
  initialTrack?: TrackId;
  initialChallengeId?: string;
  deadlinePassed: boolean;
}

interface FormState {
  teamName: string;
  leaderName: string;
  leaderEmail: string;
  college: string;
  track: TrackId | "";
  challengeId: string;
  teamSize: number;
  members: string[];
  consent: boolean;
}

export function RegisterForm({ initialTrack, initialChallengeId, deadlinePassed }: Props) {
  const router = useRouter();
  const toast = useToast();
  const existing = useDemoTeam();
  const uid = "reg";
  const summaryRef = useRef<HTMLDivElement>(null);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [saveError, setSaveError] = useState<string | null>(null);

  const initialChallengeTrack = CHALLENGES.find((c) => c.id === initialChallengeId)?.track;
  const [form, setForm] = useState<FormState>({
    teamName: "",
    leaderName: "",
    leaderEmail: "",
    college: "",
    track: initialTrack ?? (initialChallengeTrack === "hardware" || initialChallengeTrack === "software" ? initialChallengeTrack : ""),
    challengeId: initialChallengeId ?? "",
    teamSize: min,
    members: Array(min - 1).fill(""),
    consent: false,
  });

  // Keep member inputs in sync with team size.
  useEffect(() => {
    setForm((f) => {
      const need = f.teamSize - 1;
      if (f.members.length === need) return f;
      return { ...f, members: Array.from({ length: need }, (_, i) => f.members[i] ?? "") };
    });
  }, [form.teamSize]);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key as string]) setErrors((e) => ({ ...e, [key as string]: undefined }));
  };

  const fid = (name: string) => `${uid}-${name}`;
  const err = (name: string) => errors[name];
  const describedBy = (name: string, hint?: boolean) =>
    [hint ? `${fid(name)}-hint` : null, err(name) ? `${fid(name)}-error` : null].filter(Boolean).join(" ") || undefined;

  // Challenge must match track (Open Innovation fits both).
  const challengeOptions = CHALLENGES.filter((c) => !form.track || c.track === form.track);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaveError(null);
    const parsed = registrationSchema.safeParse({
      ...form,
      track: form.track || undefined,
      challengeId: form.challengeId || undefined,
    });
    if (!parsed.success) {
      const fe = toFieldErrors(parsed.error);
      setErrors(fe);
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }
    setErrors({});
    setSubmitting(true);
    const result = saveDemoRegistration(parsed.data);
    if (!result.ok) {
      // Never report success when persistence fails.
      setSaveError(result.error);
      setSubmitting(false);
      toast(result.error, "error");
      return;
    }
    toast(`Demo team saved — reference ${result.team.reference}. (Simulated; nothing was submitted.)`, "success");
    router.push("/dashboard?registered=1");
  }

  function fillSample() {
    setForm((f) => ({
      ...f,
      ...SAMPLE_REGISTRATION,
      members: [...SAMPLE_REGISTRATION.members],
      track: f.track || "software",
    }));
    setErrors({});
    toast("Filled with synthetic sample data.", "info");
  }

  if (existing === undefined) {
    return <div className="vc-panel h-96 animate-pulse" aria-busy="true" aria-label="Loading registration form" />;
  }

  if (existing) {
    return (
      <div className="vc-panel p-8" role="status">
        <h2 className="text-2xl font-bold text-parchment">This browser already has a demo team</h2>
        <p className="mt-2 max-w-2xl text-muted">
          One team leader manages one team. <strong className="text-ink">{existing.teamName}</strong> is registered with
          reference <span className="font-pixel text-xs text-gold">{existing.reference}</span>.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/dashboard" className="vc-btn vc-btn-primary">
            Open team dashboard
          </Link>
          <button
            type="button"
            className="vc-btn"
            onClick={() => {
              clearDemoData();
              toast("Demo data cleared from this browser.", "info");
            }}
          >
            Clear demo data &amp; start over
          </button>
        </div>
      </div>
    );
  }

  const errorEntries = Object.entries(errors).filter(([, v]) => v);

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-8 lg:grid-cols-[1fr_18rem]" aria-describedby={`${uid}-demo-note`}>
      <div className="space-y-8">
        {errorEntries.length > 0 ? (
          <div ref={summaryRef} tabIndex={-1} className="vc-panel border-redstone bg-[#2a1210] p-5" role="alert">
            <h2 className="font-display text-lg font-bold text-[#ff8b82]">
              Fix {errorEntries.length} field{errorEntries.length === 1 ? "" : "s"} to continue
            </h2>
            <ul className="mt-2 list-inside list-[square] space-y-1 text-sm">
              {errorEntries.map(([key, msg]) => (
                <li key={key}>
                  <a href={`#${fid(key.startsWith("members") ? key.replace(".", "-") : key)}`} className="underline underline-offset-4">
                    {msg}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
        {saveError ? (
          <div className="vc-panel bg-[#2a1210] p-5" role="alert">
            <p className="font-bold text-[#ff8b82]">Not saved: {saveError}</p>
          </div>
        ) : null}

        {deadlinePassed ? (
          <p className="vc-panel bg-[#3a2f12] p-4 text-sm font-bold text-gold">
            The configured registration deadline has passed. Demo mode still lets you explore the flow.
          </p>
        ) : null}

        {/* Team */}
        <fieldset className="vc-panel p-6">
          <legend className="sr-only">Team details</legend>
          <h2 className="font-display text-xl font-bold text-parchment" aria-hidden="true">
            1 · Team
          </h2>
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <Field id={fid("teamName")} label="Team name" error={err("teamName")}>
              <input
                id={fid("teamName")}
                className="vc-input"
                value={form.teamName}
                onChange={(e) => set("teamName", e.target.value)}
                aria-invalid={!!err("teamName")}
                aria-describedby={describedBy("teamName")}
                autoComplete="off"
                maxLength={60}
                required
              />
            </Field>
            <Field id={fid("college")} label="College" error={err("college")}>
              <input
                id={fid("college")}
                className="vc-input"
                value={form.college}
                onChange={(e) => set("college", e.target.value)}
                aria-invalid={!!err("college")}
                aria-describedby={describedBy("college")}
                autoComplete="organization"
                maxLength={120}
                required
              />
            </Field>
          </div>
        </fieldset>

        {/* Leader */}
        <fieldset className="vc-panel p-6">
          <legend className="sr-only">Team leader</legend>
          <h2 className="font-display text-xl font-bold text-parchment" aria-hidden="true">
            2 · Team leader
          </h2>
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <Field id={fid("leaderName")} label="Leader name" error={err("leaderName")}>
              <input
                id={fid("leaderName")}
                className="vc-input"
                value={form.leaderName}
                onChange={(e) => set("leaderName", e.target.value)}
                aria-invalid={!!err("leaderName")}
                aria-describedby={describedBy("leaderName")}
                autoComplete="name"
                required
              />
            </Field>
            <Field
              id={fid("leaderEmail")}
              label="Leader email"
              error={err("leaderEmail")}
              hint="In the live version this is taken from the leader's verified sign-in."
            >
              <input
                id={fid("leaderEmail")}
                type="email"
                className="vc-input"
                value={form.leaderEmail}
                onChange={(e) => set("leaderEmail", e.target.value)}
                aria-invalid={!!err("leaderEmail")}
                aria-describedby={describedBy("leaderEmail", true)}
                autoComplete="email"
                inputMode="email"
                required
              />
            </Field>
          </div>
        </fieldset>

        {/* Track & challenge */}
        <fieldset className="vc-panel p-6" aria-describedby={err("track") ? `${fid("track")}-error` : undefined}>
          <legend className="sr-only">Track and challenge</legend>
          <h2 className="font-display text-xl font-bold text-parchment" aria-hidden="true">
            3 · Track &amp; challenge
          </h2>
          <div className="mt-5" role="radiogroup" aria-labelledby={`${fid("track")}-label`} id={fid("track")}>
            <p id={`${fid("track")}-label`} className="vc-label">
              Track
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {(["hardware", "software"] as const).map((t) => {
                const checked = form.track === t;
                return (
                  <label
                    key={t}
                    className={`flex cursor-pointer items-center gap-4 border-3 p-4 transition-colors has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-diamond ${
                      checked
                        ? t === "hardware"
                          ? "border-gold bg-[#2b2112]"
                          : "border-diamond bg-[#0f2a2c]"
                        : "border-black bg-slot hover:bg-panel-2"
                    }`}
                  >
                    <input
                      type="radio"
                      name="track"
                      value={t}
                      checked={checked}
                      onChange={() => {
                        set("track", t);
                        const ch = CHALLENGES.find((c) => c.id === form.challengeId);
                        if (ch && ch.track !== t) set("challengeId", "");
                      }}
                      className="sr-only"
                    />
                    <Sprite name={t === "hardware" ? "chip" : "monitor"} size={36} />
                    <span>
                      <span className="block font-display text-lg font-bold capitalize text-parchment">{t}</span>
                      <span className="block text-sm text-muted">{t === "hardware" ? "Physical prototype" : "Software prototype"}</span>
                    </span>
                    <span
                      className={`ml-auto h-5 w-5 border-3 border-black ${checked ? "bg-emerald" : "bg-void"}`}
                      aria-hidden="true"
                    />
                  </label>
                );
              })}
            </div>
            {err("track") ? (
              <p id={`${fid("track")}-error`} className="vc-error">
                {err("track")}
              </p>
            ) : null}
          </div>

          <div className="mt-6">
            <Field
              id={fid("challengeId")}
              label="Challenge (optional)"
              error={err("challengeId")}
              hint="You can change your challenge when you submit your idea."
            >
              <select
                id={fid("challengeId")}
                className="vc-input"
                value={form.challengeId}
                onChange={(e) => set("challengeId", e.target.value)}
                aria-invalid={!!err("challengeId")}
                aria-describedby={describedBy("challengeId", true)}
              >
                <option value="">Decide later</option>
                <optgroup label="Illustrative challenges">
                  {challengeOptions.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title} ({c.track})
                    </option>
                  ))}
                </optgroup>
                <option value={OPEN_INNOVATION.id}>Open Innovation — propose your own</option>
              </select>
            </Field>
          </div>
        </fieldset>

        {/* Members */}
        <fieldset className="vc-panel p-6">
          <legend className="sr-only">Team members</legend>
          <h2 className="font-display text-xl font-bold text-parchment" aria-hidden="true">
            4 · Members
          </h2>
          <div className="mt-5 max-w-xs">
            <Field id={fid("teamSize")} label={`Team size (${min}–${max} including leader)`} error={err("teamSize")}>
              <select
                id={fid("teamSize")}
                className="vc-input"
                value={form.teamSize}
                onChange={(e) => set("teamSize", Number(e.target.value))}
                aria-invalid={!!err("teamSize")}
                aria-describedby={describedBy("teamSize")}
              >
                {SIZES.map((n) => (
                  <option key={n} value={n}>
                    {n} members
                  </option>
                ))}
              </select>
            </Field>
          </div>
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            {form.members.map((m, i) => {
              const key = `members.${i}`;
              const id = fid(`members-${i}`);
              return (
                <Field key={i} id={id} label={`Member ${i + 2} name`} error={err(key)}>
                  <input
                    id={id}
                    className="vc-input"
                    value={m}
                    onChange={(e) => {
                      const next = [...form.members];
                      next[i] = e.target.value;
                      set("members", next);
                      if (errors[key]) setErrors((x) => ({ ...x, [key]: undefined }));
                    }}
                    aria-invalid={!!err(key)}
                    aria-describedby={err(key) ? `${id}-error` : undefined}
                    autoComplete="off"
                  />
                </Field>
              );
            })}
          </div>
          {err("members") ? <p className="vc-error">{err("members")}</p> : null}
        </fieldset>

        {/* Consent */}
        <div className="vc-panel p-6">
          <label htmlFor={fid("consent")} className="flex cursor-pointer items-start gap-3">
            <input
              id={fid("consent")}
              type="checkbox"
              checked={form.consent}
              onChange={(e) => set("consent", e.target.checked)}
              aria-invalid={!!err("consent")}
              aria-describedby={err("consent") ? `${fid("consent")}-error` : undefined}
              className="mt-1 h-5 w-5 shrink-0 accent-emerald"
            />
            <span>
              I agree that {EVENT.organizer} may use these team details to coordinate VitalCraft (screening, results and
              finale logistics).
            </span>
          </label>
          {err("consent") ? (
            <p id={`${fid("consent")}-error`} className="vc-error">
              {err("consent")}
            </p>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <button type="submit" className="vc-btn vc-btn-primary px-7 text-base" disabled={submitting} aria-busy={submitting}>
            {submitting ? "Saving…" : "Register team (demo)"}
          </button>
          <button type="button" className="vc-btn" onClick={fillSample}>
            Fill with sample data
          </button>
        </div>
      </div>

      <aside className="space-y-4 lg:sticky lg:top-32 lg:self-start">
        <div id={`${uid}-demo-note`} className="vc-panel bg-[#3a2f12] p-5">
          <p className="font-display text-sm font-bold uppercase tracking-widest text-gold">Demo mode</p>
          <p className="mt-2 text-sm text-ink">
            This simulated registration is saved only in this browser&apos;s local storage. Nothing is sent to the
            organizers and no email is sent. Please use made-up details.
          </p>
        </div>
        <div className="vc-panel p-5 text-sm text-muted">
          <p className="font-display text-sm font-bold uppercase tracking-widest text-diamond">What happens next</p>
          <ol className="mt-2 list-inside list-decimal space-y-1">
            <li>You get a registration reference.</li>
            <li>Submit your idea and pitch deck once the window opens.</li>
            <li>Organizers screen ideas and publish results.</li>
          </ol>
        </div>
      </aside>
    </form>
  );
}

function Field({
  id,
  label,
  error,
  hint,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="vc-label">
        {label}
      </label>
      {children}
      {hint ? (
        <p id={`${id}-hint`} className="vc-hint">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={`${id}-error`} className="vc-error">
          {error}
        </p>
      ) : null}
    </div>
  );
}
