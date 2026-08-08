# Anatomia — General Intelligence Company

**Arquétipo:** Editorial · **Original:** generalintelligencecompany.com
**Rota:** `/general-intelligence` · **Porta:** 3003

> Tech literário e quente. Parece que um livro de capa dura encontrou uma
> startup. Ilustrado à mão, não banco de imagens.

Este é o projeto de referência para **qualquer cliente de serviço**:
nutricionista, terapeuta, coach, clínica boutique, SaaS com personalidade.

---

## Ordem das seções

```
NavBar               fixo, tema muda por seção
├─ Hero              ilustração + card de vidro grudado
├─ StripeDividers    5 barras de gradiente — transição, não seção
├─ Vision            flor em pixel art + declaração revelada por palavra
├─ Coordinator       scrollytelling de 5 passos → entrega para o card
├─ BlogList          3 posts, entrada escalonada
├─ Footer            careers + navegação, fundo transparente
└─ FooterBackground  paisagem fixa revelada no fim
CookieBanner         fora do fluxo
```

Arco emocional: **chegar** (Hero) → **acreditar** (Vision) → **entender**
(Coordinator) → **comprovar** (BlogList) → **agir** (Footer careers).

---

## 1. Hero

```
Camadas:    imagem full-bleed → conteúdo → card de vidro (sticky)
Ancoragem:  .frame relativo · .stickyWrap sticky top:calc(100vh - 330px)
Driver:     tempo (WordReveal com animateOnMount) + hora do dia (useNYCTime)
Pista:      aspect-ratio 1553/1450, min-height 800px
Estados:    4 variantes de imagem (manhã/tarde/noite/madrugada)
Recipe:     recipes/glass-card-sticky-hero + recipes/reveal-word-blur
```

**A decisão que define o herói:** `aspect-ratio` em vez de `height: 100vh`.
A ilustração é uma composição desenhada — com `100vh` cada laptop recorta um
pedaço diferente e metade da cena se perde. Com aspect-ratio ela sempre aparece
inteira.

**O título é pequeno de propósito:** `clamp(16px, 2.4vw, 27px)`. Quebra a regra
de "herói = letra gigante" porque o peso visual vem da ilustração. Colocar 80px
de tipografia por cima competiria com a arte.

**A hora do dia** (`hooks/useNYCTime.js`) troca a imagem do herói e do rodapé
conforme o horário em Nova York, e move o ponteiro do relógio no canto. As 4
variantes são pré-carregadas com `<link rel="prefetch">` para a troca ser
instantânea.

**`font-feature-settings: "liga" 0` + `font-kerning: none`** no título: mantém a
largura das palavras estável durante o reveal. Com ligaduras, o espaçamento
muda conforme as palavras aparecem e o título "respira" de um jeito errado.

**Erro comum:** usar `height: 100vh` e reclamar que a ilustração está cortada.

---

## 2. StripeDividers

```
Camadas:    5 barras horizontais de cor sólida
Driver:     nenhum — estático
Recipe:     —
```

Não é uma seção, é **pontuação**. Cinco barras de cor sólida
(`#334444 → #cfd3cf`) separadas por linhas finas, formando um degradê em
degraus entre o herói escuro e o corpo claro.

Uma variante `footer` usa tons de água (`#CFEBE7 → #A0D7D1`) com `endWithWhite`.

**Por que existe:** o corte direto de uma foto escura para parchment é brusco.
As barras dão uma respiração de ~40px que faz a transição parecer intencional.
Custo: zero JS, zero imagem.

Padrão transferível: quando duas seções de contraste alto se encostam, coloque
uma faixa de transição em vez de aumentar o padding.

---

## 3. Vision

```
Camadas:    arte (PixelFlower) | texto — duas colunas
Driver:     IntersectionObserver (WordReveal com delay: 200)
Recipe:     recipes/reveal-word-blur
```

`data-navbar-theme="light"` — declara ao nav que o fundo aqui é claro.

Dois níveis de texto: um `<p>` de lead (estático, contexto) e um `<h2>` grande
com reveal por palavra. Só o segundo anima. Animar os dois transformaria a
seção num festival de texto se mexendo.

`delay: 200` dá um respiro depois da seção entrar em cena, antes das palavras
começarem.

**PixelFlower** (`components/molecules/PixelFlower/`) é uma flor em pixel art
desenhada a partir de dados de coordenadas (`pixelFlowerData.js`) — não é uma
imagem. Ilustração como código: escala sem perder nitidez e o pixel fica duro.

---

## 4. Coordinator ⭐

**A seção mais complexa do portfólio.** 192 linhas de JS, 311 de CSS.

```
Camadas:    stickyHead (título) · stickyPanel (passos) · cofounderWrap (card)
Ancoragem:  head sticky top:100px · panel sticky top:370px (lg)
Driver:     offset de scroll do container (getBoundingClientRect().top)
Pista:      min-height 3500px (mobile) / 5000px (lg)
Estados:    5 passos + 1 handoff contínuo (0..1)
Recipe:     recipes/scroll-step-handoff  ← LEIA ANTES DE MEXER
```

```js
const STEPS_DISTANCE = 3500;   // percorrer os 5 passos
const HANDOFF_START  = 2800;   // o card começa a subir
const HANDOFF_LENGTH = 1000;   // duração do handoff
```

**Por que 3500:** ~700px de scroll por passo, ~4 viewports de desktop. Abaixo de
2500 os passos passam rápido demais para ler o texto.

**Por que `HANDOFF_START` (2800) < `STEPS_DISTANCE` (3500):** os 700px de
sobreposição são o efeito. O card começa a subir enquanto o último passo ainda
está sendo lido — parece uma entrega, não duas animações em fila.

**O conteúdo dos passos** vem de `lib/coordinatorSteps.js`: 5 objetos com
`frameStart`/`frameEnd` (frames do Lottie), `title`, `figIndex`, `figTitle`,
`body[]`. Separar dados de apresentação é o que permite ajustar o texto sem
tocar na lógica de scroll.

**`CoordinatorDiagram`** é carregado com `dynamic(..., { ssr: false })` porque
usa `lottie-react`, que acessa `window`. Sem isso, o build de SSR quebra.

**Debounce de 300ms:** `activeStep` (o que o scroll diz) vs `displayStep` (o que
está na tela). O texto esmaece, troca durante o apagado, e reaparece. As barras
de progresso seguem `displayStep`, não `activeStep`.

**Erros que já quebraram esta seção:**
- `position: fixed` no elemento de handoff → duplica e pula para o canto esquerdo
- expandir o painel inteiro em vez de só o card → layout dos passos quebra
- `overflow: clip` no painel em desktop → o card de 800px é cortado
- barras de progresso lendo `activeStep` → dessincroniza do texto

---

## 5. BlogList

```
Camadas:    grid de 3 cards
Driver:     IntersectionObserver (threshold 0.2), delay escalonado por índice
Estados:    oculto → visível (uma vez só)
```

Observer na **seção**, não em cada card, e o escalonamento vem do índice. Três
observers separados dessincronizariam se os cards entrassem em ordem diferente.

Três posts, não seis. A seção de prova não é um arquivo.

---

## 6. Footer + FooterBackground ⭐

```
Camadas:    conteúdo do rodapé (transparente) · paisagem (fixed, z-index: -1)
Ancoragem:  FooterBackground é IRMÃO de .page, não filho
Driver:     nenhum — puro empilhamento
Recipe:     recipes/parallax-footer-reveal
```

O truque inteiro:

```css
.page { background-color: var(--color-parchment); }   /* a "folha" opaca */
.wrap { position: fixed; bottom: 0; z-index: -1; }    /* a paisagem atrás */
```

A paisagem está fixa no rodapé da viewport o tempo todo. O `.page` opaco a cobre.
Quando o conteúdo acaba, não há mais o que cobrir → a cena aparece.

**`FooterBackground` precisa ser irmão do `.page`.** Se estivesse dentro de um
elemento com `transform`, `filter` ou `opacity < 1`, esse elemento criaria um
contexto de empilhamento novo e o `z-index: -1` deixaria de escapar — a imagem
sumiria para sempre.

O `Footer` também repete o bloco de careers do `CareersCTA` — o organism
`CareersCTA` existe mas não está montado na página. **Código morto**, candidato a
limpeza.

---

## Tokens

```css
--color-parchment: #fefffc;   /* canvas — nunca #fff puro */
--color-graphite:  #2c2c2c;   /* tinta */
--color-fog:       #b4b8b4;   /* secundário — cor real, não opacity */
--color-cerulean:  #0081c0;   /* destaque — SÓ no card do Cofounder */
--font-ppmondwest: display (serifada)
--font-af:         corpo (sans)
```

**A cor de destaque aparece em uma superfície só** na página inteira: o card do
Cofounder. É essa disciplina que faz o card funcionar.

---

## Escala tipográfica

| Papel | Tamanho | Peso | Tracking |
|---|---|---|---|
| Título do herói | `clamp(16px, 2.4vw, 27px)` | 400 | `-0.04em` |
| Título de seção | `clamp(22px, 3.2vw, 48px)` | 500 | `-0.02em` |
| Título do card | `clamp(22px, 3vw, 40px)` | 500 | `-0.02em` |
| Corpo | `15px` | 500 | `-0.15px` |
| Legenda | `13px` | 500 | `-0.13px` |

Corpo em `15px`, não 16. Levemente menor que o padrão — sensação editorial,
mais texto por linha sem perder legibilidade.

---

## Dependências

`lottie-react` — só para o `CoordinatorDiagram`. Carregado dinamicamente,
não entra no bundle inicial.

## Limpeza pendente

- `CareersCTA` não está montado (duplicado dentro do `Footer`)
- `PixelFlower/flower-svg-snippet.txt` é rascunho, não código
- Vídeos/imagens sem alternativa para `prefers-reduced-motion`
