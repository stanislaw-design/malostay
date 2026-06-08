---
name: Malo Stay
description: Direct-booking micro-site for cottages above the Dunajca valley — an unhurried window onto the landscape
colors:
  dunajca-dusk: "#1C2320"
  pieniny-pine: "#1E4D2B"
  river-sage: "#7A8E7E"
  morning-fog: "#F4EEE4"
  limestone-bone: "#FDFAF5"
  wet-slate: "#2E3330"
  valley-mist: "#C8CEC9"
typography:
  display:
    fontFamily: "DM Serif Display, Georgia, serif"
    fontSize: "clamp(2.5rem, 5vw, 4.5rem)"
    fontWeight: 400
    lineHeight: 0.9
    letterSpacing: "normal"
  title:
    fontFamily: "DM Serif Display, Georgia, serif"
    fontSize: "clamp(1.9rem, 2.8vw, 3rem)"
    fontWeight: 400
    lineHeight: 0.9
    letterSpacing: "normal"
  body:
    fontFamily: "Poppins, sans-serif"
    fontSize: "15px"
    fontWeight: 300
    lineHeight: 1.6
    letterSpacing: "normal"
  label:
    fontFamily: "Poppins, sans-serif"
    fontSize: "11px"
    fontWeight: 500
    lineHeight: 1
    letterSpacing: "0.3em"
rounded:
  none: "0px"
  lg: "16px"
  full: "9999px"
spacing:
  sm: "8px"
  md: "24px"
  lg: "48px"
  xl: "96px"
components:
  button-primary:
    backgroundColor: "{colors.dunajca-dusk}"
    textColor: "{colors.limestone-bone}"
    rounded: "{rounded.full}"
    padding: "12px 32px"
  button-primary-hover:
    backgroundColor: "{colors.wet-slate}"
  card-photo:
    backgroundColor: "{colors.limestone-bone}"
    rounded: "{rounded.lg}"
  panel-editorial:
    backgroundColor: "{colors.limestone-bone}"
    rounded: "{rounded.none}"
    padding: "24px"
---

# Design System: Malo Stay

## 1. Overview

**Creative North Star: "The Unhurried Window"**

Every screen is a frame onto the Dolina Dunajca, not a pitch for it. Panoramic hero photography, slow word-by-word reveals, and generous negative space all serve one idea: the visitor should feel like they are already looking out from the cottage, not scrolling through a brochure for it. Nothing here performs — type breathes at line-heights near 0.9, sections run for 30+ viewport-heights of quiet, and the one moment of color saturation (the deep greens) is rationed like a view held back until you've earned it.

The system rejects the entire vocabulary of Polish short-let marketing: no carousels, no "BOOK NOW" badges, no stacked trust-icons competing for attention. It also refuses the opposite trap — cold, sans-only, Airbnb-grey minimalism that reads as corporate rather than calm. Warmth comes from tinted neutrals (cream fog, bone white, slate charcoal — never true black or white), from a serif display face used in both upright and italic registers, and from photography that is allowed to simply be large. Mountain-resort ruggedness is also out of bounds: this is a valley, not an expedition — the mood is closer to a held breath than an adrenaline spike.

**Key Characteristics:**
- Warm, green-tinted neutrals stand in for both "dark mode" and "light mode" — there is no true black or white anywhere in the system
- Display serif (DM Serif Display) carries every emotional beat; italics mark the line where feeling overtakes information
- Flat-by-default surfaces, defined by hairline borders rather than shadows
- One micro-interaction — a circular bone-colored mask that blooms from a button's center on hover — repeats everywhere as the system's signature gesture
- Sections alternate between cream (`morning-fog`), warm white (`limestone-bone`), and near-black green (`dunajca-dusk`) backgrounds to set a slow rhythm of light and shade down the page

## 2. Colors

The palette reads as the valley itself at different hours: dusk greens, morning fog, river stone. Saturation is reserved almost entirely for two deep greens; everything else is a warm, desaturated neutral.

### Primary
- **Dunajca Dusk** (#1C2320): The valley at dusk — a near-black green that anchors every "serious" surface: the fixed nav once scrolled, the footer, the gallery's photo gutters, the hero's image overlay, and the fill of every primary button (`Sprawdź dostępność`, `Sprawdź termin`, `Szukaj domków`). Roughly a third of any dark section is this color.

### Secondary
- **Pieniny Pine** (#1E4D2B): A richer, more saturated forest green held in reserve for moments that need to register as "alive" rather than "architectural" — five-star ratings in Reviews, the numerals in Amenities, and the active state of map pins on the Location section.

### Tertiary
- **River Sage** (#7A8E7E): The color of hillside seen through morning haze. Used exclusively for quiet signaling: uppercase eyebrow labels (`Wspomnienia gości`, `Zarezerwuj pobyt`), italic emphasis inside headlines (`Małopolska.`), and small supporting icons. Never a fill, never a button — its job is to whisper, not announce.

### Neutral
- **Morning Fog** (#F4EEE4): The cream that most of the page rests on — the default light-section background (Hero text overlay tone, FinalCTA, Reviews, Location, MemorySection).
- **Limestone Bone** (#FDFAF5): Warm off-white, a half-step lighter and cooler than Morning Fog. Used for surfaces that need to sit *on top of* something — cards, the booking-widget panel over the hero photo, search-result tiles, text rendered over dark backgrounds.
- **Wet Slate** (#2E3330): The body-text color across the entire site, plus the hover-state fill for primary buttons. A warm near-black that never reads as pure ink.
- **Valley Mist** (#C8CEC9): The lightest neutral with any color in it — used only for hairline dividers, card borders at low opacity, and the rule beneath the featured testimonial quote.

### Named Rules
**The No-True-Neutral Rule.** Every color in this system — including the ones that *function* as black, white, or grey — carries a green or cream tint (Dunajca Dusk instead of black, Limestone Bone instead of white, Wet Slate instead of charcoal-grey). If a value reads as a flat, untinted neutral, it does not belong here.

**The Sage Whisper Rule.** River Sage appears only in labels, italics, and small icon accents — never as a background fill or button color. Its rarity is what makes it register as a signal rather than decoration; the moment it fills a surface, it stops being a whisper.

## 3. Typography

**Display Font:** DM Serif Display (with Georgia, serif fallback) — set in both upright and italic styles
**Body Font:** Poppins (with sans-serif fallback), weighted from 200 to 700 but used mostly at 300–400

**Character:** A measured, editorial pairing — a classical serif for anything that needs to *feel*, a light-weight geometric sans for anything that needs to be *read quickly*. The serif's italic is doing real semantic work here: it is the system's primary tool for marking the emotional register of a sentence.

### Hierarchy
- **Display** (400, `clamp(2.8rem, 8.5vw, 7.5rem)`, line-height 0.88): Reserved for the hero's two-line headline, revealed word-by-word on load. The second line is always italic — the shift from upright to italic *is* the shift from statement to feeling ("Twoja dolina." → "*Twoje tempo.*").
- **Headline** (400, `clamp(2.5rem, 5vw, 4.5rem)`, line-height 0.9): Section titles (`Galeria.`, `Znajdź swój termin.`, `Dolina Dunajca, Małopolska.`). Mostly upright, with a single italic word doing the emphasis work where needed.
- **Title** (400 italic, `clamp(1.9rem, 2.8vw, 3rem)`, line-height 0.88–0.94): Sub-section and featured-card headlines (cottage names, atmosphere-block titles, pull-quotes). Italic by default at this level — by the time type is this size and this close to the content, it has earned the emotional register.
- **Body** (300, 15px, line-height 1.6, max-width ~28rem / 65–75ch): Descriptive copy, set at `charcoal/60` for de-emphasis against headlines. Always generous, never dense — paragraphs run short rather than wrap long.
- **Label** (500, 9–11px, letter-spacing 0.25–0.32em, uppercase): Eyebrow tags above every section heading and form-field captions. Always one of `river-sage`, `wet-slate/40`, or `limestone-bone/40` depending on the surface beneath it — never the body-text color at full opacity.

### Named Rules
**The Italic-Carries-Emotion Rule.** Upright display type states a fact; italic display type names a feeling. Every headline in the system follows this split deliberately — don't italicize for decoration, only at the exact word where the sentence turns from informational to felt.

## 4. Elevation

Malo Stay is flat by default. Surfaces are separated with 1px hairline borders (`wet-slate/10`, `valley-mist/50`) rather than shadows almost everywhere on the page — the booking panel, search-result tiles, the cottage gallery grid, and section dividers all rely on borders or background-color shifts alone. Shadows are held in reserve for the small set of elements that genuinely float above the page: dropdown panels, tilted parallax photographs, and the header once it lifts off the hero. When they do appear, they are soft and warm-tinted (`shadow-charcoal/10`), never the harsh, cool black of a default browser shadow.

### Shadow Vocabulary
- **Floating panel** (`box-shadow: 0 25px 50px -12px rgb(46 51 48 / 0.1)` — Tailwind `shadow-xl shadow-charcoal/10`): The "Domki" navigation dropdown. Signals "this is temporarily layered above the page."
- **Tilted photograph** (Tailwind `shadow-2xl`): The two parallax portrait photos in the Memories section, each rotated 2–3°. The shadow does the work of making a rotated rectangle read as a physical print rather than a clipped div.
- **Lifted header** (Tailwind `shadow-sm`): Appears only once the nav has scrolled past the hero and switched from transparent to a `limestone-bone/95` backdrop-blur surface — the shadow is the cue that it has detached from the page background.

### Named Rules
**The Borders-First Rule.** Reach for a 1px hairline border before reaching for a shadow. Shadows are reserved for things that are *actually* floating — dropdowns, parallax images, a header that has detached from its hero — never for routine card or panel separation.

## 5. Components

### Buttons
- **Shape:** Fully rounded pills (`rounded-full`, 9999px) for every clickable action; the only exception is the language-switcher, also a pill but in outline form.
- **Primary:** `dunajca-dusk` fill, `limestone-bone` text, `px-8 py-3` (smaller variants drop to `px-5 py-2.5`), tracking-wide. Hover swaps the fill to `wet-slate`.
- **The signature reveal:** every button — primary, ghost, and outline alike — shares one micro-interaction. A `limestone-bone`-colored circle is masked at `clip-path: circle(0% at 50% 50%)` and blooms to `circle(150% at 50% 50%)` over 500ms on hover, while the label crossfades from light-on-dark to dark-on-light with a 150ms delay. It is the single most repeated piece of motion in the system — every button should feel like it belongs to the same family because of this one gesture, not because of shared color alone.
- **Ghost / Outline:** `border border-limestone-bone` on dark surfaces (hero CTA), or `border border-[brand-green] text-[brand-green]` for the language switcher — both use the identical reveal animation, just inverted.

### Cards
- **Photo-led cards** (cottage cards, gallery tiles, parallax portraits): `rounded-2xl` (16px) or larger, `overflow-hidden`, no border — the image *is* the card, chrome would only compete with it.
- **Editorial / functional panels** (booking-widget, search form, calendar, search-result tiles): square corners (`rounded-none`), `limestone-bone` background, `1px wet-slate/10` border, `p-6` internal padding. This square register is a deliberate counterpoint to the rounded photo-led cards — when a surface is "doing work" (search, results, dates) it reads as a document; when it's "showing the place" it reads as a photograph.
- **Shadow strategy:** none at rest; see Elevation for the rare floating exceptions.

### Inputs / Fields
- **Style:** Borderless underline fields — `bg-transparent`, `border-b border-wet-slate/15` (or `border-limestone-bone/25` on dark surfaces), no fill, no corner radius. The interface gets out of the way of the data.
- **Focus:** The underline opacity steps up (`/15` → `/40`, or `/25` → `/55` on dark) — a quiet color shift, never a glow or outline ring.
- **Labels:** 9px, uppercase, letter-spacing `widest`, set at 40% opacity of the surface's text color — present but clearly secondary to the value beneath them.
- **Stepper controls** (guest counts): bare `−` / `+` glyphs at reduced opacity that brighten on hover — no buttons, no borders, no boxes.

### Navigation
- **Style:** Fixed header that starts fully transparent over the hero photograph (logo at full brightness, links in `limestone-bone/80`) and transitions — over 300ms — to a `limestone-bone/95` backdrop-blurred bar with a soft shadow once the page scrolls past 72px (logo inverts via `brightness-0`, links switch to `wet-slate`).
- **Links:** 14px, tracking-wide, hover color shifts to the brand action-green.
- **Dropdown ("Domki"):** A `limestone-bone` panel, `rounded-2xl`, bordered and softly shadowed, animated in with Framer Motion (scale 0.97→1, staggered children) — the only place in the system where motion choreography goes beyond a simple fade.
- **Mobile:** Collapses to a full panel; the same transparent-to-solid logic applies.

## 6. Do's and Don'ts

### Do:
- **Do** keep every neutral tinted toward green or cream — Dunajca Dusk, Limestone Bone, Wet Slate, Morning Fog, Valley Mist. If a color could be mistaken for `#000` or `#fff`, it's wrong for this system.
- **Do** reserve River Sage for labels, italics, and small icon accents only — never as a fill.
- **Do** mark the emotional turn in any headline with italic display type; keep the informational portion upright.
- **Do** define surfaces with 1px hairline borders first; shadows are for things that are genuinely floating (dropdowns, parallax photos, the post-scroll header).
- **Do** give every button the same circular bone-colored reveal on hover — it is the system's one repeated gesture, and repetition is what makes it feel intentional rather than accidental.
- **Do** let sections run long and quiet — generous `py-32`/`py-44` rhythm, short paragraphs capped near 65–75ch, large breathing room between ideas.

### Don't:
- **Don't** build anything that could be mistaken for a "generic Polish rental site template (OLX, nocleg.pl feel)" — no stock-photo grids competing for attention, no generic countryside-cottage clichés.
- **Don't** reach for "WordPress holiday-park clones with carousels, badges, and 'BOOK NOW' everywhere" — no auto-rotating carousels, no urgency badges, no shouted CTAs. One calm, well-placed booking action per section is enough.
- **Don't** drift toward "over-designed Airbnb-adjacent minimalism (cold white, sans-serif-only, zero warmth)" — if a screen reads as cold or corporate, the warmth (serif display, tinted cream neutrals, photography) has been lost somewhere.
- **Don't** introduce "mountain resort branding (rugged, sporty, adventure-heavy)" — no carabiner iconography, no bold expedition typography, no high-energy action photography. This is a valley to rest in, not a peak to conquer.
- **Don't** introduce one-off hex greens outside the token palette (e.g. an ad-hoc `#2E7D52` action green sitting beside `dunajca-dusk`-filled buttons that do the same job) — consolidate every primary action to the same token so the green never reads as two different brands.
- **Don't** add corner radius to the editorial/functional panels (search form, calendar, result tiles) — their square corners are what separates "the system at work" from "the system showing you a photograph."
