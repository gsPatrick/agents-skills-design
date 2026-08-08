# Marquee sem costura

**Efeito:** faixa horizontal rolando infinitamente, sem salto perceptível no
ponto de emenda.

**Fontes:**
- Logos: `projects/remake-summer-drive/components/organisms/LogosMarquee/`
- Texto gigante: `projects/remake-integrated-biosciences/components/organisms/Marquee/`

Não precisa de JS. É CSS puro + uma duplicação no render.

---

## A regra única

```jsx
const items = [...LOGOS, ...LOGOS];   // renderiza a lista DUAS vezes
```

```css
@keyframes marquee {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}
```

**Duas cópias + `-50%`.** No fim da animação, a segunda cópia está exatamente
onde a primeira começou. O reset para `0` é invisível porque o pixel é idêntico.

Qualquer outra combinação salta:

| Cópias | Translate | Resultado |
|---|---|---|
| 2× | `-50%` | ✅ costura invisível |
| 1× | `-100%` | ❌ a faixa esvazia e reaparece |
| 3× | `-50%` | ❌ salta um terço |
| 3× | `-33.333%` | ✅ funciona, mas desperdiça DOM |

## Anatomia

```
section  ← overflow: hidden, define a altura
  slider ← position: relative, overflow: hidden
    track ← width: max-content, animation
      item[] ← flex: 0 0 auto (nunca encolher)
```

`width: max-content` no track é obrigatório. Sem isso o flex comprime os itens
para caber e a largura nunca passa de 100% — a animação roda mas nada se move.

`flex: 0 0 auto` nos itens: sem isso o flex os encolhe e a costura desalinha.

## As duas variantes

**Logos (Summer Drive)** — imagens, altura fixa:
```css
.slider { height: 14vw; overflow: hidden; }
.item   { width: 11.806vw; height: 6.944vw; padding: 0 10vw; }
.brand  { object-fit: contain; }
.track  { position: absolute; animation: marquee-horizontal 60s linear infinite; }
```

**Texto (Integrated Bio)** — palavras gigantes:
```css
.section { overflow: hidden; white-space: nowrap; }
.track   { display: inline-flex; width: max-content; animation: marquee 90s linear infinite; }
.item    { font-size: clamp(48px, 8vw, 111px); }
```

## Velocidade

`linear` **sempre**. Qualquer easing acelera e desacelera a cada ciclo, o que
denuncia o loop imediatamente.

| Conteúdo | Duração | Regra |
|---|---|---|
| ~16 logos | `60s` | ~3.75s por item |
| Texto gigante | `90s` | mais lento = mais premium |

Regra prática: **um item deve levar 3–5s para cruzar a tela**. Mais rápido
parece ansioso, mais lento parece travado. Ajuste a duração ao número de itens,
não o contrário.

## Altura consistente é obrigatória

Logos de alturas diferentes fazem o track pular verticalmente. Force dimensões
no item **e** use `object-fit: contain` na imagem:

```css
.item  { width: 11.806vw; height: 6.944vw; }
.brand { width: 11.806vw; height: 6.944vw; object-fit: contain; }
```

Logos devem ser SVG monocromático, mesma cor. Logos coloridos originais fazem a
faixa parecer uma lista de patrocinadores de feira.

## Sangria além do container

```css
.marquee {
  margin-left:  -2.083vw;   /* cancela o padding do container */
  margin-right: -2.083vw;
}
```

A faixa deve tocar as bordas da tela. Margem negativa do tamanho exato do
padding do pai — nunca `width: 100vw` (gera scroll horizontal por causa da
barra de rolagem).

## Armadilhas

- ❌ Uma cópia só → faixa esvazia
- ❌ Sem `width: max-content` → nada se move
- ❌ `ease` em vez de `linear` → o loop fica óbvio
- ❌ `width: 100vw` no slider → scroll horizontal
- ❌ Itens sem altura fixa → track pula
- ❌ `loading="lazy"` na segunda cópia → aparece buraco no primeiro loop
  (aceitável aqui porque as duas cópias estão no DOM desde o início e o
  browser carrega ambas antes de entrarem na viewport)

## Reduced motion

```css
@media (prefers-reduced-motion: reduce) {
  .track { animation: none; }
}
```

Mostra a primeira metade estática — como uma fileira de logos normal.
Aceitável, e é por isso que a lista precisa fazer sentido parada.
