import styles from "./HighlightSection.module.css";

/**
 * HighlightSection — "Daily essentials for nutrition and digestive health."
 *
 * Camadas:   uma
 * Driver:    nenhum
 * Estados:   um
 *
 * Medido em 1440px:
 *   seção      0,1672,1425,734  bg #FCFCF7  radius 32px 32px 0 0  pad 80px 32px
 *   badge      32,1873,123,24   12px/500  bg lima  radius 1000px
 *   título     32,1921,608,88   40px/350  lh 44px  ls −0.4px
 *   parágrafo  32,2033,608,42   16px/350  lh 20.8  ls −0.16px
 *   CTA        32,2099,238,52   16px/350  radius 1000px  pad 16px 24px
 *   img hero   729,1752,664,373  ← 80px ACIMA do topo da seção
 *   img 1      729,2128,211,211
 *   img 2      955,2128,211,211
 *   img 3     1182,2093,211,281  ← mais alta que as outras duas
 *
 * A seção inverte o esquema: fundo claro (#FCFCF7) depois da faixa verde, com
 * cantos SUPERIORES arredondados em 32px — espelho exato do hero, que tem os
 * inferiores. É o par que fecha o bloco verde entre os dois.
 *
 * A imagem principal transborda 80px para cima, invadindo o verde. Por isso
 * a seção precisa de overflow visible e a imagem de z-index próprio.
 */
export default function HighlightSection() {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.copy}>
          <span className={styles.badge}>Bundle + Save 25%</span>

          <h2 className={styles.title}>
            Daily essentials for nutrition and digestive health.
          </h2>

          <p className={styles.text}>
            Our clinically studied daily synbiotic paired with a daily
            multivitamin reduces bloating, promotes healthy regularity and
            delivers essential nutrients.
          </p>

          <a href="#shop" className={styles.cta}>
            Shop Daily Essentials Duo
          </a>
        </div>

        <div className={styles.media}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/media/duo-hero.png" alt="" className={styles.hero} />

          <div className={styles.thumbs}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/media/duo-1.png" alt="" className={styles.thumb} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/media/duo-2.png" alt="" className={styles.thumb} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/media/duo-3.png" alt="" className={styles.thumbTall} />
          </div>
        </div>
      </div>
    </section>
  );
}
