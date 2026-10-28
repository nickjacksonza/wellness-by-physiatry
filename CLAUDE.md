# Wellness by Physiatry

Static marketing site. Custom Python generator, no npm. `PLAN.md` is the full spec.

## Build

    python build.py                        # renders src/ -> docs/
    cd docs && python -m http.server 3055  # preview

`build.py` minifies the CSS bundle and `js/*.js` into `docs/` (`tools/minify.py`, stdlib only). Edit
the readable sources in `css/` and `js/`, never the output.

It also writes a Markdown copy of every page next to its HTML (`tools/html2md.py`, e.g. `about.md`) and
stamps each page with a `dateModified` in JSON-LD, taken from the page source's last git commit (today
if it has uncommitted edits).

## Rules

- `docs/` is generated **and** git-tracked. Rebuild and commit it alongside every `src/`,
  `css/`, or `js/` change. Editing `docs/` by hand does nothing — the next build overwrites it.
- `src/data/site.json` is the single source of truth for anything on more than one page
  (addresses, hours, phone/fax, portal URL, nav, Formspree ID). `{{ placeholders }}` resolve
  from it plus page front-matter.
- Copy is reviewed against `PLAN.md` §12: no em dashes (en dash `–` is fine for ranges); the
  clinic refers therapy out, never "in-house"; the two locations are "East Loop" and
  "Lincoln Park" only.
- Each page carries a JSON-LD block that often mirrors visible copy — change both together.
