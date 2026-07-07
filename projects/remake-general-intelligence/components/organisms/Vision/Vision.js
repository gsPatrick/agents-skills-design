import WordReveal from "@/components/atoms/WordReveal/WordReveal";
import PixelFlower from "@/components/molecules/PixelFlower/PixelFlower";
import styles from "./Vision.module.css";

export default function Vision() {
  return (
    <section className={styles.section} data-navbar-theme="light" id="about">
      <div className={`container ${styles.inner}`}>
        <div className={styles.art}>
          <PixelFlower />
        </div>
        <div className={styles.copy}>
          <p className={styles.lead}>
            We envision a world where anyone with an idea and some unique
            insight can start a business. A world where someone can wake up
            with an idea for a company, open their laptop, and create it in
            real time.
          </p>
          <WordReveal
            as="h2"
            text="Where starting up a real world company is as easy as playing a video game."
            className={styles.heading}
            delay={200}
          />
        </div>
      </div>
    </section>
  );
}
