import styles from "./LogosMarquee.module.css";

const LOGOS = [
  "Aura",
  "Battleface",
  "Beam",
  "Circulo",
  "Domedia",
  "Drive",
  "FiniteState",
  "Forge",
  "Immuta",
  "Olive",
  "Path",
  "Physna",
  "ReadyRobotics",
  "Rhove",
  "Root",
  "Tandem",
];

export default function LogosMarquee() {
  // Render the list twice so the -50% translate loops seamlessly.
  const items = [...LOGOS, ...LOGOS];

  return (
    <section className={styles.marquee}>
      <div className={styles.slider}>
        <div className={styles.track}>
          {items.map((name, i) => (
            <div className={styles.item} key={`${name}-${i}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`/logos/${name}.svg`}
                alt={name}
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
