// components/landing/LandingPage.tsx

import HeroSection from "./hero/HeroSection";
import JourneySection from "./journey/JourneySection";
import TestimonialsSection from "./testimonials/TestimonialsSection";
import Navbar from "./navbar/Navbar";
import Footer from "./footer/Footer";
import FinalCTA from "./cta/FinalCTA";
import FAQSection from "./faq/FAQSection";
import PricingSection from "./pricing/PricingSection";
import FeaturesSection from "./features/FeaturesSection";
import StorefrontSection from "./storefront/StorefrontSection";
import AnalyticsSection from "./analytics/AnalyticsSection";

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <JourneySection />
      <StorefrontSection />
      <FeaturesSection />
      <AnalyticsSection />
      <TestimonialsSection />
      <PricingSection />
      <FAQSection />
      <FinalCTA />
      <Footer />
    </>
  );
}
