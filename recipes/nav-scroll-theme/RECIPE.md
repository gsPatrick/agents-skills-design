# Nav que troca de tema conforme a seção

**Efeito:** o nav é claro sobre seções escuras e escuro sobre seções claras,
trocando automaticamente conforme você rola. Sem barra sólida, sem sombra — o
nav flutua sobre o conteúdo e continua legível.

**Fonte:** `projects/remake-general-intelligence/components/organisms/NavBar/NavBar.js`

---

## O contrato: as seções se declaram

```jsx
// Hero — imagem escura
<div id="hero" data-navbar-theme="dark">

// Coordinator — fundo parchment claro
<section id="coordinator-section" data-navbar-theme="light">
```

O nav não sabe nada sobre as seções. Ele lê um atributo. Adicionar uma seção
nova não exige tocar no nav — só declarar o tema dela.

`"dark"` significa **"o fundo aqui é escuro"** → o nav se pinta de claro.
Nomeie pelo fundo, não pelo nav, ou você se confunde toda vez.

## A detecção

```js
useEffect(() => {
  const sections = document.querySelectorAll("[data-navbar-theme]");
  const onScroll = () => {
    const y = window.scrollY + 80;          // ← linha de leitura na altura do nav
    let next = "light";                      // ← padrão se nenhuma seção cobrir
    sections.forEach((section) => {
      const rect = section.getBoundingClientRect();
      const top = rect.top + window.scrollY;
      const bottom = top + rect.height;
      if (y >= top && y < bottom) {
        next = section.getAttribute("data-navbar-theme") || "light";
      }
    });
    setTheme(next);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
  return () => window.removeEventListener("scroll", onScroll);
}, []);
```

**O `+ 80`** coloca a linha de teste na altura vertical do nav, não no topo da
página. Sem isso o tema trocaria quando a seção toca a borda superior — 80px
cedo demais, e o nav pisca no meio da transição entre seções.

Ajuste ao seu nav: `scrollY + (altura do nav)`.

**O `forEach` não dá `break`.** É de propósito: se duas seções se sobrepõem
(comum com `sticky`), a **última no DOM** vence. É o comportamento correto,
porque é a que está pintada por cima.

## Por que não IntersectionObserver

`IntersectionObserver` responde "está visível?", não "o que está **atrás do
nav** agora?". Com seções de 3000px, várias ficam visíveis simultaneamente e
você teria que reconstruir esta mesma lógica de ponto de teste em cima dele.
O cálculo direto é mais curto e mais previsível.

Custo: um `getBoundingClientRect()` por seção por evento de scroll. Com <20
seções é irrelevante.

## Propagar o tema

```jsx
const isDark = theme === "dark";

<nav className={`${styles.nav} ${isDark ? styles.dark : styles.light}`}>
  <Logo variant={isDark ? "light" : "dark"} />
  <OutlinedButton variant={isDark ? "dark" : "primary"} />
```

O logo precisa de variante própria (SVG com `fill` diferente), não basta
`filter: invert()` — inverte a cor da marca.

Transição no CSS, não no JS:
```css
.nav { transition: color 0.3s ease; }
```

## O padrão do menu mobile

```js
useEffect(() => {
  document.body.style.overflow = open ? "hidden" : "";
  return () => { document.body.style.overflow = ""; };
}, [open]);
```

Trava o scroll do body enquanto o overlay está aberto. O cleanup destrava mesmo
se o componente desmontar com o menu aberto — sem ele a página fica travada
para sempre.

## Armadilhas

- ❌ Sem o `+ 80` → tema troca cedo demais e pisca
- ❌ `break` no loop → seções sobrepostas resolvem errado
- ❌ Sem `onScroll()` no mount → tema errado ao recarregar rolado
- ❌ `filter: invert()` no logo → cor de marca destruída
- ❌ Seção sem `data-navbar-theme` → cai no padrão `light`; se o fundo dela for
  escuro, o nav some. Todas as seções full-bleed precisam declarar.
- ❌ Transição em JS → engasga; deixe no CSS

## Quando usar a alternativa mais simples

Se a página tem só um herói escuro e o resto claro, use o padrão de
[nav-morph-frosted](../nav-morph-frosted/): um único booleano `scrollY > 8`.
Este sistema de temas só compensa com 3+ alternâncias de fundo.
