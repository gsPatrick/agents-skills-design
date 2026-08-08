# reveal-width-two-layer

**Efeito** — uma fileira de itens entra em cena e **então** se desdobra, como
um leque abrindo. Duas animações independentes com timing deslocado.

**Fonte** — Seed, seção UGC ("Stories from scientists…").

## Anatomia

```css
/* 1. o trilho desliza — SEM atraso */
.trilho {
  transform: translateX(48px);
  transition: transform 0.6s cubic-bezier(0.75, 0, 0.25, 1);
}
.trilho.visivel { transform: translateX(0); }

/* 2. cada item abre em LARGURA — com 0.4s de atraso */
.item {
  width: 0;
  overflow: hidden;
  transition: width 0.6s cubic-bezier(0.75, 0, 0.25, 1) 0.4s;
}
.visivel .item { width: var(--w); }
```

Disparado por `IntersectionObserver` com `threshold: 0.15`.

## Por que funciona

A **largura** anima ancorada à esquerda, então os itens crescem para dentro
do espaço em vez de aparecer inteiros. Combinado com o `transform` do trilho,
a leitura é: o conjunto chega, depois revela o conteúdo.

Animar só a largura perde a entrada. Animar só o transform perde o desdobrar.

## Calibragem

**O atraso é FIXO para todos os itens, não escalonado por índice.** Isso é a
decisão central: com atraso fixo os itens abrem juntos (leque); escalonando
por índice vira cascata — outro efeito, mais comum e menos interessante.

A curva `cubic-bezier(0.75, 0, 0.25, 1)` é simétrica e agressiva nas duas
pontas: quase nada nos primeiros 25%, o meio dispara, freia forte no fim. É o
oposto do `ease-out` padrão — troca deliberada, use quando quiser que o
movimento tenha peso.

## Armadilhas

- **`width` não é acelerada por GPU.** Com muitos itens ou imagens pesadas,
  medir o custo. Aqui são 9 e roda liso.
- `width: 0` sem `overflow: hidden` deixa o conteúdo vazar.
- O contêiner precisa de largura **explícita por item** (`--w`), porque
  `width: auto` não anima.

## Reduced motion

```css
@media (prefers-reduced-motion: reduce) {
  .item, .trilho { width: var(--w); transform: none; transition: none; }
}
```
