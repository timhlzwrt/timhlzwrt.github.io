/**
 * All page copy, in both languages, in one file.
 *
 * Edit here and both locales stay in sync structurally. TypeScript will
 * complain if you add a key to `en` and forget it in `de`.
 *
 * German uses "du" throughout (lowercase, per the 1996 reform). If you ever
 * want to switch to "Sie", the direct-address forms are all in `privacy.body`
 * and `contact.body`.
 */

export const LOCALES = ["en", "de"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "en";

/**
 * The name is split so the initials can be tinted with the accent colour:
 * T, J, H give you tjh.li, without a caption explaining it.
 */
export const NAME_PARTS = [
  { initial: "T", rest: "im" },
  { initial: "J", rest: "onas" },
  { initial: "H", rest: "olzwarth" },
] as const;

/**
 * The page's sections, in order. The status bar numbers its tabs from this
 * and each pane shows the same number, so the two cannot disagree.
 */
export const SECTIONS = ["about", "work", "tools", "privacy", "contact"] as const;
export type SectionId = (typeof SECTIONS)[number];

export const profile = {
  name: "Tim Jonas Holzwarth",
  shortName: "Tim",
  handle: "timhlzwrt",
  domain: "tjh.li",
  url: "https://tjh.li",
  city: "Stuttgart",
  email: "hi@tjh.li",
} as const;

/**
 * The apprenticeship line has to age without being edited. Everything here is
 * evaluated at build time, and the nightly rebuild
 * (.github/workflows/deploy.yml) is what advances it, so the copy is never
 * more than a day out of date.
 */
const TRAINING_START = { year: 2026, month: 7, day: 1 }; // 1 August 2026, month is 0-based
const TRAINING_YEARS = 3;

/** 0 before the start date, then 1, 2, 3 as each anniversary passes. */
function trainingYear(now = new Date()): number {
  const start = Date.UTC(TRAINING_START.year, TRAINING_START.month, TRAINING_START.day);
  if (now.getTime() < start) return 0;

  let year = now.getUTCFullYear() - TRAINING_START.year + 1;
  const beforeAnniversary =
    now.getUTCMonth() < TRAINING_START.month ||
    (now.getUTCMonth() === TRAINING_START.month && now.getUTCDate() < TRAINING_START.day);
  if (beforeAnniversary) year -= 1;

  return Math.min(year, TRAINING_YEARS);
}

/**
 * Opening clause of the apprenticeship paragraph, per locale. Index 0 is the
 * "not started yet" wording; 1 to 3 are the Lehrjahre. Each entry has to read
 * on into the same continuation, so keep them grammatically interchangeable.
 */
const TRAINING_LEAD: Record<Locale, string[]> = {
  en: [
    "From August 2026 I'm training as",
    "I'm in the first year of training as",
    "I'm in the second year of training as",
    "I'm in the third year of training as",
  ],
  de: [
    "Ab August 2026 mache ich eine Ausbildung zum",
    "Ich bin im ersten Lehrjahr meiner Ausbildung zum",
    "Ich bin im zweiten Lehrjahr meiner Ausbildung zum",
    "Ich bin im dritten Lehrjahr meiner Ausbildung zum",
  ],
};

const YEAR = trainingYear();

interface ToolGroup {
  label: string;
  items: string[];
}

interface Content {
  htmlLang: string;
  meta: { title: string; description: string; imageAlt: string };
  nav: Record<SectionId, string>;
  ui: {
    switchTo: string;
    switchLabel: string;
    themeLabel: string;
    skipToContent: string;
    backToTop: string;
    scrollDown: string;
    sectionsLabel: string;
  };
  hero: { role: string; employer: string; pondHint: string; pondHintTouch: string };
  about: { heading: string; body: string[] };
  tools: { heading: string; groups: ToolGroup[] };
  privacy: { heading: string; body: string[]; facts: [string, string][] };
  /**
   * Homelab figures that sit on the water beside the panes, one per gap.
   * The Homelab project says how it runs; these say how much and how fast,
   * so the two never repeat each other. Every number is backed by the
   * private infrastructure repo.
   */
  lab: { facts: { label: string; value: string; text: string }[] };
  work: { heading: string };
  contact: { heading: string; body: string; links: { label: string; href: string }[] };
  notFound: { label: string; body: string; back: string };
  footer: {
    built: string;
    source: string;
    lastPlayed: string;
    status: { label: string; operational: string; issues: string };
  };
}

const en: Content = {
  htmlLang: "en",
  meta: {
    title: "Tim Jonas Holzwarth",
    description:
      "Tim Jonas Holzwarth, training as a Fachinformatiker für Systemintegration at a bank in Stuttgart. Python, Linux and a Proxmox homelab.",
    imageAlt: "Tim Jonas Holzwarth, Fachinformatiker für Systemintegration in training, tjh.li",
  },
  nav: { about: "About", tools: "Tools", privacy: "Privacy", work: "Work", contact: "Contact" },
  ui: {
    switchTo: "Deutsch",
    switchLabel: "Switch language to German",
    themeLabel: "Switch colour theme",
    skipToContent: "Skip to content",
    backToTop: "Back to top",
    scrollDown: "Scroll down",
    sectionsLabel: "Sections",
  },
  hero: {
    role: "Fachinformatiker für Systemintegration",
    employer: "in training at a bank in Stuttgart",
    pondHint: "Click the water to feed the sharks",
    pondHintTouch: "Tap the water to feed the sharks",
  },
  about: {
    heading: "About",
    body: [
      `${TRAINING_LEAD.en[YEAR]} a Fachinformatiker für Systemintegration at a bank in Stuttgart, the infrastructure side of IT. Three years, alternating between the bank and vocational school.`,
      "I mostly write software for problems I have myself, like dsbix for my school's substitution plan, and learn infrastructure by running a homelab. Long term I want to work in security.",
    ],
  },
  tools: {
    heading: "Tools",
    groups: [
      { label: "Comfortable", items: ["Python", "TypeScript", "JavaScript", "Linux", "Bash", "Git"] },
      { label: "Infrastructure", items: ["Proxmox", "Virtualisation", "Networking", "Docker", "Caddy"] },
      { label: "Self-hosted", items: ["Home Assistant", "Immich", "Pi-hole", "Gatus"] },
      { label: "In projects", items: ["Astro", "Tailwind", "GitHub Actions", "Renovate"] },
      { label: "Learning now", items: ["Windows Server", "PowerShell", "Network security"] },
    ],
  },
  privacy: {
    heading: "Privacy",
    body: [
      "This site collects nothing about you. The project data under Work is fetched from GitHub when the site is built, so your browser never contacts GitHub.",
      "It is hosted on GitHub Pages, and GitHub keeps server logs with IP addresses that I have no access to.",
    ],
    facts: [
      ["Cookies", "None"],
      ["Analytics", "None"],
      ["Third-party requests", "None"],
      ["Fonts", "Self-hosted"],
      ["Source", "Public"],
    ],
  },
  lab: {
    facts: [
      {
        label: "Homelab",
        value: "7",
        text: "guests on one Proxmox host",
      },
      {
        label: "Deploys",
        value: "2 min",
        text: "from push to running at home",
      },
      {
        label: "Monitoring",
        value: "10",
        text: "checks a minute, plus a dead man's switch",
      },
      {
        label: "Backups",
        value: "7 of 7",
        text: "guests restored from backup in isolation and verified",
      },
    ],
  },
  work: { heading: "Work" },
  contact: {
    heading: "Contact",
    body: "Email is the quickest way to reach me.",
    links: [
      { label: "Email", href: "mailto:hi@tjh.li" },
      { label: "GitHub", href: "https://github.com/timhlzwrt" },
      { label: "X", href: "https://x.com/timhlzwrt" },
    ],
  },
  notFound: {
    label: "Error",
    body: "There is no page at this address. Maybe a typo, maybe an old link.",
    back: "Back to the start",
  },
  footer: {
    built: "Built with Astro.",
    source: "Source",
    lastPlayed: "Last played",
    status: {
      label: "Status",
      operational: "All systems operational",
      issues: "Degraded performance",
    },
  },
};

const de: Content = {
  htmlLang: "de",
  meta: {
    title: "Tim Jonas Holzwarth",
    description:
      "Tim Jonas Holzwarth, Auszubildender zum Fachinformatiker für Systemintegration bei einer Bank in Stuttgart. Python, Linux und ein Proxmox-Homelab.",
    imageAlt:
      "Tim Jonas Holzwarth, Auszubildender zum Fachinformatiker für Systemintegration, tjh.li",
  },
  nav: {
    about: "Über mich",
    tools: "Werkzeuge",
    privacy: "Datenschutz",
    work: "Projekte",
    contact: "Kontakt",
  },
  ui: {
    switchTo: "English",
    switchLabel: "Sprache auf Englisch umstellen",
    themeLabel: "Farbschema wechseln",
    skipToContent: "Zum Inhalt springen",
    backToTop: "Nach oben",
    scrollDown: "Nach unten scrollen",
    sectionsLabel: "Abschnitte",
  },
  hero: {
    role: "Fachinformatiker für Systemintegration",
    employer: "in Ausbildung bei einer Bank in Stuttgart",
    pondHint: "Klick ins Wasser, um die Haie zu füttern",
    pondHintTouch: "Tipp ins Wasser, um die Haie zu füttern",
  },
  about: {
    heading: "Über mich",
    body: [
      `${TRAINING_LEAD.de[YEAR]} Fachinformatiker für Systemintegration bei einer Bank in Stuttgart, also auf der Infrastrukturseite der IT. Drei Jahre, im Wechsel zwischen Bank und Berufsschule.`,
      "Software schreibe ich meist für Probleme, die ich selbst habe, etwa dsbix für den Vertretungsplan meiner Schule. Infrastruktur lerne ich mit meinem Homelab. Langfristig will ich in die IT-Sicherheit.",
    ],
  },
  tools: {
    heading: "Werkzeuge",
    groups: [
      { label: "Sicher", items: ["Python", "TypeScript", "JavaScript", "Linux", "Bash", "Git"] },
      { label: "Infrastruktur", items: ["Proxmox", "Virtualisierung", "Netzwerke", "Docker", "Caddy"] },
      { label: "Selbst gehostet", items: ["Home Assistant", "Immich", "Pi-hole", "Gatus"] },
      { label: "In Projekten", items: ["Astro", "Tailwind", "GitHub Actions", "Renovate"] },
      { label: "Lerne gerade", items: ["Windows Server", "PowerShell", "Netzwerksicherheit"] },
    ],
  },
  privacy: {
    heading: "Datenschutz",
    body: [
      "Diese Seite sammelt nichts über dich. Die Projektdaten holt sie beim Bauen von GitHub, dein Browser spricht also nie mit GitHub.",
      "Gehostet wird sie auf GitHub Pages, und GitHub speichert Server-Logs mit IP-Adressen, auf die ich keinen Zugriff habe.",
    ],
    facts: [
      ["Cookies", "Keine"],
      ["Analytics", "Keine"],
      ["Anfragen an Dritte", "Keine"],
      ["Schriften", "Selbst gehostet"],
      ["Quellcode", "Öffentlich"],
    ],
  },
  lab: {
    facts: [
      {
        label: "Homelab",
        value: "7",
        text: "Gäste auf einem Proxmox-Host",
      },
      {
        label: "Deployment",
        value: "2 min",
        text: "vom Push, bis es zu Hause läuft",
      },
      {
        label: "Überwachung",
        value: "10",
        text: "Prüfungen pro Minute, dazu ein Totmannschalter",
      },
      {
        label: "Sicherung",
        value: "7 von 7",
        text: "Gästen isoliert aus der Sicherung wiederhergestellt und geprüft",
      },
    ],
  },
  work: { heading: "Projekte" },
  contact: {
    heading: "Kontakt",
    body: "Am schnellsten erreichst du mich per E-Mail.",
    links: [
      { label: "E-Mail", href: "mailto:hi@tjh.li" },
      { label: "GitHub", href: "https://github.com/timhlzwrt" },
      { label: "X", href: "https://x.com/timhlzwrt" },
    ],
  },
  notFound: {
    label: "Fehler",
    body: "Unter dieser Adresse gibt es keine Seite. Vielleicht ein Tippfehler, vielleicht ein alter Link.",
    back: "Zurück zum Anfang",
  },
  footer: {
    built: "Gebaut mit Astro.",
    source: "Quellcode",
    lastPlayed: "Zuletzt gespielt",
    status: {
      label: "Status",
      operational: "Alle Systeme betriebsbereit",
      issues: "Beeinträchtigt",
    },
  },
};

export const content: Record<Locale, Content> = { en, de };
