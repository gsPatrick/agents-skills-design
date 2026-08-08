"use client";

import { useEffect, useState } from "react";
import Logo from "@/components/atoms/Logo/Logo";
import styles from "./NavBar.module.css";

const LINKS = [
  { label: "Platform", href: "#platform" },
  { label: "Company", href: "#company" },
  { label: "Newsroom", href: "#newsroom" },
];

export default function NavBar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`${styles.header} ${scrolled ? styles.scrolled : ""} ${
        open ? styles.menuOpen : ""
      }`}
    >
      <div className={`container ${styles.inner}`}>
        <a
          className={styles.logo}
          href="#top"
          aria-label="Integrated Biosciences"
        >
          <Logo height={22} />
        </a>

        <nav className={styles.nav}>
          <ul className={styles.menu}>
            {LINKS.map((l) => (
              <li key={l.label}>
                <a className={styles.menuItem} href={l.href}>
                  {l.label}
                </a>
              </li>
            ))}
            <li>
              <a className={styles.cta} href="#contact">
                Work with us
              </a>
            </li>
          </ul>

          <button
            type="button"
            className={`${styles.burger} ${open ? styles.burgerOpen : ""}`}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span />
            <span />
          </button>
        </nav>
      </div>

      <div
        className={`${styles.popup} ${open ? styles.popupOpen : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
      >
        <div className={styles.popupInner}>
          <ul className={styles.popupMenu}>
            {[...LINKS, { label: "Work with us", href: "#contact" }].map((l) => (
              <li key={l.label}>
                <a
                  className={styles.popupItem}
                  href={l.href}
                  onClick={() => setOpen(false)}
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <a className={styles.popupMail} href="mailto:hello@integratedbio.com">
            hello@integratedbio.com
          </a>
        </div>
      </div>
    </header>
  );
}
