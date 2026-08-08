# Reveal: word blur

**Efeito:** cada palavra do título entra desfocada e sobe, uma depois da outra.
Leitura guiada — o olho segue a frase sendo escrita.

**Fonte:** `projects/remake-general-intelligence/components/atoms/WordReveal/WordReveal.js`
**Usado em:** Hero (GIC), títulos de seção editoriais.

---

## Anatomia

```
<Tag>                        ← display: inline (nunca block)
  <span.word>Palavra </span> ← inline-block, transition, delay = i * stagger
  <span.word>Palavra </span>
</Tag>
```

O componente quebra `text` em `split(" ")` e envolve cada palavra num `<span>`.
O espaço entre palavras é reinjetado como ` ` (nbsp) **dentro** do span,
não entre eles.

## Por que funciona

Três propriedades animam juntas — só blur fica borrado demais, só opacity fica
sem graça:

| Propriedade | de → para | Papel |
|---|---|---|
| `opacity` | `0` → `1` | presença |
| `filter` | `blur(5px)` → `blur(0)` | foco, dá a sensação "revelando" |
| `transform` | `translateY(10px)` → `0` | peso, direção |

Duração `0.6s` com `var(--ease-out)` = `cubic-bezier(0.16, 1, 0.3, 1)`.

**O `transitionDelay` só é aplicado quando `visible` é `true`.** Quando falso,
volta a `0ms`. Isso evita que a animação de saída (se o componente for
re-renderizado) fique escalonada e estranha.

## Os dois modos

```jsx
// Hero — dispara no mount, sem esperar scroll
<WordReveal as="h1" text="..." animateOnMount stagger={50} />

// Seção abaixo da dobra — dispara ao entrar na viewport
<WordReveal as="h2" text="..." />
```

`animateOnMount` usa `requestAnimationFrame` (não `setTimeout(0)`) para garantir
que o browser pintou o estado inicial antes de trocar — sem isso a transição é
pulada e o texto simplesmente aparece.

## Parâmetros

| Prop | Padrão | Efeito |
|---|---|---|
| `text` | — | string; quebrada por espaço |
| `as` | `"span"` | tag renderizada (`h1`, `h2`, `p`) |
| `stagger` | `60` | ms entre palavras. Hero usa `50` |
| `delay` | `0` | ms antes da primeira palavra |
| `animateOnMount` | `false` | `true` no hero, `false` no resto |

**Calibragem do stagger:** frase de 8 palavras × 60ms = 480ms de escalonamento
+ 600ms de transição = ~1.1s até completar. Acima de 80ms fica arrastado.
Abaixo de 40ms o efeito some (parece tudo junto).

## O IntersectionObserver

```js
{ threshold: 0.25, rootMargin: "0px 0px -10% 0px" }
```

Estes dois números são o que faz o timing parecer certo:

- `threshold: 0.25` — espera 25% do elemento visível. Com `0` dispara quando
  1px entra e a animação termina antes de você olhar.
- `rootMargin: "0px 0px -10% 0px"` — encolhe a borda de baixo da viewport em
  10%, atrasando o gatilho. Sem isso o reveal acontece no rodapé da tela, fora
  do foco de leitura.

`obs.disconnect()` no primeiro disparo — anima uma vez só, nunca ao subir.

## Armadilhas

- ❌ `.reveal { display: block }` → cada palavra vira linha própria.
  Tem que ser `inline`.
- ❌ `.word { display: inline }` → `transform` não aplica em elemento inline.
  Tem que ser `inline-block`.
- ❌ Espaço entre os spans no JSX (`{word}{" "}`) → o `inline-block` come o
  espaço no fim da linha ao quebrar. Use ` ` dentro do span.
- ❌ Sem `will-change` → em títulos grandes o blur repinta em CPU e engasga.
- ❌ Aplicar em parágrafo de corpo → 60 palavras × 60ms = 3.6s. Só título.

## Reduced motion

O componente não trata — trate no CSS que consome:

```css
@media (prefers-reduced-motion: reduce) {
  .word { transition: none; }
}
```

Opacidade final é `1` de qualquer forma, então o texto aparece normal.

## Dependência

Precisa de `--ease-out: cubic-bezier(0.16, 1, 0.3, 1)` no `:root`.
