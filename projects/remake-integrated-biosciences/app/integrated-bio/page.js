import NavBar from "@/components/organisms/NavBar/NavBar";
import HeroExperience from "@/components/organisms/HeroExperience/HeroExperience";
import Platform from "@/components/organisms/Platform/Platform";
import UspCards from "@/components/organisms/UspCards/UspCards";
import Marquee from "@/components/organisms/Marquee/Marquee";
import Company from "@/components/organisms/Company/Company";
import Newsroom from "@/components/organisms/Newsroom/Newsroom";
import Footer from "@/components/organisms/Footer/Footer";
import styles from "./page.module.css";

export default function IntegratedBioPage() {
  return (
    <>
      <NavBar />
      <div className={styles.pageContent}>
        <main>
          <HeroExperience />
          <Platform />
          <UspCards />
          <Marquee />
          <Company />
          <Newsroom />
        </main>
      </div>
      <Footer />
    </>
  );
}
