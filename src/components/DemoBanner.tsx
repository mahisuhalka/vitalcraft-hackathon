import { DEMO_MODE, DEMO_NOTICE } from "@/config/site";

export function DemoBanner() {
  if (!DEMO_MODE) return null;
  return (
    <div className="relative z-50 border-b-3 border-black bg-gold px-4 py-1.5 text-center text-sm font-bold text-void" role="note">
      <span className="mr-2 inline-block bg-black px-1.5 py-0.5 font-display text-xs uppercase tracking-widest text-gold">Demo</span>
      {DEMO_NOTICE}
    </div>
  );
}
