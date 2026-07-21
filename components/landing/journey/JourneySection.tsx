"use client";

import { motion } from "framer-motion";
import {
  Store,
  MessageCircle,
  Landmark,
  Rocket,
  ArrowRight,
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
    icon: Store,
    title: "Create Your Store",
    description:
      "Choose your business name and claim your unique BioLink Market URL in seconds.",
  },
  {
    icon: MessageCircle,
    title: "Connect WhatsApp",
    description:
      "Customers can instantly chat with you after placing an order or making payment.",
  },
  {
    icon: Landmark,
    title: "Verify Your Bank",
    description:
      "Receive direct transfers into your account with instant payment verification.",
  },
  {
    icon: Rocket,
    title: "Start Selling",
    description:
      "Share your storefront on Instagram, TikTok, Facebook and WhatsApp.",
  },
];

export default function JourneySection() {
  return (
    <section
      className={`relative overflow-hidden ${colors.background} ${spacing.section}`}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-white via-emerald-50/40 to-white" />

      <div className={`relative ${spacing.container}`}>
        {/* Heading */}
        <div className={`${components.sectionHeading} mb-20`}>
          <div className={`${components.badge} ${colors.badge}`}>
            Simple Journey
          </div>

          <h2 className={`${typography.title} ${colors.text} mt-6`}>
            Launch your online business
            <span className={`block ${colors.brandText}`}>
              in under one minute.
            </span>
          </h2>

          <p className={`${components.sectionBody} ${typography.body}`}>
            No website. No coding. No complicated setup. Just four simple steps
            and you're ready to receive orders from anywhere.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          <div className="absolute left-0 right-0 top-14 hidden h-0.5 bg-gradient-to-r from-emerald-200 via-emerald-400 to-emerald-200 lg:block" />

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
                  {/* Icon */}
                  <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full border border-emerald-100 bg-white shadow-lg">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
                      <Icon className="h-8 w-8" />
                    </div>
                  </div>

                  {/* Card */}
                  <div
                    className={`${components.card} ${radius.xl} ${shadows.card} mt-8 p-7 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl`}
                  >
                    <div
                      className={`mb-5 flex h-10 w-10 items-center justify-center ${radius.full} ${colors.brand} text-sm font-bold text-white`}
                    >
                      {index + 1}
                    </div>

                    <h3 className={typography.cardTitle}>{step.title}</h3>

                    <p className={`${typography.cardBody} mt-3`}>
                      {step.description}
                    </p>

                    {index !== steps.length - 1 && (
                      <div
                        className={`mt-6 flex items-center text-sm font-semibold ${colors.brandText} lg:hidden`}
                      >
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
