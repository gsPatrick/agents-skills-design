import ArrowButton from "@/components/atoms/ArrowButton/ArrowButton";
import styles from "./Platform.module.css";

export default function Platform() {
  return (
    <section className={styles.section} id="platform">
      <div className={`container ${styles.inner}`}>
        <aside className={styles.sidebar}>
          <span className="mono-label">The integrated platform</span>
        </aside>

        <div className={styles.content}>
          <h3 className={styles.heading}>
            Combining synthetic biology, chemistry, and AI into an{" "}
            <span className={styles.muted}>engine of discovery.</span>
          </h3>

          <p className={styles.text}>
            Our platform enables precise, dynamic control of biological targets
            and pathways, generating high-fidelity datasets that, combined with
            advanced AI, unlock systematic exploration of previously
            inaccessible chemical space. At its core are our ultra-large,
            in-house aging datasets, which provide a rich foundation for target
            identification and therapeutic discovery.
          </p>

          <ArrowButton label="Discover our platform" />
        </div>
      </div>
    </section>
  );
}
