"use client";

import { useState } from "react";
import { FIELD_PILLS } from "@/lib/coordinatorSteps";
import styles from "./FieldPills.module.css";

export default function FieldPills({ dimmed = false }) {
  const [active, setActive] = useState(false);

  return (
    <span
      className={`${styles.wrap} ${dimmed ? styles.dimmed : ""}`}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
      onFocus={() => setActive(true)}
      onBlur={() => setActive(false)}
    >
      <span className={styles.trigger}>multiple fields</span>
      <span className={styles.overlay} aria-hidden="true">
        {FIELD_PILLS.map((pill) => (
          <span
            key={pill.label}
            className={`${styles.pill} ${styles[pill.className]} ${
              active ? styles.pillVisible : ""
            }`}
          >
            {pill.label}
          </span>
        ))}
      </span>
    </span>
  );
}
