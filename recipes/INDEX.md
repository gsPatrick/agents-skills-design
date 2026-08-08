# Recipes — biblioteca de padrões

**Leia isto antes de escrever qualquer animação ou seção do zero.**

Cada pasta contém o código **real, em produção**, extraído dos projetos do
portfólio, mais um `RECIPE.md` explicando por que cada número é aquele número.

## Como usar

1. Identifique o efeito na tabela abaixo
2. Leia o `RECIPE.md` **inteiro** — a seção "Armadilhas" é o motivo da recipe existir
3. Copie os arquivos de código para o seu projeto
4. Ajuste apenas os valores listados em "Parâmetros" / "Calibragem"
5. Mantenha os números marcados como críticos

**Não reconstrua de memória a partir da descrição.** A descrição existe para
você entender; o código existe para você copiar. Reconstruir a partir da prosa é
exatamente como os erros aparecem.

---

## Por efeito

### Revelação de texto

| Recipe | Efeito | Driver |
|---|---|---|
| [reveal-word-blur](reveal-word-blur/) | palavras entram desfocadas, escalonadas | tempo (gatilho por interseção) |
| [reveal-char-scroll](reveal-char-scroll/) | letras acendem conforme o scroll | scroll = linha do tempo |

### Scroll

| Recipe | Efeito | Complexidade |
|---|---|---|
| [scroll-step-handoff](scroll-step-handoff/) | painel preso, N passos, entrega para um card que sobe | alta |
| [sticky-video-backdrop](sticky-video-backdrop/) | vídeo preso com conteúdo passando por cima | média |
| [parallax-footer-reveal](parallax-footer-reveal/) | paisagem revelada no fim da página | baixa (CSS puro) |
| [smooth-scroll-lerp](smooth-scroll-lerp/) | a página desliza em vez de saltar | média ⚠️ |

### Herói

| Recipe | Arquétipo | Momento |
|---|---|---|
| [glass-card-sticky-hero](glass-card-sticky-hero/) | Editorial | card de vidro sobre ilustração |
| [frame-expand-fullbleed](frame-expand-fullbleed/) | Darkroom | moldura estoura para full-bleed |
| [intro-clip-path](intro-clip-path/) | Darkroom | painel abre de um ponto central |
| [wordmark-svg-fullwidth](wordmark-svg-fullwidth/) | Cinematic | tipografia É o herói |

### Navegação

| Recipe | Quando |
|---|---|
| [nav-morph-frosted](nav-morph-frosted/) | 1 troca de fundo (herói escuro → resto claro) |
| [nav-scroll-theme](nav-scroll-theme/) | 3+ alternâncias de fundo claro/escuro |

### Seções

| Recipe | Efeito |
|---|---|
| [marquee-seamless](marquee-seamless/) | faixa infinita de logos ou texto |
| [atmospheric-promo-card](atmospheric-promo-card/) | card grande e colorido no lugar de CTA genérico |

### Sistemas & utilidades

| Recipe | O que é |
|---|---|
| [vw-proportional-canvas](vw-proportional-canvas/) | sistema de dimensionamento de página inteira em `vw` |
| [cursor-blend-difference](cursor-blend-difference/) | cursor customizado com blend ⚠️ |
| [video-autoplay-ios](video-autoplay-ios/) | fazer vídeo de fundo rodar no iPhone |

⚠️ = um por página, no máximo. Sequestra comportamento nativo.

---

## Por projeto de origem

**General Intelligence (Editorial)**
`reveal-word-blur` · `scroll-step-handoff` · `glass-card-sticky-hero` ·
`atmospheric-promo-card` · `parallax-footer-reveal` · `nav-scroll-theme`

**Integrated Biosciences (Darkroom)**
`reveal-char-scroll` · `sticky-video-backdrop` · `frame-expand-fullbleed` ·
`intro-clip-path` · `nav-morph-frosted` · `marquee-seamless` (variante texto)

**Summer Drive (Cinematic)**
`vw-proportional-canvas` · `wordmark-svg-fullwidth` · `marquee-seamless`
(variante logos) · `cursor-blend-difference` · `smooth-scroll-lerp` ·
`video-autoplay-ios`

---

## Regras que valem para todas

**Easing.** `cubic-bezier(0.16, 1, 0.3, 1)` para revelações e entradas.
`linear` **só** para loops infinitos (marquee). Nunca `ease-in-out` numa
revelação — o começo lento parece atraso.

**Um momento por página.** Um scrollytelling, um smooth scroll, um cursor
customizado. Duas receitas ⚠️ juntas competem pela atenção e a página parece
uma demo de biblioteca.

**Listeners de scroll.** Sempre este formato:
```js
useEffect(() => {
  const onScroll = () => { /* ... */ };
  onScroll();                                          // ← estado inicial
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);         // ← recalcula em rotação
  return () => { /* remove os dois */ };
}, []);
```
Os três erros recorrentes: esquecer o `onScroll()` inicial (estado errado ao
recarregar rolado), esquecer o `resize` (contas velhas em rotação de tela),
esquecer o cleanup (vazamento ao trocar de rota).

**`overflow` mata `sticky`.** `overflow: hidden` em **qualquer** ancestral
desativa `position: sticky` silenciosamente. Se o sticky não funciona, procure
o `overflow` antes de qualquer outra coisa. Use `overflow: clip` quando
precisar conter, ou `visible` a partir de `lg`.

**Nunca `width: 100vw`.** Inclui a largura da barra de rolagem → scroll
horizontal. Use `100%` ou `calc(100vw - Npx)` onde `N` é o padding do container.

**`prefers-reduced-motion` é obrigatório.** Toda recipe tem uma seção sobre
isso. Regra: desligue `transform` e `animation`, mantenha `opacity` (para o
conteúdo não sumir).

---

## Registrar uma recipe nova

Ao clonar uma página, se aparecer um padrão que ainda não está aqui:

1. `mkdir recipes/nome-do-padrao`
2. Copie os arquivos reais do projeto (não reescreva)
3. `RECIPE.md` com as seções: **Efeito · Fonte · Anatomia · Por que funciona ·
   Parâmetros/Calibragem · Armadilhas · Reduced motion**
4. Adicione a linha nas tabelas acima

A seção **Armadilhas** é a parte mais valiosa. Documente o que deu errado antes
de dar certo — é isso que impede o próximo agente de repetir.

## Novos — extraídos do Seed

| Padrão | Efeito |
|---|---|
| [`gooey-controls-filter`](gooey-controls-filter/) | formas arredondadas que derretem uma na outra (metaball) |
| [`reveal-width-two-layer`](reveal-width-two-layer/) | entra em `transform`, depois abre em `width` — leque, não cascata |
| [`scroll-horizontal-parallax`](scroll-horizontal-parallax/) | cards deslizam na horizontal a 0.5× o scroll vertical |

## Novos — extraídos do Superpower

| Padrão | Efeito |
|---|---|
| [`scroll-stage-tracks`](scroll-stage-tracks/) | palco sticky de 800vh com 4 trilhas e keyframes por direção de scroll |
| [`carousel-progress-autoplay`](carousel-progress-autoplay/) | autoplay 8s com régua que cresce 8×, loop de 3 cópias, pausa preservando progresso |
| [`edge-bleed-track`](edge-bleed-track/) | `calc(50vw + 50%)` — o corte na borda é o único indicador de que há mais |
