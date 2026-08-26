#!/usr/bin/env python3
"""Static site generator for Wellness by Physiatry.

Run: python build.py  (or python3 build.py)

Reads src/pages/**.html (front-matter + body), wraps them in src/partials/,
resolves {{ placeholders }} from site.json + front-matter, and writes plain
static HTML to docs/. All internal links and asset paths are written relative
to each page's depth so the site works at a GitHub Pages sub-path, the
production root domain, and from file://.
"""

import hashlib
import json
import re
import shutil
from pathlib import Path

ROOT = Path(__file__).parent
SRC = ROOT / "src"
OUT = ROOT / "docs"
STATIC_DIRS = ["js", "images", "fonts"]
# tokens.css then styles.css, concatenated into one render-blocking request.
CSS_BUNDLE = ["css/tokens.css", "css/styles.css"]
# images/stock holds the full-size originals we crop derivatives from. They are
# working files, not shipped assets.
EXCLUDE = shutil.ignore_patterns("stock")

site = json.loads((SRC / "data" / "site.json").read_text(encoding="utf-8"))

# Populated in build() before any page renders, from the actual bundled/source
# asset bytes. Used as {{ css_v }} / {{ scripts_v }} / {{ animations_v }} so a
# content change always busts the Cloudflare/browser cache without anyone
# having to remember to bump a version number by hand.
ASSET_VERSIONS = {}


def asset_version(data):
    return hashlib.sha256(data).hexdigest()[:8]


def parse_page(path):
    text = path.read_text(encoding="utf-8")
    meta = {}
    if text.startswith("---"):
        _, fm, body = text.split("---", 2)
        for line in fm.strip().splitlines():
            key, _, value = line.partition(":")
            value = value.strip()
            if len(value) >= 2 and value[0] == value[-1] and value[0] in "\"'":
                value = value[1:-1]
            meta[key.strip()] = value
    else:
        body = text
    return meta, body.lstrip("\n")


def rel_prefix(out_path):
    depth = len(out_path.relative_to(OUT).parts) - 1
    return "../" * depth


def nav_html(root, current):
    items = []
    for item in site["nav"]:
        active = ' aria-current="page"' if item["href"] == current else ""
        if "children" in item:
            links = "".join(
                f'<li><a href="{root}{c["href"]}" data-track="nav_click">{c["label"]}</a></li>'
                for c in item["children"]
            )
            items.append(
                f'<li class="nav-item has-dropdown">'
                f'<a href="{root}{item["href"]}" data-track="nav_click"{active}>{item["label"]}</a>'
                f'<button class="nav-caret" aria-expanded="false" aria-label="Open {item["label"]} menu">'
                f'<svg width="10" height="6" viewBox="0 0 10 6" fill="none" aria-hidden="true"><path d="M1 1l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>'
                f'</button>'
                f'<ul class="nav-dropdown">{links}</ul></li>'
            )
        else:
            items.append(
                f'<li class="nav-item"><a href="{root}{item["href"]}" data-track="nav_click"{active}>{item["label"]}</a></li>'
            )
    return "".join(items)


def build_context(meta, out_path):
    root = rel_prefix(out_path)
    page_url = out_path.relative_to(OUT).as_posix()
    canonical = site["domain"] + "/" + ("" if page_url == "index.html" else page_url)
    ctx = dict(site)
    ctx.update(meta)
    for i, loc in enumerate(site["locations"]):
        for key, value in loc.items():
            if isinstance(value, (str, int)):
                ctx[f"loc{i}_{key}"] = value
    ctx.update({
        "root": root,
        "canonical": canonical,
        "nav_items": nav_html(root, page_url if "/" not in page_url else ""),
        "og_image": meta.get("og_image", "images/global/og-default.png"),
        "body_class": meta.get("body_class", ""),
        "css_v": ASSET_VERSIONS["css"],
        "scripts_v": ASSET_VERSIONS["scripts"],
        "animations_v": ASSET_VERSIONS["animations"],
    })
    return ctx


def render(template, ctx):
    def sub(match):
        key = match.group(1).strip()
        return str(ctx.get(key, match.group(0)))
    # resolve twice so placeholders inside partial-provided values also resolve
    out = re.sub(r"\{\{\s*([\w.-]+)\s*\}\}", sub, template)
    return re.sub(r"\{\{\s*([\w.-]+)\s*\}\}", sub, out)


def build():
    if OUT.exists():
        for child in OUT.iterdir():
            if child.name == ".nojekyll":
                continue
            shutil.rmtree(child) if child.is_dir() else child.unlink()
    OUT.mkdir(exist_ok=True)
    (OUT / ".nojekyll").write_text("")

    partials = {
        p.stem: (SRC / "partials" / p.name).read_text(encoding="utf-8")
        for p in (SRC / "partials").glob("*.html")
    }

    css_bundle = "\n".join((ROOT / p).read_text(encoding="utf-8") for p in CSS_BUNDLE)
    ASSET_VERSIONS["css"] = asset_version(css_bundle.encode("utf-8"))
    ASSET_VERSIONS["scripts"] = asset_version((ROOT / "js" / "scripts.js").read_bytes())
    ASSET_VERSIONS["animations"] = asset_version((ROOT / "js" / "animations.js").read_bytes())

    pages = sorted((SRC / "pages").rglob("*.html"))
    for page in pages:
        meta, body = parse_page(page)
        out_path = OUT / page.relative_to(SRC / "pages")
        out_path.parent.mkdir(parents=True, exist_ok=True)
        ctx = build_context(meta, out_path)

        doc = (
            "<!doctype html>\n<html lang=\"en\">\n"
            + partials["head"]
            + "<body class=\"{{ body_class }}\">\n"
            + partials["header"]
            + "<main id=\"main\">\n" + body + "</main>\n"
            + (partials["cta-band"] if meta.get("cta_band", "true") != "false" else "")
            + partials["footer"]
            + "</body>\n</html>\n"
        )
        out_path.write_text(render(doc, ctx), encoding="utf-8")
        print(f"  built {out_path.relative_to(ROOT)}")

    (OUT / "css").mkdir(exist_ok=True)
    (OUT / "css" / "site.css").write_text(css_bundle, encoding="utf-8")
    print(f"  bundled {len(CSS_BUNDLE)} css files -> css/site.css")

    for name in STATIC_DIRS:
        src_dir = ROOT / name
        if src_dir.exists():
            shutil.copytree(src_dir, OUT / name, ignore=EXCLUDE)
            print(f"  copied {name}/")

    for extra in ["sitemap.xml", "robots.txt", "llms.txt", "_headers", ".htaccess"]:
        src_file = SRC / "static" / extra
        if src_file.exists():
            shutil.copy(src_file, OUT / extra)
    well_known = SRC / "static" / "security.txt"
    if well_known.exists():
        (OUT / ".well-known").mkdir(exist_ok=True)
        shutil.copy(well_known, OUT / ".well-known" / "security.txt")

    print(f"Done: {len(pages)} pages -> docs/")


if __name__ == "__main__":
    build()
