"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./Bookend.module.css";

/**
 * Bookend — fecha a página com dois cartões quadrados.
 *
 * Camadas:   foto de fundo → conteúdo centrado
 * Driver:    IntersectionObserver na palavra "Labs"
 * Estados:   oculto → is-visible
 *
 * Medido em 1440px, relativo ao topo da seção:
 *   seção      825 alto   padding 80px 32px   bg #FCFCF7
 *   grid       12 colunas de 84.08px   gap 32px
 *   frame 1     32,80,665,665   radius 16px   QUADRADO
 *   frame 2    729,80,665,665
 *   eyebrow     46,299,18,187   12px/300   rotate(90°)
 *   "Seed"     259,330,211,44   40px/350   lh 44   ls −0.4px
 *   【Labs】    385,330,85,44
 *   Read More  300,443,128,52   radius 1000px   fundo branco
 *   Shop Now   999,504,124,52
 *
 * O eyebrow "● Lipari, Panarea — Italy" é girado 90° e corre na vertical
 * pela lateral esquerda da foto — matrix(0, 1, -1, 0, 0, 0) medida no
 * original. É crédito de locação tratado como marca d'água editorial.
 *
 * A palavra "Labs" vive num wrapper que ganha a classe `is-visible` quando
 * entra na tela: os colchetes 【】 abrem a partir do centro e a palavra
 * aparece entre eles. É o mesmo glyph do eyebrow da MicrobioSection — vira
 * assinatura da marca em vez de ornamento avulso.
 */
export default function Bookend() {
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
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section ref={ref} className={styles.section}>
      <div className={styles.grid}>
        <div
          className={styles.frame}
          style={{ backgroundImage: "url(/media/bookend-labs.jpg)" }}
        >
          <p className={styles.eyebrow}>
            <span className={styles.dot} aria-hidden="true" />
            Lipari, Panarea — Italy
          </p>

          <div className={styles.content}>
            <p className={styles.title}>
              Seed
              <span
                className={`${styles.wordWrap} ${visivel ? styles.isVisible : ""}`}
              >
                <span className={styles.bracket} aria-hidden="true">
                  【
                </span>
                <span className={styles.word}>Labs</span>
                <span className={styles.bracket} aria-hidden="true">
                  】
                </span>
              </span>
            </p>

            <p className={styles.body}>Because health is not just human.</p>

            <a href="/seedlabs" className={styles.cta}>
              Read More
            </a>
          </div>
        </div>

        <div
          className={styles.frame}
          style={{ backgroundImage: "url(/media/bookend-shop.png)" }}
        >
          <div className={styles.content}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/media/bookend-caps.png"
              alt=""
              width={232}
              height={142}
              className={styles.caps}
            />

            <p className={`${styles.title} ${styles.titleShop}`}>
              Change your gut health for good.*
            </p>

            <p className={styles.body}>
              Feel lasting relief in one week with DS-01<sup>®</sup>*
            </p>

            <a href="/daily-synbiotic" className={styles.cta}>
              Shop Now
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
