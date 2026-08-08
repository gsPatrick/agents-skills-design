import styles from "./ViaCapSection.module.css";

/**
 * ViaCapSection — "Most probiotics don't survive digestion—DS-01® does."
 *
 * Camadas:   fundo de bactérias (da SEÇÃO) → card de vidro fosco → conteúdo
 * Driver:    nenhum (o vídeo da cápsula roda em loop)
 * Estados:   um
 *
 * Medido em 1440px, relativo ao topo da seção:
 *   seção     0,2406,1425,720   fundo transparente   pad 80px 32px
 *   card      32,140,1361,560   rgba(87,94,85,0.35) + blur(37.5px)
 *                               radius 32px   pad 80px
 *   título    112,262,540,88    40px/350  lh 44px  ls −0.4px
 *   métrica   145,407,190,51    18px/350  lh 23.4
 *   nota      112,515,540,17    12px/350  lh 16.8
 *   OUTER     684,267,96,13     12px/500
 *   texto     684,284,200,67    12px/350
 *   INNER    1221,379,93,13     12px/500
 *   texto    1221,397,168,50    12px/350
 *   vídeo     839,220,400,400
 *
 * O fundo de bactérias pertence à SEÇÃO; o card é só o vidro por cima. Foi
 * por isso que o card mede 1361 de largura contra 1425 da seção — sobram
 * 32px de cada lado onde a imagem aparece crua.
 *
 * O rgba(87,94,85,0.35) é o token --color-neutral-frosted-glass-35 do
 * design system deles, não um valor arbitrário.
 */
export default function ViaCapSection() {
  return (
    <section className={styles.section}>
      <div className={styles.card}>
        <div className={styles.left}>
          <span className={styles.eyebrow}>
            <span className={styles.dot} aria-hidden="true" />
            VIACAP<sup>®</sup> TECHNOLOGY
          </span>

          <h2 className={styles.title}>
            Most probiotics don&apos;t survive digestion—DS-01<sup>®</sup> does.
          </h2>

          <div className={styles.metric}>
            <p className={styles.metricLabel}>
              <span className={styles.pill}>
                DS-01<sup>®</sup>
              </span>{" "}
              Increases healthy bacteria°
            </p>

            <p className={styles.metricValue}>
              <span className={styles.arrow} aria-hidden="true">
                <svg viewBox="0 0 16 16" fill="none" width="14" height="14">
                  <path
                    d="M8 12V4M4.4 7.6 8 4l3.6 3.6"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              17x
            </p>
          </div>

          <p className={styles.note}>°Lactobacillus</p>
        </div>

        <div className={styles.diagram}>
          <div className={`${styles.caption} ${styles.capOuter}`}>
            <p className={styles.capTitle}>OUTER CAPSULE</p>
            <p className={styles.capText}>
              Shields probiotics from stomach acid in the digestive tract,
              while delivering prebiotics to stimulate the growth of beneficial
              bacteria.
            </p>
            <span className={styles.leader} aria-hidden="true" />
          </div>

          {/* O vídeo TOCA em loop. Medido no original com a seção já dentro
              da viewport: currentTime 1.81 de 8.00, paused = false.

              Minhas medições anteriores liam paused=true / currentTime=0
              porque eu media logo depois do load, ANTES de a seção entrar
              na tela — o vídeo só arranca quando fica visível. Concluí
              "está congelado no frame 0" e passei rodadas removendo
              autoPlay e muted, afastando-me do original a cada tentativa.

              width/height 400 como atributos HTML e object-fit inline vêm
              do markup real. `muted` é obrigatório: sem ele o browser
              bloqueia o autoplay. */}
          <video
            src="/media/viacap.mov"
            className={styles.capsule}
            width="400"
            height="400"
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            disablePictureInPicture
            aria-label="DS-01 3D 360° Product Catalog Capsule"
            style={{ objectFit: "contain" }}
          />

          <div className={`${styles.caption} ${styles.capInner}`}>
            <span className={styles.leader} aria-hidden="true" />
            <p className={styles.capTitle}>INNER CAPSULE</p>
            <p className={styles.capText}>
              Delivers 24 live strains of probiotics to the colon, where
              they&apos;re needed most.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
