import styles from "./RegionTable.module.css";

/**
 * Artefato flutuante — tabela de regiões (5 linhas).
 *
 * Recipe: floating-product-artifact.
 * A barra de proporção dentro da célula substitui um gráfico separado: o dado
 * e sua representação ocupam a mesma linha. É o que permite o artefato ser
 * pequeno o suficiente para flutuar sem virar dashboard.
 */
const ROWS = [
  { region: "Sweden", value: "48,120", share: 1 },
  { region: "Germany", value: "31,904", share: 0.66 },
  { region: "France", value: "22,517", share: 0.47 },
  { region: "Netherlands", value: "14,286", share: 0.3 },
  { region: "Denmark", value: "9,731", share: 0.2 },
];

export default function RegionTable({ className = "" }) {
  return (
    <article className={`${styles.card} ${className}`}>
      <header className={styles.head}>
        <span className={styles.title}>Revenue by region</span>
        <span className={styles.period}>Last 30 days</span>
      </header>

      <table className={styles.table}>
        <thead>
          <tr>
            <th scope="col">Region</th>
            <th scope="col" className={styles.numeric}>
              Revenue
            </th>
          </tr>
        </thead>
        <tbody>
          {ROWS.map((row) => (
            <tr key={row.region}>
              <th scope="row" className={styles.region}>
                {row.region}
              </th>
              <td className={styles.numeric}>
                <span className={styles.value}>{row.value}</span>
                <span
                  className={styles.bar}
                  style={{ transform: `scaleX(${row.share})` }}
                  aria-hidden="true"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </article>
  );
}
