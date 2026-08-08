# Smooth scroll com lerp

**Efeito:** a página desliza para a posição em vez de saltar. Dá peso e inércia,
tipo interface de estúdio.

**Fonte:** `projects/remake-summer-drive/components/organisms/SmoothScroll/SmoothScroll.js`

⚠️ **Isto sequestra o scroll nativo do usuário.** Um por página, no máximo, e
só quando o resto da página justifica. Se estiver em dúvida, não use.

---

## O núcleo

```js
let current = window.scrollY;   // onde a página está
let target  = window.scrollY;   // onde deveria estar
const ease  = 0.14;

const loop = () => {
  const diff = target - current;
  current += diff * ease;              // ← o lerp

  if (Math.abs(diff) < 0.5) {          // ← condição de parada
    current = target;
    window.scrollTo(0, current);
    running = false;
    return;                            // sai do rAF
  }

  window.scrollTo(0, current);
  rafId = requestAnimationFrame(loop);
};
```

`current += (target - current) * ease` é interpolação linear: a cada frame
percorre 14% da distância restante. Aproximação assintótica — nunca chega
matematicamente, por isso a condição de parada.

## `ease = 0.14`, não 0.08

| Valor | Sensação |
|---|---|
| `0.05` | pesado demais, o usuário sente atraso e rola de novo |
| `0.08` | ainda deriva por ~1s depois de parar |
| **`0.14`** | assenta rápido, mas o movimento é visível ✅ |
| `0.25` | quase indistinguível do scroll nativo |

Abaixo de `0.10` a página fica "escorregadia" e usuários reclamam de enjoo.

## A condição de parada é obrigatória

```js
if (Math.abs(diff) < 0.5) { current = target; ...; return; }
```

Sem isso o `requestAnimationFrame` roda **para sempre**, queimando bateria e
mantendo a GPU acordada. `0.5px` é abaixo do subpixel — invisível.

Note que `running = false` e o loop **retorna sem reagendar**. O rAF só reinicia
no próximo `wheel`. Um rAF perpétuo é o erro mais comum desta receita.

## O cap de "lead" (o que ninguém documenta)

```js
const lead = window.innerHeight;
target = Math.min(Math.max(target, current - lead), current + lead);
```

O momentum de trackpad dispara uma **enxurrada** de eventos `wheel` — dezenas
por segundo, por vários segundos depois que seu dedo saiu. Sem o cap, cada um
soma em `target`, que dispara metros à frente de `current`, e a página continua
deslizando por 3–5 segundos depois que você parou. Parece quebrado.

O cap trava `target` a no máximo uma viewport à frente da posição atual.
**Este é o valor que separa um smooth scroll aceitável de um insuportável.**

## Normalizar o `deltaMode`

```js
let delta = e.deltaY;
if (e.deltaMode === 1) delta *= 16;                    // linhas → px
else if (e.deltaMode === 2) delta *= window.innerHeight; // páginas → px
```

Firefox no Windows reporta `deltaMode: 1` (linhas). Sem a conversão, o scroll
fica 16× mais lento nesses navegadores.

## Ressincronizar com scroll nativo

```js
const onScroll = () => {
  if (!running) { current = window.scrollY; target = window.scrollY; }
};
```

Arrastar a barra, teclas de seta, âncoras `#hash`, Ctrl+F — tudo isso move a
página por fora do nosso loop. Sem essa sincronização, o próximo `wheel` teleporta
a página de volta para o `current` velho.

O guard `if (!running)` é essencial: durante nossa própria animação, `window.scrollTo`
dispara `scroll`, e sem o guard sobrescreveríamos `target` com `current` a cada
frame — a animação nunca sairia do lugar.

## Quando NÃO rodar

```js
const fine = window.matchMedia("(pointer: fine)");
const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
if (!fine.matches || reduced.matches) return;
```

- **Touch:** o scroll nativo do iOS/Android já tem física própria, muito melhor.
  Sequestrar quebra o overscroll e o rubber-banding.
- **Reduced motion:** não negociável.

## Preservar o pinch-to-zoom

```js
if (e.ctrlKey) return;   // antes do preventDefault
```

`Ctrl + wheel` (e o pinch de trackpad, que o browser reporta como `ctrlKey`) é
zoom. Sem esse guard você quebra a acessibilidade de quem precisa ampliar.

## Interações com outros padrões

Convive bem com `position: sticky` e com scroll-driven — todos leem
`window.scrollY`, que continua sendo a fonte da verdade.

**Não** convive com `scroll-behavior: smooth` no CSS. Escolha um. Os dois juntos
brigam pelo controle e a página fica trêmula.

## Armadilhas

- ❌ rAF sem condição de parada → loop eterno, bateria
- ❌ Sem cap de lead → deriva de 3–5s no trackpad
- ❌ Sem guard `if (!running)` no listener de scroll → animação travada
- ❌ Sem `{ passive: false }` no wheel → `preventDefault()` é ignorado
- ❌ Rodar em touch → quebra o scroll nativo
- ❌ Esquecer `cancelAnimationFrame` no cleanup → vaza ao trocar de rota
