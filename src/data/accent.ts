/**
 * The accent colour the whole site uses. The easy way to change it is the
 * "Set accent" workflow (Actions tab, linked from the internal dashboard),
 * which rewrites the line below and deploys. Editing it by hand and pushing
 * to main works the same. Either way it is live a minute or two later, and
 * on status.tjh.li, which reads it from /accent.json, within ten more.
 *
 *   "daily"  rotates through the six colours in src/lib/palette.ts, one per
 *            UTC day.
 *   a number is a hue from 0 to 359 and pins that colour until changed. The
 *            six from the palette are 130 moss, 180 teal, 230 blue,
 *            275 violet, 310 plum and 350 rose, and use their tuned pair;
 *            any other hue gets the same lightness and a muted chroma.
 *   a hex    like "#800020" keeps that colour's hue and strength. Where it is
 *            too faint to read on a theme it is darkened (light mode) or
 *            lightened (dark mode) just enough, so a dark burgundy stays
 *            itself in light mode and turns a lighter wine red in dark.
 *
 * Anything else fails the build on purpose, so a typo never goes live: the
 * site keeps the last colour that did.
 */
export const ACCENT: "daily" | number | `#${string}` = "#701010";
