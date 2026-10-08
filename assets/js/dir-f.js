/* ------------------------------------------------------------------
   Direction F, after Aimé Leon Dore (8 Oct): the bar, the menu, the
   line under the bar, the film's subtitles, the shop's filter, and the
   product page's "You may also like" and held columns.

   Everything else — the bag, quick add, search, the shop's listing,
   the product page itself — is the same code E runs (shop.js,
   search.js, product.js, cocody.js); <html data-product-page> tells it
   which product page to link to. No dependencies; with the script gone
   the pages are still whole, the menu button simply does nothing.
   ------------------------------------------------------------------ */
(function () {
  'use strict';

  var html = document.documentElement;
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var money = function (n) { return '€' + n.toFixed(0); };

  /* ---- 1 · the bar: over the film, then white; past the first screen
     the wordmark gives way to the monogram ---- */
  function bar() {
    var hero = document.querySelector('[data-f-hero]');
    var head = document.querySelector('[data-f-bar]');
    if (!head) return;
    var state = null, ticking = false;
    function update() {
      ticking = false;
      var y = window.scrollY || 0;
      var limit = hero ? hero.offsetHeight - head.offsetHeight : 80;
      var past = y > limit;
      if (past !== state) {
        state = past;
        html.classList.toggle('f-turned', past);
        document.body.classList.toggle('is-over-hero', !!hero && !past);
      }
    }
    window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    window.addEventListener('resize', update);
    update();
  }

  /* ---- 2 · the menu: a dark grey panel from the left, the three
     groups as tabs, as on the reference ---- */
  function menu() {
    var panel = document.getElementById('f-menu');
    if (!panel) return;
    var box = panel.querySelector('.f-menu__panel');
    var openers = document.querySelectorAll('[data-f-menu-open]');
    var tabs = Array.prototype.slice.call(panel.querySelectorAll('[role="tab"]'));
    var last = null, timer = null;

    function select(tab, focus) {
      tabs.forEach(function (t) {
        var on = t === tab;
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
        var list = document.getElementById(t.getAttribute('aria-controls'));
        if (list) list.hidden = !on;
      });
      if (focus) tab.focus();
    }
    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () { select(t); });
      t.addEventListener('keydown', function (e) {
        var j = e.key === 'ArrowRight' ? i + 1 : e.key === 'ArrowLeft' ? i - 1 : null;
        if (j === null) return;
        e.preventDefault();
        select(tabs[(j + tabs.length) % tabs.length], true);
      });
    });
    function onKey(e) {
      if (e.key === 'Escape') { close(); return; }
      if (e.key !== 'Tab') return;
      var f = Array.prototype.filter.call(box.querySelectorAll('a[href], button, input'), function (el) {
        return el.tabIndex !== -1 && el.offsetParent !== null;
      });
      if (!f.length) return;
      if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
    }
    function open() {
      clearTimeout(timer);
      last = document.activeElement;
      panel.hidden = false;
      void panel.offsetWidth;
      panel.classList.add('is-open');
      document.body.style.overflow = 'hidden';
      openers.forEach(function (b) { b.setAttribute('aria-expanded', 'true'); });
      var on = panel.querySelector('[role="tab"][aria-selected="true"]');
      (on || box).focus();
      document.addEventListener('keydown', onKey);
    }
    function close() {
      if (panel.hidden || !panel.classList.contains('is-open')) return;
      panel.classList.remove('is-open');
      document.body.style.overflow = '';
      openers.forEach(function (b) { b.setAttribute('aria-expanded', 'false'); });
      document.removeEventListener('keydown', onKey);
      timer = setTimeout(function () { panel.hidden = true; }, reduced ? 0 : 450);
      if (last && last.focus) last.focus();
    }
    openers.forEach(function (b) { b.addEventListener('click', open); });
    panel.querySelectorAll('[data-f-menu-close]').forEach(function (c) { c.addEventListener('click', close); });
    panel.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', close); });
    /* search and the bag in the panel open their own; the panel goes first */
    panel.querySelectorAll('.f-menu__tools button').forEach(function (b) { b.addEventListener('click', close, true); });
  }

  /* ---- 3 · the line under the bar: Amsterdam, the date and the time,
     live, as the reference does with Queens ---- */
  function clock() {
    var el = document.querySelector('[data-f-clock]');
    if (!el || !window.Intl) return;
    var zone = 'Europe/Amsterdam';
    function parts(opts) {
      var o = {};
      new Intl.DateTimeFormat('en-GB', Object.assign({ timeZone: zone }, opts)).formatToParts(new Date())
        .forEach(function (p) { o[p.type] = p.value; });
      return o;
    }
    function tick() {
      try {
        var d = parts({ weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' });
        var t = parts({ hour: '2-digit', minute: '2-digit', hour12: false, timeZoneName: 'short' });
        el.innerHTML = 'Amsterdam, NL | ' + d.weekday + ', ' + d.month + ' ' + d.day + ', ' + d.year +
          '<span class="f-time"> | ' + t.hour + ':' + t.minute + (t.timeZoneName ? ' ' + t.timeZoneName : '') + '</span>';
      } catch (e) { /* the static line stays */ }
    }
    tick();
    setInterval(tick, 20000);
  }

  /* ---- 4 · the film's subtitles: one line at a time, as the
     reference runs its own over its film ---- */
  function subtitles() {
    var card = document.querySelector('[data-f-card]');
    var sub = document.querySelector('[data-f-sub]');
    if (!sub) return;
    var lines;
    try { lines = JSON.parse(sub.getAttribute('data-lines') || '[]'); } catch (e) { lines = []; }
    if (!lines.length) return;
    if (reduced) { if (card) card.setAttribute('data-off', ''); return; }
    var i = 0;
    setTimeout(function () { if (card) card.setAttribute('data-off', ''); }, 3800);
    setInterval(function () {
      sub.setAttribute('data-off', '');
      setTimeout(function () {
        i = (i + 1) % lines.length;
        sub.textContent = lines[i];
        sub.removeAttribute('data-off');
      }, 650);
    }, 4200);
  }

  /* ---- 5 · the shop's "Shop All +": a list that drops from the bar
     and names the category chosen (shop.js does the filtering) ---- */
  function shopFilter() {
    var btn = document.querySelector('[data-f-cats]');
    var list = btn && document.getElementById(btn.getAttribute('aria-controls'));
    if (!btn || !list) return;
    var label = btn.querySelector('[data-f-cats-label]');
    var filters = list.querySelectorAll('[data-shop-filter]');
    function name() {
      var on = list.querySelector('[data-shop-filter][aria-pressed="true"]');
      if (label) label.textContent = on && on.dataset.shopFilter !== 'All' ? on.textContent : 'Shop All';
    }
    function set(open) {
      list.hidden = !open;
      btn.setAttribute('aria-expanded', String(open));
      var sign = btn.querySelector('[data-f-sign]');
      if (sign) sign.textContent = open ? '–' : '+';
    }
    btn.addEventListener('click', function () { set(list.hidden); });
    filters.forEach(function (f) { f.addEventListener('click', function () { name(); set(false); }); });
    document.addEventListener('click', function (e) {
      if (!list.hidden && !list.contains(e.target) && !btn.contains(e.target)) set(false);
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !list.hidden) { set(false); btn.focus(); } });
    if (window.MutationObserver) {
      new MutationObserver(name).observe(list, { attributes: true, subtree: true, attributeFilter: ['aria-pressed'] });
    }
    name();
  }

  /* ---- 6 · the product page: "You may also like", and the two side
     columns held beside the pictures ---- */
  function alsoLike() {
    var row = document.querySelector('[data-f-also]');
    var CAT = window.COCODY_CATALOGUE || [];
    if (!row || !CAT.length) return;
    var slug = (location.search.match(/[?&]p=([a-z0-9-]+)/) || [])[1] || CAT[0].slug;
    row.innerHTML = CAT.filter(function (p) { return p.slug !== slug; }).map(function (p) {
      var sold = !p.sizes.some(function (s) { return s.in; });
      return '<a class="f-mini' + (sold ? ' is-sold' : '') + '" href="f-product.html?p=' + p.slug + '">' +
        '<span class="f-mini__frame"><img src="../assets/img/shop/' + p.img + '" width="880" height="1100" loading="lazy" alt="' + p.name + '"></span>' +
        '<span class="f-mini__nm">' + p.name + '</span>' +
        '<span class="f-mini__pz">' + money(sold ? (p.was || p.price) : p.price) + (sold ? ' · Sold out' : '') + '</span></a>';
    }).join('');
  }
  function holdColumns() {
    var cols = document.querySelectorAll('.f-prod__info, .f-prod__buy');
    if (!cols.length) return;
    function fit() {
      var bar = parseFloat(getComputedStyle(html).getPropertyValue('--f-bar')) || 60;
      cols.forEach(function (c) {
        /* taller than the window: scroll until the foot shows, then hold */
        var top = Math.min(bar + 24, window.innerHeight - c.offsetHeight - 24);
        c.style.setProperty('--f-top', top + 'px');
      });
    }
    fit();
    window.addEventListener('resize', fit);
    if ('ResizeObserver' in window) cols.forEach(function (c) { new ResizeObserver(fit).observe(c); });
  }

  /* ---- 7 · the signups thank the person, and send nothing ---- */
  function joins() {
    document.querySelectorAll('[data-f-join]').forEach(function (form) {
      var input = form.querySelector('input[type="email"]');
      var note = document.getElementById(form.getAttribute('data-f-join'));
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        if (!input || !input.value || !input.checkValidity()) {
          if (note) note.textContent = 'An email address, so we can write to you.';
          if (input) input.focus();
          return;
        }
        if (note) note.textContent = 'Thank you. The 10% is on its way to ' + input.value + '.';
        input.value = '';
      });
    });
  }

  function init() { bar(); menu(); clock(); subtitles(); shopFilter(); alsoLike(); holdColumns(); joins(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
