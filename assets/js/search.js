/* ------------------------------------------------------------------
   Search.

   Opens on ⌘K / Ctrl-K, on / , or from any Search control. Filters the
   catalogue as you type, across name, collection, category and
   material, and lets you go straight to a piece with the arrow keys.

   WooCommerce equivalent: the product search endpoint. The keyboard
   handling and the empty state are the parts worth keeping.
   ------------------------------------------------------------------ */
(function () {
  'use strict';
  var CAT = window.COCODY_CATALOGUE || [];
  if (!CAT.length) return;

  var base = /\/(templates|directions)\//.test(location.pathname) ? '../' : '';
  var IMG = base + 'assets/img/shop/';
  var TPL = base + 'templates/';
  var money = function (n) { return '€' + n.toFixed(0); };
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var el, input, listEl, countEl, lastFocus = null, cursor = 0, hits = [];

  function mount() {
    document.body.insertAdjacentHTML('beforeend',
      '<div class="sr" data-search hidden>' +
        '<div class="sr__scrim" data-sr-scrim></div>' +
        '<div class="sr__panel" role="dialog" aria-modal="true" aria-label="Search">' +
          '<div class="sr__head">' +
            '<label class="sr-only" for="sr-q">Search the catalogue</label>' +
            '<input id="sr-q" class="sr__input" type="search" autocomplete="off" spellcheck="false" ' +
              'placeholder="Search pieces, collections, materials…">' +
            '<span class="sr__count" data-sr-count></span>' +
            '<button class="sr__esc" type="button" data-sr-close aria-label="Close search">Esc</button>' +
          '</div>' +
          '<div class="sr__list" data-sr-list role="listbox" aria-label="Results"></div>' +
          '<div class="sr__foot"><span>&uarr;&darr; to move</span><span>&crarr; to open</span><span>Esc to close</span></div>' +
        '</div>' +
      '</div>');
    el = document.querySelector('[data-search]');
    input = el.querySelector('.sr__input');
    listEl = el.querySelector('[data-sr-list]');
    countEl = el.querySelector('[data-sr-count]');

    el.querySelector('[data-sr-scrim]').addEventListener('click', close);
    el.querySelector('[data-sr-close]').addEventListener('click', close);
    input.addEventListener('input', function () { cursor = 0; draw(); });
    input.addEventListener('keydown', onKeys);
  }

  function match(q) {
    if (!q) return CAT.slice(0, 6);
    var t = q.toLowerCase().trim();
    return CAT.filter(function (p) {
      return (p.name + ' ' + p.collection + ' ' + p.category + ' ' + p.material)
        .toLowerCase().indexOf(t) > -1;
    });
  }

  function draw() {
    hits = match(input.value);
    countEl.textContent = input.value
      ? hits.length + (hits.length === 1 ? ' piece' : ' pieces')
      : 'Everything';

    if (!hits.length) {
      listEl.innerHTML =
        '<div class="sr__none">' +
          '<span class="mark" data-flower aria-hidden="true"></span>' +
          '<p>Nothing matches &ldquo;' + input.value.replace(/[<>&]/g, '') + '&rdquo;.</p>' +
          '<a href="' + TPL + 'shop.html">Browse everything instead</a>' +
        '</div>';
      if (window.CocodyPaintFlowers) window.CocodyPaintFlowers(listEl);
      return;
    }

    listEl.innerHTML = hits.map(function (p, i) {
      var here = p.sizes.some(function (s) { return s.in; });
      return '<a class="sr__hit" role="option" aria-selected="' + (i === cursor) + '"' +
             ' href="' + TPL + 'product.html?p=' + p.slug + '" data-i="' + i + '">' +
        '<img src="' + IMG + p.img + '" alt="" width="48" height="60" loading="lazy">' +
        '<span class="sr__hit-t">' + p.name +
          '<span>' + p.collection + ' · ' + p.material + '</span></span>' +
        '<span class="sr__hit-p">' + money(p.price) +
          (here ? '' : '<span class="sr__gone">Archive</span>') + '</span>' +
      '</a>';
    }).join('');

    listEl.querySelectorAll('.sr__hit').forEach(function (a) {
      a.addEventListener('mouseenter', function () { cursor = +a.dataset.i; mark(); });
    });
  }

  function mark() {
    listEl.querySelectorAll('.sr__hit').forEach(function (a, i) {
      a.setAttribute('aria-selected', String(i === cursor));
      if (i === cursor) a.scrollIntoView({ block: 'nearest' });
    });
  }

  function onKeys(e) {
    if (e.key === 'ArrowDown') { e.preventDefault(); cursor = Math.min(cursor + 1, hits.length - 1); mark(); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); cursor = Math.max(cursor - 1, 0); mark(); }
    else if (e.key === 'Enter' && hits[cursor]) { location.href = TPL + 'product.html?p=' + hits[cursor].slug; }
    else if (e.key === 'Escape') { close(); }
  }

  function open() {
    lastFocus = document.activeElement;
    el.hidden = false;
    /* A forced reflow, not requestAnimationFrame: rAF is throttled in
       background tabs, which would leave the panel open but invisible. */
    void el.offsetHeight;
    el.classList.add('is-open');
    input.value = ''; cursor = 0; draw();
    input.focus();
  }

  function close() {
    el.classList.remove('is-open');
    var done = function () { el.hidden = true; };
    reduced ? done() : setTimeout(done, 260);
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  function wire() {
    /* any control that says Search */
    document.querySelectorAll('button, a').forEach(function (b) {
      if ((b.textContent || '').trim().toLowerCase() === 'search') {
        b.addEventListener('click', function (e) { e.preventDefault(); open(); });
      }
    });
    document.addEventListener('keydown', function (e) {
      var typing = /^(INPUT|TEXTAREA|SELECT)$/.test((e.target.tagName || '')) || e.target.isContentEditable;
      if ((e.key === 'k' || e.key === 'K') && (e.metaKey || e.ctrlKey)) { e.preventDefault(); open(); }
      else if (e.key === '/' && !typing && el.hidden) { e.preventDefault(); open(); }
    });
  }

  function init() { mount(); wire(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
