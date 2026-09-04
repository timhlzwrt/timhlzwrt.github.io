# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Tim's personal site (tjh.li, served at the apex; `me.tjh.li` 301s to it). Astro, static output, bilingual
(English / German). Single-page layout per locale (`#about`, `#tools`, `#privacy`,
`#work`, `#contact` sections), no client-side framework, minimal inline JS.

## Commands

```sh
npm install
npm run dev      # http://localhost:4321
npm run build    # → dist/
npm run preview  # serve the built output
npm run check    # astro check: types + template diagnostics
npm run og       # redraw public/og.png (needs chromium; run by hand, output is committed)
```

There is no test suite and no lint script. `npm run check` is the correctness
gate. It fails the build if `en` and `de` content fall out of sync (see
below), so run it after editing anything under `src/i18n/` or `src/data/`.

## Architecture

**Content and rendering are split.** `src/i18n/content.ts` defines a single
`Content` interface and two objects (`en`, `de`) typed against it. Every page
string lives there; nothing is hardcoded in components. Because both locales
satisfy the same interface, adding a key to one and forgetting the other is a
type error, not a silent gap. `src/pages/index.astro` and
`src/pages/de/index.astro` are both just `<Base locale="..."><Home
locale="..." /></Base>` (`Base` is `src/layouts/Base.astro`, the head /
header / footer / pre-paint script; `Home` and everything else is in
`src/components/`). The routing split is locale-only, all real markup lives
in `src/components/`.

**Some copy is derived, not written.** `content.ts` computes `trainingYear()`
from `TRAINING_START` and picks the opening clause of the apprenticeship
paragraph out of `TRAINING_LEAD` (index 0 is "not started yet", 1 to 3 are the
Lehrjahre). It is evaluated at build time, so the nightly rebuild is what
advances it from "first year" to "second year" without an edit. If you change
that sentence, keep every entry in `TRAINING_LEAD` grammatically
interchangeable, since they all read on into the same continuation.

`content.ts` deliberately has no imports: `scripts/generate-og.mjs` loads it
directly through Node's type stripping, which does not understand the `~/*`
alias. Keep new helpers local to the file.

**Locale routing** (`src/i18n/utils.ts`): English is unprefixed (`/`), German
is prefixed (`/de/`). `localePath`/`alternatePath` build cross-locale links
and hreflang tags consistently; `trailingSlash: "always"` (astro.config.mjs)
means every generated path must end in `/`. Language detection happens in an
inline `<script>` in `Base.astro`, run before first paint: it reads
`navigator.languages`, redirects `/` → `/de/` only when German is preferred
*ahead of* English, and never overrides a choice already stored in
`localStorage` under `lang`. The same script also picks the accent colour and
the light/dark theme before paint, to avoid a flash of the wrong one.

`astro.config.mjs` carries one permanent `redirects` entry: `/about/` was a
real page that briefly went live and now 301s to `/#about`. Keep it. The
`me.tjh.li` → apex 301 is a DNS/Pages concern, not in this repo.

**GitHub metadata is fetched at build time, not runtime**
(`src/lib/github.ts`). `fetchRepoStats()` hits the GitHub API once per build
(memoized in-module so Astro's parallel page rendering doesn't issue it
twice), and the result is baked into the static HTML, so visitors' browsers
never contact GitHub. Every failure path (rate limit, network error,
non-200) is non-fatal: the build succeeds and the metadata columns are
simply omitted. `.github/workflows/deploy.yml` runs a nightly scheduled
rebuild (`workflow_dispatch` also available) so the stats don't go stale;
GitHub disables scheduled workflows after 60 days of repo inactivity, so if
dates look stale, check whether the schedule got disabled.

**The "last played" line** (`src/lib/steam.ts`) follows the same contract as
the GitHub metadata: fetched once per build, memoized, baked into the footer,
so visitors never contact Steam. It reads `STEAM_API_KEY` from the
environment and `profile.steam` for the account, accepting either a
SteamID64 or the vanity name from the profile URL and resolving the latter
via `ResolveVanityURL`. With no key (the normal local-dev case) it warns and
the line is omitted; every other failure path behaves the same way, so a
private profile or a rate limit costs the line and not the deploy.

Three things worth knowing before touching it. The label is deliberately
"last played" and not "now playing": the page is static and rebuilt nightly,
so it can be a day behind. Steam *does* expose live in-game status through
`GetPlayerSummaries`, but at build time that only ever captures 06:17 UTC,
which is why it is not used. And it queries `GetOwnedGames` rather than the
smaller `GetRecentlyPlayedGames`, because every entry there carries an
explicit `rtime_last_played` to sort on rather than an assumption about
response order, and because the two-week window on the recently-played
endpoint would make the line disappear during any break instead of just
going stale.

The profile's game details have to be set to Public. A private profile is
not an API error: Steam answers 200 with an empty `response` object, which
is handled as "nothing to show".

**The social card** (`public/og.png`) is committed, not built. `npm run og`
redraws it with `scripts/generate-og.mjs`, which imports the real strings from
`content.ts` and screenshots a headless Chromium page using the same fonts and
tokens as the site, so the card can't drift from the page. Rerun it if the
name, role or `hero.employer` copy changes.

**Brand assets** (`public/brand/`) are committed, not built, exactly like the
social card. `npm run brand` redraws them with `scripts/generate-brand.mjs`,
which imports `content.ts` and `palette.ts` so the avatars and banners cannot
drift from the site. Everything is locked to `PALETTE[0]`, since a profile
picture cannot re-roll its accent the way the site does. See BRAND.md.

**`security.txt` is generated, not static.** It lives at
`src/pages/.well-known/security.txt.ts`, not in `public/`, so that RFC 9116's
`Expires` field rolls six months forward on every build. A static file would
quietly lapse on a date nothing is watching, and consumers must treat an
expired file as invalid.

**Work section data** (`src/data/projects.ts`): hand-written name/blurb/links
per project, with `repo` used to look up live stats from `fetchRepoStats()`.
`repo` must match the GitHub repo name exactly or that row silently renders
without metadata (not a build failure).

**Styling**: Tailwind v4 via `@tailwindcss/vite` (no separate Tailwind config
file, since v4 is CSS-driven). Design tokens in `src/styles/global.css` follow
shadcn/ui naming (`--background`, `--foreground`, `--muted-foreground`,
`--accent`, …) even though nothing in the project depends on shadcn. Fonts
are self-hosted via `@fontsource/*` (Instrument Serif for display, IBM Plex
Mono for everything else), Latin subsets only.

**The accent colour** re-rolls on every page load from six preset hues, each
with a light/dark variant chosen to clear 4.5:1 contrast. All six live in
`src/lib/palette.ts` and reach the pre-paint script in `Base.astro` through
`define:vars`, so the array is not written out by hand there any more.
`scripts/generate-og.mjs` imports the same file for the card. The one
remaining copy is `--accent-light`/`--accent-dark` in `global.css`, the
no-JS fallback, because CSS cannot import from TypeScript; it only repeats
entry zero. Like `content.ts`, `palette.ts` must stay import-free, since the
og script loads it through Node's type stripping.

## GitHub Pages deploy constraints

Deploy is push-to-`main` via `.github/workflows/deploy.yml` (build → upload
Pages artifact → deploy). Things the workflow and repo structure account for
because Pages imposes them:

- `public/CNAME` must land in the build output (not just exist at the branch
  root) or the custom domain is dropped on every deploy.
- `public/.nojekyll` is insurance rather than a requirement. Jekyll does not
  run for Actions-based deploys, and the site served correctly for hours while
  this file was being stripped from the artifact. It matters only if the repo
  ever reverts to branch-based deploys, where Jekyll would ignore `_`-prefixed
  paths and strip Astro's `_astro/` asset directory.
- `include-hidden-files: true` on `upload-pages-artifact` is required.
  Without it the action excludes all dot-entries, silently dropping
  `.well-known/` (breaking `security.txt`) and `.nojekyll`.
- The `pages` concurrency group uses `cancel-in-progress: false` on purpose.
  Cancelling can kill `deploy-pages` after it has created a deployment but
  before it finishes, leaving Pages with a pending deployment that blocks the
  next one. The nightly rebuild and a push still can't race; the loser queues.
- `src/pages/404.astro` is the single top-level `404.html` Pages serves for
  every unmatched path across both locales, so it shows both languages at
  once rather than picking one.
- Pages source must stay set to *GitHub Actions* in Settings → Pages;
  `actions/configure-pages` will enable Pages if it's off but will not
  convert an existing branch-deploy repo (needs `build_type=workflow` via the
  Pages API, already done once). Changing the Pages source can clear the
  custom domain, so verify `tjh.li` still resolves after any such change.
- Pages can't set response headers, so there is deliberately no custom
  caching policy or CSP, and nothing here needs one (static files, zero
  third-party requests at runtime).

## Conventions

- Em-dashes are banned everywhere in this repo, including documentation,
  commit messages and both locales of the site copy. Use a comma, a colon or
  a full stop.
- Path alias `~/*` → `src/*` (tsconfig.json), used throughout instead of
  relative imports.
- German content uses "du" (informal), consistent throughout. See the note
  at the top of `content.ts` before switching any copy to "Sie".
- `GITHUB_TOKEN` is read from the environment at build time to raise the
  GitHub API rate limit (60/hr → 5000/hr); already wired in CI, not needed
  for local dev unless you're iterating on `src/lib/github.ts` and hitting
  the anonymous limit.
