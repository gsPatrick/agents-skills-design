"use client";

import styles from "./OutlinedButton.module.css";

export default function OutlinedButton({
  label,
  href = "#",
  variant = "primary",
  className = "",
  external = false,
}) {
  const props = external
    ? { target: "_blank", rel: "noopener noreferrer" }
    : {};

  return (
    <a
      className={`${styles.button} ${styles[variant]} ${className}`}
      href={href}
      {...props}
    >
      <span>{label}</span>
      <span className={styles.arrow} aria-hidden="true">
        <svg width="7" height="10" viewBox="0 0 7 10" fill="none">
          <rect x="3.95" y="4.29" width="1.42" height="1.42" fill="currentColor" />
          <rect x="1.13" y="1.47" width="1.42" height="1.42" fill="currentColor" />
          <rect x="1.13" y="7.11" width="1.42" height="1.42" fill="currentColor" />
          <rect x="2.53" y="2.88" width="1.42" height="4.25" fill="currentColor" />
        </svg>
      </span>
    </a>
  );
}
