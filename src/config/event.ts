/**
 * Single source of truth for every VitalCraft event detail and deadline.
 *
 * Every value carries a `status`:
 *  - "confirmed": provided by the organizers.
 *  - "proposed":  an operational suggestion that still needs organizer sign-off.
 *  - "tba":       not decided yet; the UI shows "To be announced".
 *
 * Edit this file (not the components) when details change.
 */

export type DetailStatus = "confirmed" | "proposed" | "tba";

export interface Detail<T> {
  value: T;
  status: DetailStatus;
  note?: string;
}

export type TrackId = "hardware" | "software";

export interface TimelineStage {
  id: string;
  title: string;
  description: string;
  /** ISO date or datetime string with an explicit offset, or null when TBA. */
  date: Detail<string | null>;
  /** Optional end date for ranges. */
  endDate?: string;
}

export interface ScheduleItem {
  /** Hours elapsed since the finale starts, e.g. 0, 0.5, 12. */
  hour: number;
  title: string;
  detail: string;
}

export interface PrizeTier {
  id: string;
  title: string;
  amount: number;
  description: string;
}

export interface EventConfig {
  name: string;
  organizer: string;
  tagline: string;
  format: string;
  heroHeadline: string;
  venue: Detail<string>;
  timezone: string;
  finale: {
    start: Detail<string>;
    end: Detail<string>;
    durationHours: number;
    displayDates: string;
  };
  registrationDeadline: Detail<string>;
  ideaSubmissionDeadline: Detail<string | null>;
  teamSize: Detail<{ min: number; max: number }>;
  tracks: Record<TrackId, { name: string; status: DetailStatus }>;
  prizes: {
    pool: Detail<number>;
    currency: string;
    split: Detail<PrizeTier[]>;
  };
  pitchDeck: {
    formats: Detail<Array<"pdf" | "pptx">>;
    maxSizeMB: Detail<number>;
    recommended: "pdf";
    outlineUrl: string;
  };
  journey: Detail<string[]>;
  timeline: TimelineStage[];
  finaleSchedule: Detail<ScheduleItem[]>;
  /** Only shown when configured. Never invent these. */
  contactEmail: string | null;
  repositoryUrl: string | null;
  updatesChannel: Detail<string>;
}

export const EVENT: EventConfig = {
  name: "VitalCraft",
  organizer: "IEEE EMBS – BMSIT&M",
  tagline: "Craft ideas. Engineer impact.",
  format: "24-hour Hardware & Software Hackathon",
  heroHeadline: "24 Hours. Two Tracks. Build Something That Matters.",
  venue: { value: "BMSIT&M", status: "confirmed" },
  timezone: "Asia/Kolkata",
  finale: {
    // Dates are confirmed. The exact start time is not, so the countdown
    // targets the start of 28 Nov (IST) and says so.
    start: {
      value: "2026-11-28T00:00:00+05:30",
      status: "confirmed",
      note: "Date confirmed; start time to be announced.",
    },
    end: { value: "2026-11-29T23:59:59+05:30", status: "confirmed" },
    durationHours: 24,
    displayDates: "28–29 November 2026",
  },
  registrationDeadline: {
    value: "2026-11-15T23:59:59+05:30",
    status: "confirmed",
    note: "Date confirmed; end-of-day IST cut-off is a proposed default.",
  },
  ideaSubmissionDeadline: {
    value: null,
    status: "tba",
    note: "Idea and pitch-deck deadline will be announced by the organizers.",
  },
  teamSize: { value: { min: 3, max: 4 }, status: "confirmed" },
  tracks: {
    hardware: { name: "Hardware", status: "confirmed" },
    software: { name: "Software", status: "confirmed" },
  },
  prizes: {
    pool: { value: 50000, status: "confirmed" },
    currency: "INR",
    split: {
      status: "proposed",
      note: "Proposed distribution — final split to be confirmed by the organizers.",
      value: [
        { id: "winner", title: "Grand Crafter", amount: 20000, description: "Overall winning team across both tracks." },
        { id: "runner-up", title: "Runner-up", amount: 12000, description: "Second-placed team overall." },
        { id: "hardware", title: "Best Hardware Build", amount: 9000, description: "Strongest working physical prototype." },
        { id: "software", title: "Best Software Build", amount: 9000, description: "Strongest working software prototype." },
      ],
    },
  },
  pitchDeck: {
    formats: { value: ["pdf", "pptx"], status: "proposed" },
    maxSizeMB: { value: 10, status: "proposed" },
    recommended: "pdf",
    outlineUrl: "/downloads/vitalcraft-pitch-deck-outline.pdf",
  },
  journey: {
    status: "proposed",
    note: "Proposed operational design — subject to organizer confirmation.",
    value: [
      "Team registration",
      "Idea & pitch-deck submission",
      "Screening",
      "Shortlisting",
      "24-hour Grand Finale",
    ],
  },
  timeline: [
    {
      id: "registration-opens",
      title: "Registration opens",
      description: "Team leaders sign in and register their team and track.",
      date: { value: null, status: "tba" },
    },
    {
      id: "registration-closes",
      title: "Registration closes",
      description: "Last day to register a team.",
      date: { value: "2026-11-15T23:59:59+05:30", status: "confirmed" },
    },
    {
      id: "idea-submission",
      title: "Idea & pitch-deck submission",
      description: "Registered teams submit their idea and a short pitch deck.",
      date: { value: null, status: "tba" },
    },
    {
      id: "screening",
      title: "Screening & shortlisting",
      description: "Organizers review submissions manually and publish results.",
      date: { value: null, status: "tba" },
    },
    {
      id: "finalist-confirmation",
      title: "Finalist confirmation",
      description: "Shortlisted teams confirm or decline finale attendance.",
      date: { value: null, status: "tba" },
    },
    {
      id: "finale",
      title: "24-hour Grand Finale",
      description: "Build, test and demo your prototype at BMSIT&M.",
      date: { value: "2026-11-28T00:00:00+05:30", status: "confirmed" },
      endDate: "2026-11-29T23:59:59+05:30",
    },
  ],
  finaleSchedule: {
    status: "proposed",
    note: "Proposed run-of-show in relative hours. Clock times will be announced.",
    value: [
      { hour: 0, title: "Opening & briefing", detail: "Check-in, opening remarks, rules and challenge briefing." },
      { hour: 1, title: "Build begins", detail: "Teams start crafting. Mentors and organizers available on the floor." },
      { hour: 6, title: "Checkpoint 1 — scope check", detail: "Short check-in to confirm each team's MVP scope." },
      { hour: 12, title: "Midpoint checkpoint", detail: "Progress review; flag blockers early." },
      { hour: 18, title: "Checkpoint 3 — demo readiness", detail: "Confirm what will be shown in the final demo." },
      { hour: 21, title: "Build freeze", detail: "Code and hardware freeze. Prepare demo setup." },
      { hour: 21.5, title: "Final demos & judging", detail: "Teams present working prototypes to the panel." },
      { hour: 24, title: "Closing & results", detail: "Results and closing ceremony." },
    ],
  },
  contactEmail: null,
  repositoryUrl: null,
  updatesChannel: {
    value: "This website and your team dashboard",
    status: "proposed",
    note: "Official announcement channels will be confirmed by the organizers.",
  },
};

export const STATUS_LABEL: Record<DetailStatus, string> = {
  confirmed: "Confirmed",
  proposed: "Proposed",
  tba: "To be announced",
};

export function teamSizeLabel(): string {
  const { min, max } = EVENT.teamSize.value;
  return min === max ? `${min}` : `${min}–${max}`;
}
