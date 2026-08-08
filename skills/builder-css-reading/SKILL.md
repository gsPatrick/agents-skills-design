---
name: builder-css-reading
description: >-
  Como ler o CSS de um site feito em builder (Webflow, Framer, Squarespace,
  Wix) sem pegar a regra errada. Use SEMPRE que clonar ou replicar um site
  cujo markup tenha classes utilitárias compostas — junto com
  measurement-protocol.
disable-model-invocation: false
---

# Builder CSS Reading

Sites de builder **compõem por classes utilitárias**. Um elemento com
`class="a b c"` tem regras para `.a`, `.a.b` e `.a.b.c` — e **a regra base
quase nunca é a que vale**.

Buscar por um seletor e parar no primeiro resultado é a forma mais rápida de
construir a seção errada com convicção.

---

## 1. Extraia por LISTA DE CLASSES, não por seletor

Errado:
```python
re.search(r'\.title_row\s*\{([^}]+)\}', css)   # pega a base e para
```

Certo — todas as regras que mencionem qualquer classe do elemento:
```python
alvo = ['title_row', 'is-centered2', 'is-small-gap']
for m in re.finditer(r'([^{}@]{2,140})\{([^}]{5,320})\}', css):
    sel = re.sub(r'\s+', ' ', m.group(1)).strip()
    if not any(a in sel for a in alvo): continue
    print(sel, '->', m.group(2))
```

Depois leia **na ordem de especificidade**: `.a` → `.a.b` → `.a.b.c`.

Casos reais de um único clone:

| Elemento | Base | Variante que manda |
|---|---|---|
| `.section-sp2_intro` | gradiente cinza→branco | `.is-home`: direção OPOSTA + padding |
| `.title_row` | esquerda, 45rem | `.is-centered2`: centro, 50rem |
| `.button-wrap` | — | `display: none` |
| `.footer2_component` | `gap: 14rem` | `.is-gap`: 3rem |

---

## 2. Há DUAS fontes de CSS, e nenhuma basta

| Fonte | O que traz |
|---|---|
| `*.css` compilado | estrutura: largura, padding, gap, raio, blur |
| `<style>` embutidos no `.htm` | overrides, temas, estados, morphs |

O tema escuro de uma seção pode estar num `<style>` solto no fim do HTML, com
seletores descendentes (`.wrap .filho`) que não existem no `.css`.

Junte as duas antes de buscar:
```python
css = "".join(open(f).read() for f in glob("*_files/*.css"))
css += open("pagina.htm").read()   # os <style> embutidos
```

---

## 3. O JavaScript sobrescreve o CSS

Regras que existem e **nunca se aplicam**, porque o script escreve inline:

- `.bar.is-active { background: #18181b }` — mas o driver escreve
  `style.backgroundColor = 'rgba(24,24,27,0.2)'` em todas
- `flex-grow: 6` no CSS, `flexGrow = 8` no script
- `max-width: 39rem` que só existe inline, escrito no boot

Antes de confiar num valor, procure o nome da propriedade no `<script>`.
Se o script escreve, o CSS é letra morta — reproduza o **resultado**, não a
intenção abandonada.

---

## 4. Assets locais costumam ser stubs

Builders salvam placeholders de lazy-load. Um `.avif` de 491 bytes é LQIP,
não a imagem.

```bash
[ $(stat -f%z "$arq") -lt 4000 ] && curl -sfL "$CDN/$(urlencode $nome)" -o "$arq"
```

Vídeos em CDN com hotlink protection (Bunny, por exemplo) devolvem 403 sem
`Referer`:
```bash
ffmpeg -headers $'Referer: https://site.com/\r\n' -i URL -c copy saida.mp4
```

---

## 5. Fontes: varra TODOS os `@font-face`

Um `@font-face` do Typekit com URL tokenizada leva a concluir "não é
auto-hospedável" — e pode haver a fonte de verdade num `.woff2` aberto no
CDN do builder, mais adiante no arquivo.

Não pare nos primeiros resultados.

---

## 6. Raiz fluida

Se os valores medidos saem fracionários (`14.9916px`, `11.2437px`), o root
font-size escala com a viewport. Meça em três larguras e derive a reta:

```
1200 → 14.4874   1440 → 14.9916   1920 → 16.0000
root = 11.97px + 0.2101vw
```

**Escreva em rem.** Px fixo conserta uma largura e quebra as outras.

---

## Checklist

- [ ] Juntei o `.css` compilado E os `<style>` embutidos
- [ ] Busquei por lista de classes, não por seletor
- [ ] Li na ordem de especificidade
- [ ] Procurei no `<script>` as propriedades que vou usar
- [ ] Conferi se os assets locais são stubs
- [ ] Varri todos os `@font-face`, não só os primeiros
- [ ] Verifiquei se a raiz é fluida antes de escrever qualquer valor

Depois disso, siga o
[`measurement-protocol`](../measurement-protocol/SKILL.md) para validar no
navegador.
