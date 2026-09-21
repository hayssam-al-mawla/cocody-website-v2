/* ------------------------------------------------------------------
   The chrome Charlz asked for on 21 September, shared by every page:

   1. the marquee — the voucher and the free-shipping line, moving
   2. the masthead — the wordmark sits in the middle; once the page is
      moving it gives way to the flower, and the flower turns with the
      scroll
   3. the phone menu — the three groups (Shop, Archive, Maison Cocody)
      as a full-screen panel

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
     3 · The phone menu
     #menu is in the page already, hidden. Opening it locks the page
     underneath, moves focus in, and Escape or any link closes it.
     ------------------------------------------------------------------ */
  function menu() {
    var panel = document.getElementById('menu');
    if (!panel) return;
    var openers = document.querySelectorAll('[data-menu-open]');
    var closer = panel.querySelector('[data-menu-close]');
    var last = null;

    function esc(e) { if (e.key === 'Escape') close(); }
    function open() {
      last = document.activeElement;
      panel.hidden = false;
      document.body.style.overflow = 'hidden';
      openers.forEach(function (b) { b.setAttribute('aria-expanded', 'true'); });
      (closer || panel).focus();
      document.addEventListener('keydown', esc);
    }
    function close() {
      panel.hidden = true;
      document.body.style.overflow = '';
      openers.forEach(function (b) { b.setAttribute('aria-expanded', 'false'); });
      document.removeEventListener('keydown', esc);
      if (last && last.focus) last.focus();
    }

    openers.forEach(function (b) { b.addEventListener('click', open); });
    if (closer) closer.addEventListener('click', close);
    panel.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', close); });
    /* the bag and search controls inside the panel open their own
       drawers; the panel gets out of the way first */
    panel.querySelectorAll('button:not([data-menu-close])').forEach(function (b) {
      b.addEventListener('click', close, true);
    });
  }

  function init() { marquee(); masthead(); menu(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
