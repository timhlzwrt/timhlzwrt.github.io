/**
 * The curated half of the work section. Descriptions and status are yours;
 * language, last-touched date and star counts come from the GitHub API at
 * build time (see `src/lib/github.ts`), so they never go stale here.
 *
 * `repo` must match the GitHub repository name exactly, or the row renders
 * without live metadata rather than breaking the build. Leave it out for a
 * project whose repository is private: there is nothing public to show.
 */

import type { Locale } from "~/i18n/content";

export type Status = "live" | "shipped" | "paused" | "unmaintained";

export interface Project {
  name: string;
  repo?: string;
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
const LIVE = { en: "Live", de: "Live" };

export const projects: Project[] = [
  {
    // The repository is private, so no stats and no source link. Keep this
    // to what runs and how, never addresses, ports or what is exposed.
    name: "Homelab",
    status: "live",
    blurb: {
      en: "Home Assistant, Immich and Pi-hole as guests on a Proxmox host. All configuration is in Git; once CI passes, the machines pull the change themselves, so nothing at home is reachable from GitHub. Gatus watches every service and every guest is backed up nightly.",
      de: "Home Assistant, Immich und Pi-hole als Gäste auf einem Proxmox-Host. Die gesamte Konfiguration liegt in Git; ist die CI grün, holen sich die Rechner die Änderung selbst, von GitHub aus ist zu Hause nichts erreichbar. Gatus überwacht jeden Dienst, jeder Gast wird nachts gesichert.",
    },
  },
  {
    name: "Geopolitical Atlas",
    repo: "atlas",
    status: "live",
    blurb: {
      en: "A 3D globe with statistics and history for every country since 1945, leadership records included. Data from the World Bank, Wikidata and Natural Earth.",
      de: "Ein 3D-Globus mit Statistiken und Geschichte jedes Landes seit 1945, inklusive Führungsdaten. Daten von Weltbank, Wikidata und Natural Earth.",
    },
    links: [
      { label: LIVE, href: "https://atlas.tjh.li" },
      { label: SOURCE, href: "https://github.com/timhlzwrt/atlas" },
    ],
  },
  {
    // The library and its HTTP layer (the dsbixAPI repo) are one story, so
    // they share a row; the stats come from the library.
    name: "dsbix",
    repo: "dsbix",
    status: "unmaintained",
    blurb: {
      en: "A Python library on PyPI that reads substitution plans from DSBmobile, which has no public API. Built on nerrixde's DSBApi, with a small HTTP layer for other languages. The field mapping is configurable, since every school sets DSBmobile up differently.",
      de: "Eine Python-Bibliothek auf PyPI, die Vertretungspläne aus DSBmobile ausliest, das keine öffentliche API hat. Basiert auf der DSBApi von nerrixde, dazu eine kleine HTTP-Schicht für andere Sprachen. Das Feld-Mapping ist anpassbar, weil jede Schule DSBmobile anders einrichtet.",
    },
    links: [
      { label: { en: "PyPI", de: "PyPI" }, href: "https://pypi.org/project/dsbix/" },
      { label: SOURCE, href: "https://github.com/timhlzwrt/dsbix" },
      { label: { en: "HTTP layer", de: "HTTP-Schicht" }, href: "https://github.com/timhlzwrt/dsbixAPI" },
    ],
  },
  {
    name: "tjh.li",
    repo: "timhlzwrt.github.io",
    status: "live",
    blurb: {
      en: "This site. Static HTML, rebuilt nightly so the project data stays current. No tracking, no cookies; the pond is about 5 KB of hand-written canvas code.",
      de: "Diese Seite. Statisches HTML, jede Nacht neu gebaut, damit die Projektdaten aktuell bleiben. Kein Tracking, keine Cookies; der Teich ist gut 5 KB selbst geschriebener Canvas-Code.",
    },
    links: [{ label: SOURCE, href: "https://github.com/timhlzwrt/timhlzwrt.github.io" }],
  },
];
