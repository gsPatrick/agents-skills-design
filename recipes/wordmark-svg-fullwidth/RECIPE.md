# Wordmark SVG preenchendo a largura

**Efeito:** o nome da marca ocupa a largura inteira da tela como elemento
gráfico principal. Sem imagem de herói — a tipografia **é** o herói.

**Fonte:** `projects/remake-summer-drive/components/organisms/Hero/`

---

## Por que SVG e não texto

```jsx
<svg viewBox="0 0 1380 246" className={styles.wordmark} role="img"
     aria-label="The Summer Drive">
  <path fill="#006EFF" d="M47.77…" />
</svg>
```

```css
.wordmark { display: block; width: 100%; height: auto; }
```

`width: 100%` + `viewBox` = o wordmark preenche **exatamente** a largura do
container, em qualquer tela, sem uma linha de JS. O `height: auto` mantém a
proporção pelo `viewBox`.

Com texto real você teria que:
- carregar a fonte e esperar (FOUT — o layout salta)
- calcular `font-size` em vw e torcer para a métrica bater
- rezar para o fallback não ter largura diferente

Com path, o encaixe é geométrico e garantido. Zero layout shift.

**O trade-off:** o texto não é selecionável nem indexável como texto. Por isso
`role="img"` + `aria-label` são **obrigatórios**, não opcionais. Sem eles o
wordmark não existe para leitores de tela nem para o Google.

## Dois SVGs, não um responsivo

```jsx
<svg className={styles.wordmark} viewBox="0 0 1380 246" aria-label="The Summer Drive" role="img" />
<svg className={styles.wordmarkMobile} viewBox="0 0 337 127" aria-hidden="true" />
```

```css
.wordmark       { display: block; }
.wordmarkMobile { display: none; }

@media (max-width: 800px) {
  .wordmark       { display: none; }
  .wordmarkMobile { display: block; }
}
```

A versão desktop é uma linha só (`1380×246`, proporção ~5.6:1). Em 375px de
largura, essa proporção daria 66px de altura — as letras ficariam com 20px e
ilegíveis.

A versão mobile reflui o mesmo texto em **três linhas** (`337×127`, ~2.6:1).
Não é a mesma arte escalada — é uma composição diferente.

`aria-hidden="true"` na versão mobile: só uma das duas deve ser anunciada, senão
o leitor de tela lê o nome da marca duas vezes.

## Elementos ancorados nas margens

```css
.hero { position: relative; padding-bottom: 1.667vw; border-bottom: 0.139vw solid #006eff; }
.date, .time { position: absolute; bottom: 1.667vw; text-align: center; }
.date { left:  2.431vw; }
.time { right: 2.431vw; }
```

Data e hora ancoradas nos cantos inferiores do bloco do wordmark, alinhadas à
margem da página (`2.431vw` = o padding lateral). Isso cria a leitura de cartaz:

```
DATE                                                    TIME
06.24.21   ████ THE SUMMER DRIVE ████                5–10 PM
──────────────────────────────────────────────────────────── ← régua azul
```

O `border-bottom` de largura total é o que fecha a composição. Uma régua fina
na cor de destaque, sangrando de margem a margem.

## O par tipográfico

```css
/* micro-label */
.date p:first-child { font-size: 1.25vw; text-transform: uppercase; line-height: 95%; }

/* valor */
.date p:last-child {
  font-size: 5.369vw;
  font-family: var(--font-editorial-new);   /* serifada ultralight */
  line-height: 95%;
  letter-spacing: -0.02em;
  text-transform: uppercase;
}
```

Grotesk pequena em caixa alta para o rótulo, serifada display gigante para o
valor. Razão de ~4.3× entre os dois. `line-height: 95%` — abaixo de 100% para
que linhas grandes não abram buraco.

## Wordmark clicável

```jsx
<Link href="/outrun" className={styles.wordmarkLink} aria-label="Play the Summer Drive game">
```
```css
.wordmarkLink { display: block; width: 100%; transition: opacity 0.3s ease; }
.wordmarkLink:hover { opacity: 0.72; }
```

Se o wordmark levar a algum lugar, `opacity` no hover é a afordância certa —
`transform: scale` num elemento de largura total causa scroll horizontal.

## Como gerar o path

1. Componha o wordmark no Figma na fonte final
2. Selecione → **Outline stroke** / converta texto em vetor
3. Exporte SVG, marque "Outline text"
4. Otimize (SVGO) — o path do Summer Drive tem ~4KB inline
5. Cole inline no JSX. **Não** use `<img src="…svg">`, senão você perde
   `currentColor` e o controle de fill

## Armadilhas

- ❌ Sem `role="img"` + `aria-label` → invisível para acessibilidade e SEO
- ❌ Um SVG só escalado para mobile → ilegível
- ❌ Sem `aria-hidden` na segunda variante → marca lida duas vezes
- ❌ `height` fixa no SVG → distorce; use `height: auto`
- ❌ `<img>` em vez de inline → sem controle de cor
- ❌ `transform: scale` no hover de elemento full-width → scroll horizontal
- ❌ Path não otimizado → 40KB de coordenadas no HTML

## Quando usar

Só quando o nome for **curto e forte** (2–4 palavras) e a página for de cartaz:
evento, lançamento, portfólio, agência. "Clínica Odontológica Sorriso Perfeito
Ltda" não vira wordmark full-width.
