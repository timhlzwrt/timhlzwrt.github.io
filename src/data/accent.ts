/**
 * The accent colour the whole site uses. Edit this line, commit to main, and
 * the deploy has it live for every visitor a minute or two later.
 *
 *   "daily"  rotates through the six colours in src/lib/palette.ts, one per
 *            UTC day.
 *   a number is a hue from 0 to 359 and pins that colour until changed. The
 *            six from the palette are 130 moss, 180 teal, 230 blue,
 *            275 violet, 310 plum and 350 rose, and use their tuned pair;
 *            any other hue gets the same lightness and a muted chroma.
 *
 * Anything else fails the build on purpose, so a typo never goes live: the
 * site keeps the last colour that did.
 */
export const ACCENT: "275" | number = "275";
