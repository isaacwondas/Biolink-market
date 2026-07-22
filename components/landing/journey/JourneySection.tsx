"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

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
    image:
      "https://images.unsplash.com/photo-1556742049-0a670f4a4591?w=300&h=300&fit=crop",
  },
  {
    title: "Connect WhatsApp",
    description:
      "Customers can instantly chat with you after placing an order or making payment.",
    image:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop",
  },
  {
    title: "Verify Your Bank",
    description:
      "Receive direct transfers into your account with instant payment verification.",
    image:
      "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=300&h=300&fit=crop",
  },
  {
    title: "Start Selling",
    description:
      "Share your storefront on Instagram, TikTok, Facebook and WhatsApp.",
    image:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&h=300&fit=crop",
  },
];

export default function JourneySection() {
  return (
    <section
      className={`relative overflow-hidden ${colors.background} ${spacing.section}`}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-white via-emerald-50/40 to-white pointer-events-none" />

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
            {steps.map((step, index) => (
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
                {/* Real Image Circle with Floating Step Badge */}
                <div className="relative mx-auto h-28 w-28 rounded-full border-2 border-emerald-100 bg-white p-1.5 shadow-lg">
                  <div className="relative h-full w-full overflow-hidden rounded-full">
                    <Image
                      src={step.image}
                      alt={step.title}
                      width={112}
                      height={112}
                      className="h-full w-full object-cover"
                      unoptimized
                    />
                  </div>

                  {/* Step Number Overlay */}
                  <div
                    className={`absolute -bottom-1 -right-1 flex h-9 w-9 items-center justify-center ${radius.full} ${colors.brand} text-xs font-black text-white ring-4 ring-white shadow-md`}
                  >
                    0{index + 1}
                  </div>
                </div>

                {/* Step Card */}
                <div
                  className={`${components.card} ${radius.xl} ${shadows.card} mt-8 p-7 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl`}
                >
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
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
