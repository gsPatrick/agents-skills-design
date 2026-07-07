import styles from "./DunkTankSchedule.module.css";

const ROWS = [
  { name: "Sasha Gainullin", company: "Battleface", time: "6:00" },
  { name: "Braden Lambros", company: "Olive", time: "6:20" },
  { name: "Andy Lonsberry", company: "Path", time: "6:40" },
  { name: "Sean Lane in a Tuxedo", company: "Olive", time: "7:00" },
  { name: "Olivia Weinstock", company: "Tandem", time: "7:20" },
  {
    name: "Mark Kvamme",
    name2: "and Chris Olsen",
    company: "Drive Capital",
    time: "7:40",
  },
  { name: "Paul Powers", company: "Physna", time: "8:00" },
  { name: "Matt Wyckhouse", company: "Finite State", time: "8:20" },
  { name: "Calvin Cooper", company: "Rhove", time: "8:40" },
  { name: "Alex Frommeyer", company: "Beam", time: "9:00" },
  { name: "Jaysson Eicholtz", company: "Forge", time: "9:20" },
  { name: "Kel Guerin", company: "Ready Robotics", time: "9:40" },
];

export default function DunkTankSchedule({ id }) {
  return (
    <section id={id} className={styles.schedule}>
      <div className={styles.grid}>
        <p>Dunk Tank Schedule:</p>
        <aside>
          {ROWS.map((row) => (
            <div key={row.name} className={styles.row}>
              <p>
                {row.name}
                {row.name2 && (
                  <>
                    <br />
                    {row.name2}
                  </>
                )}
              </p>
              <p>{row.company}</p>
              <time>{row.time}</time>
            </div>
          ))}
        </aside>
      </div>

      <footer className={styles.footer}>
        <a
          className={styles.link}
          href="https://codebypatrick.dev/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Developed By Patrick.Developer
        </a>
        <span>&copy; 2026</span>
        <a
          className={styles.link}
          href="https://codebypatrick.dev/"
          target="_blank"
          rel="noopener noreferrer"
        >
          codebypatrick.dev
        </a>
      </footer>

      <p className={styles.disclaimer}>
        This is a personal reinterpretation of Drive Capital&rsquo;s original
        &ldquo;The Summer Drive&rdquo; site, rebuilt from scratch by
        Patrick.Developer as a portfolio piece to showcase front-end development
        skills. Not affiliated with or endorsed by Drive Capital or Studio
        Freight &mdash; all original branding and the event belong to their
        respective owners. Original site:{" "}
        <a
          className={styles.disclaimerLink}
          href="https://www.thesummerdrive.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          thesummerdrive.com
        </a>
        .
      </p>
    </section>
  );
}
