# Seed — Anatomia

Remake de [seed.com](https://seed.com/). Arquétipo **editorial**, paleta verde
sobre papel quente, tipografia em pesos fracionários.

Rodar: `npm install && npm run dev` → `/seed`

---

## Sistema

```
--color-ink     #1c3a13   texto e fundo de botão
--color-paper   #fcfcf7   texto sobre ink
--color-lime    #d3fa99   barra de anúncio
--color-deep    #10210b   fundo do rodapé — MAIS escuro que o ink
--container     1361px    12 col de 84.08 + 11 gaps de 32
--radius-pill   1000px    literal do original, não 9999
```

**Pesos fracionários** — 300 / **350** / 400 / 500. O 350 é interpolado e só
existe porque as 6 variantes estão carregadas. Mesma assinatura de hierarquia
fina do Steep (430/450/480).

**O `--container: 1361px` aparece duas vezes** — no card da ViaCap e na grade
do bookend. Não é coincidência: com padding de 32px sobrariam 1376, e eles
limitam a 1361. É token, não valor avulso.

**Um único `radius: 8px` na página inteira** — o input do rodapé. Todo o
resto usa 16, 32 ou pílula. Campo de formulário fica fora do sistema de
formas da marca.

---

## Seções

### TopNav — pílula frosted sticky

`position: sticky; top: 8px; z-index: 10`. Em repouso fica em y=40, abaixo da
barra de anúncio; ao rolar cola em y=8 e acompanha a página inteira.

Dois estados, transição só de cor (`background-color 0.3s, color 0.3s`):

| | fundo | blur | texto |
|---|---|---|---|
| repouso (scrollY 0) | transparente | — | ink |
| vidro (scrollY > 0) | `rgba(87,94,85,0.35)` | `blur(19px)` | paper |

O vidro envolve **só logo + menu** (375px a partir de x=16). O bloco
Sign in / Get Started fica fora, com fundo próprio.

**Armadilhas que custaram tempo:**
- `overflow-x: clip` num ancestral **desativa o sticky** silenciosamente
- pai curto (~96px) faz o sticky rolar embora quase imediato — o nav precisa
  ser filho direto do wrapper alto
- a pílula encolhe para 28px (altura do texto) sem `height` explícito

### Hero

`margin-top: -64px`, `height: calc(100vh - 56px)`, `max-height: 900px`. O
`border-radius: 0 0 32px 32px` só é visível porque a seção seguinte sobe por
baixo — arredondamento precisa de contraste atrás.

### ProductSection — o `::before` que cresce

O hover não muda o card: muda um pseudo-elemento atrás dele.

```css
.card::before {
  height: calc(100% + 40px);
  transform: translate(-50%, -50%) scaleY(0.9);
  transition: transform 0.3s;
}
.card:hover::before { transform: translate(-50%, -50%) scaleY(1); }
```

Escalar o próprio card deformaria a tipografia. O `::before` cresce sem
reflow e sem tocar no conteúdo.

### ViaCap

Card de vidro `rgba(87,94,85,0.35)` + `blur(37.5px)` sobre fundo de bactérias.
O fundo pertence à **seção**, não ao card — por isso o card mede 1361 numa
seção de 1425.

O vídeo da cápsula **toca em loop**. Medi `paused: true` por cinco rodadas
porque lia o estado antes de a seção entrar na viewport.

### MicrobioSection

Ilustração é `<mux-player>` (HLS). Baixado com
`ffmpeg -i https://stream.mux.com/{playback-id}.m3u8 -c copy`.

O `SCIENCE /` usa tracking **positivo** (+0.24px) — único texto da página com
espacejamento aberto. Rótulo de sistema, não texto de leitura.

### ReviewCarousel

Slide ativo maior (913×514) e 13px mais alto que o inativo (868×488).

Os vídeos ficam **pausados** com pôster e play central — são depoimentos com
áudio. Distinção da página: decorativo roda sozinho, conteúdo espera clique.

A barra de controles usa **filtro gooey** → ver
[`recipes/gooey-controls-filter`](../../recipes/gooey-controls-filter/).

### UgcScroller — três animações

Colagem de 9 frames com formas alternadas (círculo / pílula / retângulo,
nunca a mesma duas vezes na horizontal).

1. **trilho** entra em `transform` — sem atraso
2. **cada frame** abre em `width` de 0 até a largura final — atraso 0.4s
   **fixo**, não escalonado
3. **parallax horizontal** — `scrollLeft = (552 − topo) × 0.5`

Ver [`recipes/reveal-width-two-layer`](../../recipes/reveal-width-two-layer/)
e [`recipes/scroll-horizontal-parallax`](../../recipes/scroll-horizontal-parallax/).

### Bookend

Dois cartões **quadrados** de 665×665. Eyebrow girado 90° na lateral —
crédito de locação como marca d'água editorial.

### SiteFooter

Camadas, de baixo para cima:

```
imagem FIXA (position: fixed, bottom 0, z-index -1, 800px)
bloco escuro #10210B      ← cobre a imagem; é ele que tem a cor, não o <footer>
GIF "Awaken Within"       ← SOBRE a textura revelada
copyright                 ← sobre a textura
```

Para a camada `z-index: -1` aparecer, **nenhum ancestral pode ter fundo
opaco** — tirei de `body` e do `.page`.

O manifesto usa **glyphs inline** entre as palavras (pipeta, `[R+D]`
carimbado, molécula, globo). Mesmo vocabulário do `【livro】` do eyebrow: a
marca fala por pictogramas no texto corrido, não por fileiras de ícones.

---

## Método

Erros que se repetiram e o que evita cada um:

| Erro | Evita com |
|---|---|
| Vídeo lido como pausado | **rolar até o elemento** antes de medir |
| `top` de viewport usado como `top` de seção | converter para o referencial do pai |
| `margin-inline: auto` deslocando o container | ancorar no padding, não centralizar |
| Camada fixa do rodapé invisível na varredura | buscar por **propriedade** (`backgroundImage`), não por tag |
| Parallax não encontrado | amostrar **várias posições de scroll**, não uma |

Medição numérica pega erro de valor. Só comparação visual pega erro de
composição — o fundo verde, o arredondamento e o mecanismo do hover passaram
em todos os números e estavam errados.

---

## Fontes

Seed Sans é **proprietária**. Está aqui como peça de estudo, mesma prática dos
outros projetos. Não redistribua.
