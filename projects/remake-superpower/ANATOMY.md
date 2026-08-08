# Superpower — Anatomia

Remake de [superpower.com](https://superpower.com/). Arquétipo **produto-editorial**:
neutro quente, tipografia grotesca, uma seção de scrollytelling como peça central.

Rodar: `npm install && npm run dev` → `/superpower` (porta 3006)

---

## O sistema é REM sobre RAIZ FLUIDA

Este é o fato que muda tudo. O root font-size escala linearmente com a viewport:

```
1200px → 14.4874      1440px → 14.9916      1920px → 16.0000

html { font-size: calc(11.97px + 0.2101vw); }
```

Por isso os valores medidos saem fracionários — `14.9916px`, `11.2437px`,
`20.9882px` não são escolhas, são rem calculados sobre essa base.

**Escrever px fixo "conserta" 1440 e quebra todas as outras larguras.** Um
valor medido de 22.49px é `1.5rem`; de 104.97px é `7rem`.

```
--text-primary  #18181b
--black         #111      (não #000)
container       80rem
page-padding    2.5rem
```

Fonte: **Nb International Pro** — os arquivos reais, auto-hospedados. O CSS
salvo tem `@font-face` do Typekit que levaria a concluir que ela não é
baixável; a de verdade está no CDN do Webflow como `.woff2` aberto.
Comercial — aqui como peça de estudo, não redistribua.

---

## A regra que custou quatro erros

O Webflow **compõe por classes utilitárias**. Um elemento com
`class="a b c"` tem regras para `.a`, `.a.b` e `.a.b.c` — e a base quase
nunca é a que vale.

| Onde | Base | Variante que manda |
|---|---|---|
| `.section-sp2_intro` | gradiente cinza→branco | `.is-home`: branco→cinza + `padding-top: 4rem` |
| `.title_row` | esquerda, 45rem, gap 1.5rem | `.is-centered2`: CENTRO, 50rem, margin auto |
| `.button-wrap` | — | `display: none` (o botão nunca aparece) |
| `.footer2_component` | `gap: 14rem` | `.is-gap`: 3rem |
| `.sp-navbar3_menu` | width 32rem, padding 1.5rem, blur | o `<style>` embutido só traz o morph |

E há **duas fontes de CSS**: o `.css` compilado traz estrutura; os `<style>`
embutidos no `.htm` trazem overrides, temas e estados. Nenhuma sozinha dá o
resultado certo.

Ver [`skills/builder-css-reading`](../../skills/builder-css-reading/SKILL.md).

---

## Seções

### NavBar — morph em dois estados

`scrollY > 50` (só ≥992px), tudo em `0.25s cubic-bezier(0.16, 1, 0.3, 1)`:

```
repouso                    is-scrolled
inner transparente     →   rgba(0,0,0,.6) + blur(1.5rem), pílula
left 28rem/right 25.5  →   auto, gap 4rem, max-width 56rem
links #18181b          →   branco
CTA preto/branco       →   branco/#18181b
logo escala 1          →   scale(0.75) + branco
```

O logo é `position: absolute` centrado: assim não treme quando os flancos
mudam de largura. Os nove pontos do hambúrguer são **máscara SVG**, não
`<img>` — por isso a cor anima junto.

**Armadilhas:** `overflow` ≠ `visible` num ancestral desativa `sticky`; um
pai curto faz o sticky rolar embora.

### NavMenu — painel lateral

`transform: translateX(100%) → 0` em `.3s`, não `right` (que anima layout).
`visibility: hidden` + `pointer-events: none` no fechado, senão continua
clicável fora da tela.

Montado via **portal no body**: dentro do nav fixed, `bottom: 0` mediria a
altura do nav (76px), não da viewport.

Dois detalhes de acabamento: um traço que cresce de `0 → .5rem` no hover, e
os irmãos caindo para `opacity: .5` via `:has`.

### Hero

`heroReveal`: `blur(5px)→0`, `scale(1.3)→1`, `.8s`.

**Dois gradientes empilhados** com blend diferente — `overlay` a 30% em 50%
da altura, `darken` a 50% em 75%. Não é um gradiente mais forte: o `overlay`
satura os médios, o `darken` só puxa os claros. Juntos afundam o fundo sem
lavar o laranja.

As três notas ficam DENTRO do card (`inset: auto auto 3rem 4rem`), sobre o
vídeo — não abaixo dele.

### HowItWorks — scrollytelling de 4 trilhas

**A peça central.** →
[`recipes/scroll-stage-tracks`](../../recipes/scroll-stage-tracks/)

```
.howitworks  height: 800vh      ← 8 viewports, 200vh por passo
.stage       position: sticky
             top: .5rem
```

Quatro trilhas sincronizadas (`bg`, `content`, `faq`, `nav`) e **nove
keyframes** — pares por direção de scroll. O fundo anterior desliza
`−11rem` enquanto o novo entra: duas camadas em velocidades diferentes.

Atrasos escalonados: conteúdo sai 200ms, entra 900ms com 220ms de atraso,
FAQ com 290ms. A informação principal chega 70ms antes do detalhe.

### Membership — tabela zebrada

`is-armed` vem do **JavaScript**, não do HTML: sem JS as linhas nascem
visíveis. O original força um reflow (`void section.offsetHeight`) entre
adicionar a classe e revelar, senão o navegador agrupa as duas mudanças num
frame só.

Escalonamento por `setTimeout(i * 100)`, não `transition-delay` — parar de
rolar no meio deixa o resto congelado.

### Clinicians / SocialProof — sangria

`width: calc(50vw + 50%)`: o trilho é mais largo que o container e sangra
para fora da margem direita. O card seguinte fica cortado, e esse corte é o
**único** indicador de que há mais.

A divisória pertence ao CARD (`border-right`), não ao trilho — assim
acompanha o arrasto.

No SocialProof: **quatro larguras, uma altura**. 15.625rem (retrato),
20rem (split), 25rem (citação) — mas todos com 26.25rem de altura. É ela que
costura a fita.

### Testimonials — autoplay com régua

→ [`recipes/carousel-progress-autoplay`](../../recipes/carousel-progress-autoplay/)

Os bullets são **barras**, não pontos: `flex: 1 1 0` e a ativa vai a
`flex-grow: 8`. Vira régua onde o trecho atual ocupa 8× mais espaço —
posição e quantidade no mesmo elemento.

8s por slide, com o preenchimento `linear` (é relógio, relógio não acelera).
A pausa **preserva o progresso**: `restante = max(50, restante − decorrido)`.

**Três cópias dos slides**, não duas — clones antes e depois, começando no
meio. Com uma cópia só o loop fecha para frente mas não para trás.

### CtaFooter + SiteFooter — um canvas, dois blocos

Vivem dentro do mesmo `.footer-cta_wrap`, que carrega o fundo. O rodapé é um
**cartão branco arredondado por cima** — o `border-radius: .75rem` dele só
faz sentido por causa do `padding: 0 1.5rem 1.5rem` do wrapper, que abre a
moldura escura em volta.

O fundo escuro **não é CSS**: é uma cena WebGL da Unicorn Studio com 6
camadas. Reproduzida como imagem estática.

---

## Comportamentos de vídeo — três, não um

```
hero          autoPlay + loop        decorativo, roda sempre
howitworks    play() por passo,      narrativo, congela no fim
              sem loop               (`data-vc-no-loop`)
socialproof   loop                   clipes sociais, movimento é o ponto
```

`autoPlay` só vale na **montagem**. Trocar o atributo depois não faz o
navegador tocar — precisa de `play()` explícito, e `currentTime = 0` antes
se não houver loop.

Vídeos em `b-cdn.net` exigem header `Referer` (403 sem ele).

---

## Pendências

- As 5 camadas animadas da cena WebGL (`godrays`, `bloomFast`, `fastFog`,
  `nebula`, drift) — só a imagem base
- O vídeo do fundador aparece **duas vezes**: no CTA (cópia do agente que o
  construiu antes do rodapé existir) e no rodapé (lugar correto)
- 2 dos 5 logos de IA do rodapé
- Logo da UCLA no terceiro card de médicos (usando UCSF como reserva)
- O lightbox do plyr virou overlay mínimo
