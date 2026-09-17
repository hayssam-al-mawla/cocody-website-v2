/* ------------------------------------------------------------------
   MAISON COCODY — Website V2 prototypes
   Shared behaviour for the three design directions and the templates.
   No dependencies. Everything degrades to a working static page.
   ------------------------------------------------------------------ */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- the flower path, redrawn from the woven size label ---- */
  var FLOWER_D =
    'M100.00,44.00 C125.79,-3.43 154.90,8.63 139.60,60.40 C191.37,45.10 203.43,74.21 156.00,100.00 ' +
    'C203.43,125.79 191.37,154.90 139.60,139.60 C154.90,191.37 125.79,203.43 100.00,156.00 ' +
    'C74.21,203.43 45.10,191.37 60.40,139.60 C8.63,154.90 -3.43,125.79 44.00,100.00 ' +
    'C-3.43,74.21 8.63,45.10 60.40,60.40 C45.10,8.63 74.21,-3.43 100.00,44.00 Z';

  window.CocodyFlower = function (cls) {
    return '<svg class="flower ' + (cls || '') + '" viewBox="0 0 200 200" aria-hidden="true">' +
           '<path d="' + FLOWER_D + '"/></svg>';
  };

  /* Fill any <span data-flower> placeholder with the mark. */
  function paintFlowers(root) {
    (root || document).querySelectorAll('[data-flower]').forEach(function (el) {
      if (el.querySelector('svg')) return;
      el.innerHTML = window.CocodyFlower(el.dataset.flower || '');
    });
  }
  /* the bag draws its own empty state, so it needs this too */
  window.CocodyPaintFlowers = paintFlowers;

  /* ---- give every drawable flower its true path length ---- */
  function measureFlowers() {
    document.querySelectorAll('.flower--draw path').forEach(function (p) {
      try { p.parentNode.style.setProperty('--len', p.getTotalLength().toFixed(1)); } catch (e) {}
    });
  }

  /* ------------------------------------------------------------------
     Signature motion.
     Direction A  — the flower draws itself as a scroll indicator.
     Direction B  — the flower turns with scroll velocity.
     Direction C  — the flower blooms when its section arrives.
     ------------------------------------------------------------------ */
  function scrollFlower() {
    var marks = document.querySelectorAll('[data-flower-scroll]');
    if (!marks.length) return;
    var lastY = window.scrollY, spin = 0, ticking = false;

    function frame() {
      ticking = false;
      var y = window.scrollY;
      var max = document.documentElement.scrollHeight - window.innerHeight;
      var progress = max > 0 ? Math.min(1, Math.max(0, y / max)) : 0;
      var velocity = y - lastY;
      lastY = y;
      spin += velocity * 0.35;

      marks.forEach(function (m) {
        var mode = m.dataset.flowerScroll;
        if (mode === 'spin') {
          m.style.transform = 'rotate(' + spin.toFixed(1) + 'deg)';
        } else {
          m.style.setProperty('--bloom', progress.toFixed(3));
        }
      });
    }

    function onScroll() {
      if (!ticking) { ticking = true; requestAnimationFrame(frame); }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    frame();
  }

  /* ---- bloom a flower when its section scrolls into view ---- */
  function bloomOnEnter() {
    var targets = document.querySelectorAll('[data-bloom]');
    if (!targets.length) return;
    if (reduced || !('IntersectionObserver' in window)) {
      targets.forEach(function (t) { t.style.setProperty('--bloom', 1); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.style.setProperty('--bloom', 1);
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.35 });
    targets.forEach(function (t) { t.style.setProperty('--bloom', 0); io.observe(t); });
  }

  /* ------------------------------------------------------------------
     The size selector.
     On the real woven label the chosen size is the one the blossom
     encircles. The site does the same thing: picking a size moves the
     flower onto it. This is the brief's "signature UX feature", taken
     from the product rather than invented for the website.
     ------------------------------------------------------------------ */
  function sizePicker() {
    document.querySelectorAll('[data-sizes]').forEach(function (group) {
      var buttons = group.querySelectorAll('.size');
      var ring = group.querySelector('.size-ring');
      if (!buttons.length || !ring) return;

      function move(btn, animate) {
        var gb = group.getBoundingClientRect();
        var bb = btn.getBoundingClientRect();
        ring.style.transition = animate && !reduced
          ? 'transform .42s cubic-bezier(.22,.61,.36,1), width .42s cubic-bezier(.22,.61,.36,1), height .42s cubic-bezier(.22,.61,.36,1)'
          : 'none';
        var size = Math.max(bb.width, bb.height) * 1.75;
        ring.style.width  = size + 'px';
        ring.style.height = size + 'px';
        ring.style.transform =
          'translate(' + (bb.left - gb.left + bb.width / 2 - size / 2).toFixed(1) + 'px,' +
                         (bb.top - gb.top + bb.height / 2 - size / 2).toFixed(1) + 'px)' +
          ' rotate(' + (animate ? 22 : 0) + 'deg)';
        ring.style.opacity = 1;
      }

      buttons.forEach(function (btn) {
        btn.addEventListener('click', function () {
          buttons.forEach(function (b) { b.setAttribute('aria-checked', 'false'); });
          btn.setAttribute('aria-checked', 'true');
          move(btn, true);
          var out = document.querySelector('[data-chosen-size]');
          if (out) out.textContent = btn.dataset.size;
        });
        /* arrow-key support for the radio group */
        btn.addEventListener('keydown', function (e) {
          var i = Array.prototype.indexOf.call(buttons, btn), n = buttons.length, j = null;
          if (e.key === 'ArrowRight' || e.key === 'ArrowDown') j = (i + 1) % n;
          if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')   j = (i - 1 + n) % n;
          if (j !== null) { e.preventDefault(); buttons[j].focus(); buttons[j].click(); }
        });
      });

      /* With nothing in stock there is no size to hold, so the blossom
         stays away rather than hovering over a disabled letter. */
      var start = group.querySelector('.size[aria-checked="true"]');
      if (!start) {
        var firstFree = group.querySelector('.size:not([disabled])');
        if (!firstFree) { ring.style.opacity = 0; return; }
        start = firstFree;
      }
      void group.offsetHeight;
      move(start, false);
      window.addEventListener('resize', function () {
        var cur = group.querySelector('.size[aria-checked="true"]');
        if (cur) move(cur, false);
      });
    });
  }

  /* ---- size recommendation from height + weight (brief 3.5) ---- */
  function fitFinder() {
    var form = document.querySelector('[data-fit]');
    if (!form) return;
    var out = form.querySelector('[data-fit-result]');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var h = parseFloat(form.querySelector('[name=height]').value);
      var w = parseFloat(form.querySelector('[name=weight]').value);
      if (!h || !w) { out.textContent = 'Add your height and weight to see a size.'; return; }
      var bmi = w / Math.pow(h / 100, 2);
      var size = bmi < 19 ? 'S' : bmi < 23.5 ? 'M' : bmi < 28 ? 'L' : 'XL';
      if (h > 190 && size === 'M') size = 'L';
      var btn = document.querySelector('.size[data-size="' + size + '"]');

      /* Recommending a size that cannot be bought is worse than saying
         nothing, so say so and offer the alert instead. */
      if (btn && btn.disabled) {
        out.innerHTML = 'Size <strong>' + size + '</strong> is the one for you, and it is sold out. ' +
          '<a href="#" style="color:inherit">Tell me when ' + size + ' is back</a>';
        return;
      }
      out.innerHTML = 'Size <strong>' + size + '</strong> should fit you. ' +
        'The cut is oversized through the body, so take one down if you want it close.';
      if (btn) btn.click();
    });
  }

  /* ---- add to bag ----
     Hands the line off to the drawer in shop.js, which owns the bag.
     Falls back to a plain counter if that script is not on the page. */
  function bag() {
    var count = 0;
    document.querySelectorAll('[data-add]').forEach(function (btn) {
      var label = btn.textContent.trim();
      btn.addEventListener('click', function () {
        var chosen = document.querySelector('[data-chosen-size]');
        if (window.CocodyBag) {
          window.CocodyBag.add({
            name:     btn.dataset.name     || 'Signature Zip-Up Sweater',
            price:    +(btn.dataset.price  || 50),
            size:     chosen ? chosen.textContent.trim() : 'M',
            material: btn.dataset.material || 'Heavy-weight textured cotton',
            img:      btn.dataset.img      || 'sweater-a.jpg'
          });
        } else {
          count += 1;
          document.querySelectorAll('[data-bag-count]').forEach(function (el) {
            el.textContent = count;
            el.classList.add('is-bumped');
            setTimeout(function () { el.classList.remove('is-bumped'); }, 420);
          });
        }
        btn.classList.add('is-added');
        btn.textContent = 'Added to bag';
        setTimeout(function () {
          btn.classList.remove('is-added');
          btn.textContent = label;
        }, 1600);
      });
    });
  }

  /* ---- product gallery: click a thumb, swap the plate ---- */
  function gallery() {
    document.querySelectorAll('[data-gallery]').forEach(function (g) {
      var main = g.querySelector('[data-gallery-main]');
      g.querySelectorAll('[data-gallery-thumb]').forEach(function (t) {
        t.addEventListener('click', function () {
          g.querySelectorAll('[data-gallery-thumb]').forEach(function (o) {
            o.setAttribute('aria-current', 'false');
          });
          t.setAttribute('aria-current', 'true');
          main.src = t.dataset.galleryThumb;
          main.alt = t.dataset.alt || main.alt;
        });
      });
    });
  }

  /* ------------------------------------------------------------------
     Review bar — lets Charlz flip the shared templates between the
     three directions, so the same page can be judged in each skin.
     ------------------------------------------------------------------ */
  var KEY = 'cocody-direction';
  var NAMES = { a: 'Seamless', b: 'Le Labo', c: 'Le Décor' };

  function applyDirection(d) {
    document.documentElement.dataset.direction = d;
    try { localStorage.setItem(KEY, d); } catch (e) {}
    document.querySelectorAll('[data-set-direction]').forEach(function (b) {
      b.setAttribute('aria-current', String(b.dataset.setDirection === d));
    });
    var name = document.querySelector('[data-direction-name]');
    if (name) name.textContent = NAMES[d];
  }

  function reviewBar() {
    var bar = document.querySelector('.rv');
    if (!bar) return;
    if (bar.hasAttribute('data-switchable')) {
      /* ?dir=b wins, so a single page can be linked in a chosen skin */
      var fromUrl = (location.search.match(/[?&]dir=([abc])/) || [])[1];
      var saved = 'a';
      try { saved = fromUrl || localStorage.getItem(KEY) || 'a'; } catch (e) { saved = fromUrl || 'a'; }
      applyDirection(saved);
      bar.querySelectorAll('[data-set-direction]').forEach(function (b) {
        b.addEventListener('click', function () { applyDirection(b.dataset.setDirection); });
      });
    }
    var close = bar.querySelector('.rv__close');
    if (close) close.addEventListener('click', function () {
      bar.hidden = true;
      document.body.style.paddingBottom = '0';
    });
  }

  /* ------------------------------------------------------------------
     Shared-element transitions.
     A view-transition-name has to be unique on the page, so the name is
     put on the one photograph being opened at the moment of the click,
     and taken off again if the reader comes back.
     ------------------------------------------------------------------ */
  function morph() {
    if (!('startViewTransition' in document)) return;
    var NAME = 'piece';

    function tag(img) {
      document.querySelectorAll('[style*="view-transition-name"]').forEach(function (e) {
        e.style.viewTransitionName = '';
      });
      if (img) img.style.viewTransitionName = NAME;
    }

    document.addEventListener('click', function (e) {
      var link = e.target.closest('a[href*="product.html"]');
      if (!link) return;
      var img = link.querySelector('.shot__a, .t__card-frame img, img');
      tag(img);
    }, true);

    /* the product page's own plate is the other half of the pair */
    var main = document.querySelector('[data-gallery-main]');
    if (main) main.style.viewTransitionName = NAME;

    /* coming back via the bfcache, drop the name so the grid is clean */
    window.addEventListener('pageshow', function (ev) { if (ev.persisted) tag(null); });
  }

  /* ---- boot ---- */
  function init() {
    morph();
    paintFlowers();
    measureFlowers();
    scrollFlower();
    bloomOnEnter();
    sizePicker();
    fitFinder();
    bag();
    gallery();
    reviewBar();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
