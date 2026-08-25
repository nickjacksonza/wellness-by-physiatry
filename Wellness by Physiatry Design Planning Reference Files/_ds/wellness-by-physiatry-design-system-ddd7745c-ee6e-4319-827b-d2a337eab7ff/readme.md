# Wellness by Physiatry — Design System

## Company & Product Context

Wellness by Physiatry is a Chicago-based brain injury rehabilitation and lifestyle-medicine clinic founded and run by **Dr. Fabiolla Kopp, MD**, a Physical Medicine & Rehabilitation (physiatry) physician who previously led patient care at TIRR Memorial Hermann and Schwab Rehabilitation Hospital. The clinic treats adults recovering from traumatic brain injury (TBI), stroke, concussion, cognitive changes, and neurobehavioral changes, and supports their families and caregivers through the whole recovery journey. Care blends evidence-based rehabilitation medicine with the six pillars of Lifestyle Medicine (sleep, nutrition, stress, exercise, social connection, avoiding risky substances), and is offered multilingually (English, Español, Português). The clinic has two Chicago locations (Michigan Ave downtown, Southport Ave north side).

**The umbrella in the logo is the brand's central metaphor**: "we are all connected, and so are your symptoms" — one canopy covering whole-person, whole-family care.

There is one product surface today: the **marketing website**, currently live on Framer at `https://receptive-look-689612.framer.app/` (canonical domain `wellnessbyphysiatry.com`), with a rebuild underway on WordPress + Elementor at `https://projects.slash301.com/Clients/WellnessPhys/` (inaccessible at the time of this build — could not be read). This design system exists to carry the Framer site's warm, botanical feel into that WordPress rebuild.

**Sources used:**
- Live Framer site: `https://receptive-look-689612.framer.app/` (content and structure fetched directly)
- `uploads/V2 Working Copy Doc for Wellness by Physiatry.md` — full page-by-page copy, heading structure (H1/H2/H3), and FAQ content for the planned new site
- `uploads/WBP-Original-Umbrella-Logo-1.png` — primary logo
- `uploads/{yellow-leaf-branch-TBI, green-leaf-stroke, orange-leaf-con, olive-green-leaf-cog, blue-leaf-neuro}.avif` — the five condition leaf icons used on the live site's "Common Conditions" section
- Six candid lifestyle/portrait photos (Pexels/Nappy/generated) representing the kind of warm, real-people photography the site uses
- The in-progress WordPress site (`projects.slash301.com/...`) was **not reachable** — not reflected here; re-share if you'd like it cross-checked
- The clinic's **Canva Brand Guidelines deck** (Mission/Vision, "Our Brand," logo usage, color palette, moodboard slides) — used to confirm colors and add the Mission Statement, Vision Statement, "Who We Are," and "Our Purpose" copy below. The deck's color-palette slide had a labeling error: two of its five swatches were both printed with the hex `#E2DCC9`. Real values were sampled directly from the swatch pixels instead: `#FADD8B` (gold) and `#5CFF7F` (mint).

## Index

- `styles.css` — root stylesheet, imports everything below
- `tokens/` — `colors.css`, `typography.css`, `spacing.css`, `effects.css` (radii, shadows, motion)
- `assets/logo/` — umbrella wordmark
- `assets/conditions/` — 5 leaf icons (one per condition)
- `assets/photography/` — 6 candid photos
- `guidelines/` — 12 specimen cards (Colors, Type, Spacing, Brand) — see the Design System tab
- `components/core/` — `Button`, `ConditionTag`
- `components/marketing/` — `SectionHeading`, `ServiceCard`, `TeamCard`, `FAQItem`, `ContactCard`
- `components/navigation/` — `NavBar`, `Footer`
- `ui_kits/website/` — click-through recreation of the marketing site: `Home`, `About`, `Services`, `Contact` (open `index.html`)
- `SKILL.md` — portable skill file for use in Claude Code

## Content Fundamentals

**Voice:** warm, plain-spoken, and reassuring — a clinician speaking directly to a worried patient or family member, never clinical jargon without explanation. Sentences are short to medium and mostly declarative. Example: "Welcome to Wellness by Physiatry. I'm Dr Kopp, I founded Wellness By Physiatry to provide the best care available for brain injury survivors and their families."

**Person:** switches deliberately between **I** (Dr. Kopp speaking personally, in About/bio copy) and **we** (the clinic speaking institutionally, on service and home pages) — both always address the reader as **you**. Example of "we": "We want to give you the best care. We offer…" Example of "I": "I spend time on the things that are important for you, connecting function, safety, and community."

**Tone words to keep:** clarity, compassion, whole-person, connected, autonomy, hope, dignity. Avoid: clinical distancing ("the patient will…"), hype ("revolutionary," "cutting-edge"), fear-based framing.

**Casing:** sentence case for body copy and most headings; a few headline treatments use Title Case for page H1s (e.g. "Begin Your Health Journey Today"). No ALL CAPS except small tracked-out UI labels (nav eyebrows, footer column headers).

**Structure:** every service/page follows the same rhythm — one H1 promise, one H2 elaboration, then 3 H3 sub-topics as short paragraphs. FAQs are literal Q/A pairs, answered directly and specifically (insurance carriers named, exact price/time details included where known).

**Emoji:** none, anywhere in the source material. Do not introduce them.

**Multilingual note:** the clinic explicitly serves English, Español, and Português speakers — copy should acknowledge this (as the live site and doc both do) rather than assume English-only readers.

## Visual Foundations

**Color:** the palette is drawn directly from the logo and the site's five condition-leaf icons, not invented, and has now been cross-checked against the Canva Brand Guidelines deck's Color Palette slide. Forest green (`#536f58`) matched exactly; sage, teal, and gold were adjusted to the deck's true values (`#bbcd6f`, `#66a4a8`, `#fadd8b`) after sampling the mislabeled swatches directly. Sage green is the primary brand color; forest green (`#536f58`–`#35462f`) is the dark neutral used for body text, footers, and the wordmark's subtitle. Warm cream (`#fbf8f1`) is the page background — never stark white for large surfaces, though card surfaces are white. Four more hues — gold, sand, teal, and the forest green itself — are reserved as **condition accents**, each tied to one specific condition (TBI/gold, Stroke/sage, Concussion/sand, Cognitive/forest, Neurobehavioral/teal) rather than used as general decoration. Max two background colors active on any one page (cream + one accent tint).

The deck's fifth swatch — a vivid mint (`#5cff7f`) — is a **vital accent**, not a condition color: `--color-mint-100/500/700` and `--accent-vital*` tokens. It's a vivid highlight only — focus rings, a stat call-out, a single badge — and should never fill a background field; it's too saturated to sit behind body text or large surfaces.

**Type:** a serif/sans pairing carries the brand's "clinical but human" balance. **Newsreader** (serif, often italic) is used for headlines, hero statements, and pull quotes — it's the warm, editorial voice of Dr. Kopp speaking directly to you. **Manrope** (sans) handles body copy, UI, buttons, and small tracked-out eyebrows/labels. No font files were provided with the brand materials — these are close Google Fonts substitutes chosen to match the logo's serif wordmark and the clean geometric sans used for "BY PHYSIATRY." **Flagging for the user:** if Dr. Kopp's team has an official brand typeface, please share the files/names and we'll swap them in.

**Spacing:** generous, airy — sections breathe with 64–96px of vertical padding; a 4px base scale (4/8/12/16/24/32/48/64/96/128) underlies component-level spacing.

**Backgrounds:** flat color fields (cream or a single accent tint) rather than gradients or texture. No photographic full-bleed backgrounds behind text. The one recurring pattern element is the **hand-drawn line leaf** — used as a small icon, never as a repeating wallpaper texture.

**Imagery:** warm, candid, real-people photography — multigenerational, multicultural, un-posed (moving boxes, breakfast tables, lakeside conversations, embraces) — never sterile stock-photo "doctor with clipboard" imagery. Color grading is natural and warm, not desaturated or moody. Images are given a distinctive **arch-top crop** (`--radius-arch`, flat-bottomed with a fully rounded top) that echoes the umbrella canopy silhouette from the logo — this is the design system's signature imagery treatment and should be used consistently for portraits and feature photos on the new site, rather than plain rectangles or full circles.

**Animation:** the live site uses simple, subtle motion (fades/slides on scroll, gentle button lift on hover) — nothing bouncy or playful, consistent with a calm clinical-but-warm feel. Keep transitions short (150–250ms) and eased, never abrupt or springy.

**Hover/press states:** buttons lift slightly (`translateY(-1px)`) and/or shift 1–2 shades darker on hover; no color inversion or shape changes. Links underline on hover, colored a shade darker forest green. No visible "pressed/shrink" treatment observed on the live site — kept subtle by design.

**Borders & shadows:** borders are rare, thin, and low-contrast (`rgba(83,111,88,.16)`) when used at all — most separation comes from spacing and color blocking, not rules. Shadows are soft, low-opacity, and warm-tinted (sage/forest, never gray) — `shadow-sm/md/lg` tokens in `tokens/effects.css`.

**Corner radii:** buttons and tags are full pills; cards and photo containers use a generous 12–20px rounding; the signature arch crop (see Imagery) is reserved for feature/portrait photography.

**Layout:** simple single-column marketing sections, alternating full-width color blocks with centered max-width (1200px) content; no fixed/sticky chrome beyond the top nav.

**Transparency/blur:** not used on the live site — surfaces are flat and opaque throughout.

## Brand Foundation (from Canva guidelines)

Copy below is verbatim from the deck's "About Us" and "Our Brand" slides.

**Mission Statement**
> Wellness by Physiatry was made to deliver culturally competent, multilingual services designed to help people heal, grow, and thrive.

**Vision Statement**
> Wellness by Physiatry was made to deliver culturally competent, multilingual services designed to help people heal, grow, and thrive.

*(The deck prints identical text for the Mission and Vision statements — flagging this rather than inventing a distinct vision, since we can't know what was intended.)*

**Who We Are**
> Wellness by Physiatry is a physician-led clinic specializing in integrative neurorehabilitation and lifestyle medicine for individuals recovering from brain injuries and neurological conditions.

**Our Purpose**
> Our purpose is to deliver accessible, evidence-based care that supports every patient in rebuilding a meaningful, functional life—regardless of insurance status or background.

The deck's "Our Brand" slide also gives the **concentric-arcs diagram** (You → Body → Community → Ecosystem → World → Universe, thin white line-work on dark forest) — the same nesting logic as the site's arch photo-crop, now captured as its own guideline card (`guidelines/brand-concentric-arcs.html`).

## Iconography

The only iconography in the brand today is the **set of five hand-drawn line leaves** (one per condition), each rendered in white line-work on a solid tint circle — copied into `assets/conditions/`. There is no general-purpose icon font, SVG icon set, or system icon library on the current site; no emoji or Unicode-glyph icons are used anywhere in the source material. If the WordPress rebuild needs additional icons (e.g. for checklists, contact info, or resource links), we recommend a simple, thin-line icon set in the same forest-green line weight as the leaves — **Lucide** (CDN: `unpkg.com/lucide-static`) is a close stylistic match and was not substituted here, only flagged as a recommendation; nothing has been added speculatively.

## Intentional Additions

No component in this system was invented without a basis in the live site or the working copy doc. `ConditionTag`, `ServiceCard`, `TeamCard`, `FAQItem`, and `ContactCard` map directly to sections named in the source material (Common Conditions, Our Services, Meet the Team, FAQ, Contact/Locations). `SectionHeading` was added as a shared primitive because the eyebrow + H2 + subtitle pattern repeats identically across every page in the doc.

## Caveats

- **The Mission and Vision statements are identical in the source deck** (see Brand Foundation above) — left as-is rather than guessed at; ask Dr. Kopp's team which one needs rewriting.
- **The Canva deck had no typography slide**, so Newsreader + Manrope remain unswapped substitutes. It does include Logo Design and Alternate Logo Usage slides, which confirm the existing umbrella wordmark and add three alternate treatments (white, mint-green, and black-on-transparent) not yet pulled into `assets/` — say the word if you want those extracted as additional logo variants.
- **No brand font files were supplied.** Newsreader + Manrope are close Google Fonts substitutes for the logo's serif wordmark and the geometric sans in "BY PHYSIATRY" — please share official files if they exist.
- **The in-progress WordPress site could not be reached** (`projects.slash301.com/Clients/WellnessPhys/` returned no response), so nothing here was cross-checked against it.
- **No testimonials, additional team photos, or brand icon set were supplied** — `TeamCard` and photography are shown with the material provided; add real headshots and any additional team bios when available.

**Please review and iterate with us:** tell us if the sage/forest palette and the arch-crop photo treatment feel right for Dr. Kopp's brand, whether Newsreader + Manrope should be swapped for an official typeface, and which of the four screens in `ui_kits/website/` best captures the tone you want for the Elementor rebuild — that feedback is exactly what will make the next pass sharper.
