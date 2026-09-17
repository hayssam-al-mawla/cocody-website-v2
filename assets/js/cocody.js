/* ------------------------------------------------------------------
   MAISON COCODY — Website V2 prototypes
   Shared behaviour for the three design directions and the templates.
   No dependencies. Everything degrades to a working static page.
   ------------------------------------------------------------------ */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------------------------
     The flower — Maison Cocody's own mark.
     Traced from the brand's site icon rather than redrawn: six
     irregular petals with an off-centre hole, hand-drawn, not
     geometric. Outer contour and hole are separate paths so the mark
     can be stroked whole, stroked as a plain ring (the size selector,
     where a letter sits in the middle), or filled.
     ------------------------------------------------------------------ */
  var FLOWER_OUT = 'M112.4,4.5C116.8,4.6 123.5,4.0 129.1,6.6C134.8,9.1 142.5,15.2 146.3,19.7C150.2,24.3 151.1,26.1 152.4,33.9C153.8,41.7 153.8,60.7 154.4,66.3C155.1,72.0 152.4,67.7 156.5,67.8C160.5,68.0 173.6,66.7 178.8,67.3C183.9,68.0 184.3,68.9 187.4,71.9C190.4,74.9 195.2,80.6 197.0,85.6C198.8,90.5 198.8,97.0 198.0,101.8C197.2,106.6 195.9,110.0 191.9,114.4C188.0,118.8 176.5,121.4 174.2,128.1C171.9,134.8 177.9,148.9 178.2,154.4C178.6,160.0 177.7,159.1 176.2,161.5C174.8,164.0 172.4,167.1 169.6,169.1C166.9,171.2 163.2,172.9 159.5,173.7C155.8,174.4 151.2,174.2 147.4,173.7C143.6,173.2 140.9,172.6 136.7,170.7C132.5,168.7 125.8,163.6 122.0,162.0C118.2,160.4 115.9,160.6 113.9,161.0C112.0,161.5 112.2,161.5 110.4,164.6C108.6,167.6 105.9,175.3 103.3,179.3C100.7,183.2 98.4,185.8 94.7,188.4C91.0,191.0 85.1,193.8 81.0,195.0C76.9,196.1 73.4,196.2 69.9,195.5C66.3,194.7 62.9,193.2 59.7,190.4C56.5,187.6 51.6,186.1 50.6,178.8C49.6,171.4 54.2,152.3 53.7,146.3C53.1,140.3 52.8,143.9 47.1,142.8C41.3,141.7 25.6,141.0 19.2,139.8C12.8,138.5 11.4,138.6 8.6,135.2C5.8,131.8 3.6,124.4 2.5,119.5C1.4,114.6 1.6,109.2 2.0,105.8C2.4,102.4 3.3,101.5 5.0,99.2C6.8,97.0 7.7,95.0 12.6,92.1C17.5,89.3 32.5,88.6 34.4,82.0C36.4,75.4 25.6,59.4 24.3,52.6C22.9,45.9 24.8,45.0 26.3,41.5C27.8,38.0 31.0,34.2 33.4,31.9C35.8,29.5 37.9,28.3 40.5,27.3C43.1,26.3 43.9,24.6 49.1,25.8C54.3,27.0 67.0,33.0 71.9,34.4C76.8,35.8 76.6,35.0 78.5,34.4C80.3,33.8 81.2,34.1 83.0,30.9C84.9,27.7 87.8,18.6 89.6,15.2C91.5,11.7 92.0,11.6 94.2,10.1C96.4,8.6 99.7,7.0 102.8,6.1C105.8,5.1 108.0,4.4 112.4,4.5Z';
  var FLOWER_IN  = 'M104.3,79.0C106.8,79.2 110.4,80.1 112.4,81.0C114.4,81.9 115.4,83.0 116.5,84.6C117.6,86.1 118.5,88.0 119.0,90.1C119.5,92.2 119.8,94.9 119.5,97.2C119.2,99.5 118.1,101.9 117.0,103.8C115.8,105.7 114.8,106.9 112.4,108.4C110.0,109.8 105.3,111.7 102.8,112.4C100.3,113.1 99.1,112.8 97.2,112.4C95.4,112.0 93.3,111.2 91.6,109.9C90.0,108.5 88.0,105.7 87.1,104.3C86.2,102.9 86.2,103.5 86.1,101.3C86.0,99.0 86.0,93.3 86.6,90.6C87.2,87.9 88.5,86.5 89.6,85.1C90.7,83.6 91.8,82.9 93.2,82.0C94.5,81.2 95.9,80.5 97.7,80.0C99.6,79.5 101.9,78.8 104.3,79.0Z';

  window.CocodyFlower = function (cls) {
    return '<svg class="flower ' + (cls || '') + '" viewBox="0 0 200 200" aria-hidden="true">' +
           '<path class="f-out" d="' + FLOWER_OUT + '"/>' +
           '<path class="f-in" d="' + FLOWER_IN + '"/></svg>';
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
    document.querySelectorAll('.flower--draw .f-out').forEach(function (p) {
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
