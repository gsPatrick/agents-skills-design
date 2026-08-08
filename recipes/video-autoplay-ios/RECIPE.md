# Autoplay de vídeo que funciona no iOS

**Problema:** o vídeo roda no seu Mac, roda no Chrome, e fica congelado no
primeiro frame no iPhone do cliente.

**Fonte:** `projects/remake-summer-drive/components/organisms/FlankingCTA/DriveVideo.js`

Toda receita que usa vídeo — [sticky-video-backdrop](../sticky-video-backdrop/),
[frame-expand-fullbleed](../frame-expand-fullbleed/),
[parallax-footer-reveal](../parallax-footer-reveal/) — depende desta.

---

## As três camadas de defesa

### 1. Os atributos

```jsx
<video src="/video.mp4" autoPlay playsInline loop muted preload="auto"
       disablePictureInPicture aria-hidden="true" tabIndex={-1} />
```

- `playsInline` — **sem isto o iOS abre o vídeo em tela cheia** ao dar play.
  Fatal para vídeo de fundo.
- `muted` — autoplay com som é bloqueado em todo navegador moderno
- `aria-hidden` + `tabIndex={-1}` — vídeo decorativo não deve receber foco nem
  ser anunciado

### 2. Forçar `muted` na propriedade (o pulo do gato)

```js
video.muted = true;
video.defaultMuted = true;
```

**O React/Next nem sempre emite o atributo `muted` no HTML do servidor.** É um
comportamento conhecido: o React trata `muted` como propriedade do DOM, não como
atributo. O iOS Safari lê o HTML inicial, não vê `muted`, e bloqueia o autoplay
antes de qualquer JS rodar.

Definir a **propriedade** no `useEffect` corrige. `defaultMuted` também define o
atributo, cobrindo o caso de o elemento ser reinicializado.

Este é o motivo nº1 de "o vídeo não roda no iPhone" em projetos Next.js.

### 3. Play explícito, com fallback

```js
const tryPlay = () => {
  const p = video.play();
  if (p && typeof p.catch === "function") p.catch(() => {});
};

tryPlay();
video.addEventListener("loadeddata", tryPlay);
```

`video.play()` retorna uma Promise que **rejeita** se o navegador bloquear.
Sem o `.catch()` você recebe um "Unhandled Promise Rejection" no console —
barulho, e em alguns setups quebra o error boundary.

O `.catch()` vazio é intencional: falhar aqui é esperado e tratado pela camada 4.

O listener em `loadeddata` cobre a corrida: se o `useEffect` roda antes do vídeo
ter dados, o primeiro `play()` falha silenciosamente e o segundo pega.

### 4. Último recurso: primeira interação

```js
const onFirstInteraction = () => {
  tryPlay();
  window.removeEventListener("touchstart", onFirstInteraction);
  window.removeEventListener("click", onFirstInteraction);
};
window.addEventListener("touchstart", onFirstInteraction, { passive: true });
window.addEventListener("click", onFirstInteraction);
```

Em **Modo de Baixo Consumo** o iOS bloqueia todo autoplay, sem exceção. Nada que
você faça no código muda isso.

Mas o bloqueio é liberado por um "gesto do usuário". Este listener aproveita o
primeiro toque ou clique em qualquer lugar da página — o usuário rola, e o vídeo
começa. Ele nunca percebe que houve um bloqueio.

Os listeners se auto-removem no primeiro disparo.

## Cleanup completo

```js
return () => {
  video.removeEventListener("loadeddata", tryPlay);
  window.removeEventListener("touchstart", onFirstInteraction);
  window.removeEventListener("click", onFirstInteraction);
};
```

Sem isso, cada navegação acumula listeners globais.

## Checklist de vídeo de fundo

- [ ] `playsInline` presente (senão: tela cheia no iOS)
- [ ] `muted` como atributo **e** como propriedade via JS
- [ ] `.play()` com `.catch()` — nunca sem
- [ ] Listener de `loadeddata` para a corrida de inicialização
- [ ] Fallback na primeira interação para Modo de Baixo Consumo
- [ ] `aria-hidden="true"` + `tabIndex={-1}` se for decorativo
- [ ] Arquivo abaixo de ~3MB — vídeo de fundo em 4K é desrespeito com o plano
      de dados de quem visita
- [ ] `poster` com o primeiro frame, para o caso de tudo falhar

## Armadilhas

- ❌ Confiar só nos atributos JSX → falha no iOS por causa do SSR do `muted`
- ❌ `.play()` sem `.catch()` → unhandled rejection
- ❌ Sem `playsInline` → abre em tela cheia
- ❌ Vídeo com faixa de áudio (mesmo mudo) → arquivo maior sem motivo; remova
      no encode
- ❌ Sem `poster` → retângulo preto enquanto carrega

## `prefers-reduced-motion`

Vídeo em loop é movimento contínuo. O correto é substituir por um frame estático:

```jsx
const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
// se reduced: renderize <img src={poster} /> em vez do <video>
```

Nenhum dos três projetos faz isso hoje — **é uma lacuna conhecida do portfólio**,
registrada aqui para ser corrigida no próximo projeto.
