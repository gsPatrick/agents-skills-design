import NavBar from "@/components/organisms/NavBar/NavBar";
import Hero from "@/components/organisms/Hero/Hero";
import StripeDividers from "@/components/organisms/StripeDividers/StripeDividers";
import Vision from "@/components/organisms/Vision/Vision";
import Coordinator from "@/components/organisms/Coordinator/Coordinator";
import BlogList from "@/components/organisms/BlogList/BlogList";
import Footer from "@/components/organisms/Footer/Footer";
import FooterBackground from "@/components/organisms/FooterBackground/FooterBackground";
import CookieBanner from "@/components/organisms/CookieBanner/CookieBanner";
import styles from "./page.module.css";

export default function GeneralIntelligencePage() {
  return (
    <>
      <NavBar />
      <div className={styles.page}>
        <main>
          <Hero />
          <StripeDividers />
          <Vision />
          <Coordinator />
          <BlogList />
          <Footer />
          <FooterBackground />
        </main>
      </div>
      <CookieBanner />
    </>
  );
}
