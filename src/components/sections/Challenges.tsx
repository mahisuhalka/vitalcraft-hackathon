import { SectionHeading } from "@/components/Badges";
import { ChallengeGrid } from "@/components/ChallengeGrid";
import { ILLUSTRATIVE_LABEL } from "@/data/challenges";

export function Challenges() {
  return (
    <section id="challenges" aria-labelledby="challenges-title" className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
      <SectionHeading id="challenges-title" eyebrow="Problem statements" title="Choose a challenge — or bring your own">
        <p>
          Sample challenges to spark ideas across both tracks. Each one is an{" "}
          <span className="text-ink">{ILLUSTRATIVE_LABEL.toLowerCase().replace(/\.$/, "")}</span>.
        </p>
      </SectionHeading>
      <ChallengeGrid />
    </section>
  );
}
