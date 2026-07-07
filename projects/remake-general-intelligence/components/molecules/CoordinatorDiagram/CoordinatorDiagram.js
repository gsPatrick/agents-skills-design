"use client";

import { useEffect, useRef, useState } from "react";
import Lottie from "lottie-react";
import { COORDINATOR_STEPS } from "@/lib/coordinatorSteps";
import styles from "./CoordinatorDiagram.module.css";

export default function CoordinatorDiagram({ activeStep }) {
  const rootRef = useRef(null);
  const lottieRef = useRef(null);
  const prevStepRef = useRef(-1);
  const hasPlayedRef = useRef(false);
  const [animationData, setAnimationData] = useState(null);

  useEffect(() => {
    fetch("/animations/coordinator.json")
      .then((res) => res.json())
      .then(setAnimationData)
      .catch(() => setAnimationData(null));
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        const player = lottieRef.current;
        if (!entry.isIntersecting || !player || hasPlayedRef.current) return;

        const first = COORDINATOR_STEPS[0];
        player.playSegments([first.frameStart, first.frameEnd], true);
        hasPlayedRef.current = true;
        prevStepRef.current = 0;
        obs.disconnect();
      },
      { threshold: 0.3 }
    );

    obs.observe(root);
    return () => obs.disconnect();
  }, [animationData]);

  useEffect(() => {
    const player = lottieRef.current;
    if (!player || !animationData) return;

    const step = COORDINATOR_STEPS[activeStep];
    if (!step) return;

    if (prevStepRef.current !== activeStep) {
      player.playSegments([step.frameStart, step.frameEnd], true);
      prevStepRef.current = activeStep;
    }
  }, [activeStep, animationData]);

  return (
    <div ref={rootRef} className={styles.wrap}>
      <div className={styles.frame}>
        <div className={styles.canvas}>
          {animationData ? (
            <Lottie
              lottieRef={lottieRef}
              animationData={animationData}
              loop={false}
              autoplay={false}
              className={styles.lottie}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}
