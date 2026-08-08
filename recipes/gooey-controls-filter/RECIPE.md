# gooey-controls-filter

**Efeito** — duas ou mais formas arredondadas que **derretem uma na outra**
quando se aproximam, em vez de se sobrepor com um vão visível. Efeito
metaball.

**Fonte** — Seed, barra de controles do carrossel de reviews.

## Anatomia

Um filtro SVG com três etapas, aplicado no **contêiner** das formas:

```html
<svg style="display:none">
  <defs>
    <filter id="gooey">
      <feGaussianBlur in="SourceGraphic" stdDeviation="7" result="blur" />
      <feColorMatrix in="blur" mode="matrix"
        values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -11"
        result="gooey" />
      <feComposite in="SourceGraphic" in2="gooey" />
    </filter>
  </defs>
</svg>
```

```css
.barra {
  display: flex;
  gap: 4px;
  filter: url(#gooey);
}
```

## Por que funciona

O `feGaussianBlur` espalha as bordas até as formas vizinhas se tocarem no
gradiente. O `feColorMatrix` mexe **só no canal alfa** — a última linha
`0 0 0 19 -11` multiplica o alfa por 19 e subtrai 11, o que transforma o
degradê difuso num corte quase binário. Onde duas formas se aproximaram o
suficiente, o alfa somado passa do limiar e vira **um contorno único**.

O `feComposite` devolve o gráfico original por cima, para o conteúdo (texto,
ícones) não sair borrado.

## Calibragem

| Valor | Efeito |
|---|---|
| `stdDeviation` 7 | raio da fusão. Maior = formas se atraem de mais longe |
| alfa `19` | dureza da borda. Menor = contorno mais macio |
| alfa `−11` | limiar. Mais negativo = precisa de mais proximidade para fundir |
| `gap` 4px | distância entre as formas — é o que decide se fundem |

A relação entre `stdDeviation` e `gap` é o que importa: com gap maior que
~1.5× o desvio, as formas param de se tocar.

## Armadilhas

- **O filtro vai no contêiner**, não em cada forma. Aplicado individualmente
  cada uma borra sozinha e nada funde.
- **Texto dentro fica borrado** se o `feComposite` for omitido.
- `backdrop-filter` nos filhos **não sobrevive** ao filtro do pai — se
  precisar de vidro fosco junto, use cor sólida.
- O `<svg>` das `<defs>` precisa estar no DOM (`display: none` serve), não
  num arquivo externo.

## Reduced motion

Não aplicável — é forma, não movimento.
