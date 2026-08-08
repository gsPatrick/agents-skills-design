import WordReveal from "@/components/atoms/WordReveal/WordReveal";
import PillButton from "@/components/atoms/PillButton/PillButton";
import TabList from "@/components/molecules/TabList/TabList";
import styles from "./Engage.module.css";

const TABS = [
  {
    title: "AI",
    text: "Ask complex questions and get deep, reliable insights. All powered by governed metrics.",
    artboard: "AI",
    duration: 15,
  },
  {
    title: "Explore",
    text: "Jump into metrics and explore visualizations in seconds. Go deeper with seamless AI.",
    artboard: "Explore-line",
    duration: 12,
  },
  {
    title: "Reports",
    text: "Create or generate any type of content. From dashboards and business reviews to deep dives.",
    artboard: "Reports",
    duration: 17,
  },
  {
    title: "Drill down",
    text: "Click on any metric and dive into the row-level details of your customers, transactions and more.",
    artboard: "Drill-down",
    duration: 13.16,
  },
  {
    title: "Targets",
    text: "Load target data centrally and have it be available for any metric, anywhere in your workspace.",
    artboard: "Targets",
    duration: 8,
  },
  {
    title: "Maps",
    text: "Simple, intuitive maps made to be explored by everyone. Just open the map and dive in.",
    artboard: "Maps",
    duration: 6.14,
  },
];

/**
 * Camadas:   uma
 * Driver:    TEMPO — as abas avançam sozinhas, cada uma com sua duração.
 *            Clique salta e reinicia o ciclo. Pausa fora da viewport.
 * Estados:   6 discretos, cross-fade por opacidade
 * Recipe:    tab-panel-autoplay
 *
 * As durações (15/12/17/13.16/8/6.14s) vêm do chunk 5206.js do original —
 * são o tamanho da animação Rive de cada artboard. Não são arbitrárias e
 * não devem virar um intervalo fixo: com um valor único as abas curtas
 * arrastam e as longas cortam.
 */
export default function Engage() {
  return (
    <section className={styles.section} id="engage">
      <div className="container">
        <header className={styles.head}>
          <WordReveal
            as="h2"
            className={`sectionHeading ${styles.title}`}
            segments={[{ text: "Engage everyone" }]}
          />
          <p className={styles.subhead}>
            AI-powered workflows that unlocks deep analysis and reporting for
            all users.
          </p>
          <PillButton href="#semantic" variant="soft" className={styles.cta}>
            Learn more
            <span className={styles.ctaArrow} aria-hidden="true">
              &rarr;
            </span>
          </PillButton>
        </header>

        <TabList items={TABS} />
      </div>
    </section>
  );
}
