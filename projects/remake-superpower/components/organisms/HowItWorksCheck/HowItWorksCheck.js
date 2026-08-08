"use client";

import { useEffect, useRef } from "react";
import styles from "./HowItWorksCheck.module.css";

/**
 * HowItWorksCheck — "How it works"
 *
 * Camadas:   uma
 * Driver:    IntersectionObserver (o sistema `data-stagger` do original)
 * Estados:   oculto → is-visible
 *
 * Do CSS original:
 *   .padding-section-large  padding-block 7rem
 *   .container-large        max-width 80rem
 *   .title_row              max-width 45rem, gap 1.5rem
 *   .sp2-check_grid         4 colunas, gap .5rem
 *   .sp2-check_image        aspect-ratio 1, radius .75rem, object-fit cover
 *   .check-item_number      1.875rem, radius .375rem
 *                           background #0003 + backdrop-filter blur(16px)
 *
 * O STAGGER é escalonado por índice — cada filho recebe `--i` e o atraso é
 * `--i × --stagger-delay`. Diferente do leque de atraso FIXO da Seed: aqui
 * os itens entram um após o outro, em cascata.
 *
 *   opacity   var(--stagger-duration, .75s) linear
 *   transform var(--stagger-duration, .75s) cubic-bezier(.22, 1, .36, 1)
 *   distância var(--stagger-distance, 1.5rem)
 *
 * Curvas DIFERENTES para as duas propriedades: a opacidade é linear e o
 * deslocamento tem expo-out. O texto termina de posicionar antes de
 * terminar de aparecer.
 *
 * O observer usa `rootMargin: '0px 0px -10% 0px'` — dispara 10% antes do
 * fundo da viewport, não na borda — e faz `unobserve` depois: a animação
 * acontece uma vez só.
 */
const PASSOS = [
  ["Test your baseline", "One simple blood draw to measure 100+ biomarkers."],
  ["Results explained", "Get a complete picture of your health data in one secure location."],
  ["Build your protocol", "AI builds evidence-backed protocols, informed by your data."],
  ["Access everything", "Take action, access everything you need, then retest. You're in control."],
];

export default function HowItWorksCheck() {
  const gridRef = useRef(null);

  useEffect(() => {
    const el = gridRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          e.target.classList.add(styles.isVisible);
          io.unobserve(e.target);
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section className={styles.section}>
      <div className={styles.pagePadding}>
        <div className={styles.container}>
          <div className={styles.component}>
            <div className={styles.titleRow}>
              <h2 className={styles.h2}>How it works</h2>
              <p className={styles.sub}>
                It starts with an advanced health check,{" "}
                <span className={styles.nowrapMobile}>then so much more.</span>
              </p>
            </div>

            <div ref={gridRef} className={styles.grid}>
              {PASSOS.map(([titulo, texto], i) => (
                <div
                  key={titulo}
                  className={styles.item}
                  style={{ "--i": i }}
                >
                  <div className={styles.imageWrap}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`/media/check-${i + 1}.avif`}
                      alt=""
                      className={styles.image}
                    />
                    <div className={styles.number}>{i + 1}</div>
                  </div>
                  <div className={styles.content}>
                    <div className={styles.h4}>{titulo}</div>
                    <div className={styles.secondary}>{texto}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.buttonWrap}>
              <a href="/register" className={styles.btn}>
                Become a member
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
