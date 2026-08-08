import styles from "./PillButton.module.css";

/**
 * Pílula sólida — a ação primária do header.
 *
 * Medido: 113×43, padding 10px 16px, radius 1000px, 14px / weight 350,
 * fundo rgb(28,58,19), texto rgb(252,252,247).
 *
 * O raio literal do original é 1000px, não 9999px.
 */
export default function PillButton({
  children,
  href = "#",
  variant = "solid",
  className = "",
}) {
  return (
    <a href={href} className={`${styles.pill} ${styles[variant]} ${className}`}>
      {children}
    </a>
  );
}
