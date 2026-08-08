"use client";

import { useEffect, useState } from "react";
import OutlinedButton from "@/components/atoms/OutlinedButton/OutlinedButton";
import styles from "./CofounderPromo.module.css";

const PHRASES = [
  "CRM enrichment",
  "lead qualification",
  "invoice processing",
  "customer onboarding",
];

function ChatIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="24"
      viewBox="0 0 32 24"
      fill="none"
      aria-label="Chat icon"
    >
      <rect x="8.45312" y="0.150391" width="10.9594" height="2.05714" fill="#F3F5F2" />
      <rect x="10.2656" y="17.1934" width="19.3555" height="2.05714" fill="#F3F5F2" />
      <rect x="19.3047" y="2.09375" width="4.29317" height="2.05714" fill="#F3F5F2" />
      <rect x="19.3047" y="15.1543" width="4.29317" height="2.05714" fill="#F3F5F2" />
      <rect x="23.5078" y="13.1523" width="4.29317" height="8.16064" fill="#F3F5F2" />
      <rect x="4.25" y="2.09375" width="4.29317" height="2.05714" fill="#F3F5F2" />
      <rect
        x="2.27344"
        y="6.13086"
        width="6.98885"
        height="2.05714"
        transform="rotate(90 2.27344 6.13086)"
        fill="#F3F5F2"
      />
      <rect
        x="8.28906"
        y="17.1152"
        width="6.40126"
        height="2.05714"
        transform="rotate(90 8.28906 17.1152)"
        fill="#F3F5F2"
      />
      <rect
        x="29.7656"
        y="6.13086"
        width="7.29907"
        height="4.2309"
        transform="rotate(90 29.7656 6.13086)"
        fill="#F3F5F2"
      />
      <rect
        x="31.7031"
        y="8.51367"
        width="8.71088"
        height="4.2309"
        transform="rotate(90 31.7031 8.51367)"
        fill="#F3F5F2"
      />
      <rect x="2.21875" y="4.08398" width="2.05203" height="2.05714" fill="#F3F5F2" />
      <rect x="2.21875" y="13.0801" width="2.05203" height="2.05714" fill="#F3F5F2" />
      <rect x="4.17188" y="15.0234" width="2.05203" height="2.05714" fill="#F3F5F2" />
      <rect x="8.28125" y="19.2266" width="2.05203" height="2.05714" fill="#F3F5F2" />
      <rect x="23.5625" y="4.08398" width="2.05203" height="2.05714" fill="#F3F5F2" />
      <rect x="25.75" y="21.293" width="2.05203" height="2.05714" fill="#F3F5F2" />
      <rect x="16.75" y="8.6875" width="2.05203" height="2.05714" fill="#F3F5F2" />
      <rect x="12.6953" y="8.6875" width="2.05203" height="2.05714" fill="#F3F5F2" />
      <rect x="8.45312" y="8.6875" width="2.05203" height="2.05714" fill="#F3F5F2" />
    </svg>
  );
}

export default function CofounderPromo({ embedded = false }) {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const phrase = PHRASES[phraseIndex];
    const timeout = window.setTimeout(
      () => {
        if (!deleting) {
          const next = phrase.slice(0, text.length + 1);
          setText(next);
          if (next === phrase) {
            window.setTimeout(() => setDeleting(true), 1400);
          }
          return;
        }

        const next = phrase.slice(0, Math.max(text.length - 1, 0));
        setText(next);
        if (next.length === 0) {
          setDeleting(false);
          setPhraseIndex((current) => (current + 1) % PHRASES.length);
        }
      },
      deleting ? 40 : 70
    );

    return () => window.clearTimeout(timeout);
  }, [text, deleting, phraseIndex]);

  return (
    <div
      className={`${styles.wrap} ${embedded ? styles.embedded : ""}`}
      aria-label="Cofounder automation platform section"
    >
      <div className={styles.card}>
        <div className={styles.content}>
          <div className={styles.copyBlock}>
            <h2 className={styles.title}>
              Cofounder lets you automate your business with natural language
            </h2>
            <p className={styles.text}>
              Cofounder can help you with things like{" "}
              <span className={styles.typed}>
                {text}
                <span className={styles.cursor}>|</span>
              </span>
            </p>
            <OutlinedButton
              label="Get Cofounder"
              href="https://cofounder.co/"
              variant="dark"
              external
            />
          </div>

          <div className={styles.sideBlock}>
            <ChatIcon />
            <p className={styles.quote}>
              Everyone needs a Cofounder, not everyone has one.
            </p>
          </div>
        </div>

        <div className={styles.notification}>
          <div className={styles.notifInner}>
            <div className={styles.notifIcon}>
              <img
                src="/images/icons/mail.png"
                alt="New email from Cofounder"
                width={40}
                height={40}
              />
            </div>
            <div className={styles.notifCopy}>
              <div className={styles.notifHead}>
                <h4 className={styles.notifTitle}>New email from Cofounder</h4>
                <span className={styles.now}>now</span>
              </div>
              <p className={styles.notifBody}>
                Thanks for signing up! Cofounder helps you automate your everyday
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
