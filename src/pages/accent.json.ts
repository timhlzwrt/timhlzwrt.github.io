import type { APIRoute } from "astro";
import { ACCENT } from "~/data/accent";
import { accentChoices } from "~/lib/palette";

/**
 * The accent setting as data, for status.tjh.li to read instead of keeping
 * its own copy of the palette. `palette` is exactly what the pre-paint script
 * in Base.astro picks from, so applying the same day-index formula to it
 * lands on the same colour here and there, pinned or daily.
 */
export const GET: APIRoute = () =>
  Response.json({ accent: ACCENT, palette: accentChoices(ACCENT) });
