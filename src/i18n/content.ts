/**
 * All page copy, in both languages, in one file.
 *
 * Edit here and both locales stay in sync structurally — TypeScript will
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
 * accent colour — T, J, H → tjh.li, without a caption explaining the joke.
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
  url: "https://me.tjh.li",
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
      "Three years learning to build and run the systems a bank depends on. Before that I wrote Python tools to get data out of software that would rather have kept it.",
  },
  about: {
    heading: "About",
    body: [
      "I've been taking things apart on a computer since well before anyone was paying me for it. Most of what I know I learned by needing something to exist and finding that it didn't.",
      "My school ran its substitution plan through DSBmobile, an app with no public API and no apparent interest in having one. dsbix began as a way to read it anyway, and turned into a package other people install, which was not the plan.",
      "I'm training as a Fachinformatiker für Systemintegration at a bank in Stuttgart, starting August 2026. Systemintegration is the side of the job concerned with infrastructure rather than applications: networks, servers, the parts that have to stay up. It's a three-year dual programme, so it alternates between the bank and vocational school.",
      "At home there's a small Proxmox box running Home Assistant and whatever else I feel like breaking that week. Nothing elaborate, but it's the fastest way I've found to learn how infrastructure actually behaves once you've misconfigured it.",
      "Security is the direction I'd like this to go. I haven't worked out yet which certifications are worth the time, so for now it's reading, breaking my own things, and paying attention.",
    ],
  },
  skills: {
    heading: "Tools",
    note: "Split honestly between what I use and what I'm still learning.",
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
      "Most software treats the data you generate as though it were the software's property. I don't accept that as settled, and I'd rather argue the point by building things that don't do it than by writing a manifesto about it.",
      "So: this site sets no cookies. It runs no analytics and has no idea you're here. It loads nothing from a third party, the fonts are served from this domain, not from Google, and there is no CDN in the path. It makes no network request you didn't ask for by typing the address.",
      "The repository metadata further down was fetched once, when the site was built, on a machine that isn't yours. Your browser does not talk to GitHub. You can verify all of this in the network tab, which is rather the point.",
    ],
    facts: [
      ["Cookies", "None"],
      ["Analytics", "None"],
      ["Third-party requests", "None"],
      ["Fonts", "Self-hosted"],
      ["Source", "Public"],
    ],
  },
  work: { heading: "Work", note: "Small things, mostly built because they didn't exist." },
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
    body: "That page isn't here. Wrong address, or something that used to exist and doesn't any more.",
    back: "Back to the start",
  },
  footer: { built: "Built with Astro.", source: "Source" },
};

const de: Content = {
  htmlLang: "de",
  meta: {
    title: "Tim Jonas Holzwarth",
    description:
      "Tim Jonas Holzwarth, Auszubildender Fachinformatiker für Systemintegration bei einer Bank in Stuttgart. Python, Linux, ein Proxmox-Homelab und ein hartnäckiges Interesse an Datenschutz.",
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
      "Drei Jahre lang lernen, die Systeme zu bauen und zu betreiben, auf die sich eine Bank verlässt. Davor habe ich Python-Tools geschrieben, um Daten aus Software zu holen, die sie lieber behalten hätte.",
  },
  about: {
    heading: "Über mich",
    body: [
      "Ich zerlege Dinge am Rechner, seit lange bevor mich jemand dafür bezahlt hat. Das meiste habe ich gelernt, weil ich etwas gebraucht habe, das es noch nicht gab.",
      "Meine Schule hat ihren Vertretungsplan über DSBmobile laufen lassen, eine (argumentativ schlechte) App ohne öffentliche API und ohne erkennbares Interesse daran, eine zu haben. dsbix ist als Weg entstanden, sie trotzdem auszulesen, und daraus wurde ein Paket, das andere Leute installieren. So war das nicht geplant.",
      "Ich mache eine Ausbildung zum Fachinformatiker für Systemintegration bei einer Bank in Stuttgart, Start im August 2026. Systemintegration ist die Seite des Berufs, die sich um Infrastruktur statt um Anwendungen kümmert: Netzwerke, Server, die Teile, die laufen müssen. Die Ausbildung ist dual und dauert drei Jahre, wechselt also zwischen Bank und Berufsschule.",
      "Zu Hause läuft ein kleiner Proxmox-Rechner mit Home Assistant und allem anderen, was ich gerade kaputt machen will. Nichts Großes, aber der schnellste Weg, den ich kenne, um zu lernen, wie sich Infrastruktur wirklich verhält, wenn man sie einmal falsch konfiguriert hat.",
      "Security ist die Richtung, in die es gehen soll. Welche Zertifikate die Zeit wert sind, habe ich noch nicht herausgefunden, also bleibt es erstmal bei Lesen, eigene Sachen kaputt machen und aufmerksam sein.",
    ],
  },
  skills: {
    heading: "Werkzeuge",
    note: "Ehrlich getrennt nach dem, was ich benutze, und dem, was ich noch lerne.",
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
      "Die meiste Software behandelt die Daten, die man erzeugt, als wären sie ihr Eigentum. Ich halte das nicht für ausgemacht, und ich streite darüber lieber, indem ich Dinge baue, die es anders machen, als indem ich ein Manifest schreibe.",
      "Also: Diese Seite setzt keine Cookies ein. Sie hat kein Analytics und weiß nicht, dass du hier bist. Sie lädt nichts von Dritten, die Schriften kommen von dieser Domain, nicht von Google, und es liegt kein CDN dazwischen. Sie stellt keine Anfrage, die du nicht durch Eingabe der Adresse selbst ausgelöst hast.",
      "Die Repository-Daten weiter unten wurden einmal abgerufen, beim Bauen der Seite, auf einem Rechner, der dir nicht gehört. Dein Browser spricht nicht mit GitHub. Das lässt sich alles im Netzwerk-Tab nachprüfen, und genau darum geht es.",
    ],
    facts: [
      ["Cookies", "Keine"],
      ["Analytics", "Keine"],
      ["Anfragen an Dritte", "Keine"],
      ["Schriften", "Selbst gehostet"],
      ["Quellcode", "Öffentlich"],
    ],
  },
  work: { heading: "Projekte", note: "Kleine Sachen, meistens gebaut, weil es sie noch nicht gab." },
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
    body: "Diese Seite gibt es nicht. Falsche Adresse, oder etwas, das es mal gab und jetzt nicht mehr.",
    back: "Zurück zum Anfang",
  },
  footer: { built: "Gebaut mit Astro.", source: "Quellcode" },
};

export const content: Record<Locale, Content> = { en, de };
