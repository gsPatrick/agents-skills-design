# scroll-horizontal-parallax

**Efeito** — uma fileira de cards desliza na horizontal conforme a página
rola na vertical, a **metade** da velocidade. Parar de rolar para o
movimento.

**Fonte** — Seed, seção UGC.

## Anatomia

**Dois elementos**, não um:

```jsx
<div ref={viewport} className={styles.viewport}>   {/* rola */}
  <div className={styles.grid}>                     {/* inline-grid */}
    {itens}
  </div>
</div>
```

```css
.viewport { overflow-x: auto; scrollbar-width: none; }
.viewport::-webkit-scrollbar { display: none; }
.grid { display: inline-grid; grid-auto-flow: column; }
```

```js
useEffect(() => {
  const sec = ref.current, t = viewport.current;
  let raf = 0;
  const aplicar = () => {
    raf = 0;
    const topo = sec.getBoundingClientRect().top;
    const avanco = Math.max(0, (552 - topo) * 0.5);
    t.scrollLeft = Math.min(avanco, t.scrollWidth - t.clientWidth);
  };
  const onScroll = () => { if (!raf) raf = requestAnimationFrame(aplicar); };
  window.addEventListener("scroll", onScroll, { passive: true });
  aplicar();
  return () => { window.removeEventListener("scroll", onScroll);
                 if (raf) cancelAnimationFrame(raf); };
}, []);
```

## Por que funciona

```
scrollLeft = max(0, (GATILHO − topoDaSeção) × FATOR)
```

Medido no original:

| topo da seção | scrollLeft |
|---|---|
| 552 | 0 |
| 282 | 135 |
| 12 | 270 |
| −238 | 395 |

De 552 a 12 a seção sobe 540 e o trilho anda 270 — exatamente 0.5×.

## Calibragem

| Valor | Efeito |
|---|---|
| gatilho 552 | onde começa. Maior = arranca mais cedo |
| fator 0.5 | velocidade relativa. 1.0 acompanha o scroll; 0.3 é sutil |
| `Math.max(0, …)` | impede scroll negativo antes do gatilho |
| `Math.min(…, sw − cw)` | trava no fim, evita ultrapassar |

## Armadilhas

- **Um `inline-grid` sozinho não rola.** Ele dimensiona pelo conteúdo, então
  `scrollWidth === clientWidth` e não há faixa. Precisa do viewport por fora
  com largura da tela.
- **`scrollLeft` não aparece em `getComputedStyle`.** Ao investigar uma
  página, varrer por `transform` não encontra este padrão — é preciso
  amostrar o valor em várias posições de scroll.
- Sem `requestAnimationFrame` o handler dispara dezenas de vezes por frame.
- `passive: true` no listener evita travar o scroll.

## Reduced motion

```js
if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
```

Sem parallax os cards ficam na posição inicial e o usuário rola manualmente.
