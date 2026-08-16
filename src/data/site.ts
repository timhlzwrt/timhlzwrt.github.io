/**
 * Everything you're likely to want to change lives in this file and
 * `projects.ts`. Nothing else needs editing to keep the site current.
 */

export const site = {
  // TODO: GitHub has your name as "Tim " with nothing after it. Add a
  // surname here if you want one on the page; the layout is fine either way.
  name: "Tim",
  handle: "timhlzwrt",
  domain: "tjh.li",
  url: "https://me.tjh.li",
  location: "Germany",
  email: "hi@tjh.li",

  // Shown under the name on the landing page. Two sentences, no more —
  // the projects below are doing the actual talking.
  lede: "I write small tools in Python, mostly for pulling data out of software that would rather keep it. Most of what's here started as a problem at school.",

  links: [
    { label: "GitHub", href: "https://github.com/timhlzwrt" },
    // TODO: your GitHub profile no longer lists a Twitter/X account, but the
    // old site linked this one. Delete the line if it's dead.
    { label: "X", href: "https://x.com/timhlzwrt" },
    { label: "Email", href: "mailto:hi@tjh.li" },
  ],
} as const;

export type Site = typeof site;
