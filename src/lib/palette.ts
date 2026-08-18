/**
 * The six accent hues, one light and one dark variant each.
 *
 * Single source for what used to be three hand-kept copies: the pre-paint
 * script in Base.astro (what actually runs), scripts/generate-og.mjs (which
 * draws the social card at the first entry), and the no-JS fallback in
 * global.css. Only that last one still repeats any values, because CSS
 * cannot import from TypeScript, and it only needs entry zero.
 *
 * Every pair clears 4.5:1 against its own theme's background, and they share
 * one lightness so a reload changes the hue without changing how heavy the
 * page looks. Hue 200 carries slightly less chroma to hold that line.
 *
 * Keep this file import-free: scripts/generate-og.mjs loads it through Node's
 * type stripping, which does not understand the `~/*` alias.
 */
export const PALETTE = [
  ["oklch(0.52 0.09 38)", "oklch(0.745 0.1 38)"],
  ["oklch(0.52 0.09 80)", "oklch(0.745 0.1 80)"],
  ["oklch(0.52 0.09 145)", "oklch(0.745 0.1 145)"],
  ["oklch(0.52 0.085 200)", "oklch(0.745 0.1 200)"],
  ["oklch(0.52 0.09 275)", "oklch(0.745 0.1 275)"],
  ["oklch(0.52 0.09 350)", "oklch(0.745 0.1 350)"],
] as const;
