import AnnounceBar from "@/components/organisms/AnnounceBar/AnnounceBar";
import TopNav from "@/components/organisms/TopNav/TopNav";
import Hero from "@/components/organisms/Hero/Hero";
import ProductSection from "@/components/organisms/ProductSection/ProductSection";
import HighlightSection from "@/components/organisms/HighlightSection/HighlightSection";
import ViaCapSection from "@/components/organisms/ViaCapSection/ViaCapSection";
import MicrobioSection from "@/components/organisms/MicrobioSection/MicrobioSection";
import ReviewCarousel from "@/components/organisms/ReviewCarousel/ReviewCarousel";
import UgcScroller from "@/components/organisms/UgcScroller/UgcScroller";
import Bookend from "@/components/organisms/Bookend/Bookend";
import SiteFooter from "@/components/organisms/SiteFooter/SiteFooter";
import styles from "./page.module.css";

export default function SeedPage() {
  return (
    <div className={styles.page} id="top">
      {/* O nav fica FORA do shell: sticky só funciona enquanto o elemento
          está dentro do pai, e o shell mede só ~96px (anúncio + nav). Como
          filho direto do .page, ele tem a página inteira para grudar. */}
      <div className={styles.shell}>
        <AnnounceBar />
      </div>

      <div className={styles.navInset}>
        <TopNav />
      </div>

      <main>
        <Hero />
        <ProductSection />
        <HighlightSection />
        <ViaCapSection />
        <MicrobioSection />
        <ReviewCarousel />
        <UgcScroller />
        <Bookend />
      </main>

      <SiteFooter />
    </div>
  );
}
