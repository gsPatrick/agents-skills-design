# Remake — Integrated Biosciences

A front-end **remake** of Integrated Biosciences' website, rebuilt from scratch as a portfolio piece to study its darkroom-laboratory visual language and scroll-driven motion.

> **Original site:** [integratedbio.com](https://integratedbio.com/)
> **Built by:** [Patrick — codebypatrick.dev](https://codebypatrick.dev/)

---

## About

This project is a personal **reinterpretation** of the original *Integrated Biosciences* website, recreated purely for study and portfolio purposes. Every layout, typographic detail, and motion decision was reverse-engineered and rebuilt to match the original experience as closely as possible — down to the units, fonts, and feel.

It is **not affiliated with, sponsored by, or endorsed by Integrated Biosciences.** All original branding and assets belong to their respective owners.

## Highlights

- **Expanding hero video** — a framed, rounded video that snaps open to a full-bleed, edge-to-edge canvas on the first scroll, staying pinned behind the content.
- **Intro reveal** — on page load, the video panel grows from a tiny centred dot to fill the screen while the hero copy and header ease in.
- **Scroll-driven statements** — the "What we do" section reveals its copy character-by-character and cross-fades between three statements as you scroll.
- **Dynamic header** — a fixed header whose logo turns into a frosted pill on scroll, with a full-screen mobile menu overlay.
- **Live video footer** — the footer plays the same loop behind its content instead of sitting on flat black.
- **Bioluminescent-lime CTA** — the signature dark pill + lime arrow-blob button, rationed as the single accent surface.
- **Self-hosted fonts** — `Aspekta` and `Roboto Mono` loaded via `@font-face` to match the original typography.
- **Reliable video autoplay** — muted, `playsInline`, with an interaction fallback for iOS.
- **Accessibility-aware** — respects `prefers-reduced-motion` for every animation.

## Tech Stack

- **[Next.js 14](https://nextjs.org/)** — App Router
- **JavaScript** — no TypeScript
- **CSS Modules** — scoped, component-level styling
- **Atomic Design** — organized component architecture
- Modern CSS — fluid `clamp()` typography, custom properties, `position: sticky`, keyframe animation

## Getting Started

```bash
# install dependencies
npm install

# run the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — it redirects to `/integrated-bio`.

```bash
# production build
npm run build
npm start
```

## Project Structure

```
app/
  layout.js              # root layout + metadata
  globals.css            # design tokens, @font-face, resets
  page.js                # redirect to /integrated-bio
  integrated-bio/        # the main page
components/
  atoms/                 # ArrowButton, BgVideo, Logo
  molecules/
  organisms/             # NavBar, HeroExperience, WhatWeDo, Platform,
                         # UspCards, Marquee, Company, Newsroom, Footer
public/                  # fonts, hero-loop video, icons, images
```

## Disclaimer

This repository exists solely as a **front-end development portfolio piece**. It reproduces the look and feel of an existing website for educational purposes. No commercial use is intended, and all rights to the original design and branding remain with Integrated Biosciences.

---

Made by [Patrick](https://codebypatrick.dev/) · 2026
