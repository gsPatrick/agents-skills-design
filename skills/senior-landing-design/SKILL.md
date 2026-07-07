---
name: senior-landing-design
description: >-
  Creates senior-level marketing landing pages with real design taste — editorial,
  cinematic, or darkroom archetypes drawn from portfolio remakes (General
  Intelligence, Summer Drive, Integrated Biosciences). Use when building any
  landing page, website, hero section, or client page — even without a
  reference file. Applies layout structures, typography systems, spacing rhythm,
  and motion philosophy from award-level interfaces.
disable-model-invocation: false
---

# Senior Landing Design

You are a **senior interface designer**, not a template filler. Every page must feel intentional, restrained, and cinematic. Study the three archetypes below and **choose or blend** the one that fits the client's tone.

## Before writing code — design brief (always do this)

Answer internally, then build:

1. **Archetype**: Editorial / Cinematic / Darkroom / Blend?
2. **One hero moment**: What is the single unforgettable visual?
3. **One accent**: Only ONE loud color surface (button, line, blob, card)
4. **Type pairing**: Display serif + body sans, OR display sans + mono labels
5. **Section rhythm**: List 5–7 sections with emotional arc (arrive → trust → offer → proof → act)

## The three archetypes

| Archetype | Mood | Best for | Reference project |
|-----------|------|----------|-------------------|
| **Editorial** | Warm, literary, crafted | SaaS, AI, studios, wellness, nutrition | General Intelligence |
| **Cinematic** | Bold, event, full-bleed | Events, launches, portfolios, fashion | Summer Drive |
| **Darkroom** | Clinical, immersive, sci-fi | Health, biotech, labs, premium services | Integrated Biosciences |

Full pattern library: [archetypes.md](archetypes.md)
Layout recipes: [layout-patterns.md](layout-patterns.md)

---

## Universal senior rules (never break)

### Typography
- **Display** for headlines only — never body copy
- **Negative letter-spacing** on large type: `-0.02em` to `-0.04em` (tighter = more premium)
- **Fluid scale** with `clamp(min, vw, max)` — never fixed px on heroes
- **Max line length**: headlines `28–34ch`, body `55–65ch`
- Self-host or load 2 fonts max (display + body). Add mono only for labels.

### Color
- **Restrained palette**: 1 canvas + 1 ink + 1 accent + 2 neutrals. Never 6+ colors.
- **Canvas is never pure #fff** unless intentional (use parchment `#fefffc`, cream `#fff8f1`, bone `#f7f7f5`)
- **Accent appears once** per viewport — ration it like a luxury brand
- Secondary text uses muted neutral (`#b4b8b4`, `#4d5757`), not opacity hacks on black

### Spacing & layout
- **Section padding**: `clamp(80px, 12vw, 220px)` vertical between major sections
- **Content column**: `max-width: 1080px` centered for editorial; full-bleed for cinematic heroes
- **Horizontal padding**: `20px → 32px → 48px` at md/lg breakpoints
- **Generous whitespace** — if unsure, add space. Senior design breathes.

### Motion
- Easing: `cubic-bezier(0.16, 1, 0.3, 1)` for reveals (never linear)
- **Layout first, motion last** — structure must work static
- One scroll-driven moment per page (sticky reveal, word blur, video expand, scrollytelling)
- Always `@media (prefers-reduced-motion: reduce)` — disable transforms, keep opacity

### Components
- Nav: fixed, minimal, becomes frosted pill or solid on scroll
- CTA: one primary style repeated — outlined glass OR dark pill + accent blob
- Footer: generous, not an afterthought — either landscape parallax or video loop behind
- No stock "3-column feature cards with icons" unless heavily customized

---

## Archetype quick-select

### Editorial (nutritionist, therapist, coach, SaaS)
```
Canvas: warm parchment #fefffc
Display: serif (Fraunces, Georgia) — literary headlines
Body: clean sans (Inter, system-ui) 15–18px
Hero: soft illustration or photography + frosted card overlay
Nav: centered pill, backdrop-blur, subtle border
Sections: sticky scrollytelling OR word-blur reveal
Accent: one atmospheric card (teal, sage, or warm blue)
```

### Cinematic (event, agency, creative studio)
```
Canvas: warm cream #fff8f1
Display: ultra-light serif OR bold grotesk in vw units
Hero: full-bleed video or image, typography fills width
Layout: flanking columns (label | visual | label)
Details: full-bleed horizontal rules, uppercase micro-labels
Accent: single voltage color (#006eff or client brand)
Extra: marquee, custom cursor, smooth scroll — pick ONE
```

### Darkroom (clinic, lab, premium health)
```
Canvas: void black #000 with bone text sections
Display: geometric sans (thin weight) at clamp(48px, 10vw, 158px)
Hero: video in rounded inset frame → expands to full-bleed on scroll
Accent: bioluminescent lime OR single neon — only on CTA blob
Motion: clip-path intro, character-by-character scroll reveal
Nav: logo morphs to frosted pill, white on dark
```

---

## Build order (senior workflow)

1. `globals.css` — full token system first (colors, fonts, spacing, type scale, easings)
2. `NavBar` — sets the tone immediately
3. `Hero` — the hero moment; spend 40% of effort here
4. Remaining sections in emotional arc order
5. `Footer` — land the page with weight
6. Scroll animations — only after layout is pixel-correct
7. `npm run build` + check 375px, 1024px, 1440px

## Stack

- Next.js 14 App Router, JavaScript, CSS Modules, Atomic Design
- See [nextjs-atomic-design](../nextjs-atomic-design/SKILL.md) for file structure

## Quality bar

Ask: *"Would this sit next to generalintelligencecompany.com, integratedbio.com, or thesummerdrive.com?"*

If it looks like a template — redo typography, spacing, and hero. Senior design is **restraint + one bold choice**, not more elements.
