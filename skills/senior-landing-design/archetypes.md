# Design Archetypes — Extracted from Portfolio

> **Este arquivo descreve a intenção de design. Ele não é a fonte dos números.**
>
> Para implementar qualquer componente listado aqui, abra a recipe
> correspondente em [`recipes/INDEX.md`](../../recipes/INDEX.md) — lá está o
> código real, testado, com os valores exatos e as armadilhas.
>
> Antes de construir uma seção com scroll/sticky/animação, siga o protocolo em
> [`section-anatomy`](../section-anatomy/SKILL.md).

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

**Illustrated hero** → [`recipes/glass-card-sticky-hero`](../../recipes/glass-card-sticky-hero/)
- `aspect-ratio: 1553/1450` + `min-height: 800px` — **nunca `height: 100vh`**
  numa ilustração, ou cada tela recorta uma composição diferente
- Card de vidro `sticky` em `top: calc(100vh - 330px)`
- Vidro **escuro** (`rgba(0,0,0,0.12)` + `blur(15px)`), porque o texto é branco
  sobre imagem clara
- Título centralizado com `text-shadow` **branco** (halo, não sombra), e
  `font-feature-settings: "liga" 0` para a largura não oscilar durante o reveal

**Word blur reveal** → [`recipes/reveal-word-blur`](../../recipes/reveal-word-blur/)
- Cada palavra sai de `opacity: 0; filter: blur(5px); translateY(10px)`
- Escalonamento de 60ms (50ms no herói), transição de 0.6s
- `IntersectionObserver` com `threshold: 0.25` e `rootMargin: "0px 0px -10% 0px"`
  — sem esses dois valores o reveal dispara no rodapé da tela

**Scrollytelling panel** (Coordinator) → [`recipes/scroll-step-handoff`](../../recipes/scroll-step-handoff/)
- Seção de 3500px (mobile) / 5000px (lg)
- `STEPS_DISTANCE 3500 · HANDOFF_START 2800 · HANDOFF_LENGTH 1000`
- O handoff começa **antes** dos passos acabarem — a sobreposição é o efeito
- Nunca `position: fixed` no elemento de handoff

**Atmospheric promo card** (Cofounder) → [`recipes/atmospheric-promo-card`](../../recipes/atmospheric-promo-card/)
- `border-radius: 24px`, `min-height: 800px` em desktop, `padding: 80px`
- `background-color` sólido **por baixo** da `background-image`
- `box-shadow: 0 0 0 5px rgba(0,0,0,0.04)` — anel, não drop shadow
- Mockup de notificação: absolute top-right, vidro `backdrop-blur(20px)`

**Parallax footer** → [`recipes/parallax-footer-reveal`](../../recipes/parallax-footer-reveal/)
- Paisagem `position: fixed; bottom: 0; z-index: -1`
- O wrapper da página precisa de `background-color` **opaco**
- O elemento precisa ser irmão do wrapper — um ancestral com `transform` ou
  `filter` cria contexto de empilhamento e o `z-index: -1` some

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

### Sistema de dimensionamento — canvas em vw → [`recipes/vw-proportional-canvas`](../../recipes/vw-proportional-canvas/)

**A página inteira é dimensionada em `vw`, não só o wordmark.** Toda fonte,
padding, borda e raio derivam de uma prancheta de 1440px (e de 375px abaixo de
800px de viewport):

```
px ÷ 14.4 = vw   (desktop, prancheta 1440)
px ÷ 3.75 = vw   (mobile,  prancheta 375)
```

```css
padding: 2.431vw 2.083vw;              /* 35px / 30px @ 1440 */
border-bottom: 0.139vw solid #006eff;  /* 2px @ 1440 */
font-size: 5.369vw;                    /* 77px @ 1440 — data/hora */
line-height: 95%;
letter-spacing: -0.02em;
```

`clamp()` **não** serve aqui: quando a tipografia é o layout, o teto do clamp
trava o título enquanto o padding continua crescendo, e a composição se perde.

Micro-rótulos em caixa alta: `1.25vw` (18px), grotesk regular.

**O wordmark é um path SVG**, não texto — `width: 100%` + `viewBox` preenche a
largura exatamente, sem layout shift. Ver
[`recipes/wordmark-svg-fullwidth`](../../recipes/wordmark-svg-fullwidth/).

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

**Logos marquee** → [`recipes/marquee-seamless`](../../recipes/marquee-seamless/)
- Renderize a lista **duas vezes** e anime até `translateX(-50%)` — é a única
  combinação em que a costura é invisível
- `linear` sempre; qualquer easing denuncia o loop
- Logos monocromáticos, dimensões forçadas + `object-fit: contain`

**Custom cursor** (opcional — um por página) → [`recipes/cursor-blend-difference`](../../recipes/cursor-blend-difference/)
- O arrasto vem de `transition: transform 0.2s ease` no CSS, **não** de lerp em JS
- `mix-blend-mode: difference` no **wrapper**, não no cursor
- Offset `translate(-15%, -25%)` para o ponto quente cair no pixel apontado
- Desligue em `(pointer: coarse)` por JS **e** por CSS

**Smooth scroll** → [`recipes/smooth-scroll-lerp`](../../recipes/smooth-scroll-lerp/)
- `ease = 0.14`. Abaixo de 0.10 a página fica escorregadia e causa enjoo
- Condição de parada obrigatória (`Math.abs(diff) < 0.5`), senão o rAF roda
  para sempre
- Cap de lead de uma viewport — sem ele o momentum de trackpad faz a página
  derivar por 3–5s depois que você parou
- Desligue em touch e em reduced-motion

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

O herói **não usa `clamp()`** — usa a fórmula fluida linear, que dá controle do
ponto de partida e da taxa de crescimento:

```css
/* Herói: 50px @ 440px de viewport → cresce 0.062px/px → trava em 112px */
font-size: max(3.125rem, min(calc(3.125rem + 0.062 * (100vw - 27.5rem)), 7rem));

/* Declaração: 30px → 58px */
font-size: max(1.875rem, min(calc(1.875rem + 0.028 * (100vw - 27.5rem)), 3.625rem));
```

| Papel | Tamanho | Notas |
|------|------|-------|
| Herói | fórmula acima (50→112px) | `line-height: 1`, `letter-spacing: -0.03em` |
| Declaração | fórmula acima (30→58px) | revelada por scroll, `line-height: 1.1` |
| Corpo | 18–22px | bone white sobre escuro |
| Rótulo | 13px mono | caixa alta, cor lichen |

**Um peso só de Aspekta (400).** Toda a hierarquia vem de tamanho e cor, nunca
de peso — é isso que dá a sensação clínica.

### Signature components

**Expanding video hero** → [`recipes/frame-expand-fullbleed`](../../recipes/frame-expand-fullbleed/)
```css
.frame          { inset: 12px; border-radius: 20px; }
.frame.expanded { inset: 0; border-radius: 0; }
transition: inset .7s cubic-bezier(.16,1,.3,1), border-radius .7s cubic-bezier(.16,1,.3,1);
```
Gatilho `window.scrollY > 8` — o **mesmo** do nav, para os dois parecerem uma
coreografia só. Anima `inset`, não `transform: scale` (que esticaria o vídeo).

**Intro clip-path** (carregamento) → [`recipes/intro-clip-path`](../../recipes/intro-clip-path/)
```css
@keyframes introPanel {
  from { clip-path: inset(48.5% 48.5% 48.5% 48.5% round 80px); }
  to   { clip-path: inset(0% 0% 0% 0% round 0px); }
}
animation: introPanel 2.2s cubic-bezier(.16,1,.3,1) both;
```
`48.5%`, não `50%` — a `50%` o retângulo tem largura zero e o primeiro frame é
uma tela vazia. Título entra em `1.15s` e o bloco inferior em `1.4s`: sobrepor
faz a sequência parecer 2.4s em vez de 4s.

**Sticky video backdrop** → [`recipes/sticky-video-backdrop`](../../recipes/sticky-video-backdrop/)
- Vídeo `position: sticky; top: 0; height: 100vh; z-index: 0`
- **O conteúdo precisa de `margin-top: -100vh`** para cancelar o espaço que o
  sticky reserva no fluxo — sem isso você rola uma tela vazia antes do título
- `opacity: 0.875` no vídeo sobre fundo preto, em vez de gradiente de overlay

**Character reveal** (What We Do) → [`recipes/reveal-char-scroll`](../../recipes/reveal-char-scroll/)
- Caracteres apagados em `opacity: 0.4`, não `0`
- `.char` precisa ser `inline`, nunca `inline-block` (um span com só um espaço
  colapsa para largura zero e come os espaços entre palavras)

**Lime CTA blob**
```css
/* Dark pill button */
background: var(--color-abyssal-ink);
border-radius: 9999px;
/* Lime arrow circle attached to right edge */
```

**Header morph** → [`recipes/nav-morph-frosted`](../../recipes/nav-morph-frosted/)
- Gatilho `scrollY > 8` (não `> 0`, que tremula com microdeltas de trackpad)
- O vidro vai no container **interno**, não no `<header>` externo, senão a
  pílula gruda nas bordas da tela
- Os cinco valores que vendem o vidro: `blur(20px)` + `background rgba(…,0.72)`
  + `border 1px rgba(255,255,255,0.6)` + `border-radius: 50px` + sombra a 0.05

**Nav com tema por seção** (GIC) → [`recipes/nav-scroll-theme`](../../recipes/nav-scroll-theme/)
- Só compensa com 3+ alternâncias de fundo claro/escuro
- As seções se declaram com `data-navbar-theme="dark|light"`; o nav lê o
  atributo da seção que estiver atrás dele em `scrollY + altura-do-nav`

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
