import NavBar from "@/components/organisms/NavBar/NavBar";
import Hero from "@/components/organisms/Hero/Hero";
import IntroProof from "@/components/organisms/IntroProof/IntroProof";
import HowItWorksCheck from "@/components/organisms/HowItWorksCheck/HowItWorksCheck";
import HowItWorks from "@/components/organisms/HowItWorks/HowItWorks";
import Membership from "@/components/organisms/Membership/Membership";
import Clinicians from "@/components/organisms/Clinicians/Clinicians";
import Testimonials from "@/components/organisms/Testimonials/Testimonials";
import SocialProof from "@/components/organisms/SocialProof/SocialProof";
import MembershipStart from "@/components/organisms/MembershipStart/MembershipStart";
import CtaFooter from "@/components/organisms/CtaFooter/CtaFooter";
import SiteFooter from "@/components/organisms/SiteFooter/SiteFooter";

export default function SuperpowerPage() {
  return (
    <>
      <NavBar />
      <main>
        <Hero />
        <IntroProof />
        <HowItWorksCheck />
        <HowItWorks />
        <Membership />
        <Clinicians />
        <Testimonials />
        <SocialProof />
        <MembershipStart />
        {/* `.footer-cta_wrap` — no original o CTA e o rodapé vivem no MESMO
            wrapper e por isso dividem o fundo escuro. O rodapé é um cartão
            branco arredondado POR CIMA dele, com 1.5rem de respiro em volta
            (o padding do wrapper). Separados, o rodapé cai fora da imagem. */}
        <div className="footer-cta-wrap">
          <CtaFooter />
          <SiteFooter />
        </div>
      </main>
    </>
  );
}
