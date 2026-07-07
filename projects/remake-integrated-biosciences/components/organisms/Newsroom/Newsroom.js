import ArrowButton from "@/components/atoms/ArrowButton/ArrowButton";
import styles from "./Newsroom.module.css";

const POSTS = [
  {
    type: "Publications",
    date: "February 20, 2026",
    title:
      "FATE-MAP predicts teratogenicity and human gastrulation failure modes by integrating deep learning and mechanistic modeling",
  },
  {
    type: "News",
    date: "February 19, 2026",
    title:
      "Integrated Biosciences Appoints Tony Wu, Co-Founder of xAI, to its Scientific Advisory Board",
  },
  {
    type: "News",
    date: "January 27, 2026",
    title:
      "Integrated Biosciences Appoints Daniel J. Anderson, Ph.D. as Chief Scientific Officer",
  },
];

function Tag({ type }) {
  return (
    <span className={styles.tag}>
      <span className={styles.dot} aria-hidden="true" />
      <span className="mono-label">{type}</span>
    </span>
  );
}

function ReadChip() {
  return (
    <span className={styles.chip} aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none" className={styles.chipArrow}>
        <path
          d="M5 12h13M13 6l6 6-6 6"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

export default function Newsroom() {
  return (
    <section className={styles.section} id="newsroom">
      <div className={`container ${styles.inner}`}>
        <div className={styles.head}>
          <h2 className={styles.title}>Newsroom</h2>
          <ArrowButton label="View all articles" />
        </div>

        <article className={styles.featured}>
          <figure className={styles.featuredImage}>
            <img src="/media/featured-cell.jpg" alt="" />
          </figure>
          <div className={styles.featuredContent}>
            <div className={styles.meta}>
              <Tag type="Publications" />
              <time className={styles.date}>September 4, 2025</time>
            </div>
            <div className={styles.featuredBody}>
              <h3 className={styles.featuredTitle}>
                Optogenetics-enabled discovery of integrated stress response
                modulators
              </h3>
              <p className={styles.excerpt}>
                In this landmark Cell publication, we unveil our first-of-a-kind
                optogenetic screening platform, which unlocks a novel mode of
                drug discovery by enabling tunable, millisecond- and
                micron-level control over previously intractable biological
                systems.
              </p>
            </div>
            <div className={styles.foot}>
              <span className={styles.readLabel}>Read article</span>
              <ReadChip />
            </div>
          </div>
        </article>

        <div className={styles.posts}>
          {POSTS.map((p) => (
            <article className={styles.post} key={p.title}>
              <div className={styles.meta}>
                <Tag type={p.type} />
                <time className={styles.date}>{p.date}</time>
              </div>
              <h4 className={styles.postTitle}>{p.title}</h4>
              <div className={styles.foot}>
                <span className={styles.readLabel}>Read article</span>
                <ReadChip />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
