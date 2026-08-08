import ArrowLink from "@/components/atoms/ArrowLink/ArrowLink";
import styles from "./FeatureCard.module.css";

/**
 * Card neutro — o card de trabalho do sistema.
 *
 * Fundo mist (#f2f2f3), raio 24px, SEM sombra e SEM borda. A regra: só
 * artefatos de produto flutuantes ganham elevação. Um box-shadow aqui
 * quebraria a hierarquia inteira de superfícies.
 */
export default function FeatureCard({
  category,
  title,
  children,
  icon,
  href,
  linkLabel = "Learn more",
  className = "",
}) {
  return (
    <article className={`${styles.card} ${className}`}>
      {icon ? (
        <div className={styles.icon}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={icon} alt="" loading="lazy" />
        </div>
      ) : null}

      {category ? <span className={styles.category}>{category}</span> : null}

      <h3 className={styles.title}>{title}</h3>
      <p className={styles.text}>{children}</p>

      {href ? (
        <ArrowLink href={href} className={styles.link}>
          {linkLabel}
        </ArrowLink>
      ) : null}
    </article>
  );
}
