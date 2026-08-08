# carousel-progress-autoplay

**Efeito** — carrossel que avança sozinho a cada 8s, com uma **régua** onde o
trecho ativo cresce 8× e se preenche como relógio. Loop infinito sem costura
visível. Pausa preservando o progresso.

**Fonte** — Superpower, `sp2-testimonials2`.

## Anatomia

**Os bullets são barras, não pontos:**

```css
.bullet { flex: 1 1 0; height: .25rem; background: rgba(24,24,27,.2);
          overflow: hidden; transition: flex-grow .75s cubic-bezier(.45,0,.55,1); }
.bulletActive { flex-grow: 8; }
.bulletFill  { position: absolute; inset: 0 auto 0 0; width: 0; background: #18181b; }
```

O fill anima `width: 0 → 100%` em **`linear`** ao longo dos 8s e, ao
terminar, avança.

**Três cópias dos slides:**

```js
const slides = Array.from({ length: N * 3 }, (_, i) => DADOS[i % N]);
const [atual, setAtual] = useState(N);   // começa no MEIO
```

Depois de cada transição, normaliza de volta ao centro sem animação:

```js
let s = atual;
while (s >= 2 * N) s -= N;
while (s < N) s += N;
if (s !== atual) {
  setSemTransicao(true);
  setAtual(s);
  requestAnimationFrame(() => requestAnimationFrame(() => setSemTransicao(false)));
}
```

## Por que funciona

**A régua mostra posição E quantidade num elemento só.** Com `flex: 1 1 0` as
barras dividem a largura; a ativa em `flex-grow: 8` ocupa 8× mais. O contador
`1/5` ao lado é redundância, não a informação principal.

**O preenchimento é `linear` de propósito.** É um relógio, e relógio não
acelera — mesmo que todo o resto da página use curvas com easing.

**A pausa preserva o progresso:**

```js
restante = Math.max(50, restante - decorrido);
```

Sem isso, quem passa o mouse sem querer perde os 7s já vistos.

**Três cópias, não duas.** Com clones só no fim o loop fecha para frente, mas
voltar do primeiro slide não tem para onde ir.

**O duplo `requestAnimationFrame`** garante que o navegador pintou o novo
transform antes de religar a transição. Com um só, o salto às vezes aparece
animado.

## Calibragem

| Valor | Efeito |
|---|---|
| `8000ms` | tempo por slide. Depoimento com foto pede 6–10s |
| `flex-grow: 8` | quanto a barra ativa domina. 3–4 é discreto |
| `cubic-bezier(.45,0,.55,1)` | quase simétrica — slide pede freio e aceleração parelhos |
| `opacity: .5` nos inativos | o vizinho aparece sem competir |
| `750ms` de transição | acompanha o `TRANSICAO` do JS |

## Armadilhas

- **Posicione por `offsetLeft`**, não por `largura × índice` — margens
  irregulares acumulam erro.
- O CSS pode dizer `flex-grow: 6` e o **script escrever 8**. Procure a
  propriedade no `<script>` antes de confiar na folha.
- `object-position` das fotos: se os retratos têm a pessoa à esquerda, use
  `0% 50%` — centralizado o corte remove o rosto.

## Reduced motion

Desligue o autoplay (a animação viraria 0.01ms e o carrossel giraria
descontrolado) e mantenha a navegação manual.
