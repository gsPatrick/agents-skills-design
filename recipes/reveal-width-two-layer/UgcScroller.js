"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./UgcScroller.module.css";

/**
 * UgcScroller — "Stories from scientists, innovators, and members like you."
 *
 * Camadas:   uma
 * Driver:    DUAS coisas independentes —
 *            1. IntersectionObserver dispara a revelação (width + transform)
 *            2. o scroll da PÁGINA dirige o scrollLeft do trilho
 * Estados:   oculto → revelado
 *
 * Medido em 1440px. São DUAS seções irmãs no original:
 *   HeadlineWrapper   1440×246   padding 32px   título 32,32,500,158
 *   ugc Wrapper       1440×501   padding 32px   scroller inline-grid gap 16
 *
 * Os 9 frames, relativos ao topo do wrapper:
 *   1   26,32,430,430    radius 100%     círculo
 *   2  472,32,276,429    radius 16px
 *   3  764,32,276,429    radius 16px     vídeo mux 9/16
 *   4 1056,32,322,207    radius 1000px   pílula
 *   5 1056,255,322,207   radius 16px
 *   6 1394,32,276,429    radius 16px     vídeo mux 9/16
 *   7 1686,32,276,429    radius 16px
 *   8 1978,32,322,207    radius 16px
 *   9 1978,255,322,207   radius 1000px   pílula
 *
 * A ANIMAÇÃO é na LARGURA, não em opacidade ou transform:
 *   transition: width 0.6s cubic-bezier(0.75, 0, 0.25, 1) 0.4s
 *
 * Cada frame cresce de 0 até a largura final, ancorado à esquerda. O atraso
 * de 0.4s é fixo para todos — não é escalonado por índice. O resultado é um
 * "abrir de leque" simultâneo, e não uma cascata.
 *
 * A curva (0.75, 0, 0.25, 1) é simétrica e agressiva nas duas pontas: quase
 * nada acontece nos primeiros 25% do tempo, o meio dispara, e freia forte no
 * fim. É o oposto do ease-out padrão da página.
 *
 * As três formas — círculo, pílula e retângulo — se alternam sem repetir a
 * mesma duas vezes seguidas na horizontal. É o que impede a grade de parecer
 * um mosaico de fotos.
 */
const FRAMES = [
  { src: "/media/ugc-1.png", forma: "circulo", w: 430, span: 2 },
  { src: "/media/ugc-2.png", forma: "arred", w: 276, span: 2 },
  { video: "ugc-1", forma: "arred", w: 276, span: 2 },
  { src: "/media/ugc-3.png", forma: "pilula", w: 322, span: 1 },
  { src: "/media/ugc-4.png", forma: "arred", w: 322, span: 1 },
  { video: "ugc-2", forma: "arred", w: 276, span: 2 },
  { src: "/media/ugc-5.png", forma: "arred", w: 276, span: 2 },
  { src: "/media/ugc-6.png", forma: "arred", w: 322, span: 1 },
  { src: "/media/ugc-7.png", forma: "pilula", w: 322, span: 1 },
];

export default function UgcScroller() {
  const ref = useRef(null);
  const [visivel, setVisivel] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setVisivel(true);
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => e.isIntersecting && setVisivel(true),
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  /* Parallax horizontal: 0.5× o scroll da página, a partir de 540px do topo. */
  const trilho = useRef(null);

  useEffect(() => {
    const sec = ref.current;
    const t = trilho.current;
    if (!sec || !t) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    const aplicar = () => {
      raf = 0;
      const topo = sec.getBoundingClientRect().top;
      const avanco = Math.max(0, (552 - topo) * 0.5);
      t.scrollLeft = Math.min(avanco, t.scrollWidth - t.clientWidth);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(aplicar);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    aplicar();
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <section className={styles.headline}>
        <h2 className={styles.title}>
          Stories from scientists, innovators, and members like you.
        </h2>
      </section>

      <section ref={ref} className={styles.section}>
        {/* DOIS elementos: o viewport rola (largura da tela) e o grid vive
            dentro dele. Um inline-grid sozinho dimensiona pelo conteúdo, então
            scrollWidth == clientWidth e não sobra faixa para rolar. */}
        <div ref={trilho} className={styles.viewport}>
          <div className={`${styles.scroller} ${visivel ? styles.visivel : ""}`}>
          {FRAMES.map((f, i) => (
            <div
              key={i}
              className={`${styles.frame} ${styles[f.forma]} ${
                f.span === 2 ? styles.alto : ""
              }`}
              style={{ "--w": `${f.w}px` }}
            >
              {f.video ? (
                <video
                  src={`/media/${f.video}.mp4`}
                  poster={`/media/${f.video}-poster.png`}
                  className={styles.media}
                  muted
                  playsInline
                  preload="metadata"
                  disablePictureInPicture
                  aria-hidden="true"
                  tabIndex={-1}
                />
              ) : (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={f.src} alt="" className={styles.media} draggable={false} />
              )}
            </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
