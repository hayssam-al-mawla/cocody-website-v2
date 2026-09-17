/* ------------------------------------------------------------------
   The product page, driven by the catalogue.

   One template, ten products: product.html?p=<slug>. Without a slug it
   falls back to the Signature Zip-Up Sweater so the page is never
   empty. Sizes, stock, prices and the was-price all come from the same
   data the shop and the register use, so the three can never disagree.

   WooCommerce equivalent: single-product.php. The slug is the post
   name; everything below is the product object.
   ------------------------------------------------------------------ */
(function () {
  'use strict';
  var CAT = window.COCODY_CATALOGUE || [];
  if (!CAT.length) return;
  var root = document.querySelector('[data-product]');
  if (!root) return;

  var IMG = '../assets/img/shop/';
  var money = function (n) { return '€' + n.toFixed(0); };

  var slug = (location.search.match(/[?&]p=([a-z0-9-]+)/) || [])[1];
  var p = CAT.filter(function (x) { return x.slug === slug; })[0] || CAT[0];
  var here = p.sizes.some(function (s) { return s.in; });

  /* the real copy from the live shop, where we have it */
  var STORY = {
    sweater: ['Elevated loungewear, cut to hold a shape. A high-funnel neck collar, a dropped shoulder for the drape, and an oversized body cinched back in by elasticated cuffs and waistband — so it reads architectural rather than slouchy.',
              'The pullers are the tell: custom flower pendants on a silver-tone two-way zip, the same blossom that circles the size on the woven label inside. The chest carries the Maison Cocody script, embroidered tonally, so you only catch it in the light.'],
    trouser: ['A wide leg with a pressed centre pleat that holds its line through the day. Cut long, meant to break once over the shoe.',
              'The same flower rivet as the rest of the cycle sits at the pocket, and the woven label inside carries the blossom around your size.'],
    'monogram-hat': ['The interlocking M and C, embroidered by hand in white on black. Flower-shaped metal eyelets at the sides — the same blossom that marks the size on every woven label.'],
    'flower-hat': ['One large flower appliqué, set off centre. The plainest thing the maison makes and the one people recognise first.'],
    'jersey-burgundy': ['A football jersey cut from the SS25 “Opposites Attract” pair. Burgundy with a tonal pinstripe, contrast collar, and MAISON ❀ COCODY across the chest.'],
    'jersey-beige': ['The lighter half of the SS25 “Opposites Attract” pair. Beige with a tonal pinstripe and the same crest at the heart.'],
    'tote-black': ['Heavy canvas, wide enough for a laptop and a change of clothes. MAISON ❀ COCODY printed across the face.'],
    'tote-vintage': ['The natural-canvas version of the maxi tote, printed in black.'],
    'tee-black': ['Heavy cotton jersey, boxy through the body. The pre-release print across the chest.'],
    'tee-ivory': ['Heavy cotton jersey in undyed ivory, boxy through the body.']
  };

  /* the real chart from the live product page, cm with inches added */
  var CHART = {
    head: ['Size', 'Shoulder', 'Length', 'Chest', 'Sleeve'],
    rows: [['XS', 59, 64.0, 58.5, 57.0], ['S', 61, 65.5, 61.0, 58.0], ['M', 63, 67.0, 63.5, 59.0],
           ['L', 65, 68.5, 66.0, 60.0], ['XL', 67, 70.0, 68.5, 61.0]]
  };
  var inch = function (cm) { return (cm / 2.54).toFixed(1); };

  function set(sel, html) { var e = root.querySelector(sel); if (e) e.innerHTML = html; }

  document.title = p.name + ' — Maison Cocody';

  set('[data-p-crumb]', '<a href="collections.html">' + p.collection + '</a> · ' + p.name);
  set('[data-p-title]', p.name);
  set('[data-p-price]', money(p.price) +
      (p.was ? ' <s style="color:var(--t-quiet);font-size:.85em;font-weight:400">' + money(p.was) + '</s>' : ''));
  set('[data-p-meta]', p.material + ' · ' + p.collection + ', limited production');

  /* gallery: the two shop shots plus supporting shots where we have them */
  var EXTRA = {
    sweater: ['../assets/img/m-set-front-md.jpg', '../assets/img/m-set-side-md.jpg', '../assets/img/pant-label-md.jpg'],
    trouser: ['../assets/img/pant-front-md.jpg', '../assets/img/pant-seam-md.jpg', '../assets/img/pant-label-md.jpg'],
    'monogram-hat': ['../assets/img/cap-front-md.jpg', '../assets/img/cap-profile-md.jpg', '../assets/img/cap-back-md.jpg']
  };
  var shots = [IMG + p.img, IMG + p.alt].concat(EXTRA[p.slug] || []);

  var main = root.querySelector('[data-gallery-main]');
  if (main) { main.src = shots[0]; main.alt = p.name; }
  set('[data-p-thumbs]', shots.map(function (src, i) {
    return '<button type="button" aria-current="' + (i === 0) + '" data-gallery-thumb="' + src + '"' +
           ' data-alt="' + p.name + ', view ' + (i + 1) + '">' +
           '<img src="' + src + '" alt="View ' + (i + 1) + '" loading="lazy" width="880" height="880"></button>';
  }).join(''));

  /* sizes, from real stock */
  var oneSize = p.sizes.length === 1 && p.sizes[0].s === 'One size';
  var firstIn = p.sizes.filter(function (s) { return s.in; })[0];
  set('[data-p-sizes]',
    '<span class="size-ring" data-flower aria-hidden="true"></span>' +
    p.sizes.map(function (s) {
      return '<button class="size" type="button" role="radio" data-size="' + s.s + '"' +
             ' aria-checked="' + (firstIn && s.s === firstIn.s) + '"' +
             (s.in ? '' : ' disabled aria-disabled="true"') + '>' + s.s + '</button>';
    }).join(''));

  var note;
  if (!here) {
    note = 'Sold out. <a href="#" style="color:inherit">Tell me if it comes back</a>';
  } else if (oneSize) {
    note = 'One size.';
  } else {
    var left = p.sizes.filter(function (s) { return s.in; }).map(function (s) { return s.s; });
    note = 'Chosen: <strong data-chosen-size>' + (firstIn ? firstIn.s : '—') + '</strong> · ' +
           (left.length === p.sizes.length ? 'all sizes available.'
            : 'only ' + left.join(', ') + ' left.');
  }
  set('[data-p-note]', note);

  var buy = root.querySelector('[data-p-buy]');
  if (buy) {
    buy.innerHTML = here
      ? '<button class="t__btn t__btn--wide" type="button" data-add' +
        ' data-name="' + p.name + '" data-price="' + p.price + '"' +
        ' data-material="' + p.material + '" data-img="' + p.img + '">Add to bag</button>' +
        '<a class="t__btn t__btn--ghost t__btn--wide" href="shop.html">Keep looking</a>'
      : '<button class="t__btn t__btn--wide" type="button" disabled style="opacity:.45;cursor:not-allowed">Sold out</button>' +
        '<a class="t__btn t__btn--ghost t__btn--wide" href="shop.html">See what is still here</a>';
  }

  /* story */
  set('[data-p-story]', (STORY[p.slug] || ['A Maison Cocody piece from the ' + p.collection + ' cycle.'])
      .map(function (t) { return '<p>' + t + '</p>'; }).join(''));

  /* size chart, only where sizes exist */
  var chartWrap = root.querySelector('[data-p-chart-wrap]');
  if (chartWrap) {
    if (oneSize) { chartWrap.hidden = true; }
    else {
      set('[data-p-chart]',
        '<caption>Measured flat. Centimetres, with inches underneath. Oversized by design — size down for a closer fit.</caption>' +
        '<thead><tr>' + CHART.head.map(function (h) { return '<th>' + h + '</th>'; }).join('') + '</tr></thead>' +
        '<tbody>' + CHART.rows.map(function (r) {
          return '<tr><td>' + r[0] + '</td>' + r.slice(1).map(function (cm) {
            return '<td>' + cm + ' cm<br>' + inch(cm) + ' in</td>';
          }).join('') + '</tr>';
        }).join('') + '</tbody>');
    }
  }

  /* fit finder only helps where there is more than one size */
  var fit = root.querySelector('[data-fit]');
  if (fit && oneSize) fit.hidden = true;

  /* four other pieces, preferring ones still available */
  var others = CAT.filter(function (x) { return x.slug !== p.slug; }).sort(function (a, b) {
    var ai = a.sizes.some(function (s) { return s.in; }) ? 0 : 1;
    var bi = b.sizes.some(function (s) { return s.in; }) ? 0 : 1;
    return ai - bi;
  }).slice(0, 4);
  set('[data-p-related]', others.map(function (o) {
    var sold = !o.sizes.some(function (s) { return s.in; });
    return '<a class="t__card" href="product.html?p=' + o.slug + '">' +
      '<div class="t__card-frame">' +
        '<img class="shot__a" src="' + IMG + o.img + '" width="880" height="1100" loading="lazy" alt="' + o.name + '">' +
        '<img class="shot__b" src="' + IMG + o.alt + '" width="880" height="1100" loading="lazy" alt="" aria-hidden="true">' +
      '</div>' +
      '<h3>' + o.name + '</h3><p>' + money(o.price) + (sold ? ' · sold out' : '') + '</p></a>';
  }).join(''));

  if (window.CocodyPaintFlowers) window.CocodyPaintFlowers(root);
})();
