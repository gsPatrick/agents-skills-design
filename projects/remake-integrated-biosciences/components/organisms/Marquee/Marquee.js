import styles from "./Marquee.module.css";

export default function Marquee() {
  const phrase = "Rewriting the biology of aging\u00A0\u2013\u00A0";
  const items = Array.from({ length: 6 });

  return (
    <section className={styles.section} aria-label="Rewriting the biology of aging">
      <div className={styles.track}>
        {items.map((_, i) => (
          <span className={styles.item} key={i} aria-hidden={i > 0}>
            {phrase}
          </span>
        ))}
      </div>
    </section>
  );
}
