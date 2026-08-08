import styles from "./LogosMarquee.module.css";

/**
 * Faixa de logos — recipe: recipes/marquee-seamless
 *
 * A regra única: renderizar a lista DUAS vezes e animar até translateX(-50%).
 * No fim da animação a segunda cópia está exatamente onde a primeira começou,
 * então o reset é invisível. Qualquer outra combinação salta.
 */
const LOGOS = [
  "voi",
  "framer",
  "veo",
  "monta",
  "bounce",
  "hairburst",
  "alloy",
  "voyado",
  "juni",
  "instabox",
  "onceupon",
  "budbee",
  "goals",
  "philadelphia",
];

export default function LogosMarquee() {
  const items = [...LOGOS, ...LOGOS];

  return (
    <section className={styles.section} aria-label="Trusted by teams at">
      <p className={styles.label}>Trusted by teams at</p>

      <div className={styles.slider}>
        <div className={styles.track}>
          {items.map((name, i) => (
            <div className={styles.item} key={`${name}-${i}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`/logos/${name}.svg`}
                alt={i < LOGOS.length ? name : ""}
                aria-hidden={i >= LOGOS.length}
                className={styles.brand}
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
