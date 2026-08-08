import WordReveal from "@/components/atoms/WordReveal/WordReveal";
import PillButton from "@/components/atoms/PillButton/PillButton";
import TabList from "@/components/molecules/TabList/TabList";
import styles from "./SemanticPlatform.module.css";

const TABS = [
  {
    title: "Semantic platform",
    text: "Define metrics, dimensions, entities and power all of your analysis and reporting with governed building blocks.",
    image: "/media/model-start.jpg",
  },
  {
    title: "Steep API",
    text: "Query governed metrics from anywhere. Every downstream tool reads the same definitions.",
    image: "/media/model-api.jpg",
  },
  {
    title: "Metrics catalog",
    text: "A browsable home for every metric, with owners, lineage and descriptions attached.",
    image: "/media/model-metric-catalog.png",
  },
  {
    title: "Define in code",
    text: "Version your semantic model alongside your codebase. Review changes like any other pull request.",
    image: "/media/model-code.png",
  },
  {
    title: "Manage in app",
    text: "Non-technical owners edit and publish metrics without touching the repository.",
    image: "/media/model-define-ui.png",
  },
];

const CARDS = [
  {
    icon: "people",
    title: "Fine-grained permissions",
    text: "Control who can access metrics and row-level data.",
  },
  { icon: "clock", title: "Smart caching", text: "Offload your data warehouse. Instant responses for users." },
  {
    icon: "puzzle",
    title: "dbt + Cube integrations",
    text: "Seamless integrations to stand-alone semantic layers.",
  },
  { icon: "layers", title: "OSI ready", text: "Compatible with latest industry standards for interoperability." },
];

/* Ícones de contorno, 1.5px, brancos — o mesmo peso do resto da faixa. */
const ICONS = {
  people: "M6.5 9.2a2.2 2.2 0 1 0 0-4.4 2.2 2.2 0 0 0 0 4.4Zm7 0a2.2 2.2 0 1 0 0-4.4 2.2 2.2 0 0 0 0 4.4ZM2.5 16c0-2.2 1.8-3.6 4-3.6s4 1.4 4 3.6m3-3.4c1.9.2 3.5 1.5 3.5 3.4",
  clock: "M10 17a7 7 0 1 0 0-14 7 7 0 0 0 0 14Zm0-10.5V10l2.5 1.8",
  puzzle: "M4 4h5v3.2a1.4 1.4 0 1 1 0 2.8V16H4v-4.8a1.4 1.4 0 1 0 0-2.8V4Zm7.6 0H16v5.2a1.4 1.4 0 1 1 0 2.8V16h-4.4",
  layers: "M10 3 3 7l7 4 7-4-7-4Zm-7 8 7 4 7-4M3 14.5l7 4 7-4",
};

/**
 * Camadas:   uma. Faixa fog.
 * Driver:    clique (tabs) + interseção (título)
 * Estados:   5 tabs + grade estática de 4 cards compactos
 * Recipe:    tab-panel-crossfade
 */
export default function SemanticPlatform() {
  return (
    <section className={styles.section} id="semantic">
      <div className={styles.veil} aria-hidden="true" />
      <div className={styles.grain} aria-hidden="true" />

      <div className={styles.inner}>
        <header className={styles.head}>
          <a href="#semantic" className={styles.eyebrow}>
            Semantic platform
            <span className={styles.eyebrowArrow} aria-hidden="true">
              &rsaquo;
            </span>
          </a>

          <WordReveal
            as="h2"
            className={`sectionHeading ${styles.title}`}
            segments={[
              { text: "Ship metrics," },
              { br: true },
              { text: "not dashboards" },
            ]}
          />
          <p className={styles.subhead}>
            A complete semantic platform to govern and publish all your
            metrics. No more repeating yourself.
          </p>
          <PillButton href="#ai" variant="soft" className={styles.cta}>
            Learn more
            <span className={styles.ctaArrow} aria-hidden="true">&rarr;</span>
          </PillButton>
        </header>

        <TabList items={TABS} dark />

        <div className={styles.grid}>
          {CARDS.map((c) => (
            <article key={c.title} className={styles.feature}>
              <span className={styles.icon} aria-hidden="true">
                <svg viewBox="0 0 20 20" fill="none" width="24" height="24">
                  <path
                    d={ICONS[c.icon]}
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <h3 className={styles.featureTitle}>{c.title}</h3>
              <p className={styles.featureText}>{c.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
