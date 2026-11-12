/**
 * Runtime mode flags.
 *
 * Demo mode must be explicitly enabled. It only ever reads/writes synthetic
 * records through the isolated demo adapter in `src/lib/demo`.
 * Live registration is unavailable until the live backend is configured
 * (see PLAN.md, milestones 2–4).
 */
export const DEMO_MODE = process.env.NEXT_PUBLIC_VITALCRAFT_DEMO_MODE === "true";

export const DEMO_NOTICE = "Demo mode — synthetic data; no real application is submitted.";

/** Server-side check — the live backend has not been deployed yet. */
export function isLiveBackendConfigured(): boolean {
  return process.env.VITALCRAFT_LIVE_BACKEND === "true";
}
