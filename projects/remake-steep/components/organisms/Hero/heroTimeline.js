/**
 * Timeline do hero — port literal da timeline GSAP do original.
 *
 * O original usa gsap.timeline({ scrollTrigger: { start:"top top", pin:true,
 * scrub:0.8, end:"+=" + 1.2*containerHeight } }). Aqui a mesma coisa é feita
 * com position:sticky + progresso de scroll + lerp, sem dependência.
 *
 * A duração total da timeline é 1.2s (o tween mais longo termina em 1.2), e
 * o progresso normalizado de scroll 0..1 mapeia para t = p * 1.2.
 */

export const TIMELINE_DURATION = 1.2;

/* Medidas responsivas — as fórmulas exatas do original. */
export function measure(width, height) {
  const scale = width === 0 || width >= 1360 ? 1 : Math.max((width - 160) / 1200, 0.5);
  const yOffset = 200 * clamp((height - 800) / 400, 0, 1);
  return { scale, yOffset, containerHeight: 1480 * scale };
}

export const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

/* Ease padrão do GSAP: power1.out */
const ease = (x) => 1 - (1 - x) * (1 - x);

/* Progresso dentro de um segmento (start, duration) da timeline. */
const seg = (t, start, duration = 0.5) =>
  ease(clamp((t - start) / duration, 0, 1));

const mix = (a, b, p) => a + (b - a) * p;

/**
 * Estados. `e` é o yOffset. Nomes preservados do bundle original para
 * rastreabilidade: A/S = título, C/T = dashboard, R/O = bloco rosa,
 * I/M = azul, z/F = cinza, D/G = campo de IA, L/B e V/H = cursores,
 * E/P = faixa de logos, Z/q = imagem de fundo, $/W = conteúdo do dashboard.
 */
export function states(e) {
  const T = { scale: 1, y: 200 };
  const z = { x: -20, y: -280 + e };
  const F = { x: 247, y: T.y - 354 };
  const D = { x: 660, y: -190 + e, width: 400 };
  const G = { x: 248, y: T.y - 740, width: 600 };

  return {
    title: { from: { opacity: 1, scale: 1, y: -90 + e }, to: { opacity: 0, scale: 0.5, y: -300 } },
    dashboard: { from: { scale: 0.8, y: 800, opacity: 0 }, to: { scale: 1, y: 200, opacity: 1 } },

    pink: { from: { x: 1100, y: -560 + e, shadow: 1 }, to: { x: 860, y: T.y - 600, shadow: 0 } },
    blue: { from: { x: -480, y: -750 + e, shadow: 1 }, to: { x: 247, y: T.y - 600, shadow: 0 } },
    gray: { from: { ...z, shadow: 1 }, to: { ...F, shadow: 0 } },

    ai: { from: { ...D, shadow: 1 }, to: { ...G, shadow: 1 } },
    /* Segunda fase (t 0.7→1.2): encolhe para a barra de busca do dashboard. */
    aiLate: { to: { x: 594, y: G.y - 80, width: 486, shadow: 0 } },

    cursorL: { from: { x: z.x - 50, y: z.y + 70 }, to: { x: F.x - 30, y: F.y + 60 } },
    cursorR: {
      from: { scale: 0.9, x: D.x + 120, y: D.y + 40 },
      to: { scale: 0.9, x: G.x + 480, y: G.y + 60 },
    },

    logos: { from: { y: 800 }, to: { y: 280 } },
    bg: { from: { y: 0 }, to: { y: -130 } },
    content: { from: { opacity: 0, y: 200 }, to: { opacity: 1, y: 84 } },
  };
}

/**
 * Avalia a timeline inteira em t ∈ [0, 1.2] e devolve o estilo de cada peça.
 * Os tempos (0, .2, .6, .7) e durações vêm direto das chamadas .fromTo/.to
 * do original.
 */
export function evaluate(t, e) {
  const s = states(e);
  const p0 = seg(t, 0); /* todos os fromTo estão em 0, duração padrão .5 */

  const lerp2 = (o, keys) =>
    Object.fromEntries(keys.map((k) => [k, mix(o.from[k], o.to[k], p0)]));

  /* Fades da segunda metade */
  const fadeCursors = 1 - seg(t, 0.6, 0.3);
  const fadeBlocks = 1 - seg(t, 0.7, 0.3);
  const fadeStart = 1 - seg(t, 0.6, 0.3);
  const pLate = seg(t, 0.7, 0.5);
  const pContent = seg(t, 0.7, 0.5);
  const pTyped = seg(t, 0.2, 0.4);

  const ai = lerp2(s.ai, ["x", "y", "width", "shadow"]);

  return {
    title: lerp2(s.title, ["opacity", "scale", "y"]),
    dashboard: lerp2(s.dashboard, ["scale", "y", "opacity"]),

    pink: { ...lerp2(s.pink, ["x", "y", "shadow"]), opacity: fadeBlocks },
    blue: { ...lerp2(s.blue, ["x", "y", "shadow"]), opacity: fadeBlocks },
    gray: { ...lerp2(s.gray, ["x", "y", "shadow"]), opacity: fadeBlocks },

    ai: {
      x: mix(ai.x, s.aiLate.to.x, pLate),
      y: mix(ai.y, s.aiLate.to.y, pLate),
      width: mix(ai.width, s.aiLate.to.width, pLate),
      shadow: mix(ai.shadow, s.aiLate.to.shadow, pLate),
      /* .ai-button-container: bg #F3F3F5 e altura 45 entre .7 e 1.2 */
      height: mix(100, 45, pLate),
      collapsed: pLate,
      /* .ai-button-text some em 0; o texto digitado revela largura em .2 */
      placeholderOpacity: 1 - p0,
      typed: pTyped,
      iconsOpacity: 1 - seg(t, 0.6, 0.2),
    },

    cursorL: { ...lerp2(s.cursorL, ["x", "y"]), opacity: fadeCursors },
    cursorR: { ...lerp2(s.cursorR, ["x", "y", "scale"]), opacity: fadeCursors },

    logos: lerp2(s.logos, ["y"]),
    bg: lerp2(s.bg, ["y"]),
    contentStart: { opacity: fadeStart },
    content: {
      opacity: mix(s.content.from.opacity, s.content.to.opacity, pContent),
      y: mix(s.content.from.y, s.content.to.y, pContent),
    },
  };
}

/* Sombra dos blocos — o token --block-shadow do original. */
export const BLOCK_SHADOW =
  "0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.05)";
