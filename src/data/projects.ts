/**
 * The curated half of the work section. Descriptions and status are yours;
 * language, last-touched date and star counts come from the GitHub API at
 * build time (see `src/lib/github.ts`), so they never go stale here.
 *
 * `repo` must match the GitHub repository name exactly, or the row renders
 * without live metadata rather than breaking the build.
 */

import type { Locale } from "~/i18n/content";

export type Status = "live" | "shipped" | "paused" | "unmaintained";

export interface Project {
  name: string;
  repo: string;
  status: Status;
  /** One or two sentences per language. Plain and specific. */
  blurb: Record<Locale, string>;
  links?: { label: Record<Locale, string>; href: string }[];
}

/** Status words are short enough to translate inline rather than in content.ts. */
export const statusLabel: Record<Status, Record<Locale, string>> = {
  live: { en: "live", de: "live" },
  shipped: { en: "shipped", de: "fertig" },
  paused: { en: "paused", de: "pausiert" },
  unmaintained: { en: "unmaintained", de: "eingestellt" },
};

const SOURCE = { en: "Source", de: "Quellcode" };

export const projects: Project[] = [
  {
    name: "dsbix",
    repo: "dsbix",
    status: "unmaintained",
    blurb: {
      en: "Reads timetable changes out of DSBmobile, the substitution-plan app most German schools run. A rework of nerrixde's DSBApi, published to PyPI. Every school configures DSBmobile differently, so the field mapping is deliberately left for you to correct.",
      de: "Liest Vertretungsplan-Änderungen aus DSBmobile aus, der App, über die die meisten deutschen Schulen ihren Plan verteilen. Eine Überarbeitung von nerrixdes DSBApi, veröffentlicht auf PyPI. Jede Schule richtet DSBmobile anders ein, deshalb muss das Feld-Mapping bewusst selbst angepasst werden.",
    },
    links: [
      { label: { en: "PyPI", de: "PyPI" }, href: "https://pypi.org/project/dsbix/" },
      { label: SOURCE, href: "https://github.com/timhlzwrt/dsbix" },
    ],
  },
  {
    name: "dsbixAPI",
    repo: "dsbixAPI",
    status: "live",
    blurb: {
      en: "An HTTP layer over dsbix, so anything that isn't Python can read the same data. Deployed on Vercel.",
      de: "Eine HTTP-Schicht über dsbix, damit auch alles, was kein Python ist, dieselben Daten lesen kann. Läuft auf Vercel.",
    },
    links: [
      { label: { en: "Live", de: "Live" }, href: "https://dsbix-api.vercel.app" },
      { label: SOURCE, href: "https://github.com/timhlzwrt/dsbixAPI" },
    ],
  },
  {
    name: "tjh.li",
    repo: "timhlzwrt.github.io",
    status: "live",
    blurb: {
      en: "This site. Astro and hand-written CSS, no tracking of any kind, and an accent colour that picks itself at random on every load. The metadata in this table is fetched from GitHub when the site builds, not when you visit.",
      de: "Diese Seite. Astro und handgeschriebenes CSS, kein Tracking jeglicher Art, und eine Akzentfarbe, die sich bei jedem Laden neu auswürfelt. Die Daten in dieser Tabelle werden beim Bauen der Seite von GitHub geholt, nicht bei deinem Besuch.",
    },
    links: [{ label: SOURCE, href: "https://github.com/timhlzwrt/timhlzwrt.github.io" }],
  },
];
