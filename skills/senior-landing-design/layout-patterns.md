# Layout Patterns — Section Recipes

Use these as structural skeletons. Adapt content, never copy blindly.

---

## Pattern A: Editorial Hero (GIC-style)

```
┌─────────────────────────────────────────────┐
│           [frosted nav pill]                │
├─────────────────────────────────────────────┤
│                                             │
│     full-bleed illustration / photo         │
│                                             │
│         ┌─────────────────────┐             │
│         │  glass card (sticky)│             │
│         │  headline           │             │
│         │  sub + CTA          │             │
│         └─────────────────────┘             │
└─────────────────────────────────────────────┘
```

- Image: `object-fit: cover`, aspect-ratio preserved
- Card: `backdrop-filter: blur()`, rises on scroll with `translateY`
- Headline: serif, centered, `max-width: 28ch`

**Good for**: nutritionist, therapist, boutique brands, SaaS with personality

---

## Pattern B: Cinematic Wordmark (Summer Drive-style)

```
┌─────────────────────────────────────────────┐
│  PRESENTED BY [brand]                       │
│                                             │
│  █████████ THE SUMMER ████████ DRIVE ██████ │  ← fills width
│                                             │
│  DATE          │          TIME              │
│  06.24.21      │          5-10 PM           │
├─────────────────────────────────────────────┤  ← full-bleed rule
│                                             │
│  [LABEL]    [═══ VIDEO ═══]    [LABEL]      │
│  value      central visual      value       │
└─────────────────────────────────────────────┘
```

- Typography IS the design — no hero image needed
- vw sizing makes it scale perfectly
- Central visual anchors between two CTAs

**Good for**: events, launches, agencies, musicians, fashion

---

## Pattern C: Darkroom Immersive (Integrated Bio-style)

```
┌─────────────────────────────────────────────┐
│ ┌─────────────────────────────────────────┐ │
│ │  rounded inset video (expands on scroll)  │ │
│ │                                         │ │
│ │  [large thin headline bottom-left]      │ │
│ └─────────────────────────────────────────┘ │
├─────────────────────────────────────────────┤
│  bone-white section                         │
│  character-by-character statement reveal    │
├─────────────────────────────────────────────┤
│  dark section with lime CTA cards           │
└─────────────────────────────────────────────┘
```

- Video pinned behind multiple sections
- Dark ↔ bone alternation creates rhythm
- Lime appears ONLY on interactive elements

**Good for**: clinics, labs, premium health, architecture studios

---

## Pattern D: Scrollytelling (GIC Coordinator-style)

```
┌─ sticky heading (dims on scroll) ─────────┐
│  "Problem statement in 28ch"              │
├───────────────────────────────────────────┤
│  ┌─ sticky panel ─────────────────────┐   │
│  │ [progress bars]                    │   │
│  │ step title + body (cross-fade)     │   │
│  │                    [diagram/card]  │   │
│  │                                    │   │
│  │     ┌── promo card rises ──────┐   │   │
│  │     │  full-width on handoff   │   │   │
│  │     └──────────────────────────┘   │   │
│  └────────────────────────────────────┘   │
│  [tall scroll runway — 3500px+]           │
└───────────────────────────────────────────┘
```

- One `scrollContainer` tracks offset
- Steps: `floor(scroll / distance * stepCount)`
- Handoff: same progress drives fade + translateY

**Good for**: product explainers, AI tools, complex services, portfolios with narrative

---

## Pattern E: Trust Stack (adaptable to any archetype)

```
1. Hero          — emotional arrival
2. Logos/press   — social proof marquee or static row
3. Statement     — one sentence, huge type, scroll reveal
4. Services      — 2–3 items MAX, not 6 icon cards
5. Proof         — one testimonial or case, not a carousel of 12
6. CTA           — single action, repeated once
7. Footer        — generous, brand + links + landscape/video
```

**Anti-pattern**: Hero → 6 equal cards → 3 testimonials → pricing table → footer
That is junior. Senior = asymmetry, one focal point per section.

---

## Nutritionist example (Editorial archetype)

| Section | Layout | Design choice |
|---------|--------|---------------|
| Hero | Pattern A | Warm food photography, frosted card with name + "Agende sua consulta" |
| About | Pattern E statement | Serif headline, 28ch, word blur reveal |
| Services | 2 cards, not 6 | Planos Personal / Acompanhamento — atmospheric cards, not icon grid |
| Proof | Single testimonial | Large quote, attribution, no carousel |
| CTA | Pattern A card | Sage green `#0081c0` or warm teal — ONE accent card |
| Footer | Pattern editorial | Parallax or soft botanical image behind |

### Tokens for nutritionist
```css
--color-parchment: #fefdf8;
--color-sage: #5a7a6a;
--color-warm-teal: #2a8a7a;
--color-graphite: #2c2c2c;
--font-display: "Fraunces", Georgia, serif;
--font-body: "Inter", sans-serif;
```

---

## Spacing reference (all archetypes)

| Context | Mobile | Desktop |
|---------|--------|---------|
| Section vertical padding | 80–120px | 160–220px |
| Hero internal padding-top | 80px | 140px |
| Gap between title and body | 32px | 48–64px |
| Nav height | 56–64px | 64–72px |
| Max content width | 100% | 1080–1280px |
| Card border-radius | 16–24px | 24–40px |

---

## Pre-delivery checklist

- [ ] Only ONE accent color surface visible per viewport
- [ ] Headlines use display font with negative tracking
- [ ] Body text never exceeds 65ch line length
- [ ] Hero section looks complete without scrolling
- [ ] No generic icon+title+description grid
- [ ] Section padding feels generous (squint test: more air than content)
- [ ] Motion disabled in `prefers-reduced-motion`
- [ ] Works at 375px without horizontal scroll
