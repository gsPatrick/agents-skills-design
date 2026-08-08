# edge-bleed-track

**Efeito** — um trilho horizontal mais largo que o container, que sangra para
fora da margem. O card seguinte fica cortado na borda, e esse corte é o
**único** indicador de que a lista continua.

**Fonte** — Superpower, `clinicians-1` e `social-proof-1`.

## Anatomia

```css
.container { max-width: 80rem; margin-inline: auto; }

.trilho {
  width: calc(50vw + 50%);   /* ← mais largo que o pai */
  overflow-x: auto;
  scrollbar-width: none;
  cursor: grab;
}
.trilho::-webkit-scrollbar { display: none; }

.card {
  flex-shrink: 0;
  border-right: .0625rem solid #18181b1a;   /* a divisória é DO CARD */
}
```

## Por que funciona

`calc(50vw + 50%)` = metade da viewport mais metade do container. O trilho
começa alinhado ao conteúdo e termina fora da margem direita — o excedente é
exatamente o que sobra até a borda da tela.

**Sem seta, sem bolinha, sem gradiente.** O corte no card seguinte já
comunica "há mais". Indicadores explícitos competem com o conteúdo.

**A divisória pertence ao card**, não ao trilho. Se estivesse no contêiner,
as linhas ficariam paradas enquanto os cards deslizam por baixo.

## Variação: alturas iguais, larguras livres

No `social-proof` os cards têm **quatro larguras** (15.625rem retrato, 20rem
split, 25rem citação) e **uma altura só** (26.25rem). É a altura constante que
costura a fita; a largura acompanha o que o conteúdo precisa — citação exige
linha de leitura maior que um retrato.

## Calibragem

| Valor | Efeito |
|---|---|
| `calc(50vw + 50%)` | quanto sangra. `50vw + 25%` sangra menos |
| `gap` 1–2rem | respiro entre cards |
| `border-right` a 10% | divisória perceptível sem virar grade |
| sombra `0 .0925rem .0925rem #00000005` | 5% de preto: não é para ver, é para o card não flutuar |

## Armadilhas

- A seção precisa de `overflow: hidden` ou `clip`, senão o sangramento cria
  scroll horizontal na página inteira.
- No mobile, `width: 100%` — sangrar numa tela estreita esconde conteúdo
  demais.
- `user-select: none` no trilho, senão arrastar seleciona texto.

## Reduced motion

Não aplicável — é layout, não movimento. Mas garanta que o trilho continue
rolável por teclado e por scroll nativo.
