import type { TrackId } from "@/config/event";

export interface Challenge {
  id: string;
  title: string;
  track: TrackId | "open";
  summary: string;
  description: string;
  intendedUsers: string[];
  prototypeScope: string[];
  /** True for organizer-confirmed challenges. All samples are illustrative. */
  confirmed: boolean;
}

export const ILLUSTRATIVE_LABEL =
  "Illustrative problem statement — subject to organizer confirmation.";

export const OPEN_INNOVATION_ID = "open-innovation";

/** Structured challenge content. Replace with confirmed statements when available. */
export const CHALLENGES: Challenge[] = [
  {
    id: "hw-dose-reminder",
    title: "Missed-Dose Reminder Box",
    track: "hardware",
    summary: "A low-cost box that notices when a scheduled dose was not taken and nudges a caregiver.",
    description:
      "Many people managing several daily medicines rely on memory alone. Design a simple container that detects whether a compartment was opened in its scheduled window and sends a reminder. This is a reminder aid, not a medical device — it should not interpret symptoms or give dosing advice.",
    intendedUsers: ["Older adults living independently", "Family caregivers"],
    prototypeScope: [
      "Lid or compartment sensing with a microcontroller",
      "Local buzzer/LED reminder",
      "A minimal companion screen or log showing opened/missed windows",
    ],
    confirmed: false,
  },
  {
    id: "hw-lab-monitor",
    title: "Lab Bench Environment Monitor",
    track: "hardware",
    summary: "A compact sensor node that tracks temperature, humidity, and air quality around a lab bench.",
    description:
      "Student labs often have no visibility into the conditions around sensitive equipment. Build a sensor node that measures environmental readings and raises a clear local alert when values leave a configurable range.",
    intendedUsers: ["Students in college labs", "Lab assistants"],
    prototypeScope: [
      "Two or more environmental sensors on one board",
      "Configurable thresholds with a visible alert",
      "Readings viewable on a simple display or web page",
    ],
    confirmed: false,
  },
  {
    id: "hw-tactile-nav",
    title: "Tactile Obstacle Cue",
    track: "hardware",
    summary: "A wearable or handheld aid that turns nearby-obstacle distance into gentle haptic cues.",
    description:
      "Explore an assistive prototype that complements — not replaces — existing mobility aids by giving vibration feedback about obstacles at chest or head height, which a cane may miss.",
    intendedUsers: ["People with low vision", "Orientation and mobility trainers"],
    prototypeScope: [
      "Distance sensing (e.g. ultrasonic or time-of-flight)",
      "Distance-to-vibration mapping with at least three levels",
      "Comfortable mounting and a short indoor demo course",
    ],
    confirmed: false,
  },
  {
    id: "sw-accessible-notices",
    title: "Accessible Campus Notices",
    track: "software",
    summary: "A notice board that works well with screen readers, large text, and multiple languages.",
    description:
      "Important notices are often shared as images or dense PDFs that exclude many readers. Build a notice platform where posts are structured, searchable, readable aloud, and available in plain-language summaries.",
    intendedUsers: ["Students using assistive technology", "Department coordinators"],
    prototypeScope: [
      "Post, list and search notices with structured fields",
      "Keyboard and screen-reader friendly reading view",
      "Text-size and contrast controls",
    ],
    confirmed: false,
  },
  {
    id: "sw-clinic-queue",
    title: "Small-Clinic Queue Visibility",
    track: "software",
    summary: "Let visitors to a small clinic see their place in line without crowding the waiting room.",
    description:
      "Small clinics usually manage queues on paper. Build a lightweight token system that shows estimated position to visitors and keeps personal details private. Focus on logistics only — no diagnosis or triage.",
    intendedUsers: ["Clinic front-desk staff", "Visitors waiting for appointments"],
    prototypeScope: [
      "Staff screen to issue and advance tokens",
      "Visitor view showing position without personal data",
      "Works on a basic phone browser",
    ],
    confirmed: false,
  },
  {
    id: "sw-equipment-booking",
    title: "Lab Equipment Booking & Fault Reports",
    track: "software",
    summary: "One place to book shared lab equipment and report faults before they waste a session.",
    description:
      "Shared instruments are often double-booked or silently broken. Build a booking tool with clear availability, simple fault reporting, and a status view for lab staff.",
    intendedUsers: ["Students and project teams", "Lab in-charges"],
    prototypeScope: [
      "Calendar-style availability and booking",
      "Fault report with status updates",
      "Staff view to mark equipment in or out of service",
    ],
    confirmed: false,
  },
];

export const OPEN_INNOVATION: Challenge = {
  id: OPEN_INNOVATION_ID,
  title: "Open Innovation — Propose Your Own Problem",
  track: "open",
  summary: "Have a sharper problem in mind? Bring it. Hardware or software, explain who it helps and what you'll build in 24 hours.",
  description:
    "Teams may propose an original problem in either track. Describe the problem clearly, who experiences it, and a prototype that is realistic within the 24-hour finale. Projects do not need to be biomedical.",
  intendedUsers: ["Defined by your team — be specific"],
  prototypeScope: ["A working demo of one core flow", "A clear story of who benefits and how"],
  confirmed: false,
};

export const ALL_CHALLENGES: Challenge[] = [...CHALLENGES, OPEN_INNOVATION];

export function findChallenge(id: string | null | undefined): Challenge | undefined {
  if (!id) return undefined;
  return ALL_CHALLENGES.find((c) => c.id === id);
}
