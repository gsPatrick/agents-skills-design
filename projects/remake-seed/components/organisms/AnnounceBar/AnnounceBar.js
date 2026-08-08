import styles from "./AnnounceBar.module.css";

/**
 * Barra de anúncio — a faixa lima acima do header.
 *
 * Medido: 1425×40 em x=0,y=0. bg rgb(211,250,153), texto rgb(28,58,19),
 * 14px / weight 350 / letter-spacing -0.14px, padding 8px 56px, radius 4px.
 *
 * A seta é um ícone de 16×16 com stroke-width 1.5 — o mesmo desenho do
 * original (M8 4L12 8L8 12M12 8L4 8).
 */
export default function AnnounceBar() {
  return (
    <a className={styles.bar} href="#quiz">
      <span className={styles.label}>Find the right products for you</span>
      <span className={styles.arrow} aria-hidden="true">
        <svg viewBox="0 0 16 16" fill="none" width="16" height="16">
          <path
            d="M8 4L12 8L8 12M12 8L4 8"
            stroke="currentColor"
            strokeWidth="1.5"
            fill="none"
          />
        </svg>
      </span>
    </a>
  );
}
