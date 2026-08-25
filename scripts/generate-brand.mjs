/**
 * Regenerates the brand assets in public/brand/.
 *
 * Run by hand (`npm run brand`), like the social card and for the same
 * reason: the artwork changes about as often as the name on it does, and the
 * output is committed. This file exists so those PNGs are reproducible
 * rather than binaries nobody can edit.
 *
 * Text, colours and fonts are read from the same sources the site uses, so
 * the assets cannot drift from the page they represent.
 *
 * The assets are monochrome. See the note above the tokens for why.
 *
 * Needs `chromium` on PATH.
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
  readFileSync(join(root, "node_modules", "@fontsource", pkg, "files", file)).toString("base64");

const serif = font("instrument-serif", "instrument-serif-latin-400-normal.woff2");
const mono400 = font("ibm-plex-mono", "ibm-plex-mono-latin-400-normal.woff2");
const mono500 = font("ibm-plex-mono", "ibm-plex-mono-latin-500-normal.woff2");

// Same tokens as src/styles/global.css.
const PAPER = "oklch(0.982 0.006 85)";
const INK = "oklch(0.17 0.006 70)";
const MUTED_ON_INK = "oklch(0.63 0.01 72)";
const RULE_ON_INK = "oklch(0.33 0.009 70)";

/**
 * The brand is monochrome on purpose, and that is a decision with history.
 *
 * Freezing PALETTE[0] put a terracotta on warm paper, which is Anthropic's
 * palette rather than this one. Going polychrome to escape it produced three
 * rounded bars in three hues, which is Figma's neighbourhood. Colour space in
 * this category is crowded enough that almost any pick rhymes with somebody.
 *
 * So the brand does not compete on colour at all. It is paper on ink, set in
 * the site's own display face. The re-rolling accent stays where it belongs,
 * on the site, where it is a behaviour rather than a logo.
 */

const t = content.en;

const FACE = `
  @font-face { font-family: "Instrument Serif"; font-weight: 400;
    src: url(data:font/woff2;base64,${serif}) format("woff2"); }
  @font-face { font-family: "IBM Plex Mono"; font-weight: 400;
    src: url(data:font/woff2;base64,${mono400}) format("woff2"); }
  @font-face { font-family: "IBM Plex Mono"; font-weight: 500;
    src: url(data:font/woff2;base64,${mono500}) format("woff2"); }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  .label { font-family: "IBM Plex Mono"; font-weight: 500; line-height: 1;
    letter-spacing: 0.14em; text-transform: uppercase; }
`;

/** Chromium renders the page, sharp palettes the PNG down. Flat art, so it is free. */
async function render(name, width, height, body) {
  const work = mkdtempSync(join(tmpdir(), "brand-"));
  const page = join(work, "p.html");
  const shot = join(work, "p.png");
  writeFileSync(
    page,
    `<!doctype html><html lang="en"><head><meta charset="utf-8"><style>${FACE}
     body { width:${width}px; height:${height}px; overflow:hidden; background:${INK};
            -webkit-font-smoothing:antialiased; }</style></head><body>${body}</body></html>`,
  );
  execFileSync(
    "chromium",
    ["--headless", "--disable-gpu", "--hide-scrollbars", "--no-sandbox",
     "--force-device-scale-factor=1", `--window-size=${width},${height}`,
     "--virtual-time-budget=4000", `--screenshot=${shot}`, `file://${page}`],
    { stdio: ["ignore", "ignore", "inherit"] },
  );
  const out = await sharp(shot).png({ palette: true, effort: 10 }).toBuffer();
  writeFileSync(join(OUT, name), out);
  console.log(`  ${name.padEnd(22)} ${width}x${height}  ${(out.length / 1024).toFixed(1)} kB`);
}

/**
 * The mark: `tjh` in Instrument Serif, sitting low and left with the space
 * left open above and right of it.
 *
 * Dead centre reads as text in a box, so it is nudged down and left. The
 * These are the largest offsets that survive a circular crop: a sweep at this
 * font size showed 0.072/0.06 clean and the next step up spilling 747px of
 * ink outside the circle. Anchoring it properly into the corner looks better
 * as a square and gets the j's descender guillotined by every platform that
 * crops round, which is most of them. verifyCrop() below enforces this, so
 * retune against that rather than by eye.
 */
const mark = (fg, box) => `
  <div style="width:100%;height:100%;display:flex;align-items:center;
              justify-content:center;overflow:hidden">
    <span style="font-family:'Instrument Serif';color:${fg};font-size:${Math.round(box * 0.68)}px;
                 line-height:0.74;letter-spacing:-0.045em;
                 transform:translate(${Math.round(box * -0.072)}px,${Math.round(box * 0.06)}px)">tjh</span>
  </div>`;

/**
 * Avatar. Full-bleed square rather than a drawn circle: every platform crops
 * its own shape (X and Discord to a circle, GitHub to a rounded square), so
 * baking one in would show corners under the others. The mark sits well
 * inside the inscribed circle so no crop ever clips it.
 */
const avatar = (bg, fg, box) => `
  <div style="width:100%;height:100%;background:${bg}">${mark(fg, box)}</div>`;

/**
 * Banner. Same composition as the social card: rule, name with the initials
 * tinted, role, rule. Content is centred and inset well past the corners,
 * because both X and LinkedIn overlap the avatar into a bottom or left
 * corner and crop the edges hard on mobile.
 */
const banner = (h, pad, nameSize, lift) => `
  <div style="width:100%;height:100%;background:${INK};color:${PAPER};
              display:flex;flex-direction:column;justify-content:center;
              padding:${pad - lift}px ${pad}px ${pad + lift}px;
              gap:${Math.round(h * 0.055)}px">
    <div style="height:1px;flex:none;background:${RULE_ON_INK}"></div>
    <div style="display:flex;align-items:baseline;justify-content:space-between;gap:40px">
      <span style="font-family:'Instrument Serif';font-size:${nameSize}px;
                   line-height:1;letter-spacing:-0.015em;white-space:nowrap">
        ${/* The site tints the initials with its accent. With no accent to
             spend, the same device runs on contrast instead. */ ""}
        ${NAME_PARTS.map(
          (p) => `${p.initial}<span style="color:${MUTED_ON_INK}">${p.rest}</span>`,
        ).join(" ")}
      </span>
      <span class="label" style="font-size:${Math.round(h * 0.042)}px;color:${MUTED_ON_INK}">
        ${profile.city}
      </span>
    </div>
    <div style="display:flex;align-items:baseline;justify-content:space-between;gap:40px">
      <span style="font-family:'IBM Plex Mono';font-weight:400;
                   font-size:${Math.round(h * 0.052)}px;color:${MUTED_ON_INK};white-space:nowrap">
        ${t.hero.role}
      </span>
      <span style="font-family:'IBM Plex Mono';font-weight:500;
                   font-size:${Math.round(h * 0.052)}px;letter-spacing:-0.01em">
        ${profile.domain}
      </span>
    </div>
    <div style="height:1px;flex:none;background:${RULE_ON_INK}"></div>
  </div>`;

/**
 * Asserts the mark survives both crops platforms apply: a circle (X, Discord,
 * LinkedIn) and a rounded square (GitHub). Counts ink outside the inscribed
 * circle and ink touching the square edge, and fails loudly on either. An
 * earlier revision lost the j's descender to exactly this and it was only
 * caught by looking.
 */
async function verifyCrop(name) {
  const file = join(OUT, name);
  const { data, info } = await sharp(file).raw().toBuffer({ resolveWithObject: true });
  const mid = info.width / 2;
  const r = mid - 1;
  let outside = 0;
  let edge = 0;
  for (let y = 0; y < info.height; y++) {
    for (let x = 0; x < info.width; x++) {
      const i = (y * info.width + x) * info.channels;
      // the mark is whichever of ink/paper is not the ground, so test both ways
      const isInk = data[i] < 60;
      const isPaper = data[i] > 200;
      if (!(isInk || isPaper)) continue;
      const ground = data[(0 * info.width + 0) * info.channels] < 60;
      if (ground === isInk) continue;
      if (Math.hypot(x - mid, y - mid) > r) outside++;
      if (x < 3 || y < 3 || x > info.width - 4 || y > info.height - 4) edge++;
    }
  }
  if (outside || edge) {
    throw new Error(
      `${name}: mark is not crop safe (${outside}px outside the circle, ${edge}px on the square edge)`,
    );
  }
  console.log(`  ${name.padEnd(22)} crop safe (circle and square)`);
}

console.log("brand assets:");
await render("avatar.png", 1000, 1000, avatar(INK, PAPER, 1000));
await render("avatar-light.png", 1000, 1000, avatar(PAPER, INK, 1000));
// Both platforms drop the avatar into a bottom or left corner and crop the
// outer edges on narrow screens, so the padding is generous and the content
// rides above centre rather than in it.
await render("banner-x.png", 1500, 500, banner(500, 120, 88, 20));
await render("banner-linkedin.png", 1584, 396, banner(396, 90, 70, 18));

/**
 * Favicon-sized raster. There is no SVG twin any more: the mark is set type,
 * and an <svg><text> would render in whatever serif the viewer happens to
 * have. Converting the glyphs to paths would fix that and needs a font
 * tool this repo does not carry.
 */
await render("mark-512.png", 512, 512, avatar(INK, PAPER, 512));

await verifyCrop("avatar.png");
await verifyCrop("avatar-light.png");

