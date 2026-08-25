# Wellness by Physiatry — Static Site Build Plan

**Version:** 2.0 — the build spec. Supersedes v1.1; all prior open questions are now either resolved or reduced to the five sign-off items in §2.
**Owner:** Dr. Fabiolla Kopp / Wellness by Physiatry
**Canonical domain:** `wellnessbyphysiatry.com`
**Review build:** GitHub repo → GitHub Pages, for the Friday review.
**Replaces:** the Framer site (`receptive-look-689612.framer.app`) and the Elementor build (`projects.slash301.com/Clients/WellnessPhys/`).

## 0. What this document is

A complete build spec. Everything needed to build the site is decided here — a developer (or Claude Code) should be able to work start to finish without stopping to ask a question.

The goal is a finished site, not a draft: something Dr. Kopp opens and recognises as the site she should have had from the beginning. Light, fast, accessible, and quietly beautiful, on a codebase that stays easy to change.

**Three sources, in order of authority:**

| Source | Role |
|---|---|
| `V2 Working Copy Doc for Wellness by Physiatry` | **The foundation.** Written with SEO and content depth in mind — page structure, H1/H2/H3s, and body copy. Every page starts here. |
| The Elementor dev site | **Layout reference only — call it v1.5.** Useful for section rhythm, the copy that got refined past the doc, and its asset library. Not a design target; the new site should be visibly better. |
| The bound Claude Design system | **The visual authority.** `Home.dc.html` is the finished pattern. Where dev site and design system disagree, the design system wins. |

Client corrections from Dr. Kopp's emails and review docs override all three on matters of fact and scope of practice — see §12, which is non-negotiable.

**`Home.dc.html` is an editable Claude Design canvas component** (JSX, with props like `showFaq`/`showLocations`/`photoTreatment`), not literal markup to lift. Building the Phase 3 reference page means porting its structure and copy into the static partials, not copying its HTML source directly.

---

## 1. Decisions locked

| Decision | Choice |
|---|---|
| Output | Static HTML/CSS/JS. No framework, no runtime dependencies, no npm at serve time. |
| Authoring | Partials + a small Python generator (§3). Edit one header, rebuild, every page updates. |
| Launch set | 15 pages (§4) |
| Visual system | Wellness by Physiatry design system — sage/forest, Newsreader + Manrope, arch-crop photography |
| Primary CTA | **Request an appointment** form, sitewide |
| Form handling | Formspree, endpoint held in one config field |
| Existing patients | Praxis EMR portal — `https://portal-app.praxisemr.com/login` |
| Analytics | GTM + Consent Mode v2 default-deny, GA4 events |
| SEO | Critical — the main lead source. Full schema + local SEO layer. |
| Language | English only in v1; multilingual care stated prominently in copy |
| Imagery | Dev-site library (§13) + design-system stock, arranged per Dr. Kopp's direction: foliage headers, people in sub-sections |
| Hosting (review) | GitHub Pages from `/docs` on `main` |
| Hosting (production) | Cloudflare Pages or Netlify on the real domain, same repo |
| Dropped | Light/dark toggle, Microsoft Clarity, in-page booking widgets |

---

## 2. Sign-off list

Not blockers. The site builds and ships complete without any of these resolved; each is a one-field change afterwards. Bring this list to the review.

| # | Item | Default used in the build | Impact of the real value |
|---|---|---|---|
| 1 | **Formspree form ID** | Placeholder ID in `site.json`; form renders, validates, and shows its success state. Free tier caps at 50 submissions/month — check that against expected volume. | One field |
| 2 | **Contact email** | ~~`info@wellnessbyphysiatry.com`~~ — **resolved.** The dev site's WP REST API (not the cloaked front-end) exposes `fabiollakoppMD@wellnessbyphysiatry.com`; it also matches the copy doc. Used in the build. | Done |
| 3 | **OpenPM billing URL** | "Pay a bill" routes to phone. Dr. Kopp's links arrived corrupted — the `groupId` parameter lost characters in transit. | One link |
| 4 | **Veronica's headshot + location photos** | Team cards degrade to a monogram tile in brand colours, not a broken frame (white tile — sage-on-sage is invisible on a band, learned the hard way in Phase 4); locations use the licensed stock. Veronica's photo is likely attached to the 14 May "colors and veronica's pic" email. Her role title also conflicts: dev site says "Experience Coordinator", copy doc says "Clinic Coordinator" — used the latter, confirm at review. | Drop-in file |
| 5 | **Google Business Profile** | Schema is complete and correct; GBP must be claimed and matched to it or the local SEO work is wasted. | Off-site task |
| 6 | **T.D.'s age: 65 or 56** | §12 says 65; the dev site's FAQ page states 56 for the same quote. Used 65 (§12 is the override authority) but this reads as a genuine data error somewhere upstream — confirm with Dr. Kopp rather than assume. | One field |
| 7 | **Sixth pillar of Lifestyle Medicine** | ~~Every source lists exactly five...~~ — **resolved.** Verified against the American College of Lifestyle Medicine's published six pillars: nutrition, physical activity, restorative sleep, stress management, avoidance of risky substances, and **positive social connections**. WbP's sources already give five of these six verbatim, so the sixth is confirmed by the standard framework, not invented. Added in Phase 5. | Done |
| 8 | **Home stat card ("X+ Patients Helped")** | Not built. The dev site shows "500+ Patients Helped" with no source anywhere in PLAN.md, the copy doc, or Dr. Kopp's emails — not used, since publishing an unverified figure on a medical site is an accuracy risk, not a style choice. If Dr. Kopp confirms a real number (and how she wants it framed — total patients, years in practice, etc.), add it to Home's pillar band. | One field + one small component |

**Also worth raising at the review, none of it build-blocking:** the sage/forest palette (Dr. Kopp asked repeatedly for more vibrant greens — Leaf `#6BBF59`, Forest `#0F3D2E`, Bright Lime `#99FF33` — and dislikes teal and fluorescent green, so walk her through the final system rather than letting it surprise her); whether "patients" becomes "survivors" sitewide, which Ellie's doc flags as pending; the final public list of named referral partners; and a logo SVG, since only raster exists — though the 5KB PNG export is good enough to ship on.

---

## 3. Architecture

### The one real change from v1

v1 forbade a build step and accepted that a nav change meant editing 15 files. That is the wrong trade for a site somebody has to maintain for years. Instead: **author in partials, generate plain static HTML.**

The generator is ~150 lines of Python, standard library only. The output is ordinary HTML with no client-side templating, no hydration, and no dependency on the generator to serve. If the script is ever lost, the built site keeps working and can be hand-edited like any static site. This keeps the "light and simple" promise while making updates a single edit.

```
/
├── build.py                    the generator — run `python3 build.py`
├── src/
│   ├── data/
│   │   └── site.json           NAP, hours, phone, fax, portal, form ID, nav
│   ├── partials/
│   │   ├── head.html           meta, fonts, consent, GTM
│   │   ├── header.html         logo, nav, dropdowns, mobile drawer
│   │   ├── cta-band.html       sage field, reassurance, form + phone
│   │   └── footer.html         NAP, links, hours, legal
│   └── pages/                  one file per page — body content only
│       ├── index.html
│       ├── about.html
│       └── ...
├── docs/                       ← BUILT OUTPUT. GitHub Pages serves this.
│   ├── index.html
│   ├── css/  js/  images/
│   ├── sitemap.xml  robots.txt  llms.txt
│   └── .well-known/security.txt
├── css/
│   ├── tokens.css              ported from the design system, values unchanged
│   └── styles.css              layout + components, var(--*) only, no raw hex
├── js/
│   ├── scripts.js              nav, consent, GA4 events, form
│   └── animations.js           reveal on entry, reduced-motion guarded
├── images/
│   ├── global/                 logo, condition icons, favicon, OG image
│   ├── home/
│   ├── about/
│   ├── team/
│   └── … one folder per page
└── PLAN.md
```

**Since Phase 1:** `build.py` bundles `tokens.css` + `styles.css` into one `docs/css/site.css` at build time (one render-blocking request, matching §11's "one CSS file" rule) — the two source files stay separate, only the output is merged. `images/stock/` holds full-size crop sources and is excluded from `docs/` by the generator; never link to it from a page. Real-photo `.avif`+`.jpg` pairs at their shipped size live in `images/<page>/`.

**`site.json` is the single source of truth** for anything that appears in more than one place: phone, fax, email, both addresses, both sets of hours, transit and parking notes, portal URL, form ID, social links, nav structure. Changing the phone number is one edit, everywhere.

**Page files carry front-matter** — title, meta description, H1, schema type, OG image — then body HTML. The generator wraps them in the partials and writes to `docs/`.

**Paths are written relative to each page's depth**, which the generator knows. This matters: GitHub Pages serves project sites from `/<repo-name>/`, so root-relative paths like `/css/styles.css` break on the review URL and silently work on the production domain. Relative paths work in both, and from `file://` too.

### Deployment

**Review (Friday):** new GitHub repo, `docs/` committed alongside source. Settings → Pages → Source: `main` branch, `/docs` folder. No Actions, no CI, no secrets. Push and it is live at `https://<account>.github.io/<repo>/`. Commit the built output — for a site this size it costs nothing and means the review URL never depends on a build succeeding.

**Production:** point Cloudflare Pages or Netlify at the same repo with `docs/` as the publish directory, then move the domain. 301 every old Framer path to its new equivalent — 301, not 302.

---

## 4. Pages and content

15 pages. H1s come from the copy doc. Each page's body copy starts from the copy doc, gets checked against the dev site (which carries later refinements), then runs through the §12 rules.

| # | URL | Nav | H1 | Title tag |
|---|---|---|---|---|
| 1 | `/` | Home | Healing for Your Brain and Body with Respect, Care, and Hope | Brain Injury Rehabilitation & Physiatry in Chicago \| Wellness by Physiatry |
| 2 | `/about.html` | About Us | Dedicated to Your Recovery Journey and Long-Lasting Results | About Wellness by Physiatry \| Physician-Led Neurorehab, Chicago |
| 3 | `/team.html` | Meet the Team | Meet the Team Behind Your Recovery | Dr. Fabiolla Kopp, MD \| Physiatrist & Brain Injury Specialist, Chicago |
| 4 | `/mission.html` | Mission & Values | Our Chicago-Based Mission & Values | Mission & Values \| Culturally Competent, Multilingual Care |
| 5 | `/services.html` | Our Services | Specialized Treatment Rooted in Clarity and Compassion | Brain Injury & Lifestyle Medicine Services \| Chicago |
| 6 | `/services/brain-injury-rehabilitation.html` | Brain Trauma & Stroke | Regain Independence with Expert Brain Injury Medicine Rehabilitation | TBI & Stroke Rehabilitation Chicago \| Spasticity, Dysphagia, Memory |
| 7 | `/services/concussion-management.html` | Concussion Management | Specialized Care for Concussions and Persistent Symptoms | Concussion Specialist Chicago \| Post-Concussion Symptom Care |
| 8 | `/services/lifestyle-medicine.html` | Lifestyle Medicine | Whole-Person Healing Through Sustainable Healthy Habits | Lifestyle Medicine & Group Sessions \| Chicago Brain Injury Recovery |
| 9 | `/services/physiatry-pmr.html` | Physiatry & PM&R | Expert Physical Medicine and Rehabilitation Guided by Science | Physiatrist in Chicago \| Physical Medicine & Rehabilitation (PM&R) |
| 10 | `/patient-resources.html` | Patient Resources | Resources and Tools to Support Your Healing Journey | Patient Resources \| Wellness by Physiatry |
| 11 | `/faq.html` | FAQs | Answers to Common Questions About Your Recovery | FAQ \| Insurance, First Visit & Your Diagnosis |
| 12 | `/insurance-billing.html` | Insurance & Billing | Clear Answers About Insurance, Billing, and Membership | Insurance & Billing \| Medicare, Medicaid & Membership, Chicago |
| 13 | `/referrals.html` | Referrals | Connecting You to a Village of Trusted Care | Therapy Referrals & Community Support \| Chicago |
| 14 | `/contact.html` | Contact Us | Begin Your Health Journey Today | Contact & Locations \| Michigan Ave & Southport, Chicago |
| 15 | `/privacy.html`, `/accessibility.html`, `/404.html` | footer only | — | — |

**Page 12 is new in v2.** The IA doc's own audience analysis puts insurance and billing at the decision point for families — it is where they decide whether to call. Burying it in the FAQ costs conversions and a genuinely rankable page. Content exists: the insurance list, the membership structure, and the "no discounted self-pay under Medicare rules" constraint are all documented (§12).

### Content sources per page

| Page | Copy doc section | Notes |
|---|---|---|
| Home | "1 Home" | Confirmed section order from `Home.dc.html`: header → hero → 3-col "who we help / how we heal differently / a path to healing" band (sage-100) → 5 condition tags → service card grid → Dr. Kopp quote block → FAQ trio (accordion) → both location cards → CTA band → footer. The quote block's photo was a design-canvas placeholder ("awaiting headshot") — use the real headshot from §13 (`Dr-F-Kopp.avif`), not a placeholder. **Discrepancy to resolve deliberately, not inherit:** the canvas has four service cards (Brain Injury Rehab / Lifestyle Medicine / Group Sessions / Referrals), which don't line up 1:1 with the four service sub-pages this plan defines (Brain Trauma & Stroke / Concussion / Lifestyle Medicine / Physiatry & PM&R). Recommend Home's cards mirror the actual four service sub-pages for nav consistency — decide this explicitly in Phase 3, don't default to the canvas set. |
| About | "About Us" → Our Story | Dev site's version is stronger — six pillars of Lifestyle Medicine, the autonomy framing. ~350 words. |
| Team | Dr. Kopp bio + Veronica | Dev site has the refined bio: TIRR Memorial Hermann and Schwab Rehabilitation Hospital, "quarterback during your recovery" |
| Mission & Values | Our Mission / Our Vision | Use Ellie's Working Doc versions, the most recent and clearest. Ace's shorter alternatives are a sign-off option. |
| Services | "3 Our Services (Overview)" | Three pillars: brain injury medicine, lifestyle medicine, community support |
| Brain Trauma & Stroke | "3a" | Spasticity, dysphagia, memory and behavior |
| Concussion | "3b" | Add the two-week rule and no-bed-rest guidance (§12) |
| Lifestyle Medicine | "3c" | Group sessions: weekly for 6 weeks, then every 2 months |
| Physiatry & PM&R | "3d" + dev site | ~~Body copy not written~~ — **resolved**, the dev site page carries drafted copy. Rewrite its "supportive therapy sessions" language per §12. |
| Patient Resources | "4 Patient Resources" | Hub linking FAQ, Insurance, Referrals |
| FAQ | Current FAQ + "New FAQs for Page & Schema.org" | First visit: 1 hour, deep dive into history; bring valid ID, medication bottles, provider contacts, and ideally a loved one "who can help fill the gaps in your memory" |
| Insurance & Billing | Dr. Kopp's membership notes + insurance list | Most insurances incl. BCBS, Aetna, United, Medicare, Medicaid, most marketplace plans. Membership for the uninsured: prescriptions, labs and therapies not included; educational resources included; labs once yearly. |
| Referrals | "4b" | Clinical: Schwab Rehabilitation Hospital (PT/OT/SLP), Dynasplint (orthotics). Community: adult day care, legal services, food pantries, Casa Esperanza. Affiliations: UIC Psychiatry, Hobson Institute, soon RUSH / Select Rehabilitation Hospital. |
| Contact | "5 Contact Us" | Hours, addresses, transit and parking all confirmed (§4 below) |
| Privacy / Accessibility | not written | Standard copy, clinic to review |

### Navigation

Five destinations plus one CTA:

```
Home | About Us ▾ | Our Services ▾ | Patient Resources ▾ | Contact  [Request an appointment]
```

- **About Us** → Our Story, Meet the Team, Mission & Values
- **Our Services** → Overview, Brain Trauma & Stroke, Concussion Management, Lifestyle Medicine, Physiatry & PM&R
- **Patient Resources** → Overview, FAQs, Insurance & Billing, Referrals & Community

Logo top-left links home. Hamburger top-right on mobile. Dropdowns become an accordion inside the drawer, never a nested flyout. Plain-word labels only.

### Locations — confirmed, use verbatim

Always **East Loop** and **Lincoln Park**. Never "Downtown", never "North Side" — Dr. Kopp is explicit about this.

| | East Loop | Lincoln Park |
|---|---|---|
| Address | 30 N Michigan Ave, Chicago, IL 60602 | 2555 N Southport Ave, Chicago, IL 60614 |
| Hours | 8am–4pm Wednesdays & Fridays | 8am–4pm Tuesdays & Thursdays |
| Parking | Millennium Parking Garage, Grant Park North Entrance, 25 N Michigan Ave ($14 up to 5 hours with validation) | Street parking |
| Transit | Red Line to Lake/Washington, or Green Line to Washington/Wabash | Red Line to Fullerton, or 74 bus to Fullerton & Southport |

Phone **(773) 312-4423** · Fax **(773) 312-4522** — the fax is a working referral channel, not decoration. Both appear on Contact, Referrals, and in the footer.

### Page rhythm

Every content page follows the same skeleton:

1. **Page hero** — eyebrow, H1, one lead paragraph, primary CTA. Arch-crop photo right on ≥900px.
2. **H2 section** — elaboration paragraph, max 640px measure.
3. **Three H3 blocks** — cards on service pages, prose on About and Resources.
4. **Cross-links** — 2–3 cards to sibling pages.
5. **CTA band** — sage field, one line of reassurance, form link + phone.

Deviations: Home adds the conditions strip, an FAQ trio, testimonials, and both locations. Contact swaps step 3 for form + locations + transit. FAQ swaps it for the accordion set. Insurance & Billing swaps it for the three-column membership comparison.

### Sanity pass against the dev site (post-Phase 5)

A final diff against `projects.slash301.com/Clients/WellnessPhys/` turned up four things worth doing and one that stays out. Nothing here is dismissed as "nice to have and probably won't happen" — each item below is either scheduled or has a specific, real reason it doesn't fit, not just deprioritized by default.

**To do:**

1. **Embed real Google Maps on Contact, not just an "Open in maps" link.** The dev site embeds an actual Google Maps `<iframe>` under each location on its contact page; ours (`contact.html`) only links out. An embedded map is better UX (the office location is visible without leaving the page) and helps local SEO. Add one `<iframe>` per location inside `.contact-card`, sized to match the card's existing rhythm, lazy-loaded (`loading="lazy"`). **Keep the "Open in maps" link too** — it stays as the accessible/fallback path when the iframe doesn't render or isn't wanted (reduced-data users, screen readers, print).
2. **Name the actual community-partner organizations on Referrals, not just categories.** `referrals.html` currently groups community partners generically ("adult day care," "legal services," "food pantries"). The dev site's Patient Resources page names real, linked organizations: CSA/community-supported farms (Growing Solutions Farm, Just Roots, Star Farm, CSA Chicago Patchwork Farms, Green Earth Harvest), low-cost legal services (CDEL, CVLS, Illinois State Bar), adult day care (Midwest Brain Injury Clubhouse, Casa Central, Among Friends Adult Day Care), transportation (BriteLift), and support/companion care (Caring.com, Papa.com). Named, linked partners read as more credible and carry more local-SEO weight than generic categories. **Do not add this list silently** — §2 already flags "the final public list of named referral partners" as unconfirmed with Dr. Kopp's team; get that confirmation before publishing named orgs, since a stale or wrong partner name is worse than a generic category.
3. **Carry the condition leaf icons through to the pages that discuss each condition.** Home already uses a distinct hand-drawn leaf per condition (§13: `leaf-tbi`, `leaf-stroke`, `leaf-concussion`, `leaf-cognitive`, `leaf-neurobehavioral`, each on its own tinted circle). Reuse the matching leaf as a small motif on the service/FAQ content that discusses that condition — `leaf-tbi` and `leaf-stroke` on `services/brain-injury-rehabilitation.html`, `leaf-concussion` on `services/concussion-management.html`, `leaf-cognitive`/`leaf-neurobehavioral` wherever memory, mood, or behavior symptoms are discussed (the FAQ, the brain-trauma page's memory/behavior card) — so the visual vocabulary established on Home carries through the site instead of stopping there. This is genuinely worth doing, not just polish: the assets already exist and are already built into the design system, so this is closing a consistency gap the site itself set up and didn't finish, not adding something new.
4. **The dev site's scrolling marquee of condition keywords under the hero.** A real motion touch worth adding, not just filler. Build it under `@media (prefers-reduced-motion: no-preference)` like every other animation on the site, and cap the word list to the same five conditions used everywhere else (no scope creep into invented keywords). Schedule for Phase 6 alongside the other Home refinements rather than Phase 5's page-fill work, since it touches Home's hero rather than a new page.

**Stays out, with a specific reason:**

- **The dev homepage's "500+ Patients Helped" stat card.** Not a style call — this is a factual claim with zero source anywhere in PLAN.md, the copy doc, or Dr. Kopp's emails. Publishing an invented number on a medical clinic's site is a real accuracy risk, not a design preference. Added to §2 sign-off list as a new item: if Dr. Kopp confirms a real number, it's a one-field addition to the Home stats. Not implemented until then.
- **Alternating photo/text rows on the dev Physiatry page.** Considered seriously, not waved off: the dev layout reuses the same handful of stock photos already placed elsewhere on the site (the exact repetition this review exists to catch), and it's visually looser than the `.text-card` pattern already established and shipped across the other three service pages. Switching just Physiatry to a different layout would make it the odd one out among four otherwise-consistent service pages. If Dr. Kopp specifically prefers the photo-heavy look at review, that's a real, discussable trade-off, worth raising with her directly rather than deciding for her here.

---

## 5. Design tokens

Copy the design-system token files into `css/tokens.css` **without editing values**. Every rule in `styles.css` uses `var(--*)`; no raw hex in the stylesheet.

```css
--color-sage-500: #bbcd6f;    /* primary brand */
--color-forest-700: #536f58;  /* body text, buttons, wordmark */
--color-forest-900: #35462f;
--color-cream: #fbf8f1;       /* page background — never stark white */
--color-ink: #2f3a2c;
--color-ink-soft: #5a6455;

/* condition accents — one hue per condition, never general decoration */
--condition-tbi: #fadd8b;              /* gold */
--condition-stroke: #bbcd6f;           /* sage */
--condition-concussion: #e8c58f;       /* sand */
--condition-cognitive: #536f58;        /* forest */
--condition-neurobehavioral: #66a4a8;  /* teal */

--font-display: 'Newsreader', Georgia, serif;   /* headlines, pull quotes */
--font-body: 'Manrope', -apple-system, sans-serif;

--radius-md: 12px; --radius-lg: 20px; --radius-pill: 999px;
--radius-arch: 999px 999px 0 0;   /* signature photo crop */
--shadow-md: 0 8px 24px rgba(83,111,88,.12);
```

Non-negotiables from the design system:

- Cream page background. White only for card surfaces.
- Max **two** background colors active per page (cream + one accent tint).
- Mint `#5cff7f` is a vital accent — focus rings, one stat, one badge. Never a background field.
- Arch-top crop on every portrait and feature photo. This is the brand's signature; a plain rectangle is a mistake.
- Borders are rare and low-contrast. Separation comes from spacing and color blocking.
- Shadows are sage/forest-tinted, never gray.
- Sections breathe: 64–96px vertical padding, 1200px max content width.
- No gradients, no texture, no full-bleed photo behind text, no blur, no emoji.

**Fonts:** self-host Newsreader and Manrope as subset woff2 with `font-display: swap`. Cuts a third-party request and a privacy question.

---

## 6. Components

| Component | Class | Where | Notes |
|---|---|---|---|
| Header + nav | `.site-header` | all | dropdowns, mobile drawer, skip link |
| Hero | `.hero` | all | eyebrow + H1 + lead + 2 buttons + arch photo |
| Button | `.btn.btn-primary` / `-secondary` / `-ghost` | all | pill, `translateY(-1px)` on hover |
| Section heading | `.section-heading` | all | eyebrow + H2 + subtitle, 640px max |
| Condition tag | `.condition-tag` | Home, service pages | leaf icon on tinted circle + label |
| Service card | `.service-card` | Home, Services | 4:5 arch-crop photo, H3, copy, text link |
| Team card | `.team-card` | Team, About | arch-crop portrait, name, credential, bio. **Falls back to a monogram tile when no photo exists** |
| Testimonial | `.testimonial` | Home, service pages | quote, then initials + gender + diagnosis only |
| FAQ item | `.faq` | Home, FAQ | native `<details>`/`<summary>` — free keyboard access |
| Plan comparison | `.plan-grid` | Insurance & Billing | three columns, equal height, no pricing table styling |
| Contact card | `.contact-card` | Contact, footer | address, hours, transit, parking, map link |
| CTA band | `.cta-band` | all | sage field, reassurance line, form + phone |
| Footer | `.site-footer` | all | address left, links middle, hours right, legal beneath |
| Pull quote | `.pull-quote` | About, Team | Newsreader italic — Dr. Kopp's own voice |

**Built in Phase 4, use these — don't reinvent:** `.page-hero` (inner-page hero, lighter than Home's), `.text-card` (service-page H3 cards, no photo), `.prose-grid` (About-style three-column H3 prose, not cards), `.pillar-list` (labelled two-column list, e.g. Lifestyle Medicine pillars), `.crosslink` (the 2–3-card "where to go next" block every page ends on before the CTA band), `.managed-list` (left-border condition/item list, e.g. "Conditions we manage"). Service pages use `.text-card`; prose pages use `.prose-grid`. Both end on `.crosslink-grid`.

**Two details worth getting right, because they carry the brand:**

The umbrella. The copy doc contains the line *"The umbrella in our logo means that we are all connected, and so are your symptoms."* That is the best sentence in the entire source material and it currently appears nowhere prominent. Give it space — a pull quote on About, or the lead into the conditions strip on Home.

The languages. Care in English, Español, and Português is a genuine differentiator and Dr. Kopp cares about it. It deserves a visible, designed treatment on Home and Mission, not a line of body text.

**Voice:** *I* when Dr. Kopp speaks personally (About, Team, bios), *we* when the clinic speaks, always *you* for the reader. Sentence case. No hype, no fear framing, no clinical distancing.

### 6a. Hero fix — the shared `.hero-figure` was under-scaled (fixed Phase 5)

`.hero-figure` (Home's hero, and every `.page-hero`'s via the same class) originally carried a fixed `max-width` (480px on Home, 420px on inner pages) inside a `.hero-grid` column that runs wider than that at typical desktop widths — `1.1fr 0.9fr` on a 1200px container puts the media column at ~497-608px depending on the split. `margin: 0 0 0 auto` right-aligned the undersized photo in that column instead of filling it, so the arch crop — the brand's signature imagery move, and the thing Dr. Kopp specifically said she loves about the leaf video — read as a small accent floating in cream space rather than a lead visual. Worse on inner pages (up to ~77px of dead space) than Home (~17px), and would have been baked into all 11 remaining Phase 5 pages built from the same template.

Fixed at the source, once: `.hero-grid` rebalanced to `1fr 1fr` (from `1.1fr 0.9fr`); `.hero-figure` changed from a fixed px cap to `width: 100%; max-width: 600px` so it fills its column edge-to-edge at any viewport, with `margin: 0` set explicitly (removing the old auto-margin silently fell back to the browser's default `<figure>` margin — `1em 40px` — which reintroduced the same gap from a different cause; caught by measuring `.hero-figure`'s rendered box against `.hero-media`'s, not just eyeballing it). Verified: figure now fills its column with 0px gap on both sides, Home's H1 still wraps to the same 4 lines it did before (the rebalanced grid didn't squeeze the copy column enough to change the wrap), Lighthouse mobile still 100/100/100 with zero failed audits, no horizontal overflow on mobile. `.page-hero .hero-figure`'s separate 420px override was deleted — both hero types now share one rule.

---

## 7. Motion

Small dose, hover or entry only, nothing that moves what someone is reading. Every effect wrapped in `@media (prefers-reduced-motion: no-preference)`.

| Effect | Where | Amount |
|---|---|---|
| Button lift | all CTAs | `translateY(-1px)`, 150ms |
| Arrow nudge | primary CTAs | 3px forward on hover |
| Card lift + photo scale | service/team cards | 4px lift, `scale(1.03)` |
| Nav underline from centre | header links | 200ms |
| Photo settle on entry | hero, feature photos | `1.05 → 1.0` over ~800ms |
| Section reveal | below-fold sections | 12px rise + fade, IntersectionObserver |

**The leaf video.** Dr. Kopp singles it out by name — *"I love the video and to me it brings a sense of comfort, 'I can get better/heal vibe'."* Keep it, carefully: `Video-Banner-Leaf-10s.mp4` (1.2MB) as a Home hero accent, muted, looping, `playsinline`, with a poster frame that renders immediately. Load it only under `prefers-reduced-motion: no-preference` and not under `save-data`. Everyone else gets the poster image, which is a perfectly good hero on its own.

Cap it there. This audience includes people with post-concussion vestibular symptoms, for whom motion is a medical issue rather than a taste one. Honour reduced-motion absolutely.

---

## 8. Analytics and consent

1. Consent Mode v2 defaults set to **denied** in `<head>` before GTM, `wait_for_update: 500`.
2. GTM container loads after the defaults.
3. Cookie banner: Accept / Decline, choice stored in a `consent_choice` cookie, restored on load. Footer "Cookie settings" reopens it.
4. GA4 events via `data-track` attributes, delegated in `scripts.js`:

| Event | Trigger |
|---|---|
| `nav_click` | header, footer, dropdown links |
| `cta_click` | every button and phone/email link (`data-label` identifies it) |
| `form_start` / `form_submit` | appointment form |
| `faq_open` | `<details>` toggle |
| `scroll_depth` | 25 / 50 / 75 / 100% |
| `section_view` | `data-section` enters viewport |
| `outbound_click` | portal, maps, referral partners |

No Clarity — session recording on a clinic site invites a HIPAA argument nobody needs.

---

## 9. SEO and schema

The main lead source, so this is the highest-leverage section of the build.

**Per page:** unique `<title>` under 60 chars, meta description 140–160, canonical, Open Graph + Twitter card, one `<h1>`, no skipped heading levels, descriptive alt text on every image, `BreadcrumbList` JSON-LD.

**Sitewide JSON-LD**, `@id`-linked so the entities join up:

- `MedicalClinic` (`#org`) — name, url, logo, telephone `+17733124423`, faxNumber `+17733124522`, email, `medicalSpecialty: PhysicalMedicineAndRehabilitation`, `availableLanguage: [en, es, pt]`, `openingHoursSpecification`, `sameAs`.
- Two `MedicalClinic` location nodes with `PostalAddress` + `geo`, using the §4 table verbatim.
- `Physician` (`#drkopp`) — Fabiolla Kopp, MD, `medicalSpecialty`, `alumniOf` / `worksFor`, `knowsLanguage`.
- `MedicalWebPage` + `MedicalCondition` on each service page — TBI, Stroke, Concussion, Cognitive changes, Neurobehavioral changes.
- `FAQPage` on `/faq.html` and the Home FAQ trio.
- `Service` nodes on each service page, `provider` → `#org`.
- `Review` nodes for the two testimonials, attributed by initials.

**Local SEO:** NAP identical on every page and in Google Business Profile. City + specialty in H1/title where it reads naturally. The transit and parking detail on Contact genuinely earns local rankings — it is already written, so use all of it.

**Files:** `sitemap.xml` with all URLs, `robots.txt` pointing to it, `llms.txt` summarising the clinic for AI crawlers.

**Keyword targets** (confirm at sign-off): brain injury doctor Chicago, physiatrist Chicago, concussion specialist Chicago, stroke rehabilitation Chicago, TBI rehabilitation Chicago, lifestyle medicine physician Chicago, multilingual brain injury care Chicago.

---

## 10. Appointment form

The primary CTA sitewide. Lives on `/contact.html`, linked from every header, CTA band, and footer.

1. Name
2. Phone
3. Email
4. Preferred location — "East Loop (Michigan Ave)" / "Lincoln Park (Southport Ave)" / "Either"
5. New or existing patient
6. How can we help? — with the no-medical-details notice

Labels above fields, submit bottom-left, inline validation on blur, real success state on the same page. `POST` to Formspree with a honeypot. Phone chunked as `(773) 312-4423` and `tel:`-linked everywhere.

**HIPAA.** A form emailing symptom detail is a PHI risk. Keep it to the six fields above with a visible notice: *"Please don't include medical details in this form."* Confirm the clinic's compliance stance before launch. No booking widget in v1.

**Routing.** Existing patients → Praxis EMR portal, `outbound_click`-tracked, phone as fallback. New patients → call. Dr. Kopp's own framing: *"Registered patient? Request an appointment. New patient? Call for an appointment."* Providers → fax referrals to (773) 312-4522.

---

## 11. Accessibility and performance

**Accessibility.** This audience includes people with cognitive, visual, and vestibular impairment. WCAG 2.2 AA is the floor.

- Skip link first in the DOM.
- Body text ≥17px, line height 1.6, measure ≤70 characters.
- Verify contrast: sage `#bbcd6f` needs forest-900 text on it, never white.
- Visible focus rings everywhere — mint `#5cff7f` earns its place here.
- Keyboard-operable dropdowns; `aria-expanded` on all toggles.
- `<details>` for FAQs rather than a custom accordion.
- Honour `prefers-reduced-motion`.
- Published accessibility statement at `/accessibility.html`.
- **Write alt text from scratch.** Every image in the dev library has an empty alt attribute, so none of it can be inherited.

**Performance.** Target Lighthouse 95+ on mobile.

- AVIF with JPEG fallback via `<picture>`; explicit `width`/`height` on every image.
- Hero image `fetchpriority="high"` and preloaded; everything below the fold `loading="lazy"`.
- Self-hosted subset woff2.
- One CSS file, two deferred JS files. No jQuery, no icon font, no carousel library.
- Video poster-first, per §7.

---

## 12. Client copy rules — non-negotiable

Scope-of-practice corrections from Dr. Kopp. These are not preferences; violating them misrepresents what the clinic legally offers. They override the copy doc and the dev site wherever they conflict.

- Never **"cognitive therapy"** or **"therapeutic counseling"** as WbP services — speech therapists and psychologists own those terms. Say **"therapeutic coaching"**, coaching on principles of cognitive therapy, plus medication management. *The dev site's Physiatry page still says "supportive therapy sessions" — fix on the way across.*
- **No in-house physical therapy, no art therapy.** WbP refers out. Partner therapists cover dizziness, tinnitus, bruxism, balance, headache, breathing retraining, massage, myofascial decompression, reiki, and performance therapy.
- **"Rehabilitation treatment plans"** or "care plans", never "rehabilitation techniques" — she does no manual therapies. **"Health coaching"**, not "life coaching".
- **Testimonials: initials, gender, diagnosis only.** Some patients have pending court cases. The two real testimonials become **"T.D., Female, Stroke, 65"** and **"J.L., Female, Stroke, 36"**. **The live dev site currently publishes these as "T Driver" and "J Lee" on six pages** (home, about, services, FAQ, referrals, lifestyle-medicine) — when pulling copy from the dev site for Phases 5–6, this substitution has to be made every time, not just once. Quotes verified real via WP REST API, used on Home already: *"Dr Kopp, you are friendly, knowledgeable, patient, smart, kind, crazy, laugh, and have a sweet personality."* (T.D.) and *"Dr Kopp, we love you and the way you care for your patients; you and your staff are great with the way you handle everything, like your patients are your family. Thank you!"* (J.L.)
- **Insurance:** "we accept most insurances" — BCBS, Aetna, United, Medicare, Medicaid, most marketplace plans. Membership for the uninsured; Medicare rules bar discounted self-pay framing, so present membership as a structure, not a discount.
- **Group sessions:** weekly for 6 weeks, then once every 2 months.
- **Symptom language:** "mental fogginess, dizzy spells, slow thinking, difficulty multitasking, inexplicable fatigue, mood swings, irritability" — not "cognitive difficulties". "Individual overall health status", not "individual healing processes".
- **Spell out DAI** as diffuse axonal injury (velocity-dependent — high falls, car accidents, falls from horses; often a worse recovery). Explain anoxia as "lack of oxygen to the brain".
- **Concussion page:** "seek care after 2 weeks of persistent symptoms"; return to activity is gradual and symptoms must subside first; "there is usually no need for bed rest."
- **Footer year:** 2026. The clinic was founded in 2025 and the old "© 2023" bothered her.
- **Fix these typos, don't carry them:** "Portugêse" → "Português", "spasticty" → "spasticity", "surrefergery" → "surgery", "Behaviour" → "Behavior", "Centres" → "Centers", "Medicade" → "Medicaid".
- **Terminology:** "Modern", not "Nontraditional". "Trusted partners", not "trusted therapy partners". "Inclusive approach", not "prejudice free".
- **"Mental fogginess", not "brain fog".** Same substance rule as the symptom-language item above — the dev site uses "brain fog" casually in several places; don't carry it across.
- **Avoid "holistic"** in scope-of-practice-adjacent copy — it reads as alternative-medicine positioning against a physician-led practice. Design-system readme's own term is "whole-person".

---

## 13. Assets from the dev site

The dev site's media library holds 84 items, already compression-processed — Dr. Kopp's headshot is ~94KB AVIF, condition icons ~30KB, logo ~5KB. Pull them into `images/<page>/` rather than sourcing new stock.

| Asset | Source file | Destination |
|---|---|---|
| Dr. Kopp headshot — **a real photo** | `2026/03/Dr-F-Kopp.avif` | `images/team/` |
| Umbrella logo, several formats | `2026/02/WBP-Original-Umbrella-Logo*.{avif,png}` | `images/global/` |
| Condition leaf icons — the full set of 5 | `blue-leaf-neuro`, `green-leaf-stroke`, `olive-green-leaf-cog`, `orange-leaf-con`, `yellow-leaf-branch-TBI` | `images/global/conditions/` |
| Leaf video + poster frame | `2026/02/Video-Banner-Leaf-10s.mp4` | `images/home/` |
| Utility SVG icons | `location-pin`, `clock-seven`, `clipboard-text`, `hands-holding-heart`, `people`, `love`, `dart-mission-goal-success` | `images/global/icons/` |
| Licensed stock, ~20 files | Pexels/Unsplash under `2026/02`, `2026/05`, `2026/06` | per page |
| Wireframe images | `wireframe-img-*.png` | **do not ship** |

The library is reachable over plain HTTP and through the WordPress REST API at `/wp-json/wp/v2/media?per_page=100` — that JSON gives every source URL in one request. FTP access to the server exists if a bulk pull is easier.

Dr. Kopp's art direction, from her 3 June email: **page headers are foliage or leaves; sub-sections have people in them.** She also picked out specific Unsplash images — a group at a laptop, an autumn leaf with water droplets, a green vine.

---

## 14. Build order

| Phase | Work | Done when |
|---|---|---|
| **1. Foundation** ✅ | Repo, `build.py`, `site.json`, partials, `tokens.css`, fonts self-hosted, consent + GA4 wired | `python3 build.py` produces a page with correct header and footer |
| **2. Assets** ✅ | Pull the dev library into `images/`, convert and generate posters, write alt text | Every asset in place, named, and described |
| **3. Reference page** ✅ | `index.html` built from `Home.dc.html` — every component appears once | Home passes Lighthouse 95+, validates, schema clean — **got 100/100/100 a11y/BP/SEO, LCP 1.5s** |
| **4. Templates** ✅ | `services/brain-injury-rehabilitation.html` + `about.html` as the two patterns | Both pass the same checks — **100/100/100, zero failed audits** |
| **5. Fill** ✅ | Remaining 11 pages from the two templates + §4 copy, pulling from the dev-site WP REST API as the richest copy source, filtered through §12 | All 15 URLs live, nav complete, no orphans — **gate met: link-checker reports zero missing internal targets across all 17 built files (15 content pages + 404 + the privacy/accessibility pair)** |
| **6. Systems** | Form live, full schema graph, sitemap/robots/llms.txt, 404, privacy, accessibility statement | Rich Results Test clean on Home, a service page, and FAQ |
| **7. Ship to review** | Push to GitHub, enable Pages from `/docs`, walk the whole site | Review URL live and complete |
| **8. Post-review** | Sign-off items from §2 dropped in, 301 map from Framer, GBP alignment | QA checklist green, production domain live |

Phase 3 is the one that matters. Get Home genuinely right and phases 4–5 are mechanical.

**Copy workflow that worked in Phase 4, repeated for Phase 5:** draft from the dev-site page (richest copy, per §0) plus the matching copy-doc section, then run an adversarial pass that checks the draft line-by-line against every §12 rule and flags em dashes, off-list symptom words, hype, and unsourced claims. Triage the flags — some are real (apply), some are the auditor over-reading a line that's actually fine (e.g. a fixed §4 H1, or a line already sourced elsewhere) — don't apply blind.

**Phase 5 results (all 15 content pages + privacy + accessibility now built):** every file passes the automated compliance script (no em dashes, no §12 term violations, one `<h1>`, no heading-level skips, no root-relative paths, valid JSON-LD, no unresolved template placeholders) and the link-checker (zero unresolved internal targets across all 17 files). Lighthouse mobile on five sampled pages (a service page, a hub page, FAQ, Insurance & Billing, Contact, Team) all scored 100 accessibility / 100 best practices / 100 SEO with zero failed audits.

**Two real bugs found and fixed during Phase 5, both structural (fixed once, not per-page):**
1. **`build.py`'s front-matter parser didn't strip quotes.** `cta_band: "false"` parsed to the literal string `'"false"'`, which never matched the check for `"false"`, so the shared CTA band silently rendered on Contact even though the page has its own appointment form directly above it. Fixed in the parser (strips a single matching pair of leading/trailing quotes from any front-matter value), not by removing quotes from one page's front-matter — a future page with a quoted value would have hit the same bug.
2. **The `.hero-figure` was hard-capped below its actual grid column width** (480px/420px caps inside a column that renders 497-608px wide at typical desktop widths), so the arch photo — the brand's signature imagery move — floated with dead cream space beside it instead of filling its column, worse on inner pages (~77px) than Home (~17px). Fixed at the shared CSS source before Phase 5 pages could inherit it: `.hero-grid` rebalanced to `1fr 1fr`, `.hero-figure` changed to `width: 100%; max-width: 600px` with an explicit `margin: 0` (removing the old auto-margin without replacing it fell back to the browser's default `<figure>` margin, `1em 40px`, reintroducing the same gap from a different cause — caught by measuring the rendered box, not eyeballing it). Verified: figure fills its column with 0px gap either side, Home's H1 still wraps to the same 4 lines, Lighthouse unchanged.

**Process note for future sessions:** the copy-drafting workflow's subagents had full tool access by default and several wrote directly to `src/pages/*.html` rather than only returning draft text as instructed — most of that output was high quality (correctly matched established CSS classes, front-matter, JSON-LD patterns) and was kept after verification, but a few pages referenced invented image files that were never generated (`hero-clarity`, `hero-path`, `hero-village`) with fabricated alt text describing photos that don't exist, and one page (`accessibility.html`) was written as a fully standalone file with its own hardcoded header/footer to the wrong directory entirely, because the agent believed the build system didn't exist yet. All caught by rebuilding and running the link-checker (which surfaced the invented image paths as broken links) rather than trusting the workflow's own self-reported "clean" audits — several of those self-audits also disagreed with each other or missed things a second read caught. Every page that shipped was independently rebuilt, link-checked, compliance-scanned, and spot-read before being treated as done.

**Decisions resolved before Phase 5, none needed Nick's input:** Veronica's title stays "Clinic Coordinator" (already shipped, matches copy doc, changing it would create a same-day inconsistency) with a fuller bio on Team than About. Mission and Vision are near-duplicate in the source — Mission leads, Vision trims to what it uniquely adds instead of repeating. "Patients" stays the sitewide default over "survivors" (already PLAN.md's own non-blocking classification), except where a source already says "survivors" in an explicit brain-injury context. Privacy Policy and Accessibility Statement get standard boilerplate now, flagged for a legal/clinic pass before production, same draft-then-sign-off model as everything else. `.plan-grid` (named in §6, never built) ships in Phase 5 for Insurance & Billing: three equal-height cards, no pricing-table chrome, membership framed as a structure and never as a "discount" per the Medicare rule already in this section. Services and Patient Resources overviews are hub pages (neither the service nor prose template): hero, one H2, then a card grid or crosslink grid to the real sub-pages. FAQ groups into four categories (Getting started / Conditions we treat / Our approach / Insurance & billing) rather than a flat list, deduplicated across the copy doc's two FAQ sets and the dev site. Utility pages (FAQ, Insurance, Referrals, Contact, Privacy, Accessibility) skip the hero photo — a new `.page-hero.no-media` variant — since a large image adds nothing on a page people scan for facts; foliage hero photos otherwise repeat across a nav dropdown's sibling pages by design, per Dr. Kopp's own "page headers are foliage" direction, rather than forcing a new stock photo to conceptually match each page topic.

---

## 15. QA checklist

- [ ] One `<h1>` per page, no skipped heading levels
- [ ] Unique title + meta description on all 15 pages
- [ ] Canonical on every page; sitemap matches live URLs exactly
- [ ] Schema passes Google Rich Results Test with no warnings
- [ ] NAP identical across site, schema, and Google Business Profile
- [ ] Fax (773) 312-4522 wherever the phone appears; in schema as `faxNumber`
- [ ] Locations named "East Loop" and "Lincoln Park" everywhere
- [ ] Every image has meaningful alt text and explicit dimensions
- [ ] No scope-of-practice violations from §12 anywhere in the copy
- [ ] Testimonials show initials + gender + diagnosis only
- [ ] Full keyboard pass: nav dropdowns, mobile drawer, form, FAQs
- [ ] Contrast checked on sage and sand fields
- [ ] Reduced-motion honoured; video does not autoplay under it
- [ ] Form submits, honeypot works, success state visible, `form_submit` fires
- [ ] Consent default-deny verified in GA4 debug view; Decline blocks analytics
- [ ] No broken links; 404 offers two clear ways back
- [ ] Relative paths verified — site works at both the Pages sub-path and the root domain
- [ ] Mobile 360px through desktop 1920px, no horizontal scroll
- [ ] Lighthouse ≥95 performance / 100 accessibility on mobile
- [ ] 301s from every old Framer path
