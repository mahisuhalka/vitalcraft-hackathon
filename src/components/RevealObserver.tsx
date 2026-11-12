"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/** Reveals [data-reveal] elements as they enter the viewport. */
export function RevealObserver() {
  const pathname = usePathname();
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]:not([data-revealed])"));
    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => (el.dataset.revealed = "true"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            (e.target as HTMLElement).dataset.revealed = "true";
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pathname]);
  return null;
}
