import styles from "./ArrowLink.module.css";

/**
 * Link de texto com seta.
 *
 * A seta faz parte do rótulo, não é um ícone separado — é ela que carrega a
 * afordância de link. Por isso NÃO há sublinhado em repouso; o sublinhado
 * aparece só no hover. É o elemento interativo de menor ênfase do sistema.
 */
export default function ArrowLink({ children, href = "#", className = "" }) {
  return (
    <a href={href} className={`${styles.link} ${className}`}>
      <span className={styles.label}>{children}</span>
      <span className={styles.arrow} aria-hidden="true">
        →
      </span>
    </a>
  );
}
