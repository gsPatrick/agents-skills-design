# Agents Skills Design

Portfolio monorepo of landing-page remakes and Cursor Agent Skills for rebuilding them.

> Built by [Patrick — codebypatrick.dev](https://codebypatrick.dev/)

---

## Projects

| Project | Original | Route | Folder |
|---------|----------|-------|--------|
| **The Summer Drive** | [thesummerdrive.com](https://www.thesummerdrive.com/) | `/summer-drive` | [`projects/remake-summer-drive`](projects/remake-summer-drive) |
| **Integrated Biosciences** | [integratedbio.com](https://integratedbio.com/) | `/integrated-bio` | [`projects/remake-integrated-biosciences`](projects/remake-integrated-biosciences) |
| **General Intelligence Company** | [generalintelligencecompany.com](https://www.generalintelligencecompany.com/) | `/general-intelligence` | [`projects/remake-general-intelligence`](projects/remake-general-intelligence) |

Each project is a standalone Next.js app. `cd` into the folder and run:

```bash
npm install
npm run dev
```

---

## Skills

Agent Skills live in [`skills/`](skills/). They teach Cursor how to remake landing pages using the patterns from these projects.

| Skill | Purpose |
|-------|---------|
| [`remake-landing-page`](skills/remake-landing-page) | End-to-end workflow: reference → Next.js remake |
| [`mhtml-reference-extraction`](skills/mhtml-reference-extraction) | Read `.mhtml` for layout, spacing, breakpoints |
| [`scroll-driven-handoff`](skills/scroll-driven-handoff) | Sticky scrollytelling + fade/rise handoff pattern |
| [`nextjs-atomic-design`](skills/nextjs-atomic-design) | Project structure, CSS Modules, component conventions |

### Install skills locally

```bash
chmod +x install.sh
./install.sh
```

This symlinks every skill into `~/.cursor/skills/` so Cursor picks them up across all projects.

### Install per-project (optional)

Copy a skill into any project's `.cursor/skills/` folder to share it with collaborators via Git.

---

## Repo structure

```
agents-skills-design/
├── README.md
├── install.sh
├── skills/
│   ├── remake-landing-page/
│   ├── mhtml-reference-extraction/
│   ├── scroll-driven-handoff/
│   └── nextjs-atomic-design/
└── projects/
    ├── remake-summer-drive/
    ├── remake-integrated-biosciences/
    └── remake-general-intelligence/
```

---

## Disclaimer

All projects are **portfolio reinterpretations** for study purposes. They are not affiliated with, sponsored by, or endorsed by the original brands. All rights to original designs and assets remain with their respective owners.

---

Made by [Patrick](https://codebypatrick.dev/) · 2026
