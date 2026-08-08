# Moldura que abre para full-bleed no primeiro scroll

**Efeito:** o vídeo/imagem começa como um cartão arredondado com margem, e ao
primeiro toque de scroll estoura para as bordas da tela. Diz "a experiência
começou" sem uma palavra.

**Fonte:** `projects/remake-integrated-biosciences/components/organisms/HeroExperience/`

---

## Anatomia

```jsx
const [expanded, setExpanded] = useState(false);

useEffect(() => {
  const onScroll = () => setExpanded(window.scrollY > 8);
  onScroll();                                    // estado certo se recarregar rolado
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  return () => { /* cleanup dos dois */ };
}, []);

<div className={`${styles.frame} ${expanded ? styles.expanded : ""}`}>
```

```css
.frame {
  position: absolute;
  inset: 12px;
  border-radius: 20px;
  overflow: hidden;
  will-change: inset, border-radius;
  transition: inset 0.7s cubic-bezier(0.16, 1, 0.3, 1),
              border-radius 0.7s cubic-bezier(0.16, 1, 0.3, 1);
}

.frame.expanded {
  inset: 0;
  border-radius: 0;
}
```

## Por que `inset` e não `transform: scale`

`scale` esticaria o vídeo junto — o conteúdo distorce e volta. Animar `inset`
move as **bordas** da moldura; o vídeo dentro (com `object-fit: cover`) é
recortado, não deformado. É a diferença entre abrir uma cortina e esticar a foto.

Custo: `inset` dispara layout a cada frame. Aceitável porque acontece **uma vez**
e por 0.7s. Não use este padrão para algo contínuo dirigido por scroll.

## Os números

| Valor | Padrão | Por quê |
|---|---|---|
| `inset` inicial | `12px` | margem fina. Acima de 24px vira "card", perde o efeito de moldura |
| `border-radius` inicial | `20px` | tem que ser visível a 12px de margem |
| `scrollY > 8` | `8` | 8px de tolerância. Com `> 0` dispara em qualquer microtremor de trackpad |
| duração | `0.7s` | rápido o bastante pra parecer resposta, lento pra ser notado |
| easing | `cubic-bezier(0.16, 1, 0.3, 1)` | desacelera forte no fim — sensação de "encaixe" |

## Sincronizar com o header

No projeto original, o logo do header vira branco **no mesmo threshold**
(`scrollY > 8`, ver [nav-morph-frosted](../nav-morph-frosted/)). Os dois eventos
acontecendo juntos fazem parecer uma transição só, coreografada.

Use o mesmo número nos dois componentes. Se divergirem, o olho percebe.

## Armadilhas

- ❌ `transition: all` → anima `opacity`, `background`, tudo. Liste as duas
  propriedades explicitamente.
- ❌ Sem `overflow: hidden` no `.frame` → o `border-radius` não recorta o vídeo
- ❌ Sem `onScroll()` no mount → F5 no meio da página mostra a moldura encolhida
  e ela só abre quando você rola de novo
- ❌ Threshold alto (`> 100`) → o usuário rola e nada acontece por um tempo;
  parece travado

## Reduced motion

```css
@media (prefers-reduced-motion: reduce) {
  .frame { transition: none; }
}
```

O estado final ainda é aplicado — só instantâneo, sem a animação.
