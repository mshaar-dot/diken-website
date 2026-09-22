/* Diken Bros — site behaviour: mobile nav, scroll reveals, KPI count-up, mailto contact form. */
(function () {
  'use strict';
  var doc = document.documentElement;
  doc.classList.add('js');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var isAr = doc.lang === 'ar';

  /* Side menu: the button in the top bar opens a panel listing every page. */
  var toggle = document.querySelector('.navtoggle');
  var menu = document.getElementById('sidemenu');
  var scrim = document.querySelector('.scrim');
  var closeBtn = menu && menu.querySelector('.sideclose');
  var isOpen = false;
  var pageParts = ['header.nav', 'main', 'footer'].map(function (s) { return document.querySelector(s); }).filter(Boolean);
  function setMenu(open, restoreFocus) {
    if (!menu || open === isOpen) return;
    isOpen = open;
    menu.classList.toggle('open', open);
    if (open) menu.removeAttribute('inert'); else menu.setAttribute('inert', '');
    /* The rest of the page is inert while the menu is open, so it is a true modal for keyboard and screen-reader users. */
    pageParts.forEach(function (el) { if (open) el.setAttribute('inert', ''); else el.removeAttribute('inert'); });
    toggle.setAttribute('aria-expanded', String(open));
    if (scrim) scrim.classList.toggle('open', open);
    document.body.classList.toggle('nav-open', open);
    if (open) {
      var first = menu.querySelector('.sidelinks a[aria-current="page"]') || menu.querySelector('.sidelinks a') || closeBtn;
      first.focus({ preventScroll: true });
      if (first.scrollIntoView) first.scrollIntoView({ block: 'nearest' });
    } else if (restoreFocus) {
      toggle.focus();
    }
  }
  if (toggle && menu) {
    toggle.addEventListener('click', function () { setMenu(!isOpen, false); });
    if (closeBtn) closeBtn.addEventListener('click', function () { setMenu(false, true); });
    if (scrim) scrim.addEventListener('click', function () { setMenu(false, true); });
    menu.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false, false); });
    document.addEventListener('keydown', function (e) {
      if (!isOpen) return;
      if (e.key === 'Escape') { setMenu(false, true); return; }
      if (e.key === 'Tab') {
        var items = menu.querySelectorAll('a[href], button:not([disabled])');
        var firstEl = items[0], lastEl = items[items.length - 1];
        if (!menu.contains(document.activeElement)) { e.preventDefault(); firstEl.focus(); }
        else if (e.shiftKey && document.activeElement === firstEl) { e.preventDefault(); lastEl.focus(); }
        else if (!e.shiftKey && document.activeElement === lastEl) { e.preventDefault(); firstEl.focus(); }
      }
    });
  }

  /* Scroll reveals */
  var targets = document.querySelectorAll('.reveal');
  if (!reduce && 'IntersectionObserver' in window && targets.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { threshold: 0.15, rootMargin: '0px 0px -6% 0px' });
    targets.forEach(function (t) { io.observe(t); });
  } else {
    targets.forEach(function (t) { t.classList.add('in'); });
  }

  /* KPI count-up: <b data-count="5000" data-prefix="" data-suffix="+">5,000+</b> */
  var counters = document.querySelectorAll('[data-count]');
  function fmt(n) { return Math.round(n).toLocaleString('en-US'); }
  function run(el) {
    var end = parseFloat(el.getAttribute('data-count'));
    var pre = el.getAttribute('data-prefix') || '';
    var suf = el.getAttribute('data-suffix') || '';
    var t0 = null, dur = 1400;
    function step(ts) {
      if (t0 === null) t0 = ts;
      var p = Math.min(1, (ts - t0) / dur);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = pre + fmt(end * eased) + suf;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  if (counters.length && !reduce && 'IntersectionObserver' in window) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { run(en.target); cio.unobserve(en.target); } });
    }, { threshold: 0.4 });
    counters.forEach(function (c) { cio.observe(c); });
  }

  /* Contact form: validate, then hand the message to the visitor's mail client. */
  var form = document.querySelector('form.contact');
  if (form) {
    var status = form.querySelector('.status');
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var ok = true, first = null;
      form.querySelectorAll('[required]').forEach(function (f) {
        var bad = !f.value.trim() || (f.type === 'email' && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(f.value));
        f.setAttribute('aria-invalid', bad ? 'true' : 'false');
        if (bad) { ok = false; if (!first) first = f; }
      });
      if (!ok) { first.focus(); return; }
      var v = function (n) { var f = form.elements[n]; return f ? f.value.trim() : ''; };
      var topic = v('topic');
      var subject = (isAr ? 'رسالة من الموقع: ' : 'Website enquiry: ') + topic;
      var body = [
        (isAr ? 'الاسم: ' : 'Name: ') + v('name'),
        (isAr ? 'الشركة: ' : 'Company: ') + v('company'),
        (isAr ? 'البريد: ' : 'Email: ') + v('email'),
        (isAr ? 'الهاتف: ' : 'Phone: ') + v('phone'),
        (isAr ? 'الموضوع: ' : 'Topic: ') + topic,
        '',
        v('message')
      ].join('\n');
      var href = 'mailto:info@dikenbros.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
      if (status) {
        status.textContent = isAr
          ? 'فتحنا رسالة جاهزة في تطبيق البريد لديك. إن لم تُفتح، راسلنا مباشرة على info@dikenbros.com.'
          : 'We opened a ready-to-send email in your mail app. If nothing opened, write to info@dikenbros.com directly.';
        status.classList.add('show');
      }
      window.location.href = href;
    });
  }

  /* Footer year */
  document.querySelectorAll('[data-year]').forEach(function (el) { el.textContent = String(new Date().getFullYear()); });
})();
