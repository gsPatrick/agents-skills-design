"use client";

import { useEffect, useState } from "react";
import Logo from "@/components/atoms/Logo/Logo";
import OutlinedButton from "@/components/atoms/OutlinedButton/OutlinedButton";
import styles from "./NavBar.module.css";

const LINKS = [
  { label: "About", href: "#about" },
  { label: "Writing", href: "#blog-list" },
  { label: "Careers", href: "#careers" },
];

export default function NavBar() {
  const [theme, setTheme] = useState("dark");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const sections = document.querySelectorAll("[data-navbar-theme]");
    const onScroll = () => {
      const y = window.scrollY + 80;
      let next = "light";
      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        const top = rect.top + window.scrollY;
        const bottom = top + rect.height;
        if (y >= top && y < bottom) {
          next = section.getAttribute("data-navbar-theme") || "light";
        }
      });
      setTheme(next);
    };

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

  const isDark = theme === "dark";

  return (
    <>
      <nav
        className={`${styles.nav} ${isDark ? styles.dark : styles.light} ${
          open ? styles.menuOpen : ""
        }`}
        aria-label="Main navigation"
      >
        <a href="#top" className={styles.logo} aria-label="General Intelligence Company">
          <Logo variant={isDark ? "light" : "dark"} />
        </a>

        <ul className={styles.links}>
          {LINKS.map((l) => (
            <li key={l.label}>
              <a className={styles.link} href={l.href}>
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <OutlinedButton
          label="Get Cofounder"
          href="https://cofounder.co/"
          variant={isDark ? "dark" : "primary"}
          external
          className={styles.cta}
        />

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

      <div
        className={`${styles.overlay} ${open ? styles.overlayOpen : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
      >
        <ul className={styles.overlayMenu}>
          {[{ label: "Home", href: "#top" }, ...LINKS].map((l) => (
            <li key={l.label}>
              <a
                className={styles.overlayItem}
                href={l.href}
                onClick={() => setOpen(false)}
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <p className={styles.overlayCopy}>
          © The General Intelligence Company 2026
        </p>
      </div>
    </>
  );
}
