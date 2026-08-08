# Canvas proporcional em vw

**Não é um componente — é um sistema de dimensionamento** que governa uma página
inteira. O layout inteiro escala como uma única imagem: em qualquer largura de
tela, as proporções entre todos os elementos são idênticas.

**Fonte:** `projects/remake-summer-drive/` (a página inteira)
**Arquétipo:** Cinematic. Cartaz de evento, agência, moda, lançamento.

Este sistema **não estava documentado em lugar nenhum** e é a razão pela qual
Summer Drive parece um pôster impresso em vez de um site.

---

## A ideia

Todo valor de tamanho — fonte, padding, borda, raio — é expresso em `vw`,
derivado de uma prancheta fixa:

```
valor_vw = (px_no_design / largura_da_prancheta) × 100
```

| Design (1440px) | vw | Onde aparece |
|---|---|---|
| 2px | `0.139vw` | espessura de borda |
| 24px | `1.667vw` | padding pequeno |
| 35px | `2.431vw` | padding lateral da página |
| 18px | `1.25vw` | micro-label |
| 62px | `4.306vw` | número grande |
| 77px | `5.369vw` | data/hora do herói |
| 60px | `4.167vw` | raio de pílula |
| 910px | `63.194vw` | largura do vídeo central |

Confira: `35 / 1440 × 100 = 2.431`. ✅

## Prancheta mobile diferente

Abaixo de `800px` o sistema troca de prancheta para **375px**:

```
valor_vw = (px_no_design_mobile / 375) × 100
```

| Design (375px) | vw |
|---|---|
| 2px | `0.533vw` |
| 20px | `5.333vw` |
| 15px | `4vw` |
| 36px | `9.6vw` |

Confira: `20 / 375 × 100 = 5.333`. ✅

**Duas pranchetas, dois divisores.** Este é o ponto que mais confunde: o mesmo
elemento tem `0.139vw` de borda em desktop e `0.533vw` em mobile — não porque a
borda cresceu, mas porque a régua mudou.

```css
.hero { border-bottom: 0.139vw solid #006eff; }           /* 2px @ 1440 */
@media (max-width: 800px) {
  .hero { border-bottom: 0.533vw solid #006eff; }         /* 2px @ 375 */
}
```

## Por que isso e não `clamp()`

| | `clamp()` | Canvas vw |
|---|---|---|
| Escala | cada valor independente | tudo junto, travado |
| Resultado em 1920px | proporções mudam | idêntico a 1440, só maior |
| Controle | por elemento | por composição |
| Bom para | conteúdo, texto corrido | **tipografia como layout** |

Quando a tipografia **é** o design — um wordmark que preenche a largura, uma
data alinhada à margem — `clamp()` destrói a relação entre as peças. Em 1600px
o título para de crescer (bateu o teto) mas o padding continuou, e a composição
que você desenhou some.

Com vw puro, um monitor de 2560px mostra exatamente o seu design, ampliado.

## O custo (leia antes de adotar)

**Texto corrido em `vw` é ruim de ler.** Em 2560px, um parágrafo de `1.25vw`
vira 32px — grande demais. Em 1024px vira 12.8px — pequeno demais. Não há
mínimo nem máximo.

Por isso este sistema serve para páginas **de pôster**: título, data, um
parágrafo curto, uma chamada. Não use numa página com blog, documentação ou
formulários longos.

Se precisar misturar, isole: layout em vw, blocos de texto corrido em `rem` com
`max-width` em `ch`.

Sem teto, o design também estica sem limite. Se isso incomodar, envolva a página:
```css
.wrapper { max-width: 1920px; margin-inline: auto; }
```
Mas note que aí os `vw` continuam medindo a **viewport**, não o wrapper — você
precisaria de container queries (`cqw`) para o comportamento correto.

## A grade

```css
.hero, .fun, .marquee, .subtitle { grid-column: span 12; }
```

Grade de 12 colunas no wrapper da página; as seções declaram quantas ocupam.
Praticamente tudo usa `span 12` (largura total) — a grade existe para as
exceções, e para manter as gutters consistentes.

## Sangria

```css
.marquee {
  margin-left:  -2.083vw;    /* 30px @ 1440 */
  margin-right: -2.083vw;
}
```

Margem negativa em vw cancela o padding do container, também em vw. Os dois
escalam juntos e a sangria fica perfeita em qualquer largura. Com `px` contra
`vw` ela quebraria fora de 1440px.

## Conversão rápida

```
desktop:  px ÷ 14.4   = vw     (1440 / 100)
mobile:   px ÷ 3.75   = vw     (375 / 100)
```

`35 ÷ 14.4 = 2.431` ✅   `20 ÷ 3.75 = 5.333` ✅

## Checklist de adoção

- [ ] Prancheta definida e anotada no topo do `globals.css`
- [ ] **Zero** valores em `px` nos módulos de layout (auditar com grep)
- [ ] Breakpoint mobile troca **todos** os valores, não alguns
- [ ] Texto corrido isolado em `rem`, ou a página não tem texto corrido
- [ ] Testado em 1280, 1440, 1920, 2560 — a composição deve ser idêntica
- [ ] Testado em 375 e 800 — a segunda prancheta assume no ponto certo

## Armadilhas

- ❌ Misturar `px` e `vw` no mesmo eixo → quebra fora da prancheta
- ❌ Esquecer de reconverter um valor no breakpoint mobile → aquele elemento
  fica com a escala errada (o bug mais comum, e o mais difícil de ver)
- ❌ Texto corrido em `vw` → ilegível nos extremos
- ❌ Usar em página com muito conteúdo → veja o custo acima
- ❌ Prancheta não documentada → o próximo dev não consegue adicionar nada
