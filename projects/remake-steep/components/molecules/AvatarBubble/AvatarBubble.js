import styles from "./AvatarBubble.module.css";

/**
 * Bolha de presença com ponteiro — o motivo visual de "interação ao vivo".
 *
 * O cursor saindo da borda é o detalhe que faz a página parecer um produto
 * em uso, não um mockup. Aparece só nos artefatos flutuantes.
 */
export default function AvatarBubble({
  initials,
  tone = "green", // green | blue
  direction = "left", // de que lado sai o ponteiro
  className = "",
}) {
  return (
    <span
      className={`${styles.bubble} ${styles[tone]} ${styles[direction]} ${className}`}
      aria-hidden="true"
    >
      <span className={styles.initials}>{initials}</span>
      <svg className={styles.pointer} viewBox="0 0 14 16" fill="none">
        <path
          d="M1 1.2 12.4 8.1 7.2 9.3 5.4 14.4 1 1.2Z"
          fill="currentColor"
          stroke="var(--color-paper-white)"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}
