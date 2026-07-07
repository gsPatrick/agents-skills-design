# Remake — General Intelligence Company

A front-end **remake** of [General Intelligence Company](https://www.generalintelligencecompany.com/), rebuilt from scratch as a portfolio piece to study its editorial, literary visual language.

> **Original site:** [generalintelligencecompany.com](https://www.generalintelligencecompany.com/)  
> **Built by:** [Patrick — codebypatrick.dev](https://codebypatrick.dev/)

---

## About

This project is a personal **reinterpretation** of the original GIC website, recreated purely for study and portfolio purposes. The design pairs a warm parchment canvas with hand-painted hero illustrations, ppmondwest serif headlines, and whisper-quiet UI components.

It is **not affiliated with, sponsored by, or endorsed by The General Intelligence Company.**

## Highlights

- **Frosted navigation pill** — backdrop-blur nav with theme-aware logo and outlined CTA
- **Illustrated hero** — full-bleed spring landscape with sticky glassmorphic card
- **Word blur reveal** — editorial headline animation on scroll
- **Pixel flower** — scroll-driven pixel-art reveal in the vision section
- **Coordinator scrollytelling** — sticky heading with floating field pills and diagram card
- **Cofounder promo** — cerulean atmospheric card with typewriter cursor and notification mockup
- **Parallax footer** — fixed landscape background revealed beneath the white footer
- **Cookie banner** — minimal text-first consent UI

## Tech Stack

- **Next.js 14** — App Router
- **JavaScript** — no TypeScript
- **CSS Modules** — scoped styling
- **Atomic Design** — atoms, molecules, organisms
- Self-hosted fonts — `ppmondwest` + `af` via `@font-face`

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3003](http://localhost:3003) — redirects to `/general-intelligence`.

```bash
npm run build
npm start
```

## Project Structure

```
app/
  globals.css
  general-intelligence/page.js
components/
  atoms/          Logo, OutlinedButton, WordReveal
  molecules/      PixelFlower
  organisms/      NavBar, Hero, StripeDividers, Vision, Coordinator,
                  CofounderPromo, BlogList, Footer, FooterBackground, CookieBanner
public/
  fonts/          af.woff2, ppmondwest.woff2
  images/         hero, footer, cofounder, blog posts
```

## Disclaimer

This repository exists solely as a **front-end development portfolio piece**. No commercial use is intended, and all rights to the original design and branding remain with The General Intelligence Company.

---

Made by [Patrick](https://codebypatrick.dev/) · 2026
