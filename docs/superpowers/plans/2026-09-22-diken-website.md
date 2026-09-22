# Diken Bros Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild dikendelivery.com as a more professional static site with identical information, in English and Arabic, plus Terms of Use and Privacy Policy pages.

**Architecture:** Page content lives as HTML fragments in `src/pages/{en,ar}/*.html`, each starting with a JSON meta comment. `tools/build.mjs` wraps every fragment in the shared shell (head, nav, footer) and writes the final pages to the repo root and `ar/`, which GitHub Pages serves as-is. `tools/check.mjs` validates the output.

**Tech Stack:** Plain HTML/CSS/JS, Node 18+ for the two tools (no npm dependencies), Alexandria via Google Fonts, Phosphor icons via jsDelivr.

**Source of truth for copy:** the live site text extracted to the session scratchpad (`diken/*.html`, `diken/ar/*.html`). Copy is carried over verbatim except the draft notes listed in `OPEN-ITEMS.md`.

---

### Task 1: Repository skeleton and tooling

**Files:**
- Create: `package.json` (scripts only: `build`, `check`)
- Create: `tools/build.mjs`
- Create: `tools/check.mjs`
- Create: `README.md`, `OPEN-ITEMS.md`, `robots.txt`, `404.html`

- [ ] Step 1: `package.json` with `"type": "module"`, scripts `build: node tools/build.mjs`, `check: node tools/check.mjs`.
- [ ] Step 2: `tools/build.mjs`: for each `src/pages/<lang>/<name>.html`, parse the leading `<!-- meta {...} -->` JSON (`title`, `description`, `nav`, `ogImage` optional), build `<head>` (charset, viewport, title, description, canonical, hreflang pair, OG, theme-color, favicon, fonts, icons, css), nav (lang-aware links, `aria-current` on `nav`), the fragment, footer (lang-aware, legal links), `js/site.js`. Write to `<name>.html` or `ar/<name>.html`. Also emit `sitemap.xml` listing every page with `xhtml:link` alternates.
- [ ] Step 3: `tools/check.mjs`: walk output HTML; assert every relative `href`/`src` resolves to a file; assert each EN page has an AR twin and that `hreflang` links point at each other; assert none of the banned draft strings appear (`Draft one`, `to confirm`, `To add`, `withheld`, `قيد التأكيد`, `قيد الإضافة`, `المسودة`). Exit 1 with a list on failure.
- [ ] Step 4: Run `node tools/build.mjs` on an empty `src/pages` and confirm it exits 0 with "0 pages".
- [ ] Step 5: Commit `chore: scaffold diken-website tooling`.

### Task 2: Stylesheet

**Files:**
- Create: `css/site.css`

- [ ] Step 1: Tokens: `--ink #0B0B0C`, `--ink-2 #121214`, `--ink-3 #1A1A1D`, `--fg #F5F5F3`, `--fg-2 rgba(245,245,243,.72)`, `--fg-3 rgba(245,245,243,.5)`, `--line rgba(255,255,255,.1)`, `--line-2 rgba(255,255,255,.22)`, `--red #ED1C26`, `--red-2 #FF3B44`, `--red-deep #9E0F16`, `--radius 6px`, `--wrap 1280px`, `--gutter clamp(20px,5vw,72px)`, `--font Alexandria`.
- [ ] Step 2: Base: reset, body, headings with `clamp()` sizes and `letter-spacing:-.02em`, `.eyebrow` (uppercase, tracked, red dot), `.lead`, `.num` (tabular), `.wrap`, `.grid` (12 col), selection, focus-visible, skip link.
- [ ] Step 3: Components: `.nav` (sticky, blur, `aria-current` underline), `.drawer` (mobile), `.btn` (primary/ghost/light), `.hero` (full-bleed image + gradient + copy), `.kpis` (band with hairlines, count-up numbers), `.doors` (division cards with photo, hover lift), `.timeline` (vertical rule with red markers), `.cards` (2/3/4 col hairline cards), `.firsts`, `.flow` (agent list + diagram), `.logos` (grey logos, hover colour), `.cta-band` (red), `.steps` (numbered), `.page-head` (subpage hero), `.legal` (prose layout with sticky ToC), `form.contact`, `footer`.
- [ ] Step 4: Motion: `.reveal` under `prefers-reduced-motion: no-preference` only; hero copy staggered rise.
- [ ] Step 5: RTL: use logical properties throughout; `[dir=rtl]` overrides only for arrow icons (`scaleX(-1)`), `.num` isolation (`direction:ltr; unicode-bidi:isolate`), heading line-height 1.3, letter-spacing 0.
- [ ] Step 6: Responsive: breakpoints 1024 / 768 / 520; drawer nav under 1024.
- [ ] Step 7: Commit `feat: site stylesheet`.

### Task 3: Behaviour script

**Files:**
- Create: `js/site.js`

- [ ] Step 1: Add `.js` class; nav toggle with `aria-expanded`, body scroll lock, Escape closes.
- [ ] Step 2: IntersectionObserver reveals (fallback: add `.in` immediately).
- [ ] Step 3: Count-up for `[data-count]` numbers (prefix/suffix preserved, respects reduced motion, runs once when visible).
- [ ] Step 4: Contact form: validate required + email; on success build `mailto:info@dikenbros.com?subject=...&body=...` from the fields and `location.href` it; show status text; never submit to the server.
- [ ] Step 5: Footer year from `Date`.
- [ ] Step 6: Commit `feat: site behaviour`.

### Task 4: English pages

**Files:**
- Create: `src/pages/en/index.html, delivery.html, distribution.html, motorcycles.html, investments.html, impact.html, technology.html, about.html, contact.html`

- [ ] Step 1: For each page, transcribe the live copy verbatim into the new components (section order preserved), dropping only the draft notes and recording each one in `OPEN-ITEMS.md`.
- [ ] Step 2: Home uses `hero-lineup-2400.jpg`; delivery `fleet-wide.jpg`; distribution `motul-billboard-wide.jpg`; motorcycles `showroom-wide.jpg`; investments `swap-scooter.jpg`; impact `fleet-lower.jpg`; technology `branch-wide.jpg`; about `first-scooters.jpg`; contact `branch-tall.jpg`.
- [ ] Step 3: Build, run check, open in browser, fix.
- [ ] Step 4: Commit `feat: english pages`.

### Task 5: Arabic pages

**Files:**
- Create: `src/pages/ar/*.html` (same nine names)

- [ ] Step 1: Transcribe the live Arabic copy verbatim (same rules as Task 4). Keep the English tagline line in the hero as on the live site.
- [ ] Step 2: Build, check, open `ar/index.html`, verify RTL layout and number isolation.
- [ ] Step 3: Commit `feat: arabic pages`.

### Task 6: Legal pages

**Files:**
- Create: `src/pages/en/terms.html`, `src/pages/en/privacy.html`, `src/pages/ar/terms.html`, `src/pages/ar/privacy.html`

- [ ] Step 1: Write Terms of Use (13 sections listed in the spec) in English, then Arabic.
- [ ] Step 2: Write Privacy Policy (13 sections listed in the spec) in English, then Arabic.
- [ ] Step 3: Use the `.legal` layout: eyebrow, H1, "Last updated: 22 September 2026", sticky table of contents, numbered H2s.
- [ ] Step 4: Link both pages from the footer (all pages) and add a consent line under the contact form submit button linking to the privacy policy.
- [ ] Step 5: Build, check, commit `feat: terms of use and privacy policy`.

### Task 7: Verification

- [ ] Step 1: `node tools/check.mjs` exits 0.
- [ ] Step 2: Serve the folder (static server from `.claude/launch.json`) and screenshot every page at desktop and mobile, EN and AR; read console for errors.
- [ ] Step 3: Test the contact form: empty submit shows errors; valid submit opens `mailto:`.
- [ ] Step 4: Test mobile drawer open/close and Escape.
- [ ] Step 5: Commit `docs: verification notes` (update README with deploy steps for GitHub Pages).
