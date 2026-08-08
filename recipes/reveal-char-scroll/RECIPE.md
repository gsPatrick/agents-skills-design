# Reveal: caractere por caractere, dirigido por scroll

**Efeito:** a declaração acende letra por letra conforme você rola. Ao terminar,
troca para a próxima declaração. O scroll é a linha do tempo — parar de rolar
congela a animação no meio.

**Fonte:** `projects/remake-integrated-biosciences/components/organisms/WhatWeDo/WhatWeDo.js`

Diferença crítica para [reveal-word-blur](../reveal-word-blur/): ali o scroll é
só o **gatilho** e o tempo dirige. Aqui o scroll **é** o tempo.

---

## Anatomia

```
section (height: 300vh)          ← a pista de rolagem
  sticky (top: 0, height: 100vh) ← o que fica preso na tela
    head    → label "What we do"
    body
      progress → barra 1px, scaleX(progress)
      content  → grid [índice 1fr | declaração 2fr]
        main   → declarações empilhadas em absolute, cross-fade
```

`height: 300vh` na seção + `height: 100vh` no sticky = **200vh de rolagem útil**.
Essa é a conta que define a duração da animação.

## A matemática (o padrão `progress → active → local`)

```js
const rect = el.getBoundingClientRect();
const scrollable = rect.height - window.innerHeight;   // 300vh - 100vh = 200vh
const scrolled  = Math.min(Math.max(-rect.top, 0), scrollable);
const progress  = scrollable > 0 ? scrolled / scrollable : 0;   // 0..1 global

const scaled = progress * count;        // 0..3 com 3 declarações
const active = Math.min(count - 1, Math.floor(scaled));  // qual está ativa
const local  = scaled - active;         // 0..1 DENTRO da ativa
```

**Este é o padrão mais reutilizável do repositório.** Serve para qualquer
"N estados dirigidos por scroll": galeria, timeline, passos de produto.

- `progress` → a barra de progresso global
- `active` → qual conteúdo mostrar
- `local` → quanto da revelação interna já aconteceu

`Math.min(count - 1, ...)` impede `active === count` no último pixel, que
quebraria com `undefined`.

## A revelação por caractere

```js
const revealCount = isActive
  ? local * chars.length       // ativa: revela proporcional
  : si < active
  ? chars.length               // já passou: 100% aceso
  : 0;                         // ainda não chegou: apagado

style={{ opacity: i < revealCount ? 1 : 0.4 }}
```

Note: apagado é `0.4`, **não `0`**. O texto inteiro fica legível como um bloco
fantasma e as letras "acendem" dentro dele. Com `0` o parágrafo cresce da
esquerda e o layout parece quebrado.

## A armadilha do `inline-block` (documentada no próprio CSS)

```css
/* NOTE: keep chars as plain inline (not inline-block) — an inline-block
   span containing only a space collapses to zero width, eating the gaps
   between words. */
.char { transition: opacity 0.2s ease; }
```

`split("")` inclui os espaços. Um `<span style="display:inline-block">` contendo
só `" "` colapsa para largura zero e a frase vira `Umafrasesemespaços`.
Como só animamos `opacity` (não `transform`), `inline` funciona.

## Cross-fade entre declarações

Todas as declarações vivem em `position: absolute; top: 0` dentro de `.main`,
que tem `min-height` fixo. Só `opacity` alterna (`0.3s ease`). Nada de
`display: none` — isso mataria a transição.

O `min-height: clamp(220px, 42vh, 420px)` tem que caber a **declaração mais
longa**. Se não couber, o texto vaza por cima do que vem depois.

## Acessibilidade

```jsx
aria-hidden={!isActive}
```

Sem isso, leitor de tela lê as 3 declarações emendadas.

## Parâmetros de calibragem

| Valor | Padrão | Regra |
|---|---|---|
| `height` da seção | `300vh` | `100vh × (count + 1)`. 3 declarações → 300vh… ~400vh |
| `min-height` de `.main` | `clamp(220px, 42vh, 420px)` | altura da declaração mais longa no menor breakpoint |
| `transition` do `.char` | `0.2s` | curto. Longo demais borra o efeito de "acender" |
| opacidade apagada | `0.4` | entre `0.3` e `0.5`. Menor some, maior não contrasta |

**Regra da pista:** menos de `100vh` por estado e o usuário passa batido.
Mais de `150vh` por estado e parece travado.

## Armadilhas

- ❌ `overflow: hidden` num pai → mata o `position: sticky`
- ❌ Esquecer `resize` no listener → em rotação de tela a conta de `scrollable`
  fica velha e a animação desliza errado
- ❌ Rodar `getBoundingClientRect()` sem checar `el` → quebra no unmount
- ❌ Não chamar `onScroll()` uma vez no mount → estado inicial errado se a
  página carregar já rolada (F5 no meio)

## Reduced motion

Este é dirigido por scroll, não por tempo — tecnicamente não é "motion"
automática. Mas para quem tem sensibilidade vestibular, force o estado final:

```css
@media (prefers-reduced-motion: reduce) {
  .char { opacity: 1 !important; transition: none; }
}
```
