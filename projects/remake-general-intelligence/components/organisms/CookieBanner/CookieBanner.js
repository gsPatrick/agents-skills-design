"use client";

import { useEffect, useState } from "react";
import styles from "./CookieBanner.module.css";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem("gic-cookies");
    if (!accepted) setVisible(true);
  }, []);

  const dismiss = (value) => {
    localStorage.setItem("gic-cookies", value);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className={styles.banner} role="dialog" aria-label="Cookie consent">
      <img src="/images/flower-icon.svg" alt="" width={20} height={20} />
      <p className={styles.text}>
        A few cookies, so things grow and flow just right.
      </p>
      <div className={styles.actions}>
        <button type="button" onClick={() => dismiss("declined")}>
          Decline
        </button>
        <span className={styles.divider} aria-hidden="true" />
        <button type="button" onClick={() => dismiss("accepted")}>
          Accept
        </button>
      </div>
    </div>
  );
}
