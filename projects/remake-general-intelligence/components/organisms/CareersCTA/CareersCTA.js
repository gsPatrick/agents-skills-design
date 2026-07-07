import Logo from "@/components/atoms/Logo/Logo";
import styles from "./CareersCTA.module.css";

export default function CareersCTA() {
  return (
    <section className={styles.section} id="careers" data-navbar-theme="light">
      <div className={styles.inner}>
        <Logo variant="dark" className={styles.logo} />
        <h2 className={styles.heading}>
          We&apos;re building tools for businesses that run themselves
        </h2>
        <p className={styles.text}>
          If that sounds interesting to you,{" "}
          <a className={styles.link} href="#careers">
            <span>come work with us</span>
            <span className={styles.linkArrow} aria-hidden="true">
              <svg width="7" height="10" viewBox="0 0 7 10" fill="none">
                <rect x="3.95" y="4.29" width="1.42" height="1.42" fill="currentColor" />
                <rect x="1.13" y="1.47" width="1.42" height="1.42" fill="currentColor" />
                <rect x="1.13" y="7.11" width="1.42" height="1.42" fill="currentColor" />
                <rect x="2.53" y="2.88" width="1.42" height="4.25" fill="currentColor" />
              </svg>
            </span>
          </a>
        </p>
      </div>
    </section>
  );
}
