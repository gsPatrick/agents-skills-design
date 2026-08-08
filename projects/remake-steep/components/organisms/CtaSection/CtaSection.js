import WordReveal from "@/components/atoms/WordReveal/WordReveal";
import PillButton from "@/components/atoms/PillButton/PillButton";
import ArrowLink from "@/components/atoms/ArrowLink/ArrowLink";
import DoorVideo from "./DoorVideo";
import styles from "./CtaSection.module.css";

/**
 * Camadas:   uma
 * Driver:    interseção (título)
 * Estados:   um
 *
 * Duas colunas alinhadas à esquerda: copy + CTAs à esquerda, a porta à
 * direita. A porta é um vídeo em loop (door.mp4) de 360×360, servido como
 * ilustração solta — sem raio, sem sombra, sem card. É a metáfora do
 * "entre", não uma prévia do produto.
 */
export default function CtaSection() {
  return (
    <section className={styles.section} id="cta">
      <div className={`containerNarrow ${styles.inner}`}>
        <div className={styles.copy}>
          <WordReveal
            as="h2"
            className={`sectionHeading ${styles.title}`}
            segments={[{ text: "Get started for free" }]}
          />

          <p className={styles.subhead}>
            Try Steep for free with up to 3 users. Connect your database or
            explore in demo mode.
          </p>

          <div className={styles.actions}>
            <PillButton href="#cta" variant="filled">
              Get started
            </PillButton>
            <ArrowLink href="#cta">Book a demo</ArrowLink>
          </div>
        </div>

        {/* O original fecha a página com um vídeo (/videos/door.mp4), não um
            screenshot. Defesa completa de autoplay iOS: ver
            recipes/video-autoplay-ios. */}
        <div className={styles.preview} aria-hidden="true">
          <DoorVideo />
        </div>
      </div>
    </section>
  );
}
