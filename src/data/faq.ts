import { EVENT, teamSizeLabel } from "@/config/event";

export interface FaqItem {
  id: string;
  question: string;
  answer: string[];
}

const formats = EVENT.pitchDeck.formats.value.map((f) => f.toUpperCase()).join(" or ");

export const FAQ: FaqItem[] = [
  {
    id: "tracks",
    question: "What is the difference between the Hardware and Software tracks?",
    answer: [
      "Hardware teams build a physical prototype — embedded systems, IoT devices, sensors or assistive devices. Software teams build web, mobile, AI/data or accessibility tools.",
      "The examples on this page are illustrative directions, not restrictions. Pick the track that best matches what you will demo at the finale.",
    ],
  },
  {
    id: "process",
    question: "How do registration and screening work?",
    answer: [
      `The proposed process is: register your team (${teamSizeLabel()} members), submit your idea and pitch deck, organizers screen submissions manually, and shortlisted teams are invited to the 24-hour Grand Finale.`,
      "This screening format is a proposed operational design and is subject to organizer confirmation. The idea-submission and screening dates will be announced.",
    ],
  },
  {
    id: "challenge",
    question: "Do we have to pick one of the listed problem statements?",
    answer: [
      "No. You can choose a listed challenge or select Open Innovation and propose your own problem. The listed statements are illustrative and subject to organizer confirmation.",
      "Projects do not have to be biomedical, and Minecraft is only the visual theme — nothing has to be built in or for Minecraft.",
    ],
  },
  {
    id: "deck",
    question: "What should the pitch deck contain?",
    answer: [
      `Proposed format: ${formats}, up to ${EVENT.pitchDeck.maxSizeMB.value} MB. PDF is recommended so reviewers can open it easily.`,
      "Download the suggested outline from this page: team and track, problem and users, proposed solution, architecture, components or stack, impact, and your 24-hour MVP and demo plan. Final requirements will be announced.",
    ],
  },
  {
    id: "selection",
    question: "Does registering guarantee a place in the finale?",
    answer: [
      "No. Registration does not guarantee selection. Finale places are offered to teams shortlisted after screening.",
    ],
  },
  {
    id: "updates",
    question: "Where will event updates appear?",
    answer: [
      `Updates will be posted on this website, and team-specific status (submission and published results) will appear in your team dashboard.`,
      "Any additional official channels will be announced by IEEE EMBS – BMSIT&M. Logistics such as meals, accommodation, fees or equipment have not been announced yet — please don't assume they are provided.",
    ],
  },
];
