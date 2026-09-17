/* ------------------------------------------------------------------
   Shop behaviour: the bag drawer, quick-add, and the listing filters.

   Vanilla on purpose. The pack gets emailed around and opened off a
   desktop, so a CDN dependency would mean a broken page on a train.
   Every behaviour here has a direct WooCommerce equivalent, noted at
   the point it matters.
   ------------------------------------------------------------------ */
(function () {
  'use strict';

  var CAT = window.COCODY_CATALOGUE || [];
  var FREE = window.COCODY_FREE_SHIPPING || 100;
  var IMG = 'assets/img/shop/';
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* pages sit one folder down; the hub sits at the root */
  var base = /\/(templates|directions)\//.test(location.pathname) ? '../' : '';
  var money = function (n) { return '€' + n.toFixed(0); };

  /* ================================================================
     The bag
     WooCommerce equivalent: the mini-cart, refreshed over cart
     fragments. Same states, same copy.
     ================================================================ */
  var bag = [];
  var els = {};
  var lastFocus = null;

  function bagMarkup() {
    return '' +
      '<div class="bag-scrim" data-bag-scrim></div>' +
      '<aside class="bag" data-bag role="dialog" aria-modal="true" aria-label="Your bag" hidden>' +
        '<div class="bag__head">' +
          '<h2>Your bag <span class="n" data-bag-n>(0)</span></h2>' +
          '<button class="bag__close" type="button" data-bag-close aria-label="Close the bag">&times;</button>' +
        '</div>' +
        '<div class="bag__items" data-bag-items></div>' +
        '<div class="bag__foot" data-bag-foot hidden>' +
          '<p class="bag__ship" data-bag-ship></p>' +
          '<div class="bag__meter"><span data-bag-meter></span></div>' +
          '<div class="bag__total"><span>Subtotal</span><span class="v" data-bag-total>€0</span></div>' +
          '<p class="bag__note">Shipping is worked out from your address at the next step, before you pay.</p>' +
          '<a class="bag__go" href="' + base + 'templates/checkout.html">Go to checkout</a>' +
        '</div>' +
      '</aside>';
  }

  function render() {
    var n = bag.length;
    els.n.textContent = '(' + n + ')';
    document.querySelectorAll('[data-bag-count]').forEach(function (el) {
      el.textContent = n;
      el.classList.add('is-bumped');
      setTimeout(function () { el.classList.remove('is-bumped'); }, 420);
    });

    if (!n) {
      els.items.innerHTML =
        '<div class="bag__empty">' +
          '<span class="mark" data-flower aria-hidden="true"></span>' +
          '<p>Nothing in the bag yet.</p>' +
          '<a href="' + base + 'templates/shop.html">See everything</a>' +
        '</div>';
      els.foot.hidden = true;
      if (window.CocodyPaintFlowers) window.CocodyPaintFlowers(els.items);
      return;
    }

    els.items.innerHTML = bag.map(function (it, i) {
      return '<div class="bag__row">' +
        '<img src="' + base + IMG + it.img + '" alt="" width="72" height="90">' +
        '<div>' +
          '<div class="nm">' + it.name + '</div>' +
          '<div class="mt">' + it.size + (it.material ? ' · ' + it.material : '') + '</div>' +
          '<button class="bag__rm" type="button" data-rm="' + i + '">Remove</button>' +
        '</div>' +
        '<div class="pz">' + money(it.price) + '</div>' +
      '</div>';
    }).join('');

    var total = bag.reduce(function (s, it) { return s + it.price; }, 0);
    els.total.textContent = money(total);
    var left = FREE - total;
    els.ship.innerHTML = left > 0
      ? 'Spend <b>' + money(left) + '</b> more for free shipping.'
      : 'You have <b>free shipping</b>.';
    els.meter.style.width = Math.min(100, (total / FREE) * 100).toFixed(1) + '%';
    els.foot.hidden = false;

    els.items.querySelectorAll('[data-rm]').forEach(function (b) {
      b.addEventListener('click', function () {
        bag.splice(+b.dataset.rm, 1);
        render();
      });
    });
  }

  function open() {
    lastFocus = document.activeElement;
    els.drawer.hidden = false;
    /* forced reflow rather than rAF, which is throttled in background
       tabs and would leave the drawer open but never painted */
    void els.drawer.offsetHeight;
    els.scrim.classList.add('is-open');
    els.drawer.classList.add('is-open');
    els.close.focus();
    document.addEventListener('keydown', onKey);
  }

  function close() {
    els.scrim.classList.remove('is-open');
    els.drawer.classList.remove('is-open');
    document.removeEventListener('keydown', onKey);
    var done = function () { els.drawer.hidden = true; };
    reduced ? done() : setTimeout(done, 620);
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  function onKey(e) {
    if (e.key === 'Escape') { close(); return; }
    if (e.key !== 'Tab') return;
    /* keep tabbing inside the drawer while it is open */
    var f = els.drawer.querySelectorAll('button, a[href], input, select');
    if (!f.length) return;
    var first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  window.CocodyBag = {
    add: function (item) { bag.push(item); render(); open(); },
    open: open,
    items: function () { return bag.slice(); }
  };

  function mountBag() {
    document.body.insertAdjacentHTML('beforeend', bagMarkup());
    els.scrim  = document.querySelector('[data-bag-scrim]');
    els.drawer = document.querySelector('[data-bag]');
    els.items  = document.querySelector('[data-bag-items]');
    els.foot   = document.querySelector('[data-bag-foot]');
    els.n      = document.querySelector('[data-bag-n]');
    els.total  = document.querySelector('[data-bag-total]');
    els.ship   = document.querySelector('[data-bag-ship]');
    els.meter  = document.querySelector('[data-bag-meter]');
    els.close  = document.querySelector('[data-bag-close]');
    els.close.addEventListener('click', close);
    els.scrim.addEventListener('click', close);

    /* every bag control on the page opens it */
    document.querySelectorAll('[data-bag-count]').forEach(function (el) {
      var btn = el.closest('button, a');
      if (btn) btn.addEventListener('click', function (e) { e.preventDefault(); open(); });
    });
    render();
  }

  /* ================================================================
     Quick add
     Sizes appear on the card for in-stock items. WooCommerce: the
     variation add-to-cart, only without leaving the listing.
     ================================================================ */
  function quickAdd() {
    document.querySelectorAll('[data-qa]').forEach(function (shot) {
      var slug = shot.dataset.qa;
      var p = CAT.filter(function (x) { return x.slug === slug; })[0];
      if (!p) return;
      var any = p.sizes.some(function (s) { return s.in; });
      if (!any) return;                       // nothing to add; leave it clean

      var el = document.createElement('div');
      el.className = 'qa';
      el.innerHTML = '<span class="qa__lbl">Add</span>' + p.sizes.map(function (s) {
        return '<button class="qa__s" type="button"' + (s.in ? '' : ' disabled') +
               ' data-size="' + s.s + '">' + s.s + '</button>';
      }).join('');
      shot.appendChild(el);

      el.querySelectorAll('.qa__s').forEach(function (b) {
        b.addEventListener('click', function (e) {
          e.preventDefault(); e.stopPropagation();
          window.CocodyBag.add({
            name: p.name, price: p.price, size: b.dataset.size,
            material: p.material, img: p.img
          });
        });
      });
    });
  }

  /* ================================================================
     The listing
     WooCommerce: the product archive, its category filters and the
     standard orderby.
     ================================================================ */
  function listing() {
    var grid = document.querySelector('[data-shop-grid]');
    if (!grid) return;
    var countEl = document.querySelector('[data-shop-count]');
    var sortEl = document.querySelector('[data-shop-sort]');
    var filters = document.querySelectorAll('[data-shop-filter]');
    var cat = 'All';

    function card(p) {
      var sold = !p.sizes.some(function (s) { return s.in; });
      return '<a class="sh__item" href="product.html?p=' + p.slug + '">' +
        '<span class="shot" data-qa="' + p.slug + '">' +
          (sold ? '' : '') +
          '<img class="shot__a" src="' + base + IMG + p.img + '" width="880" height="1100" loading="lazy" alt="' + p.name + '">' +
          '<img class="shot__b" src="' + base + IMG + p.alt + '" width="880" height="1100" loading="lazy" alt="" aria-hidden="true">' +
        '</span>' +
        '<span class="sh__meta">' +
          '<span><span class="nm">' + p.name + '</span>' +
          '<span class="mt">' + p.material + (sold ? ' · Sold out' : '') + '</span></span>' +
          '<span class="pz">' + money(p.price) + (p.was ? ' <s>' + money(p.was) + '</s>' : '') + '</span>' +
        '</span>' +
      '</a>';
    }

    function draw() {
      var list = CAT.filter(function (p) { return cat === 'All' || p.category === cat; });
      var how = sortEl ? sortEl.value : 'featured';
      if (how === 'low')  list = list.slice().sort(function (a, b) { return a.price - b.price; });
      if (how === 'high') list = list.slice().sort(function (a, b) { return b.price - a.price; });
      if (how === 'name') list = list.slice().sort(function (a, b) { return a.name.localeCompare(b.name); });
      if (how === 'stock') list = list.slice().sort(function (a, b) {
        var ai = a.sizes.some(function (s) { return s.in; }) ? 0 : 1;
        var bi = b.sizes.some(function (s) { return s.in; }) ? 0 : 1;
        return ai - bi;
      });

      grid.innerHTML = list.length
        ? list.map(card).join('')
        : '';
      var none = document.querySelector('[data-shop-none]');
      if (none) none.hidden = list.length > 0;
      if (countEl) countEl.textContent = list.length + (list.length === 1 ? ' piece' : ' pieces');
      quickAdd();
    }

    filters.forEach(function (b) {
      b.addEventListener('click', function () {
        cat = b.dataset.shopFilter;
        filters.forEach(function (o) { o.setAttribute('aria-pressed', String(o === b)); });
        draw();
      });
    });
    if (sortEl) sortEl.addEventListener('change', draw);
    draw();
  }

  /* ================================================================
     The register (Direction D)
     One list of everything the maison has released, newest first,
     driving a single large plate. Built from the same catalogue as the
     shop, so the two can never drift apart.
     ================================================================ */
  function register() {
    var body = document.querySelector('[data-register]');
    if (!body) return;
    var frame = document.querySelector('[data-plate]');
    var capName = document.querySelector('[data-plate-name]');
    var capMeta = document.querySelector('[data-plate-meta]');

    var list = CAT.slice().sort(function (a, b) { return b.ref.localeCompare(a.ref); });

    body.innerHTML = list.map(function (p) {
      var here = p.sizes.some(function (s) { return s.in; });
      return '<a class="d__row" href="' + base + 'templates/product.html?p=' + p.slug + '" data-state="' + (here ? 'here' : 'gone') + '"' +
             ' data-ref="' + p.ref + '">' +
        '<span class="ref">' + p.ref + '</span>' +
        '<span class="nm">' + p.name + '<i>' + p.material + '</i></span>' +
        '<span class="col">' + p.collection + '</span>' +
        '<span class="pz">' + money(p.price) + (p.was ? ' <s>' + money(p.was) + '</s>' : '') + '</span>' +
        '<span class="st"><span class="d__glyph" data-flower aria-hidden="true"></span>' +
          (here ? 'Here' : 'Archive') + '</span>' +
      '</a>';
    }).join('');

    /* one <img> per piece, stacked and cross-faded — no flicker, and
       every plate is already decoded by the time it is needed */
    if (frame) {
      frame.innerHTML = list.map(function (p, i) {
        return '<img src="' + base + IMG + p.img + '" alt="' + p.name + '"' +
               ' data-for="' + p.ref + '"' + (i === 0 ? ' class="is-live"' : '') +
               (i === 0 ? '' : ' loading="lazy"') + '>';
      }).join('');
    }

    function show(ref) {
      var p = list.filter(function (x) { return x.ref === ref; })[0];
      if (!p) return;
      body.querySelectorAll('.d__row').forEach(function (r) {
        r.classList.toggle('is-live', r.dataset.ref === ref);
      });
      if (frame) frame.querySelectorAll('img').forEach(function (im) {
        im.classList.toggle('is-live', im.dataset.for === ref);
      });
      var here = p.sizes.some(function (s) { return s.in; });
      if (capName) capName.innerHTML = '<b>' + p.ref + '</b> &nbsp;' + p.name;
      if (capMeta) capMeta.textContent = p.collection + ' · ' + p.year + ' · ' + (here ? 'available' : 'archive');
    }

    body.querySelectorAll('.d__row').forEach(function (r) {
      r.addEventListener('mouseenter', function () { show(r.dataset.ref); });
      r.addEventListener('focus', function () { show(r.dataset.ref); });
    });
    show(list[0].ref);

    /* the standing: the numbers the page opens with, counted not typed */
    var here = CAT.filter(function (p) { return p.sizes.some(function (s) { return s.in; }); }).length;
    var cols = {};
    CAT.forEach(function (p) { cols[p.collection] = 1; });
    var set = function (sel, v) { var e = document.querySelector(sel); if (e) e.textContent = v; };
    set('[data-n-pieces]', CAT.length);
    set('[data-n-collections]', Object.keys(cols).length);
    set('[data-n-here]', here);

    if (window.CocodyPaintFlowers) window.CocodyPaintFlowers(body);
  }

  /* ---------- announcement bar ---------- */
  function announcement() {
    var a = document.querySelector('.ann');
    if (!a) return;
    var x = a.querySelector('.ann__x');
    if (x) x.addEventListener('click', function () { a.hidden = true; });
  }

  function init() {
    mountBag();
    quickAdd();
    listing();
    register();
    announcement();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
