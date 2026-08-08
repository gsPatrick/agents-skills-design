# Scrollytelling com handoff para o próximo bloco

**Efeito:** um painel fica preso na tela, avança por N passos conforme você rola,
e no fim o conteúdo se dissolve enquanto um card sobe de baixo e assume a tela.
A transição entre "explicação" e "oferta" vira um movimento só.

**Fonte:** `projects/remake-general-intelligence/components/organisms/Coordinator/`
(192 linhas JS + 311 CSS — o componente mais complexo do portfólio)

---

## Anatomia

```
div.scrollContainer            ← referência do scroll (overflow: clip → visible em lg)
  section (min-height 3500px / 5000px em lg)   ← a pista
    div.stickyHead   (sticky, top: 100px)      ← título, esmaece no handoff
    div.stickyPanel  (sticky, top: 370px)      ← o painel preso
      div.panelRow   ← conteúdo do passo (fade + blur na saída)
        textCol   → barras de progresso + título + corpo
        diagramCol → diagrama + legenda "Fig. N"
      div.cofounderWrap  ← absolute bottom, sobe com translateY
        div.cofounderGradient  ← véu que cobre o conteúdo saindo
    div.scrollRunway (height: HANDOFF_START + HANDOFF_LENGTH)
```

## A matemática

```js
const STEPS_DISTANCE = 3500;   // px de scroll para percorrer os 5 passos
const HANDOFF_START  = 2800;   // px onde o card começa a subir
const HANDOFF_LENGTH = 1000;   // px de duração do handoff

const scrolled = Math.max(-container.getBoundingClientRect().top, 0);
const stepProgress = Math.min(scrolled / STEPS_DISTANCE, 1);
const handoff = Math.min(Math.max((scrolled - HANDOFF_START) / HANDOFF_LENGTH, 0), 1);
const step = Math.min(4, Math.floor(5 * stepProgress));
```

**`HANDOFF_START` (2800) é menor que `STEPS_DISTANCE` (3500) de propósito.**
O card começa a subir enquanto o último passo ainda está sendo lido. Os dois
movimentos se sobrepõem em 700px — é isso que faz parecer uma entrega, não duas
animações em fila.

`Math.max(-rect.top, 0)` — `rect.top` fica negativo conforme a seção sobe.
O `max(…, 0)` zera antes da seção entrar na tela.

## A regra do handoff: **um progresso, dois efeitos**

```js
const contentOpacity = 1 - handoffProgress;      // conteúdo some
const contentBlur    = handoffProgress * 6;      // e desfoca

// card sobe com o MESMO valor
transform: `translateY(${(1 - handoffProgress) * 100}%)`
```

Se você usar dois drivers separados (dois observers, duas durações) eles
dessincronizam em qualquer velocidade de scroll diferente da que você testou.
Um valor, derivado do scroll, alimentando os dois lados.

## Nunca use `position: fixed` no elemento do handoff

Este é o erro que quebra a seção. Trocar para `fixed` no meio do scroll:

- tira o elemento do fluxo → o painel colapsa e o conteúdo abaixo pula
- reposiciona relativo à viewport → o card salta para o canto superior esquerdo
  por um frame
- em alguns browsers, o elemento aparece duplicado durante a troca

A solução é `position: absolute` **dentro** do sticky, aplicada só durante o
handoff:

```css
.stickyPanelHandoff .panelRow {
  position: absolute;
  top: 0;
  left: 50%;
  width: 100%;
  max-width: 1080px;
  padding-inline: 20px;
  box-sizing: border-box;
  transform: translateX(-50%);
  pointer-events: none;
}
```

O `left: 50% + translateX(-50%)` mantém a coluna centralizada quando ela sai do
fluxo — sem isso ela cola na esquerda.

## Expandir só o card, nunca o painel

O card sobe e precisa ficar full-width. Se você expandir o `.stickyPanel`
inteiro, o conteúdo dos passos (que ainda está esmaecendo) reflui e o layout
pisca. Expanda só o wrapper que sobe:

```css
.stickyPanelHandoff .cofounderWrap {
  left: 50%;
  right: auto;
  width: calc(100vw - 64px);   /* casa com o padding-inline da section em lg */
}
```

```js
transform: `translateX(-50%) translateY(${(1 - handoff) * 100}%)`
```

O `translateX(-50%)` só entra **quando `handoff > 0`** — fora do handoff o
wrapper é `left: 0; right: 0` e não precisa recentralizar:

```js
transform: handoffProgress > 0
  ? `translateX(-50%) translateY(${(1 - handoffProgress) * 100}%)`
  : `translateY(${(1 - handoffProgress) * 100}%)`
```

Use `calc(100vw - Npx)`, nunca `100vw` puro — `100vw` inclui a barra de rolagem
e gera scroll horizontal.

## Aumentar o `min-height` do sticky durante o handoff

O card tem `min-height: 800px`; o painel tem `660px`. Sem ajuste, o card é
cortado:

```css
.stickyPanel        { min-height: 660px; }
.stickyPanelHandoff { min-height: 848px; }   /* 800 + padding */
```

E `overflow: visible` no painel a partir de `lg` — com `clip`/`hidden` o card
que ultrapassa é recortado.

## Esconder o conteúdo antigo no fim

```jsx
style={{
  opacity: contentOpacity,
  filter: `blur(${contentBlur}px)`,
  pointerEvents: handoffProgress > 0.4  ? "none"   : "auto",
  visibility:    handoffProgress > 0.92 ? "hidden" : "visible",
}}
```

- `pointerEvents: none` a **0.4** — o conteúdo já está meio transparente e não
  deve mais capturar cliques destinados ao card que sobe.
- `visibility: hidden` a **0.92**, não `1`. Em `opacity: 0.08` o texto ainda
  registra em subpixel sobre fundo claro e suja o card.

Não use `display: none` — quebraria o `position: absolute` e o elemento pularia.

## Debounce dos passos (300ms)

```js
useEffect(() => {
  if (activeStep === displayStep) return;
  pendingStepRef.current = activeStep;
  setFading(true);
  const t = setTimeout(() => {
    setDisplayStep(pendingStepRef.current);
    setFading(false);
  }, 300);
  return () => clearTimeout(t);
}, [activeStep, displayStep]);
```

Dois estados separados:
- `activeStep` — o que o scroll diz agora
- `displayStep` — o que está na tela

O texto esmaece (`copyHidden`: `opacity 0` + `blur(2px)`), **troca durante o
apagado**, e reaparece. Sem isso o texto trocaria no meio da leitura.

**As barras de progresso refletem `displayStep`, não `activeStep`** — senão a
barra pula antes do texto trocar.

O `pendingStepRef` guarda o passo mais recente: se o usuário rolar rápido por
3 passos em 300ms, mostra o último, não o intermediário.

## O gradiente de véu

```css
.cofounderGradient {
  position: absolute;
  top: -65%;
  height: 100%;
  background: linear-gradient(180deg,
    var(--color-parchment) 0%,
    rgba(254, 255, 252, 0.85) 35%,
    rgba(254, 255, 252, 0) 100%);
}
```

```jsx
style={{ opacity: handoffProgress * 0.6 }}
```

Sobe junto com o card, mascarando a borda entre "conteúdo saindo" e "card
entrando". O `top: -65%` faz o gradiente liderar o card. Teto de `0.6` de
opacidade — a 1.0 vira uma faixa sólida visível.

## Calibragem

| Constante | Padrão | Regra |
|---|---|---|
| `STEPS_DISTANCE` | `3500` | ~700px por passo. Menos de 500 passa rápido demais pra ler |
| `HANDOFF_START` | `2800` | `STEPS_DISTANCE − 700`. A sobreposição é o efeito |
| `HANDOFF_LENGTH` | `1000` | ~1 viewport. Menos de 600 fica abrupto |
| `min-height` da section | `3500` / `5000` (lg) | ≥ `HANDOFF_START + HANDOFF_LENGTH` + espaço do sticky |
| debounce | `300ms` | casa com a `transition` do `.copy` |

## Armadilhas

- ❌ `position: fixed` no handoff → duplica e pula pro canto
- ❌ `width: 100vw` no card → scroll horizontal
- ❌ Expandir o painel inteiro → layout dos passos quebra
- ❌ `overflow: clip` no painel em desktop → corta o card
- ❌ Barras de progresso lendo `activeStep` → dessincroniza do texto
- ❌ `display: none` no fim do fade → salto de layout
- ❌ Esquecer `min-height` maior no estado de handoff → card cortado

## Mobile

Abaixo de `1024px`:
- `overflow: hidden` + `min-height: calc(800px + 32px)` no estado de handoff
- `width: calc(100vw - 40px)` (padding menor)
- `.panelRow` vira `column-reverse` (diagrama acima do texto)

O padrão inteiro sobrevive em mobile, mas a pista é menor (`3500` vs `5000`).
