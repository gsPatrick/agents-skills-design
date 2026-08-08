"use client";

import { useRef, useState } from "react";
import styles from "./ReviewCarousel.module.css";

/**
 * ReviewCarousel — "Over 1 million health transformations (and counting)."
 *
 * Camadas:   uma
 * Driver:    scroll horizontal com snap (o original usa Swiper)
 * Estados:   pausado (padrão) · tocando · mudo/com som
 *
 * Medido em 1440px, relativo ao topo da seção:
 *   seção      1075 alto   bg #FCFCF7   padding 165px 0 133px
 *   título     370,165,700,106   48px/350  lh 52.8  ls −0.72px  CENTRALIZADO
 *   subhead    515,295,409,21    16px/350  lh 20.8  ls −0.16px
 *   slide 1    263,360,913,514   ← ativo: maior e 13px mais alto
 *   slide 2   1251,373,868,488   ← inativo
 *
 * Os vídeos ficam PAUSADOS por padrão, com pôster e botão de play central.
 * São depoimentos com áudio — tocar sozinho seria intrusivo. Diferente dos
 * vídeos decorativos da página (cápsula, cabeça), que rodam em loop mudo.
 *
 * A barra de controles inferior usa um filtro GOOEY: feGaussianBlur(7) +
 * feColorMatrix com alfa 19/−11. É o efeito metaball — quando o círculo de
 * unmute e a pílula de progresso se aproximam, as bordas derretem uma na
 * outra em vez de se sobrepor. Sem o filtro viram duas formas soltas.
 */
const SLIDES = [
  { id: "review-1", nome: "Zam" },
  { id: "review-2", nome: "Alice" },
];

export default function ReviewCarousel() {
  const trackRef = useRef(null);
  const videoRefs = useRef([]);
  const [ativo, setAtivo] = useState(0);
  const [tocando, setTocando] = useState(-1);
  const [mudo, setMudo] = useState(true);

  const onScroll = () => {
    const t = trackRef.current;
    if (!t) return;
    const mid = t.scrollLeft + t.clientWidth / 2;
    let best = 0;
    let dist = Infinity;
    Array.from(t.children).forEach((c, i) => {
      const d = Math.abs(c.offsetLeft + c.clientWidth / 2 - mid);
      if (d < dist) {
        dist = d;
        best = i;
      }
    });
    setAtivo(best);
  };

  const alternar = (i) => {
    const v = videoRefs.current[i];
    if (!v) return;
    if (v.paused) {
      videoRefs.current.forEach((o, j) => j !== i && o && o.pause());
      v.play();
      setTocando(i);
    } else {
      v.pause();
      setTocando(-1);
    }
  };

  return (
    <section className={styles.section} id="reviews">
      <header className={styles.head}>
        <h2 className={styles.title}>
          Over 1 million health transformations (and counting).
        </h2>
        <p className={styles.subhead}>
          See how real people are changing their health with Seed.
        </p>
      </header>

      <div ref={trackRef} className={styles.track} onScroll={onScroll}>
        {SLIDES.map((s, i) => (
          <div
            key={s.id}
            className={`${styles.slide} ${i === ativo ? styles.ativo : ""}`}
          >
            <button
              type="button"
              className={styles.fullscreen}
              aria-label="Fullscreen"
            >
              <svg viewBox="0 0 16 16" fill="none" width="16" height="16">
                <path d="M7 4H5C4.44772 4 4 4.44772 4 5V7" stroke="currentColor" strokeWidth="1.5" />
                <path d="M7 12H5C4.44772 12 4 11.5523 4 11V9" stroke="currentColor" strokeWidth="1.5" />
                <path d="M9 4H11C11.5523 4 12 4.44772 12 5V7" stroke="currentColor" strokeWidth="1.5" />
                <path d="M9 12H11C11.5523 12 12 11.5523 12 11V9" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </button>

            <video
              ref={(el) => (videoRefs.current[i] = el)}
              src={`/media/${s.id}.mp4`}
              poster={`/media/${s.id}-poster.png`}
              className={styles.video}
              playsInline
              muted={mudo}
              preload="metadata"
              onEnded={() => setTocando(-1)}
            />

            {tocando !== i && (
              <button
                type="button"
                className={styles.play}
                onClick={() => alternar(i)}
                aria-label={`Play ${s.nome}`}
              >
                <svg viewBox="0 0 18 14" width="34" height="34" fill="currentColor">
                  <path d="M15.5987 6.2911L3.45577 0.110898C2.83667 -0.204202 2.06287 0.189698 2.06287 0.819798V13.1802C2.06287 13.8103 2.83667 14.2042 3.45577 13.8891L15.5987 7.7089C16.2178 7.3938 16.2178 6.6061 15.5987 6.2911Z" />
                </svg>
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Filtro gooey: o blur espalha as bordas e a matriz de cor devolve o
          alfa com contraste altíssimo (19/−11), recortando um contorno único
          onde as formas se tocam. */}
      <svg className={styles.defs} aria-hidden="true">
        <defs>
          <filter id="gooey">
            <feGaussianBlur in="SourceGraphic" stdDeviation="7" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -11"
              result="gooey"
            />
            <feComposite in="SourceGraphic" in2="gooey" />
          </filter>
        </defs>
      </svg>

      <div className={styles.pagination}>
        <div className={styles.controls}>
          <button
            type="button"
            className={styles.mute}
            onClick={() => setMudo((m) => !m)}
            aria-label={mudo ? "Unmute" : "Mute"}
          >
            <svg viewBox="0 0 16 16" fill="none" width="16" height="16">
              <path d="M3 6H5V10H3V6Z" fill="currentColor" />
              <path d="M5 6L8 4V12L5 10V6Z" fill="currentColor" />
              {mudo ? (
                <path d="M10 6L14 10M14 6L10 10" stroke="currentColor" strokeWidth="1.5" />
              ) : (
                <path d="M10.5 5.5a3.5 3.5 0 0 1 0 5" stroke="currentColor" strokeWidth="1.5" />
              )}
            </svg>
          </button>
        </div>

        <div className={styles.thumbs}>
          <div className={styles.progressWrap}>
            <span className={styles.progressBuffer} />
            <span className={styles.progressBar} />
            <button
              type="button"
              className={styles.progressBtn}
              onClick={() => alternar(ativo)}
            >
              <svg viewBox="0 0 16 16" fill="currentColor" width="16" height="16">
                <path d="M12.4231 8L5.5 12.5L5.5 3.5L12.4231 8Z" />
              </svg>
              {SLIDES[ativo].nome}
            </button>
          </div>

          <div className={styles.avatar}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/media/review-1-avatar.png" alt="" />
          </div>
        </div>
      </div>
    </section>
  );
}
