"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Check, Star } from "lucide-react";

const features = [
  "1 Custom Storefront Link",
  "Unlimited Product Listings",
  "WhatsApp Checkout Button",
  "Direct Bank Transfer & QR Code",
  "Basic Analytics Dashboard",
  "Zero Commission on Sales",
];

const customerAvatars = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop",
];

export default function PricingSection() {
  return (
    <section
      id="pricing"
      className="relative overflow-hidden bg-white py-24 px-4 sm:px-6 lg:px-8"
    >
      {/* Background Accent Mesh */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#22C55E]/5 via-transparent to-[#0A2E1C]/3 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto">
        {/* Heading */}
        <div className="mx-auto mb-16 max-w-2xl text-center space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#22C55E]/30 bg-[#22C55E]/10 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#15803D]">
            Simple Pricing
          </div>

          <h2 className="text-4xl md:text-5xl font-black tracking-tight text-[#111827]">
            Start completely free,
            <span className="block text-[#22C55E]">scale as you grow</span>
          </h2>

          <p className="text-lg text-[#6B7280]">
            No credit card required. Launch your storefront in under two minutes
            and start receiving payments immediately.
          </p>
        </div>

        {/* Pricing & Human Proof Grid */}
        <div className="grid gap-8 lg:grid-cols-12 items-center max-w-5xl mx-auto">
          {/* Main Pricing Card */}
          <div className="lg:col-span-7 relative overflow-hidden border border-[#E5E7EB] bg-white rounded-3xl p-8 md:p-10 shadow-xl hover:shadow-2xl transition-all duration-300">
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
            <div className="mt-6 flex items-end gap-2">
              <span className="text-5xl md:text-6xl font-black tracking-tight text-[#111827]">
                ₦0
              </span>
              <span className="pb-1 text-sm text-[#6B7280] font-semibold">
                forever free
              </span>
            </div>

            {/* Features */}
            <ul className="mt-8 space-y-3.5">
              {features.map((feature) => (
                <li key={feature} className="flex items-center gap-3">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#22C55E]/10 text-[#22C55E] flex-shrink-0">
                    <Check className="h-3.5 w-3.5 stroke-[3]" />
                  </div>
                  <span className="text-sm font-medium text-[#374151]">
                    {feature}
                  </span>
                </li>
              ))}
            </ul>

            {/* CTA */}
            <Link
              href="/merchant/signup"
              className="mt-8 flex w-full items-center justify-center rounded-xl bg-[#22C55E] hover:bg-[#15803D] py-4 text-sm md:text-base font-bold text-white transition-all duration-200 hover:shadow-lg active:scale-[0.99]"
            >
              Create Your Storefront Free
            </Link>

            <p className="mt-4 text-center text-xs text-[#9CA3AF]">
              No setup fee • No subscription • No hidden charges
            </p>
          </div>

          {/* Real Human Social Proof Card */}
          <div className="lg:col-span-5 space-y-6">
            {/* Merchant Spotlight Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="rounded-3xl border border-[#E5E7EB] bg-[#F9FAFB] p-6 shadow-sm relative overflow-hidden"
            >
              <div className="flex items-center gap-4">
                <div className="relative h-16 w-16 overflow-hidden rounded-2xl border-2 border-white shadow-md flex-shrink-0">
                  <Image
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop"
                    alt="Active Merchant"
                    width={64}
                    height={64}
                    className="h-full w-full object-cover"
                    unoptimized
                  />
                </div>
                <div>
                  <div className="flex items-center gap-1 text-[#22C55E]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-[#22C55E]" />
                    ))}
                  </div>
                  <h4 className="mt-1 font-bold text-[#111827]">Amina Bello</h4>
                  <p className="text-xs text-[#6B7280]">
                    Founder, Lagos Glow Skincare
                  </p>
                </div>
              </div>

              <blockquote className="mt-4 text-sm text-[#374151] italic leading-relaxed">
                &ldquo;Setting up took under 2 minutes. My Instagram customers
                love buying directly on WhatsApp without DM
                back-and-forth!&rdquo;
              </blockquote>
            </motion.div>

            {/* Customer Stack Banner */}
            <div className="rounded-3xl border border-[#E5E7EB] bg-white p-6 shadow-sm flex items-center justify-between gap-4">
              <div>
                <div className="text-2xl font-black text-[#111827]">1,200+</div>
                <div className="text-xs text-[#6B7280]">
                  Merchants already selling
                </div>
              </div>

              <div className="flex -space-x-3 overflow-hidden">
                {customerAvatars.map((url, index) => (
                  <div
                    key={index}
                    className="inline-block h-10 w-10 rounded-full ring-2 ring-white overflow-hidden"
                  >
                    <Image
                      src={url}
                      alt="Merchant User"
                      width={40}
                      height={40}
                      className="h-full w-full object-cover"
                      unoptimized
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
