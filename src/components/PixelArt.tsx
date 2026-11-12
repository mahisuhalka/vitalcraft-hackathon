import type { SVGProps } from "react";

type Palette = Record<string, string>;

interface PixelArtProps extends Omit<SVGProps<SVGSVGElement>, "children"> {
  rows: string[];
  palette: Palette;
  size?: number;
  title?: string;
}

/**
 * Renders a tiny pixel sprite from string rows. "." is transparent.
 * Adjacent same-colour pixels in a row are merged into one rect.
 */
export function PixelArt({ rows, palette, size = 32, title, ...rest }: PixelArtProps) {
  const h = rows.length;
  const w = Math.max(...rows.map((r) => r.length));
  const rects: React.ReactElement[] = [];
  rows.forEach((row, y) => {
    let x = 0;
    while (x < row.length) {
      const c = row[x];
      let run = 1;
      while (x + run < row.length && row[x + run] === c) run++;
      if (c !== "." && palette[c]) {
        rects.push(<rect key={`${x}-${y}`} x={x} y={y} width={run} height={1} fill={palette[c]} />);
      }
      x += run;
    }
  });
  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      width={size}
      height={(size * h) / w}
      shapeRendering="crispEdges"
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      focusable="false"
      {...rest}
    >
      {title ? <title>{title}</title> : null}
      {rects}
    </svg>
  );
}

const K = "#000000";

/* ---- Original sprites ---------------------------------------------------- */

export const SPRITES = {
  chip: {
    palette: { k: K, g: "#f5c542", d: "#a87a12", s: "#2b2b2b", l: "#4a4a4a", e: "#2fe07a" },
    rows: [
      "...g.g.g.g...",
      "...g.g.g.g...",
      ".kkkkkkkkkkk.",
      "gklllllllllkg",
      ".klssssssslk.",
      "gklskkkkkslkg",
      ".klskeeekslk.",
      "gklskeeekslkg",
      ".klskkkkkslk.",
      "gklssssssslkg",
      ".klllllllllk.",
      ".kkkkkkkkkkk.",
      "...g.g.g.g...",
      "...g.g.g.g...",
    ],
  },
  monitor: {
    palette: { k: K, f: "#5d5a55", s: "#0f3336", c: "#5ce8e0", e: "#2fe07a", b: "#8a867f" },
    rows: [
      "kkkkkkkkkkkkkk",
      "kffffffffffffk",
      "kfssssssssssfk",
      "kfsccsssssssfk",
      "kfssccssssssfk",
      "kfsccsseeeesfk",
      "kfssssssssssfk",
      "kfssssssssssfk",
      "kffffffffffffk",
      "kkkkkkkkkkkkkk",
      ".....kbbbk....",
      "...kkkkkkkk...",
    ],
  },
  chest: {
    palette: { k: K, w: "#8b5a2b", d: "#5e3a1a", g: "#f5c542", y: "#a87a12", l: "#b07a3e" },
    rows: [
      ".kkkkkkkkkkkkkk.",
      "kllllllllllllllk",
      "kwwwwwwwwwwwwwwk",
      "kwwwwwwwwwwwwwwk",
      "kddddddkkddddddk",
      "kkkkkkkggkkkkkkk",
      "kwwwwwwgykwwwwwk",
      "kwwwwwwkkwwwwwwk",
      "kwwwwwwwwwwwwwwk",
      "kddddddddddddddk",
      "kkkkkkkkkkkkkkkk",
    ],
  },
  heart: {
    palette: { k: K, r: "#ff5a4e", d: "#b23229", w: "#ffd1cc", e: "#2fe07a" },
    rows: [
      ".kkk...kkk.",
      "krrrk.krrrk",
      "krwrrkrrrdk",
      "krrrrrrrrdk",
      "keeeekeeeek",
      ".krrrrrrdk.",
      "..krrrrdk..",
      "...krrdk...",
      "....kdk....",
      ".....k.....",
    ],
  },
  hourglass: {
    palette: { k: K, w: "#8b5a2b", g: "#f5c542", c: "#5ce8e0" },
    rows: [
      "kkkkkkkkk",
      "kwwwwwwwk",
      ".kcgggck.",
      "..kcggk..",
      "...kgk...",
      "...kck...",
      "..kcgck..",
      ".kcgggck.",
      "kwwwwwwwk",
      "kkkkkkkkk",
    ],
  },
  gem: {
    palette: { k: K, c: "#5ce8e0", d: "#2a9e98", w: "#e6fffd" },
    rows: [
      "..kkkkk..",
      ".kcwccck.",
      "kcwcccddk",
      "kccccdddk",
      ".kccdddk.",
      "..kcddk..",
      "...kdk...",
      "....k....",
    ],
  },
  emerald: {
    palette: { k: K, e: "#2fe07a", d: "#17994f", w: "#c9ffe0" },
    rows: [
      "...kkk...",
      "..kewek..",
      ".kewedek.",
      "kewedddek",
      "keeddddek",
      ".keddddk.",
      "..keddk..",
      "...kkk...",
    ],
  },
  scroll: {
    palette: { k: K, p: "#f2ead8", d: "#cbbf9f", i: "#5d5a55" },
    rows: [
      ".kkkkkkkkkk.",
      "kdppppppppdk",
      ".kpiiiiiipk.",
      ".kppppppppk.",
      ".kpiiiiipk..",
      ".kppppppppk.",
      ".kpiiiiiipk.",
      "kdppppppppdk",
      ".kkkkkkkkkk.",
    ],
  },
  bulb: {
    palette: { k: K, y: "#f5c542", w: "#fff2c4", s: "#8a867f" },
    rows: [
      "..kkkkk..",
      ".kywwyyk.",
      "kywyyyyyk",
      "kyyyyyyyk",
      ".kyyyyyk.",
      "..kyyyk..",
      "..ksssk..",
      "..ksssk..",
      "...kkk...",
    ],
  },
} satisfies Record<string, { palette: Palette; rows: string[] }>;

export type SpriteName = keyof typeof SPRITES;

export function Sprite({
  name,
  size = 32,
  title,
  className,
}: {
  name: SpriteName;
  size?: number;
  title?: string;
  className?: string;
}) {
  const s = SPRITES[name];
  return <PixelArt rows={s.rows} palette={s.palette} size={size} title={title} className={className} />;
}
