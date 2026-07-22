"use client";

import Link from "next/link";
import { Check } from "lucide-react";

const features = [
  "1 Custom Storefront Link",
  "Unlimited Product Listings",
  "WhatsApp Checkout Button",
  "Direct Bank Transfer & QR Code",
  "Basic Analytics Dashboard",
  "Zero Commission on Sales",
];

export default function PricingSection() {
  return (
    <section id="pricing" className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <div className="mx-auto mb-16 max-w-2xl text-center space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#22C55E]/30 bg-[#22C55E]/10 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#15803D]">
            Simple Pricing
          </div>

          <h2 className="text-4xl md:text-5xl font-black tracking-tight text-[#111827]">
            Start completely free,
            <span className="block text-[#22C55E]">scale as you grow</span>
          </h2>

          <p className="text-lg text-[#6B7280] mt-4">
            No credit card required. Launch your storefront in under two minutes
            and start receiving payments immediately.
          </p>
        </div>

        {/* Pricing Card */}
        <div className="relative mx-auto max-w-md overflow-hidden border border-[#E5E7EB] bg-white rounded-2xl p-8 md:p-10 shadow-lg hover:shadow-xl transition-shadow duration-300">
          {/* Badge */}
          <div className="absolute right-8 top-0 -translate-y-1/2 rounded-full bg-[#22C55E] px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-white shadow-lg">
            Most Popular
          </div>

          <h3 className="text-2xl md:text-3xl font-black text-[#111827]">
            Starter Plan
          </h3>

          <p className="mt-2 text-sm text-[#6B7280]">
            Perfect for Instagram, TikTok, Facebook and WhatsApp businesses.
          </p>

          {/* Price */}
          <div className="mt-8 flex items-end gap-2">
            <span className="text-5xl md:text-6xl font-black tracking-tight text-[#111827]">
              ₦0
            </span>

            <span className="pb-1 text-sm text-[#6B7280]">forever free</span>
          </div>

          {/* Features */}
          <ul className="mt-10 space-y-4">
            {features.map((feature) => (
              <li key={feature} className="flex items-center gap-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#22C55E]/10 flex-shrink-0">
                  <Check className="h-4 w-4 text-[#22C55E]" />
                </div>

                <span className="text-sm text-[#374151]">{feature}</span>
              </li>
            ))}
          </ul>

          {/* CTA */}
          <Link
            href="/merchant/signup"
            className="mt-10 flex w-full items-center justify-center rounded-xl bg-[#22C55E] hover:bg-[#15803D] py-4 text-sm md:text-base font-bold text-white transition-all duration-200 hover:shadow-lg active:scale-[0.99]"
          >
            Create Your Storefront Free
          </Link>

          <p className="mt-4 text-center text-xs text-[#9CA3AF]">
            No setup fee • No subscription • No hidden charges
          </p>
        </div>
      </div>
    </section>
  );
}
