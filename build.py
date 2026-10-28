#!/usr/bin/env python3
"""Static site generator for Wellness by Physiatry.

Run: python build.py  (or python3 build.py)

Reads src/pages/**.html (front-matter + body), wraps them in src/partials/,
resolves {{ placeholders }} from site.json + front-matter, and writes plain
static HTML to docs/. All internal links and asset paths are written relative
to each page's depth so the site works at a GitHub Pages sub-path, the
production root domain. Links to the home page use the directory ("./" or
"../") so they match its canonical URL; opening docs/ via file:// therefore lists
a folder for those links, so preview with a local server.
"""

import hashlib
import json
import re
import datetime
import shutil
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).parent
sys.path.insert(0, str(ROOT / "tools"))
from html2md import main_to_markdown  # noqa: E402
from minify import minify_css, minify_js  # noqa: E402
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


def link(root, href):
    """Relative link to a page. The home page links to the directory ("./" or
    "../"), not index.html, so internal links point at the canonical URL."""
    if href == "index.html":
        return root or "./"
    return f"{root}{href}"


def nav_html(root, current):
    items = []
    for item in site["nav"]:
        active = ' aria-current="page"' if item["href"] == current else ""
        if "children" in item:
            links = "".join(
                f'<li><a href="{link(root, c["href"])}" data-track="nav_click">{c["label"]}</a></li>'
                for c in item["children"]
            )
            items.append(
                f'<li class="nav-item has-dropdown">'
                f'<a href="{link(root, item["href"])}" data-track="nav_click"{active}>{item["label"]}</a>'
                f'<button class="nav-caret" aria-expanded="false" aria-label="Open {item["label"]} menu">'
                f'<svg width="10" height="6" viewBox="0 0 10 6" fill="none" aria-hidden="true"><path d="M1 1l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>'
                f'</button>'
                f'<ul class="nav-dropdown">{links}</ul></li>'
            )
        else:
            items.append(
                f'<li class="nav-item"><a href="{link(root, item["href"])}" data-track="nav_click"{active}>{item["label"]}</a></li>'
            )
    return "".join(items)


# Fonts used above the fold, preloaded so they download alongside site.css
# instead of after it. The home hero uses Newsreader 400 + italic; inner page
# heroes use Newsreader 500. Manrope 400/600/700 covers body, nav and buttons.
FONTS_COMMON = ["manrope-latin-400", "manrope-latin-600", "manrope-latin-700"]
FONTS_HOME = ["newsreader-latin-400", "newsreader-latin-400-italic"]
FONTS_INNER = ["newsreader-latin-500"]


def font_preloads(root, is_home):
    names = (FONTS_HOME if is_home else FONTS_INNER) + FONTS_COMMON
    return "\n".join(
        f'<link rel="preload" href="{root}fonts/{n}.woff2" as="font" type="font/woff2" crossorigin>'
        for n in names
    )


def page_modified(path):
    """ISO date a page's source last changed: today if it has uncommitted
    edits, else its last commit date, else its file mtime."""
    rel = str(path.relative_to(ROOT))
    try:
        dirty = subprocess.run(["git", "status", "--porcelain", "--", rel], cwd=ROOT,
                               capture_output=True, text=True, check=True).stdout.strip()
        if dirty:
            return datetime.date.today().isoformat()
        day = subprocess.run(["git", "log", "-1", "--format=%cs", "--", rel], cwd=ROOT,
                             capture_output=True, text=True, check=True).stdout.strip()
        if day:
            return day
    except (OSError, subprocess.CalledProcessError):
        pass
    return datetime.date.fromtimestamp(path.stat().st_mtime).isoformat()


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
        "home": root or "./",
        "canonical": canonical,
        "nav_items": nav_html(root, page_url if "/" not in page_url else ""),
        "og_image": meta.get("og_image", "images/global/og-default.png"),
        "body_class": meta.get("body_class", ""),
        "font_preloads": font_preloads(root, page_url == "index.html"),
        "md_href": out_path.stem + ".md",
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

    css_bundle = minify_css("\n".join((ROOT / p).read_text(encoding="utf-8") for p in CSS_BUNDLE))
    js_min = {
        name: minify_js((ROOT / "js" / f"{name}.js").read_text(encoding="utf-8"))
        for name in ("scripts", "animations")
    }
    ASSET_VERSIONS["css"] = asset_version(css_bundle.encode("utf-8"))
    ASSET_VERSIONS["scripts"] = asset_version(js_min["scripts"].encode("utf-8"))
    ASSET_VERSIONS["animations"] = asset_version(js_min["animations"].encode("utf-8"))

    pages = sorted((SRC / "pages").rglob("*.html"))
    for page in pages:
        meta, body = parse_page(page)
        out_path = OUT / page.relative_to(SRC / "pages")
        out_path.parent.mkdir(parents=True, exist_ok=True)
        ctx = build_context(meta, out_path)
        ctx["date_modified"] = page_modified(page)

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
        html = render(doc, ctx)
        out_path.write_text(html, encoding="utf-8")
        md = main_to_markdown(html, ctx["canonical"]) + f"\nSource: {ctx['canonical']}\n"
        out_path.with_suffix(".md").write_text(md, encoding="utf-8")
        print(f"  built {out_path.relative_to(ROOT)}")

    (OUT / "css").mkdir(exist_ok=True)
    (OUT / "css" / "site.css").write_text(css_bundle, encoding="utf-8")
    print(f"  bundled {len(CSS_BUNDLE)} css files -> css/site.css")

    for name in STATIC_DIRS:
        src_dir = ROOT / name
        if src_dir.exists():
            shutil.copytree(src_dir, OUT / name, ignore=EXCLUDE)
            print(f"  copied {name}/")

    for name, code in js_min.items():
        (OUT / "js" / f"{name}.js").write_text(code, encoding="utf-8")
    print(f"  minified js/ ({', '.join(js_min)})")

    for extra in ["sitemap.xml", "robots.txt", "llms.txt", "_headers", ".htaccess", "CNAME"]:
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
