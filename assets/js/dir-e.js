/* ------------------------------------------------------------------
   Direction E homepage: the grid, drawn from the catalogue.

   Eight pieces, four across, in the order the catalogue lists them.
   Runs as soon as it is parsed — before shop.js boots — so the quick
   add finds every in-stock card already on the page. The state chip on
   a sold-out piece is the shared .shot__state; on a piece with only
   some sizes left it names them, in the ochre, which is the one place
   on the page that colour appears.

   WooCommerce equivalent: the featured-products block on the front
   page, eight items, default order.
   ------------------------------------------------------------------ */
(function () {
  'use strict';
  var CAT = window.COCODY_CATALOGUE || [];
  var grid = document.querySelector('[data-e-grid]');
  if (!grid || !CAT.length) return;
  var money = function (n) { return '€' + n.toFixed(0); };

  grid.innerHTML = CAT.slice(0, 8).map(function (p, i) {
    var left = p.sizes.filter(function (s) { return s.in; }).map(function (s) { return s.s; });
    var here = left.length > 0;
    var partial = here && left.length < p.sizes.length;
    var state = !here ? '<span class="shot__state">Sold out</span>'
      : partial ? '<span class="shot__state shot__state--last">Only ' + left.join(', ') + ' left</span>'
      : '';
    return '<a class="e__card" href="../templates/product.html?p=' + p.slug + '">' +
      '<span class="shot" data-qa="' + p.slug + '">' +
        '<img class="shot__a" src="../assets/img/shop/' + p.img + '" width="880" height="1100"' +
          (i < 4 ? '' : ' loading="lazy"') + ' alt="' + p.name + '">' +
        '<img class="shot__b" src="../assets/img/shop/' + p.alt + '" width="880" height="1100" loading="lazy" alt="" aria-hidden="true">' +
        state +
      '</span>' +
      '<span class="e__card-meta">' +
        '<span><span class="nm">' + p.name + '</span><span class="mt">' + p.material + '</span></span>' +
        '<span class="pz">' + money(p.price) + (p.was ? ' <s>' + money(p.was) + '</s>' : '') + '</span>' +
      '</span>' +
    '</a>';
  }).join('');
})();
