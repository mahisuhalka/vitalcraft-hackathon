import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Tracks } from "@/components/sections/Tracks";
import { Challenges } from "@/components/sections/Challenges";
import { Timeline } from "@/components/sections/Timeline";
import { Prizes } from "@/components/sections/Prizes";
import { Faq } from "@/components/sections/Faq";

export default function HomePage() {
  return (
    <>
      <Hero />
      <About />
      <Tracks />
      <Challenges />
      <Timeline />
      <Prizes />
      <Faq />
    </>
  );
}
