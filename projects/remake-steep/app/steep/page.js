import NavBar from "@/components/organisms/NavBar/NavBar";
import Hero from "@/components/organisms/Hero/Hero";
import Platform from "@/components/organisms/Platform/Platform";
import Engage from "@/components/organisms/Engage/Engage";
import CustomerStory from "@/components/organisms/CustomerStory/CustomerStory";
import SemanticPlatform from "@/components/organisms/SemanticPlatform/SemanticPlatform";
import SteepAI from "@/components/organisms/SteepAI/SteepAI";
import CtaSection from "@/components/organisms/CtaSection/CtaSection";
import Footer from "@/components/organisms/Footer/Footer";
import styles from "./page.module.css";

export default function SteepPage() {
  return (
    <div className={styles.page}>
      <NavBar />
      <main>
        {/* A faixa de logos vive DENTRO do Hero, sobreposta ao dashboard —
            é assim no original, não é seção própria. */}
        <Hero />
        <Platform />
        <Engage />
        <CustomerStory />
        <SemanticPlatform />
        <SteepAI />
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
}
