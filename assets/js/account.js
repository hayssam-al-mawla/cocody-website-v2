/* ------------------------------------------------------------------
   The account page (30 Sep): sign in, create an account, reset the
   password — three views in one column, one on screen at a time.

   The view is in the address — login.html, login.html#register,
   login.html#reset — so each can be linked to. Nothing is checked,
   stored or sent: each form looks at what was typed and answers with
   the line the real one would.

   Without the script the page is the sign-in form, which is the one
   the link in the bar promises.

   WordPress note: this is WooCommerce's own My account page with
   registration switched on, and its lost-password endpoint. The three
   forms are WooCommerce's; only the template around them is ours.
   ------------------------------------------------------------------ */
(function () {
  'use strict';

  var root = document.querySelector('[data-account]');
  if (!root) return;

  var views = {};
  root.querySelectorAll('[data-view]').forEach(function (v) { views[v.dataset.view] = v; });

  function heading(v) { return v.querySelector('h1'); }

  function show(name, focus) {
    if (!views[name]) name = 'signin';
    Object.keys(views).forEach(function (k) { views[k].hidden = k !== name; });
    var h = heading(views[name]);
    document.title = h.textContent + ' — Maison Cocody';
    if (focus) {
      window.scrollTo(0, 0);
      h.focus();
    }
    return name;
  }

  function fromHash() { return (location.hash || '').replace('#', ''); }

  /* the links between the views: no jump, no new entry in the history,
     but the address says where you are */
  root.querySelectorAll('[data-go]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      e.preventDefault();
      var name = show(a.dataset.go, true);
      try {
        history.replaceState(null, '', name === 'signin' ? location.pathname + location.search : '#' + name);
      } catch (err) {}
    });
  });
  /* a view typed into the address; an empty or foreign hash — the
     footer's placeholder links — changes nothing */
  window.addEventListener('hashchange', function () {
    if (views[fromHash()]) show(fromHash(), false);
  });

  /* Show / Hide on every password field */
  root.querySelectorAll('[data-pw-show]').forEach(function (b) {
    var field = b.parentNode.querySelector('input');
    b.addEventListener('click', function () {
      var on = field.type === 'password';
      field.type = on ? 'text' : 'password';
      b.textContent = on ? 'Hide' : 'Show';
      b.setAttribute('aria-pressed', String(on));
    });
  });

  /* one form per view. check() returns the field that is wrong and the
     line to say about it, or the line to say when everything is right. */
  function bind(name, check) {
    var view = views[name];
    if (!view) return;
    var form = view.querySelector('form');
    var note = view.querySelector('.ac__note');
    var h = heading(view);
    var title = h.textContent;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      form.querySelectorAll('[aria-invalid]').forEach(function (f) { f.removeAttribute('aria-invalid'); });
      var r = check(form);
      note.textContent = r.say;
      if (r.field) {
        r.field.setAttribute('aria-invalid', 'true');
        r.field.focus();
        return;
      }
      view.classList.add('is-done');
      h.textContent = view.dataset.doneTitle || title;
      h.focus();
    });

    /* "Sign out", "Use another address": back to the empty form */
    view.querySelectorAll('[data-again]').forEach(function (b) {
      b.addEventListener('click', function () {
        view.classList.remove('is-done');
        h.textContent = title;
        note.textContent = '';
        form.reset();
        form.querySelectorAll('[data-pw-show]').forEach(function (s) {
          s.parentNode.querySelector('input').type = 'password';
          s.textContent = 'Show';
          s.setAttribute('aria-pressed', 'false');
        });
        form.querySelector('input').focus();
      });
    });
  }

  function mailOf(form) { return form.querySelector('input[type="email"]'); }
  function okMail(m) { return m.value && m.checkValidity(); }

  bind('signin', function (form) {
    var mail = mailOf(form), pw = form.querySelector('[data-pw]');
    if (!okMail(mail)) return { field: mail, say: 'An email address, so we know whose account to open.' };
    if (!pw.value) return { field: pw, say: 'And the password that goes with it.' };
    return { say: 'Signed in as ' + mail.value + '.' };
  });

  bind('register', function (form) {
    var mail = mailOf(form), pw = form.querySelector('[data-pw]');
    if (!okMail(mail)) return { field: mail, say: 'An email address, so the account has a name.' };
    if (pw.value.length < 8) return { field: pw, say: 'A password of eight characters or more.' };
    return { say: 'The account for ' + mail.value + ' is made, and a confirmation is on its way to it.' };
  });

  bind('reset', function (form) {
    var mail = mailOf(form);
    if (!okMail(mail)) return { field: mail, say: 'The email address the account is under.' };
    return { say: 'If ' + mail.value + ' has an account, a link to choose a new password is on its way to it.' };
  });

  show(fromHash(), false);
})();
