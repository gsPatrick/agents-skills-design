import styles from "./IntroProof.module.css";

/**
 * IntroProof — "Built by the world's top doctors and scientists"
 *
 * Camadas:   uma
 * Driver:    nenhum
 * Estados:   um
 *
 * Do CSS original:
 *   .section-sp2_intro.is-home
 *                         background-image: linear-gradient(#fff, #fafafa 85%, #fafafa00)
 *                         padding-top: 4rem
 *   .page-padding         padding-inline 2.5rem
 *   .container-large      max-width 80rem, centrado
 *   .doctor-proof_row     gap .5rem, centrado, margin-bottom 2rem
 *   .doctor-proof_wrap    margin-right 1rem
 *   .doctor-proof-img     is-bigger → height 2.75rem, margin-right −1rem
 *   .clinicians_logo-row  is-centered is-grid → gap 4rem
 *   .clinicians-logo      opacity .33, grayscale, max-height 2.1rem
 *   .is-full-opacity      opacity 1, sem filtro
 *
 * O `margin-right: -1rem` nos avatares é o que os SOBREPÕE. Cada um recua
 * 16px sobre o anterior; o `.doctor-proof_wrap` compensa com +1rem à
 * direita para o texto não colar.
 *
 * O gradiente é branco no topo → #fafafa aos 85% → transparente. A seção
 * nasce clara emendando na hero e ESCURECE descendo, preparando a próxima.
 * A variante `.is-home` sobrescreve a regra base, que tem o gradiente na
 * direção oposta.
 *
 * Dois logos têm `is-full-opacity` (UCSF e Oxford) e escapam do
 * grayscale/33% dos outros. Não é descuido: os SVGs deles já são cinza,
 * então o filtro os apagaria.
 */
const LOGOS = [
  { src: "/media/logo-stanford.svg", alt: "Stanford", full: false },
  { src: "/media/logo-harvard.svg", alt: "Harvard Medical School", full: false },
  { src: "/media/logo-ucsf.svg", alt: "UCSF", full: true },
  { src: "/media/logo-oxford.svg", alt: "University of Oxford", full: true },
];

export default function IntroProof() {
  return (
    <section className={styles.section}>
      <div className={styles.pagePadding}>
        <div className={styles.container}>
          <div className={styles.header}>
            <div className={styles.row}>
              {/* Os três avatares sobrepostos por margin-right negativa. */}
              {/* Ordem do DOM: 1, 2, 3 — igual ao original. Com margin-right
                  negativa quem vem depois fica POR CIMA, então inverter a
                  lista troca quem aparece na frente e a ordem visual. */}
              <div className={styles.avatars}>
                {[1, 2, 3].map((n) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={n}
                    src={`/media/doc-${n}.avif`}
                    alt=""
                    className={`${styles.avatar} ${n === 3 ? styles.avatarTop : ""}`}
                    loading="lazy"
                  />
                ))}
              </div>
              <h4 className={styles.title}>
                Built by the world&rsquo;s top doctors and scientists
              </h4>
            </div>

            <div className={styles.logos}>
              {LOGOS.map((l) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={l.alt}
                  src={l.src}
                  alt={l.alt}
                  className={`${styles.logo} ${l.full ? styles.logoFull : ""}`}
                  loading="lazy"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
