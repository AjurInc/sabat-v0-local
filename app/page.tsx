import { Navigation } from "@/components/landing/navigation";
import { LogoShowcaseHero } from "@/components/landing/logo-showcase-hero";
import { HeroSection } from "@/components/landing/hero-section";
import { FeaturesSection } from "@/components/landing/features-section";
import { HowItWorksSection } from "@/components/landing/how-it-works-section";
import { MetricsSection } from "@/components/landing/metrics-section";
import { IndustriesSection } from "@/components/landing/industries-section";
import { FAQSection } from "@/components/landing/faq-section";
import { ContactSection } from "@/components/landing/contact-section";
import { CtaSection } from "@/components/landing/cta-section";
import { FooterSection } from "@/components/landing/footer-section";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-x-hidden noise-overlay">
      <Navigation />
      <LogoShowcaseHero />
      <HeroSection />
      <MetricsSection />
      <FeaturesSection />
      <HowItWorksSection />
      <IndustriesSection />
      <FAQSection />
      <CtaSection />
      <ContactSection />
      <FooterSection />
    </main>
  );
}

