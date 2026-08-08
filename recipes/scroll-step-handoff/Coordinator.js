"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import FieldPills from "@/components/molecules/FieldPills/FieldPills";
import CofounderPromo from "@/components/organisms/CofounderPromo/CofounderPromo";
import { COORDINATOR_STEPS } from "@/lib/coordinatorSteps";
import styles from "./Coordinator.module.css";

const CoordinatorDiagram = dynamic(
  () => import("@/components/molecules/CoordinatorDiagram/CoordinatorDiagram"),
  { ssr: false }
);

const STEPS_DISTANCE = 3500;
const HANDOFF_START = 2800;
const HANDOFF_LENGTH = 1000;

export default function Coordinator() {
  const containerRef = useRef(null);
  const [activeStep, setActiveStep] = useState(0);
  const [displayStep, setDisplayStep] = useState(0);
  const [dimHeading, setDimHeading] = useState(false);
  const [fading, setFading] = useState(false);
  const [handoffProgress, setHandoffProgress] = useState(0);
  const pendingStepRef = useRef(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const onScroll = () => {
      const scrolled = Math.max(-container.getBoundingClientRect().top, 0);
      const stepProgress = Math.min(scrolled / STEPS_DISTANCE, 1);
      const handoff = Math.min(
        Math.max((scrolled - HANDOFF_START) / HANDOFF_LENGTH, 0),
        1
      );
      const step = Math.min(4, Math.floor(5 * stepProgress));

      setHandoffProgress(handoff);
      setDimHeading(stepProgress > 0.02 || handoff > 0);
      setActiveStep(step);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  useEffect(() => {
    if (activeStep === displayStep) return;

    pendingStepRef.current = activeStep;
    setFading(true);

    const timeout = window.setTimeout(() => {
      setDisplayStep(pendingStepRef.current);
      setFading(false);
    }, 300);

    return () => window.clearTimeout(timeout);
  }, [activeStep, displayStep]);

  const step = COORDINATOR_STEPS[displayStep];
  const contentOpacity = 1 - handoffProgress;
  const contentBlur = handoffProgress * 6;

  return (
    <div
      id="coordinator-scroll-container"
      ref={containerRef}
      className={styles.scrollContainer}
    >
      <section
        id="coordinator-section"
        className={styles.section}
        data-navbar-theme="light"
      >
        <div
          className={styles.stickyHead}
          style={{
            opacity: contentOpacity,
            filter: `blur(${contentBlur}px)`,
          }}
        >
          <h2
            className={`${styles.heading} ${
              dimHeading ? styles.headingDimmed : ""
            }`}
          >
            <span
              className={styles.headingLine}
              style={{ opacity: contentOpacity }}
            >
              Existing specialized agents have shown success in{" "}
              <FieldPills dimmed={dimHeading} /> but these are all isolated
              systems.
            </span>
            <span
              className={styles.headingLine}
              style={{ opacity: Math.max(contentOpacity * 0.7, 0) }}
            >
              They need a coordinator.
            </span>
          </h2>
        </div>

        <div
          className={`${styles.stickyPanel} ${
            handoffProgress > 0 ? styles.stickyPanelHandoff : ""
          }`}
        >
            <div
              className={styles.panelRow}
              style={{
                opacity: contentOpacity,
                filter: `blur(${contentBlur}px)`,
                pointerEvents: handoffProgress > 0.4 ? "none" : "auto",
                visibility: handoffProgress > 0.92 ? "hidden" : "visible",
              }}
            >
              <div className={styles.textCol}>
                <div className={styles.progress} aria-hidden="true">
                  {COORDINATOR_STEPS.map((item, index) => (
                    <span
                      key={item.title}
                      className={`${styles.bar} ${
                        displayStep === index ? styles.barActive : ""
                      }`}
                    />
                  ))}
                </div>

                <div
                  className={`${styles.copy} ${
                    fading ? styles.copyHidden : styles.copyVisible
                  }`}
                >
                  <p className={styles.stepTitle}>{step.title}</p>
                  <div className={styles.stepBody}>
                    {step.body.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>
                </div>
              </div>

              <div className={styles.diagramCol}>
                <CoordinatorDiagram activeStep={displayStep} />
                <p
                  className={`${styles.caption} ${
                    fading ? styles.copyHidden : styles.copyVisible
                  }`}
                >
                  Fig. {step.figIndex} {step.figTitle}
                </p>
              </div>
            </div>

            <div
              className={styles.cofounderWrap}
              style={{
                transform:
                  handoffProgress > 0
                    ? `translateX(-50%) translateY(${(1 - handoffProgress) * 100}%)`
                    : `translateY(${(1 - handoffProgress) * 100}%)`,
                pointerEvents: handoffProgress > 0.15 ? "auto" : "none",
              }}
            >
              <div
                className={styles.cofounderGradient}
                style={{ opacity: handoffProgress * 0.6 }}
                aria-hidden="true"
              />
              <CofounderPromo embedded />
            </div>
        </div>

        <div
          className={styles.scrollRunway}
          style={{ height: HANDOFF_START + HANDOFF_LENGTH }}
          aria-hidden="true"
        />
      </section>
    </div>
  );
}
