"use client";

import { motion } from "framer-motion";
import {
  Landmark,
  Smartphone,
  QrCode,
  Share2,
  Zap,
  ShieldCheck,
} from "lucide-react";
import {
  colors,
  radius,
  shadows,
  typography,
  spacing,
  components,
  fadeUp,
} from "@/app/lib/design-tokens";

const features = [
  {
    icon: Landmark,
    title: "Instant Bank Transfer Verification",
    desc: "Accept payments directly into your OPay, GTB, or Kuda account with instant customer verification.",
  },
  {
    icon: Smartphone,
    title: "1-Tap WhatsApp Checkout",
    desc: "Turn casual inquiries into orders. Customers chat and confirm details directly on WhatsApp.",
  },
  {
    icon: QrCode,
    title: "Dynamic Payment QR Codes",
    desc: "Generate auto-filling QR codes so buyers can scan and transfer in physical pop-up shops or markets.",
  },
  {
    icon: Share2,
    title: "Custom Bio Link Handle",
    desc: "Claim your branded URL like biolink.market/yourname for your Instagram and TikTok bio.",
  },
  {
    icon: Zap,
    title: "Zero Monthly Maintenance Fees",
    desc: "Start free with no hidden charges or expensive subscription commitments.",
  },
  {
    icon: ShieldCheck,
    title: "Built-in Trust & Verification",
    desc: "Give first-time buyers peace of mind with verified business badging and instant receipts.",
  },
];

export default function FeaturesSection() {
  return (
    <section className={`${spacing.section} ${colors.background}`}>
      <div className={spacing.container}>
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="inline-block text-xs font-extrabold uppercase tracking-widest text-[#1A9F49] bg-[#22C55E]/10 px-3 py-1.5 rounded-full">
            Built for Merchants
          </span>
          <h2 className={`${typography.title} font-extrabold text-[#0A2E1C]`}>
            Everything you need to sell online effortlessly
          </h2>
          <p className={`${typography.caption} text-slate-500`}>
            No bloated e-commerce setups. Just the exact tools Nigerian creators
            and vendors use to close deals daily.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, idx) => (
            <motion.div
              key={idx}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08 }}
              className={`${components.card} ${radius.xl} ${shadows.card} border border-gray-100 p-7 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:border-[#22C55E]/30`}
            >
              <div className="w-12 h-12 rounded-2xl bg-[#22C55E]/10 text-[#22C55E] flex items-center justify-center">
                <feat.icon className="w-6 h-6" strokeWidth={1.75} />
              </div>
              <h3 className="text-base font-bold text-[#0A2E1C] mt-5">
                {feat.title}
              </h3>
              <p
                className={`${typography.caption} text-slate-500 leading-relaxed mt-2`}
              >
                {feat.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
