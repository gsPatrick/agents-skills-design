import Hero from "@/components/organisms/Hero/Hero";
import FlankingCTA from "@/components/organisms/FlankingCTA/FlankingCTA";
import AmenitiesBar from "@/components/organisms/AmenitiesBar/AmenitiesBar";
import Story from "@/components/organisms/Story/Story";
import LogosMarquee from "@/components/organisms/LogosMarquee/LogosMarquee";
import DunkTankSchedule from "@/components/organisms/DunkTankSchedule/DunkTankSchedule";
import Cursor from "@/components/organisms/Cursor/Cursor";
import SmoothScroll from "@/components/organisms/SmoothScroll/SmoothScroll";
import styles from "./page.module.css";

export default function SummerDrivePage() {
  return (
    <>
      <SmoothScroll />

      <main className={styles.wrapper}>
        <Hero />
        <FlankingCTA />
        <AmenitiesBar />
        <Story />
        <LogosMarquee />
      </main>

      <DunkTankSchedule id="schedule" />

      <Cursor />
    </>
  );
}
