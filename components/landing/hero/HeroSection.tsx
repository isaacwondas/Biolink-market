"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";
import HeroScene from "./HeroScene";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#22C55E]/5 via-white to-white py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-16 lg:grid-cols-12">
          {/* Left Column: Copy & CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-6"
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-[#22C55E]/10 px-4 py-1.5 text-xs font-semibold text-[#1A9F49]">
              <Sparkles className="h-4 w-4 text-[#22C55E]" />
              <span>Built for Nigerian Merchants & Creators</span>
            </div>

            <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-[#0A2E1C] sm:text-5xl lg:text-6xl">
              Turn your social media traffic into{" "}
              <span className="text-[#22C55E]">instant sales.</span>
            </h1>

            <p className="mt-4 text-base text-gray-600 sm:text-lg">
              Launch a fast, lightweight payment-link storefront in seconds.
              Receive direct bank transfers with instant verification without
              paying heavy transaction fees.
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
              <Link
                href="/signup"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-[#22C55E] px-6 py-3.5 text-sm font-bold text-white shadow-lg transition hover:bg-[#1A9F49] hover:shadow-xl"
              >
                Create Your Free Store
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="#demo"
                className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-6 py-3.5 text-sm font-bold text-gray-700 hover:bg-gray-50"
              >
                See It In Action
              </Link>
            </div>

            {/* Feature Highlights */}
            <div className="mt-8 flex items-center gap-6 text-xs font-medium text-gray-500">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-[#22C55E]" /> No coding
                needed
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-[#22C55E]" /> Zero monthly
                fees
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-[#22C55E]" /> Instant Bank
                Verification
              </span>
            </div>
          </motion.div>

          {/* Right Column: Visual Grid with Floating Badges */}
          <div className="relative lg:col-span-6">
            <HeroScene />

            {/* Animated Floating Pill (Payment Success Notification) */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
              className="absolute -bottom-3 left-2 z-10 flex max-w-[85%] items-center gap-2 rounded-xl bg-white p-2.5 shadow-2xl border border-gray-100 sm:-bottom-4 sm:left-4 sm:max-w-none sm:gap-3 sm:rounded-2xl sm:p-4"
            >
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#22C55E]/10 text-[#22C55E] sm:h-10 sm:w-10">
                ⚡
              </div>
              <div className="min-w-0">
                <p className="truncate text-[11px] font-bold text-[#0A2E1C] sm:text-xs">
                  Payment Verified!
                </p>
                <p className="truncate text-[10px] text-gray-500 sm:text-[11px]">
                  ₦25,000 via OPay • Just now
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
