# Master artwork

Maison Cocody's own logo files, delivered 19 September 2026. These four
are the studio's, under the studio's own filenames, so they map one to
one against what was sent. **Every wordmark, flower and favicon file in
`assets/brand/` is generated from these four — none of it is drawn by
hand.** The script and monogram PNGs are the exception; they are not in
this pack at all. See *Still missing* at the foot.

| Studio file | What it is | What it becomes |
|---|---|---|
| `Logo Horizontal.svg` | MAISON COCODY on one line | `wordmark.svg`, `wordmark-white.svg`, `wordmark-black.png`, `wordmark-white.png` |
| `Logo Vertical.svg` | the same, stacked over two lines | `wordmark-stacked.svg`, `wordmark-stacked-white.svg` |
| `Plan de travail 1.svg` | the flower, outline cut, stroked 2.75 | `flower-outline.svg` |
| `Plan de travail 2.svg` | the flower, solid, one compound path | `flower.svg`, `flower-white.svg`, `flower-black.png`, `flower-white.png`, `favicon.svg`, `favicon.png`, and the two path strings in `assets/js/cocody.js` |

The `.ai` original and the print PDFs are **not** in this repository —
they are working masters and this folder is published to GitHub Pages.
They are in `brand-master/` next to `PROJECT.md`, together with the zip
as it arrived.

## How the generated files differ from these

Two things only, and both are framing rather than drawing:

1. **The viewBox is tightened to the artwork.** The studio's files sit
   on their Illustrator artboards, so roughly half of each frame is
   empty margin. A logo sized by height in CSS would pay for that
   margin, so each generated file is reframed to its own bounding box:

   | | viewBox | ratio |
   |---|---|---|
   | horizontal | `40.24 49 715.18 91.97` | 7.776 |
   | stacked | `37.21 49 343.48 189.01` | 1.817 |
   | flower, filled | `99.66 41.09 218.55 210.07` | 1.040 |
   | flower, outline | `98.28 39.72 221.3 212.81` | 1.040 |

   The outline's frame is 1.375 larger on every side, and that is not a
   rounding difference. A fill ends where its path ends, but a stroke
   is centred on the path and paints half its weight outside — so a
   frame set to the path alone slices the petal tips off along a flat
   line. `flower-outline.svg` is the only stroked file here, and it did
   ship clipped for a few hours on 19 September. `tools/edgecheck`
   tests for it now.

2. **`fill` is stated.** An `<img>` cannot inherit `currentColor`, so
   the black and white cuts are separate files. The flower drawn by the
   script is inline SVG and does inherit it.

The flower's single compound path is split at its two subpaths for the
script — outer contour, then the hole — so the mark can be stroked
whole, opened into a ring, or filled. Kept together in one `d`, as the
studio wrote it, the default nonzero rule punches the centre out with
no mask, which is what `flower.svg` and the favicon rely on.

## Still missing

The **script signature** (`script-black.png`, `script-white.png`) and
the **M+C monogram** (`monogram-black.png`, `monogram-white.png`) are
not in this pack. They are still PNGs pulled off the live site. The
script is used at display size on directions A, B, C and D, so it is
the one file worth asking the studio for next.
