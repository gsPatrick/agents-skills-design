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

Agent Skills teach Cursor **design taste** and **technical patterns** from these projects.

### Primary — use this for any new landing page

| Skill | Purpose |
|-------|---------|
| **[`senior-landing-design`](skills/senior-landing-design)** | **Design taste, archetypes, layouts, typography** — makes the agent think like a senior designer. Use for nutritionist, clinic, SaaS, any client page. |

Includes: Editorial (GIC), Cinematic (Summer Drive), Darkroom (Integrated Bio) archetypes + section recipes.

### Supporting — technical implementation

| Skill | Purpose |
|-------|---------|
| [`nextjs-atomic-design`](skills/nextjs-atomic-design) | File structure, CSS Modules, component conventions |
| [`scroll-driven-handoff`](skills/scroll-driven-handoff) | Sticky scrollytelling + fade/rise handoff |
| [`mhtml-reference-extraction`](skills/mhtml-reference-extraction) | Read `.mhtml` when cloning an existing site |
| [`remake-landing-page`](skills/remake-landing-page) | Clone workflow — only when user provides reference files |

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
│   ├── senior-landing-design/    ← START HERE (design taste)
│   │   ├── SKILL.md
│   │   ├── archetypes.md
│   │   └── layout-patterns.md
│   ├── nextjs-atomic-design/
│   ├── scroll-driven-handoff/
│   ├── mhtml-reference-extraction/
│   └── remake-landing-page/
└── projects/
```

---

## Disclaimer

All projects are **portfolio reinterpretations** for study purposes. They are not affiliated with, sponsored by, or endorsed by the original brands. All rights to original designs and assets remain with their respective owners.

---

Made by [Patrick](https://codebypatrick.dev/) · 2026
