# Diken Bros website — redesign spec

Date: 2026-09-22
Status: approved by the owner in conversation (build locally, no GitHub push yet).

## Goal

Replace the current draft site at https://dikendelivery.com with a more professional
version that keeps **exactly the same information** (copy, numbers, photos, logos,
both languages) and adds **Terms & Conditions** and **Privacy Policy** pages.

## Constraints

- Static site (HTML/CSS/JS, no build step) so it deploys unchanged to GitHub Pages.
- Same URL scheme as the live site so old links keep working:
  `index.html, delivery.html, distribution.html, motorcycles.html, investments.html,
  impact.html, technology.html, about.html, contact.html` and the same names under `ar/`.
- New pages: `terms.html`, `privacy.html`, `ar/terms.html`, `ar/privacy.html`.
- Keep the Diken identity: black `#0B0B0C`, red `#ED1C26`, Alexandria typeface
  (covers Latin and Arabic), Phosphor icons.
- Bilingual: English LTR, Arabic RTL. Each page links to its counterpart with `hreflang`.
- No external services. The contact form composes a `mailto:` to `info@dikenbros.com`.
- Do not add a `CNAME`; the live domain stays untouched until the owner decides.

## What changes vs. the live site

1. **Design quality**: consistent 12-column grid, larger editorial headlines with tighter
   tracking, more whitespace, full-bleed hero photo with gradient, KPI band with count-up
   numbers, unified timeline component, hairline cards, partner logo strip, red CTA band,
   complete footer with legal links, sticky glass nav, mobile drawer menu, scroll reveals
   that respect `prefers-reduced-motion`.
2. **Internal draft notes removed** from the public pages: "Draft one, September 2026",
   "(years to confirm)", "To add: …", "… to confirm", "Partner names withheld in this draft".
   Every removed note is listed in `OPEN-ITEMS.md` for the owner to complete.
3. **Legal pages added** (Terms of Use, Privacy Policy) in both languages, linked from the
   footer of every page and from the contact form.
4. **SEO/meta**: title, description, canonical, `hreflang` pair, Open Graph, theme-color,
   JSON-LD `Organization`, `sitemap.xml`, `robots.txt`, `404.html`.
5. **Accessibility**: skip link, visible focus, `aria-current` nav, labelled form fields,
   `role="status"` on the form message, SVG diagram with `<title>`.

## Content inventory (must be carried over verbatim)

Home: hero tagline (EN + AR), lead, 5 KPIs, five division doors, timeline (4 items),
"firsts" (photo panel + 4 firsts), technology (4 agents + order-flow diagram),
partners strip (18 logos), contact band, footer.

Delivery: hero, 6 KPIs, three cities (Jordan / Riyadh / Dubai), "Why we own 80 vehicles"
(2 paragraphs), partners + captains panels, "Become a captain" 4 steps, CTA.

Distribution: hero, three brands (Motul / Wabco / BPW), "Thirty-five years of parts"
timeline (2 items), CTA.

Motorcycles: hero, two brands (Hero / SYM), "What comes with the bike" (3 items), CTA.

Investments: hero, two holdings (50% Samhouri & Diken, 25% Areena), "Why swapping matters"
(3 items), CTA.

Impact: hero, 5 social-responsibility panels, green energy panel + "What a captain gains", CTA.

Technology: hero, 4 agents, order-flow diagram, CTA.

About: hero, 8-step story timeline, "What we believe" (tagline + 3 values).

Contact: hero, form (name, company, email, phone, topic select with 7 options, message),
branches (Amman ×3 areas, Irbid, Zarqa), phone `06 416 6660` / `+962 6 416 6660`,
`info@dikenbros.com`.

Footer: brand line, "Distribution, motorcycles, delivery and investments. Amman, Irbid and
Zarqa.", Divisions / Company / Contact columns, © 2026 Diken Bros, legal links.

## Legal pages

**Terms & Conditions** sections: acceptance; who we are; use of the site; captain applications
and enquiries are not offers of employment or contracts; intellectual property; third-party
brands and links; accuracy of information; no warranty; limitation of liability;
indemnity; governing law (Hashemite Kingdom of Jordan, Amman courts); changes; contact.

**Privacy Policy** sections: scope; data we collect (contact form fields, phone/email
correspondence, server logs by the host); how we use it; legal basis / consent; sharing
(group divisions, service providers, legal requirements; no selling); retention;
cookies (none set by the site; fonts and icons load from Google Fonts and jsDelivr);
your rights (access, correction, deletion); children; security; changes; contact.

Company name used: **Diken Bros / شركة الدكن**. The registered legal entity is not on the
current site and is recorded as an open item.

## Architecture

```
diken-website/
  index.html … contact.html, terms.html, privacy.html
  ar/ (same names)
  css/site.css      one stylesheet, CSS custom properties, logical properties for RTL
  js/site.js        nav drawer, reveals, count-up, mailto form
  assets/           brand, img, logos (copied from the live site)
  sitemap.xml, robots.txt, 404.html, .nojekyll
  OPEN-ITEMS.md, README.md
  docs/superpowers/specs, docs/superpowers/plans
```

Page content is written once per language as an HTML fragment in `src/pages/{en,ar}/`.
`tools/build.mjs` (Node, no dependencies) wraps each fragment in the shared head, nav and
footer and writes the finished page to the root or `ar/`, so the 22 headers and footers
never drift apart. The built pages are committed because GitHub Pages serves them directly.
`tools/check.mjs` verifies every internal link and image path resolves, that every EN page
has an AR twin with matching `hreflang`, that each page has one `h1`, a title and a
description, and that no draft-note strings remain.

## Testing / verification

- `node tools/check.mjs` passes (links, images, hreflang pairs, no draft-note strings).
- Serve locally and screenshot every page at desktop and mobile widths, EN and AR.
- Console has no errors; form validation blocks empty required fields and opens `mailto:`.
