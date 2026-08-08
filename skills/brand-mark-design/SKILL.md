---
name: brand-mark-design
description: >-
  Cria a marca (símbolo + wordmark) de um produto como SVG inline geométrico,
  no padrão dos projetos do Patrick. Use ao montar qualquer landing page, SaaS
  ou app que ainda não tenha logo — inclusive sem o usuário pedir. NÃO use em
  clones pixel-perfect, onde a marca deve ser extraída do original.
disable-model-invocation: false
---

# Brand Mark Design

Todo produto sem marca definida ganha uma. Não espere o pedido — uma landing
com um retângulo cinza escrito "LOGO" no header é um trabalho pela metade.

Mas a decisão vem antes do desenho.

## Passo 0 — Inventar ou extrair?

| Contexto | O que fazer |
|---|---|
| Produto novo, SaaS próprio, cliente sem identidade | **Desenhe.** É o caso normal. |
| Clone pixel-perfect de um site existente | **Extraia** o SVG do original. Desenhar aqui é bug. |
| Cliente tem marca, mas você não recebeu o arquivo | **Peça.** Não improvise por cima de uma identidade existente. |

Já aconteceu de eu desenhar uma marca inteira num clone que exigia fidelidade
absoluta. O símbolo ficou bonito e estava errado. Extrair leva 30 segundos:

```js
// no console do site original
document.querySelector('nav svg').outerHTML
```

Guarde o `viewBox` e troque os `fill` por `currentColor`.

---

## A anatomia

A marca é **símbolo + wordmark**, componente único, nunca imagem importada.

```
components/atoms/BrandMark/
  BrandMark.js
  BrandMark.module.css
public/
  <marca>.svg              vetorial, cores literais
  <marca>.png  @2x         fundo transparente
  <marca>-transparente.png variante para fundo escuro
```

## O símbolo: primitivas geométricas, 2–3 formas

Não desenhe ilustração. Não desenhe metáfora literal (uma xícara para um chá,
um cifrão para um banco). Componha **primitivas concêntricas**.

**Closer.IA** — squircle com centro vazado. Duas formas:
```jsx
<rect x="14" y="14" width="100" height="100" rx="30" />
<circle cx="64" cy="64" r="26" />
```

**Eterniza** — íris de três anéis. Três formas:
```jsx
<circle cx="12" cy="12" r="9.2" stroke="currentColor" strokeWidth="1.5" />
<circle cx="12" cy="12" r="4.6" stroke="currentColor" strokeWidth="1.5" />
<circle cx="12" cy="12" r="1.4" fill="currentColor" />
```

Regras que os dois respeitam:

- **`viewBox` quadrado** (`0 0 24 24`, `0 0 128 128`, `0 0 512 512`)
- **Centro geométrico exato** — tudo em `cx = cy = viewBox/2`
- **Duas ou três formas.** Quatro já vira desenho.
- **Um peso de traço só** por marca (`1.5` em 24px, `22`–`30` em 512px)
- **Contorno ou preenchimento, não os dois** na mesma forma
- **Zero gradiente, zero sombra, zero rotação**

A força vem da relação entre os raios, não da quantidade de detalhe. Em
Eterniza: `9.2 → 4.6 → 1.4`, cada anel com ~metade do anterior. Essa progressão
é o que faz a marca parecer projetada em vez de montada.

## Cor: nunca literal no componente

Duas formas válidas, ambas em uso:

**`currentColor`** — a marca herda a cor do texto. É o padrão quando ela
precisa inverter em faixas claras e escuras sem um segundo arquivo.

```jsx
<circle stroke="currentColor" strokeWidth="1.5" />
```

**Custom properties** — quando as partes têm cores independentes:

```css
.frame { fill: var(--bm-frame, #f2f4f7); }
.hole  { fill: var(--bm-hole,  #0e0e0e); }
```

O fallback no `var()` importa: a marca continua correta se alguém montar o
componente fora do tema.

## Tamanho: `1em`, não px

```css
.root {
  display: block;
  flex-shrink: 0;
  width: 1em;
  height: 1em;
  overflow: visible;
}
```

A marca escala com o `font-size` do contexto. Um `size` em px fixo obriga a
ajustar em cada lugar de uso; com `1em` o header, o rodapé e o favicon herdam
automaticamente. `flex-shrink: 0` impede o achatamento em flex apertado;
`overflow: visible` deixa traços que passam do viewBox respirarem.

## O wordmark: `lead` + `tail`

O nome se divide em duas partes com ênfases diferentes — é o que dá hierarquia
sem precisar de duas fontes.

```jsx
<span className={styles.word}>
  {lead}<em>{tail}</em>
</span>
```

`Eterniza` + `Gestão` · `Closer` + `.IA`. O `<em>` recebe peso ou cor
diferente no CSS, nunca itálico automático.

Torne `lead`/`tail` props com fallback para o tema. Em produto multi-tenant é
isso que permite a marca do cliente aparecer sem trocar o componente.

## Acessibilidade

```jsx
role={title ? 'img' : undefined}
aria-hidden={title ? undefined : true}
focusable="false"
{title ? <title>{title}</title> : null}
```

O símbolo sozinho é `role="img"` com `<title>`. Acompanhado do wordmark em
texto, é `aria-hidden` — senão o leitor de tela anuncia a marca duas vezes.
`focusable="false"` evita que o IE/Edge legado coloque o SVG na ordem de foco.

## Props do componente

| Prop | Para quê |
|---|---|
| `size` | `sm`/`md`/`lg` como classe, ou número em px quando preciso |
| `tone` | `dark`/`light` — a variante para o fundo |
| `href` | quando presente, a marca vira `<Link>` com `aria-label` próprio |
| `title` | ativa `role="img"`; ausente = decorativa |
| `brand` | força `{lead, tail}` por cima do tema (multi-tenant) |

## Exportação

Sempre gere os arquivos, não só o componente:

```
<marca>.svg                  vetorial, cores literais (não currentColor)
<marca>.png                  1x, fundo transparente
<marca>@2x.png               2x
<marca>-transparente.png     variante clara para fundo escuro
```

O `.svg` exportado precisa de cores literais — `currentColor` fora de um
documento HTML renderiza preto. E de `role="img"` + `aria-label` próprios.

Para gerar os PNG sem dependência de design tool: renderize o SVG numa página
em branco com Puppeteer e capture com `omitBackground: true`.

## Checklist

- [ ] É clone pixel-perfect? Então extraia, não desenhe
- [ ] `viewBox` quadrado, composição centrada no meio exato
- [ ] 2–3 primitivas, um peso de traço só
- [ ] Progressão de raios com razão clara (~½ entre níveis)
- [ ] Cor via `currentColor` ou custom property com fallback
- [ ] `width/height: 1em` + `flex-shrink: 0`
- [ ] Wordmark dividido em `lead` + `tail`
- [ ] `role="img"` sozinho / `aria-hidden` com wordmark
- [ ] SVG + PNG @1x @2x + variante transparente em `public/`
- [ ] Testada em 16px (favicon) e 96px (rodapé) — se some ou embola, simplifique

## Anti-padrões

- ❌ Metáfora literal do nome (xícara para "Steep", cifrão para banco)
- ❌ Path customizado desenhado à mão — use primitivas
- ❌ Texto dentro do `<svg>` via `<text>`: depende de fonte que pode não
  carregar, e quebra fora do documento
- ❌ Cor literal no componente React
- ❌ Gradiente ou sombra
- ❌ Mais de 3 formas
- ❌ Importar PNG no header quando o SVG inline resolve
