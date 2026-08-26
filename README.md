# Wellness by Physiatry — Static Site Rebuild

Static HTML/CSS/JS rebuild of wellnessbyphysiatry.com — see [`PLAN.md`](./PLAN.md) for the full build spec (architecture, page list, design tokens, copy rules, asset sources, and build order).

Wellness by Physiatry Design Planning Reference Files.zip contains only a reference Home page html and css as a reference. Ignore the WBP-STATIC-SITE-PLAN.md in there, the PLAN.md in this github root trumps it. 

**Status:** Phases 1-6 of 8 complete. All 15 pages are built and live in `docs/`, plus `privacy.html`, `accessibility.html`, and `404.html`. The appointment form is wired to Formspree, and `sitemap.xml`/`robots.txt`/`llms.txt` are generated into `docs/`. Phase 7 (push to GitHub, ship to review) is next — see `PLAN.md` §14 for the full build order. Named referral partners on `referrals.html` stay blocked until Dr. Kopp confirms the list (`PLAN.md` §2).

Every page passes an automated compliance check (no em dashes, no scope-of-practice violations, one `<h1>`, valid JSON-LD) and a link-checker (zero unresolved internal targets), and scores 100 accessibility / 100 best practices / 100 SEO on mobile Lighthouse.

## Build

```
python build.py
```

Generates static HTML from `src/pages/` + `src/partials/` into `docs/`, using `src/data/site.json` as the single source of truth for NAP, hours, nav, and form config. Bundles `css/tokens.css` + `css/styles.css` into one `docs/css/site.css`. No other build step, no npm.

To preview: `python -m http.server 3055` from inside `docs/`.

To pick this up in a new Claude session (cloud or local Claude Code), point it at this repo and `PLAN.md` — it's written to be a self-contained spec that needs no other context.
