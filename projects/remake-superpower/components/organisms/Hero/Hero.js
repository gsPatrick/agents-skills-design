import styles from "./Hero.module.css";

/**
 * Hero — "Your new health membership"
 *
 * Camadas:   vídeo de fundo → gradiente overlay → gradiente darken → conteúdo
 * Driver:    animação de entrada (heroReveal) no carregamento
 * Estados:   um  (o original tem data-hero-interval=5000 para rodar slides,
 *            mas só existe UM slide no markup — o carrossel está armado e
 *            não usado)
 *
 * Do CSS original:
 *   .section_sp2-home-hero  height: calc(100dvh - 3.5rem)
 *                           margin: 5.5rem 0 0   padding: 0 .5rem .5rem
 *   .sp-main-hero_card      radius .75rem  padding-bottom/left 4rem
 *   .sp2-home-hero_content  max-width 37rem
 *   .heading-style-h1       3rem / lh 1.166 / ls -0.0225em
 *   .badge_block            .875rem
 *   .title_content-group    margin-bottom 2rem
 *   .sp2-hero_bottom-divider  1px × 3.25rem, branco a 20%
 *   .text-style-muted         opacity .55
 *
 * DOIS gradientes empilhados, com modos de mesclagem diferentes:
 *   overlay  opacity .3  mix-blend-mode: overlay  altura 50%
 *   darken   opacity .5  mix-blend-mode: darken   altura 75%
 *
 * Não é um gradiente com opacidade maior: são dois, e a ordem importa. O
 * `overlay` satura e escurece os médios; o `darken` só puxa para baixo os
 * pixels mais claros que o gradiente. Juntos afundam o fundo sem lavar o
 * laranja do sol.
 */
const NOTAS = [
  ["Whole body check", "Detect 1,000+ conditions"],
  ["Accessible", "Starts at $199/year"],
  ["Trusted", "1M biomarkers tested"],
];

export default function Hero() {
  return (
    <section className={styles.section}>
      <div className={styles.card}>
        <div className={styles.slide}>
          <div className={styles.bg}>
            <video
              className={styles.video}
              src="/media/hero.mp4"
              poster="/media/hero-poster.jpg"
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
              disablePictureInPicture
              aria-hidden="true"
              tabIndex={-1}
            />
          </div>

          {/* Dois gradientes, modos de mesclagem diferentes — ver comentário
              do componente. */}
          <div className={styles.gradOverlay} aria-hidden="true" />
          <div className={styles.gradDarken} aria-hidden="true" />
        </div>

        <div className={styles.contentWrap}>
          <div className={styles.content}>
            <p className={styles.badge}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/media/icon-check.svg"
                alt=""
                className={styles.badgeIcon}
              />
              HSA/ FSA eligible
            </p>

            <div className={styles.titleGroup}>
              <h1 className={styles.h1}>Your new health membership</h1>
              <p className={styles.sub}>
                Members start with 100+ lab tests. $199 per year.
              </p>
            </div>

            <div className={styles.buttons}>
              <a href="/checkout" className={styles.btnPrimary}>
                Become a member
              </a>
              <a href="/biomarkers" className={styles.btnSecondary}>
                See what we test
              </a>
            </div>
          </div>
        </div>

        {/* DENTRO do card, sobre o vídeo — irmã do content-wrap, não da
            seção. O CSS original: inset auto auto 3rem 4rem, z-index 10.
            Fora do card elas caem no fundo branco e o texto some. */}
        <div className={styles.notes}>
          {NOTAS.map((n, i) => (
            <div key={n[0]} className={styles.noteGroup}>
              {i > 0 && <span className={styles.divider} aria-hidden="true" />}
              <div className={styles.note}>
                <div>{n[0]}</div>
                <div className={styles.muted}>{n[1]}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
