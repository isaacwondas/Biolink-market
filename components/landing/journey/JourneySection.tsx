"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  Store,
  MessageCircle,
  Landmark,
  Rocket,
} from "lucide-react";

import {
  colors,
  components,
  fadeUp,
  radius,
  shadows,
  spacing,
  transition,
  typography,
} from "@/app/lib/design-tokens";

const steps = [
  {
    title: "Create Your Store",
    description:
      "Choose your business name and claim your unique BioLink Market URL in seconds.",
    icon: Store,
  },
  {
    title: "Connect WhatsApp",
    description:
      "Customers can instantly chat with you after placing an order or making payment.",
    icon: MessageCircle,
  },
  {
    title: "Verify Your Bank",
    description:
      "Receive direct transfers into your account with instant payment verification.",
    icon: Landmark,
  },
  {
    title: "Start Selling",
    description:
      "Share your storefront on Instagram, TikTok, Facebook and WhatsApp.",
    icon: Rocket,
  },
];

export default function JourneySection() {
  return (
    <section
      className={`relative overflow-hidden ${colors.background} ${spacing.section}`}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-white via-[#22C55E]/5 to-white pointer-events-none" />

      <div className={`relative ${spacing.container}`}>
        {/* Heading */}
        <div className={`${components.sectionHeading} mb-20`}>
          <div className={`${components.badge} bg-[#22C55E]/10 text-[#1A9F49]`}>
            Simple Journey
          </div>

          <h2 className={`${typography.title} text-[#0A2E1C] mt-6`}>
            Launch your online business
            <span className="block text-[#22C55E]">in under one minute.</span>
          </h2>

          <p className={`${components.sectionBody} ${typography.body}`}>
            No website. No coding. No complicated setup. Just four simple steps
            and you're ready to receive orders from anywhere.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          <div className="absolute left-0 right-0 top-14 hidden h-0.5 bg-gradient-to-r from-[#22C55E]/20 via-[#22C55E] to-[#22C55E]/20 lg:block" />

          <div className="grid gap-8 lg:grid-cols-4">
            {steps.map((step, index) => {
              const Icon = step.icon;

              return (
                <motion.div
                  key={step.title}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  transition={{
                    ...transition.default,
                    delay: index * 0.15,
                  }}
                  className="relative"
                >
                  {/* Icon Badge with Floating Step Number */}
                  <div className="relative mx-auto flex h-28 w-28 items-center justify-center rounded-full border-2 border-[#22C55E]/20 bg-[#22C55E]/10 shadow-lg">
                    <Icon
                      className="h-11 w-11 text-[#22C55E]"
                      strokeWidth={1.75}
                    />

                    {/* Step Number Overlay */}
                    <div
                      className={`absolute -bottom-1 -right-1 flex h-9 w-9 items-center justify-center ${radius.full} bg-[#22C55E] text-xs font-black text-white ring-4 ring-white shadow-md`}
                    >
                      0{index + 1}
                    </div>
                  </div>

                  {/* Step Card */}
                  <div
                    className={`${components.card} ${radius.xl} ${shadows.card} mt-8 p-7 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl`}
                  >
                    <h3 className={`${typography.cardTitle} text-[#0A2E1C]`}>
                      {step.title}
                    </h3>

                    <p className={`${typography.cardBody} mt-3`}>
                      {step.description}
                    </p>

                    {index !== steps.length - 1 && (
                      <div className="mt-6 flex items-center text-sm font-semibold text-[#22C55E] lg:hidden">
                        Next
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
