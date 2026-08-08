# Anatomia — Integrated Biosciences

**Arquétipo:** Darkroom · **Original:** integratedbio.com
**Rota:** `/integrated-bio`

> Cinema de laboratório. Escuro, imersivo, um único destaque vivo.

Projeto de referência para **clínica, laboratório, saúde premium, arquitetura,
qualquer serviço técnico que precise parecer sério e caro**.

---

## Ordem das seções

```
NavBar             fixo, condensa em pílula fosca ao rolar
├─ HeroExperience  vídeo preso; moldura estoura para full-bleed
│  └─ WhatWeDo     3 declarações reveladas letra a letra (sobre o mesmo vídeo)
├─ Platform        rótulo mono | texto — assimétrico
├─ UspCards        3 cards, cada um de uma cor
├─ Marquee         "Rewriting the biology of aging" rolando
├─ Company         imagem | texto em duas colunas
└─ Newsroom        3 posts com tags
Footer             fora do wrapper de conteúdo
```

Arco: **impacto** (Hero) → **tese** (WhatWeDo) → **método** (Platform + Usp) →
**respiro** (Marquee) → **credibilidade** (Company) → **prova** (Newsroom).

---

## 1. HeroExperience + WhatWeDo ⭐

**São um componente só.** `WhatWeDo` é renderizado *dentro* do overlay do
`HeroExperience` — é isso que faz as duas seções compartilharem o mesmo vídeo
de fundo.

```
Camadas:    videoBg (sticky, z:0) · overlay (z:1, margin-top: -100vh)
Ancoragem:  vídeo sticky top:0 h:100vh · conteúdo passa por cima
Driver:     scrollY > 8 (moldura) + progresso da seção (WhatWeDo)
Pista:      hero 100vh + WhatWeDo 300vh = 400vh de vídeo preso
Estados:    moldura: 2 (inset/full) · WhatWeDo: 3 declarações × revelação contínua
Recipes:    sticky-video-backdrop + frame-expand-fullbleed + intro-clip-path
            + reveal-char-scroll
```

### O `margin-top: -100vh`

O valor mais importante do projeto, e o menos óbvio:

```css
.videoBg { position: sticky; top: 0; height: 100vh; z-index: 0; }
.overlay { position: relative; z-index: 1; margin-top: -100vh; }
```

Um elemento `sticky` **ocupa espaço no fluxo** — o `.videoBg` reserva 100vh.
Sem o `-100vh`, você rolaria uma tela inteira de vídeo vazio antes do título
aparecer. A margem negativa cancela exatamente essa reserva.

**Por que `sticky` e não `fixed`:** `fixed` nunca solta — o vídeo ficaria atrás
do rodapé até o fim da página. `sticky` para quando o pai termina.

### A coreografia de entrada

Três animações escalonadas, sobrepostas:

```css
.canvas  { animation: introPanel 2.2s ...  both; }   /* 0s    → 2.2s */
.heading { animation: introUp    1s  1.15s both; }   /* 1.15s → 2.15s */
.bottom  { animation: introUp    1s  1.4s  both; }   /* 1.4s  → 2.4s */
```

O título entra na **metade** da abertura do painel, não depois. Encavalar faz a
sequência inteira parecer 2.4s em vez de 4s. Regra: o próximo elemento começa
em ~50–60% do anterior.

O `clip-path` parte de `inset(48.5%)`, não `50%` — a `50%` o retângulo tem
largura zero e o primeiro frame é uma tela vazia.

### A moldura que estoura

```js
const onScroll = () => setExpanded(window.scrollY > 8);
```
```css
.frame          { inset: 12px; border-radius: 20px;
                  transition: inset .7s cubic-bezier(.16,1,.3,1), border-radius .7s ...; }
.frame.expanded { inset: 0; border-radius: 0; }
```

Anima `inset`, não `transform: scale` — `scale` esticaria o vídeo. Animar as
bordas recorta em vez de deformar.

**O `> 8` é o mesmo threshold do NavBar.** Os dois eventos disparam juntos e a
transição parece coreografada, não acidental. Se mudar um, mude o outro.

### WhatWeDo — a matemática de N estados

```js
const scrollable = rect.height - window.innerHeight;   // 300vh - 100vh = 200vh
const progress   = scrolled / scrollable;              // 0..1 global
const scaled = progress * count;                       // 0..3
const active = Math.min(count - 1, Math.floor(scaled)); // qual declaração
const local  = scaled - active;                         // 0..1 DENTRO dela
```

**O padrão mais reutilizável do repositório.** Serve para qualquer "N estados
dirigidos por scroll".

Caracteres apagados ficam em `opacity: 0.4`, não `0` — o parágrafo inteiro é
legível como bloco fantasma e as letras acendem dentro dele. Com `0`, o texto
cresceria da esquerda e o layout pareceria quebrado.

**`.char` é `inline`, nunca `inline-block`** — está comentado no próprio CSS.
`split("")` inclui os espaços, e um `inline-block` contendo só `" "` colapsa
para largura zero: a frase vira `Umafrasesemespaços`.

### Legibilidade sobre vídeo

```css
.video  { opacity: 0.875; }
.canvas { background-color: var(--color-void); }
```

Sem gradiente de overlay. O vídeo é rebaixado sobre preto — escurece o
suficiente para texto branco sem a faixa cinza feia de um `linear-gradient`.

---

## 2. Platform

```
Camadas:    sidebar (rótulo mono) | content (título + texto + botão)
Driver:     nenhum
```

Assimetria como estrutura: uma coluna estreita só com um rótulo mono em caixa
alta, uma coluna larga com o conteúdo. Não é um grid de 2 colunas iguais — é
uma margem anotada, como um livro técnico.

```jsx
<h3>Combining synthetic biology, chemistry, and AI into an{" "}
   <span className={styles.muted}>engine of discovery.</span></h3>
```

Metade do título em cor apagada. Cria hierarquia **dentro** de uma frase, sem
quebrar em duas linhas de tamanhos diferentes. Padrão barato e muito eficaz.

A classe utilitária `.mono-label` vem do `globals.css` — mono, caixa alta, 13px.
Aparece em Platform, Company, Newsroom e WhatWeDo, dando unidade.

---

## 3. UspCards

```
Camadas:    3 cards lado a lado
Driver:     nenhum
Variantes:  lime · ink · tissue
```

Três cards **de cores diferentes** (`lime`, `ink`, `tissue`), não três cards
iguais com ícone. A variação de cor faz cada um ter peso próprio.

Estrutura: `01.` numerado + ícone + título + texto. A numeração cria sequência
onde um grid comum sugeriria alternativas paralelas.

> Este é o mais próximo que o portfólio chega de um "grid de features". Note o
> que o salva: cores distintas, numeração, e **três** — não seis.

---

## 4. Marquee

```
Driver:     CSS animation, 90s linear infinite
Recipe:     recipes/marquee-seamless
```

Variante de texto: `"Rewriting the biology of aging – "` repetido 6 vezes em
`clamp(48px, 8vw, 111px)`.

```jsx
<span aria-hidden={i > 0}>   {/* só a primeira cópia é lida */}
```

Fundo bone-white entre duas seções escuras — a faixa também serve de respiro
visual. 90s é lento de propósito: a mensagem é uma declaração de missão, não um
ticker.

---

## 5. Company

```
Camadas:    figure (imagem) | content (título + 2 colunas de texto)
Driver:     nenhum
```

Título grande, depois o corpo em **duas colunas** — leitura editorial. As
publicações (`Nature`, `Cell`) em itálico funcionam como prova social sem virar
uma faixa de logos.

---

## 6. Newsroom

```
Camadas:    3 posts empilhados
Driver:     nenhum (hover apenas)
```

Cada post: tag com bolinha + data + título + chip de seta. Títulos longos e
completos, não truncados — em contexto científico o título **é** o conteúdo.

---

## Tokens

```css
--color-void:                 #000000;   /* canvas */
--color-bioluminescent-lime:  #cef79e;   /* destaque — SÓ em interativos */
--color-bone-white:           #f7f7f5;   /* seções claras */
--color-abyssal-ink:          #222f30;   /* pílulas, superfícies escuras */
--color-graphite:             #4d5757;   /* texto secundário */
--font-aspekta:      display + corpo (sans geométrica, peso 400 único)
--font-roboto-mono:  rótulos técnicos
```

**Um peso só de Aspekta (400).** Toda a hierarquia vem de tamanho e cor, nunca
de peso. É o que dá a sensação clínica.

**Lime só em elementos interativos** — nunca em fundo de seção, nunca em texto
corrido. É o único ponto vivo numa página preta.

---

## Escala tipográfica

```css
--text-hero:       158px   /* teto do token */
--text-display-xl: 111px
--text-display-lg: 89px
--text-body-lg:    22px
```

O herói **não usa** `clamp()`. Usa a fórmula fluida linear:

```css
font-size: max(3.125rem, min(calc(3.125rem + 0.062 * (100vw - 27.5rem)), 7rem));
/*         └─ 50px min                                              └─ 112px max */
```

Traduzindo: começa em 50px a 440px de viewport, cresce 0.062px por px de
viewport, trava em 112px. Dá controle exato do ponto de partida e da taxa de
crescimento — `clamp()` com `vw` só te dá a inclinação implícita.

**Nota:** o token `--text-hero: 158px` não é usado pelo herói. Vestígio da
extração inicial.

---

## Ritmo escuro ↔ claro

```
Hero + WhatWeDo   ESCURO (vídeo)
Platform          claro
UspCards          misto (3 cores)
Marquee           bone-white
Company           claro
Newsroom          claro
Footer            ESCURO
```

A alternância é o que evita monotonia. O bloco escuro de abertura é longo (400vh)
e imersivo; o corpo é claro e legível; o rodapé fecha voltando ao escuro.

---

## Limpeza pendente

- `--text-hero: 158px` não é usado
- Vídeo sem alternativa `prefers-reduced-motion` (deveria virar `<img poster>`)
- `BgVideo` não implementa o fallback de autoplay do iOS documentado em
  `recipes/video-autoplay-ios` — só `DriveVideo` (Summer Drive) tem
