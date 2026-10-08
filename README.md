# Maison Cocody — Website V2

Direction E, "Studio", and the eight page templates behind it, for the
Maison Cocody website redesign, September 2026. It is built from the
client's notes, and since 30 September it is the only direction here:
the four it grew out of (A, B, C and D) were taken out so the work can
go deeper into this one. They are still in this repository's history —
commit `65fee48` has all five. The root of the site opens the homepage;
the cover page, with every page listed, is `START-HERE.html`.

**[Open the homepage →](https://hayssam-al-mawla.github.io/cocody-website-v2/directions/e-studio.html)** ·
[the cover page](https://hayssam-al-mawla.github.io/cocody-website-v2/START-HERE.html) ·
[the system page](https://hayssam-al-mawla.github.io/cocody-website-v2/directions/e-system.html)

## Direction E — Studio

The client's six notes of 21 September, built: the moving voucher, the
wordmark giving way to the flower on scroll, the nav on the left in
three groups, Inter (the client's own choice), a five-colour palette,
and the legal and social footer. Revised the same afternoon with a
bigger wordmark, line icons and a full-screen homepage; on 23 September
with a thinner strip, a gradient that extends when a menu opens, and the
three menus as the client listed them; on 24 September with the
sold-out treatment (a faded card with the state written under the name;
Sold out, an email field and Notify me when back in stock on the product
page); and on 30 September with a login page (a person icon in the bar;
sign in, create an account and reset a password in one column). On 7
October the client's review went in: a smaller wordmark; the menus in
the order Shop / Maison Cocody / Archive, with the drops under Archive
and no separate Lookbook; the flower with its hole; whole product
pictures, and a product page you scroll or swipe through; a size
finder that knows where XL ends; the original price on sold-out
pieces; a footer the page slides up off; and on a phone a dark side
panel for the menu. The
[system page](https://hayssam-al-mawla.github.io/cocody-website-v2/directions/e-system.html) walks through each note and
what it became.

## The pages behind it

Every page wears the same masthead, marquee and footer, and every one
can be reached from the homepage's own menus.

| Page | | |
|---|---|---|
| [Shop](https://hayssam-al-mawla.github.io/cocody-website-v2/templates/shop.html) | the full catalogue | filters, sort, quick add |
| [Product](https://hayssam-al-mawla.github.io/cocody-website-v2/templates/product.html) | one per piece, `?p=<name>` | the flower size picker |
| [Checkout](https://hayssam-al-mawla.github.io/cocody-website-v2/templates/checkout.html) | live carrier rates | label and invoice |
| [Collections](https://hayssam-al-mawla.github.io/cocody-website-v2/templates/collections.html) | one collection, and the index | |
| [Cocody Lab](https://hayssam-al-mawla.github.io/cocody-website-v2/templates/cocody-lab.html) | the film hub | |
| [Events](https://hayssam-al-mawla.github.io/cocody-website-v2/templates/events.html) | upcoming, and the archive | |
| [About](https://hayssam-al-mawla.github.io/cocody-website-v2/templates/about.html) | the story | |
| [Login](https://hayssam-al-mawla.github.io/cocody-website-v2/templates/login.html) | sign in, create an account, reset a password | new, 30 Sep |

## It is a working site, not flat mockups

- Every one of the ten products has its own page, driven by the real catalogue
- The bag works on every page, and carries through to a checkout
- Checkout fetches a shipping rate per destination, then shows the label and invoice being produced — the brief's section 3.7, made concrete
- Search on ⌘K, live filtering across the catalogue
- The masthead swaps the wordmark for the flower once you scroll, and the flower turns with the page; the marquee at the top carries the voucher and the shipping line
- The login page answers what is typed into it, and checks, stores and sends nothing

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
  It was written when there were four directions to choose between, so
  its design chapters describe A to D.
- The photographs the earlier directions used are still in
  `assets/img/`; they are Maison Cocody's own and may be wanted again.

---

Nothing here is connected to the live shop. No payment is taken anywhere, and the login page checks, stores and sends nothing.
