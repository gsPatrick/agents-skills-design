import ArrowButton from "@/components/atoms/ArrowButton/ArrowButton";
import styles from "./Company.module.css";

export default function Company() {
  return (
    <section className={styles.section} id="company">
      <div className={`container ${styles.labelRow}`}>
        <span className="mono-label">Our Company</span>
      </div>

      <div className={`container ${styles.grid}`}>
        <figure className={styles.figure}>
          <img src="/media/company.jpg" alt="" className={styles.image} />
        </figure>

        <div className={styles.content}>
          <h3 className={styles.heading}>
            Bold research to unlock small molecule discovery for human health and
            aging.
          </h3>

          <div className={styles.cols}>
            <p>
              We are advancing a pipeline of novel small molecule therapeutics by
              unraveling complex biology with optogenetics, chemistry, and AI.
              Built on pioneering science from our scientific co-founder, Prof.
              Jim Collins at MIT, and powered by a world-class team of
              innovators, we are pushing the boundaries of how biology can be
              understood and engineered.
            </p>
            <p>
              Our discoveries have been repeatedly featured in <em>Nature</em>,{" "}
              <em>Nature Aging</em>, <em>Nature Protocols</em>, and <em>Cell</em>,
              underscoring the impact of our approach.
              <br />
              <br />
              Today, our mission targets age-related diseases, while our ultimate
              ambition is far bolder: to fundamentally rewrite the biology of
              aging.
            </p>
          </div>

          <ArrowButton label="Learn more about us" />
        </div>
      </div>
    </section>
  );
}
