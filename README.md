# tjh.li

Personal site. Astro, static output, deployed to GitHub Pages at
[me.tjh.li](https://me.tjh.li).

## Running it

```sh
npm install
npm run dev      # http://localhost:4321
npm run build    # → dist/
npm run preview
npm run check    # types + templates
```

## Editing it

Almost everything you'll want to change lives in two files:

| File                   | What's in it                                            |
| ---------------------- | ------------------------------------------------------- |
| `src/data/site.ts`     | Name, contact, the one-paragraph intro, social links     |
| `src/data/projects.ts` | The index — one entry per project, with your description |

Project descriptions and status are hand-written. Language, last-touched
date and star counts are read from the GitHub API **at build time** and
baked into the HTML, so they can't go stale in the source and the page
needs no JavaScript to show them. A nightly GitHub Action rebuild keeps
them current.

If the API call fails — rate limit, no network — the build still succeeds
and those columns are simply omitted.

Longer prose lives directly in `src/pages/about.astro`.

## Design

Two typefaces, self-hosted, Latin subsets only: Instrument Serif for
display, IBM Plex Mono for everything else. Colour is a warm paper/ink
pair plus a single vermillion accent.

Tokens are in `src/styles/global.css`, named to shadcn/ui's convention
(`--background`, `--foreground`, `--muted-foreground`, `--accent`, …).
Nothing here depends on shadcn, but if you ever run `npx shadcn init`
the components will pick up this palette instead of the default one.

## Deploying

Pushes to `main` build and deploy via `.github/workflows/deploy.yml`.

> **One-time setup:** in the repo's *Settings → Pages*, set **Source** to
> **GitHub Actions**. This repo previously deployed straight from the
> branch root; that mode serves the source files rather than the build.
> After switching, check that the custom domain is still set to
> `me.tjh.li` and that *Enforce HTTPS* is ticked — changing the source
> can clear the domain field.

### GitHub Pages specifics

Things the host imposes that this repo already accounts for:

- **`public/CNAME`** — the custom domain has to be part of the build
  output, not just the branch root, or it's lost on every deploy.
- **`public/.nojekyll`** — Jekyll ignores paths beginning with `_`, which
  would strip Astro's entire `_astro/` CSS and font directory. The Actions
  deploy doesn't run Jekyll, so this is only insurance against a future
  switch back to branch-based deploys, but it costs nothing.
- **`src/pages/404.astro`** — Pages serves a top-level `404.html` for any
  unmatched path, custom domains included.
- **`trailingSlash: "always"`** — Pages serves `about/index.html` at
  `/about/` and 301-redirects `/about` to it. Being explicit keeps the
  nav, canonicals and sitemap from disagreeing or bouncing through a
  redirect.

Pages can't set response headers, so there's no custom caching policy and
no CSP. Nothing here needs either — the site is static files with no
third-party requests at runtime.

> **Note:** GitHub disables scheduled workflows after 60 days without
> repository activity. If the nightly rebuild stops and the index dates
> go stale, re-enable it from the Actions tab — or just run the workflow
> manually, it has `workflow_dispatch`.
