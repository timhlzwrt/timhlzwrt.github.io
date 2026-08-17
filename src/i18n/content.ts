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
 * The name is split so the initials can be tinted with the (randomised)
 * accent colour: T, J, H give you tjh.li, without a caption explaining it.
 */
export const NAME_PARTS = [
  { initial: "T", rest: "im" },
  { initial: "J", rest: "onas" },
  { initial: "H", rest: "olzwarth" },
] as const;

export const profile = {
  name: "Tim Jonas Holzwarth",
  shortName: "Tim",
  handle: "timhlzwrt",
  domain: "tjh.li",
  url: "https://tjh.li",
  city: "Stuttgart",
  email: "hi@tjh.li",
  supportEmail: "help@tjh.li",
  github: "https://github.com/timhlzwrt",
} as const;

interface SkillGroup {
  label: string;
  items: string[];
}

interface Content {
  htmlLang: string;
  meta: { title: string; description: string };
  nav: { about: string; skills: string; privacy: string; work: string; contact: string };
  ui: {
    switchTo: string;
    switchLabel: string;
    themeLabel: string;
    skipToContent: string;
    entries: (n: number) => string;
    backToTop: string;
  };
  hero: { role: string; employer: string; lede: string };
  about: { heading: string; body: string[] };
  skills: { heading: string; note: string; groups: SkillGroup[] };
  privacy: { heading: string; body: string[]; facts: [string, string][] };
  work: { heading: string; note: string };
  contact: { heading: string; body: string; links: { label: string; href: string }[] };
  notFound: { label: string; body: string; back: string };
  footer: { built: string; source: string };
}

const en: Content = {
  htmlLang: "en",
  meta: {
    title: "Tim Jonas Holzwarth",
    description:
      "Tim Jonas Holzwarth. Training as a Fachinformatiker für Systemintegration at a bank in Stuttgart. Python, Linux, a Proxmox homelab, and a stubborn interest in privacy.",
  },
  nav: { about: "About", skills: "Tools", privacy: "Privacy", work: "Work", contact: "Contact" },
  ui: {
    switchTo: "Deutsch",
    switchLabel: "Switch language to German",
    themeLabel: "Switch colour theme",
    skipToContent: "Skip to content",
    entries: (n) => `${n} ${n === 1 ? "entry" : "entries"}`,
    backToTop: "Back to top",
  },
  hero: {
    role: "Fachinformatiker für Systemintegration",
    employer: "in training at a bank in Stuttgart",
    lede:
      "Three years learning to build and run the systems a bank runs on. Before that, Python tools for getting data out of software that did not want to give it up.",
  },
  about: {
    heading: "About",
    body: [
      "I've been taking computers apart since long before anyone paid me for it. Most of what I know started with needing something that did not exist yet.",
      "My school used DSBmobile for its substitution plan and it had no public API, so I wrote dsbix to read it anyway. It ended up on PyPI, which was not the plan.",
      "From August 2026 I'm training as a Fachinformatiker für Systemintegration at a bank in Stuttgart. Systemintegration is the infrastructure side of the job: networks, servers, the things that have to stay up. Three years, alternating between the bank and vocational school.",
      "At home I run a small Proxmox box with Home Assistant on it. Nothing elaborate, but misconfiguring your own server teaches you more than reading about it.",
      "Security is where I want to end up. I have not decided which certifications are worth it yet.",
    ],
  },
  skills: {
    heading: "Tools",
    note: "What I use, and what I am still learning.",
    groups: [
      { label: "Comfortable", items: ["Python", "JavaScript", "Git", "Linux"] },
      { label: "Homelab", items: ["Proxmox", "Home Assistant", "Self-hosting"] },
      { label: "Learning", items: ["Networking", "Windows Server", "Virtualisation", "PowerShell"] },
      { label: "Around", items: ["Astro", "Docker", "Bash", "REST APIs"] },
    ],
  },
  privacy: {
    heading: "Privacy",
    body: [
      "Most software treats the data you generate as its own. I would rather build things that do not, so this site collects nothing about you.",
      "The repository data below was fetched when the site was built, not when you opened it. Your browser never talks to GitHub. The network tab will confirm all of it.",
    ],
    facts: [
      ["Cookies", "None"],
      ["Analytics", "None"],
      ["Third-party requests", "None"],
      ["Fonts", "Self-hosted"],
      ["Source", "Public"],
    ],
  },
  work: { heading: "Work", note: "Small things, built because they did not exist." },
  contact: {
    heading: "Contact",
    body: "Email is the fastest way to reach me.",
    links: [
      { label: "Email", href: "mailto:hi@tjh.li" },
      { label: "GitHub", href: "https://github.com/timhlzwrt" },
      { label: "X", href: "https://x.com/timhlzwrt" },
    ],
  },
  notFound: {
    label: "Error",
    body: "Wrong address, or something that used to be here and is not any more.",
    back: "Back to the start",
  },
  footer: { built: "Built with Astro.", source: "Source" },
};

const de: Content = {
  htmlLang: "de",
  meta: {
    title: "Tim Jonas Holzwarth",
    description:
      "Tim Jonas Holzwarth, Auszubildender zum Fachinformatiker für Systemintegration bei einer Bank in Stuttgart. Python, Linux, ein Proxmox-Homelab und ein hartnäckiges Interesse an Datenschutz.",
  },
  nav: {
    about: "Über mich",
    skills: "Werkzeuge",
    privacy: "Datenschutz",
    work: "Projekte",
    contact: "Kontakt",
  },
  ui: {
    switchTo: "English",
    switchLabel: "Sprache auf Englisch umstellen",
    themeLabel: "Farbschema wechseln",
    skipToContent: "Zum Inhalt springen",
    entries: (n) => `${n} ${n === 1 ? "Eintrag" : "Einträge"}`,
    backToTop: "Nach oben",
  },
  hero: {
    role: "Fachinformatiker für Systemintegration",
    employer: "in Ausbildung bei einer Bank in Stuttgart",
    lede:
      "Drei Jahre lang lernen, die Systeme zu bauen und zu betreiben, auf die eine Bank angewiesen ist. Davor Python-Tools, um Daten aus Software zu holen, die sie nicht herausgeben wollte.",
  },
  about: {
    heading: "Über mich",
    body: [
      "Ich habe schon Computer zerlegt, lange bevor mich jemand dafür bezahlt hat. Das meiste habe ich gelernt, weil ich etwas gebraucht habe, das es noch nicht gab.",
      "Meine Schule hat für den Vertretungsplan DSBmobile benutzt, eine ziemlich schlechte App ohne öffentliche API. Also habe ich dsbix geschrieben, um ihn trotzdem auszulesen. Gelandet ist es auf PyPI, was so nicht geplant war.",
      "Ab August 2026 mache ich eine Ausbildung zum Fachinformatiker für Systemintegration bei einer Bank in Stuttgart. Systemintegration ist die Infrastrukturseite des Berufs: Netzwerke, Server, die Dinge, die laufen müssen. Drei Jahre, im Wechsel zwischen Bank und Berufsschule.",
      "Zu Hause läuft ein kleiner Proxmox-Rechner mit Home Assistant. Nichts Großes, aber den eigenen Server falsch zu konfigurieren bringt einem mehr bei, als darüber zu lesen.",
      "Security ist die Richtung, in die es gehen soll. Welche Zertifikate sich lohnen, weiß ich noch nicht.",
    ],
  },
  skills: {
    heading: "Werkzeuge",
    note: "Was ich benutze und was ich noch lerne.",
    groups: [
      { label: "Sicher", items: ["Python", "JavaScript", "Git", "Linux"] },
      { label: "Homelab", items: ["Proxmox", "Home Assistant", "Selfhosting"] },
      { label: "Am Lernen", items: ["Netzwerke", "Windows Server", "Virtualisierung", "PowerShell"] },
      { label: "Schon benutzt", items: ["Astro", "Docker", "Bash", "REST-APIs"] },
    ],
  },
  privacy: {
    heading: "Datenschutz",
    body: [
      "Die meiste Software behandelt die Daten, die man erzeugt, als wären es ihre eigenen. Ich baue lieber Sachen, die das nicht tun, also sammelt diese Seite nichts über dich.",
      "Die Repository-Daten unten wurden beim Bauen der Seite geholt, nicht beim Öffnen. Dein Browser spricht nie mit GitHub. Im Netzwerk-Tab lässt sich das nachprüfen.",
    ],
    facts: [
      ["Cookies", "Keine"],
      ["Analytics", "Keine"],
      ["Anfragen an Dritte", "Keine"],
      ["Schriften", "Selbst gehostet"],
      ["Quellcode", "Öffentlich"],
    ],
  },
  work: { heading: "Projekte", note: "Kleine Sachen, gebaut, weil es sie nicht gab." },
  contact: {
    heading: "Kontakt",
    body: "Per E-Mail erreichst du mich am schnellsten.",
    links: [
      { label: "E-Mail", href: "mailto:hi@tjh.li" },
      { label: "GitHub", href: "https://github.com/timhlzwrt" },
      { label: "X", href: "https://x.com/timhlzwrt" },
    ],
  },
  notFound: {
    label: "Fehler",
    body: "Falsche Adresse oder etwas, das es mal gab und jetzt nicht mehr.",
    back: "Zurück zum Anfang",
  },
  footer: { built: "Gebaut mit Astro.", source: "Quellcode" },
};

export const content: Record<Locale, Content> = { en, de };
