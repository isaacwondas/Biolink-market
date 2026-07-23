"use client";

import OnboardingDemo from "../phone/OnboardingDemo";
import FloatingMerchant from "../merchant/FloatingMerchant";
import LiveActivity from "../activity/LiveActivity";
import Parallax from "../motion/Parallax";
import HeroAurora from "./HeroAurora";
import HeroBackground from "./HeroBackground";

export default function HeroScene() {
  return (
    <div className="relative flex items-center justify-center min-h-[420px] overflow-visible sm:min-h-[560px] lg:min-h-[760px]">
      <HeroBackground />
      <HeroAurora />

      {/* Phone */}
      <div className="relative z-20">
        <Parallax strength={35}>
          <OnboardingDemo />
        </Parallax>
      </div>

      {/* Merchants — decorative, hidden on mobile/tablet where the
          negative offsets would overflow the section's clipped bounds */}
      <FloatingMerchant
        image="/landing/merchants/fashion.JPG"
        name="Ada Fashion"
        category="Fashion Designer"
        className="z-30 hidden lg:block lg:-left-20 lg:top-10"
        delay={0}
      />

      <FloatingMerchant
        image="/landing/merchants/makeup.JPG"
        name="Glow Beauty"
        category="Makeup Artist"
        className="z-30 hidden lg:block lg:-right-20 lg:top-24"
        delay={1}
      />

      <FloatingMerchant
        image="/landing/merchants/pottery.JPG"
        name="Clay House"
        category="Pottery"
        className="z-30 hidden lg:block lg:-left-16 lg:bottom-28"
        delay={2}
      />

      <FloatingMerchant
        image="/landing/merchants/tailor.JPG"
        name="Elegant Stitch"
        category="Tailor"
        className="z-30 hidden lg:block lg:-right-14 lg:bottom-10"
        delay={3}
      />

      {/* Live Activity — same treatment; kept inside safe bounds on mobile,
          full positions restored at the lg breakpoint */}
      <LiveActivity
        icon="💰"
        title="Payment Received"
        subtitle="₦18,500"
        className="z-30 hidden sm:block sm:top-2 sm:right-4 lg:-top-6 lg:right-24"
      />

      <LiveActivity
        icon="📦"
        title="New Order"
        subtitle="Wedding Dress"
        className="z-30 hidden lg:block lg:left-4 lg:top-80"
      />

      <LiveActivity
        icon="💬"
        title="2 WhatsApp Messages"
        subtitle="Reply now"
        className="z-30 hidden sm:block sm:bottom-2 sm:left-4 lg:bottom-8 lg:right-2"
      />
    </div>
  );
}
