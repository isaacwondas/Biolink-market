"use client";

import { motion } from "framer-motion";
import {
  Building,
  Smartphone,
  Zap,
  ShieldCheck,
  QrCode,
  Share2,
} from "lucide-react";

const features = [
  {
    icon: Building,
    title: "Instant Bank Transfer Verification",
    description:
      "Accept payments directly into your OPay, GTB, or Kuda account with instant customer verification.",
  },
  {
    icon: Smartphone,
    title: "1-Tap WhatsApp Checkout",
    description:
      "Turn casual inquiries into orders. Customers chat and confirm details directly on WhatsApp.",
  },
  {
    icon: QrCode,
    title: "Dynamic Payment QR Codes",
    description:
      "Generate auto-filling QR codes so buyers can scan and transfer in physical pop-up shops or markets.",
  },
  {
    icon: Share2,
    title: "Custom Bio Link Handle",
    description:
      "Claim your branded URL like biolink.market/yourname for your Instagram and TikTok bio.",
  },
  {
    icon: Zap,
    title: "Zero Monthly Maintenance Fees",
    description:
      "Start free with no hidden charges or expensive subscription commitments.",
  },
  {
    icon: ShieldCheck,
    title: "Built-in Trust & Verification",
    description:
      "Give first-time buyers peace of mind with verified business badging and instant receipts.",
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-20 bg-slate-50/50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
            Built for Merchants
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-slate-900">
            Everything you need to sell online effortlessly
          </h2>
          <p className="mt-3 text-slate-600 text-sm sm:text-base">
            No bloated e-commerce setups. Just the exact tools Nigerian creators
            and vendors use to close deals daily.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition"
            >
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-5">
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                {feature.title}
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-500 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
