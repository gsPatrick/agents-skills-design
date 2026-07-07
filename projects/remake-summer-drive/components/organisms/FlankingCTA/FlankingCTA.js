import styles from "./FlankingCTA.module.css";
import DriveVideo from "./DriveVideo";

export default function FlankingCTA() {
  return (
    <section className={styles.fun}>
      <div className={styles.left}>
        <p>We Rented it Out</p>
        <p>Standard Hall</p>
        <button type="button" className={styles.button} tabIndex={-1}>
          Tickets
        </button>
      </div>

      <div className={styles.driveOn}>
        <DriveVideo />
      </div>

      <div className={styles.right}>
        <p>You&rsquo;re Invited</p>
        <p>Reserve Now</p>
        <button type="button" className={styles.button} tabIndex={-1}>
          Tickets
        </button>
      </div>
    </section>
  );
}
