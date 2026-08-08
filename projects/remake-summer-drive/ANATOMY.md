# Anatomia — The Summer Drive

**Arquétipo:** Cinematic · **Original:** thesummerdrive.com
**Rotas:** `/summer-drive` · `/outrun` (jogo)

> Uma cor. Um par de fontes. Zero decoração. Energia de cartaz de evento.

Projeto de referência para **evento, lançamento, agência criativa, portfólio,
moda, música** — qualquer página onde a tipografia é o design.

---

## Ordem das seções

```
SmoothScroll         sem render — sequestra a roda do mouse
main.wrapper         grid de 12 colunas, padding em vw
├─ Hero              wordmark SVG largura total + data/hora + régua azul
├─ FlankingCTA       [CTA] [vídeo] [CTA]
├─ AmenitiesBar      Dinner · Drinks · DJ · Dunk Tank
├─ Story             3 parágrafos, centralizados
└─ LogosMarquee      16 logos rolando
DunkTankSchedule     fora do wrapper — tabela de horários
Cursor               cursor customizado com blend difference
```

Arco: **anunciar** (Hero) → **convidar** (FlankingCTA) → **prometer**
(Amenities) → **explicar** (Story) → **provar** (Logos) → **detalhar**
(Schedule).

Nenhuma animação dirigida por scroll. **A página inteira é composição**,
não narrativa.

---

## O sistema: canvas proporcional em vw ⭐

**A decisão que define este projeto**, e a que não estava documentada em lugar
nenhum antes.

Todo valor de tamanho — fonte, padding, borda, raio, largura de vídeo — é
expresso em `vw`, derivado de uma prancheta fixa de **1440px**:

```
valor_vw = (px_no_design / 1440) × 100      →      px ÷ 14.4 = vw
```

| Design | vw | Onde |
|---|---|---|
| 2px | `0.139vw` | espessura da régua azul |
| 24px | `1.667vw` | padding do herói |
| 30px | `2.083vw` | gutter da grade |
| 35px | `2.431vw` | padding lateral da página |
| 18px | `1.25vw` | micro-rótulo |
| 62px | `4.306vw` | número do FlankingCTA |
| 77px | `5.369vw` | data / hora |
| 910px | `63.194vw` | largura do vídeo central |

Abaixo de **800px** o sistema troca para uma prancheta de **375px**:

```
valor_vw = (px_no_design_mobile / 375) × 100      →      px ÷ 3.75 = vw
```

```css
.hero { border-bottom: 0.139vw solid #006eff; }            /* 2px @ 1440 */
@media (max-width: 800px) {
  .hero { border-bottom: 0.533vw solid #006eff; }          /* 2px @ 375 */
}
```

**Duas pranchetas, dois divisores.** É o ponto que mais confunde: o mesmo
elemento tem `0.139vw` em desktop e `0.533vw` em mobile — a borda não cresceu,
a régua mudou.

### Por que não `clamp()`

Quando a tipografia **é** o layout — um wordmark preenchendo a largura, uma data
ancorada na margem — `clamp()` destrói a relação entre as peças. Em 1600px o
título trava no teto mas o padding continua crescendo, e a composição que você
desenhou desaparece.

Com vw puro, um monitor de 2560px mostra exatamente o seu design, ampliado.

### O custo

Texto corrido em vw é ruim de ler: em 2560px um parágrafo de `1.25vw` vira 32px;
em 1024px vira 12.8px. Este sistema só serve para páginas de **pôster** — título,
data, um parágrafo curto. Não use em página com blog ou formulários.

Ver `recipes/vw-proportional-canvas` para a tabela de conversão e o checklist.

### O bug mais fácil de introduzir

Esquecer de reconverter **um** valor no breakpoint mobile. Aquele elemento fica
com a escala errada, e é quase invisível numa revisão rápida.

---

## 1. Hero

```
Camadas:    wordmark SVG · data (abs esquerda) · hora (abs direita) · régua
Driver:     nenhum
Recipe:     recipes/wordmark-svg-fullwidth
```

```
DATE                                                    TIME
06.24.21   ████ THE SUMMER DRIVE ████                5–10 PM
──────────────────────────────────────────────────────────── ← régua azul
```

**Wordmark como path SVG, não texto.** `width: 100%` + `viewBox` preenche a
largura exatamente, em qualquer tela, sem JS e sem layout shift. Com texto real
você dependeria da fonte carregar e da métrica bater.

Trade-off: não é selecionável nem indexável. Por isso `role="img"` +
`aria-label` são **obrigatórios**.

**Dois SVGs, não um responsivo:** desktop `1380×246` (uma linha, ~5.6:1),
mobile `337×127` (três linhas, ~2.6:1). Não é a mesma arte escalada — é outra
composição. A versão mobile leva `aria-hidden="true"` para a marca não ser lida
duas vezes.

Data e hora em `position: absolute` ancoradas em `2.431vw` das bordas — o mesmo
valor do padding da página. É o alinhamento com a margem que faz parecer cartaz.

O wordmark é um `<Link href="/outrun">` — clicar abre o jogo.

---

## 2. FlankingCTA

```
Camadas:    [coluna CTA] [vídeo 63vw] [coluna CTA]
Driver:     nenhum
Recipe:     recipes/video-autoplay-ios
```

Simetria com o visual no centro. As duas colunas laterais têm a mesma estrutura
(rótulo pequeno + valor grande + botão outline) e conteúdos diferentes.

```css
.driveOn video { width: 63.194vw; transform: scale(1.2); }
```

O `scale(1.2)` recorta as bordas do vídeo — o carro preenche o quadro sem letterbox.

Botões com `border: 0.139vw` e `border-radius: 4.167vw` (60px) — pílula outline
na cor de destaque, invertendo no hover. Um único estilo de botão em toda a
página.

**Em mobile a coluna direita some** (`display: none`). Duas CTAs empilhadas
seriam redundantes.

`DriveVideo` é o componente com a defesa completa de autoplay do iOS — a
propriedade `muted` forçada em JS, `.play()` com `.catch()`, e fallback na
primeira interação. Ver a recipe: é o motivo nº1 de "o vídeo não roda no iPhone".

---

## 3. AmenitiesBar

```jsx
<section className={styles.what}>
  <p>Dinner</p><p>Drinks</p><p>DJ</p><p>Dunk Tank</p>
</section>
```

Quatro palavras. É a seção inteira.

**Vale estudar:** um briefing normal viraria quatro cards com ícone, título e
descrição. Aqui são quatro substantivos em tipografia grande. A confiança de não
explicar é o que faz parecer sênior.

---

## 4. Story

Três parágrafos centralizados sob um `<h3>`. Sem animação, sem imagem.
O respiro entre as seções de tipografia pesada.

---

## 5. LogosMarquee

```
Driver:     CSS animation, 60s linear infinite
Recipe:     recipes/marquee-seamless
```

```jsx
const items = [...LOGOS, ...LOGOS];   // duas cópias
```
```css
@keyframes marquee-horizontal { 0% { transform: translateX(0); }
                              100% { transform: translateX(-50%); } }
```

**Duas cópias + `-50%`** = a costura é invisível porque o pixel final é idêntico
ao inicial. 16 logos em SVG monocromático, dimensões forçadas
(`11.806vw × 6.944vw`) com `object-fit: contain` para o track não pular.

Margem negativa de `-2.083vw` nas laterais cancela o padding do wrapper — a
faixa toca as bordas sem usar `100vw`.

---

## 6. DunkTankSchedule

Renderizado **fora** do `main.wrapper` — não participa da grade de 12 colunas.
Tabela de 12 linhas (nome / empresa / horário).

Detalhe de conteúdo: `"Sean Lane in a Tuxedo"`. O tom da página está no texto,
não em decoração visual.

---

## 7. Cursor

```
Recipe:     recipes/cursor-blend-difference
```

**Correção importante:** não há lerp em JS. O JS escreve a posição a cada
`mousemove`; o arrasto vem de `transition: transform 0.2s ease` no CSS. Mais
simples e mais barato que um loop de rAF.

```css
.wrapper { position: fixed; inset: 0; z-index: 100000;
           pointer-events: none; mix-blend-mode: difference; }
```

O blend fica no **wrapper**, não no cursor — inverte contra qualquer fundo, então
não precisa de variante clara/escura.

Offset `translate(-15%, -25%)`, não `-50%,-50%`: a imagem tem uma ponta no canto
superior esquerdo e o ponto quente precisa cair no pixel apontado.

Desligado em `(pointer: coarse)` por JS **e** por CSS.

---

## 8. SmoothScroll

```
Recipe:     recipes/smooth-scroll-lerp
```

**Correção importante:** `ease = 0.14`, não 0.08. Abaixo de 0.10 a página fica
escorregadia e usuários relatam enjoo.

Os dois detalhes que separam um smooth scroll aceitável de um insuportável:

```js
// 1. condição de parada — senão o rAF roda para sempre
if (Math.abs(diff) < 0.5) { current = target; running = false; return; }

// 2. cap de lead — senão o momentum de trackpad faz a página derivar 3–5s
const lead = window.innerHeight;
target = Math.min(Math.max(target, current - lead), current + lead);
```

Desligado em touch e em `prefers-reduced-motion`.

---

## Rota /outrun

`components/organisms/OutrunGame/` — 187 linhas de componente + **761 de engine**.

Um racer pseudo-3D completo: projeção de estrada por segmentos, curvas, colinas,
sprites de tráfego, névoa exponencial, colisão, HUD com vidas e relógio.

> **Atribuição:** port do `javascript-racer` de Jake Gordon
> (codeincomplete.com, MIT), adaptado para sprites individuais + fundo
> panorâmico, mais os ganchos de HUD do Summer Drive.

Não é uma recipe — é um easter egg, alcançado clicando no wordmark. Vale como
lembrete de que uma landing page pode ter uma recompensa escondida.

---

## Tokens

```css
--color-cream:         #fff8f1;   /* canvas */
--color-voltage-blue:  #006eff;   /* ÚNICO destaque */
--color-ink:           #000000;
--font-editorial-new:      display (serifada ultralight)
--font-founders-grotesk:   corpo (grotesk)
```

**Duas cores.** Creme e azul. O preto quase não aparece — até o texto de corpo é
azul (`color: #006eff` no `.wrapper`).

Essa é a lição: a página inteira em uma cor de destaque funciona *se* essa cor
for a identidade. Não é "usar o destaque com moderação" — é comprometimento
total com uma escolha.

---

## Par tipográfico

| Papel | Fonte | Exemplo |
|---|---|---|
| Micro-rótulo | Founders Grotesk, caixa alta | `1.25vw` "DATE" |
| Valor grande | Editorial New ultralight | `5.369vw` "06.24.21" |
| Corpo | Founders Grotesk Light | `2.639vw` |

Razão de ~4.3× entre rótulo e valor. `line-height: 95%` nos títulos — abaixo de
100% para linhas grandes não abrirem buraco.

---

## Limpeza pendente

- Sem `.gitignore` próprio (os outros dois projetos têm)
- Botões de "Tickets" com `tabIndex={-1}` e sem `href` — inacessíveis por
  teclado. Aceitável num arquivo de evento passado, mas não copie o padrão.
- `AmenitiesBar` e `Story` sem `id` para âncoras
- Vídeo sem alternativa `prefers-reduced-motion`
