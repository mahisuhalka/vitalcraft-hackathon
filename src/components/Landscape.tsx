/**
 * Original blocky landscape rendered as a single SVG.
 * Deterministic (seeded) so server and client markup match.
 * Purely decorative: aria-hidden and pointer-events: none.
 */

function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

const COLS = 96;
const ROWS = 34;

function heights(rand: () => number, base: number, amp: number, smooth: number): number[] {
  const out: number[] = [];
  let h = base;
  for (let x = 0; x < COLS; x++) {
    if (x % smooth === 0) h = Math.round(base + (rand() - 0.5) * amp * 2);
    out.push(h);
  }
  return out;
}

export function Landscape({
  seed = 7,
  id = "hero",
  className = "",
  trees = true,
}: {
  seed?: number;
  id?: string;
  className?: string;
  trees?: boolean;
}) {
  const rand = rng(seed);
  const far = heights(rand, 15, 4, 6);
  const mid = heights(rand, 11, 3, 4);
  const ground = heights(rand, 7, 1.6, 3);

  const p = (name: string) => `${id}-${name}`;
  const ores: { x: number; y: number; kind: "diamond" | "gold" | "emerald" }[] = [];
  for (let x = 0; x < COLS; x++) {
    if (rand() < 0.16) {
      const stoneTop = ROWS - ground[x] + 3;
      const y = stoneTop + Math.floor(rand() * Math.max(1, ROWS - stoneTop - 1));
      const r = rand();
      ores.push({ x, y, kind: r < 0.4 ? "diamond" : r < 0.75 ? "gold" : "emerald" });
    }
  }
  const treeCols: number[] = [];
  if (trees) {
    for (let x = 4; x < COLS - 4; x += 9 + Math.floor(rand() * 8)) {
      if (rand() < 0.75) treeCols.push(x);
    }
  }

  return (
    <svg
      className={`pointer-events-none select-none ${className}`}
      viewBox={`0 0 ${COLS} ${ROWS}`}
      preserveAspectRatio="xMidYMax slice"
      shapeRendering="crispEdges"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <pattern id={p("grass")} width="1" height="1" patternUnits="userSpaceOnUse">
          <rect width="1" height="1" fill="#6b4a2b" />
          <rect width="1" height="0.5" fill="#4f9a2f" />
          <rect width="1" height="0.25" fill="#6cc23c" />
          <rect x="0.125" y="0.5" width="0.125" height="0.25" fill="#4f9a2f" />
          <rect x="0.5" y="0.5" width="0.125" height="0.125" fill="#4f9a2f" />
          <rect x="0.75" y="0.5" width="0.125" height="0.375" fill="#4f9a2f" />
          <rect x="0.375" y="0.75" width="0.125" height="0.125" fill="#4a321d" />
        </pattern>
        <pattern id={p("dirt")} width="1" height="1" patternUnits="userSpaceOnUse">
          <rect width="1" height="1" fill="#6b4a2b" />
          <rect x="0.125" y="0.25" width="0.125" height="0.125" fill="#4a321d" />
          <rect x="0.625" y="0.125" width="0.125" height="0.125" fill="#7d5735" />
          <rect x="0.5" y="0.625" width="0.125" height="0.125" fill="#4a321d" />
          <rect x="0.875" y="0.75" width="0.125" height="0.125" fill="#7d5735" />
        </pattern>
        <pattern id={p("stone")} width="1" height="1" patternUnits="userSpaceOnUse">
          <rect width="1" height="1" fill="#4a4844" />
          <rect x="0" y="0" width="0.375" height="0.25" fill="#55534e" />
          <rect x="0.5" y="0.375" width="0.375" height="0.25" fill="#3f3d3a" />
          <rect x="0.125" y="0.75" width="0.25" height="0.125" fill="#3f3d3a" />
          <rect x="0.75" y="0.875" width="0.25" height="0.125" fill="#55534e" />
        </pattern>
        <linearGradient id={p("fade")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0e0d0c" stopOpacity="0" />
          <stop offset="1" stopColor="#0e0d0c" stopOpacity="0.55" />
        </linearGradient>
      </defs>

      {/* Far range */}
      {far.map((h, x) => (
        <rect key={`f${x}`} x={x} y={ROWS - h} width={1.02} height={h} fill="#1b2430" />
      ))}
      {/* Mid hills */}
      {mid.map((h, x) => (
        <rect key={`m${x}`} x={x} y={ROWS - h} width={1.02} height={h} fill="#1d3324" />
      ))}
      {mid.map((h, x) => (
        <rect key={`mt${x}`} x={x} y={ROWS - h} width={1.02} height={0.5} fill="#2b4d34" />
      ))}

      {/* Trees on the ground layer */}
      {treeCols.map((x) => {
        const top = ROWS - ground[x];
        return (
          <g key={`t${x}`}>
            <rect x={x} y={top - 3} width={1} height={3} fill="#5e3a1a" />
            <rect x={x - 2} y={top - 6} width={5} height={3} fill="#2f6b23" />
            <rect x={x - 1} y={top - 7} width={3} height={1} fill="#3b8a2b" />
            <rect x={x - 2} y={top - 6} width={1} height={1} fill="#244f1b" />
            <rect x={x + 1} y={top - 5} width={1} height={1} fill="#3b8a2b" />
          </g>
        );
      })}

      {/* Foreground blocks: grass, dirt, stone */}
      {ground.map((h, x) => {
        const top = ROWS - h;
        return (
          <g key={`g${x}`}>
            <rect x={x} y={top} width={1.02} height={1} fill={`url(#${p("grass")})`} />
            <rect x={x} y={top + 1} width={1.02} height={2} fill={`url(#${p("dirt")})`} />
            <rect x={x} y={top + 3} width={1.02} height={h - 3} fill={`url(#${p("stone")})`} />
          </g>
        );
      })}

      {/* Ore specks */}
      {ores.map((o, i) => {
        const c = o.kind === "diamond" ? "#5ce8e0" : o.kind === "gold" ? "#f5c542" : "#2fe07a";
        return (
          <g key={`o${i}`}>
            <rect x={o.x + 0.25} y={o.y + 0.25} width={0.25} height={0.25} fill={c} />
            <rect x={o.x + 0.625} y={o.y + 0.5} width={0.25} height={0.125} fill={c} />
            <rect x={o.x + 0.125} y={o.y + 0.625} width={0.125} height={0.25} fill={c} />
          </g>
        );
      })}

      <rect x="0" y={ROWS - 4} width={COLS} height="4" fill={`url(#${p("fade")})`} />
    </svg>
  );
}

/** Slow drifting pixel clouds — disabled under reduced motion by global CSS. */
export function PixelClouds() {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-10 h-24 overflow-hidden" aria-hidden="true">
      {[
        { top: "10%", delay: "-12s", w: 120, o: 0.12 },
        { top: "55%", delay: "-38s", w: 80, o: 0.08 },
      ].map((c, i) => (
        <div
          key={i}
          className="absolute animate-drift motion-reduce:hidden"
          style={{ top: c.top, animationDelay: c.delay, opacity: c.o }}
        >
          <svg width={c.w} height={c.w / 4} viewBox="0 0 16 4" shapeRendering="crispEdges">
            <rect x="3" y="0" width="6" height="1" fill="#fff" />
            <rect x="1" y="1" width="12" height="2" fill="#fff" />
            <rect x="0" y="3" width="16" height="1" fill="#fff" />
          </svg>
        </div>
      ))}
    </div>
  );
}
