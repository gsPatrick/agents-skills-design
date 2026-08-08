# Steep — Anatomia

Remake de [steep.app](https://steep.app/). Arquétipo **editorial-produto**:
cinza neutro, tipografia em pesos fracionários, uma cor de acento por card.

Rodar: `npm install && npm run dev` → `/steep`

---

## Sistema

Paleta larga, mas com regra clara: **um par (fundo claro + tinta escura) por
categoria de card**.

```
--color-ink-black    #17191c   texto primário, fundo de botão cheio
--color-mist-gray    #f2f2f3   superfície de card
--color-fog-white    #fafafb   faixa de seção alternada
--color-slate-gray   #777b86   links e texto auxiliar

--color-card-blue    #d3e3fc / --color-card-blue-ink   #194168
--color-card-green   #d8efdf / --color-card-green-ink  #1f4720
--color-blush-peach  #fbe1d1 / --color-sienna-brown    #5d2a1a
```

Os cinzas são **seis**, não três. Cada um tem função nomeada
(`mist` = card, `fog` = faixa, `light` = nested, `slate` = link,
`ash` = tag, `smoke` = placeholder). A hierarquia vem do cinza, não da
opacidade — nenhum `rgba(0,0,0,.6)` na página.

**Pesos fracionários 430 / 450 / 480.** Só existem porque as famílias
completas de Signifier e Söhne estão carregadas. Mesma assinatura de
hierarquia fina que reaparece no Seed (300/350/400/500).

---

## Seções

### NavBar

Fixa, muda de tema conforme a faixa que está atrás →
[`recipes/nav-scroll-theme`](../../recipes/nav-scroll-theme/).

### Hero — timeline GSAP portada

A animação central da página: o conteúdo desce e **se acopla ao dashboard**
conforme o scroll.

Está em `heroTimeline.js`, portado de GSAP ScrollTrigger para JS puro. O
original tinha a timeline num chunk minificado separado — não estava no HTML
salvo. Decodificar `index-f632a37ee0f5c695.js` foi o que revelou o mecanismo.

**Lição de método:** ausência de animação no markup salvo não prova ausência
de animação. Procure nos chunks.

### SteepAI

Três cards de benefício. Cada um usa um par de cor da paleta acima.

### LogosMarquee

Marquee contínuo →
[`recipes/marquee-seamless`](../../recipes/marquee-seamless/).

### Platform / SemanticPlatform

"A new kind of analytics platform" — revelação palavra a palavra com blur →
[`recipes/reveal-word-blur`](../../recipes/reveal-word-blur/).

**A frase tem quebra de linha forçada** no original. Deixar o texto fluir
livre muda o ritmo da revelação.

### Engage — abas com vídeo e troca automática

Cada aba tem seu próprio vídeo (não imagem). A troca acontece **sozinha**,
com uma barra de progresso.

**Armadilha do CSS Modules:** `@keyframes` tem o nome hasheado, então
`style={{ animation: "progressFill 15s" }}` inline **não faz nada**
silenciosamente. A animação precisa vir de uma classe do módulo.

### CustomerStory

Depoimento com retrato. Tipografia grande em Signifier.

### CtaSection

"Get started for free" — fecha com o par de botões.

### Footer

Rive animation (`@rive-app/react-canvas`).

---

## Rive

Painéis interativos via `@rive-app/react-canvas`, com artboards nomeados.
É a única dependência de animação além do GSAP portado.

---

## Pendências conhecidas

Registradas honestamente — não foram fechadas:

- camada de grão do hero não reproduzida
- largura do link do logo: 112px no original, não conferida
- `--text-heading-lg` deveria ser 64px no root
- nav fica ilegível sobre a faixa escura
- **Footer nunca foi medido** — construído por aproximação visual

---

## Método

O erro mais caro desta página foi **confiar na classe em vez do computed
style**. Os links do nav têm `text-xs` no markup, o que sugere 12px; o valor
real renderizado é 16px. Utilitário no HTML não é fonte de verdade — só o
`getComputedStyle` do navegador é.

O segundo foi **apagar conteúdo ao reescrever**: removi três cards de
benefício do SteepAI porque tinha capturado o screenshot de referência no
mesmo comando e nunca o abri. Capturar não é ver.

---

## Fontes

Signifier e Söhne são **proprietárias**. Estão aqui como peça de estudo,
mesma prática dos outros projetos. Não redistribua.
