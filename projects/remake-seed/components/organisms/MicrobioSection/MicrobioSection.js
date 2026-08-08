import styles from "./MicrobioSection.module.css";

/**
 * MicrobioSection — "You are more than human."
 *
 * Camadas:   uma
 * Driver:    nenhum
 * Estados:   um
 *
 * Medido em 1440px, relativo ao topo da seção:
 *   seção      760 alto   bg #FCFCF7   padding 0 32px
 *   eyebrow    32,55,117,24    20px   "Seed 【book】"
 *   título     32,220,555,53   48px/350  lh 52.8  ls −0.72px
 *   parágrafo  32,305,555,62   16px/350  lh 20.8  ls −0.16px
 *   CTA        32,400,159,48   bg ink  radius 1000px + ícone circular
 *   figure    698,25,710,710   bg #EEEEE9  radius 32px
 *   SCIENCE/   32,693,89,19    16px/400  ls 0.24px  (tracking POSITIVO)
 *   Microbiome 129,692,114,20  16px/500  ls −0.12px
 *
 * A ilustração é um <mux-player> (vídeo em streaming HLS), não uma imagem.
 * Como o Mux dessa conta não serve MP4 estático, uso um frame extraído via
 * image.mux.com — o de t=0 vem vazio (só o fundo), então peguei t=2s, onde
 * a cabeça já está composta.
 *
 * Note o tracking POSITIVO no "SCIENCE /" (+0.24px): é o único texto da
 * página com espacejamento aberto, tratado como rótulo de sistema.
 */
export default function MicrobioSection() {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.copy}>
          <span className={styles.eyebrow}>
            Seed
            <span className={styles.mark} aria-hidden="true">
              【
              <svg viewBox="0 0 24 24" fill="none" width="18" height="18">
                <path
                  d="M3 5.5c2.5-1 5-1 7 .5v12c-2-1.5-4.5-1.5-7-.5v-12ZM21 5.5c-2.5-1-5-1-7 .5v12c2-1.5 4.5-1.5 7-.5v-12Z"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinejoin="round"
                />
              </svg>
              】
            </span>
          </span>

          <h2 className={styles.title}>You are more than human.</h2>

          <p className={styles.text}>
            Your body isn&apos;t yours alone—it&apos;s home to 38 trillion
            microbes that power your digestion, immunity and more. Take a few
            minutes to learn how their health impacts your health—and how to
            maximize both.
          </p>

          <a href="#science" className={styles.cta}>
            Discover
            <span className={styles.play} aria-hidden="true">
              <svg viewBox="0 0 16 16" fill="none" width="10" height="10">
                <path d="M5 3.5v9l8-4.5-8-4.5Z" fill="currentColor" />
              </svg>
            </span>
          </a>

          <p className={styles.footnote}>
            <span className={styles.footLabel}>SCIENCE</span>
            <span className={styles.footSlash}>/</span>
            <span className={styles.footTitle}>Microbiome 101</span>
          </p>
        </div>

        <figure className={styles.figure}>
          {/* O original usa <mux-player> (HLS em streaming). Baixei o stream
              com ffmpeg a partir do playback-id e sirvo como MP4 local —
              mesmo conteúdo, sem depender do player deles nem da rede.

              Os atributos do mux-player eram: autoplay, loop,
              --media-object-fit: cover e aspect-ratio 1/1. O arquivo é
              1920×1080 e é recortado para o quadrado pelo object-fit. */}
          <video
            src="/media/microbiome-head.mp4"
            poster="/media/microbiome-head.png"
            className={styles.figureImg}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            disablePictureInPicture
            aria-hidden="true"
            tabIndex={-1}
          />
        </figure>
      </div>
    </section>
  );
}
