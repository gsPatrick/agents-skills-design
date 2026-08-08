# Intro: painel abrindo de um ponto central

**Efeito:** ao carregar a página, o herói se abre a partir de um pequeno
retângulo arredondado no centro da tela até ocupar tudo. Dura 2.2s, roda uma vez.

**Fonte:** `projects/remake-integrated-biosciences/components/organisms/HeroExperience/HeroExperience.module.css`

---

## O código

```css
.canvas {
  position: absolute;
  inset: 0;
  background-color: var(--color-void);
  animation: introPanel 2.2s cubic-bezier(0.16, 1, 0.3, 1) both;
}

@keyframes introPanel {
  from { clip-path: inset(48.5% 48.5% 48.5% 48.5% round 80px); }
  to   { clip-path: inset(0% 0% 0% 0% round 0px); }
}
```

## Por que 48.5% e não 50%

A `50%` de todos os lados o retângulo tem largura zero e **desaparece** — o
primeiro frame é uma tela preta vazia, e a animação parece começar do nada.

`48.5%` deixa uma fresta de 3% da viewport (≈40px de largura em desktop). Você
vê o ponto de origem, e a abertura tem de onde partir. Não desça abaixo de
`45%` ou o "ponto" já é grande demais para ser um ponto.

## Por que `clip-path` e não `scale`

`clip-path` **revela** o conteúdo já no tamanho final — o vídeo por baixo está
rodando em escala 1:1 desde o frame zero. Com `scale` o vídeo cresceria junto,
ficando borrado e mudando de enquadramento durante a animação.

Bônus: `clip-path` é composto na GPU, não dispara layout.

## O `round 80px`

Arredonda os cantos do recorte. A fresta inicial é um retângulo arredondado
(elegante), não um quadrado duro. Como o `to` é `round 0px`, o arredondamento
se dissolve durante a abertura — não precisa de keyframe intermediário.

## O `both`

```css
animation: introPanel 2.2s ease both;
                                 ^^^^
```

`animation-fill-mode: both` = aplica o estado `from` **antes** da animação
começar e mantém o `to` depois que acaba. Sem isso há um flash do conteúdo
completo no primeiro frame, antes da animação assumir.

## A sequência coreografada

O intro não é uma animação só — são três, escalonadas:

```css
.canvas  { animation: introPanel 2.2s ...  both; }        /* 0s    → 2.2s */
.heading { animation: introUp    1s   1.15s both; }       /* 1.15s → 2.15s */
.bottom  { animation: introUp    1s   1.4s  both; }       /* 1.4s  → 2.4s */
```

```css
@keyframes introUp {
  from { opacity: 0; transform: translateY(30px); }
  to   { opacity: 1; transform: translateY(0); }
}
```

O título entra **na metade** da abertura do painel (1.15s de 2.2s), não depois.
Isso encavala os movimentos e a sequência inteira parece 2.4s em vez de 4s.

**Regra:** o próximo elemento começa por volta de 50–60% do anterior. Esperar o
fim (`delay = 2.2s`) faz a página parecer lenta.

## Armadilhas

- ❌ `50%` no `from` → começa invisível
- ❌ Sem `both` → flash do conteúdo antes de animar
- ❌ Delays sequenciais sem sobreposição → intro arrastada
- ❌ Usar em algo abaixo da dobra → o usuário nunca vê. Só herói.

## Reduced motion

```css
@media (prefers-reduced-motion: reduce) {
  .canvas, .heading, .bottom { animation: none; }
}
```

Com `animation: none` o `both` some junto e os elementos ficam no estado
natural do CSS (visíveis). É por isso que os estados-base não podem ter
`opacity: 0`.
