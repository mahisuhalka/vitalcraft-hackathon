"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Sprite } from "@/components/PixelArt";
import { useDemoTeam } from "@/lib/demo/store";
import { DEMO_MODE } from "@/config/site";
import { NAV_ITEMS } from "@/config/nav";


function useScrollSpy(enabled: boolean) {
  const [active, setActive] = useState<string>("home");
  useEffect(() => {
    if (!enabled) return;
    const sections = NAV_ITEMS.map((n) => document.getElementById(n.id)).filter(Boolean) as HTMLElement[];
    const visible = new Map<string, number>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) visible.set(e.target.id, e.isIntersecting ? e.intersectionRatio : 0);
        let best = "home";
        let bestRatio = 0;
        for (const n of NAV_ITEMS) {
          const r = visible.get(n.id) ?? 0;
          if (r > bestRatio) {
            best = n.id;
            bestRatio = r;
          }
        }
        if (bestRatio > 0) setActive(best);
      },
      { rootMargin: "-30% 0px -55% 0px", threshold: [0, 0.01, 0.25, 0.5, 1] },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, [enabled]);
  return active;
}

function CtaButton({ onNavigate }: { onNavigate?: () => void }) {
  const team = useDemoTeam();
  const hasTeam = DEMO_MODE && !!team;
  return (
    <Link href={hasTeam ? "/dashboard" : "/register"} className="vc-btn vc-btn-primary vc-btn-sm" onClick={onNavigate}>
      {hasTeam ? "Dashboard" : "Register"}
    </Link>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const onHome = pathname === "/";
  const active = useScrollSpy(onHome);
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    panelRef.current?.querySelector<HTMLElement>("a")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const href = (id: string) => (onHome ? `#${id}` : `/#${id}`);

  return (
    <header className="border-b-3 border-black bg-bedrock/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6">
        <Link href="/" className="group flex shrink-0 items-center gap-2.5" aria-label="VitalCraft home">
          <Sprite name="heart" size={26} className="transition-transform group-hover:-translate-y-0.5" />
          <span className="font-pixel text-[13px] text-parchment sm:text-sm">VitalCraft</span>
        </Link>

        <nav aria-label="Primary" className="ml-auto hidden lg:block">
          <ul className="flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const isActive = onHome && active === item.id;
              return (
                <li key={item.id}>
                  <a
                    href={href(item.id)}
                    aria-current={isActive ? "location" : undefined}
                    className={`block border-2 px-2.5 py-1.5 font-display text-[15px] font-semibold transition-colors ${
                      isActive
                        ? "border-black bg-emerald-deep text-white shadow-[2px_2px_0_0_#000]"
                        : "border-transparent text-muted hover:text-ink"
                    }`}
                  >
                    {item.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-3 lg:ml-2">
          <CtaButton />
          <button
            ref={toggleRef}
            type="button"
            className="vc-btn vc-btn-sm lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((o) => !o)}
          >
            <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
            <svg width="18" height="16" viewBox="0 0 9 8" shapeRendering="crispEdges" aria-hidden="true">
              {open ? (
                <path d="M0 0h2v1h1v1h1v1h1V2h1V1h1V0h2v1H8v1H7v1H6v1h1v1h1v1h1v2H7V7H6V6H5V5H4v1H3v1H2v1H0V6h1V5h1V4h1V3H2V2H1V1H0z" fill="currentColor" />
              ) : (
                <path d="M0 0h9v2H0zM0 3h9v2H0zM0 6h9v2H0z" fill="currentColor" />
              )}
            </svg>
          </button>
        </div>
      </div>

      <div
        id="mobile-menu"
        ref={panelRef}
        hidden={!open}
        className="border-t-3 border-black bg-panel lg:hidden"
      >
        <nav aria-label="Mobile">
          <ul className="mx-auto grid max-w-7xl gap-1 px-4 py-3 sm:grid-cols-2 sm:px-6">
            {NAV_ITEMS.map((item) => {
              const isActive = onHome && active === item.id;
              return (
                <li key={item.id}>
                  <a
                    href={href(item.id)}
                    onClick={() => setOpen(false)}
                    aria-current={isActive ? "location" : undefined}
                    className={`flex min-h-11 items-center border-2 px-3 font-display text-lg font-semibold ${
                      isActive ? "border-black bg-emerald-deep text-white" : "border-transparent text-ink hover:bg-panel-2"
                    }`}
                  >
                    {item.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </header>
  );
}
