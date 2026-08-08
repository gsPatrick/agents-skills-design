"use client";

import { useState } from "react";
import PillButton from "@/components/atoms/PillButton/PillButton";
import styles from "./CustomerStory.module.css";

/**
 * Customer story — switcher de 4 clientes.
 *
 * Camadas:   uma
 * Driver:    CLIQUE nos logos. Sem autoplay.
 * Estados:   4 discretos
 *
 * NÃO é um card peach. É um layout de duas colunas: citação + CTAs à
 * esquerda, retrato quadrado à direita, e uma fileira de 4 logos embaixo
 * com uma barra indicadora de 2px que desliza entre eles
 * (`left: index * 25%`, `width: 25%`).
 *
 * O retrato usa `mix-blend-multiply` sobre o fundo claro — sem overlay e
 * sem gradiente; é o blend que integra a foto à página.
 *
 * As larguras dos logos são fixas e diferentes entre si (70/80/105/115px),
 * porque cada marca tem proporção própria; normalizar por altura deixaria
 * uns gigantes e outros minúsculos.
 */
const BRANDS = [
  {
    alt: "voi",
    logo: "/logos/voi.svg",
    logoWidth: 70,
    image: "/media/customers-voi.jpg",
    quote: "“I have never seen BI adoption like this in my career.”",
    label: "Why Voi switched from Tableau to Steep",
  },
  {
    alt: "Juni",
    logo: "/logos/juni.svg",
    logoWidth: 80,
    image: "/media/customers-juni.jpg",
    quote:
      "“Steep hits the perfect balance between power and usability.”",
    label: "From data-blind to insight-led at Juni",
  },
  {
    alt: "Bounce",
    logo: "/logos/bounce.svg",
    logoWidth: 105,
    image: "/media/customers-bounce.jpg",
    quote: "“We tested 20 tools before choosing Steep.”",
    label: "How Bounce moved from shipping dashboards to metrics",
  },
  {
    alt: "Onceupon",
    logo: "/logos/onceupon.svg",
    logoWidth: 115,
    image: "/media/customers-onceupon.jpg",
    quote:
      "“There’s now one place where people can look for an answer.”",
    label: "Once Upon’s journey to metrics-first BI",
  },
];

export default function CustomerStory() {
  const [active, setActive] = useState(0);
  const step = 100 / BRANDS.length;
  const brand = BRANDS[active];

  return (
    <section className={styles.section} id="story">
      <div className="container">
        <div className={styles.row}>
          <div className={styles.col}>
            <a href="#story" className={styles.eyebrow}>
              Customer story
              <span className={styles.eyebrowArrow} aria-hidden="true">
                &rsaquo;
              </span>
            </a>

            <div className={styles.copy}>
              {/* A key força o remount para o fade reiniciar a cada troca. */}
              <h2 key={`q-${active}`} className={styles.quote}>
                {brand.quote}
              </h2>
              <p key={`l-${active}`} className={styles.label}>
                {brand.label}
              </p>
            </div>

            <div className={styles.actions}>
              <PillButton
                href="#story"
                variant="filled"
                size="regular"
                className={styles.readCta}
              >
                Read the story
                <span className={styles.arrowSlot} aria-hidden="true">
                  <span className={styles.arrow}>&rarr;</span>
                </span>
              </PillButton>
              <PillButton href="#story" variant="ghost" size="regular">
                All stories
              </PillButton>
            </div>

            {/* Fileira de logos + barra indicadora deslizante */}
            <div className={styles.brands}>
              <span
                className={styles.indicator}
                style={{ left: `${active * step}%`, width: `${step}%` }}
                aria-hidden="true"
              />
              {BRANDS.map((b, i) => (
                <button
                  key={b.alt}
                  type="button"
                  aria-label={`Read the ${b.alt} story`}
                  aria-pressed={i === active}
                  className={`${styles.brandBtn} ${
                    i === active ? styles.brandActive : ""
                  }`}
                  onClick={() => setActive(i)}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={b.logo}
                    alt={b.alt}
                    style={{ width: b.logoWidth }}
                    loading="lazy"
                  />
                </button>
              ))}
            </div>
          </div>

          <figure key={`i-${active}`} className={styles.portrait}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={brand.image}
              alt="Customer story"
              className={styles.portraitImg}
            />
          </figure>
        </div>
      </div>
    </section>
  );
}
