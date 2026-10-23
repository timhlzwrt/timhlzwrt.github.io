/**
 * Regenerates public/og.png, the social card.
 *
 * Run by hand (`npm run og`), not as part of `npm run build`: the artwork
 * changes about as often as the name on it does, and wiring headless Chromium
 * into CI to redraw a static image every night would be absurd. The output is
 * committed. This file exists so that image is reproducible rather than a
 * binary nobody can edit.
 *
 * Needs Chromium: `chromium` on PATH, or its path in CHROMIUM. Text and
 * colours are read from the same sources the site uses, so the card cannot
 * drift from the page it represents.
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
  readFileSync(join(root, "node_modules", pkg, "files", file)).toString("base64");

const sans = font("@fontsource-variable/mona-sans", "mona-sans-latin-wdth-normal.woff2");
const mono500 = font("@fontsource/ibm-plex-mono", "ibm-plex-mono-latin-500-normal.woff2");

const t = content.en;

// The dark theme, because the card is shown in feeds of either colour and
// the dark one is where the pond's light shows. It can't reroll per view, so
// it takes the first palette entry, the same one the no-JS fallback in
// global.css uses, rather than a colour a given visitor may never see.
const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<style>
  @font-face {
    font-family: "Mona Sans";
    font-weight: 200 900;
    font-stretch: 75% 125%;
    src: url(data:font/woff2;base64,${sans}) format("woff2");
  }
  @font-face {
    font-family: "IBM Plex Mono";
    font-weight: 500;
    src: url(data:font/woff2;base64,${mono500}) format("woff2");
  }

  :root {
    --background: oklch(0.16 0.014 265);
    --foreground: oklch(0.94 0.008 265);
    --muted-foreground: oklch(0.7 0.016 265);
    --accent: ${PALETTE[0][1]};
  }

  * { margin: 0; padding: 0; box-sizing: border-box; }

  body {
    width: ${WIDTH}px;
    height: ${HEIGHT}px;
    background: var(--background);
    color: var(--foreground);
    font-family: "Mona Sans", sans-serif;
    -webkit-font-smoothing: antialiased;
  }

  canvas { position: absolute; inset: 0; width: 100%; height: 100%; image-rendering: pixelated; }

  main {
    position: relative;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 0 80px;
  }

  .label {
    font-family: "IBM Plex Mono", monospace;
    font-size: 16px;
    font-weight: 500;
    line-height: 1;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--muted-foreground);
  }

  h1 {
    margin-top: 28px;
    font-size: 112px;
    font-weight: 800;
    font-stretch: 125%;
    line-height: 0.86;
    letter-spacing: -0.045em;
  }
  h1 span { display: block; }
  .initial { display: inline; color: var(--accent); }

  .role { margin-top: 36px; font-size: 26px; line-height: 1.3; }
  .role b { font-weight: 600; }
  .role span { color: var(--muted-foreground); }
</style>
</head>
<body>
  <canvas id="light"></canvas>
  <main>
    <p class="label">${profile.domain}</p>
    <h1>${NAME_PARTS.map((p) => `<span><span class="initial">${p.initial}</span>${p.rest}</span>`).join("")}</h1>
    <p class="role"><b>${t.hero.role}</b> <span>${t.hero.employer}</span></p>
  </main>
  <script>
    // The pond's moonlight, same dither and formula as Pond.astro, with the
    // dot scaled up a little for a card that is always shown shrunk.
    const BAYER = [0,32,8,40,2,34,10,42,48,16,56,24,50,18,58,26,12,44,4,36,14,46,6,38,60,28,52,20,
      62,30,54,22,3,35,11,43,1,33,9,41,51,19,59,27,49,17,57,25,15,47,7,39,13,45,5,37,63,31,55,23,61,
      29,53,21];
    const c = document.getElementById("light");
    const w = (c.width = Math.ceil(innerWidth / 4));
    const h = (c.height = Math.ceil(innerHeight / 4));
    const ctx = c.getContext("2d");
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue("--foreground");
    ctx.globalAlpha = 0.14;
    const sx = w * 0.78, sy = -h * 0.2, reach = Math.max(w, h) * 0.8;
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const level = Math.max(0, 1 - Math.hypot(x - sx, y - sy) / reach) ** 2 * 0.7;
        if (level > (BAYER[(y & 7) * 8 + (x & 7)] + 0.5) / 64) ctx.fillRect(x, y, 1, 1);
      }
    }
  </script>
</body>
</html>
`;

const work = mkdtempSync(join(tmpdir(), "og-"));
const page = join(work, "card.html");
const shot = join(work, "card.png");
writeFileSync(page, html);

execFileSync(
  process.env.CHROMIUM ?? "chromium",
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
