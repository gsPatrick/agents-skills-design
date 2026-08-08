---
name: section-anatomy
description: >-
  Protocolo obrigatório para ler e decompor uma seção antes de escrever código —
  camadas, ancoragem, driver, pista, estados. Use SEMPRE que for construir uma
  seção com scroll, sticky, vídeo de fundo, revelação de texto ou qualquer
  animação; e ao analisar uma referência (.mhtml, print, site ao vivo) para
  replicar. Impede o erro de pular direto para o CSS e montar a estrutura errada.
disable-model-invocation: false
---

# Section Anatomy

**Antes de escrever uma linha de CSS de qualquer seção não-trivial, você
preenche este mapa.** Não é burocracia: quase todo erro em seção animada é um
erro de **estrutura**, decidido antes da primeira propriedade CSS. Se a
estrutura estiver errada, nenhuma animação salva.

A falha típica: olhar uma referência, reconhecer "ah, é um sticky com fade",
e começar a escrever. Cinco arquivos depois o sticky não gruda (tem um
`overflow` num ancestral), o conteúdo começa uma tela abaixo (faltou o
`margin-top: -100vh`), e a animação dispara na hora errada (faltou o
`rootMargin`).

---

## Passo 0 — Consultar a biblioteca primeiro

**Antes de decompor, verifique se o padrão já existe.**

Leia [`recipes/INDEX.md`](../../recipes/INDEX.md). Na grande maioria dos casos
a seção que você está olhando é uma recipe existente com outro conteúdo e
outros números.

Se encontrou: leia o `RECIPE.md` inteiro, **copie os arquivos de código**, e
ajuste só o que está listado em "Parâmetros". Pule o resto deste protocolo.

Se não encontrou: siga adiante — e ao terminar, registre a recipe nova.

> Nunca reconstrua um padrão a partir de uma descrição em prosa quando o código
> real existe no repositório. Reconstruir de memória é exatamente de onde vêm os
> números errados.

---

## O mapa de anatomia

Responda os sete itens **por escrito**, no comentário do topo do organism.
Escrever força a decisão; pensar "por alto" não.

### 1. Camadas

Quantos planos de profundidade existem? Liste de trás para frente.

```
fundo   → vídeo / imagem / cor
meio    → conteúdo que rola
frente  → card, nav, overlay
```

Se houver mais de um plano, você vai precisar de um **contrato de z-index**.
Escreva-o agora, não depois:

| Camada | z-index | position |
|---|---|---|
| fundo | 0 | sticky |
| conteúdo | 1 | relative |

Todo elemento com `z-index` precisa de `position`. E cuidado: `transform`,
`filter`, `opacity < 1` ou `will-change` em um ancestral criam um contexto de
empilhamento novo e o seu `z-index` para de escapar dele.

### 2. Ancoragem

O que fica preso e o que rola? Para cada elemento:

- `static` — rola normal
- `sticky` — gruda até o pai acabar
- `absolute` — posicionado dentro do pai posicionado
- `fixed` — preso à viewport, nunca solta ⚠️

**Regras que já quebraram seções deste portfólio:**

- `overflow: hidden` em **qualquer** ancestral mata `position: sticky`
  silenciosamente. É a causa nº1 de "o sticky não funciona". Se o sticky não
  gruda, procure o `overflow` antes de qualquer outra coisa.
- **Nunca troque para `position: fixed` no meio de um scroll.** O elemento sai
  do fluxo, o layout colapsa, e ele salta para o canto superior esquerdo por um
  frame. Use `absolute` dentro de um `sticky`.
- Elemento `sticky` **ocupa espaço no fluxo**. Se o conteúdo deve passar por
  cima dele, você precisa de `margin-top: -Xvh` para cancelar a reserva.

### 3. Driver

O que dirige o movimento? Escolha **um**:

| Driver | Quando | Implementação |
|---|---|---|
| **Tempo** | intro de página, revelação ao entrar em cena | `animation` CSS ou `transition` + estado |
| **Interseção** | disparar uma vez ao aparecer | `IntersectionObserver` |
| **Offset de scroll** | o scroll É a linha do tempo | `getBoundingClientRect().top` |
| **Ponteiro** | cursor, hover, magnético | `mousemove` |

A pergunta que decide entre interseção e offset:

> **Se o usuário parar de rolar no meio, a animação continua?**
> Sim → tempo/interseção.  Não, congela → offset de scroll.

Errar isso é o erro estrutural mais caro. Uma revelação por interseção
reescrita como scroll-driven fica travada; o contrário fica descontrolado.

**Se o driver for offset de scroll**, use este formato sempre:

```js
useEffect(() => {
  const onScroll = () => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const scrollable = rect.height - window.innerHeight;
    const scrolled = Math.min(Math.max(-rect.top, 0), scrollable);
    setProgress(scrollable > 0 ? scrolled / scrollable : 0);
  };
  onScroll();                                            // ← estado inicial
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);           // ← rotação de tela
  return () => {
    window.removeEventListener("scroll", onScroll);
    window.removeEventListener("resize", onScroll);
  };
}, []);
```

Os três esquecimentos recorrentes: o `onScroll()` inicial (estado errado ao
recarregar já rolado), o `resize` (contas velhas após rotação), o cleanup
(vazamento ao trocar de rota).

### 4. Pista (runway)

Quanto scroll a seção precisa?

```
altura da seção = 100vh × (número de estados + 1)
```

- **Menos de 100vh por estado:** o usuário passa batido e não lê
- **Mais de 150vh por estado:** parece travado, o usuário rola com raiva

Escreva a conta explicitamente:

```
3 declarações → height: 300vh
scrollable = 300vh − 100vh (o sticky) = 200vh de scroll útil
```

Para scrollytelling com passos discretos, ~700px por passo é o calibrado
(ver `recipes/scroll-step-handoff`: 5 passos = 3500px).

### 5. Estados

Quantos? E como transitam?

| Tipo | Exemplo | Transição |
|---|---|---|
| **Binário** | nav condensa, moldura estoura | classe on/off + `transition` |
| **Discreto (N)** | 5 passos, 3 declarações | `Math.floor(progress × N)` |
| **Contínuo (0..1)** | opacidade, blur, translate | valor direto no `style` |

Estados discretos precisam de **debounce**. Sem ele o conteúdo troca no meio da
leitura:

```js
// activeStep = o que o scroll diz agora
// displayStep = o que está na tela
// Fade out (300ms) → troca durante o apagado → fade in
```

Tudo que reflete o passo — barras de progresso, índice, legenda — segue
`displayStep`, **nunca** `activeStep`.

**Se dois efeitos acontecem juntos, um único progresso alimenta os dois:**

```js
const contentOpacity = 1 - handoff;                    // conteúdo sai
const cardY = (1 - handoff) * 100;                      // card entra
```

Dois drivers separados dessincronizam em qualquer velocidade de scroll
diferente da que você testou.

### 6. Breakpoints

O que muda em mobile? Para cada um:

- A animação **sobrevive**, vira **estática**, ou o elemento **some**?
- A pista encurta? (Coordinator: 5000px em lg → 3500px em mobile)
- O layout inverte? (`row` → `column-reverse`)
- Qual valor de padding a sangria precisa cancelar? (`calc(100vw - 64px)`
  em lg → `calc(100vw - 40px)` em mobile)

Decida agora. Descobrir em mobile depois significa refazer a estrutura.

### 7. Reduced motion

```css
@media (prefers-reduced-motion: reduce) { … }
```

Regra: **desligue `transform` e `animation`, mantenha `opacity`.** Se o estado
base tem `opacity: 0` e você desliga a animação, o conteúdo some para sempre.

Vídeo em loop é movimento contínuo — o correto é trocar por um frame estático,
não só remover a transição.

---

## Modelo do comentário

Cole no topo do organism e preencha:

```js
/**
 * Coordinator — scrollytelling de 5 passos com handoff
 *
 * Camadas:    stickyHead (título) · stickyPanel (passos) · cofounderWrap (card)
 * Ancoragem:  head sticky top:100px · panel sticky top:370px · card absolute bottom
 * Driver:     offset de scroll do container
 * Pista:      min-height 3500px (mobile) / 5000px (lg)
 * Estados:    5 discretos (debounce 300ms) + 1 contínuo (handoff 0..1)
 * Mobile:     panelRow vira column-reverse, pista 3500px, card 100vw-40px
 * Recipe:     recipes/scroll-step-handoff
 *
 * Por que 3500: ~700px por passo. Abaixo de 2500 passa rápido demais pra ler.
 * Por que HANDOFF_START (2800) < STEPS_DISTANCE (3500): os 700px de
 *   sobreposição fazem parecer uma entrega, não duas animações em fila.
 */
```

Isto não é documentação decorativa — é o que permite ao próximo agente (ou a
você em três meses) **entender** a seção em vez de só copiar.

---

## Ao ler uma referência (.mhtml, print, site ao vivo)

Ordem de leitura. Não pule para o CSS.

1. **Role a página inteira uma vez** antes de olhar código. O que se move? O que
   fica parado? Onde a atenção é entregue de uma seção para a outra?
2. **Conte as camadas** em cada seção. Procure especificamente por vídeo/imagem
   que permanece enquanto o texto passa.
3. **Identifique o driver.** O teste: parar de rolar congela a animação?
4. **Meça a pista.** Quanto scroll cada seção consome? (No devtools: altura da
   seção ÷ altura da viewport.)
5. **Só então** olhe as classes e os valores de CSS.
6. **Cruze com `recipes/INDEX.md`.** Provavelmente já existe.

Para extrair valores exatos de um `.mhtml`, ver a skill
[`mhtml-reference-extraction`](../mhtml-reference-extraction/SKILL.md).

---

## Sinais de que a estrutura está errada

Se algum destes aparecer, **volte ao mapa** — não tente consertar com CSS:

| Sintoma | Causa quase sempre |
|---|---|
| Sticky não gruda | `overflow: hidden` num ancestral |
| Tela vazia antes do conteúdo | falta `margin-top: -100vh` |
| Elemento salta pro canto esquerdo | trocou para `position: fixed` |
| Animação termina antes de você ver | falta `rootMargin` / `threshold` |
| Barra de progresso fora de sincronia com o texto | lendo `activeStep` |
| Scroll horizontal | `width: 100vw` (inclui a barra de rolagem) |
| Layout pisca ao trocar de passo | falta `min-height` reservando altura |
| Estado errado ao recarregar no meio | falta `onScroll()` no mount |
| Animação desliza errado após girar a tela | falta listener de `resize` |
| Elemento sumiu com `z-index: -1` | ancestral com `transform`/`filter` |

---

## Ao terminar

- [ ] Comentário de anatomia no topo do organism
- [ ] `npm run build` passa
- [ ] Testado em 375px, 1024px, 1440px — sem scroll horizontal
- [ ] `prefers-reduced-motion` tratado
- [ ] Se o padrão é novo: registrado em `recipes/` com `RECIPE.md`
- [ ] `ANATOMY.md` do projeto atualizado com a seção nova
