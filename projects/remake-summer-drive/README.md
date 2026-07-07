# Remake — The Summer Drive

A pixel-perfect front-end **remake** of Drive Capital's *The Summer Drive* event page, rebuilt from scratch as a portfolio piece to showcase modern, cinematic interface development.

> **Original site:** [thesummerdrive.com](https://www.thesummerdrive.com/)
> **Built by:** [Patrick — codebypatrick.dev](https://codebypatrick.dev/)

---

## About

This project is a personal **reinterpretation** of the original *The Summer Drive* website, recreated purely for study and portfolio purposes. Every layout, typographic detail, and motion decision was reverse-engineered and rebuilt to match the original experience as closely as possible — down to the units, fonts, and feel.

It is **not affiliated with, sponsored by, or endorsed by Drive Capital or Studio Freight.** All original branding, assets, and the event itself belong to their respective owners.

## Highlights

- **Pixel-perfect hero** — full-bleed background video with an inline-SVG wordmark, sized in `vw` units to scale identically across viewports.
- **Self-hosted brand fonts** — loaded via `@font-face` to faithfully match the original typography.
- **Logos marquee** — an infinite, seamless horizontal scroll of partner logos.
- **Custom cursor** — a steering-wheel cursor with a smooth trailing effect and `mix-blend-mode: difference`.
- **Smooth scrolling** — a lightweight, dependency-free inertial scroll (lerp + `requestAnimationFrame`).
- **Hidden OutRun game** — a pseudo-3D arcade racer hidden in the hero, faithful to the classic engine. Click the car to play.
- **Accessibility-aware** — respects `prefers-reduced-motion` and coarse-pointer devices (custom cursor and smooth scroll gracefully fall back).

## Tech Stack

- **[Next.js 14](https://nextjs.org/)** — App Router
- **JavaScript** — no TypeScript
- **CSS Modules** — scoped, component-level styling
- **Atomic Design** — organized component architecture
- Modern CSS — `vw`-based fluid sizing, custom properties, keyframe animation

## Getting Started

```bash
# install dependencies
npm install

# run the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — it redirects to `/summer-drive`.

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
  page.js                # redirect to /summer-drive
  summer-drive/          # the main event page
  outrun/                # the hidden OutRun game route
components/
  organisms/             # Hero, FlankingCTA, AmenitiesBar, Story,
                         # LogosMarquee, DunkTankSchedule, Cursor,
                         # SmoothScroll, OutrunGame
public/                  # video, fonts, logos, cursor, game assets
```

## Disclaimer

This repository exists solely as a **front-end development portfolio piece**. It reproduces the look and feel of an existing website for educational purposes. No commercial use is intended, and all rights to the original design and branding remain with Drive Capital and Studio Freight.

---

Made by [Patrick](https://codebypatrick.dev/) · 2026
