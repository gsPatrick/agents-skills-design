---
name: remake-landing-page
description: >-
  Rebuilds marketing landing pages from saved reference HTML/MHTML into Next.js
  with Atomic Design. Use when remaking a website, cloning a landing page,
  reverse-engineering a site, or building portfolio reinterpretations from
  reference files.
---

# Remake Landing Page

## Workflow

1. **Collect references**
   - Structure/sizing: `.mhtml` (layout, spacing, breakpoints)
   - Animations: `.htm` with live scripts (scroll, GSAP, transitions)
   - Keep reference files local only — do not commit `.mhtml`/`.htm`

2. **Scaffold**
   - Next.js 14 App Router, JavaScript (no TypeScript)
   - CSS Modules per component
   - Atomic Design: `atoms/`, `molecules/`, `organisms/`
   - Self-host fonts via `@font-face` in `globals.css`
   - Download assets (fonts, images, video) into `public/`

3. **Build section by section**
   - One organism per page section, in DOM order
   - Match reference classes/spacing before adding animation
   - Verify each section visually before moving on

4. **Animate last**
   - Implement layout first, scroll/motion after structure is correct
   - Use `prefers-reduced-motion` fallbacks

5. **Verify**
   - `npm run build` must pass
   - Check horizontal overflow (`overflow-x: clip` on `html`, `body`, page wrapper)
   - Compare against reference at 375px, 1024px, 1440px

## Project conventions

```
app/
  layout.js, globals.css, page.js (redirect)
  [route]/page.js
components/
  atoms/, molecules/, organisms/
public/
  fonts/, images/, media/
```

## README template

Each project README must include:
- Link to original site
- Disclaimer (not affiliated / portfolio piece)
- Tech stack, getting started, project structure
- Built by Patrick — codebypatrick.dev

## Anti-patterns

- Do not use `100vw` on full-bleed sections (causes horizontal scroll)
- Do not commit reference MHTML files
- Do not switch `position: fixed` mid-scroll for sticky handoff elements (causes duplicates/jumps)
- Do not stack padding wrappers (section + inner + wrap narrows cards incorrectly)
