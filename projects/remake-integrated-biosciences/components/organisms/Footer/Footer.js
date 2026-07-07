import Logo from "@/components/atoms/Logo/Logo";
import ArrowButton from "@/components/atoms/ArrowButton/ArrowButton";
import BgVideo from "@/components/atoms/BgVideo/BgVideo";
import styles from "./Footer.module.css";

const NAVIGATE = [
  { label: "Platform", href: "#platform" },
  { label: "Company", href: "#company" },
  { label: "Newsroom", href: "#newsroom" },
  { label: "Work with us", href: "#contact" },
];

const CONNECT = [
  { label: "LinkedIn", href: "https://www.linkedin.com/company/integrated-biosciences-inc" },
  { label: "X", href: "https://x.com/Integrated_Bio" },
];

export default function Footer() {
  return (
    <footer className={styles.footer} id="contact">
      <div className={styles.background} aria-hidden="true">
        <BgVideo src="/media/hero-loop.mp4" className={styles.video} />
      </div>

      <div className={`container ${styles.inner}`}>
        <div className={styles.main}>
          <div className={styles.content}>
            <h2 className={styles.heading}>
              We are advancing small molecule therapeutics for age-related
              diseases.
            </h2>
            <ArrowButton label="Work with us" />
          </div>

          <div className={styles.info}>
            <div className={styles.col}>
              <div className={styles.colLabel}>Navigate</div>
              <ul className={styles.colMenu}>
                {NAVIGATE.map((l) => (
                  <li key={l.label}>
                    <a className={styles.link} href={l.href}>
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className={styles.col}>
              <div className={styles.colLabel}>Connect</div>
              <ul className={styles.colMenu}>
                {CONNECT.map((l) => (
                  <li key={l.label}>
                    <a
                      className={styles.link}
                      href={l.href}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <a className={styles.scroll} href="#top">
              Scroll
            </a>
          </div>
        </div>

        <div className={styles.bottom}>
          <div className={styles.copyright}>
            © 2026 Integrated Biosciences. All rights reserved.
          </div>
          <p className={styles.disclaimer}>
            Personal front-end reinterpretation by{" "}
            <a
              className={styles.disclaimerLink}
              href="https://codebypatrick.dev/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Patrick.Developer
            </a>{" "}
            — built from scratch as a portfolio study, not affiliated with or
            endorsed by Integrated Biosciences. Original site:{" "}
            <a
              className={styles.disclaimerLink}
              href="https://integratedbio.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              integratedbio.com
            </a>
            .
          </p>
        </div>

        <div className={styles.logo}>
          <Logo className={styles.logoEl} />
        </div>
      </div>
    </footer>
  );
}
