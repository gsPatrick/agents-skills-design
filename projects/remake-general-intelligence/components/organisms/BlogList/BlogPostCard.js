"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./BlogList.module.css";

export default function BlogPostCard({ post, index }) {
  const cardRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const obs = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.2, rootMargin: "0px 0px -100px 0px" }
    );

    obs.observe(card);
    return () => obs.disconnect();
  }, []);

  return (
    <a className={styles.cardLink} href={post.href}>
      <div
        ref={cardRef}
        className={`${styles.card} ${visible ? styles.cardVisible : ""}`}
        style={{ transitionDelay: visible ? `${index * 100}ms` : "0ms" }}
      >
        <div className={styles.media}>
          <img src={post.image} alt={post.title} />
          <div className={styles.overlay}>
            <h3 className={styles.cardTitle}>{post.title}</h3>
            <p className={styles.author}>by {post.author}</p>
          </div>
        </div>
      </div>
    </a>
  );
}
