import styles from "./PillButton.module.css";

/**
 * Pílula — a ação do sistema.
 *
 * Geometria do original: 32px de altura, padding lateral 12px, texto 15px,
 * raio total. Nenhuma variante tem borda: a hierarquia vem do preenchimento
 * (sólido → translúcido → transparente).
 *
 * `size="regular"` sobe para 44px — é o tamanho usado no hero e no CTA final.
 */
export default function PillButton({
  children,
  href = "#",
  variant = "filled", // filled | soft | ghost
  size = "sm", // sm | regular
  className = "",
  ...rest
}) {
  return (
    <a
      href={href}
      className={`${styles.pill} ${styles[variant]} ${
        size === "regular" ? styles.regular : ""
      } ${className}`}
      {...rest}
    >
      <span>{children}</span>
    </a>
  );
}
