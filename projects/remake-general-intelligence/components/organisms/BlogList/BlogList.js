"use client";

import { useEffect, useRef, useState } from "react";
import BlogPostCard from "./BlogPostCard";
import styles from "./BlogList.module.css";

const POSTS = [
  {
    title: "An Update on Cofounder 1",
    author: "Andrew Pignanelli",
    href: "#",
    image: "/images/posts/cofounder-1-sunset-blue.png",
  },
  {
    title: "Agent-Native Engineering",
    author: "Andrew Pignanelli",
    href: "#",
    image: "/images/posts/agent-native-engineering/agent-native-engineering.png",
  },
  {
    title: "Announcing Cofounder 1.5 and our $8.7 Million Seed Round",
    author: "Andrew Pignanelli",
    href: "#",
    image: "/images/posts/cofounder-1.5-and-8.7-million-seed.png",
  },
];

export default function BlogList() {
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.2, rootMargin: "0px" }
    );

    obs.observe(section);
    return () => obs.disconnect();
  }, []);

  return (
    <div className={styles.wrap}>
      <section
        ref={sectionRef}
        id="blog-list"
        className={`${styles.section} ${visible ? styles.visible : ""}`}
        data-navbar-theme="light"
      >
        <div className={styles.inner}>
          <div className={styles.head}>
            <h2 className={styles.title}>Our vision for the future of the world</h2>
            <a className={styles.more} href="#">
              <span>Read more articles</span>
              <span className={styles.moreArrow} aria-hidden="true">
                <svg width="7" height="10" viewBox="0 0 7 10" fill="none">
                  <rect x="3.95" y="4.29" width="1.42" height="1.42" fill="currentColor" />
                  <rect x="1.13" y="1.47" width="1.42" height="1.42" fill="currentColor" />
                  <rect x="1.13" y="7.11" width="1.42" height="1.42" fill="currentColor" />
                  <rect x="2.53" y="2.88" width="1.42" height="1.42" fill="currentColor" />
                </svg>
              </span>
            </a>
          </div>

          <div className={styles.grid}>
            {POSTS.map((post, index) => (
              <BlogPostCard key={post.title} post={post} index={index} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
