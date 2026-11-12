import Link from "next/link";
import { EVENT } from "@/config/event";
import { Landscape } from "@/components/Landscape";
import { Sprite } from "@/components/PixelArt";
import { NAV_ITEMS } from "@/config/nav";

export function SiteFooter() {
  return (
    <footer className="relative mt-24 border-t-3 border-black bg-bedrock">
      <Landscape seed={41} id="footer" trees={false} className="absolute inset-x-0 -top-20 h-20 w-full" />
      <div className="mx-auto grid max-w-7xl gap-10 px-4 pb-10 pt-14 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-3">
            <Sprite name="heart" size={32} />
            <span className="font-pixel text-lg text-parchment">VitalCraft</span>
          </div>
          <p className="mt-3 font-display text-lg text-emerald">{EVENT.tagline}</p>
          <p className="mt-2 text-muted">
            A {EVENT.format} organized by <strong className="text-ink">{EVENT.organizer}</strong> at {EVENT.venue.value},{" "}
            {EVENT.finale.displayDates}.
          </p>
        </div>

        <nav aria-label="Footer">
          <h2 className="font-display text-sm font-bold uppercase tracking-widest text-diamond">Explore</h2>
          <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5">
            {NAV_ITEMS.map((n) => (
              <li key={n.id}>
                <Link href={`/#${n.id}`} className="text-muted underline-offset-4 hover:text-ink hover:underline">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="font-display text-sm font-bold uppercase tracking-widest text-gold">Team resources</h2>
          <ul className="mt-3 space-y-1.5">
            <li>
              <Link href="/register" className="text-muted underline-offset-4 hover:text-ink hover:underline">
                Register your team
              </Link>
            </li>
            <li>
              <a href={EVENT.pitchDeck.outlineUrl} download className="text-muted underline-offset-4 hover:text-ink hover:underline">
                Suggested pitch-deck outline (PDF)
              </a>
            </li>
            {EVENT.contactEmail ? (
              <li>
                <a href={`mailto:${EVENT.contactEmail}`} className="text-muted underline-offset-4 hover:text-ink hover:underline">
                  {EVENT.contactEmail}
                </a>
              </li>
            ) : null}
            {EVENT.repositoryUrl ? (
              <li>
                <a href={EVENT.repositoryUrl} className="text-muted underline-offset-4 hover:text-ink hover:underline" rel="noopener noreferrer">
                  Source repository
                </a>
              </li>
            ) : null}
          </ul>
        </div>
      </div>
      <div className="border-t-3 border-black bg-void">
        <p className="mx-auto max-w-7xl px-4 py-4 text-sm text-muted sm:px-6">
          © 2026 {EVENT.organizer}. Original block-world artwork inspired by sandbox games — not affiliated with or
          endorsed by Mojang Studios or Microsoft.
        </p>
      </div>
    </footer>
  );
}
