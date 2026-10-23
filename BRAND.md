# Brand

Everything here is derived from the site. Fonts, colours and wording come
from the same files the pages are built from, so the assets cannot drift
from tjh.li.

Regenerate with `npm run brand` (needs `chromium` on PATH, or its path in
`CHROMIUM`). Output is committed, like the social card.

## The mark

`tjh` set like the hero name: Mona Sans at weight 800 and width 125%, on the
site's dark ground, with the pond's dithered moonlight falling in from above.

It is the domain, and it is the device the site opens with: the T, J and H
of the name picked out. The composition is symmetric: the light comes from
the top centre, and the mark is centred optically: the body of the word, from
the top of the ascenders to the baseline, sits in the middle and the j's
descender hangs below it. The generator measures the ink and shifts it into
place. `verifyCrop()` asserts that no letter falls
outside the inscribed circle or touches the square edge.

## Files

| File | Size | Use |
| --- | --- | --- |
| `public/brand/avatar.png` | 1000x1000 | Profile picture, default |
| `public/brand/avatar-light.png` | 1000x1000 | Profile picture, light theme |
| `public/brand/banner-x.png` | 1500x500 | X header |
| `public/brand/banner-linkedin.png` | 1584x396 | LinkedIn cover |
| `public/brand/mark-512.png` | 512x512 | Anywhere small |
| `public/favicon.png` | 180x180 | Favicon and apple-touch-icon |

Avatars are full-bleed squares with no circle drawn in. Every platform crops
its own shape, so a baked-in circle would show corners under the others.

The favicon has no light and fills the square, because at 16px there is no
room for composition. It is a PNG, not an SVG: the mark is set type, and an
`<svg><text>` would fall back to whatever sans the viewer has.

## Colour

None, on purpose. The site's accent re-rolls daily, so any hue frozen into a
profile picture would be wrong five days in six. The assets use the site's
neutral tokens only:

| Token | oklch |
| --- | --- |
| Ground (dark) | `oklch(0.16 0.014 265)` |
| Text (dark) | `oklch(0.94 0.008 265)` |
| Muted (dark) | `oklch(0.7 0.016 265)` |
| Ground (light) | `oklch(0.968 0.006 265)` |
| Text (light) | `oklch(0.2 0.02 265)` |

On the banners the initials are at full strength and the rest of the name is
muted, which is the site's accent device run on contrast. The social card
(`public/og.png`) is the one exception: it is a picture of the page, so it
uses the accent at `PALETTE[0]`.

## Type

Mona Sans for the mark, the name and running text, IBM Plex Mono for labels
(uppercase, 0.14em letterspacing). Same as the site.

## Words

Handle `timhlzwrt` everywhere it is free. Prefer the domain `tjh.li` over the
full name in short bios.

> Fachinformatiker für Systemintegration in training at a bank in Stuttgart.
> Python, Linux, Proxmox. tjh.li

> Auszubildender zum Fachinformatiker für Systemintegration bei einer Bank in
> Stuttgart. Python, Linux, Proxmox. tjh.li
