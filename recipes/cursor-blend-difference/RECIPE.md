# Cursor customizado com blend difference

**Efeito:** o cursor do sistema some e é substituído por uma imagem que segue o
ponteiro com leve atraso, invertendo a cor do que estiver embaixo.

**Fonte:** `projects/remake-summer-drive/components/organisms/Cursor/`

⚠️ Um por página, e só em páginas com personalidade forte. Cursor customizado
numa página de serviço parece amador.

---

## O atraso vem do CSS, não do JS

Correção importante: **não há lerp aqui.** O JS só escreve a posição a cada
`mousemove`; o arrasto vem de uma `transition` de CSS:

```js
el.style.transform =
  `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-15%, -25%)`;
```

```css
.cursor { transition: transform 0.2s ease; }
```

Cada `mousemove` define um novo alvo; o browser interpola por 0.2s. Como os
eventos chegam a ~60/s, a transição é constantemente reiniciada e o resultado é
um seguimento suave e atrasado — de graça, sem `requestAnimationFrame`.

É mais simples e mais barato que um loop de lerp em JS. Prefira esta versão.

## O offset de -15% / -25%

```js
translate(-15%, -25%)
```

Não é `-50%, -50%` (centro). A imagem do cursor tem uma ponta no canto superior
esquerdo, como uma seta — o "ponto quente" precisa cair sobre o pixel apontado.
Ajuste ao seu PNG: uma seta clássica fica perto de `-15%, -25%`; um ponto
circular usa `-50%, -50%`.

## `mix-blend-mode: difference`

```css
.wrapper {
  position: fixed;
  inset: 0;
  z-index: 100000;
  pointer-events: none;
  mix-blend-mode: difference;
}
```

O blend fica no **wrapper**, não no cursor. Isso inverte a cor contra qualquer
fundo — o cursor nunca some, seja sobre creme ou sobre vídeo escuro. É o que
elimina a necessidade de variantes claro/escuro.

`pointer-events: none` é obrigatório: sem ele o wrapper cobre a página inteira e
nada é clicável.

## Esconder o cursor nativo

```js
root.classList.add("cursorHidden");
```

```css
/* globals.css */
.cursorHidden, .cursorHidden * { cursor: none !important; }
```

Aplicado no `<html>` via JS, **não no CSS estático**. Se estivesse no CSS, um
usuário de touch (onde o componente não roda) ficaria sem cursor caso conectasse
um mouse depois. E o cleanup remove a classe ao desmontar.

O `*` é necessário porque links e botões têm `cursor: pointer` próprio, que
sobrepõe o `cursor: none` do pai.

## Só em ponteiro fino

```js
const fine = window.matchMedia("(pointer: fine)");
if (!fine.matches) return;
```

```css
@media (pointer: coarse) { .wrapper { display: none; } }
```

Defesa dupla — JS não anexa o listener, CSS esconde o elemento. Em touch não
existe posição de ponteiro; o cursor ficaria congelado em `0,0`.

## Começa invisível

```jsx
<div ref={dotRef} style={{ opacity: 0 }} />
```
```js
el.style.opacity = "1";   // no primeiro mousemove
```

Sem isso, o cursor aparece no canto superior esquerdo até o primeiro movimento
do mouse.

## Calibragem

| Valor | Padrão | Regra |
|---|---|---|
| `transition` | `0.2s ease` | acima de `0.35s` parece com defeito; abaixo de `0.1s` o atraso some |
| tamanho | `32px` | 24–40px. Maior atrapalha a leitura |
| `z-index` | `100000` | tem que ganhar de tudo, inclusive modais |
| `translate3d` | — | força camada de GPU. `translate` 2D repinta em CPU |

## Armadilhas

- ❌ `mix-blend-mode` no cursor em vez do wrapper → não blenda com a página
- ❌ Sem `pointer-events: none` → página inteira fica inclicável
- ❌ `cursor: none` só no `html`, sem o `*` → volta a seta sobre links
- ❌ Sem remover a classe no cleanup → sem cursor nenhum ao trocar de rota
- ❌ `left`/`top` em vez de `transform` → repinta layout a 60fps
- ❌ Rodar em touch → cursor fantasma parado no canto

## Reduced motion

```css
@media (prefers-reduced-motion: reduce) {
  .cursor { transition: none; }
}
```

O cursor ainda substitui o nativo, mas segue instantaneamente — sem arrasto.
