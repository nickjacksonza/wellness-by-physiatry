#!/usr/bin/env python3
"""Generate smaller width variants of the site's images for srcset.

Run from the repo root: python tools/make_responsive_images.py

For each base name below it writes <base>-<width>w.avif (and .jpg for
photos) next to the original. The original stays in place and is used as
the largest candidate, so these files only add smaller options. Widths at
or above the original's width are skipped.

Photos are resized from their .jpg original (higher fidelity than the
existing .avif). Leaf icons have no .jpg, so they are resized from .avif.
"""

from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent

# base path (no extension) -> widths in px to generate
PHOTOS = {
    "images/about/hero-canopy": [320, 480, 640],
    "images/about/support-consult": [320, 480],
    "images/about/family-kitchen": [320, 480],
    "images/team/dr-f-kopp-portrait": [320, 480],
    "images/team/dr-f-kopp-card": [320],
    "images/referrals/hero-village": [320, 480, 640],
    "images/contact/hero-train": [320, 480, 640],
    "images/faq/hero-leaves": [320, 480, 640],
    "images/patient-resources/hero-leaf": [320, 480, 640],
    "images/patient-resources/support-couch": [320, 480],
    "images/mission/community-smile": [320, 480],
    "images/services/care-planning": [320, 480],
    "images/services/support-embrace": [320, 480],
    "images/home/hero-poster": [320, 480, 640],
    "images/home/card-physiatry": [320, 480],
    "images/home/card-lifestyle": [320, 480],
    "images/home/card-concussion": [320, 480],
    "images/home/card-brain-stroke": [320, 480],
}

# Leaf icons are 1024px AVIFs shown at 28–84px in most places and up to
# 600px in the service page heroes.
LEAVES = {
    f"images/global/conditions/leaf-{name}": [64, 128, 256, 512]
    for name in ["tbi", "stroke", "neurobehavioral", "concussion", "cognitive"]
}

AVIF_QUALITY = 60
JPEG_QUALITY = 82


def save_variant(src: Image.Image, width: int, out: Path, quality: int, jpeg: bool) -> None:
    height = round(src.height * width / src.width)
    img = src.resize((width, height), Image.Resampling.LANCZOS)
    if jpeg:
        img.convert("RGB").save(out, "JPEG", quality=quality, optimize=True, progressive=True)
    else:
        img.save(out, "AVIF", quality=quality)


def make(base: str, widths: list[int], photo: bool) -> None:
    avif_src = ROOT / f"{base}.avif"
    jpg_src = ROOT / f"{base}.jpg"
    source = jpg_src if photo else avif_src
    with Image.open(source) as src:
        src.load()
        for width in widths:
            if width >= src.width:
                continue
            if photo:
                save_variant(src, width, ROOT / f"{base}-{width}w.jpg", JPEG_QUALITY, jpeg=True)
            save_variant(src, width, ROOT / f"{base}-{width}w.avif", AVIF_QUALITY, jpeg=False)
            print(f"  wrote {base}-{width}w (.avif{' + .jpg' if photo else ''})")


def main() -> None:
    for base, widths in PHOTOS.items():
        make(base, widths, photo=True)
    for base, widths in LEAVES.items():
        make(base, widths, photo=False)


if __name__ == "__main__":
    main()
