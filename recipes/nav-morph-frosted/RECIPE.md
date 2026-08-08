# Nav que vira pílula fosca ao rolar

**Efeito:** o nav começa transparente sobre o herói e, ao primeiro scroll,
condensa numa barra/pílula com vidro fosco.

**Fonte:** `projects/remake-integrated-biosciences/components/organisms/NavBar/NavBar.js`

---

## O gatilho

```js
const [scrolled, setScrolled] = useState(false);

useEffect(() => {
  const onScroll = () => setScrolled(window.scrollY > 8);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
  return () => window.removeEventListener("scroll", onScroll);
}, []);

<header className={`${styles.header} ${scrolled ? styles.scrolled : ""}`}>
```

Um booleano. Não interpole com o scroll — a transição de estado discreta é mais
nítida que uma opacidade proporcional, que fica num limbo meio-transparente.

**`> 8`, não `> 0`:** trackpads emitem microdeltas; com `> 0` o nav tremula
entre os dois estados quando o usuário só encosta no touchpad.

## Sincronizar com o herói

Este `8` é o **mesmo threshold** do
[frame-expand-fullbleed](../frame-expand-fullbleed/). O vídeo estoura para
full-bleed e o nav condensa no mesmo instante — lê como uma coreografia única,
não como dois componentes reagindo separadamente.

Se você mudar um, mude o outro.

## O vidro fosco

```css
.scrolled .inner {
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  background: rgba(255, 255, 255, 0.72);
  border: 1px solid rgba(255, 255, 255, 0.6);
  border-radius: 50px;
  box-shadow: 0 1px 8px rgba(0, 0, 0, 0.05);
}
```

Os cinco valores que fazem parecer vidro de verdade:

| Propriedade | Papel |
|---|---|
| `backdrop-filter: blur(20px)` | o desfoque. Abaixo de 12px não lê como vidro |
| `background: rgba(…, 0.72)` | opacidade. Sem ela o texto fica ilegível sobre conteúdo claro |
| `border: 1px rgba(255,255,255,0.6)` | a **borda é o que vende o efeito** — simula o canto refratando luz |
| `border-radius: 50px` | pílula. Um retângulo fosco parece uma barra de sistema |
| `box-shadow` sutil | separa do fundo. `0.05` de alpha, não mais |

`-webkit-backdrop-filter` ainda é necessário para Safari.

## Custo de performance

`backdrop-filter` recompõe tudo atrás do elemento a cada frame de scroll. Em
elemento pequeno e fixo é aceitável. **Nunca** aplique em algo grande ou em
vários elementos ao mesmo tempo.

Se o nav engasgar em mobile, remova o blur abaixo de `md` e use background
sólido — ninguém vai notar.

## Anatomia

```
header (fixed, top: 0, z-index alto, largura total)
  div.inner (container — é ESTE que ganha o fundo fosco)
    logo | nav > ul > li[] | cta | burger
  div.popup (overlay mobile)
```

O `header` externo fica transparente e cheio de largura; o `.inner` é quem
recebe o vidro. Assim a pílula respeita o `max-width` do container em vez de
grudar nas bordas.

## Armadilhas

- ❌ `> 0` em vez de `> 8` → tremula
- ❌ Fundo fosco no `header` externo → barra colada nas bordas, não pílula
- ❌ Esquecer `-webkit-backdrop-filter` → Safari mostra fundo chapado
- ❌ Sem `background` semi-opaco → só blur não garante contraste
- ❌ Sem a `border` clara → parece um retângulo borrado, não vidro
- ❌ `backdrop-filter` em vários elementos → queda de frames

## Reduced motion

```css
@media (prefers-reduced-motion: reduce) {
  .header, .inner { transition: none; }
}
```

O estado ainda muda — só sem interpolar.
