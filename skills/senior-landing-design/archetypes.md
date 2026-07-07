# Design Archetypes — Extracted from Portfolio

## 1. Editorial (General Intelligence Company)

### Design DNA
Warm literary tech. Feels like a hardcover book met a startup. Hand-painted, not stock.

### Tokens
```css
--color-parchment: #fefffc;
--color-graphite: #2c2c2c;
--color-fog: #b4b8b4;        /* secondary text */
--color-cerulean: #0081c0;   /* accent card only */
--font-display: "Fraunces", Georgia, serif;
--font-body: "Inter", system-ui, sans-serif;
```

### Typography
| Role | Size | Weight | Tracking |
|------|------|--------|----------|
| Hero headline | clamp(22px, 3.2vw, 48px) | 500 | -0.02em |
| Section title | clamp(32px, 5vw, 64px) | 400 | -0.02em |
| Body | 15px | 500 | -0.15px |
| Caption | 13px | 500 | -0.13px |

### Signature components

**Frosted nav pill**
```css
backdrop-filter: blur(20px);
background: rgba(255, 255, 255, 0.72);
border: 1px solid rgba(255, 255, 255, 0.6);
border-radius: 50px;
box-shadow: 0 1px 8px rgba(0, 0, 0, 0.05);
```

**Illustrated hero**
- Full-bleed landscape image, `aspect-ratio: 1553/1450`, min-height 800px
- Sticky glass card slides up over illustration on scroll
- Title centered, white on image, max-width in ch units

**Word blur reveal**
- Each word starts `filter: blur(8px); opacity: 0.3`
- On scroll intersection: blur → 0, opacity → 1, staggered 80ms per word

**Scrollytelling panel** (Coordinator)
- Tall section min-height 3500–5000px
- Sticky heading dims as user scrolls
- Step content cross-fades with progress bars (1px vertical bars)
- Handoff: content fades + next section rises simultaneously (same progress value)

**Atmospheric promo card** (Cofounder)
- `border-radius: 24px`, min-height 800px on desktop
- Background image + solid color underneath
- `box-shadow: 0 0 0 5px rgba(0,0,0,0.04)` — subtle ring, not drop shadow
- Notification mockup: absolute top-right, frosted white `backdrop-blur(20px)`

**Parallax footer**
- Fixed landscape background at bottom of page
- White footer content scrolls over it, revealing the scene

---

## 2. Cinematic (The Summer Drive)

### Design DNA
One color. One font pair. Zero decoration. Event poster energy.

### Tokens
```css
--color-cream: #fff8f1;
--color-voltage-blue: #006eff;  /* ONLY accent */
--font-display: "Editorial New", Georgia, serif;
--font-body: "Founders Grotesk", system-ui, sans-serif;
```

### Typography — vw-based (critical)
Hero wordmark sized in **vw**, not px or rem:
```css
font-size: clamp(34px, 4.6vw, 62px);  /* section CTAs */
/* Hero SVG textLength fills container width exactly */
line-height: 0.8;
letter-spacing: -0.02em;
```
Uppercase micro-labels: `13–16px`, wide tracking, grotesk regular.

### Signature components

**Hero structure**
```
[eyebrow label — centered, small]
[THE SUMMER DRIVE — full-width wordmark, voltage blue]
[DATE left-aligned] [TIME right-aligned] — anchored to bottom of hero grid
[full-bleed rule — 100vw horizontal line, breaks page padding]
```

**Flanking CTA**
```
[CTA column left] [central video/visual 50vw] [CTA column right]
```
Video: `mix-blend-mode: multiply` on cream background — no overlay gradients.

**Logos marquee**
- Infinite horizontal scroll, seamless loop (duplicate track)
- Logos monochrome, single color, consistent height

**Custom cursor** (optional — one per page max)
- Small image follows pointer with lerp trailing
- `mix-blend-mode: difference`
- Disable on `@media (pointer: coarse)`

**Smooth scroll**
- lerp factor ~0.08, `requestAnimationFrame`
- Disable on reduced-motion and mobile

---

## 3. Darkroom (Integrated Biosciences)

### Design DNA
Laboratory cinema. Dark, immersive, one living accent.

### Tokens
```css
--color-void: #000000;
--color-bioluminescent-lime: #cef79e;  /* ONLY accent */
--color-bone-white: #f7f7f5;
--color-abyssal-ink: #222f30;
--font-display: "Aspekta", system-ui, sans-serif;
--font-mono: "Roboto Mono", monospace;
```

### Typography
| Role | Size | Notes |
|------|------|-------|
| Hero | clamp(48px, 12vw, 158px) | thin weight, tight leading 0.95 |
| Statement | clamp(36px, 6vw, 89px) | scroll-revealed |
| Body | 18–22px | bone white on dark |
| Label | 13px mono | uppercase, lichen color |

### Signature components

**Expanding video hero**
```css
/* Start: inset rounded card */
.frame { inset: 12px; border-radius: 20px; }
/* On first scroll: snap to full bleed */
.frame.expanded { inset: 0; border-radius: 0; }
transition: 0.7s cubic-bezier(0.16, 1, 0.3, 1);
```

**Intro clip-path** (page load)
```css
@keyframes introPanel {
  from { clip-path: inset(48.5% round 80px); }
  to   { clip-path: inset(0% round 0px); }
}
```

**Sticky video backdrop**
- Video `position: sticky; top: 0; height: 100vh`
- Content sections scroll over it with solid/bone backgrounds

**Character reveal** (What We Do)
- Each character transitions opacity on scroll progress
- Three statements cross-fade at scroll thresholds

**Lime CTA blob**
```css
/* Dark pill button */
background: var(--color-abyssal-ink);
border-radius: 9999px;
/* Lime arrow circle attached to right edge */
```

**Header morph**
- Logo starts large on hero
- On scroll: shrinks into frosted pill, white logo variant

---

## Blending archetypes

| Client | Primary | Borrow |
|--------|---------|--------|
| Nutritionist | Editorial | Darkroom scroll reveal for testimonials |
| Dental clinic | Darkroom | Editorial warm bone sections for trust |
| Creative agency | Cinematic | Editorial frosted nav |
| Wellness coach | Editorial | Cinematic full-bleed photography hero |
| Tech startup | Editorial | Darkroom character reveal for mission statement |

**Never blend more than 2.** One dominant, one accent technique.
