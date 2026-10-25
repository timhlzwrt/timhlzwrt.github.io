/**
 * The six accent hues, one light and one dark variant each.
 *
 * Single source for what used to be three hand-kept copies: the pre-paint
 * script in Base.astro (what actually runs), scripts/generate-og.mjs (which
 * draws the social card at the first entry), and the no-JS fallback in
 * global.css. Only that last one still repeats any values, because CSS
 * cannot import from TypeScript, and it only needs entry zero.
 *
 * Every pair clears 4.5:1 against its own theme's background and the panes,
 * and they share one lightness so picking a new hue never changes how heavy
 * the page looks. Chroma is kept low on purpose, well under what sRGB
 * allows: the page should read as near-neutral with a tint, not as colourful.
 * Nothing between the reds and the yellows, so no day lands on orange.
 *
 * The hue is picked from the date, not the load (see Base.astro), so it's
 * stable across a day rather than per reload now. status.tjh.li reads the
 * active list from /accent.json and uses the same day-index formula, so the
 * two sites land on the same hue. The Set accent workflow maps the colour
 * names to these hues, so a changed hue needs changing there too.
 *
 * Keep this file import-free: scripts/generate-og.mjs loads it through Node's
 * type stripping, which does not understand the `~/*` alias.
 */
export const PALETTE = [
  ["oklch(0.5 0.06 130)", "oklch(0.8 0.07 130)"],
  ["oklch(0.5 0.05 180)", "oklch(0.8 0.06 180)"],
  ["oklch(0.5 0.06 230)", "oklch(0.8 0.06 230)"],
  ["oklch(0.5 0.08 275)", "oklch(0.8 0.06 275)"],
  ["oklch(0.5 0.08 310)", "oklch(0.8 0.06 310)"],
  ["oklch(0.5 0.08 350)", "oklch(0.8 0.06 350)"],
] as const;

/**
 * The colours the site may show for an accent setting (src/data/accent.ts):
 * the whole palette to rotate through for "daily", otherwise the one pair.
 * A palette hue keeps its tuned pair; any other hue gets the palette's
 * lightness and a chroma every hue can hold, so contrast stays above 4.5:1.
 * A hex colour keeps its own hue and chroma, see fromHex.
 */
export function accentChoices(accent: "daily" | number | `#${string}`): readonly (readonly [string, string])[] {
  if (accent === "daily") return PALETTE;
  if (typeof accent === "string" && /^#([0-9a-f]{3}){1,2}$/i.test(accent)) return [fromHex(accent)];
  if (typeof accent !== "number" || !Number.isFinite(accent) || accent < 0 || accent >= 360) {
    throw new Error(`ACCENT must be "daily", a hue from 0 to 359 or a hex colour, got ${JSON.stringify(accent)}`);
  }
  const tuned = PALETTE.find(([light]) => light.endsWith(` ${accent})`));
  return [tuned ?? [`oklch(0.5 0.06 ${accent})`, `oklch(0.8 0.06 ${accent})`]];
}

type Oklch = readonly [l: number, c: number, h: number];

/*
 * The surfaces the accent has to read on, as in global.css: page and pane
 * for each theme. The accent is also a background behind
 * --accent-foreground, which matches one of these, so this covers that too.
 */
const LIGHT_SURFACES: readonly Oklch[] = [[0.968, 0.006, 265], [0.99, 0.003, 265]];
const DARK_SURFACES: readonly Oklch[] = [[0.16, 0.014, 265], [0.2, 0.016, 265]];

/**
 * One pair from a single colour. The hue and chroma stay; the lightness stays
 * too where it already reads on that theme, and otherwise moves just far
 * enough to clear 4.5:1 (darker for light mode, lighter for dark), with the
 * chroma trimmed to what sRGB can show at that lightness. So #800020 stays
 * burgundy in light mode and turns a lighter wine red in dark.
 */
function fromHex(hex: string): [string, string] {
  const digits = hex.length === 4 ? [...hex.slice(1)].map((d) => d + d) : [hex.slice(1, 3), hex.slice(3, 5), hex.slice(5, 7)];
  const source = srgbToOklch(digits.map((d) => parseInt(d, 16) / 255) as [number, number, number]);
  return [css(fit(source, LIGHT_SURFACES, -1)), css(fit(source, DARK_SURFACES, 1))];
}

// Works in the three decimals the CSS is written with, so the value checked
// is exactly the value emitted.
function fit([l, c, h]: Oklch, surfaces: readonly Oklch[], step: -1 | 1): Oklch {
  const round = (v: number) => Math.round(v * 1000) / 1000;
  const backgrounds = surfaces.map((s) => luminance(oklchToLinear(s)));
  for (l = round(l), h = Math.round(h * 10) / 10; ; l = round(Math.min(1, Math.max(0, l + step * 0.005)))) {
    let chroma = Math.floor(c * 1000) / 1000;
    while (chroma > 0 && !inGamut(oklchToLinear([l, chroma, h]))) chroma = round(Math.max(0, chroma - 0.001));
    const y = luminance(oklchToLinear([l, chroma, h]));
    const worst = Math.min(...backgrounds.map((b) => (Math.max(y, b) + 0.05) / (Math.min(y, b) + 0.05)));
    // Black and white both clear 4.5:1 on these surfaces, so this ends.
    if (worst >= 4.5 || l === (step < 0 ? 0 : 1)) return [l, chroma, h];
  }
}

function css([l, c, h]: Oklch): string {
  return `oklch(${l} ${c} ${h})`;
}

// Björn Ottosson's OKLab matrices, https://bottosson.github.io/posts/oklab/
function srgbToOklch(rgb: [number, number, number]): Oklch {
  const [r, g, b] = rgb.map((v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
  const a = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const bb = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
  return [L, Math.hypot(a, bb), ((Math.atan2(bb, a) * 180) / Math.PI + 360) % 360];
}

function oklchToLinear([L, c, h]: Oklch): [number, number, number] {
  const a = c * Math.cos((h * Math.PI) / 180);
  const b = c * Math.sin((h * Math.PI) / 180);
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];
}

function inGamut(rgb: [number, number, number]): boolean {
  return rgb.every((v) => v >= 0 && v <= 1);
}

// WCAG relative luminance, which takes linear sRGB directly.
function luminance([r, g, b]: [number, number, number]): number {
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
