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
      en: "The servers at home: Home Assistant, Immich for photos and Pi-hole as the network's DNS run as guests on a Proxmox host. Every config lives in Git. A push gets checked in CI, and only a green state goes out: the machines fetch it themselves, nothing at home is reachable from GitHub. Gatus checks every service, a dead man's switch speaks up when the checks themselves go quiet, and every guest is backed up nightly.",
      de: "Die Server zu Hause: Home Assistant, Immich für Fotos und Pi-hole als DNS fürs ganze Netz laufen als Gäste auf einem Proxmox-Host. Jede Konfiguration liegt in Git. Ein Push wird in der CI geprüft, und nur ein grüner Stand geht raus: Die Rechner holen ihn selbst ab, von GitHub aus ist zu Hause nichts erreichbar. Gatus prüft jeden Dienst, ein Totmannschalter meldet sich, wenn die Prüfungen selbst verstummen, und jeder Gast wird jede Nacht gesichert.",
    },
  },
  {
    name: "Geopolitical Atlas",
    repo: "atlas",
    status: "live",
    blurb: {
      en: "A 3D globe on which you can explore the statistics and history of every country since 1945, leadership records included. Every fact is sourced from the World Bank, Wikidata and Natural Earth; nothing is fabricated.",
      de: "Ein 3D-Globus, auf dem man Statistiken und Geschichte jedes Landes seit 1945 erkunden kann, inklusive Führungsdaten. Jede Angabe stammt aus Weltbank, Wikidata und Natural Earth, nichts ist erfunden.",
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
      en: "My school's substitution plan lived in DSBmobile, which has no public API. dsbix reads it anyway: a Python library built on nerrixde's DSBApi and published to PyPI, plus a small HTTP layer so other languages can get at the data too. Every school sets DSBmobile up differently, so the field mapping is deliberately left adjustable.",
      de: "Der Vertretungsplan meiner Schule lag in DSBmobile, und DSBmobile hat keine öffentliche API. dsbix liest ihn trotzdem aus: eine Python-Bibliothek auf Basis der DSBApi von nerrixde, veröffentlicht auf PyPI, dazu eine kleine HTTP-Schicht, damit auch andere Sprachen an die Daten kommen. Weil jede Schule DSBmobile anders einrichtet, bleibt das Feld-Mapping bewusst anpassbar.",
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
      en: "This site: static HTML, rebuilt every night so the project data stays current without your visit asking GitHub. No tracking, no cookies, and the water and the sharks are about 5 KB of hand-written canvas code rather than a library.",
      de: "Diese Seite: statisches HTML, das jede Nacht neu gebaut wird, damit die Projektdaten aktuell bleiben, ohne dass dein Besuch GitHub fragt. Kein Tracking, keine Cookies, und Wasser und Haie sind gut 5 KB selbst geschriebener Canvas-Code statt einer Bibliothek.",
    },
    links: [{ label: SOURCE, href: "https://github.com/timhlzwrt/timhlzwrt.github.io" }],
  },
];
