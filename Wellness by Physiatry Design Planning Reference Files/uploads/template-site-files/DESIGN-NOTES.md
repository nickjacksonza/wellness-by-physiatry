# Koppie Roasters — example site

A fictional Kensington coffee roastery, built on the static site template to demonstrate three psychology principles. Every implementation is marked with an inline `<!-- PRINCIPLE n -->` comment in the HTML, so the source doubles as the reference.

**Pages:** `index.html`, `subscriptions.html`, `about.html`, `contact.html`, `privacy.html`, `404.html`

---

## Principle 1 — Mental models (the visitor arrives with a blueprint)

The layout has to sit where a lifetime of other websites has taught people it sits. This is the part where being creative costs you.

| Where | What was done |
|---|---|
| Header | Logo top-left and it links home. Primary nav top-right. Hamburger top-right on mobile, **not** repositioned into the thumb zone (the GamingBible mistake) |
| Hero | Headline says what this is and where, one supporting line, one primary button, one secondary. No splash, no scroll-jacking |
| Nav labels | "Home", "About", "Visit us" — plain words, not "Our Journey" or "Say Hello" |
| Footer | Address left, links middle, hours right, legal on its own line beneath |
| 404 | Two obvious ways back. No puzzle illustration |
| Forms | Label above field, submit button bottom-left of the form |

The whole structural skeleton is inherited unchanged from the template. That is the point: the safety layer is the part you reuse, not the part you reinvent per client.

## Principle 2 — MAYA (predictable frame, small pleasant surprises inside it)

Nothing here moves anything the visitor is trying to read or click. Every effect is on hover or on entry, and every one is disabled under `prefers-reduced-motion`.

| Effect | Where | Why it works |
|---|---|---|
| Arrow nudges forward on hover | All primary CTAs | Buttons don't normally do this. Registers as considered, not weird |
| Card lifts + its photo scales 1.05 | Coffee cards, team cards | Two things respond to one hover, which reads as more "built" than it costs |
| Nav underline grows from the centre out | Header links | Underlines usually just appear. Growing outward is the small break |
| Photos settle from 1.07 → 1.0 on entry | Hero, about photo | ~1 second, easy to miss. Deliberately below the threshold of "what was that" |
| Step number rotates ‑6° and fills | "Three steps" section | Rewards hovering something that isn't obviously interactive |

Dose matters. Each one is 2–5px of movement or ~1.05× of scale. Doubling any of them tips it from "expensive" to "alarming", which puts friend number one back in charge.

## Principle 3 — Chunking (working memory holds three or four things)

| Where | Instead of | We did |
|---|---|---|
| **Subscription tiers** | Repeating all 9 features in all 3 columns | Each tier states "Everything in Solo, plus:" then lists only its **3 new** items. Nobody has to diff by eye |
| **Comparison table** | One flat 9-row grid | Three category groups (The coffee / Delivery / Extras) of 2–3 rows each |
| Main nav | 7–8 destinations | 4 plus one CTA |
| Trust bar | 6 badges | 3 numbers |
| Homepage sections | Whatever fits | Exactly 3 steps, 3 coffees, 3 FAQs |
| Values | A mission statement | "Three things we will not budge on" |
| Phone number | `+27115551820` | `011 555 1820`, chunked in mono |
| Contact form | Name, email, phone, company, subject, budget, message | Name, email, message |

The tier pattern on `subscriptions.html` is the clearest single demonstration — worth looking at that file first.

---

## Also kept from the template

Consent Mode v2 with default-deny, GTM, gated Clarity, light/dark toggle with no flash, GA4 events (nav, CTA, outbound, scroll depth, section views, FAQ opens, form start/submit, theme toggle), `CafeOrCoffeeShop` + `BreadcrumbList` JSON-LD, sitemap, robots, `llms.txt`, `security.txt`, single H1 per page with no skipped heading levels.

## To run it

Static files, no build step. Open `index.html`, or serve the folder:

```
python3 -m http.server 8000
```

Placeholders still to swap for a real build: `GTM-XXXXXXX`, the Clarity ID in `js/scripts.js`, the Formspree form ID on the contact page, and the favicon set.
