"use client";

import { useRef } from "react";
import styles from "./Clinicians.module.css";

/**
 * Clinicians — "Led by doctors with 40 years of health and longevity expertise"
 *
 * Camadas:   uma
 * Driver:    arrasto do mouse / scroll horizontal
 * Estados:   um
 *
 * Do CSS original:
 *   .clinicians_slider-wrapper  width calc(50vw + 50%)  ← SANGRA à direita
 *                               margin-top 4rem, overflow visible
 *   .clinicians_slider          cursor grab
 *   .clinicians_list            gap 2rem, transition transform .4s
 *   .clinicians_card-1          border-right 1px, flex-shrink 0
 *   .clinicians_card-image      13.75 × 16.5625rem, radius .75rem
 *                               box-shadow 0 .0925rem .0925rem #00000005
 *   .clinicians_card-info       width 23rem, padding .5rem 2rem
 *   .clinicians_card-logo       7.625 × 1.9375rem
 *
 * O `width: calc(50vw + 50%)` é o truque da seção: o trilho é mais largo
 * que o container e sangra para fora da margem direita. Os cards seguintes
 * ficam meio visíveis na borda, sinalizando que há mais — sem seta, sem
 * indicador, só o corte.
 *
 * Cada card tem `border-right: .0625rem solid #18181b1a` — a divisória
 * pertence ao CARD, não ao trilho. Assim ela acompanha o arrasto em vez de
 * ficar fixa na tela.
 *
 * A sombra do retrato é quase invisível de propósito:
 * `0 .0925rem .0925rem #00000005` — 5% de preto num raio de 1.5px. Não é
 * para ver, é para o retrato não flutuar sobre o branco.
 */
const MEDICOS = [
  {
    nome: "Dr Anant Vinjamoori, MD",
    cargo: "Chief Longevity Officer, Superpower",
    bio: "Board-certified longevity physician. Previously product leader at Virta Health & CMO at Modern Age. Featured in WSJ, Forbes, and Fortune.",
    logo: "/media/doc-logo-1.svg",
  },
  {
    nome: "Dr Leigh Erin Connealy, MD",
    cargo: "Clinician & Founder of The Centre for New Medicine",
    bio: "Leads the largest integrative medical clinic in North America. A pioneer in integrative oncology.",
    logo: "/media/doc-logo-2.avif",
  },
  {
    nome: "Dr Robert Lufkin",
    cargo: "UCLA Medical Professor, NYT Bestselling Author",
    bio: "A leading voice on metabolic health and longevity as shown in The Today Show, USA Today and FOX.",
    logo: "/media/doc-logo-3.svg",
  },
  {
    nome: "Dr. Abe Malkin, MD",
    cargo: "Medical Advisory Board",
    bio: "Leads a nationwide medical practice, and Drip Hydration, a mobile IV therapeutics company",
    logo: "/media/doc-logo-4.avif",
  },
];

const LOGOS = [
  ["/media/logo-stanford.svg", "Stanford", false],
  ["/media/logo-harvard.svg", "Harvard Medical School", false],
  ["/media/logo-ucsf.svg", "UCSF", true],
  ["/media/logo-oxford.svg", "University of Oxford", true],
];

export default function Clinicians() {
  const trilho = useRef(null);
  const arraste = useRef({ ativo: false, x: 0, left: 0 });

  const inicio = (e) => {
    const t = trilho.current;
    if (!t) return;
    arraste.current = { ativo: true, x: e.pageX, left: t.scrollLeft };
    t.style.cursor = "grabbing";
  };
  const mover = (e) => {
    const t = trilho.current;
    if (!t || !arraste.current.ativo) return;
    e.preventDefault();
    t.scrollLeft = arraste.current.left - (e.pageX - arraste.current.x);
  };
  const fim = () => {
    const t = trilho.current;
    arraste.current.ativo = false;
    if (t) t.style.cursor = "grab";
  };

  return (
    <section className={styles.section}>
      <div className={styles.pagePadding}>
        <div className={styles.container}>
          <div className={styles.component}>
            <div className={styles.titleRow}>
              <h2 className={styles.h2}>
                Led by doctors with 40 years of health and longevity expertise
              </h2>
            </div>

            <div className={styles.logoRow}>
              {LOGOS.map(([src, alt, full]) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={alt}
                  src={src}
                  alt={alt}
                  className={`${styles.logo} ${full ? styles.logoFull : ""}`}
                />
              ))}
            </div>

            {/* calc(50vw + 50%): o trilho sangra para fora da margem direita,
                então o card seguinte fica meio visível — o corte é o único
                indicador de que há mais. */}
            <div
              ref={trilho}
              className={styles.sliderWrapper}
              onMouseDown={inicio}
              onMouseMove={mover}
              onMouseUp={fim}
              onMouseLeave={fim}
            >
              <div className={styles.list}>
                {MEDICOS.map((m, i) => (
                  <article key={m.nome} className={styles.card}>
                    <div className={styles.cardImage}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={`/media/doc-card-${i + 1}.avif`}
                        alt=""
                        className={styles.cover}
                        draggable={false}
                      />
                    </div>
                    <div className={styles.cardInfo}>
                      <div className={styles.cardLogo}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={m.logo}
                          alt=""
                          className={styles.cardLogoImg}
                          draggable={false}
                        />
                      </div>
                      <div className={styles.contentWrap}>
                        <div className={styles.details}>
                          <p className={styles.nome}>{m.nome}</p>
                          <p className={styles.cargo}>{m.cargo}</p>
                        </div>
                        <div className={styles.content}>
                          <p className={styles.bio}>{m.bio}</p>
                          <a href="#" className={styles.link}>
                            Learn more
                          </a>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
