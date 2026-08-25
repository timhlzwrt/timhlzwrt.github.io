# Brand

Everything here is derived from the site, not invented alongside it. The
fonts, colours and wording come from the same files the pages are built
from, so the assets cannot drift from tjh.li.

Regenerate with `npm run brand` (needs `chromium` on PATH). Output is
committed, like the social card.

## The mark

`tjh` set in Instrument Serif, paper on ink, nudged down and left of centre.

It is the domain, and it is the device the site opens with: the T, J and H of
the name picked out while the rest recedes. The avatar is that with the rest
of the name taken away.

The nudge is small on purpose. Anchored properly into the corner it looks
better as a square and loses the j's descender to every platform that crops
to a circle, which is most of them. `verifyCrop()` in the generator asserts
that no ink falls outside the inscribed circle or touches the square edge, so
retune by loosening that check rather than by eye.

## Files

| File | Size | Use |
| --- | --- | --- |
| `public/brand/avatar.png` | 1000x1000 | Profile picture, default |
| `public/brand/avatar-light.png` | 1000x1000 | Profile picture on dark interfaces |
| `public/brand/banner-x.png` | 1500x500 | X header |
| `public/brand/banner-linkedin.png` | 1584x396 | LinkedIn cover |
| `public/brand/mark-512.png` | 512x512 | Favicon or anywhere small |

Avatars are full-bleed squares with no circle drawn into them. Every
platform crops its own shape, X and Discord to a circle, GitHub to a rounded
square, so a baked-in circle would show corners under the others. The mark
sits well inside the inscribed circle, so no crop clips it.

**Which avatar.** They invert with the interface around them. On a light
interface the ink version has a clean edge and the paper version floats; on
a dark interface it is the other way round. The letterform carries the
identity either way, so this only affects the edge. Default to the ink one,
and use the light one on Discord or anywhere reliably dark.

There is no SVG. The mark is set type, so an `<svg><text>` would render in
whatever serif the viewer happens to have. Converting the glyphs to paths
would fix that and needs a font tool this repo does not carry.

## Colour

There isn't one, and that is the decision rather than an omission.

The first attempt froze `PALETTE[0]`, which is a terracotta on warm paper.
That is Anthropic's palette, not this one. The second went polychrome to
escape it and produced three rounded bars in three hues, which is Figma's
neighbourhood. Colour space in this category is crowded enough that nearly
any pick rhymes with somebody.

So the brand does not compete on colour. Paper on ink, set in the site's own
display face, which nobody else is using for this.

| Token | oklch | hex |
| --- | --- | --- |
| Ink | `oklch(0.17 0.006 70)` | `#110f0d` |
| Paper | `oklch(0.982 0.006 85)` | `#fbf9f5` |
| Muted, on ink | `oklch(0.63 0.01 72)` | used for the non-initial letters |

The six re-rolling accents stay where they belong: on the site, where they
are a behaviour rather than a logo. Nothing in `public/brand/` uses them.

On the banners the name runs the site's device in monochrome, initials at
full paper and the rest muted, so the wordmark and the avatar are visibly the
same idea.

## Type

Instrument Serif for display, IBM Plex Mono for everything else, matching
the site. Labels are uppercase mono at 0.14em letterspacing. Never let a
browser or an editor fake-bold Instrument Serif; it ships one weight.

## Words

Handle `timhlzwrt` everywhere it is free. The domain is `tjh.li` and reads
as the initials, which is the whole reason it exists, so prefer it over the
full name in short bios.

Suggested bio, short enough for X's 160 characters:

> Fachinformatiker für Systemintegration in training at a bank in Stuttgart.
> Python, Linux, a Proxmox homelab. Privacy by default. tjh.li

German, for profiles that are German-facing:

> Auszubildender zum Fachinformatiker für Systemintegration bei einer Bank
> in Stuttgart. Python, Linux, Proxmox-Homelab. Datenschutz aus Prinzip.

## The favicon

`public/favicon.svg` is untouched, because swapping it changes the site
rather than a social profile, and that is your call.

`mark-512.png` works as a drop-in if you want one mark everywhere. The
favicon's own note about staying monochrome is no longer a constraint worth
working around, since the brand is monochrome too.
