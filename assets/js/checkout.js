/* ------------------------------------------------------------------
   Checkout.

   The point of this page is brief 3.7: the customer sees the real
   shipping cost before paying, and the label and invoice are produced
   without anyone looking anything up.

   The rate table below is a stand-in. On the live site the same
   function is a call to the carrier or the aggregator, keyed on the
   destination and the parcel's weight and dimensions — which is why
   every product needs those numbers set before any of this works.
   ------------------------------------------------------------------ */
(function () {
  'use strict';
  var root = document.querySelector('[data-checkout]');
  if (!root) return;

  var FREE = window.COCODY_FREE_SHIPPING || 100;
  var IMG = '../assets/img/shop/';
  var money = function (n) { return n === 0 ? 'Free' : '€' + n.toFixed(2).replace(/\.00$/, ''); };

  /* destination → what the carriers quote for a parcel this size */
  var ZONES = {
    NL: { label: 'Netherlands', duty: false, rates: [
      { who: 'DHL Parcel', when: 'Tomorrow, before 17:00', cost: 4.95 },
      { who: 'DHL ServicePoint', when: '1–2 days, collect from a point', cost: 3.45 },
      { who: 'UPS Express', when: 'Tomorrow, before 12:00', cost: 12.50 }
    ]},
    BE: { label: 'Belgium', duty: false, rates: [
      { who: 'DHL Parcel', when: '1–2 days', cost: 6.75 },
      { who: 'UPS Standard', when: '2 days', cost: 8.20 }
    ]},
    FR: { label: 'France', duty: false, rates: [
      { who: 'DHL Parcel', when: '2–3 days', cost: 8.90 },
      { who: 'UPS Standard', when: '2 days', cost: 10.40 }
    ]},
    DE: { label: 'Germany', duty: false, rates: [
      { who: 'DHL Parcel', when: '2–3 days', cost: 7.60 },
      { who: 'UPS Standard', when: '2 days', cost: 9.80 }
    ]},
    ES: { label: 'Spain', duty: false, rates: [
      { who: 'DHL Parcel', when: '3–4 days', cost: 11.20 },
      { who: 'UPS Standard', when: '3 days', cost: 13.60 }
    ]},
    GB: { label: 'United Kingdom', duty: true, rates: [
      { who: 'DHL Express', when: '2–3 days, duties at the door', cost: 16.40 },
      { who: 'UPS Expedited', when: '3–4 days', cost: 14.10 }
    ]},
    US: { label: 'United States', duty: true, rates: [
      { who: 'DHL Express Worldwide', when: '3–5 days', cost: 28.50 },
      { who: 'UPS Saver', when: '4–6 days', cost: 24.90 }
    ]},
    CI: { label: 'Côte d’Ivoire', duty: true, rates: [
      { who: 'DHL Express Worldwide', when: '4–6 days', cost: 41.00 },
      { who: 'UPS Worldwide Saver', when: '5–7 days', cost: 38.20 }
    ]}
  };

  var countryEl = root.querySelector('[data-co-country]');
  var ratesEl   = root.querySelector('[data-co-rates]');
  var dutyEl    = root.querySelector('[data-co-duty]');
  var linesEl   = root.querySelector('[data-co-lines]');
  var subEl     = root.querySelector('[data-co-sub]');
  var shipEl    = root.querySelector('[data-co-ship]');
  var shipName  = root.querySelector('[data-co-shipname]');
  var totalEl   = root.querySelector('[data-co-total]');
  var payTotal  = root.querySelector('[data-co-paytotal]');
  var freeEl    = root.querySelector('[data-co-free]');
  var payBtn    = root.querySelector('[data-co-pay]');
  var after     = root.querySelector('[data-co-after]');

  var chosen = 0;

  /* The bag lives in shop.js and is in memory only, so a fresh page
     load has nothing in it. Rather than show an empty checkout, seed it
     with the two pieces that are actually in stock — this page is here
     to demonstrate the flow. */
  function lines() {
    var b = (window.CocodyBag && window.CocodyBag.items && window.CocodyBag.items()) || [];
    if (b.length) return b;
    var CAT = window.COCODY_CATALOGUE || [];
    return CAT.filter(function (p) { return p.sizes.some(function (s) { return s.in; }); })
      .map(function (p) {
        var s = p.sizes.filter(function (x) { return x.in; })[0];
        return { name: p.name, price: p.price, size: s.s, material: p.material, img: p.img };
      });
  }

  var items = lines();

  function drawLines() {
    if (!items.length) {
      linesEl.innerHTML = '<p class="co__empty">Your bag is empty. <a href="shop.html">See everything</a></p>';
      return;
    }
    linesEl.innerHTML = items.map(function (it) {
      return '<div class="co__line">' +
        '<img src="' + IMG + it.img + '" alt="" width="54" height="68">' +
        '<div><div class="nm">' + it.name + '</div><div class="mt">' + it.size + '</div></div>' +
        '<div class="pz">€' + it.price + '</div>' +
      '</div>';
    }).join('');
  }

  function sub() { return items.reduce(function (s, i) { return s + i.price; }, 0); }

  function drawRates() {
    var z = ZONES[countryEl.value] || ZONES.NL;
    var free = sub() >= FREE;
    ratesEl.innerHTML = z.rates.map(function (r, i) {
      var cost = free ? 0 : r.cost;
      return '<button class="co__rate" type="button" role="radio" aria-checked="' + (i === chosen) + '" data-i="' + i + '">' +
        '<span class="co__dot" aria-hidden="true"></span>' +
        '<span class="who">' + r.who + '<span class="when">' + r.when + '</span></span>' +
        '<span class="cost">' + (free ? '<b>Free</b>' : '<b>' + money(cost) + '</b>') + '</span>' +
      '</button>';
    }).join('');
    ratesEl.querySelectorAll('.co__rate').forEach(function (b) {
      b.addEventListener('click', function () { chosen = +b.dataset.i; drawRates(); totals(); });
    });
    if (dutyEl) {
      dutyEl.hidden = !z.duty;
      dutyEl.textContent = z.duty
        ? 'Outside the EU, so duties and import VAT are charged on arrival unless you choose to pay them up front. Which of those you offer is one of the decisions in the document.'
        : '';
    }
  }

  function totals() {
    var z = ZONES[countryEl.value] || ZONES.NL;
    var r = z.rates[chosen] || z.rates[0];
    var s = sub();
    var free = s >= FREE;
    var ship = free ? 0 : r.cost;
    subEl.textContent = '€' + s;
    shipEl.textContent = free ? 'Free' : money(ship);
    if (shipName) shipName.textContent = items.length ? '· ' + r.who : '';
    var grand = s + ship;
    totalEl.textContent = '€' + grand.toFixed(2).replace(/\.00$/, '');
    if (payTotal) payTotal.textContent = '€' + grand.toFixed(2).replace(/\.00$/, '');
    if (freeEl) {
      var left = FREE - s;
      freeEl.textContent = free
        ? 'Free shipping applied — this order is over €' + FREE + '.'
        : 'Add €' + left + ' more and shipping is on us.';
    }
  }

  countryEl.addEventListener('change', function () { chosen = 0; drawRates(); totals(); });

  if (payBtn) payBtn.addEventListener('click', function () {
    var z = ZONES[countryEl.value] || ZONES.NL;
    var r = z.rates[chosen] || z.rates[0];
    payBtn.disabled = true;
    payBtn.textContent = 'Paid';
    payBtn.style.opacity = '.55';
    if (after) {
      after.hidden = false;
      var done = after.querySelector('.co__done');
      if (!done) {
        after.insertAdjacentHTML('afterbegin',
          '<p class="co__done"><span class="mark" data-flower aria-hidden="true"></span>' +
          'Order placed. Label queued with ' + r.who + ', invoice on its way.</p>');
        if (window.CocodyPaintFlowers) window.CocodyPaintFlowers(after);
      }
      after.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });

  drawLines();
  drawRates();
  totals();
})();
