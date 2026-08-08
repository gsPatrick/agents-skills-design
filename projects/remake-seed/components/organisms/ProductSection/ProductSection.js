import ProductCard from "@/components/molecules/ProductCard/ProductCard";
import styles from "./ProductSection.module.css";

/**
 * ProductSection — a faixa verde abaixo do hero.
 *
 * Camadas:   uma
 * Driver:    hover nos cards (o vídeo cresce de 264 para 330)
 * Estados:   4 cards independentes
 *
 * Medido em 1440px:
 *   seção       0,876,1425,796   bg rgb(28,58,19)  padding 56px 0
 *   declaração  32,932,570,106   48px/350  lh 52.8  ls −0.72px
 *   subhead     745,996,450,42   16px/350  lh 20.8  ls −0.16px
 *   "Shop all"  1339,1021,69,17  14px/500  ls −0.04px
 *   cards em x  0 · 364 · 728 · 1092   →  348 de largura + 16 de gap
 *
 * O cabeçalho é de DUAS colunas: a declaração à esquerda em x=32 e o
 * subhead à direita em x=745, na mesma faixa vertical. Não é um bloco
 * empilhado — foi o que eu havia presumido antes.
 *
 * O tracking da declaração (−0.72px) é metade do hero (−1.2px) no mesmo
 * corpo de 48px: texto claro sobre escuro pede menos aperto.
 */
const PRODUCTS = [
  {
    badge: "Bestseller", badgeTone: "badgeLime",
    code: "DS–01", sup: "®", name: "Daily Synbiotic",
    price: "Starting at $49.99",
    video: "/media/ds01.mov", poster: "/media/ds01-carousel-poster.png",
  },
  {
    badge: "New", badgeTone: "badgeGray",
    code: "DM–02", sup: "™", name: "Daily Multivitamin",
    price: "Starting at $39.99",
    video: "/media/dm02.mov", poster: "/media/dm02-carousel-poster.png",
  },
  {
    badge: "New", badgeTone: "badgeSand",
    code: "AM–02", sup: "™", name: "Energy + Focus",
    price: "Starting at $34.99",
    video: "/media/am02.mov", poster: "/media/am02-carousel-poster.png",
  },
  {
    badge: "New", badgeTone: "badgeBlue",
    code: "PM–02", sup: "™", name: "Sleep + Restore",
    price: "Starting at $34.99",
    video: "/media/pm02.mov", poster: "/media/pm02-carousel-poster.png",
  },
];

export default function ProductSection() {
  return (
    <section className={styles.section} id="shop">
      <header className={styles.head}>
        <p className={styles.statement}>
          Whole body health starts in the gut.
        </p>

        <div className={styles.aside}>
          <p className={styles.subhead}>
            Formulations that provide sustained support using key
            scientifically and clinically studied ingredients.
          </p>
          <a href="#shop" className={styles.shopAll}>
            Shop All
            <span aria-hidden="true">&nbsp;&rarr;</span>
          </a>
        </div>
      </header>

      <div className={styles.grid}>
        {PRODUCTS.map((p) => (
          <ProductCard key={p.code} {...p} />
        ))}
      </div>
    </section>
  );
}
