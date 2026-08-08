---
name: measurement-protocol
description: >-
  Protocolo para medir uma página de referência com confiança antes de
  reconstruí-la. Use SEMPRE que for clonar, replicar ou ajustar uma seção
  contra um original — junto com section-anatomy. Evita a classe de erro mais
  cara do clone: achar que está certo quando não está.
disable-model-invocation: false
---

# Measurement Protocol

O `section-anatomy` ensina **o que** decompor. Esta skill trata de **como
obter os números** — e de por que a medição mais convincente é justamente a
que costuma estar errada.

A regra de fundo: **medição numérica pega erro de valor; só comparação visual
pega erro de composição.** Fundo faltando, canto sem arredondamento,
mecanismo de hover errado — tudo isso passa em todas as verificações
numéricas.

---

## 1. Role até o elemento antes de medir

Qualquer coisa disparada por visibilidade — vídeo, animação, lazy-load,
`IntersectionObserver` — lê estado errado se você medir logo após o `load`.

```js
const h = await pg.evaluateHandle(() => /* achar a seção */);
await h.asElement().scrollIntoView();
await new Promise(r => setTimeout(r, 2500));   // deixe assentar
// só agora meça
```

**Sintoma de que você errou nisso:** o valor medido é suspeitamente "neutro"
— `paused: true`, `currentTime: 0`, `opacity: 0`, `transform: none`.

## 2. Amostre várias posições de scroll

Uma medição num ponto só não revela animação dirigida por scroll. Amostre e
compare:

```js
for (const alvo of [900, 600, 300, 0, -300]) {
  await pg.evaluate(v => scrollTo(0, v), topoDaSeção - alvo);
  await new Promise(r => setTimeout(r, 1000));
  // leia o valor
}
```

Se os valores variam linearmente, derive a lei:
`valor = (GATILHO − topo) × FATOR`.

**Espere pelo menos 1s por amostra.** Com 600ms um valor legítimo voltou
zerado e me fez perseguir um bug que não existia.

## 3. Converta para o referencial do pai

O erro mais frequente. Uma coordenada medida é sempre relativa a **algo** —
converta antes de virar CSS.

```
viewport → seção:   y − seçãoTop
seção → elemento:   y − seçãoTop − paiTop
```

**Sintoma:** todos os elementos de um bloco erram pelo **mesmo** valor. Um
deslocamento uniforme é sempre referencial, nunca valores individuais.

## 4. Varra por propriedade, não por tag

Uma busca por `<img>`, `<video>`, `<canvas>` **não encontra**:

| Padrão | Como achar |
|---|---|
| `background-image` num `<div>` | `getComputedStyle(e).backgroundImage !== 'none'` |
| camada `position: fixed` | não tem relação com o fluxo — filtros por proximidade a perdem |
| `scrollLeft` dirigido por JS | não existe em `getComputedStyle` — amostre o valor |
| animação em chunk minificado | não está no HTML salvo — decodifique o bundle |

Para inventariar animações, varra **toda a subárvore**:

```js
s.querySelectorAll('*').forEach(e => {
  const c = getComputedStyle(e);
  if (c.animationName !== 'none') out.push('anim:' + c.animationName);
  if (c.transition && !c.transition.startsWith('all 0s')) out.push('trans:' + c.transition);
});
```

## 5. Não repita a mesma verificação defeituosa

Validar quatro vezes com o mesmo método viciado não é confirmação — é o mesmo
erro quatro vezes. Se a medição passa e o visual reprova, **o problema está na
medição**, não no código.

Quando isso acontecer, mude o *tipo* de evidência: capture o pixel, compare
os dois screenshots, leia o arquivo bruto.

---

## Truques de apoio

**Amostrar cor de pixel** quando `getComputedStyle` devolve `transparent`
(a cor vem de um ancestral): decodifique o PNG do screenshot e leia o byte.

**Detectar frame vazio** de vídeo pelo tamanho do arquivo — um thumbnail de
8 KB entre vizinhos de 400 KB é quadro em branco.

**Fechar popups antes de capturar.** Sites de e-commerce abrem modal de
desconto e banner de cookies; os dois entram no screenshot e invalidam a
comparação.

```js
document.querySelectorAll(
  'iframe,[class*=modal],[class*=popup],[id*=attentive],[class*=cookie],[role=dialog]'
).forEach(e => e.remove());
```

**Screenshot de elemento** (`el.screenshot()`) é confiável; screenshot com
`clip` calculado à mão erra quando algo sticky ocupa o topo.

---

## Armadilhas de CSS que somem silenciosamente

Não dão erro, não avisam — simplesmente não fazem efeito:

- **`overflow` diferente de `visible` num ancestral desativa `position: sticky`**
  dos descendentes
- **`sticky` num pai curto** rola embora quase imediato — precisa de pai alto
- **CSS Modules hasheia `@keyframes`**, então `animation` inline referenciando
  o nome não faz nada
- **`z-index: -1` fica atrás do fundo do ancestral** — qualquer wrapper opaco
  no caminho esconde a camada
- **`margin-inline: auto`** centraliza quando a intenção era ancorar no
  padding; num container de largura fixa isso desloca tudo
- **`border-radius` é invisível** sem contraste atrás
- **`inline-grid` não rola** — dimensiona pelo conteúdo, `scrollWidth ===
  clientWidth`
- **Fonte subset tem métrica menor** que a família completa; fixe com
  `min-width` quando a largura medida importar

---

## Ordem de trabalho

```
1. rolar até a seção          →  medir com ela em viewport
2. amostrar várias posições   →  achar animação dirigida por scroll
3. varrer por propriedade     →  inventariar camadas e transições
4. converter referenciais     →  antes de escrever CSS
5. construir
6. verificar numericamente    →  posições e valores
7. COMPARAR VISUALMENTE       →  o passo que pega o que os números não pegam
```

O passo 7 não é opcional. Foi o único que pegou o fundo verde ausente, o
canto sem arredondamento e o mecanismo errado de hover — três bugs que
passaram limpos por toda verificação numérica.
