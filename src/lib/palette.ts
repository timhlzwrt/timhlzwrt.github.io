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
 */
export function accentChoices(accent: "daily" | number): readonly (readonly [string, string])[] {
  if (accent === "daily") return PALETTE;
  if (typeof accent !== "number" || !Number.isFinite(accent) || accent < 0 || accent >= 360) {
    throw new Error(`ACCENT must be "daily" or a hue from 0 to 359, got ${JSON.stringify(accent)}`);
  }
  const tuned = PALETTE.find(([light]) => light.endsWith(` ${accent})`));
  return [tuned ?? [`oklch(0.5 0.06 ${accent})`, `oklch(0.8 0.06 ${accent})`]];
}
