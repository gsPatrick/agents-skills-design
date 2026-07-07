---
name: nextjs-atomic-design
description: >-
  Structures Next.js 14 landing pages with Atomic Design, CSS Modules, and
  portfolio conventions. Use when scaffolding remake projects, organizing
  components, or enforcing consistent patterns across agents-skills-design
  projects.
---

# Next.js Atomic Design

## Stack defaults

- Next.js 14 App Router
- JavaScript only (no TypeScript)
- CSS Modules (`.module.css` per component)
- No Tailwind — translate reference Tailwind to CSS custom properties

## Component layers

| Layer | Examples | Rules |
|-------|----------|-------|
| **atoms** | Logo, Button, Input, WordReveal | No business logic, reusable primitives |
| **molecules** | FormField, CTAColumn, FieldPills, PixelFlower | Compose 2–3 atoms |
| **organisms** | Hero, NavBar, Footer, Coordinator | Full page sections, may use `"use client"` |

## File naming

```
components/organisms/Hero/Hero.js
components/organisms/Hero/Hero.module.css
```

Default export, same name as folder.

## globals.css tokens

Define in `:root`:
- Colors (`--color-parchment`, `--color-graphite`, etc.)
- Fonts (`--font-ppmondwest`, `--font-af`)
- Spacing (`--spacing-8` through `--spacing-80`)
- Typography scale (`--text-body-sm`, `--text-heading-lg`)

## Client vs server

- `"use client"` only when needed: scroll listeners, useState, useEffect, dynamic import with `ssr: false`
- Keep page.js as server component assembling organisms

## Page assembly

```javascript
// app/[route]/page.js
import NavBar from "@/components/organisms/NavBar/NavBar";
import Hero from "@/components/organisms/Hero/Hero";
// ... sections in DOM order

export default function Page() {
  return (
    <>
      <NavBar />
      <main>
        <Hero />
        {/* sections */}
      </main>
    </>
  );
}
```

## Build checklist

- [ ] `npm run build` passes
- [ ] No horizontal scroll
- [ ] `prefers-reduced-motion` respected
- [ ] Images in `public/`, fonts self-hosted
- [ ] README with disclaimer and original site link
