import styles from "./ComposerInput.module.css";

/**
 * Artefato flutuante — o compositor de perguntas da IA.
 *
 * Diferente dos outros artefatos: usa borda hairline em vez de sombra, porque
 * é um campo de entrada, não um cartão de dado. Raio 16px (--radius-input),
 * não 20px.
 *
 * Decorativo — o input é readOnly e aria-hidden. Um campo funcional aqui
 * capturaria foco de teclado numa página que não tem para onde enviar.
 */
export default function ComposerInput({
  placeholder = "Ask anything…",
  className = "",
}) {
  return (
    <div className={`${styles.composer} ${className}`} aria-hidden="true">
      <p className={styles.placeholder}>{placeholder}</p>

      <div className={styles.row}>
        <div className={styles.tools}>
          <span className={styles.tool}>@</span>
          <span className={styles.tool}>
            <svg viewBox="0 0 16 16" fill="none" width="15" height="15">
              <circle cx="8" cy="8" r="6.4" stroke="currentColor" strokeWidth="1.3" />
              <path
                d="M8 7.2v4M8 4.9v.1"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinecap="round"
              />
            </svg>
          </span>
        </div>

        <span className={styles.send}>
          <svg viewBox="0 0 16 16" fill="none" width="15" height="15">
            <path
              d="M8 13V3M3.6 7.4 8 3l4.4 4.4"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </div>
    </div>
  );
}
