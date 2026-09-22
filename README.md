# Maison Cocody — Website V2

Five design directions and seven page templates for the Maison Cocody
website redesign, September 2026. Direction E is the current proposal:
it is built from the client's notes of 21 September.

**[Open the review pack →](https://hayssam-al-mawla.github.io/cocody-website-v2/)**

## The directions

| | Direction | The idea |
|---|---|---|
| **E** | [Studio](https://hayssam-al-mawla.github.io/cocody-website-v2/e/) | **Current.** The client's six notes of 21 September, built: the moving voucher, the wordmark giving way to the flower on scroll, the nav on the left in three groups, Inter (the client's own choice), a five-colour palette, and the legal and social footer; revised the same afternoon with a bigger wordmark, line icons and a full-screen homepage. The [system page](https://hayssam-al-mawla.github.io/cocody-website-v2/directions/e-system.html) walks through each. |
| **A** | [Seamless](https://hayssam-al-mawla.github.io/cocody-website-v2/a/) | The e-comm backdrop turned into a website. Pure white, true black, scale does the work. |
| **B** | [Le Labo](https://hayssam-al-mawla.github.io/cocody-website-v2/b/) | The studio, not the shop. A contact sheet on a light table, film first. |
| **C** | [Le Décor](https://hayssam-al-mawla.github.io/cocody-website-v2/c/) | The painted canvas from the campaign film, hung on the web. |
| **D** | [Le Registre](https://hayssam-al-mawla.github.io/cocody-website-v2/d/) | Our own proposal. The shop as a register of everything ever made, sold out or not. |

## The pages behind them

Each of these opens in Direction E, and can be flipped to A, B or C from
the small "Review options" tab in the corner of the page — or add `?dir=e`, `?dir=a`, `?dir=b` or
`?dir=c` to the address to send someone straight to one version. The
masthead, marquee and footer from the 21 September notes are shared by
all four skins.

| Page | | |
|---|---|---|
| [Shop](https://hayssam-al-mawla.github.io/cocody-website-v2/templates/shop.html) | the full catalogue | filters, sort, quick add |
| [Product](https://hayssam-al-mawla.github.io/cocody-website-v2/templates/product.html) | one per piece, `?p=<name>` | the flower size picker |
| [Checkout](https://hayssam-al-mawla.github.io/cocody-website-v2/templates/checkout.html) | live carrier rates | label and invoice |
| [Collections](https://hayssam-al-mawla.github.io/cocody-website-v2/templates/collections.html) | one collection, and the index | |
| [Cocody Lab](https://hayssam-al-mawla.github.io/cocody-website-v2/templates/cocody-lab.html) | the film hub | |
| [Events](https://hayssam-al-mawla.github.io/cocody-website-v2/templates/events.html) | upcoming, and the archive | |
| [About](https://hayssam-al-mawla.github.io/cocody-website-v2/templates/about.html) | the story | |

## It is a working site, not flat mockups

- Every one of the ten products has its own page, driven by the real catalogue
- The bag works on every page, and carries through to a checkout
- Checkout fetches a shipping rate per destination, then shows the label and invoice being produced — the brief's section 3.7, made concrete
- Search on ⌘K, live filtering across the catalogue
- All seven shared templates can be flipped between directions E, A, B and C from the "Review options" tab in the corner of each page; the two Direction E pages carry no review chrome at all
- The masthead swaps the wordmark for the flower once you scroll, and the flower turns with the page; the marquee at the top carries the voucher and the shipping line

## About the content

Product names, prices, sizes and stock are the **real ones**, read off
maisoncocody.com. Event dates and Cocody Lab titles are placeholder,
because none of those exist yet. All photography and the campaign film
are Maison Cocody's own.

So are the marks. The **wordmark and the flower are the studio's master
vectors**, delivered 19 September 2026 and kept verbatim in
[`assets/brand/source/`](assets/brand/source/) — every wordmark, flower
and favicon file beside them is generated from those, and nothing is
redrawn. The **script lockup and the M+C monogram are not in that
pack**, so they are still PNGs off the live site; the script is the one
of the two still in use, and the one file left to ask for. Nothing here
is a reconstruction.

## Notes

- Built as plain HTML, CSS and JavaScript with no framework and no
  build step, so it can be opened from a folder or served anywhere.
  That is a decision about the review pack, not a recommendation for
  the build — the site itself stays on WordPress.
- The written document (audit, platform plan, costs, timeline) is
  deliberately **not** in this repository. It describes the live site's
  platform versions and plugins, which should not sit on a public URL.

---

Nothing here is connected to the live shop. No payment is taken anywhere.
