// Builds the site: wraps every fragment in src/pages/<lang>/*.html with the shared
// shell (head, nav, footer) and writes finished pages to the repo root and ar/.
// Also writes sitemap.xml. No dependencies. Run: node tools/build.mjs
import { readdirSync, readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SITE = 'https://dikendelivery.com';
const UPDATED = '2026-09-22';

// Top bar: two quick links. Side menu: every page of the site, in site order; Terms & Conditions live in the side menu and the footer.
const TOP = {
  en: [['delivery', 'Delivery'], ['about', 'About']],
  ar: [['delivery', 'التوصيل'], ['about', 'من نحن']],
};
const PAGES = {
  en: [
    ['index', 'Home'], ['delivery', 'Delivery &amp; Logistics'], ['distribution', 'Distribution &amp; Agencies'],
    ['motorcycles', 'Motorcycles'], ['investments', 'Investments'], ['impact', 'Impact'],
    ['technology', 'Technology'], ['about', 'About'], ['contact', 'Contact'],
  ],
  ar: [
    ['index', 'الرئيسية'], ['delivery', 'التوصيل والخدمات اللوجستية'], ['distribution', 'التوزيع والوكالات'],
    ['motorcycles', 'الدراجات النارية'], ['investments', 'الاستثمارات'], ['impact', 'الأثر'],
    ['technology', 'التقنية'], ['about', 'من نحن'], ['contact', 'تواصل معنا'],
  ],
};

const T = {
  en: {
    dir: 'ltr', skip: 'Skip to content', home: 'Diken Bros home', menu: 'Menu', main: 'Main navigation',
    contact: 'Contact us', lang: 'العربية', langCode: 'ar',
    brandSmall: 'BROS · SINCE 1990',
    footerTag: 'Distribution, motorcycles, delivery and investments. Amman, Irbid and Zarqa.',
    footerAlt: 'شركة الدكن',
    divisions: 'Divisions', company: 'Company', contactH: 'Contact',
    divLinks: [['delivery', 'Delivery & Logistics'], ['distribution', 'Distribution & Agencies'], ['motorcycles', 'Motorcycles'], ['investments', 'Investments']],
    coLinks: [['impact', 'Impact'], ['technology', 'Technology'], ['about', 'About'], ['contact', 'Contact']],
    addr1: 'Amman: Abu Alanda, Wadi Saqra, Shafa Badran', addr2: 'Irbid and Zarqa',
    copy: 'Diken Bros. All rights reserved.', terms: 'Terms &amp; Conditions', privacy: 'Privacy Policy',
    legal: 'Legal', allPages: 'All pages', close: 'Close menu',
  },
  ar: {
    dir: 'rtl', skip: 'تخطي إلى المحتوى', home: 'الصفحة الرئيسية لشركة الدكن', menu: 'القائمة', main: 'التنقل الرئيسي',
    contact: 'تواصل معنا', lang: 'English', langCode: 'en',
    brandSmall: 'الدكن · منذ 1990',
    footerTag: 'التوزيع، الدراجات النارية، التوصيل والاستثمارات. عمّان وإربد والزرقاء.',
    footerAlt: 'Diken Bros',
    divisions: 'الأقسام', company: 'الشركة', contactH: 'تواصل',
    divLinks: [['delivery', 'التوصيل والخدمات اللوجستية'], ['distribution', 'التوزيع والوكالات'], ['motorcycles', 'الدراجات النارية'], ['investments', 'الاستثمارات']],
    coLinks: [['impact', 'الأثر'], ['technology', 'التقنية'], ['about', 'من نحن'], ['contact', 'تواصل معنا']],
    addr1: 'عمّان: أبو علندا، وادي صقرة، شفا بدران', addr2: 'إربد والزرقاء',
    copy: 'شركة الدكن. جميع الحقوق محفوظة.', terms: 'الشروط والأحكام', privacy: 'سياسة الخصوصية',
    legal: 'قانوني', allPages: 'كل الصفحات', close: 'إغلاق القائمة',
  },
};

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

function pageUrl(lang, name) {
  const file = name === 'index' ? '' : `${name}.html`;
  return lang === 'ar' ? `${SITE}/ar/${file}` : `${SITE}/${file}`;
}

function head(lang, name, meta, base) {
  const t = T[lang];
  const alt = lang === 'ar' ? 'en' : 'ar';
  const og = meta.og ? `${SITE}/${meta.og}` : `${SITE}/assets/img/hero-lineup-1200.jpg`;
  const ld = {
    '@context': 'https://schema.org', '@type': 'Organization', name: 'Diken Bros', alternateName: 'شركة الدكن',
    url: SITE + '/', logo: `${SITE}/assets/brand/diken-d-512.png`, foundingDate: '1990',
    telephone: '+962-6-416-6660', email: 'info@dikenbros.com',
    address: { '@type': 'PostalAddress', addressLocality: 'Amman', addressCountry: 'JO' },
  };
  return `<!doctype html>
<html lang="${lang}" dir="${t.dir}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(meta.title)}</title>
<meta name="description" content="${esc(meta.description)}">
<link rel="canonical" href="${pageUrl(lang, name)}">
<link rel="alternate" hreflang="${lang}" href="${pageUrl(lang, name)}">
<link rel="alternate" hreflang="${alt}" href="${pageUrl(alt, name)}">
<link rel="alternate" hreflang="x-default" href="${pageUrl('en', name)}">
<meta property="og:title" content="${esc(meta.title)}">
<meta property="og:description" content="${esc(meta.description)}">
<meta property="og:image" content="${og}">
<meta property="og:type" content="website">
<meta property="og:locale" content="${lang === 'ar' ? 'ar_JO' : 'en_GB'}">
<meta name="theme-color" content="#0b0b0c">
<link rel="icon" type="image/png" href="${base}assets/brand/favicon-64.png">
<link rel="apple-touch-icon" href="${base}assets/brand/diken-d-512.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Alexandria:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@phosphor-icons/web@2.1.1/src/regular/style.css">
<link rel="stylesheet" href="${base}css/site.css">
<script type="application/ld+json">${JSON.stringify(ld)}</script>
</head>`;
}

function nav(lang, name, base) {
  const t = T[lang];
  const altHref = lang === 'ar' ? `../${name}.html` : `ar/${name}.html`;
  const cur = (slug) => (slug === name ? ' aria-current="page"' : '');
  const top = TOP[lang].map(([slug, label]) => `<a href="${slug}.html"${cur(slug)}>${label}</a>`).join('');
  const pages = PAGES[lang].map(([slug, label]) => `<li><a href="${slug}.html"${cur(slug)}>${label}</a></li>`).join('\n      ');
  return `<body>
<a class="skip" href="#main">${t.skip}</a>
<header class="nav">
  <div class="wrap">
    <a class="brand" href="index.html" aria-label="${t.home}">
      <img src="${base}assets/brand/diken-d-512.png" alt="" width="36" height="36">
      <span>DIKEN<small>${t.brandSmall}</small></span>
    </a>
    <nav class="navlinks" aria-label="${t.main}">
      ${top}
      <a class="lang" href="${altHref}" lang="${t.langCode}" hreflang="${t.langCode}">${t.lang}</a>
      <a class="btn primary" href="contact.html">${t.contact}</a>
    </nav>
    <button class="navtoggle" type="button" aria-expanded="false" aria-controls="sidemenu" aria-label="${t.menu}"><i class="ph ph-list" aria-hidden="true"></i><span>${t.menu}</span></button>
  </div>
</header>
<div class="scrim"></div>
<aside class="sidemenu" id="sidemenu" role="dialog" aria-modal="true" aria-label="${t.menu}" inert>
  <div class="sidemenu-head">
    <span class="patch red">${t.allPages}</span>
    <button class="sideclose" type="button" aria-label="${t.close}"><i class="ph ph-x" aria-hidden="true"></i></button>
  </div>
  <nav aria-label="${t.allPages}">
    <ol class="sidelinks" role="list">
      ${pages}
    </ol>
  </nav>
  <div class="sidemenu-foot">
    <div class="sidelegal"><a href="terms.html"${cur('terms')}>${t.terms}</a><a href="privacy.html"${cur('privacy')}>${t.privacy}</a></div>
    <div class="cta">
      <a class="btn primary" href="contact.html">${t.contact}</a>
      <a class="btn ghost" href="${altHref}" lang="${t.langCode}" hreflang="${t.langCode}">${t.lang}</a>
    </div>
  </div>
</aside>
<main id="main">
`;
}

function footer(lang, base) {
  const t = T[lang];
  const list = (arr) => arr.map(([s, l]) => `<li><a href="${s}.html">${l}</a></li>`).join('\n          ');
  return `</main>
<footer>
  <div class="wrap">
    <div class="cols">
      <div>
        <a class="brand" href="index.html" aria-label="${t.home}"><img src="${base}assets/brand/diken-d-512.png" alt="" width="36" height="36"><span>DIKEN<small>${t.brandSmall}</small></span></a>
        <p style="margin-top:16px;max-width:36ch">${t.footerTag}</p>
        <p ${lang === 'ar' ? 'dir="ltr" lang="en"' : 'dir="rtl" lang="ar"'} style="margin-top:10px;color:var(--fg-3)">${t.footerAlt}</p>
      </div>
      <div>
        <h3>${t.divisions}</h3>
        <ul>
          ${list(t.divLinks)}
        </ul>
      </div>
      <div>
        <h3>${t.company}</h3>
        <ul>
          ${list(t.coLinks)}
        </ul>
      </div>
      <div>
        <h3>${t.contactH}</h3>
        <ul>
          <li><a href="tel:+96264166660" class="num">06 416 6660</a></li>
          <li><a href="mailto:info@dikenbros.com">info@dikenbros.com</a></li>
          <li>${t.addr1}</li>
          <li>${t.addr2}</li>
        </ul>
      </div>
    </div>
    <div class="base">
      <span>© <span data-year>2026</span> ${t.copy}</span>
      <nav aria-label="${t.legal}"><a href="terms.html">${t.terms}</a><a href="privacy.html">${t.privacy}</a></nav>
    </div>
  </div>
</footer>
<script src="${base}js/site.js" defer></script>
</body>
</html>
`;
}

function parseMeta(src, file) {
  const m = src.match(/^\s*<!--\s*meta\s*(\{[\s\S]*?\})\s*-->/);
  if (!m) throw new Error(`Missing meta comment in ${file}`);
  return { meta: JSON.parse(m[1]), body: src.slice(m[0].length).trim() };
}

const pages = [];
for (const lang of ['en', 'ar']) {
  const dir = join(ROOT, 'src', 'pages', lang);
  if (!existsSync(dir)) continue;
  const base = lang === 'ar' ? '../' : '';
  for (const f of readdirSync(dir).filter((x) => x.endsWith('.html')).sort()) {
    const name = f.replace(/\.html$/, '');
    const { meta, body } = parseMeta(readFileSync(join(dir, f), 'utf8'), f);
    const html = head(lang, name, meta, base) + nav(lang, name, base)
      + body.replaceAll('{{base}}', base).replaceAll('{{updated}}', UPDATED) + '\n' + footer(lang, base);
    const outDir = lang === 'ar' ? join(ROOT, 'ar') : ROOT;
    mkdirSync(outDir, { recursive: true });
    writeFileSync(join(outDir, f), html);
    pages.push({ lang, name });
  }
}

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${pages.map(({ lang, name }) => `  <url>
    <loc>${pageUrl(lang, name)}</loc>
    <lastmod>${UPDATED}</lastmod>
    <xhtml:link rel="alternate" hreflang="en" href="${pageUrl('en', name)}"/>
    <xhtml:link rel="alternate" hreflang="ar" href="${pageUrl('ar', name)}"/>
  </url>`).join('\n')}
</urlset>
`;
writeFileSync(join(ROOT, 'sitemap.xml'), sitemap);
console.log(`Built ${pages.length} pages + sitemap.xml`);
