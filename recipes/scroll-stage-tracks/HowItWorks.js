"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./HowItWorks.module.css";

/**
 * HowItWorks — scrollytelling de 4 passos.
 *
 * Camadas:   fundo (imagem/vídeo) → gradiente → conteúdo → FAQ → navegação
 * Driver:    posição do scroll dentro de uma seção de 800vh
 * Estados:   4 passos × 2 direções
 *
 * A ESTRUTURA, que é o truque central:
 *
 *   .howitworks        height: 800vh          ← oito viewports de pista
 *   .howitworks__stage position: sticky       ← gruda e não sai
 *                      top: .5rem
 *                      height: calc(100vh - 1rem)
 *
 * A seção é altíssima, o palco gruda no topo, e o scroll dentro dela vira o
 * índice do passo. 800vh ÷ 4 = 200vh por passo — cada um tem duas telas de
 * rolagem, o que dá tempo de ler antes de trocar.
 *
 * QUATRO TRILHAS sincronizadas pelo mesmo índice: `bg`, `content`, `faq`,
 * `nav`. Cada uma reage no seu tempo (ver atrasos abaixo).
 *
 * As animações têm PAR POR DIREÇÃO — `howitworks-bg-enter` sobe de
 * translateY(100%), a variante `-reverse` desce de −100%. Rolando para
 * baixo o novo fundo entra por baixo; rolando para cima, por cima. Sem
 * isso o movimento contradiz o gesto.
 *
 * Os atrasos escalonam as trilhas:
 *   fundo anterior desliza −11rem (não fica parado — é o que dá profundidade)
 *   conteúdo sai   200ms
 *   conteúdo entra 900ms com 220ms de atraso
 *   FAQ entra      900ms com 290ms de atraso
 *
 * O conteúdo começa a entrar antes de o FAQ mexer — a informação principal
 * chega primeiro, o detalhe depois.
 */
const PASSOS = [
  {
    titulo: "Every membership starts with 100+ biomarkers",
    corpo:
      "A full body test with a quick 10-min lab draw to get started. Test at 2,000+ Quest locations or at-home.",
    faq: "How is Superpower better than a standard physical?",
    nav: "A new health check",
    tipo: "img",
    src: "/media/hiw-0.avif",
    escuro: true,
  },
  {
    titulo: "All your health data, in one place",
    corpo:
      "Upload past labs and sync your wearables (Oura, Whoop, Apple Health and more). Connect the dots across all your data and spot trends early.",
    faq: "What data can I connect?",
    nav: "All your health data",
    tipo: "video",
    src: "/media/hiw-1.mp4",
    poster: "/media/hiw-1.avif",
  },
  {
    titulo: "Get a personalized health protocol",
    corpo:
      "A clinician-grade action plan after every test with insight on exactly what to do next (lifestyle, diet, supplements).",
    faq: "Who builds my protocol?",
    nav: "Your action plan",
    tipo: "img",
    src: "/media/hiw-2.avif",
  },
  {
    titulo: "Message your private care team 24/7",
    corpo:
      "A private care-team in your pocket at all times for any health questions or concerns",
    faq: "Who is on my care team?",
    nav: "24/7 care team",
    tipo: "video",
    src: "/media/hiw-3.mp4",
    poster: "/media/hiw-3.png",
  },
];

export default function HowItWorks() {
  const secRef = useRef(null);
  const [ativo, setAtivo] = useState(0);
  const [reverso, setReverso] = useState(false);
  const anterior = useRef(0);
  const videos = useRef([]);

  /* `autoPlay` só vale na MONTAGEM. Trocar o atributo depois não faz o
     navegador tocar — o vídeo ficava parado em 0.0 com readyState 4.
     Precisa de play() explícito quando o passo vira ativo.

     E rebobina antes: como não há loop, ao voltar a um passo já visto o
     vídeo estaria congelado no último quadro. */
  useEffect(() => {
    videos.current.forEach((v, i) => {
      if (!v) return;
      if (i === ativo) {
        v.currentTime = 0;
        const p = v.play();
        if (p && p.catch) p.catch(() => {});
      } else {
        v.pause();
      }
    });
  }, [ativo]);

  useEffect(() => {
    const sec = secRef.current;
    if (!sec) return;
    let raf = 0;

    const aplicar = () => {
      raf = 0;
      const r = sec.getBoundingClientRect();
      /* Progresso dentro da pista: 0 quando o topo encosta, 1 no fim. */
      const pista = r.height - window.innerHeight;
      const p = Math.min(Math.max(-r.top / pista, 0), 0.9999);
      const idx = Math.floor(p * PASSOS.length);
      if (idx !== anterior.current) {
        setReverso(idx < anterior.current);
        anterior.current = idx;
        setAtivo(idx);
      }
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

  /* Clicar num item leva ao passo — o original usa <button>, não <li>. */
  const irPara = (i) => {
    const sec = secRef.current;
    if (!sec) return;
    const topo = sec.getBoundingClientRect().top + window.scrollY;
    const pista = sec.getBoundingClientRect().height - window.innerHeight;
    window.scrollTo({
      top: topo + pista * ((i + 0.4) / PASSOS.length),
      behavior: "smooth",
    });
  };

  return (
    <section
      ref={secRef}
      className={`${styles.howitworks} ${reverso ? styles.reverse : ""}`}
    >
      <div className={styles.stage}>
        <div className={styles.bgSlot}>
          {PASSOS.map((p, i) => (
            <div
              key={i}
              className={`${styles.bg} ${
                i === ativo ? styles.bgActive : ""
              } ${i === ativo - 1 || (reverso && i === ativo + 1) ? styles.bgPrev : ""}`}
            >
              {/* SEM `loop`: o markup original traz `data-vc-no-loop`. O vídeo
                  roda uma vez e CONGELA no último quadro — vira imagem
                  estática. Em loop a repetição competiria com o texto, que é
                  o foco do passo. */}
              {p.tipo === "video" ? (
                <video
                  ref={(el) => (videos.current[i] = el)}
                  className={styles.media}
                  src={p.src}
                  poster={p.poster}
                  muted
                  playsInline
                  preload="metadata"
                  aria-hidden="true"
                />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.src} alt="" className={styles.media} />
              )}
              <div className={styles.gradient} />
            </div>
          ))}
        </div>

        <div className={styles.contentSlot}>
          {PASSOS.map((p, i) => (
            <div
              key={i}
              className={`${styles.content} ${i === ativo ? styles.contentActive : ""}`}
            >
              <h2
                className={`${styles.title} ${p.escuro ? styles.dark : ""}`}
              >
                {p.titulo}
              </h2>
              <p className={`${styles.body} ${p.escuro ? styles.dark : ""}`}>
                {p.corpo}
              </p>
            </div>
          ))}
        </div>

        <div className={styles.faqSlot}>
          {PASSOS.map((p, i) => (
            <div
              key={i}
              className={`${styles.faq} ${i === ativo ? styles.faqActive : ""}`}
            >
              <button type="button" className={styles.faqItem}>
                <span>{p.faq}</span>
                <span className={styles.faqIconWrap}>
                  <svg viewBox="0 0 20 20" width="14" height="14" fill="none">
                    <path
                      d="M7 5l5 5-5 5"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </button>
            </div>
          ))}
        </div>

        <ul className={styles.nav}>
          {PASSOS.map((p, i) => (
            <li key={i}>
              <button
                type="button"
                onClick={() => irPara(i)}
                className={`${styles.navItem} ${
                  i === ativo ? styles.navActive : ""
                } ${PASSOS[ativo].escuro ? styles.navDark : ""}`}
              >
                <span className={styles.navLabel}>{p.nav}</span>
                <span className={styles.navNum}>0{i + 1}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
