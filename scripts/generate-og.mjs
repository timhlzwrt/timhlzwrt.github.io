/**
 * Regenerates public/og.png, the social card.
 *
 * Run by hand (`npm run og`), not as part of `npm run build`: the artwork
 * changes about as often as the name on it does, and wiring headless Chromium
 * into CI to redraw a static image every night would be absurd. The output is
 * committed. This file exists so that image is reproducible rather than a
 * binary nobody can edit.
 *
 * Needs `chromium` on PATH. Text and colours are read from the same sources
 * the site uses, so the card cannot drift from the page it represents.
 */

import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { NAME_PARTS, content, profile } from "../src/i18n/content.ts";
import { PALETTE } from "../src/lib/palette.ts";

const root = fileURLToPath(new URL("..", import.meta.url));
const OUT = join(root, "public", "og.png");
const WIDTH = 1200;
const HEIGHT = 630;

/** Inlined as data URIs so Chromium needs no network and no system fonts. */
const font = (pkg, file) =>
  readFileSync(join(root, "node_modules", "@fontsource", pkg, "files", file)).toString("base64");

const serif = font("instrument-serif", "instrument-serif-latin-400-normal.woff2");
const mono400 = font("ibm-plex-mono", "ibm-plex-mono-latin-400-normal.woff2");
const mono500 = font("ibm-plex-mono", "ibm-plex-mono-latin-500-normal.woff2");

const t = content.en;

// The card can't reroll per view, so it takes the first palette entry, the
// same one the no-JS fallback in global.css uses, rather than a colour a
// given visitor may never see.
const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<style>
  @font-face {
    font-family: "Instrument Serif";
    font-weight: 400;
    src: url(data:font/woff2;base64,${serif}) format("woff2");
  }
  @font-face {
    font-family: "IBM Plex Mono";
    font-weight: 400;
    src: url(data:font/woff2;base64,${mono400}) format("woff2");
  }
  @font-face {
    font-family: "IBM Plex Mono";
    font-weight: 500;
    src: url(data:font/woff2;base64,${mono500}) format("woff2");
  }

  :root {
    --background: oklch(0.982 0.006 85);
    --foreground: oklch(0.22 0.012 60);
    --muted-foreground: oklch(0.46 0.012 65);
    --rule: oklch(0.855 0.012 75);
    --accent: ${PALETTE[0][0]};
  }

  * { margin: 0; padding: 0; box-sizing: border-box; }

  body {
    width: ${WIDTH}px;
    height: ${HEIGHT}px;
    display: flex;
    flex-direction: column;
    padding: 60px 72px;
    background: var(--background);
    color: var(--foreground);
    font-family: "IBM Plex Mono", monospace;
    font-feature-settings: "tnum" 1, "zero" 1;
    -webkit-font-smoothing: antialiased;
  }

  .label {
    font-size: 15px;
    font-weight: 500;
    line-height: 1;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--muted-foreground);
  }

  header, footer { display: flex; align-items: baseline; }
  header { justify-content: space-between; border-bottom: 1px solid var(--rule); padding-bottom: 20px; }
  footer { gap: 34px; border-top: 1px solid var(--rule); padding-top: 20px; }

  .domain {
    font-size: 21px;
    font-weight: 500;
    letter-spacing: -0.01em;
  }

  main { flex: 1; display: flex; flex-direction: column; justify-content: center; }

  h1 {
    font-family: "Instrument Serif", serif;
    font-weight: 400;
    font-size: 106px;
    line-height: 0.95;
    letter-spacing: -0.015em;
  }
  .initial { color: var(--accent); }

  .role { margin-top: 30px; font-size: 22px; font-weight: 500; }
  .employer { margin-top: 8px; font-size: 22px; color: var(--muted-foreground); }
</style>
</head>
<body>
  <header>
    <span class="domain">${profile.domain}</span>
    <span class="label">${profile.city}</span>
  </header>

  <main>
    <h1>${NAME_PARTS.map((p) => `<span class="initial">${p.initial}</span>${p.rest}`).join(" ")}</h1>
    <p class="role">${t.hero.role}</p>
    <p class="employer">${t.hero.employer}</p>
  </main>

  <footer>
    ${Object.values(t.nav)
      .map((label) => `<span class="label">${label}</span>`)
      .join("\n    ")}
  </footer>
</body>
</html>
`;

const work = mkdtempSync(join(tmpdir(), "og-"));
const page = join(work, "card.html");
const shot = join(work, "card.png");
writeFileSync(page, html);

execFileSync(
  "chromium",
  [
    "--headless",
    "--disable-gpu",
    "--hide-scrollbars",
    "--force-device-scale-factor=1",
    `--window-size=${WIDTH},${HEIGHT}`,
    // Fonts are inlined, so this is only insurance against a slow first paint.
    "--virtual-time-budget=3000",
    `--screenshot=${shot}`,
    `file://${page}`,
  ],
  { stdio: ["ignore", "ignore", "inherit"] },
);

// Chromium writes a full-colour PNG. The artwork is flat, so a palette costs
// nothing visually and roughly quarters the file.
const out = await sharp(shot).png({ palette: true, effort: 10 }).toBuffer();
writeFileSync(OUT, out);

console.log(`og.png: ${WIDTH}x${HEIGHT}, ${(out.length / 1024).toFixed(1)} kB`);
