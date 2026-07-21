"use client";

import OnboardingDemo from "../phone/OnboardingDemo";
import FloatingMerchant from "../merchant/FloatingMerchant";
import LiveActivity from "../activity/LiveActivity";
import Parallax from "../motion/Parallax";
import HeroAurora from "./HeroAurora";
import HeroBackground from "./HeroBackground";

export default function HeroScene() {
  return (
    <div className="relative flex items-center justify-center min-h-[760px] overflow-visible">
      <HeroBackground />

      {/* Phone */}

      <div className="relative z-20">
        <Parallax strength={35}>
          <OnboardingDemo />
        </Parallax>
      </div>

      {/* Merchants */}

      <FloatingMerchant
        image="/landing/merchants/fashion.jpg"
        name="Ada Fashion"
        category="Fashion Designer"
        className="-left-20 top-10"
        delay={0}
      />

      <FloatingMerchant
        image="/landing/merchants/makeup.jpg"
        name="Glow Beauty"
        category="Makeup Artist"
        className="-right-20 top-24"
        delay={1}
      />

      <FloatingMerchant
        image="/landing/merchants/pottery.jpg"
        name="Clay House"
        category="Pottery"
        className="-left-16 bottom-28"
        delay={2}
      />

      <FloatingMerchant
        image="/landing/merchants/tailor.jpg"
        name="Elegant Stitch"
        category="Tailor"
        className="-right-14 bottom-10"
        delay={3}
      />

      {/* Live Activity */}

      <LiveActivity
        icon="💰"
        title="Payment Received"
        subtitle="₦18,500"
        className="-top-6 right-24"
      />

      <LiveActivity
        icon="📦"
        title="New Order"
        subtitle="Wedding Dress"
        className="left-4 top-80"
      />

      <LiveActivity
        icon="💬"
        title="2 WhatsApp Messages"
        subtitle="Reply now"
        className="bottom-8 right-2"
      />

      <HeroAurora />

      <HeroBackground />
    </div>
  );
}
