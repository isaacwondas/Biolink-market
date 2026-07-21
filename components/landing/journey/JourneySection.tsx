"use client";

import { motion } from "framer-motion";
import {
  Store,
  MessageCircle,
  Landmark,
  Rocket,
  ArrowRight,
} from "lucide-react";

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
    <section className="relative overflow-hidden bg-white py-24">
      <div className="absolute inset-0 bg-gradient-to-b from-white via-emerald-50/40 to-white" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-20 max-w-3xl text-center">
          <span className="rounded-full bg-emerald-50 px-4 py-1 text-xs font-bold uppercase tracking-widest text-emerald-600">
            Simple Journey
          </span>

          <h2 className="mt-5 text-3xl font-extrabold text-slate-900 sm:text-5xl">
            Launch your online business
            <span className="block text-emerald-600">in under one minute.</span>
          </h2>

          <p className="mt-5 text-base leading-relaxed text-slate-600">
            No website. No coding. No complicated setup. Just four simple steps
            and you're ready to receive orders from anywhere.
          </p>
        </div>

        <div className="relative">
          <div className="absolute left-0 right-0 top-14 hidden h-0.5 bg-gradient-to-r from-emerald-200 via-emerald-400 to-emerald-200 lg:block" />

          <div className="grid gap-8 lg:grid-cols-4">
            {steps.map((step, index) => {
              const Icon = step.icon;

              return (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    delay: index * 0.15,
                    duration: 0.5,
                  }}
                  className="relative"
                >
                  <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full border border-emerald-100 bg-white shadow-lg">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
                      <Icon className="h-8 w-8" />
                    </div>
                  </div>

                  <div className="mt-8 rounded-3xl border border-slate-100 bg-white p-7 shadow-sm transition hover:-translate-y-2 hover:shadow-xl">
                    <div className="mb-4 inline-flex h-9 w-9 items-center justify-center rounded-full bg-emerald-600 text-sm font-bold text-white">
                      {index + 1}
                    </div>

                    <h3 className="text-xl font-bold text-slate-900">
                      {step.title}
                    </h3>

                    <p className="mt-3 text-sm leading-7 text-slate-600">
                      {step.description}
                    </p>

                    {index !== steps.length - 1 && (
                      <div className="mt-6 flex items-center text-sm font-semibold text-emerald-600 lg:hidden">
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
