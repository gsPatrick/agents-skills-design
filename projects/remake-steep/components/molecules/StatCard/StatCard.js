import styles from "./StatCard.module.css";

/**
 * Artefato de produto flutuante — cartão de métrica.
 *
 * Recipe nova: floating-product-artifact.
 * A regra do sistema: estes são os ÚNICOS elementos com sombra visível, e
 * ainda assim a 10% de opacidade. Cards de conteúdo (mist/peach) nunca têm.
 *
 * O gráfico é gestual — sem eixos, sem grid, sem rótulos. Ele sugere a forma
 * do dado, não o comunica. Um gráfico "de verdade" aqui viraria dashboard e
 * quebraria a leitura editorial da página.
 */
export default function StatCard({
  label,
  value,
  delta,
  deltaLabel,
  chart = "line", // line | radial
  progress = 0.46,
  className = "",
}) {
  return (
    <article className={`${styles.card} ${className}`}>
      <header className={styles.head}>
        <span className={styles.label}>{label}</span>
      </header>

      <div className={styles.body}>
        <div className={styles.figures}>
          <span className={styles.value}>{value}</span>
          <span className={styles.delta}>
            <span className={styles.deltaArrow} aria-hidden="true">
              ↑
            </span>
            {delta}
            <span className={styles.deltaLabel}>{deltaLabel}</span>
          </span>
        </div>

        {chart === "line" ? <LineChart /> : <RadialChart progress={progress} />}
      </div>
    </article>
  );
}

/* Linha gestual — traço sienna, sem eixos. */
function LineChart() {
  return (
    <svg
      className={styles.line}
      viewBox="0 0 120 44"
      fill="none"
      aria-hidden="true"
      preserveAspectRatio="none"
    >
      <path
        d="M1 39C10 37.5 17 33 25 30.5s13 1.5 21-3.5 12-14 21-16.5S104 6 119 2"
        stroke="var(--color-sienna-brown)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* Anel de progresso — o mesmo traço, enrolado. */
function RadialChart({ progress }) {
  const r = 18;
  const c = 2 * Math.PI * r;
  return (
    <svg
      className={styles.radial}
      viewBox="0 0 44 44"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="22" cy="22" r={r} stroke="var(--color-mist-gray)" strokeWidth="4" />
      <circle
        cx="22"
        cy="22"
        r={r}
        stroke="var(--color-sienna-brown)"
        strokeWidth="4"
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={c * (1 - progress)}
        transform="rotate(-90 22 22)"
      />
    </svg>
  );
}
