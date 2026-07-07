"use client";

import styles from "./ArrowButton.module.css";

/**
 * Signature CTA (u-btn--1): a dark pill label with a concave corner that
 * nests into the lime arrow blob on the right.
 */
export default function ArrowButton({ label, href = "#", className = "" }) {
  return (
    <a
      className={`${styles.button} ${className}`}
      href={href}
      aria-label={label}
      onClick={(e) => e.preventDefault()}
    >
      <span className={styles.label}>
        <span className={styles.labelText}>{label}</span>
        <span className={styles.corner} aria-hidden="true">
          <svg width="18" height="48" viewBox="0 0 18 48" fill="none">
            <path
              fill="currentColor"
              d="M0 0h5.63c7.808 0 13.536 7.337 11.642 14.91l-6.09 24.359A11.527 11.527 0 0 1 0 48V0Z"
            />
          </svg>
        </span>
      </span>

      <span className={styles.icon} aria-hidden="true">
        <svg
          className={styles.blob}
          width="51"
          height="48"
          viewBox="0 0 51 48"
          fill="none"
        >
          <path
            fill="currentColor"
            d="M6.728 9.09A12 12 0 0 1 18.369 0H39c6.627 0 12 5.373 12 12v24c0 6.627-5.373 12-12 12H12.37C4.561 48-1.167 40.663.727 33.09l6-24Z"
          />
        </svg>
        <svg
          className={styles.arrow}
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M5 12h13M13 6l6 6-6 6"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </a>
  );
}
