"use client";

import { useEffect, useState } from "react";
import Logo from "@/components/atoms/Logo/Logo";
import PillButton from "@/components/atoms/PillButton/PillButton";
import styles from "./NavBar.module.css";

const LINKS = [
  { label: "Product", href: "#platform" },
  { label: "Resources", href: "#semantic" },
  { label: "Customers", href: "#story" },
  { label: "Pricing", href: "#cta" },
];

const MOBILE_LINKS = [
  { label: "Explore & analyze", href: "#engage" },
  { label: "Semantic platform", href: "#semantic" },
  { label: "Steep AI", href: "#ai" },
  { label: "Customers", href: "#story" },
  { label: "Pricing", href: "#cta" },
];

/**
 * Nav — fixo, transparente, 64px.
 *
 * Sem estado de scroll: o original nunca ganha fundo nem sombra. A
 * legibilidade é garantida pela composição (o hero mantém a faixa superior
 * limpa), não por um painel fosco.
 */
export default function NavBar() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <nav
      className={`${styles.header} ${open ? styles.menuOpen : ""}`}
      aria-label="Main"
    >
      <div className={styles.inner}>
        <a href="#top" className={styles.logo} aria-label="Steep home">
          {/* 90×28 — as dimensões exatas do wordmark no original. */}
          <Logo height={28} />
        </a>

        <div className={styles.nav}>
          <ul className={styles.menu}>
            {LINKS.map((l) => (
              <li key={l.label}>
                <a className={styles.menuItem} href={l.href}>
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.actions}>
          <PillButton href="#cta" variant="ghost" className={styles.demoCta}>
            Book a demo
          </PillButton>
          <PillButton href="#cta" variant="filled">
            Get started
          </PillButton>
        </div>

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
      </div>

      <div
        className={`${styles.popup} ${open ? styles.popupOpen : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
      >
        <div className={styles.popupInner}>
          <ul className={styles.popupMenu}>
            {MOBILE_LINKS.map((l) => (
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

          <div className={styles.popupActions}>
            <PillButton href="#cta" variant="soft" size="regular">
              Book a demo
            </PillButton>
            <PillButton href="#cta" variant="filled" size="regular">
              Get started
            </PillButton>
          </div>
        </div>
      </div>
    </nav>
  );
}
