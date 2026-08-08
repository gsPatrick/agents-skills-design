import WordReveal from "@/components/atoms/WordReveal/WordReveal";
import PillButton from "@/components/atoms/PillButton/PillButton";
import styles from "./SteepAI.module.css";

/**
 * "Unlock deep analysis"
 *
 * Camadas:   fundo mist + auras coloridas → screenshot → balões (absolutos)
 * Driver:    interseção (título)
 * Estados:   um
 *
 * NÃO é uma grade de cards de pergunta. É UM screenshot grande do chat com
 * três balões flutuando por cima, cada um com uma pessoa e a pergunta que
 * ela faria. Os balões sangram para fora do screenshot — é isso que dá a
 * leitura de "gente real usando", em vez de features listadas.
 *
 * Cada balão = pílula de identidade (foto + nome + departamento) encostada
 * no canto superior esquerdo de um card branco com a pergunta.
 */
const BUBBLES = [
  {
    name: "Mary",
    team: "Finance",
    face: "/media/face-1.jpg",
    question: "Are subscriptions growing in line with revenue expectations?",
    place: "left1",
  },
  {
    name: "Josephine",
    team: "Marketing",
    face: "/media/face-2.jpg",
    question:
      "Which campaigns drive the most Ad Conversions? Should we reallocate budget?",
    place: "right1",
  },
  {
    name: "Carl",
    team: "Sales",
    face: "/media/face-3.jpg",
    question:
      "Analyze customer segments to understand what's performing the best and where we have potential to grow",
    place: "left2",
  },
];

/* Três benefícios abaixo do palco. A imagem fica num contentor de fundo
   claro com o conteúdo sangrando pela base — o texto vive FORA do card,
   sem fundo próprio. */
const BENEFITS = [
  {
    image: "/media/trust.png",
    title: "Answers you can trust",
    text: "Steep AI is powered by your semantic model and answers reflect governed metrics.",
  },
  {
    image: "/media/generate-reports.png",
    title: "Generate reports",
    text: "Turn any chat into a shareable report, ready to share, edit and build on.",
  },
  {
    image: "/media/workflows.png",
    title: "Support teams where they work",
    text: "Agents across your stack work from the same governed metrics, through Steep's API and MCP.",
  },
];

export default function SteepAI() {
  return (
    <section className={styles.section} id="ai">
      <div className={styles.aura} aria-hidden="true" />

      <div className={`container ${styles.inner}`}>
        <header className={styles.head}>
          <a href="#ai" className={styles.eyebrow}>
            Steep AI
            <span className={styles.eyebrowArrow} aria-hidden="true">
              &rsaquo;
            </span>
          </a>

          <WordReveal
            as="h2"
            className={`sectionHeading ${styles.title}`}
            segments={[{ text: "Unlock deep analysis" }]}
          />

          <p className={styles.subhead}>
            Steep AI goes beyond simple answers to deliver deep, comprehensive
            analysis grounded in your semantic model.
          </p>

          <PillButton href="#cta" variant="soft" className={styles.cta}>
            Learn more
            <span className={styles.ctaArrow} aria-hidden="true">
              &rarr;
            </span>
          </PillButton>
        </header>

        <div className={styles.stage}>
          <figure className={styles.shot}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/media/hero-medium-long.png"
              alt=""
              className={styles.shotImg}
              loading="lazy"
            />
          </figure>

          {BUBBLES.map((b) => (
            <div
              key={b.name}
              className={`${styles.bubble} ${styles[b.place]}`}
            >
              <span className={styles.who}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={b.face}
                  alt=""
                  className={styles.face}
                  loading="lazy"
                />
                <span className={styles.name}>{b.name}</span>
                <span className={styles.team}>{b.team}</span>
              </span>
              <p className={styles.question}>{b.question}</p>
            </div>
          ))}
        </div>

        <div className={styles.benefits}>
          {BENEFITS.map((bn) => (
            <article key={bn.title} className={styles.benefit}>
              <div className={styles.benefitShot}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={bn.image} alt="" loading="lazy" />
              </div>
              <h3 className={styles.benefitTitle}>{bn.title}</h3>
              <p className={styles.benefitText}>{bn.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
