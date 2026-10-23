/**
 * Regenerates the brand assets in public/brand/ and the favicon.
 *
 * Run by hand (`npm run brand`), like the social card and for the same
 * reason: the artwork changes about as often as the name on it does, and the
 * output is committed. This file exists so those PNGs are reproducible
 * rather than binaries nobody can edit.
 *
 * Text, colours and fonts are read from the same sources the site uses, so
 * the assets cannot drift from the page they represent.
 *
 * Needs Chromium: `chromium` on PATH, or its path in CHROMIUM.
 */

import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { NAME_PARTS, content, profile } from "../src/i18n/content.ts";

const root = fileURLToPath(new URL("..", import.meta.url));
const OUT = join(root, "public", "brand");
mkdirSync(OUT, { recursive: true });

/** Inlined as data URIs so Chromium needs no network and no system fonts. */
const font = (pkg, file) =>
  readFileSync(join(root, "node_modules", pkg, "files", file)).toString("base64");

const sans = font("@fontsource-variable/mona-sans", "mona-sans-latin-wdth-normal.woff2");
const mono500 = font("@fontsource/ibm-plex-mono", "ibm-plex-mono-latin-500-normal.woff2");

/**
 * The site's own theme tokens (src/styles/global.css), dark and light.
 *
 * Monochrome on purpose. The accent re-rolls daily on the site, so any one
 * hue frozen into a profile picture would be wrong five days in six. The
 * identity is carried by the type and the dithered light instead.
 */
const DARK = {
  bg: "oklch(0.16 0.014 265)",
  fg: "oklch(0.94 0.008 265)",
  muted: "oklch(0.7 0.016 265)",
};
const LIGHT = {
  bg: "oklch(0.968 0.006 265)",
  fg: "oklch(0.2 0.02 265)",
  muted: "oklch(0.48 0.018 265)",
};

const t = content.en;

const FACE = `
  @font-face { font-family: "Mona Sans"; font-weight: 200 900; font-stretch: 75% 125%;
    src: url(data:font/woff2;base64,${sans}) format("woff2"); }
  @font-face { font-family: "IBM Plex Mono"; font-weight: 500;
    src: url(data:font/woff2;base64,${mono500}) format("woff2"); }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  .display { font-family: "Mona Sans"; font-weight: 800; font-stretch: 125%; }
  .label { font-family: "IBM Plex Mono"; font-weight: 500; line-height: 1;
    letter-spacing: 0.14em; text-transform: uppercase; }
  canvas { position: absolute; inset: 0; width: 100%; height: 100%; image-rendering: pixelated; }
  main { position: relative; width: 100%; height: 100%; }
`;

/**
 * The pond's light, as Pond.astro paints it: an 8x8 Bayer dither of moonlight
 * falling in from above in the dark theme, the deep end darkening toward the
 * bottom in the light one. Same formula and opacity as the site, only the dot
 * is scaled up so it still reads as a dot once a platform shrinks the image.
 * `from` is where across the top the moon sits: the site's 0.78 on the
 * banners, the middle on the square marks so they stay symmetric.
 */
const light = (theme, dot, from = 0.78) => `
  <canvas id="light"></canvas>
  <script>
    const BAYER = [0,32,8,40,2,34,10,42,48,16,56,24,50,18,58,26,12,44,4,36,14,46,6,38,60,28,52,20,
      62,30,54,22,3,35,11,43,1,33,9,41,51,19,59,27,49,17,57,25,15,47,7,39,13,45,5,37,63,31,55,23,61,
      29,53,21];
    const dark = ${theme === DARK};
    const c = document.getElementById("light");
    const w = (c.width = Math.ceil(innerWidth / ${dot}));
    const h = (c.height = Math.ceil(innerHeight / ${dot}));
    const ctx = c.getContext("2d");
    ctx.fillStyle = "${theme === DARK ? theme.fg : theme.muted}";
    ctx.globalAlpha = dark ? 0.14 : 0.1;
    const sx = w * ${from}, sy = -h * 0.2, reach = Math.max(w, h) * 0.8;
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const level = dark
          ? Math.max(0, 1 - Math.hypot(x - sx, y - sy) / reach) ** 2 * 0.7
          : (y / h) ** 2.2 * 0.55;
        if (level > (BAYER[(y & 7) * 8 + (x & 7)] + 0.5) / 64) ctx.fillRect(x, y, 1, 1);
      }
    }
  </script>`;

const chromium = process.env.CHROMIUM ?? "chromium";

/** One Chromium screenshot of `body` on the theme's ground, as a PNG buffer. */
function shoot(width, height, theme, body) {
  const work = mkdtempSync(join(tmpdir(), "brand-"));
  const page = join(work, "p.html");
  const shot = join(work, "p.png");
  writeFileSync(
    page,
    `<!doctype html><html lang="en"><head><meta charset="utf-8"><style>${FACE}
     body { width:${width}px; height:${height}px; overflow:hidden; background:${theme.bg};
            color:${theme.fg}; -webkit-font-smoothing:antialiased; }</style></head>
     <body>${body}</body></html>`,
  );
  execFileSync(
    chromium,
    ["--headless", "--disable-gpu", "--hide-scrollbars", "--no-sandbox",
     "--force-device-scale-factor=1", `--window-size=${width},${height}`,
     "--virtual-time-budget=4000", `--screenshot=${shot}`, `file://${page}`],
    { stdio: ["ignore", "ignore", "inherit"] },
  );
  return readFileSync(shot);
}

/** Chromium renders the page, sharp palettes the PNG down. Flat art, so it is free. */
async function render(file, width, height, theme, body) {
  const out = await sharp(shoot(width, height, theme, body)).png({ palette: true, effort: 10 }).toBuffer();
  writeFileSync(file, out);
  console.log(`  ${file.slice(root.length).padEnd(30)} ${width}x${height}  ${(out.length / 1024).toFixed(1)} kB`);
}

/** Whether a pixel's red channel is lettering rather than ground or light. */
const isText = (value, groundIsDark) => (groundIsDark ? value >= 200 : value <= 60);

/**
 * The mark: `tjh`, the domain, set like the hero name (Mona Sans at its
 * heaviest and widest), centred in the square.
 *
 * Centred optically, not by the text box: what has to sit in the middle is
 * the body of the word, from the top of the ascenders to the baseline, with
 * the j's descender hanging below it. Centring the whole ink box instead
 * lets the thin descender push the word visibly high. So it is rendered once
 * bare, the ink is measured, and the second render shifts it into place.
 */
const markHtml = (box, size, dx = 0, dy = 0) => `
  <main style="display:flex;align-items:center;justify-content:center">
    <span class="display" style="font-size:${Math.round(box * size)}px;line-height:1;
                 letter-spacing:-0.015em;transform:translate(${dx}px,${dy}px)">tjh</span>
  </main>`;

async function mark(theme, box, size) {
  const { data, info } = await sharp(shoot(box, box, theme, markHtml(box, size)))
    .raw()
    .toBuffer({ resolveWithObject: true });
  const groundIsDark = theme === DARK;
  let [x0, y0, x1, y1] = [box, box, 0, 0];
  const perRow = new Array(info.height).fill(0);
  for (let y = 0; y < info.height; y++) {
    for (let x = 0; x < info.width; x++) {
      if (!isText(data[(y * info.width + x) * info.channels], groundIsDark)) continue;
      perRow[y]++;
      [x0, y0, x1, y1] = [Math.min(x0, x), Math.min(y0, y), Math.max(x1, x), Math.max(y1, y)];
    }
  }
  // Below the baseline only the j's descender has ink, a fraction of the
  // width the letters take above it.
  const widest = Math.max(...perRow);
  let baseline = y1;
  while (perRow[baseline] < widest * 0.3) baseline--;
  return markHtml(box, size, Math.round(box / 2 - (x0 + x1 + 1) / 2), Math.round(box / 2 - (y0 + baseline + 1) / 2));
}

/**
 * Avatar. Full-bleed square rather than a drawn circle: every platform crops
 * its own shape (X and Discord to a circle, GitHub to a rounded square), so
 * baking one in would show corners under the others.
 */
const avatar = async (theme, box) =>
  `${light(theme, Math.round(box / 125), 0.5)}${await mark(theme, box, 0.44)}`;

/**
 * Banner. The hero in one line: the name with the initials at full strength
 * and the rest muted, which is the site's accent device run on contrast,
 * and the role under it. Inset well past the corners, because both X and
 * LinkedIn overlap the avatar into a bottom or left corner and crop the
 * edges hard on mobile.
 */
const banner = (h, pad, nameSize, lift) => `
  ${light(DARK, 5)}
  <main style="display:flex;flex-direction:column;justify-content:center;
               padding:${pad - lift}px ${pad}px ${pad + lift}px">
    <h1 class="display" style="font-size:${nameSize}px;line-height:0.9;letter-spacing:-0.045em;
                               white-space:nowrap;color:${DARK.muted}">
      ${NAME_PARTS.map((p) => `<span style="color:${DARK.fg}">${p.initial}</span>${p.rest}`).join(" ")}
    </h1>
    <p style="margin-top:${Math.round(h * 0.06)}px;font-family:'Mona Sans';
              font-size:${Math.round(h * 0.056)}px;line-height:1.3">
      <span style="font-weight:600">${t.hero.role}</span>
      <span style="color:${DARK.muted}">${t.hero.employer}</span>
    </p>
    <p class="label" style="margin-top:${Math.round(h * 0.05)}px;font-size:${Math.round(h * 0.036)}px;
                            color:${DARK.muted}">${profile.domain}</p>
  </main>`;

/**
 * Asserts the mark survives both crops platforms apply: a circle (X, Discord,
 * LinkedIn) and a rounded square (GitHub). Counts text pixels outside the
 * inscribed circle and on the square edge, and fails loudly on either. The
 * dithered light never crosses the thresholds, so it does not count.
 */
async function verifyCrop(name) {
  const file = join(OUT, name);
  const { data, info } = await sharp(file).raw().toBuffer({ resolveWithObject: true });
  const mid = info.width / 2;
  const r = mid - 1;
  const groundIsDark = data[0] < 60;
  let outside = 0;
  let edge = 0;
  for (let y = 0; y < info.height; y++) {
    for (let x = 0; x < info.width; x++) {
      if (!isText(data[(y * info.width + x) * info.channels], groundIsDark)) continue;
      if (Math.hypot(x - mid, y - mid) > r) outside++;
      if (x < 3 || y < 3 || x > info.width - 4 || y > info.height - 4) edge++;
    }
  }
  if (outside || edge) {
    throw new Error(
      `${name}: mark is not crop safe (${outside}px outside the circle, ${edge}px on the square edge)`,
    );
  }
  console.log(`  ${name.padEnd(30)} crop safe (circle and square)`);
}

console.log("brand assets:");
await render(join(OUT, "avatar.png"), 1000, 1000, DARK, await avatar(DARK, 1000));
await render(join(OUT, "avatar-light.png"), 1000, 1000, LIGHT, await avatar(LIGHT, 1000));
// Both platforms drop the avatar into a bottom or left corner and crop the
// outer edges on narrow screens, so the padding is generous and the content
// rides above centre rather than in it.
await render(join(OUT, "banner-x.png"), 1500, 500, DARK, banner(500, 120, 104, 20));
await render(join(OUT, "banner-linkedin.png"), 1584, 396, DARK, banner(396, 90, 84, 18));
await render(join(OUT, "mark-512.png"), 512, 512, DARK, await avatar(DARK, 512));

/**
 * The favicon. PNG rather than SVG because the mark is set type: an
 * <svg><text> would fall back to whatever sans the viewer has. No light at
 * this size, and the letters fill the square, since 16px leaves no room for
 * composition. One 180px file serves as both icon and apple-touch-icon.
 */
await render(join(root, "public", "favicon.png"), 180, 180, DARK, await mark(DARK, 180, 0.48));

await verifyCrop("avatar.png");
await verifyCrop("avatar-light.png");
