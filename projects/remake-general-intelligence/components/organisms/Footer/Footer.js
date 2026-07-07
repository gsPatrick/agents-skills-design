import Logo from "@/components/atoms/Logo/Logo";
import StripeDividers from "@/components/organisms/StripeDividers/StripeDividers";
import styles from "./Footer.module.css";

const NAV = [
  { label: "Home", href: "#top" },
  { label: "About", href: "#about" },
  { label: "Writing", href: "#blog-list" },
  { label: "Careers", href: "#careers" },
  { label: "Privacy Policy", href: "#" },
  { label: "Company", href: "#" },
];

function ArrowIcon() {
  return (
    <svg width="7" height="10" viewBox="0 0 7 10" fill="none" aria-hidden="true">
      <rect x="3.95" y="4.29" width="1.42" height="1.42" fill="currentColor" />
      <rect x="1.13" y="1.47" width="1.42" height="1.42" fill="currentColor" />
      <rect x="1.13" y="7.11" width="1.42" height="1.42" fill="currentColor" />
      <rect x="2.53" y="2.88" width="1.42" height="1.42" fill="currentColor" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className={styles.footer} data-navbar-theme="light">
      <div className={styles.container}>
        <div className={styles.careersBlock} id="careers">
          <Logo variant="dark" className={styles.logo} />
          <h2 className={styles.heading}>
            We&apos;re building tools for businesses that run themselves
          </h2>
          <p className={styles.careersText}>
            If that sounds interesting to you,{" "}
            <a className={styles.careersLink} href="#careers">
              <span>come work with us</span>
              <span className={styles.careersArrow} aria-hidden="true">
                <ArrowIcon />
              </span>
            </a>
          </p>
        </div>

        <div className={styles.bottom}>
          <nav className={styles.nav} aria-label="Footer">
            <ul className={styles.navList}>
              {NAV.map((item) => (
                <li key={item.label}>
                  <a className={styles.navLink} href={item.href}>
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className={styles.actions}>
            <form className={styles.newsletter}>
              <div className={styles.inputWrap}>
                <input
                  id="newsletter-email"
                  className={styles.input}
                  type="email"
                  name="newsletter-email"
                  placeholder=" "
                />
                <label className={styles.inputLabel} htmlFor="newsletter-email">
                  Get updates in your inbox
                </label>
              </div>
              <button className={styles.submit} type="submit" aria-label="Subscribe">
                <span className={styles.submitArrow}>
                  <ArrowIcon />
                </span>
              </button>
            </form>

            <div className={styles.social}>
              <a
                className={styles.socialBtn}
                href="https://x.com/intelligenceco"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                className={styles.socialBtn}
                href="https://www.linkedin.com/company/general-intelligence-company"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      <StripeDividers variant="footer" />
    </footer>
  );
}
