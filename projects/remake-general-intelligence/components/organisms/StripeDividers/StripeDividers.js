import styles from "./StripeDividers.module.css";

const VARIANTS = {
  hero: {
    bars: ["#334444", "#576a6a", "#728383", "#a5afaf", "#cfd3cf"],
    endWithWhite: false,
  },
  footer: {
    bars: ["#CFEBE780", "#A0D7D180", "#A0D7D1"],
    endWithWhite: true,
  },
};

export default function StripeDividers({ variant = "hero" }) {
  const { bars, endWithWhite } = VARIANTS[variant] ?? VARIANTS.hero;

  return (
    <div className={styles.wrap} aria-hidden="true">
      {bars.map((color, i) => (
        <div key={`${variant}-${color}`} className={styles.band}>
          <div className={styles.color} style={{ backgroundColor: color }} />
          {(i < bars.length - 1 || endWithWhite) && <div className={styles.line} />}
        </div>
      ))}
    </div>
  );
}
