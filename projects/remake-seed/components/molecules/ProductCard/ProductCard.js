"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./ProductCard.module.css";

/**
 * Card de produto do carrossel.
 *
 * Estrutura do original (card-styled__CardFrame):
 *   <a>  ← o frame é transparente; o fundo verde é um ::before
 *     <span CardLabel>        badge
 *     <div CardBlock top>
 *       <div CardPills><span PillWrapper>DS–01<sup>®</sup></span></div>
 *       <p TypeBodyLarge>     nome
 *     <div MediaContainer><video poster>
 *     <div CardBlock bottom>
 *       <button>Shop Now<span IconWrapper><svg>
 *       <p TypeCaption>       "Starting at $49.99"
 *
 * O crescimento no hover não é do card — é do ::before, que já tem
 * `height: calc(100% + 50px)` e vai de `scaleY(0.9)` a `scaleY(1)`.
 * Ver o CSS para o porquê.
 *
 * O vídeo só gira no estado ativo; em repouso fica no poster.
 */
export default function ProductCard({
  badge,
  badgeTone,
  code,
  sup,
  name,
  price,
  video,
  poster,
}) {
  const ref = useRef(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    v.muted = true;
    v.defaultMuted = true;
    if (active) {
      const p = v.play();
      if (p && typeof p.catch === "function") p.catch(() => {});
    } else {
      v.pause();
      v.currentTime = 0;
    }
  }, [active]);

  return (
    <a
      href="#shop"
      className={styles.card}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
      onFocus={() => setActive(true)}
      onBlur={() => setActive(false)}
    >
      <span className={`${styles.badge} ${styles[badgeTone]}`}>{badge}</span>

      <div className={styles.pills}>
        <span className={styles.code}>
          {code}
          <sup>{sup}</sup>
        </span>
      </div>

      <p className={styles.name}>{name}</p>

      <div className={styles.stage}>
        <video
          ref={ref}
          src={video}
          poster={poster}
          className={styles.video}
          playsInline
          loop
          muted
          preload="metadata"
          disablePictureInPicture
          aria-hidden="true"
          tabIndex={-1}
        />
      </div>

      <div className={styles.bottom}>
        <span className={styles.cta}>
          Shop Now
          <span className={styles.ctaIcon} aria-hidden="true">
            <svg viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                fill="currentColor"
                fillRule="evenodd"
                d="M5.5 0 11 5.5 5.5 11 4.406 9.906l3.631-3.632H0V4.726h8.037L4.406 1.094 5.5 0Z"
                clipRule="evenodd"
              />
            </svg>
          </span>
        </span>

        <p className={styles.price}>{price}</p>
      </div>
    </a>
  );
}
