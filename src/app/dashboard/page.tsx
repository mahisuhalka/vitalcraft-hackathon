import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { DEMO_MODE } from "@/config/site";
import { DemoDashboard } from "@/components/dashboard/DemoDashboard";

export const metadata: Metadata = { title: "Team dashboard", robots: { index: false } };

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <p className="vc-eyebrow">Team dashboard</p>
      <h1 className="mt-2 text-4xl font-bold text-parchment sm:text-5xl">Your base camp</h1>
      <div className="mt-8">
        {DEMO_MODE ? (
          <Suspense fallback={<div className="vc-panel h-60 animate-pulse" aria-busy="true" />}>
            <DemoDashboard />
          </Suspense>
        ) : (
          <div className="vc-panel p-8" role="status">
            <h2 className="text-2xl font-bold text-parchment">Sign-in isn&apos;t available yet</h2>
            <p className="mt-2 max-w-2xl text-muted">
              The live team dashboard requires team-leader sign-in, which hasn&apos;t been configured on this
              deployment. No team data is shown or stored.
            </p>
            <Link href="/" className="vc-btn mt-6">
              Back to home
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
