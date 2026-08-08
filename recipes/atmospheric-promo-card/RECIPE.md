# Card promocional atmosférico

**Efeito:** um bloco grande, colorido, com imagem de fundo, que ocupa quase uma
tela inteira. Substitui a "seção de CTA" genérica. É a única superfície de cor
forte da página.

**Fonte:** `projects/remake-general-intelligence/components/organisms/CofounderPromo/`

---

## As proporções

```css
.card {
  padding: 20px;
  padding-top: 48px;
  border-radius: 24px;
  overflow: hidden;
  background-color: #0081c0;                          /* cor sólida por baixo */
  background-image: url("/images/cofounder-bg.avif"); /* imagem por cima */
  background-size: cover;
  background-position: 30% 0%;
}

@media (min-width: 1024px) {
  .card {
    min-height: 800px;
    padding: 80px;
    padding-top: 128px;
    background-position: center bottom;
  }
}
```

**`min-height: 800px` em desktop.** Este é o número que separa "card" de "seção".
Abaixo de ~600px vira um banner. O card precisa quase encher a tela para
funcionar como destino do scroll.

**`padding: 80px`** em desktop, `20px` em mobile. A generosidade interna é o
que faz parecer caro. Card grande com padding pequeno parece um anúncio.

## Cor sólida **por baixo** da imagem

```css
background-color: #0081c0;
background-image: url(...);
```

Os dois juntos, sempre. Enquanto a imagem carrega, o card já está na cor certa —
sem flash de retângulo branco. Se a imagem falhar, o card continua funcionando.
E se a imagem tiver transparência, a cor preenche.

## A sombra em anel, não drop-shadow

```css
box-shadow:
  0 2px 2px 0 rgba(0, 0, 0, 0.06),      /* sombra mínima */
  0 0 0 5px rgba(0, 0, 0, 0.04);        /* anel de 5px */
```

A segunda linha (sem blur, com `spread: 5px`) cria um **anel** em volta do card,
não uma sombra embaixo. Separa o card do fundo sem a aparência de "caixa
flutuando" que drop-shadows grandes produzem.

`0.04` de alpha — quase invisível conscientemente, mas o card parece assentado.
Este é o tipo de detalhe que diferencia sênior de júnior.

## O mockup de notificação

```css
.notifInner {
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.6);
  border-radius: 16px;
  box-shadow: 0 1px 8px 0 rgba(0, 0, 0, 0.05);
}

@media (min-width: 1024px) {
  .notification { position: absolute; top: 24px; right: 24px; max-width: 315px; }
}
@media (min-width: 1536px) {
  .notification { top: 56px; right: 56px; }
}
```

Um card de vidro pequeno, ancorado no canto superior direito, imitando uma
notificação de sistema. Vende o produto **mostrando** em vez de descrever.

Em mobile ele volta ao fluxo (`position: relative`, `width: 80vw`) — absoluto
em tela pequena sobreporia o título.

## O efeito de digitação

```css
.cursor { animation: blink 1s step-end infinite; }
@keyframes blink { 50% { opacity: 0; } }
```

`step-end` — o cursor pisca **duro**, como terminal. Com `ease` ele esmaece e
parece um bug.

`.text { min-height: 50px; }` reserva a altura enquanto o texto é digitado —
sem isso o card inteiro cresce e encolhe a cada caractere.

## Escala tipográfica em três degraus

```css
.title { font-size: 32px; }                              /* base */
@media (min-width: 640px)  { .title { font-size: 48px; } }
@media (min-width: 1024px) { .title { font-size: 54px; letter-spacing: -1.08px; } }
@media (min-width: 1536px) { .title { font-size: 64px; } }
```

Degraus discretos, não `clamp()`. Num card de largura fixa, `clamp` baseado em
`vw` desalinha com o padding do card. Breakpoints dão controle exato de quantas
linhas o título ocupa em cada tamanho — e num card, o número de linhas é a
composição.

`max-width: 28ch` no título, `30ch` em lg — nunca deixe o título usar a largura
total de um card de 1080px.

## Variante embutida

```css
.embedded {
  display: block;
  width: 100%;
  margin-top: 0;
  flex-shrink: 0;
  align-self: stretch;
}
```

Uma prop `embedded` remove a margem superior e deixa o card ser posicionado por
um pai — é assim que ele funciona dentro do
[scroll-step-handoff](../scroll-step-handoff/), subindo do rodapé do painel.

Padrão útil: o mesmo organism serve como seção autônoma **ou** como carga de
outro padrão.

## Armadilhas

- ❌ `min-height` menor que 600px em desktop → vira banner
- ❌ Só `background-image`, sem `background-color` → flash branco no carregamento
- ❌ Drop-shadow grande em vez do anel → parece caixa de diálogo
- ❌ Título usando a largura toda → ilegível; limite em `ch`
- ❌ Sem `min-height` no texto digitado → card pula
- ❌ `ease` no cursor piscando → parece defeito
- ❌ Mais de um card destes por página → o destaque deixa de ser destaque

## A regra de ouro

**Um por página.** Este card é o único lugar onde a cor de destaque aparece em
superfície grande. Se você tem dois, nenhum é especial.
