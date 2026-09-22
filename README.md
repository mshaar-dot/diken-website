# Diken Bros — corporate website

Static, bilingual (English + Arabic) site for Diken Bros. No framework, no npm dependencies.
Deploys as-is to GitHub Pages or any static host.

## Layout

```
index.html, delivery.html, … , terms.html, privacy.html   built English pages (do not edit by hand)
ar/                                                        built Arabic pages (do not edit by hand)
src/pages/en/*.html, src/pages/ar/*.html                   page content — edit these
tools/build.mjs                                            wraps every fragment in the shared head/nav/footer
tools/check.mjs                                            link, image, hreflang, title and draft-note checks
css/site.css, js/site.js, assets/                          styles, behaviour, photos and logos
sitemap.xml, robots.txt, 404.html, .nojekyll               hosting files
OPEN-ITEMS.md                                              facts still to confirm before/after launch
```

Each fragment starts with a JSON meta comment:

```html
<!-- meta {"title": "Delivery & Logistics | Diken Bros", "description": "…", "nav": "delivery"} -->
```

Inside a fragment, `{{base}}` becomes `` (English) or `../` (Arabic) so asset paths work from both
folders, and `{{updated}}` becomes the site's "last updated" date set in `tools/build.mjs`.

## Working on the site

```bash
node tools/build.mjs     # regenerate the pages and sitemap.xml
node tools/check.mjs     # must print OK before you commit
python -m http.server 8790   # then open http://localhost:8790/
```

Shared text (navigation labels, footer, legal link labels) lives in the `T` and `NAV` tables
at the top of `tools/build.mjs`. The site URL used for canonical links and the sitemap is the
`SITE` constant in the same file.

## Deploying to GitHub Pages

1. Create an empty public repository on GitHub and push this folder to its `main` branch.
2. In the repository, open **Settings → Pages**, set *Source* to **Deploy from a branch**,
   pick `main` and `/ (root)`, and save.
3. The site is live at `https://<user>.github.io/<repo>/` within a minute.
4. To serve it on `dikendelivery.com` instead, add a `CNAME` file containing `dikendelivery.com`
   and point the domain's DNS at GitHub Pages (the existing site already does this, so moving
   the `CNAME` file over switches the domain to this repository).

## Contact form

The form does not post to a server. After validation it opens the visitor's mail client with
a prefilled message to `info@dikenbros.com`. To use a form service later, change the `submit`
handler in `js/site.js`.
