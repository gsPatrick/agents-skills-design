---
name: mhtml-reference-extraction
description: >-
  Extracts layout structure, sizing, and CSS values from saved MHTML reference
  files for landing page remakes. Use when working with .mhtml files, matching
  reference dimensions, or debugging layout differences between remake and
  original.
---

# MHTML Reference Extraction

## What MHTML gives you

- Exact Tailwind/class strings at save time
- Spacing, max-widths, breakpoints, font sizes
- DOM hierarchy and section order
- Static layout — not live scroll animations

## How to read it

1. Search for section IDs or headings (`coordinator-section`, `blog-list`, etc.)
2. Note the class chain on each wrapper — outer padding vs inner max-width
3. Record key values in a table:

| Element | Reference classes | CSS equivalent |
|---------|-------------------|----------------|
| Section | `px-5 md:px-8 xl:px-12` | 20 / 32 / 48px |
| Container | `max-w-[1080px] mx-auto lg:px-5` | 1080px + 20px inline |
| Card | `lg:min-h-[800px] lg:p-[80px]` | 800px min, 80px pad |

4. Check parent `overflow` (`overflow-clip lg:overflow-visible`)
5. Separate structure MHTML from animation HTM — use HTM only for motion timing

## Common pitfalls

- **Double padding**: section padding + container padding + wrap padding
- **Sticky + overflow-clip**: clips content taller than sticky min-height
- **items-start vs stretch**: children need explicit `width: 100%` with `items-start`
- **Breakpoint mapping**: Tailwind `xl` = 1280px, `lg` = 1024px

## Verification checklist

- [ ] Section order matches reference DOM
- [ ] Max-width containers match (1080, 1280, 7xl, etc.)
- [ ] Font families loaded and applied
- [ ] Background images/positions match (`bg-position`, `bg-bottom`)
- [ ] Mobile-first padding scale matches

---

## Vídeo em streaming (Mux, HLS)

Um `<mux-player>` não expõe arquivo baixável, mas o manifest HLS é público.
O `playback-id` está nos atributos do elemento:

```js
document.querySelector('mux-player').getAttribute('playback-id')
```

Com ele:

```bash
# vídeo — -c copy não recodifica, então não há perda
ffmpeg -i "https://stream.mux.com/{playback-id}.m3u8" -c copy saida.mp4

# frame como imagem (o time= vem do atributo thumbnail-time do player)
curl -L "https://image.mux.com/{playback-id}/thumbnail.png?width=1280&time=3" -o poster.png
```

**Os originais vêm sem otimização** — 1920×1080, 80 MB para 2 minutos.
Recomprima para entrega:

```bash
ffmpeg -i entrada.mp4 -vf "scale=1280:-2" -c:v libx264 -crf 26 -preset slow \
  -pix_fmt yuv420p -movflags +faststart -an saida.mp4
```

O `-an` remove o áudio quando o vídeo toca mudo — corta tamanho de graça.

**Frame vazio:** se um thumbnail voltar muito menor que os vizinhos (8 KB
contra 400 KB), é quadro em branco. Sonde vários `time=` e compare o tamanho
do arquivo antes de abrir.

## Assets que não aparecem varrendo tags

Uma varredura por `<img>`, `<video>`, `<mux-player>` **não encontra**:

- `background-image` em `<div>` — busque por `getComputedStyle(e).backgroundImage !== 'none'`
- camadas `position: fixed` — a coordenada não tem relação com o fluxo, então
  filtros por proximidade as perdem
- `scrollLeft` dirigido por JS — não existe em `getComputedStyle`

Ao inventariar uma página, varra por **propriedade**, não por tag.
