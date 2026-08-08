import Logo from "@/components/atoms/Logo/Logo";
import styles from "./Footer.module.css";

const COLUMNS = [
  {
    title: "Product",
    links: [
      "Explore & analyze",
      "Semantic platform",
      "Steep AI",
      "Customers",
      "Pricing",
      "Integrations",
      "Databases",
    ],
  },
  {
    title: "Resources",
    links: [
      "Blog",
      "Product updates",
      "Download",
      "Contact support",
      "Help center",
      "API reference",
      "Demo mode",
    ],
  },
  {
    title: "Company",
    links: ["Careers", "About", "Legal", "Demo data", "Security", "DPA", "Terms of service"],
  },
  {
    title: "Support",
    links: ["hello@steep.app", "Contact", "Book a demo", "Customer stories"],
  },
];

const SOCIAL = ["LinkedIn", "YouTube", "X (Twitter)"];

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.grid}>
          <div className={styles.brand}>
            <Logo height={22} />
            <p className={styles.tagline}>
              AI analytics for faster insights and zero chaos.
            </p>
          </div>

          <nav className={styles.columns} aria-label="Footer">
            {COLUMNS.map((col) => (
              <div key={col.title} className={styles.column}>
                <h3 className={styles.columnTitle}>{col.title}</h3>
                <ul className={styles.list}>
                  {col.links.map((label) => (
                    <li key={label}>
                      <a
                        className={styles.link}
                        href={
                          label.includes("@") ? `mailto:${label}` : "#top"
                        }
                      >
                        {label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className={styles.bottom}>
          <p className={styles.copy}>
            © Steep Analytics · Stockholm, Sweden
          </p>

          <ul className={styles.social}>
            {SOCIAL.map((s) => (
              <li key={s}>
                <a className={styles.link} href="#top">
                  {s}
                </a>
              </li>
            ))}
            <li>
              <a className={styles.link} href="#top">
                Cookie Settings
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
