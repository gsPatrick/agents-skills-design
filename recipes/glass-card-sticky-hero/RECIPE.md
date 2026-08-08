# Herói com card de vidro que sobe

**Efeito:** ilustração/foto full-bleed ocupando a tela, com um card de vidro
fosco grudado perto do rodapé. Ao rolar, o card acompanha e desliza sobre a
imagem até o fim dela.

**Fonte:** `projects/remake-general-intelligence/components/organisms/Hero/`
**Arquétipo:** Editorial. É o herói padrão para nutricionista, terapeuta, clínica
boutique, SaaS com personalidade.

---

## Anatomia

```
div[data-navbar-theme="dark"]
  section.bleed
    div.frame     ← aspect-ratio: 1553/1450, min-height: 800px
      div.media   → img (object-fit: cover, object-position: 50% 40%)
      div.content
        div.container (max-width: 1440px)
          h1.title        ← WordReveal, centralizado, branco
          div.taglineWrap ← absolute bottom-right em lg
          div.stickyWrap  ← sticky, top: calc(100vh - 330px)
            div.card      ← o vidro
        div.clock         ← relógio ao vivo, canto superior direito
```

## O `aspect-ratio` em vez de `height: 100vh`

```css
.frame {
  width: 100%;
  min-height: 800px;
  aspect-ratio: 1553 / 1450;
}
```

Herói de `100vh` recorta a ilustração de forma diferente em cada tela — num
laptop 13" você perde metade da composição. Com `aspect-ratio`, a imagem
**sempre aparece inteira**, na proporção em que foi desenhada, e a altura se
ajusta sozinha.

`1553/1450` = a proporção do arquivo original. Use a do seu.

`min-height: 800px` protege telas estreitas, onde o aspect ratio produziria uma
faixa baixa demais. Em `lg` volta a `auto` (a proporção já basta).

**Use `aspect-ratio` quando a imagem for uma composição** (ilustração, cena
desenhada). Use `100vh` quando for textura/vídeo, onde o recorte não importa.

## O `object-position: 50% 40%`

Não `center`. Ancorar em 40% da altura mantém o horizonte/ponto focal no lugar
certo quando o recorte acontece — `center` corta a cena pela metade e o
elemento principal escapa.

## O sticky do card

```css
.stickyWrap {
  position: sticky;
  top: calc(100vh - 278px);      /* mobile */
  z-index: 50;
  margin: 0 16px 16px;
  max-width: 500px;
}

@media (min-width: 768px) {
  .stickyWrap { top: calc(100vh - 330px); margin-right: auto; }
}
```

`top: calc(100vh - 330px)` gruda o card a 330px do **rodapé da viewport**.
Ele fica visível o tempo todo enquanto a imagem rola atrás, e solta quando o
`.container` termina.

O `330px` é a altura do card + respiro. Meça o seu card e ajuste — se o valor
for menor que a altura real, o card sai pela borda inferior.

## A receita do vidro

```css
.card {
  padding: 20px 24px 32px;
  border-radius: var(--radius-2xl);
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: linear-gradient(90deg,
    rgba(0, 0, 0, 0.12) 0%,
    rgba(0, 0, 0, 0.07) 50%,
    rgba(0, 0, 0, 0.07) 100%);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.15);
}
```

Diferente do vidro do nav ([nav-morph-frosted](../nav-morph-frosted/)): aqui o
fundo é **escuro** (`rgba(0,0,0,0.12)`), não branco, porque o texto é branco
sobre uma imagem clara. O gradiente sutil da esquerda para a direita evita a
aparência de retângulo chapado.

`border` branca a `0.2` de alpha: é a borda que separa o card da imagem. Sem
ela o vidro se dissolve no fundo.

## O `text-shadow` no título

```css
.title {
  color: #fff;
  text-shadow: 0 0 4.978px rgba(255, 255, 255, 0.8);
}
```

Sombra **branca**, não preta. Não escurece — cria um halo que engrossa as
letras finas o suficiente para sobreviverem sobre áreas claras da ilustração,
sem a aparência suja de uma drop-shadow escura.

## Os detalhes tipográficos

```css
.title {
  font-family: var(--font-ppmondwest);   /* serifada display */
  font-size: clamp(16px, 2.4vw, 27px);
  letter-spacing: -0.04em;
  font-feature-settings: "liga" 0;       /* ← desliga ligaduras */
  font-kerning: none;                     /* ← desliga kerning */
  max-width: 24ch;
  text-align: center;
}
```

`"liga" 0` + `font-kerning: none` mantêm a largura de cada palavra **estável**
durante o [reveal por palavra](../reveal-word-blur/). Com ligaduras ativas, o
espaçamento muda quando as palavras vizinhas aparecem e o título "respira" de
forma estranha durante a animação.

Note que o herói é o único texto que quebra a regra de tamanho: `clamp(16px,
2.4vw, 27px)` é **pequeno**. O peso vem da imagem, não da tipografia. Nem todo
herói precisa de letra gigante.

## Prefetch das variantes

```jsx
useEffect(() => {
  [1, 2, 3, 4].forEach((index) => {
    const link = document.createElement("link");
    link.rel = "prefetch";
    link.as = "image";
    link.href = `/images/spring-hero-${index}.avif`;
    document.head.appendChild(link);
  });
}, []);
```

A imagem do herói muda conforme a hora do dia (via `useNYCTime`). O prefetch
carrega as outras variantes em segundo plano, para que a troca na virada da
hora seja instantânea. AVIF pesa ~40% menos que WebP na mesma qualidade.

## Armadilhas

- ❌ `height: 100vh` numa ilustração → composição recortada de forma imprevisível
- ❌ `object-position: center` → ponto focal escapa no recorte
- ❌ `top` do sticky menor que a altura do card → card sai pela borda
- ❌ Vidro branco sobre imagem clara com texto branco → ilegível. Vidro escuro.
- ❌ Sem `border` no card → dissolve na imagem
- ❌ `text-shadow` preto → suja o título
- ❌ Ligaduras ativas com reveal por palavra → largura instável
- ❌ Sem `overflow-x: clip` no wrapper da página → o full-bleed vaza
