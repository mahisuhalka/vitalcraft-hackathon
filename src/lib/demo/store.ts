"use client";

/**
 * Isolated demo data adapter.
 *
 * - Only used when demo mode is explicitly enabled.
 * - Stores synthetic records in this browser's localStorage. Nothing is sent
 *   to any server, and nothing here is ever used as a fallback for the live
 *   backend.
 */
import { useSyncExternalStore } from "react";
import type { TrackId } from "@/config/event";
import type { RegistrationInput } from "@/lib/validation/registration";
import { generateReference } from "@/lib/reference";

export type SubmissionStatus = "not_started" | "draft" | "submitted" | "under_review";
export type SelectionDecision = "pending" | "shortlisted" | "waitlisted" | "not_shortlisted";

export interface DemoTeam {
  reference: string;
  teamName: string;
  leaderName: string;
  leaderEmail: string;
  college: string;
  track: TrackId;
  challengeId?: string;
  teamSize: number;
  members: string[];
  createdAt: string;
  submissionStatus: SubmissionStatus;
  /** Only the published decision is ever stored on the participant side. */
  publishedDecision: SelectionDecision | null;
}

const KEY = "vitalcraft:demo:team:v1";
const listeners = new Set<() => void>();

function emit() {
  for (const l of listeners) l();
}

function read(): string | null {
  try {
    return window.localStorage.getItem(KEY);
  } catch {
    return null;
  }
}

let cacheRaw: string | null = null;
let cacheValue: DemoTeam | null = null;

function snapshot(): DemoTeam | null {
  const raw = read();
  if (raw !== cacheRaw) {
    cacheRaw = raw;
    try {
      cacheValue = raw ? (JSON.parse(raw) as DemoTeam) : null;
    } catch {
      cacheValue = null;
    }
  }
  return cacheValue;
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) cb();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", onStorage);
  };
}

/** `undefined` while hydrating, `null` when no demo team exists. */
export function useDemoTeam(): DemoTeam | null | undefined {
  return useSyncExternalStore(subscribe, snapshot, () => undefined);
}

export type SaveResult = { ok: true; team: DemoTeam } | { ok: false; error: string };

export function saveDemoRegistration(input: RegistrationInput): SaveResult {
  const team: DemoTeam = {
    reference: generateReference("VC-DEMO"),
    teamName: input.teamName,
    leaderName: input.leaderName,
    leaderEmail: input.leaderEmail,
    college: input.college,
    track: input.track,
    challengeId: input.challengeId,
    teamSize: input.teamSize,
    members: input.members,
    createdAt: new Date().toISOString(),
    submissionStatus: "not_started",
    publishedDecision: null,
  };
  try {
    window.localStorage.setItem(KEY, JSON.stringify(team));
    // Read back to confirm persistence before reporting success.
    if (window.localStorage.getItem(KEY) === null) throw new Error("not persisted");
  } catch {
    return {
      ok: false,
      error: "Your browser blocked local storage, so the demo registration could not be saved.",
    };
  }
  emit();
  return { ok: true, team };
}

export function clearDemoData(): void {
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
  emit();
}

/** Clearly fake sample values for quick demos. */
export const SAMPLE_REGISTRATION: Omit<RegistrationInput, "consent" | "track"> = {
  teamName: "Redstone Rangers (sample)",
  leaderName: "Sample Leader",
  leaderEmail: "leader@example.com",
  college: "Example Institute of Technology",
  teamSize: 4,
  members: ["Sample Member A", "Sample Member B", "Sample Member C"],
};
