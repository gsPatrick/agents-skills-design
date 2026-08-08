# Fundo de vídeo fixo com conteúdo passando por cima

**Efeito:** um vídeo ocupa a tela inteira e fica parado enquanto várias seções
de conteúdo rolam por cima dele. Não é `position: fixed` — o vídeo solta quando
a seção acaba.

**Fonte:** `projects/remake-integrated-biosciences/components/organisms/HeroExperience/HeroExperience.module.css`

---

## Anatomia

```
section.experience (position: relative)
  div.videoBg   ← sticky, top: 0, height: 100vh, z-index: 0
    ...vídeo
  div.overlay   ← margin-top: -100vh, z-index: 1
    hero
    <WhatWeDo />   ← outra seção inteira, também rola por cima
```

## O truque: `margin-top: -100vh`

Este é o pulo do gato e **não é óbvio**.

```css
.videoBg {
  position: sticky;
  top: 0;
  height: 100vh;
  z-index: 0;
}

.overlay {
  position: relative;
  z-index: 1;
  margin-top: -100vh;   /* ← puxa o conteúdo de volta pra cima do vídeo */
}
```

Por que: um elemento `sticky` **ocupa espaço no fluxo**. O `.videoBg` reserva
100vh de altura. Sem o `-100vh`, o conteúdo começaria 100vh abaixo — você rolaria
uma tela inteira de vídeo vazio antes de ver o título.

O `margin-top: -100vh` cancela exatamente essa reserva. O conteúdo começa no topo
do vídeo, e o vídeo continua grudado enquanto houver conteúdo rolando.

**Por que não `position: fixed`:** `fixed` sai do fluxo e nunca solta — o vídeo
ficaria atrás do rodapé até o fim da página. `sticky` para de grudar quando o
pai (`.experience`) termina, que é exatamente o comportamento certo.

## O contrato de z-index

| Camada | z-index | Papel |
|---|---|---|
| `.videoBg` | `0` | fundo |
| `.overlay` | `1` | conteúdo |

Ambos precisam de `position` (`sticky`/`relative`) para z-index funcionar.
O `.overlay` precisa de `z-index` explícito — sem ele, o `sticky` que veio
depois no DOM pinta por cima em alguns browsers.

## Extensão da pista

O vídeo fica preso pela altura de `.experience`, que é a soma dos filhos do
`.overlay`. Aqui: hero (`100vh`) + WhatWeDo (`300vh`) = 400vh de vídeo preso.

Para mais/menos tempo de vídeo, mude a altura do **conteúdo**, não do vídeo.

## Legibilidade sobre vídeo

```css
.video { opacity: 0.875; }
.canvas { background-color: var(--color-void); }
```

Sem gradiente de overlay. O vídeo é rebaixado a 87.5% sobre um fundo preto —
escurece o suficiente para texto branco sem a faixa cinza feia que um
`linear-gradient` produz.

## Armadilhas

- ❌ `overflow: hidden` em qualquer ancestral → `sticky` morre silenciosamente.
  É a causa nº1 de "o sticky não funciona". Use `overflow: clip` se precisar
  conter, ou `overflow: visible` a partir de `lg`.
- ❌ Esquecer `margin-top: -100vh` → tela de vídeo vazia antes do conteúdo
- ❌ `height: 100%` no `.videoBg` em vez de `100vh` → colapsa para zero
- ❌ Vídeo sem `object-fit: cover` → distorce fora do aspect ratio nativo
- ❌ Texto branco direto sobre vídeo claro sem rebaixar opacity → ilegível em
  certos frames

## Vídeo

Sempre: `autoPlay playsInline loop muted preload="auto"`.
Para iOS teimoso, ver [video-autoplay-ios](../video-autoplay-ios/).
