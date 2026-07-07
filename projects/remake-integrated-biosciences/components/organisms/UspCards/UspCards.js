import styles from "./UspCards.module.css";

const CARDS = [
  {
    index: "01.",
    icon: "/icons/icon-1.svg",
    title: "Optogenetics",
    text: "We harness light to control biology with unmatched precision.",
    variant: "lime",
  },
  {
    index: "02.",
    icon: "/icons/icon-2.svg",
    title: "Chemistry",
    text: "We apply the latest chemistry tools to optimize our drug discovery.",
    variant: "ink",
  },
  {
    index: "03.",
    icon: "/icons/icon-3.svg",
    title: "AI",
    text: "We power our platform with an AI engine fueled by differentiated datasets.",
    variant: "tissue",
  },
];

export default function UspCards() {
  return (
    <section className={styles.section}>
      <div className={styles.cards}>
        {CARDS.map((c) => (
          <article
            key={c.index}
            className={`${styles.card} ${styles[c.variant]}`}
          >
            <span className={styles.index}>{c.index}</span>
            <div className={styles.icon}>
              <img src={c.icon} alt="" />
            </div>
            <div className={styles.content}>
              <h4 className={styles.title}>{c.title}</h4>
              <p className={styles.text}>{c.text}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
