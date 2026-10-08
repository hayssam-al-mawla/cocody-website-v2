/* ------------------------------------------------------------------
   MAISON COCODY — Website V2 prototypes
   Shared behaviour for the homepage and the templates.
   No dependencies. Everything degrades to a working static page.
   ------------------------------------------------------------------ */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------------------------
     The flower — Maison Cocody's own mark, straight out of the master
     vector pack. Not traced and not redrawn: these are the artwork's
     own two subpaths, the outer contour and the off-centre hole, kept
     apart so the mark can be stroked whole, stroked as a plain ring
     (the size selector, where a letter sits in the middle), or filled.
     The viewBox is the artwork's own bounding box, so the mark fills
     whatever box the CSS gives it.
     ------------------------------------------------------------------ */
  var FLOWER_OUT = 'M99.99,159.8c.83,5.6,2.1,11.16,3.66,16.6,1.52,5.32,6.11,7.66,10.91,9.41,6.93,2.54,14.24,3.22,21.49,4.18,4.34.57,8.69,1.11,12.98,1.94,6.73,1.29,8.29,3.22,7.27,9.99-.76,5.04-2.45,9.94-3.5,14.96-.7,3.32-1.25,6.71-1.45,10.1-.21,3.41.77,6.7,2.75,9.5,3.48,4.9,7.75,9.04,13.07,11.9,5.54,2.97,11.53,3.45,17.54,1.93,13.2-3.32,23.01-10.98,29.07-23.3,1.66-3.37,3.43-6.68,5.3-9.94,1.4-2.45,4.04-3.4,6.85-2.87,4.06.78,7.56,2.71,10.86,5.09,7.08,5.11,14.76,8.9,23.46,10.25,9.07,1.42,17.65.23,24.92-5.88,6.55-5.5,9.54-12.54,8.1-21.14-.62-3.64-1.55-7.21-2.34-10.81-.86-3.9-1.47-7.82-.57-11.78.19-.84.91-1.79,1.67-2.23,2.83-1.65,5.88-2.94,8.66-4.67,8.1-5.03,14.07-11.71,16.51-21.25,3.89-15.24-3.8-31.68-18.1-38.14-3.88-1.74-8-1.38-12.11-1.27-4.57.13-9.13-.02-13.68-.03-2.05,0-2.9-1.11-2.95-3.03-.17-7.01-.35-14.03-.52-21.05-.08-3.68-.04-7.38-.25-11.05-.5-8.95-4.07-16.56-10.63-22.62-3.61-3.32-7.27-6.78-11.46-9.2-3.44-2-7.63-2.94-11.62-3.64-6.23-1.1-12.51-.71-18.76.44-9.96,1.83-16.69,7.25-19.94,17-1.05,3.15-2.49,6.25-4.2,9.09-2.92,4.85-8.27,5.99-13.43,3.57-6-2.81-12.12-5.37-18.21-7.97-6.23-2.68-12.28-2.03-18.14,1.23-7.09,3.93-12.24,9.52-14.78,17.33-1.71,4.98-1.67,10,.08,14.9,1.8,5.02,3.98,9.89,5.91,14.86,1.02,2.61,2.05,5.24,2.66,7.95.78,3.41-.22,4.74-3.52,5.69-7.79,2.21-15.37,4.92-22.18,9.45-8.81,5.86-12.93,13.98-11.39,24.51Z';
  var FLOWER_IN  = 'M188.3,138.05c5.93-7.92,14.2-10.58,23.82-7.93,3.55.98,7.06,1.94,9.34,5.36,2.54,3.81,4.53,7.79,5.39,12.3,1.8,9.4-2.54,15.25-9.83,20.05-4.21,2.77-8.89,2.08-12.42.77-9.33-2.95-14.56-8.36-18.36-17.36-2.12-5.02-.9-9.26,2.05-13.2Z';

  /* Solid, it is one path — the contour and the hole together, filled
     even-odd in brand.css — so the hole is cut out of it (7 Oct: "it
     should have the white hole in the middle"). */
  window.CocodyFlower = function (cls) {
    var solid = /(^|\s)flower--solid(\s|$)/.test(cls || '');
    return '<svg class="flower ' + (cls || '') + '" viewBox="99.66 41.09 218.55 210.07" aria-hidden="true">' +
           (solid
             ? '<path class="f-solid" d="' + FLOWER_OUT + FLOWER_IN + '"/>'
             : '<path class="f-out" d="' + FLOWER_OUT + '"/>' +
               '<path class="f-in" d="' + FLOWER_IN + '"/>') + '</svg>';
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
        /* 1.45 times the letter since 7 Oct ("a bit too big"), from 1.75 */
        var size = Math.max(bb.width, bb.height) * 1.45;
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

  /* ---- size recommendation from height + weight (brief 3.5) ----
     Rewritten 7 Oct. It worked from the body-mass index alone, so a
     tall, heavy person came out as an L ("for someone of 200 cm and 200
     kg it says L"). Now height and weight are each read against what a
     size is cut for and the bigger answer wins — long enough but too
     narrow does not fit — and past the top of XL it says so instead of
     pretending. The ranges are ours, set against the chart (XL is 68.5
     cm across the chest, so 137 round, and 70 long); Cocody's own, from
     the fit model, would replace them. */
  var FIT = [
    { s: 'S',  h: 172, w: 65 },
    { s: 'M',  h: 179, w: 75 },
    { s: 'L',  h: 186, w: 86 },
    { s: 'XL', h: 194, w: 100 }
  ];
  function fitIndex(v, key) {
    for (var i = 0; i < FIT.length; i++) if (v <= FIT[i][key]) return i;
    return FIT.length;
  }

  function fitFinder() {
    var form = document.querySelector('[data-fit]');
    if (!form) return;
    var out = form.querySelector('[data-fit-result]');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var h = parseFloat(form.querySelector('[name=height]').value);
      var w = parseFloat(form.querySelector('[name=weight]').value);
      if (!h || !w) { out.textContent = 'Add your height and weight to see a size.'; return; }
      if (h < 120 || h > 230 || w < 35 || w > 250) {
        out.textContent = 'Check the numbers: height in centimetres, weight in kilograms.';
        return;
      }
      var i = Math.max(fitIndex(h, 'h'), fitIndex(w, 'w'));

      /* past the top of the range: say what XL is, and send them to the
         chart rather than to a size that will not fit */
      if (i === FIT.length) {
        var top = FIT[FIT.length - 1], tall = h > top.h, broad = w > top.w;
        out.innerHTML = 'XL is the biggest we make — ' +
          (tall && broad ? '137 cm round the chest and 70 cm long — and it will be tight and short on you.'
            : broad ? '137 cm round the chest — and it will sit tight on you, not loose as it is cut.'
            : '70 cm long — and it will sit short on you.') +
          ' Compare it with something you own in the <a href="#chart" data-fit-chart style="color:inherit">size chart</a> before you order.';
        var to = out.querySelector('[data-fit-chart]');
        if (to) to.addEventListener('click', function (ev) {
          var c = document.getElementById('chart');
          if (!c) return;
          ev.preventDefault();
          c.open = true;
          c.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'center' });
        });
        return;
      }

      var size = FIT[i].s;
      var btn = document.querySelector('.size[data-size="' + size + '"]');

      /* Recommending a size that cannot be bought is worse than saying
         nothing, so say so and offer the alert instead. */
      if (btn && btn.disabled) {
        out.innerHTML = 'Size <strong>' + size + '</strong> is the one for you, and it is sold out. ' +
          '<a href="#notify-mail" style="color:inherit">Tell me when ' + size + ' is back</a>';
        return;
      }
      out.innerHTML = 'Size <strong>' + size + '</strong> should fit you. ' +
        (i === 0 && (h < 160 || w < 50)
          ? 'It is the smallest we make, and the cut is oversized, so it will be roomy.'
          : 'The cut is oversized through the body, so take one down if you want it close.');
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
    sizePicker();
    fitFinder();
    bag();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
