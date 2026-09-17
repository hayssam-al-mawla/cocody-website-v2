/* ------------------------------------------------------------------
   The Maison Cocody catalogue, as it stands on maisoncocody.com.

   Read off the live shop in September 2026: names, prices, the
   struck-through was-prices, categories, sizes and real stock. The
   photography is the shop's own.

   It is a plain script rather than a JSON file on purpose — these pages
   are opened straight off disk, and fetch() is blocked on file:// URLs.
   In the WordPress build this is whatever the WooCommerce Store API
   returns; nothing above this layer has to change.

   Two notes carried over from the audit:
   - the live titles are prefixed "[FW26 Collection Bô] …". Here the
     collection is a field, which is what brief 3.4 is asking for.
   - the two jerseys share one title on the live site. They are
     separated by colourway here, as recommended.
   - ref/year number the pieces in the order they were released. The
     live shop has no such scheme; Direction D proposes one, because a
     register needs a spine to hang on.
   ------------------------------------------------------------------ */
window.COCODY_CATALOGUE = [
  {
    slug: 'sweater', ref: '010', year: '2026', name: 'Signature Zip-Up Sweater',
    price: 50, was: 90, category: 'Sweater', collection: 'FW26 Bô',
    material: 'Heavy-weight textured cotton',
    sizes: [{ s: 'S', in: false }, { s: 'M', in: true }, { s: 'L', in: false }, { s: 'XL', in: false }],
    img: 'sweater-a.jpg', alt: 'sweater-b.jpg'
  },
  {
    slug: 'trouser', ref: '009', year: '2026', name: 'Cocody Wide-Leg Pleated Trouser',
    price: 40, was: 80, category: 'Pants', collection: 'FW26 Bô',
    material: 'Pressed centre pleat',
    sizes: [{ s: 'S', in: true }, { s: 'M', in: true }, { s: 'L', in: true }, { s: 'XL', in: true }],
    img: 'trouser-a.jpg', alt: 'trouser-b.jpg'
  },
  {
    slug: 'monogram-hat', ref: '008', year: '2026', name: 'Cocody Monogram Hat',
    price: 40, was: null, category: 'Headwear', collection: 'FW26 Bô',
    material: 'Embroidered M C',
    sizes: [{ s: 'One size', in: false }],
    img: 'monogram-hat-a.jpg', alt: 'monogram-hat-b.jpg'
  },
  {
    slug: 'flower-hat', ref: '005', year: '2025', name: 'Cocody Flower Hat',
    price: 25, was: 40, category: 'Headwear', collection: 'Pre-release 25',
    material: 'Flower appliqué',
    sizes: [{ s: 'One size', in: false }],
    img: 'flower-hat-a.jpg', alt: 'flower-hat-b.jpg'
  },
  {
    slug: 'jersey-burgundy', ref: '007', year: '2025', name: 'Vintage Jersey — Burgundy',
    price: 45, was: 80, category: 'Vintage Jerseys', collection: 'SS25',
    material: '“Opposites Attract”',
    sizes: [{ s: 'S', in: false }, { s: 'M', in: false }, { s: 'L', in: false }, { s: 'XL', in: false }],
    img: 'jersey-burgundy-a.jpg', alt: 'jersey-burgundy-b.jpg'
  },
  {
    slug: 'jersey-beige', ref: '006', year: '2025', name: 'Vintage Jersey — Beige',
    price: 45, was: 80, category: 'Vintage Jerseys', collection: 'SS25',
    material: '“Opposites Attract”',
    sizes: [{ s: 'S', in: false }, { s: 'M', in: false }, { s: 'L', in: false }, { s: 'XL', in: false }],
    img: 'jersey-beige-a.jpg', alt: 'jersey-beige-b.jpg'
  },
  {
    slug: 'tee-black', ref: '002', year: '2025', name: 'Black T-Shirt',
    price: 35, was: 60, category: 'T-shirts', collection: 'Pre-release 25',
    material: 'Heavy cotton jersey',
    sizes: [{ s: 'S', in: false }, { s: 'M', in: false }, { s: 'L', in: false }, { s: 'XL', in: false }],
    img: 'tee-black-a.jpg', alt: 'tee-black-b.jpg'
  },
  {
    slug: 'tee-ivory', ref: '001', year: '2025', name: 'Ivory T-Shirt',
    price: 35, was: 60, category: 'T-shirts', collection: 'Pre-release 25',
    material: 'Heavy cotton jersey',
    sizes: [{ s: 'S', in: false }, { s: 'M', in: false }, { s: 'L', in: false }, { s: 'XL', in: false }],
    img: 'tee-ivory-a.jpg', alt: 'tee-ivory-b.jpg'
  },
  {
    slug: 'tote-black', ref: '004', year: '2025', name: 'Black Maxi Tote Bag',
    price: 20, was: 35, category: 'Bags', collection: 'Pre-release 25',
    material: 'Heavy canvas',
    sizes: [{ s: 'One size', in: false }],
    img: 'tote-black-a.jpg', alt: 'tote-black-b.jpg'
  },
  {
    slug: 'tote-vintage', ref: '003', year: '2025', name: 'Vintage Maxi Tote Bag',
    price: 20, was: 35, category: 'Bags', collection: 'Pre-release 25',
    material: 'Heavy canvas',
    sizes: [{ s: 'One size', in: false }],
    img: 'tote-vintage-a.jpg', alt: 'tote-vintage-b.jpg'
  }
];

/* free shipping threshold used by the bag — a placeholder pending the
   real number, but sized against a catalogue priced €20–€50 */
window.COCODY_FREE_SHIPPING = 100;
