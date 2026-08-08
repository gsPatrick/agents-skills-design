# Rodapé com paisagem revelada por parallax

**Efeito:** uma paisagem fica travada no fundo da janela, atrás da página. Ao
chegar no fim, o conteúdo termina e a cena é revelada — como levantar uma folha
de papel de cima de uma foto.

**Fonte:** `projects/remake-general-intelligence/components/organisms/FooterBackground/`

---

## Anatomia

```
div.page (background-color: parchment)   ← a "folha" opaca
  main
    ...seções
    <Footer />
<FooterBackground />   ← IRMÃO do .page, fora dele, z-index: -1
```

A ordem importa: `FooterBackground` fica **fora** do wrapper com background.

## O código

```css
.wrap {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: -1;              /* ← atrás de tudo */
  max-width: 1920px;
  margin-inline: auto;
  overflow: hidden;
  pointer-events: none;
}

.inner  { position: relative; width: 100%; height: 400px; }
.image  { width: 100%; height: 100%; object-fit: cover; object-position: top center; }
```

## Por que funciona

Não há JS. Não há `background-attachment: fixed`. O efeito é puramente
estrutural:

1. A imagem está `fixed` no rodapé da **viewport** — sempre lá, sempre parada
2. `z-index: -1` a coloca atrás do fluxo do documento
3. `.page` tem `background-color` **opaco** — cobre a imagem enquanto você rola
4. Quando o conteúdo do `.page` acaba, não há mais o que cobrir → a paisagem
   aparece

O parallax é a **ausência** de movimento contra o conteúdo que se move. Zero
custo de performance.

## Os dois requisitos que quebram tudo se faltarem

**1. O wrapper da página precisa de background opaco:**
```css
.page { background-color: var(--color-parchment); }
```
Sem isso a paisagem fica visível atrás do site inteiro.

**2. Nenhum ancestral pode criar contexto de empilhamento:**

`z-index: -1` posiciona atrás do **contexto de empilhamento pai**. Se algum
ancestral tiver `transform`, `filter`, `opacity < 1`, `will-change` ou
`isolation: isolate`, ele cria um novo contexto e o `-1` deixa de escapar — a
imagem some para sempre atrás do próprio pai.

Por isso `FooterBackground` é irmão do `.page`, não filho.

## Por que não `background-attachment: fixed`

- Não funciona no iOS Safari (o mais comum dos navegadores móveis)
- Força repintura em cada frame de scroll em desktop
- Não dá para posicionar conteúdo por cima (a barra de copyright)

## O gradiente de legibilidade

```css
.gradient {
  position: absolute;
  inset: 0;
  z-index: 1;
  background: linear-gradient(transparent 75%, rgba(0, 0, 0, 0.82));
}
```

Escuro só nos **últimos 25%**, onde fica a barra de copyright. Um gradiente na
altura toda embaçaria a paisagem, que é o ponto da seção.

## O `max-width: 1920px`

Acima de 1920px a imagem esticaria e ficaria borrada. O `margin-inline: auto`
centraliza; nas bordas aparece o background do `body`. Defina um `body` de cor
compatível com a imagem.

## Calibragem

| Valor | Padrão | Regra |
|---|---|---|
| `height` | `400px` / `500px` (≥1280) | menos de 300px não parece paisagem |
| `object-position` | `top center` | mantém o horizonte visível ao recortar |
| parada do gradiente | `75%` | só a faixa do texto |
| `max-width` | `1920px` | teto de nitidez da imagem |

## Armadilhas

- ❌ `.page` sem background opaco → paisagem visível o site inteiro
- ❌ `FooterBackground` dentro de um elemento com `transform`/`filter` → some
- ❌ `background-attachment: fixed` → quebra no iOS
- ❌ Sem `pointer-events: none` → intercepta cliques do rodapé
- ❌ Sem `overflow: hidden` no `.wrap` → a imagem vaza acima de 1920px

## Variante: vídeo em vez de imagem

Mesma estrutura, `<video>` no lugar do `<img>`, com
`autoPlay playsInline loop muted`. Mais pesado; só se o vídeo for curto (< 5s)
e otimizado.
