import PillButton from "@/components/atoms/PillButton/PillButton";
import styles from "./Hero.module.css";

/**
 * Hero — imagem full-bleed com o texto ancorado à esquerda.
 *
 * Camadas:   imagem de fundo (cover) → conteúdo
 * Ancoragem: tudo estático. Nenhum sticky, nenhum scroll-driven.
 * Driver:    nenhum
 * Estados:   um
 *
 * Medido em 1440px:
 *   seção      0,32,1425,844  bg #1C3A13 (aparece enquanto a imagem carrega)
 *   imagem     0,32,1425,844  object-fit: cover — cobre a seção inteira
 *   título     56,231,750,158 48px / 350 / lh 52.8px (1.1) / ls -1.2px
 *   parágrafo  56,405,426,42  16px / 350 / lh 20.8px (1.3) / ls -0.16px
 *   CTA        56,475,146,52  16px / 350 / padding 16px 24px / radius 1000px
 *
 * O texto NÃO é centralizado — ancora em x=56. A cor do texto é a mesma
 * tinta escura (#1C3A13) porque a imagem é clara na metade esquerda.
 *
 * As razões de line-height são limpas (52.8/48 = 1.1 · 20.8/16 = 1.3), então
 * uso a razão em vez de px fixo: escala melhor entre breakpoints.
 */
export default function Hero() {
  return (
    <section className={styles.hero}>
      <picture className={styles.media}>
        <source
          media="(min-width: 1024px)"
          srcSet="/media/hero-desktop.jpg"
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/media/hero-desktop@1x.jpg"
          alt=""
          className={styles.mediaImg}
        />
      </picture>

      <div className={styles.content}>
        {/* As quebras SÃO forçadas no original: a caixa mede 750px e a
            altura 158px = 3 linhas de 52.8px. No fluxo natural o texto cabe
            em 2 linhas dentro de 750px, então sem os <br> a composição muda.
            O que eu havia errado antes era a POSIÇÃO das quebras, não a
            existência delas. */}
        <h1 className={styles.title}>
          A life-changing
          <br />
          health routine, built
          <br />
          for your microbiome.
        </h1>

        <p className={styles.lead}>
          Transform your gut health, energy, sleep, and nutrition with
          formulations designed for real results.
        </p>

        <div className={styles.actions}>
          <PillButton href="#quiz" variant="solid" className={styles.cta}>
            Take the Quiz
          </PillButton>

          <a href="#shop" className={styles.shopLink}>
            Shop Now
            <span className={styles.shopArrow} aria-hidden="true">
              &rarr;
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
