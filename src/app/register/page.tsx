import type { Metadata } from "next";
import Link from "next/link";
import { EVENT, teamSizeLabel } from "@/config/event";
import { DEMO_MODE, isLiveBackendConfigured } from "@/config/site";
import { RegisterForm } from "@/components/register/RegisterForm";
import { Sprite } from "@/components/PixelArt";
import { findChallenge } from "@/data/challenges";
import { formatDate, isPast } from "@/lib/format";

export const metadata: Metadata = { title: "Register your team" };

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function one(v: string | string[] | undefined) {
  return Array.isArray(v) ? v[0] : v;
}

export default async function RegisterPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const trackParam = one(sp.track);
  const track = trackParam === "hardware" || trackParam === "software" ? trackParam : undefined;
  const challenge = findChallenge(one(sp.challenge));
  const closed = isPast(EVENT.registrationDeadline.value);

  return (
    <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
      <nav aria-label="Breadcrumb" className="text-sm text-muted">
        <Link href="/" className="underline-offset-4 hover:text-ink hover:underline">
          Home
        </Link>{" "}
        / <span aria-current="page">Register</span>
      </nav>
      <header className="mt-4 flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="vc-eyebrow">Team registration</p>
          <h1 className="mt-2 text-4xl font-bold text-parchment sm:text-5xl">Register your team</h1>
          <p className="mt-3 max-w-2xl text-lg text-muted">
            One team leader registers for the whole team of {teamSizeLabel()}. Registration closes{" "}
            <strong className="text-ink">{formatDate(EVENT.registrationDeadline.value)}</strong>. Registering does not
            guarantee a place in the finale.
          </p>
        </div>
        <Sprite name="scroll" size={64} className="hidden sm:block" />
      </header>

      <div className="mt-10">
        {DEMO_MODE ? (
          <RegisterForm initialTrack={track} initialChallengeId={challenge?.id} deadlinePassed={closed} />
        ) : closed ? (
          <Unavailable title="Registration has closed">
            The registration deadline ({formatDate(EVENT.registrationDeadline.value)}) has passed.
          </Unavailable>
        ) : !isLiveBackendConfigured() ? (
          <Unavailable title="Live registration isn't available yet">
            The registration service (sign-in and secure storage) hasn&apos;t been configured on this deployment, so no
            application can be saved. Nothing you enter would be stored — please check back once organizers announce
            that registration is live.
          </Unavailable>
        ) : (
          <Unavailable title="Live registration is being set up">
            The live registration flow is not part of this release yet.
          </Unavailable>
        )}
      </div>
    </div>
  );
}

function Unavailable({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="vc-panel p-8" role="status">
      <h2 className="text-2xl font-bold text-parchment">{title}</h2>
      <p className="mt-2 max-w-2xl text-muted">{children}</p>
      <Link href="/#faq" className="vc-btn mt-6">
        Read the FAQ
      </Link>
    </div>
  );
}
