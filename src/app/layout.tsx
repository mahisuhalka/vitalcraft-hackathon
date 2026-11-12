import type { Metadata, Viewport } from "next";
import { Atkinson_Hyperlegible, Pixelify_Sans, Press_Start_2P } from "next/font/google";
import "./globals.css";
import { EVENT } from "@/config/event";
import { DemoBanner } from "@/components/DemoBanner";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ToastProvider } from "@/components/Toast";
import { RevealObserver } from "@/components/RevealObserver";

const pressStart = Press_Start_2P({ weight: "400", subsets: ["latin"], variable: "--font-press-start", display: "swap" });
const pixelify = Pixelify_Sans({ subsets: ["latin"], variable: "--font-pixelify", display: "swap" });
const atkinson = Atkinson_Hyperlegible({ weight: ["400", "700"], subsets: ["latin"], variable: "--font-atkinson", display: "swap" });

export const metadata: Metadata = {
  title: { default: `${EVENT.name} — ${EVENT.format}`, template: `%s · ${EVENT.name}` },
  description: `${EVENT.tagline} ${EVENT.format} by ${EVENT.organizer}, ${EVENT.finale.displayDates} at ${EVENT.venue.value}.`,
};

export const viewport: Viewport = { themeColor: "#0e0d0c" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${pressStart.variable} ${pixelify.variable} ${atkinson.variable}`} suppressHydrationWarning>
      <head>
        {/* Enables reveal animations only when JS runs; content stays visible otherwise. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body>
        <a
          href="#main"
          className="sr-only z-[70] bg-emerald px-4 py-2 font-bold text-void focus:not-sr-only focus:fixed focus:left-3 focus:top-3"
        >
          Skip to content
        </a>
        <ToastProvider>
          <div className="sticky top-0 z-40">
            <DemoBanner />
            <SiteHeader />
          </div>
          <main id="main">{children}</main>
          <SiteFooter />
        </ToastProvider>
        <RevealObserver />
      </body>
    </html>
  );
}
