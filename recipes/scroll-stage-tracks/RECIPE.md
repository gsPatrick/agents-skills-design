# scroll-stage-tracks

**Efeito** — um palco que gruda na tela enquanto o scroll troca 4 passos, com
várias trilhas (fundo, texto, FAQ, navegação) sincronizadas pelo mesmo índice
e animações que **invertem conforme a direção** da rolagem.

**Fonte** — Superpower, seção `howitworks`.

## Anatomia

A estrutura é o truque. Duas propriedades resolvem o essencial:

```css
.secao { height: 800vh; }        /* a pista */
.palco {
  position: sticky;
  top: 0.5rem;
  height: calc(100vh - 1rem);    /* o palco que não sai */
}
```

O índice vem do progresso dentro da pista:

```js
const r = sec.getBoundingClientRect();
const pista = r.height - window.innerHeight;
const p = Math.min(Math.max(-r.top / pista, 0), 0.9999);
const idx = Math.floor(p * PASSOS.length);
if (idx !== anterior.current) {
  setReverso(idx < anterior.current);   // ← a direção
  anterior.current = idx;
  setAtivo(idx);
}
```

## Por que funciona

**800vh ÷ 4 passos = 200vh cada.** Duas telas de rolagem por passo — tempo de
ler antes de trocar. Com 400vh (100vh por passo) a troca atropela a leitura.

**Pares de keyframes por direção:**

```css
@keyframes bg-enter          { from { transform: translateY(100%); }  to { …0 } }
@keyframes bg-enter-reverse  { from { transform: translateY(-100%); } to { …0 } }
```

Rolando para baixo o novo fundo entra por baixo; para cima, por cima. Sem o
par a animação contradiz o gesto.

**O fundo anterior NÃO fica parado** — desliza `−11rem` enquanto o novo entra.
Duas camadas em velocidades diferentes: é isso que dá profundidade. Com
`0 → 0` a troca vira corte seco.

**Atrasos escalonados entre trilhas:**

```
conteúdo sai    200ms
conteúdo entra  900ms, atraso 220ms
FAQ entra       900ms, atraso 290ms
```

A informação principal chega 70ms antes do detalhe.

## Calibragem

| Valor | Efeito |
|---|---|
| `800vh` / n passos | tempo de leitura por passo. 200vh é confortável |
| `top: .5rem` | folga do palco no topo |
| `−11rem` no prev | profundidade. 0 = corte seco; muito = o anterior some cedo |
| 600ms descendo / **800ms subindo** | voltar é mais lento, dá tempo de reconhecer |
| atraso 220 / 290ms | ordem de chegada das trilhas |

## Armadilhas

- **`@keyframes` num CSS Module tem que morar no próprio módulo.** O nome E a
  referência em `animation` são hasheados; keyframe no globals + uso no
  módulo = animação silenciosamente morta.
- **`autoPlay` só vale na montagem.** Se o vídeo do passo ativo tem que tocar,
  chame `play()` num efeito — e `currentTime = 0` antes, senão ao voltar ele
  está congelado no último quadro.
- `overflow` ≠ `visible` num ancestral desativa `position: sticky`.
- O gradiente sobre a mídia deve escurecer **só as bordas** onde há texto
  (`linear-gradient(90deg, #00000080, transparent 25% 75%, #00000080)`), não
  o centro da imagem.

## Reduced motion

```css
@media (prefers-reduced-motion: reduce) {
  .bg, .content, .faq { animation: none !important; transition: none !important; }
}
```

Os passos continuam trocando por scroll; só o movimento some.
