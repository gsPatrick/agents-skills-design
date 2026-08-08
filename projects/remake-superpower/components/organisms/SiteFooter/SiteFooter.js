"use client";

import { useEffect, useRef } from "react";
import styles from "./SiteFooter.module.css";

/**
 * SiteFooter — `section_footer3`
 *
 * Camadas:   uma
 * Driver:    nenhum (o vídeo do fundador roda em loop)
 * Estados:   um
 *
 * Do CSS original:
 *   .section_footer3       padding-block 6rem, radius .75rem, bg primário
 *   .footer2_component     row, space-between, gap 14rem
 *   .is-gap                gap 3rem   ← sobrescreve os 14rem
 *   .footer2_group1        coluna, gap 3rem, max-width 30rem
 *   .footer2_group2        grid 3 colunas, gap 2rem
 *   .footer_link-group     coluna, gap .875rem
 *   .footer2_column        coluna, gap 3rem
 *   .footer2_ceo-video-card 8.67 × 5.375rem, radius .45rem
 *   .footer2_qr            5.2 × 5.2rem
 *   .footer_ai_logo.footer-40  3rem, grayscale, shadow −1px −1px 2px
 *   .is-bottom             border-top, margin-top 4rem
 *
 * O `.footer2_component` base tem `gap: 14rem` — um vão enorme entre a
 * coluna da newsletter e a grade de links. A variante `is-gap` (que esta
 * instância usa) derruba para 3rem. Pegar só a base deixaria a grade
 * espremida contra a borda.
 *
 * O rodapé tem `border-radius: .75rem` e vive dentro de `.footer-cta_wrap`
 * com `padding: 0 1.5rem 1.5rem` — ou seja, ele NÃO encosta nas bordas da
 * tela. É um cartão sobre o fundo escuro do CTA, e o raio só faz sentido
 * por causa disso.
 *
 * O vídeo do fundador pertence AQUI (`footer2_video-wrap` dentro de
 * `.badge._3`), não à seção de CTA. Estava lá porque o rodapé ainda não
 * existia quando ele foi construído.
 */
const COLUNAS = [
  ["Superpower", [
    ["How it works", "/how-it-works"],
    ["What we test", "/biomarkers"],
    ["Member Login", "https://app.superpower.com/"],
    ["Gift Superpower", "/gift"],
    ["Reviews", "/reviews"],
  ]],
  ["Company", [
    ["Our Why", "/manifesto"],
    ["Superpower Labs", "https://healthiesthoodie.com/"],
    ["Contact Us", "/contact"],
    ["Careers", "/careers"],
    ["Blog", "/blog"],
    ["FAQs", "/faqs"],
  ]],
  ["Compare", [
    ["Function Health", "/superpower-vs-function-health"],
    ["Mito Health", "/superpower-vs-mito-health"],
    ["InsideTracker", "/superpower-vs-insidetracker"],
  ]],
  ["Partnerships", [
    ["For Creators", "/superfiliate"],
    ["For Partners", "/partner"],
    ["For Business", "/organizations"],
  ]],
  ["Clinical & Research", [
    ["The Tanning Iceberg", "/blog"],
    ["Metabolic Biomarker Testing", "/biomarkers"],
    ["Thyroid Biomarkers", "/biomarkers"],
    ["DNA Biomarkers", "/biomarkers"],
    ["Body Composition Biomarkers", "/biomarkers"],
    ["Liver Health Biomarkers", "/biomarkers"],
    ["Energy Biomarkers", "/biomarkers"],
    ["Immune System Biomarkers", "/biomarkers"],
  ]],
];

const LEGAIS = [
  ["Terms", "/terms"],
  ["Privacy policy", "/privacy"],
  ["Medical consent", "/medical-consent"],
  ["Cookie preferences", "#"],
];

export default function SiteFooter() {
  const video = useRef(null);

  useEffect(() => {
    const v = video.current;
    if (!v) return;
    v.muted = true;
    const p = v.play();
    if (p && p.catch) p.catch(() => {});
  }, []);

  return (
    <footer className={styles.footer}>
      <div className={styles.pagePadding}>
        {/* `is-gap` derruba o gap de 14rem para 3rem. */}
        <div className={styles.component}>
          <div className={styles.group1}>
            <div className={styles.newsletter}>
              <a href="/" className={styles.logoLink}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/media/ft-logo.svg" alt="Superpower" className={styles.logo} />
              </a>

              <p className={styles.about}>
                <span className={styles.aboutStrong}>
                  Not sure where to start?
                </span>{" "}
                Sign up to receive the Superpower Code: a free guide to
                understanding your health and the systems that matter most.
              </p>

              <form className={styles.form} action="/newsletter" method="get">
                <label htmlFor="ft-email" className="screenreader-only">
                  Your email
                </label>
                <input
                  id="ft-email"
                  type="email"
                  name="email"
                  className={styles.input}
                  placeholder="Your email"
                  required
                />
                <button type="submit" className={styles.submit}>
                  Sign up
                </button>
              </form>
            </div>

            {/* QR + App Store + vídeo do fundador dividem a mesma faixa. */}
            <div className={styles.badges}>
              <div className={styles.badgesGroup}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/media/ft-qr.svg" alt="" className={styles.qr} />
                <a href="#" className={styles.appStore}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/media/ft-appstore.svg" alt="Download on the App Store" />
                </a>
              </div>

              <div className={styles.videoWrap}>
                <div className={styles.ceoCard}>
                  <video
                    ref={video}
                    className={styles.ceoVideo}
                    src="/media/cta-founder.mp4"
                    loop
                    muted
                    playsInline
                    preload="metadata"
                    aria-hidden="true"
                  />
                  <span className={styles.play} aria-hidden="true">
                    <svg viewBox="0 0 24 24" width="12" height="12" fill="#fff">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </span>
                </div>
                <p className={styles.videoContent}>
                  A message from our founder
                </p>
              </div>
            </div>
          </div>

          <div className={styles.group2}>
            {COLUNAS.map(([titulo, itens]) => (
              <div key={titulo} className={styles.linkGroup}>
                <p className={styles.linkHeader}>{titulo}</p>
                {itens.map(([t, href]) => (
                  <a key={t} href={href} className={styles.link}>
                    {t}
                  </a>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Bloco "Ask AI" — logos em cinza, 3rem, com sombra invertida. */}
        <div className={styles.aiBlock}>
          <p className={styles.aiLabel}>Ask AI about Superpower</p>
          <div className={styles.aiLogos}>
            {[1, 4, 5].map((n) => (
              <a key={n} href="#" className={styles.aiLogo}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/media/ai-${n}.${n === 5 ? "avif" : "svg"}`}
                  alt=""
                  className={styles.aiImg}
                />
              </a>
            ))}
          </div>
        </div>

        <div className={styles.bottom}>
          <div className={styles.bottomLinks}>
            {LEGAIS.map(([t, href]) => (
              <a key={t} href={href} className={styles.link}>
                {t}
              </a>
            ))}
          </div>
          <p className={styles.copy}>© 2026 Superpower</p>
        </div>
      </div>
    </footer>
  );
}
