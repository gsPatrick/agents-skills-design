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
| **Steep** | [steep.app](https://steep.app/) | `/steep` | [`projects/remake-steep`](projects/remake-steep) |
| **Seed** | [seed.com](https://seed.com/) | `/seed` | [`projects/remake-seed`](projects/remake-seed) |
| **Superpower** | [superpower.com](https://superpower.com/) | `/superpower` | [`projects/remake-superpower`](projects/remake-superpower) |

### Landings de SaaS próprios (base de referência)

| Projeto | Arquétipo | Pasta |
|---|---|---|
| **BankerPro** | Darkroom · app-native · mobile-first | [`projects/saas-bankerpro-landing`](projects/saas-bankerpro-landing) |
| **Eterniza Gestão** | Editorial · white-label por tenant | [`projects/saas-eterniza-landing`](projects/saas-eterniza-landing) |

Não são remakes — são produtos do Patrick. Estão aqui como **base**: quando o
trabalho for uma landing de SaaS, copie a estrutura destas em vez de inventar.
Cada uma traz o `globals.css` completo, os componentes da landing e o
`BrandMark`.

Each project is a standalone Next.js app. `cd` into the folder and run:

```bash
npm install
npm run dev
```

---

## Recipes — biblioteca de padrões

**[`recipes/INDEX.md`](recipes/INDEX.md)** — 23 padrões extraídos dos projetos.
Cada pasta tem o **código real, em produção**, mais um `RECIPE.md` explicando
por que cada número é aquele número, e as armadilhas que já quebraram a seção.

O agente **copia** daqui em vez de reconstruir de memória. Reconstruir a partir
de uma descrição em prosa é de onde vêm os números errados.

| Categoria | Padrões |
|---|---|
| Revelação de texto | `reveal-word-blur` · `reveal-char-scroll` |
| Scroll | `scroll-step-handoff` · `sticky-video-backdrop` · `parallax-footer-reveal` · `smooth-scroll-lerp` |
| Herói | `glass-card-sticky-hero` · `frame-expand-fullbleed` · `intro-clip-path` · `wordmark-svg-fullwidth` |
| Navegação | `nav-morph-frosted` · `nav-scroll-theme` |
| Seções | `marquee-seamless` · `atmospheric-promo-card` |
| Sistemas | `vw-proportional-canvas` · `cursor-blend-difference` · `video-autoplay-ios` |
| Do Seed | `gooey-controls-filter` · `reveal-width-two-layer` · `scroll-horizontal-parallax` |
| Do Superpower | `scroll-stage-tracks` · `carousel-progress-autoplay` · `edge-bleed-track` |

Cada projeto também tem um **`ANATOMY.md`** dissecando as seções uma a uma:
camadas, ancoragem, driver de animação, pista de scroll, estados, e o
raciocínio por trás dos valores.

---

## Skills

Agent Skills teach Cursor **design taste** and **technical patterns** from these projects.

### Primary — use these for any new landing page

| Skill | Purpose |
|-------|---------|
| **[`senior-landing-design`](skills/senior-landing-design)** | **Design taste, archetypes, layouts, typography** — makes the agent think like a senior designer. Use for nutritionist, clinic, SaaS, any client page. |
| **[`section-anatomy`](skills/section-anatomy)** | **Protocolo de decomposição** — camadas, ancoragem, driver, pista, estados. Obrigatório antes de codar qualquer seção com scroll, sticky ou animação. |
| **[`builder-css-reading`](skills/builder-css-reading)** | **Como ler CSS de builder** (Webflow, Framer, Wix) sem pegar a regra errada — extrair por lista de classes, juntar as duas fontes, checar o que o JS sobrescreve. |
| **[`measurement-protocol`](skills/measurement-protocol)** | **Como medir um original com confiança** — rolar antes de medir, amostrar o scroll, converter referenciais, varrer por propriedade. Use junto com `section-anatomy` em qualquer clone. |
| **[`brand-mark-design`](skills/brand-mark-design)** | **Marca do produto** — símbolo geométrico + wordmark como SVG inline. Aplica-se sozinha em qualquer produto sem logo definido. |

Includes: Editorial (GIC), Cinematic (Summer Drive), Darkroom (Integrated Bio) archetypes + section recipes.

### Supporting — technical implementation

| Skill | Purpose |
|-------|---------|
| [`nextjs-atomic-design`](skills/nextjs-atomic-design) | File structure, CSS Modules, component conventions |
| [`mhtml-reference-extraction`](skills/mhtml-reference-extraction) | Read `.mhtml` when cloning an existing site |
| [`remake-landing-page`](skills/remake-landing-page) | Clone workflow — only when user provides reference files |
| [`scroll-driven-handoff`](skills/scroll-driven-handoff) | ⚠️ substituída por [`recipes/scroll-step-handoff`](recipes/scroll-step-handoff) |

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
│   ├── senior-landing-design/    ← COMECE AQUI (juízo de design)
│   │   ├── SKILL.md
│   │   ├── archetypes.md
│   │   └── layout-patterns.md
│   ├── section-anatomy/          ← protocolo de decomposição
│   ├── measurement-protocol/     ← como medir com confiança
│   ├── builder-css-reading/      ← como ler CSS de builder
│   ├── brand-mark-design/        ← marca (símbolo + wordmark)
│   ├── nextjs-atomic-design/
│   ├── mhtml-reference-extraction/
│   ├── remake-landing-page/
│   └── scroll-driven-handoff/    (substituída por recipes/)
├── recipes/                      ← CÓDIGO REAL, copiável
│   ├── INDEX.md
│   └── <23 padrões>/
│       ├── RECIPE.md             ← anatomia, calibragem, armadilhas
│       └── <Componente>.js/.css  ← extraído dos projetos
└── projects/
    ├── remake-*/                 ← clones de referência
    │   └── ANATOMY.md            ← dissecação seção por seção
    └── saas-*-landing/           ← landings próprias, base para SaaS
        ├── app/globals.css       ← sistema de tokens completo
        └── components/
```

### O fluxo que o agente deve seguir

```
senior-landing-design   →  qual arquétipo? qual arco de seções?
        ↓
recipes/INDEX.md        →  esse padrão já existe? (quase sempre sim)
        ↓
section-anatomy         →  se for novo: camadas, driver, pista, estados
        ↓
builder-css-reading     →  se o original é Webflow/Framer: qual regra vale
        ↓
measurement-protocol    →  se for clone: como obter os números com confiança
        ↓
copiar recipe + ajustar parâmetros
        ↓
registrar recipe nova + ANATOMY.md
```

---

## Disclaimer

All projects are **portfolio reinterpretations** for study purposes. They are not affiliated with, sponsored by, or endorsed by the original brands. All rights to original designs and assets remain with their respective owners.

---

Made by [Patrick](https://codebypatrick.dev/) · 2026
