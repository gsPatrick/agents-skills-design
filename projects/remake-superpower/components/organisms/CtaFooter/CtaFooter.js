"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./CtaFooter.module.css";

/**
 * CtaFooter — section_sp2-cta, a última seção da página.
 *
 * Camadas:   duas (fundo escuro + conteúdo em z-index 2)
 * Driver:    nenhum scroll — só o vídeo do fundador em loop e o lightbox
 * Estados:   lightbox fechado / aberto
 *
 * Do CSS original:
 *   .section_sp2-cta        min-height 50rem, coluna, justify center,
 *                           align-items flex-start, position relative
 *   .sp2-cta_inner          align-self stretch
 *   .page-padding           padding lateral 2.5rem  (1.5rem ≤767)
 *   .padding-section-large  padding-top/bottom 7rem (6rem ≤991, 4rem ≤767)
 *   .container-large        max-width 80rem, margin auto
 *   .z-index-2              z-index 2, relative
 *   .sp2-cta_component      gap 1.5rem, max-width 50%, color branco, coluna
 *   .heading-style-h1       3.75rem / lh 1 / ls −.02em (3rem ≤991, 2rem ≤767)
 *   .span-break             display block            ← quebra "superpower"
 *   .membership_info        gap 1.5rem  + variante align-left → flex-start
 *   .membership_info-item   gap .5rem
 *   .icon-embed-small       1.25rem × 1.25rem
 *   .text-size-small        .875rem, ls −.1px
 *   .button-group           gap 1rem, flex-wrap  (.5rem ≤991)
 *   .footer2_ceo-video-card 8.67rem × 5.375rem, radius .45rem
 *   .footer2_video-wrap     coluna, gap 1rem
 *   .footer2_video-content  .875rem
 *
 * ── A REGRA QUE NÃO ESTAVA NO .css ────────────────────────────────────────
 * O bloco existe dentro de `.footer-cta_wrap`, e o markup traz um <style>
 * solto no fim da página com os overrides que fazem o tema virar escuro:
 *
 *   .footer-cta_wrap .pre-heading_trustpilot        { color:#fff }
 *   .footer-cta_wrap .trustpilot_additional-text    { display:none }
 *   .footer-cta_wrap .membership_info .text-color-secondary { color:#fff }
 *   .footer-cta_wrap .membership_info .icon-embed-small svg [stroke] { stroke:#fff }
 *   .footer-cta_wrap .pre-heading_trustpilot        { justify-content:flex-start }
 *
 * Sem esse <style> a seção sai com texto zinc-500 sobre fundo preto —
 * ilegível. Os overrides só existem inline no .htm, não no CSS compilado.
 *
 * ── O FUNDO ───────────────────────────────────────────────────────────────
 * Não é CSS: é uma cena WebGL da Unicorn Studio (projeto 9E83sBKl9o0jSJaq33yi)
 * num <canvas> absoluto que cobre o wrap inteiro. Busquei o JSON da cena em
 * storage.googleapis.com/unicornstudio-production/embeds/<id> e ela tem 6
 * camadas: gradient (preto puro), IMAGE, godrays, bloomFast, fastFog, nebula.
 *
 * A camada de imagem é a foto — width 1 (100% do artboard), left .5, top 0,
 * heightMode 2 (altura pelo aspect 1701/1818 = .9356). Isso traduz exatamente
 * para `background-size: 100% auto` + `background-position: top center` sobre
 * preto. As outras cinco camadas são pós-processamento animado (raios, bloom,
 * névoa, grão) que NÃO reproduzo — ver relatório.
 *
 * ── O VÍDEO DO FUNDADOR ───────────────────────────────────────────────────
 * No original ele vive no <footer class="section_footer3">, dentro de
 * `.badge._3` da grade de badges — não dentro de section_sp2-cta. Como o
 * rodapé não faz parte deste remake, trago o bloco `.footer2_video-wrap`
 * inteiro para o fim da coluna do CTA, com as medidas originais intactas
 * (8.67rem × 5.375rem, radius .45rem, gap 1rem, rótulo .875rem). A coluna
 * já é alinhada à esquerda, que é como o bloco aparece no rodapé.
 *
 * O card tem `is-bg` no original: `.video-card.is-bg video.vc-video{opacity:1}`
 * e `loop` no <video> — roda pra sempre, mudo, sem poster. Não tem
 * `data-vc-no-loop`. O `data-vc-lightbox` abre o vídeo com som em overlay;
 * é o que o botão "Play video" faz aqui.
 *
 * autoPlay no JSX não basta quando o React remonta depois da hidratação —
 * chamo play() explícito no useEffect, mesmo caso do SocialProof.
 */

/* Ordem e textos do markup. Os três SVGs vêm inline no .htm (w-embed),
   com stroke #71717A que o override do footer-cta_wrap pinta de branco. */
const GARANTIAS = [
  {
    label: "Cancel anytime",
    path: <path d="M13.8334 4.09668L6.50002 11.43L3.16669 8.09668" />,
  },
  {
    label: "HSA/FSA eligible",
    path: (
      <path d="M15.034 6.76334C15.3385 8.25754 15.1215 9.81095 14.4192 11.1645C13.717 12.5181 12.5719 13.59 11.175 14.2016C9.7781 14.8131 8.21376 14.9272 6.74287 14.5249C5.27199 14.1226 3.98347 13.2283 3.09219 11.991C2.20091 10.7536 1.76075 9.24816 1.84511 7.7256C1.92948 6.20303 2.53326 4.7554 3.55577 3.62412C4.57829 2.49284 5.95773 1.74629 7.46405 1.50897C8.97037 1.27166 10.5125 1.55791 11.8333 2.32001M6.50001 7.43001L8.5 9.43001L15.1667 2.76334" />
    ),
  },
  {
    label: "Results within a week",
    path: (
      <path d="M5.83333 1.42969V4.09635M11.1667 1.42969V4.09635M14.5 9.42969V4.09635C14.5 3.74273 14.3595 3.40359 14.1095 3.15355C13.8594 2.9035 13.5203 2.76302 13.1667 2.76302H3.83333C3.47971 2.76302 3.14057 2.9035 2.89052 3.15355C2.64048 3.40359 2.5 3.74273 2.5 4.09635V13.4297C2.5 13.7833 2.64048 14.1224 2.89052 14.3725C3.14057 14.6225 3.47971 14.763 3.83333 14.763H9.16667M2.5 6.76302H14.5M11.1667 13.4297L12.5 14.763L15.1667 12.0964" />
    ),
  },
];

export default function CtaFooter() {
  const videoRef = useRef(null);
  const lightboxRef = useRef(null);
  const [lightbox, setLightbox] = useState(false);

  /* O card é `is-bg`: o vídeo é o próprio fundo, mudo e em loop.
     play() explícito porque o autoplay do atributo não sobrevive à
     hidratação em todos os navegadores. */
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    const p = v.play();
    if (p && typeof p.catch === "function") p.catch(() => {});
  }, []);

  /* Lightbox: o vídeo do overlay começa do zero COM som — é a mensagem
     do fundador, não decoração. Esc fecha. */
  useEffect(() => {
    if (!lightbox) return;
    const v = lightboxRef.current;
    if (v) {
      v.currentTime = 0;
      const p = v.play();
      if (p && typeof p.catch === "function") p.catch(() => {});
    }
    const onKey = (e) => e.key === "Escape" && setLightbox(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [lightbox]);

  return (
    <section className={styles.section}>
      {/* Camada 1 — a cena WebGL virou imagem estática sobre preto. */}
      <div className={styles.fundo} aria-hidden="true" />

      <div className={styles.inner}>
        <div className={styles.pagePadding}>
          <div className={styles.container}>
            <div className={styles.component}>
              {/* .pre-heading_trustpilot, variante "with-reviews".
                  Os dois .pre-heading-bullet e o .trustpilot_additional-text
                  ficam display:none nesta variante — não existe "·" aqui. */}
              <a
                className={styles.trustpilot}
                href="https://www.trustpilot.com/review/superpower.com"
                target="_blank"
                rel="nofollow noreferrer"
              >
                <div>4.6 out of 5</div>
                <div className={styles.estrela}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="100%"
                    height="100%"
                    viewBox="0 0 26 24"
                    fill="none"
                  >
                    <path
                      d="M25.2466 9.17115H15.6012L12.6321 0.000160217L9.64535 9.17115L0 9.15358L7.80061 14.8284L4.81389 23.9993L12.6145 18.3246L20.4151 23.9993L17.446 14.8284L25.2466 9.17115Z"
                      fill="#00B67A"
                    />
                    <path
                      d="M18.1153 16.9004L17.4477 14.8273L12.6338 18.3235L18.1153 16.9004Z"
                      fill="#005128"
                    />
                  </svg>
                </div>
                <div>260+ reviews</div>
              </a>

              <h2 className={styles.heading}>
                Health is your <span className={styles.quebra}>superpower</span>
              </h2>

              <div className={styles.info}>
                {GARANTIAS.map(({ label, path }) => (
                  <div className={styles.infoItem} key={label}>
                    <div className={styles.icone}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="17"
                        height="17"
                        viewBox="0 0 17 17"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.45833"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        {path}
                      </svg>
                    </div>
                    <div className={styles.infoLabel}>{label}</div>
                  </div>
                ))}
              </div>

              <div className={styles.botoes}>
                <a
                  className={`${styles.btn} ${styles.btnPrimario}`}
                  href="https://superpower.com/checkout"
                >
                  <div className={styles.btnConteudo}>Get started</div>
                </a>
                <a
                  className={`${styles.btn} ${styles.btnSecundario}`}
                  href="https://superpower.com/biomarkers-1"
                >
                  <div className={styles.btnConteudo}>See what we test</div>
                </a>
              </div>

              {/* .footer2_video-wrap — realocado do rodapé, medidas intactas. */}
              <div className={styles.videoWrap}>
                <div
                  className={styles.videoCard}
                  onClick={() => setLightbox(true)}
                  role="button"
                  tabIndex={0}
                  aria-label="Open Video"
                  onKeyDown={(e) => e.key === "Enter" && setLightbox(true)}
                >
                  <video
                    ref={videoRef}
                    className={styles.videoBg}
                    src="/media/cta-founder.mp4"
                    muted
                    loop
                    playsInline
                    preload="metadata"
                  />
                  <div className={styles.playButton}>
                    <div className={styles.playIconWrap}>
                      <div className={styles.playIcon}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          aria-hidden="true"
                          width="100%"
                          height="100%"
                          preserveAspectRatio="xMidYMid meet"
                          viewBox="0 0 24 24"
                        >
                          <path
                            fill="currentColor"
                            d="M8 6.82v10.36c0 .79.87 1.27 1.54.84l8.14-5.18a1 1 0 0 0 0-1.69L9.54 5.98A.998.998 0 0 0 8 6.82"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
                <div className={styles.videoContent}>
                  <div>Hear from our CEO</div>
                  <button
                    type="button"
                    className={styles.videoLink}
                    onClick={() => setLightbox(true)}
                  >
                    Play video
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* data-vc-lightbox — o mesmo arquivo, agora com som e controles. */}
      {lightbox && (
        <div
          className={styles.lightbox}
          onClick={() => setLightbox(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Founder message"
        >
          <video
            ref={lightboxRef}
            className={styles.lightboxVideo}
            src="/media/cta-founder.mp4"
            controls
            playsInline
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </section>
  );
}
