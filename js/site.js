/* Diken Bros — site behaviour: mobile nav drawer, scroll reveals, KPI count-up, mailto contact form. */
(function () {
  'use strict';
  var doc = document.documentElement;
  doc.classList.add('js');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var isAr = doc.lang === 'ar';

  /* Mobile navigation drawer, as on the original site: the button opens the same links stacked. */
  var toggle = document.querySelector('.navtoggle');
  var links = document.getElementById('navlinks');
  function setNav(open) {
    links.setAttribute('data-open', String(open));
    toggle.setAttribute('aria-expanded', String(open));
    toggle.innerHTML = open ? '<i class="ph ph-x" aria-hidden="true"></i>' : '<i class="ph ph-list" aria-hidden="true"></i>';
    document.body.style.overflow = open ? 'hidden' : '';
  }
  if (toggle && links) {
    toggle.addEventListener('click', function () { setNav(links.getAttribute('data-open') !== 'true'); });
    links.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', function () { setNav(false); }); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && links.getAttribute('data-open') === 'true') { setNav(false); toggle.focus(); } });
    window.matchMedia('(min-width: 1200px)').addEventListener('change', function (m) { if (m.matches) setNav(false); });
  }

  /* Scroll reveals */
  var targets = document.querySelectorAll('.reveal, .numbers');
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
        status.classList.add('show'); status.classList.add('ok');
      }
      window.location.href = href;
    });
  }

  /* Footer year */
  document.querySelectorAll('[data-year]').forEach(function (el) { el.textContent = String(new Date().getFullYear()); });
})();
