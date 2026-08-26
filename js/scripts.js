(function () {
  'use strict';

  function gtag() { window.dataLayer = window.dataLayer || []; window.dataLayer.push(arguments); }
  function track(event, params) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(Object.assign({ event: event }, params || {}));
  }

  /* Consent banner */
  var CONSENT_COOKIE = 'consent_choice';
  function getCookie(name) {
    var m = document.cookie.match('(?:^|; )' + name + '=([^;]*)');
    return m ? decodeURIComponent(m[1]) : null;
  }
  function setCookie(name, value) {
    document.cookie = name + '=' + encodeURIComponent(value) + ';path=/;max-age=' + 60 * 60 * 24 * 365 + ';SameSite=Lax';
  }
  function applyConsent(choice) {
    var granted = choice === 'accepted' ? 'granted' : 'denied';
    gtag('consent', 'update', {
      ad_storage: granted,
      ad_user_data: granted,
      ad_personalization: granted,
      analytics_storage: granted
    });
  }
  var banner = document.getElementById('consent-banner');
  var stored = getCookie(CONSENT_COOKIE);
  if (stored) {
    applyConsent(stored);
  } else if (banner) {
    banner.hidden = false;
  }
  function choose(choice) {
    setCookie(CONSENT_COOKIE, choice);
    applyConsent(choice);
    if (banner) banner.hidden = true;
  }
  var acceptBtn = document.getElementById('consent-accept');
  var declineBtn = document.getElementById('consent-decline');
  if (acceptBtn) acceptBtn.addEventListener('click', function () { choose('accepted'); });
  if (declineBtn) declineBtn.addEventListener('click', function () { choose('declined'); });
  var reopen = document.getElementById('cookie-settings');
  if (reopen) reopen.addEventListener('click', function () { if (banner) banner.hidden = false; });

  /* Mobile drawer */
  var toggle = document.querySelector('.nav-toggle');
  var drawer = document.getElementById('mobile-drawer');
  var inertTargets = document.querySelectorAll('#main, .cta-band, .site-footer');
  if (toggle && drawer) {
    toggle.addEventListener('click', function () {
      var open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      toggle.setAttribute('aria-label', open ? 'Open menu' : 'Close menu');
      drawer.hidden = open;
      document.body.classList.toggle('drawer-open', !open);
      inertTargets.forEach(function (el) { el.inert = !open; });
      if (!open) {
        var firstLink = drawer.querySelector('a');
        if (firstLink) firstLink.focus();
      } else {
        toggle.focus();
      }
    });
  }

  /* Dropdowns: caret buttons toggle; close on outside click and Escape */
  document.querySelectorAll('.nav-caret').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var item = btn.closest('.has-dropdown');
      var open = btn.getAttribute('aria-expanded') === 'true';
      document.querySelectorAll('.nav-caret[aria-expanded="true"]').forEach(function (other) {
        other.setAttribute('aria-expanded', 'false');
        other.closest('.has-dropdown').classList.remove('open');
      });
      btn.setAttribute('aria-expanded', String(!open));
      item.classList.toggle('open', !open);
    });
  });
  document.addEventListener('click', function () {
    document.querySelectorAll('.has-dropdown.open').forEach(function (item) {
      item.classList.remove('open');
      var btn = item.querySelector('.nav-caret');
      if (btn) btn.setAttribute('aria-expanded', 'false');
    });
  });
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    document.querySelectorAll('.has-dropdown.open').forEach(function (item) {
      item.classList.remove('open');
      var btn = item.querySelector('.nav-caret');
      if (btn) btn.setAttribute('aria-expanded', 'false');
    });
    if (drawer && !drawer.hidden && toggle) toggle.click();
  });

  /* GA4 event delegation via data-track */
  document.addEventListener('click', function (e) {
    var el = e.target.closest('[data-track]');
    if (!el) return;
    var params = { label: el.getAttribute('data-label') || el.textContent.trim().slice(0, 60) };
    var href = el.getAttribute('href') || '';
    if (/^https?:/.test(href) && href.indexOf(location.hostname) === -1) {
      track('outbound_click', { label: params.label, url: href });
      if (el.getAttribute('data-track') === 'outbound_click') return;
    }
    track(el.getAttribute('data-track'), params);
  });

  /* FAQ opens */
  document.querySelectorAll('details.faq').forEach(function (d) {
    d.addEventListener('toggle', function () {
      if (d.open) track('faq_open', { label: d.querySelector('summary').textContent.trim().slice(0, 80) });
    });
  });

  /* Scroll depth */
  var marks = [25, 50, 75, 100];
  var fired = {};
  window.addEventListener('scroll', function () {
    var max = document.documentElement.scrollHeight - window.innerHeight;
    if (max <= 0) return;
    var pct = Math.round((window.scrollY / max) * 100);
    marks.forEach(function (m) {
      if (pct >= m && !fired[m]) {
        fired[m] = true;
        track('scroll_depth', { depth: m });
      }
    });
  }, { passive: true });

  /* Section views */
  if ('IntersectionObserver' in window) {
    var seen = new WeakSet();
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !seen.has(entry.target)) {
          seen.add(entry.target);
          track('section_view', { section: entry.target.getAttribute('data-section') });
        }
      });
    }, { threshold: 0.4 });
    document.querySelectorAll('[data-section]').forEach(function (s) { io.observe(s); });
  }

  /* Appointment form */
  var form = document.querySelector('form.appointment-form');
  if (form) {
    var started = false;
    form.addEventListener('input', function () {
      if (!started) { started = true; track('form_start', {}); }
    });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (form.querySelector('input[name="_gotcha"]').value) return;
      if (!form.checkValidity()) { form.reportValidity(); return; }
      var btn = form.querySelector('button[type="submit"]');
      btn.disabled = true;
      fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      }).then(function (res) {
        if (!res.ok) throw new Error('submit failed');
        track('form_submit', {});
        form.hidden = true;
        var success = document.getElementById('form-success');
        if (success) { success.hidden = false; success.focus(); }
      }).catch(function () {
        btn.disabled = false;
        var err = document.getElementById('form-error');
        if (err) err.hidden = false;
      });
    });
  }
})();
