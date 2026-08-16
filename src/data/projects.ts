/**
 * The curated half of the index. Descriptions and status are yours;
 * language, last-touched date and star counts come from the GitHub API
 * at build time (see `src/lib/github.ts`), so they never go stale here.
 *
 * `repo` must match the GitHub repository name exactly, or the row will
 * simply render without live metadata rather than breaking the build.
 */

export type Status = "live" | "shipped" | "paused" | "unmaintained";

export interface Project {
  name: string;
  repo: string;
  /** One or two sentences. Plain, specific, no adjectives you'd find in a pitch deck. */
  blurb: string;
  status: Status;
  links?: { label: string; href: string }[];
}

export const projects: Project[] = [
  {
    name: "dsbix",
    repo: "dsbix",
    blurb:
      "Reads timetable changes out of DSBmobile, the substitution-plan app most German schools run. A rework of nerrixde's DSBApi, published to PyPI. Every school configures DSBmobile differently, so the field mapping is deliberately left for you to correct.",
    status: "unmaintained",
    links: [
      { label: "PyPI", href: "https://pypi.org/project/dsbix/" },
      { label: "Source", href: "https://github.com/timhlzwrt/dsbix" },
    ],
  },
  {
    name: "dsbixAPI",
    repo: "dsbixAPI",
    blurb:
      "An HTTP layer over dsbix, so anything that isn't Python can read the same data. Deployed on Vercel.",
    status: "live",
    links: [
      { label: "Live", href: "https://dsbix-api.vercel.app" },
      { label: "Source", href: "https://github.com/timhlzwrt/dsbixAPI" },
    ],
  },
  {
    name: "dsbixJS",
    repo: "dsbixJS",
    blurb:
      "The same scraper, translated to JavaScript. Got far enough to be useful and then stopped.",
    status: "paused",
    links: [{ label: "Source", href: "https://github.com/timhlzwrt/dsbixJS" }],
  },
  {
    name: "tjh.li",
    repo: "timhlzwrt.github.io",
    blurb:
      "This site. Astro and hand-written CSS, no client-side JavaScript beyond a theme toggle. The metadata in this table is fetched from the GitHub API when the site builds.",
    status: "live",
    links: [
      { label: "Source", href: "https://github.com/timhlzwrt/timhlzwrt.github.io" },
    ],
  },
];
