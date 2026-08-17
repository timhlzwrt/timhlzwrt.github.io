# tjh.li

Personal site for Tim Jonas Holzwarth. Astro, static output, bilingual
(English / German), deployed to GitHub Pages at [tjh.li](https://tjh.li).

## Running it

```sh
npm install
npm run dev      # http://localhost:4321
npm run build    # → dist/
npm run preview
npm run check    # types + templates
```

## Editing it

| File                   | What's in it                                                 |
| ---------------------- | ------------------------------------------------------------ |
| `src/i18n/content.ts`  | **All page copy, both languages.** This is the main one.       |
| `src/data/projects.ts` | The work section: one entry per project, blurbs per language |
| `src/layouts/Base.astro` | Head, header, footer, and the pre-paint inline script       |

`content.ts` holds `en` and `de` objects typed against the same interface,
so if you add a key to one and forget the other, `npm run check` fails
rather than silently shipping a missing string.

Project descriptions are hand-written. Language, last-touched date and star
counts are read from the GitHub API **at build time** and baked into the
HTML, so they can't go stale in the source and a visitor's browser never
contacts GitHub. A nightly Actions rebuild keeps them current. If the API
call fails, the build succeeds and those columns are simply omitted.

## Languages

English is at `/`, German at `/de/`. Both are fully static and crawlable,
cross-linked with `hreflang` tags.

Detection uses `navigator.language` rather than IP geolocation: no
third-party lookup, no network request, and correct for a German speaker
abroad. It only
ever redirects `/` → `/de/`, only when the browser prefers German *ahead of*
English, and never once the visitor has used the switcher (the choice is
kept in `localStorage`).

The ordering rule is the easy part to get wrong: a browser sending
`["en-US", "de-DE"]` prefers English, so matching `de` anywhere in the list
would override a stated preference.

## The accent colour

Rerolls on every page load from six muted hues, set by the inline script in
`Base.astro` before first paint. Each hue has a light- and dark-theme
variant; all twelve were checked to clear 4.5:1 contrast against their
background, and they share one lightness so only the hue shifts between
loads. The page never looks heavier or lighter, just differently tinted.

The T, J and H of the name are tinted with it, which is the whole reason the
domain is `tjh.li`.

Change the palette in two places, kept deliberately in sync:

- `Base.astro`: the `palette` array in the inline script (what actually runs)
- `global.css`: `--accent-light` / `--accent-dark` (the no-JavaScript fallback)

## Design

Instrument Serif for display, IBM Plex Mono for everything else. Self-hosted,
Latin subsets only, two weights. Warm paper and ink.

Tokens in `src/styles/global.css` follow shadcn/ui naming (`--background`,
`--foreground`, `--muted-foreground`, `--accent`, …). Nothing depends on
shadcn, but `npx shadcn init` would inherit this palette rather than the
default one.

## Deploying

Pushes to `main` build and deploy via `.github/workflows/deploy.yml`.

### GitHub Pages specifics

Things the host imposes that this repo accounts for:

- **`public/CNAME`**: the custom domain must be in the build output, not
  just the branch root, or it's dropped on every deploy.
- **`public/.nojekyll`**: Jekyll ignores paths beginning with `_`, which
  would strip Astro's entire `_astro/` CSS and font directory.
- **`src/pages/404.astro`**: Pages serves one top-level `404.html` for every
  unmatched path, so it can't know which language was wanted. It shows both.
- **`trailingSlash: "always"`**: Pages serves `de/index.html` at `/de/` and
  301-redirects `/de` to it.

Pages can't set response headers, so there's no custom caching policy and no
CSP. Nothing here needs either: static files, zero third-party requests.

> **Note:** GitHub disables scheduled workflows after 60 days without
> repository activity. If the nightly rebuild stops and the dates go stale,
> re-enable it from the Actions tab, or run it manually via `workflow_dispatch`.

> **Pages source:** must stay on *GitHub Actions* (Settings → Pages).
> `actions/configure-pages` enables Pages when it's off but will **not**
> convert a branch-deploy repo. That needs `build_type=workflow` set on the
> Pages API. Changing the source can also clear the custom domain, so check
> `tjh.li` is still there afterwards.
