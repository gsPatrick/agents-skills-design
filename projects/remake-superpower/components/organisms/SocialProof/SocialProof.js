"use client";

import { useEffect, useRef } from "react";
import styles from "./SocialProof.module.css";

/**
 * SocialProof — "Used by athletes, doctors, and members just like you"
 *
 * Camadas:   uma
 * Driver:    setas do pill + arrasto
 * Estados:   um
 *
 * Do CSS original:
 *   .social-proof_header       justify-content space-between  ← título | setas
 *   .social-proof_slider-wrapper  width calc(50vw + 50%)      ← sangra
 *   .social-proof_list         gap 1rem
 *   .social-proof_card         height 26.25rem, radius .75rem, bg #e2e2e2
 *   --text                     width 25rem
 *   --image-only, --video      width 15.625rem
 *   --split                    width 20rem, background transparente, coluna
 *   .__overlay-gradient        linear-gradient(#0000, #000000e6)
 *                              height 15.625rem, ancorado no rodapé
 *   .__nav-pill                bg #18181b, pílula, backdrop blur(.25rem)
 *
 * QUATRO larguras diferentes de card num mesmo trilho: 15.625rem para foto e
 * vídeo (retrato), 25rem para citação (precisa de linha de leitura), 20rem
 * para o split. A altura é a MESMA (26.25rem) em todos — é ela que costura a
 * fita; a largura varia com o conteúdo.
 *
 * O gradiente do rodapé tem 15.625rem de altura — 60% do card. Não é uma
 * tarja: é uma transição longa que deixa a foto respirar no topo e garante
 * contraste para o texto embaixo.
 *
 * O card `--split` é o único com fundo TRANSPARENTE e `overflow: visible`:
 * ele não é um cartão, é uma coluna com dois cartões dentro.
 */
const CARDS = [
  { tipo: "image", img: "/media/sp-1.avif", href: "/giannis" },
  {
    tipo: "text",
    img: "/media/sp-2.avif",
    fonte: "/media/sp-src-1.avif",
    citacao:
      'I felt "fine"—but my bloodwork told a different story & inflammation played a huge role',
  },
  {
    tipo: "video",
    img: "/media/sp-3.avif",
    video: "/media/social-2.mp4",
    handle: "@avnibarman_",
    seguidores: "406k followers",
  },
  {
    tipo: "split",
    img: "/media/sp-4.avif",
    fonte: "/media/sp-src-2.avif",
    citacao:
      "Superpower is building the operating system for personalized health",
  },
  {
    tipo: "text",
    img: "/media/sp-5.avif",
    fonte: "/media/sp-src-3.avif",
    citacao:
      "SoulCycle Teams With Superpower To Integrate Biomarker Testing",
  },
  {
    tipo: "video",
    img: "/media/sp-6.avif",
    video: "/media/social-1.mp4",
    handle: "@stefarmstead",
    seguidores: "104k followers",
  },
];

const Verificado = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
    <path
      d="M12 2l2.4 1.8 3-.3 1 2.8 2.6 1.5-1 2.9 1 2.9-2.6 1.5-1 2.8-3-.3L12 22l-2.4-1.8-3 .3-1-2.8L3 16.2l1-2.9-1-2.9 2.6-1.5 1-2.8 3 .3L12 2Z"
      fill="#3B9EFF"
    />
    <path
      d="M8.5 12.2l2.4 2.4 4.6-4.9"
      stroke="#fff"
      strokeWidth="1.8"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default function SocialProof() {
  const trilho = useRef(null);
  const videos = useRef([]);

  /* `autoPlay` no JSX não basta: com `muted` definido como prop o React
     pode aplicar o atributo depois do primeiro paint, e o navegador já
     decidiu não tocar. play() explícito resolve — mesmo caso do HowItWorks.

     Aqui os vídeos ficam EM LOOP: são clipes curtos de redes sociais, o
     movimento contínuo é o que os distingue das fotos na mesma fita. */
  useEffect(() => {
    videos.current.forEach((v) => {
      if (!v) return;
      v.muted = true;
      const p = v.play();
      if (p && p.catch) p.catch(() => {});
    });
  }, []);
  const arraste = useRef({ ativo: false, x: 0, left: 0 });

  const passo = (dir) => {
    const t = trilho.current;
    if (!t) return;
    t.scrollBy({ left: dir * 320, behavior: "smooth" });
  };

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
          {/* space-between: título à esquerda, setas à direita. */}
          <div className={styles.header}>
            <h2 className={styles.h2}>
              Used by athletes, doctors, and{" "}
              <span className={styles.span}>members just like you</span>
            </h2>

            <div className={styles.navPill}>
              <button
                type="button"
                className={styles.navBtn}
                onClick={() => passo(-1)}
                aria-label="Anterior"
              >
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
                  <path d="M15 5l-7 7 7 7" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <button
                type="button"
                className={styles.navBtn}
                onClick={() => passo(1)}
                aria-label="Próximo"
              >
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
                  <path d="M9 5l7 7-7 7" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>

          <div
            ref={trilho}
            className={styles.sliderWrapper}
            onMouseDown={inicio}
            onMouseMove={mover}
            onMouseUp={fim}
            onMouseLeave={fim}
          >
            <div className={styles.list}>
              {CARDS.map((c, i) => {
                if (c.tipo === "split") {
                  return (
                    <div key={i} className={`${styles.card} ${styles.cardSplit}`}>
                      <div className={styles.splitTop}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={c.img} alt="" className={styles.bgImg} draggable={false} />
                      </div>
                      <div className={styles.splitBottom}>
                        <p className={styles.splitQuote}>{c.citacao}</p>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={c.fonte} alt="" className={styles.source} draggable={false} />
                      </div>
                    </div>
                  );
                }

                const Tag = c.href ? "a" : "div";
                return (
                  <Tag
                    key={i}
                    href={c.href}
                    className={`${styles.card} ${
                      c.tipo === "text" ? styles.cardText : styles.cardNarrow
                    }`}
                  >
                    {c.tipo === "video" ? (
                      <video
                        ref={(el) => {
                          if (el) videos.current[i] = el;
                        }}
                        className={styles.bgImg}
                        src={c.video}
                        poster={c.img}
                        autoPlay
                        loop
                        muted
                        playsInline
                        preload="metadata"
                        aria-hidden="true"
                      />
                    ) : (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={c.img} alt="" className={styles.bgImg} draggable={false} />
                    )}

                    {(c.citacao || c.handle) && (
                      <>
                        <div className={styles.overlayGradient} />
                        <div className={styles.bottom}>
                          {c.citacao && (
                            <>
                              <p className={styles.quote}>{c.citacao}</p>
                              {c.fonte && (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={c.fonte} alt="" className={styles.source} draggable={false} />
                              )}
                            </>
                          )}
                          {c.handle && (
                            <>
                              <div className={styles.creator}>
                                <p className={styles.handle}>{c.handle}</p>
                                <Verificado />
                              </div>
                              <p className={styles.followers}>{c.seguidores}</p>
                            </>
                          )}
                        </div>
                      </>
                    )}
                  </Tag>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
