/* ------------------------------------------------------------------
   The chrome Charlz asked for on 21 September, shared by every page:

   1. the marquee — the voucher and the free-shipping line, moving
   2. the masthead — the wordmark sits in the middle; once the page is
      moving it gives way to the flower, and the flower turns with the
      scroll
   3. the phone menu — since 7 Oct Aimé Leon Dore's side panel: dark
      grey, in from the left, the three groups (Shop, Maison Cocody,
      Archive) as tabs
   4. the dropdowns on the laptop's bar (23 Sep)
   5. the footer — its columns fold on a phone, and since 7 Oct the
      page slides up off it at the bottom

   No dependencies. Everything degrades to a working static page: with
   the script gone the marquee is a single line of text, the wordmark
   simply stays, and the menu button does nothing.

   WordPress note: the marquee is the theme's announcement bar; the
   masthead swap is twenty lines in the theme's header.js; the panel is
   the mobile menu. Nothing here needs a plugin.
   ------------------------------------------------------------------ */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var html = document.documentElement;

  /* ------------------------------------------------------------------
     1 · The marquee
     One set of items is written in the HTML. The script clones it until
     the track is at least twice the width of the bar, then moves the
     track by exactly one set — so the loop is seamless whatever the
     viewport, and the speed is constant (55px a second) rather than
     "one lap in 30 seconds" on a phone and a wall.
     ------------------------------------------------------------------ */
  function marquee() {
    document.querySelectorAll('[data-marquee]').forEach(function (m) {
      var track = m.querySelector('.ann__track');
      var set = m.querySelector('.ann__set');
      if (!track || !set) return;

      function build() {
        track.querySelectorAll('.ann__set:not(:first-child)').forEach(function (c) { c.remove(); });
        var w = set.getBoundingClientRect().width;
        if (!w) return;
        var need = Math.ceil((m.clientWidth * 2) / w) + 1;
        for (var i = 1; i < need; i++) {
          var c = set.cloneNode(true);
          c.setAttribute('aria-hidden', 'true');      /* a screen reader hears it once */
          track.appendChild(c);
        }
        track.style.setProperty('--set', w.toFixed(2) + 'px');
        track.style.setProperty('--ann-t', Math.max(16, w / 55).toFixed(1) + 's');
        /* the homepage film fills the screen under this strip, so the
           strip says how tall it is */
        html.style.setProperty('--ann-h', m.offsetHeight + 'px');
      }
      var x = m.querySelector('.ann__x');
      if (x) x.addEventListener('click', function () { html.style.setProperty('--ann-h', '0px'); });

      build();
      /* the webfont arrives after first layout and changes the width */
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(build);
      var t;
      window.addEventListener('resize', function () { clearTimeout(t); t = setTimeout(build, 150); });
    });
  }

  /* ------------------------------------------------------------------
     2 · The masthead
     [data-mark] holds the wordmark and, on top of it, the flower. Past
     the threshold the html element gets .is-turned: the wordmark fades
     and the flower takes its place. --turn is the scroll position in
     degrees, so the flower turns as you move and stops when you stop —
     the brief's "flower that spins on scroll", done as a scroll-linked
     rotation rather than a looping animation, because a mark that never
     stops turning is what "gimmicky" looks like.

     The threshold is the foot of the hero where a page has one
     ([data-hero]), and 96px everywhere else. On a page with a hero the
     body also carries .is-over-hero while the bar is still over it, so
     the bar can go transparent and the wordmark white.
     ------------------------------------------------------------------ */
  function masthead() {
    var bar = document.querySelector('[data-masthead]');
    if (!bar) return;
    var mark = bar.querySelector('[data-mark]');
    if (!mark) return;
    var hero = document.querySelector('[data-hero]');
    var turned = null, ticking = false;

    function threshold() {
      if (!hero) return 96;
      return Math.max(80, hero.offsetTop + hero.offsetHeight - bar.offsetHeight - 8);
    }

    function update() {
      ticking = false;
      var y = window.scrollY || html.scrollTop || 0;
      var past = y > threshold();
      if (past !== turned) {
        turned = past;
        html.classList.toggle('is-turned', past);
        document.body.classList.toggle('is-over-hero', !past && !!hero);
      }
      if (!reduced) html.style.setProperty('--turn', (y * 0.32).toFixed(1) + 'deg');
    }
    function onScroll() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(update);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    update();
  }

  /* ------------------------------------------------------------------
     3 · The phone menu (7 Oct)
     #menu is in the page already, hidden: a scrim and the panel. Opening
     slides the panel in from the left, locks the page underneath and
     moves focus to the open tab; Escape, the close, the scrim or any
     link closes it, and Tab stays inside while it is open. The tabs are
     a tablist — click, or the arrow keys — and each page opens on its
     own group (the markup says which).
     ------------------------------------------------------------------ */
  function menu() {
    var panel = document.getElementById('menu');
    if (!panel) return;
    var drawer = panel.querySelector('.t__drawer') || panel;
    var openers = document.querySelectorAll('[data-menu-open]');
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
        var j = e.key === 'ArrowRight' ? i + 1 : e.key === 'ArrowLeft' ? i - 1
              : e.key === 'Home' ? 0 : e.key === 'End' ? tabs.length - 1 : null;
        if (j === null) return;
        e.preventDefault();
        select(tabs[(j + tabs.length) % tabs.length], true);
      });
    });

    function onKey(e) {
      if (e.key === 'Escape') { close(); return; }
      if (e.key !== 'Tab') return;
      var f = Array.prototype.filter.call(drawer.querySelectorAll('a[href], button'), function (el) {
        return el.tabIndex !== -1 && el.offsetParent !== null;
      });
      if (!f.length) return;
      var first = f[0], end = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); end.focus(); }
      else if (!e.shiftKey && document.activeElement === end) { e.preventDefault(); first.focus(); }
    }
    function open() {
      clearTimeout(timer);
      last = document.activeElement;
      panel.hidden = false;
      void panel.offsetWidth;                 /* so the slide runs from off-screen */
      panel.classList.add('is-open');
      document.body.style.overflow = 'hidden';
      openers.forEach(function (b) { b.setAttribute('aria-expanded', 'true'); });
      var on = panel.querySelector('[role="tab"][aria-selected="true"]');
      (on || drawer).focus();
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
    panel.querySelectorAll('[data-menu-close]').forEach(function (c) { c.addEventListener('click', close); });
    panel.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', close); });
    /* the bag and search at its foot open their own drawers; the panel
       gets out of the way first */
    panel.querySelectorAll('.t__panel-tools button').forEach(function (b) {
      b.addEventListener('click', close, true);
    });
  }

  /* ------------------------------------------------------------------
     4 · The dropdowns (23 Sep)
     Hover opens a group in CSS alone, and the veil under it is CSS too
     (.t__bar::before). This adds the click — "a gradient that extends
     when we click on Shop": a click holds the group open until the
     button is clicked again, the pointer enters another group, Escape,
     or a click anywhere else. Enter or Space on the button does the
     same from a keyboard, and tabbing out of the list closes it.
     ------------------------------------------------------------------ */
  function dropdowns() {
    var groups = Array.prototype.slice.call(document.querySelectorAll('[data-group]'));
    if (!groups.length) return;

    function set(g, open) {
      g.classList.toggle('is-open', open);
      var b = g.querySelector('.t__group-btn');
      if (b) b.setAttribute('aria-expanded', String(open));
    }
    function closeAll(except) {
      groups.forEach(function (g) { if (g !== except) set(g, false); });
    }

    groups.forEach(function (g) {
      var b = g.querySelector('.t__group-btn');
      if (!b) return;
      b.addEventListener('click', function () {
        var open = !g.classList.contains('is-open');
        closeAll(g);
        set(g, open);
      });
      g.addEventListener('mouseenter', function () { closeAll(g); });
      g.addEventListener('focusout', function (e) {
        if (!g.contains(e.relatedTarget)) set(g, false);
      });
    });
    document.addEventListener('click', function (e) {
      var t = e.target;
      if (!(t && t.closest && t.closest('[data-group]'))) closeAll();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;
      var open = groups.filter(function (g) { return g.classList.contains('is-open'); })[0];
      if (!open) return;
      closeAll();
      var b = open.querySelector('.t__group-btn');
      if (b) b.focus();
    });
  }

  /* ------------------------------------------------------------------
     5 · The footer (7 Oct)
     On a phone its four link columns fold: each heading is a button
     that opens its list (on a laptop the lists are simply there, and the
     buttons stay out of the tab order).

     And the reveal, from the Nude Project footer: templates.css sticks
     the footer to the foot of the window, behind the page, so at the
     bottom the page slides up off it. That only works while the whole
     footer fits the window, so .has-reveal goes on <html> only then,
     measured against the window with its toolbars showing (100svh), and
     again whenever either changes size. With it on, a link to something
     in the footer (the strip's "join the maison") scrolls to the very
     bottom, because the footer is already "in view" — just underneath.
     ------------------------------------------------------------------ */
  function footer() {
    var f = document.querySelector('.t__footer');
    if (!f) return;

    var narrow = window.matchMedia('(max-width: 760px)');
    var cols = Array.prototype.slice.call(f.querySelectorAll('[data-foot-col]'));
    function sync() {
      cols.forEach(function (c) {
        var b = c.querySelector('.t__col-btn');
        if (!b) return;
        if (narrow.matches) { b.tabIndex = 0; b.setAttribute('aria-expanded', String(c.classList.contains('is-open'))); }
        else { b.tabIndex = -1; b.removeAttribute('aria-expanded'); }
      });
    }
    cols.forEach(function (c) {
      var b = c.querySelector('.t__col-btn');
      if (b) b.addEventListener('click', function () {
        if (!narrow.matches) return;
        c.classList.toggle('is-open');
        sync();
      });
    });
    if (narrow.addEventListener) narrow.addEventListener('change', sync);
    else if (narrow.addListener) narrow.addListener(sync);
    f.classList.add('is-collapsible');
    sync();

    var probe = document.createElement('div');
    probe.setAttribute('aria-hidden', 'true');
    probe.style.cssText = 'position:fixed;top:0;left:0;width:0;height:100vh;height:100svh;visibility:hidden;pointer-events:none';
    document.body.appendChild(probe);
    function fit() { html.classList.toggle('has-reveal', f.offsetHeight <= probe.offsetHeight); }
    fit();
    window.addEventListener('resize', fit);
    if ('ResizeObserver' in window) new ResizeObserver(fit).observe(f);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);

    function toFoot(id, smooth) {
      var t = id && document.getElementById(id);
      if (!t || !f.contains(t) || !html.classList.contains('has-reveal')) return false;
      window.scrollTo({ top: document.documentElement.scrollHeight, behavior: smooth && !reduced ? 'smooth' : 'auto' });
      return true;
    }
    document.addEventListener('click', function (e) {
      var a = e.target && e.target.closest && e.target.closest('a[href^="#"]');
      if (a && toFoot(a.getAttribute('href').slice(1), true)) e.preventDefault();
    });
    if (location.hash) window.addEventListener('load', function () { toFoot(location.hash.slice(1), false); });
  }

  function init() { marquee(); masthead(); menu(); dropdowns(); footer(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
