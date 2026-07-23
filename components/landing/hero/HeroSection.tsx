"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";
import HeroScene from "./HeroScene";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-green-50/50 via-white to-white py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-16 lg:grid-cols-12">
          {/* Left Column: Copy & CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-6"
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-green-100 px-4 py-1.5 text-xs font-semibold text-green-800">
              <Sparkles className="h-4 w-4 text-green-600" />
              <span>Built for Nigerian Merchants & Creators</span>
            </div>

            <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
              Turn your social media traffic into{" "}
              <span className="text-green-600">instant sales.</span>
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
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg transition hover:bg-green-700 hover:shadow-xl"
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
                <CheckCircle2 className="h-4 w-4 text-green-600" /> No coding
                needed
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-green-600" /> Zero monthly
                fees
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-green-600" /> Instant Bank
                Verification
              </span>
            </div>
          </motion.div>

          {/* Right Column: Visual Grid with Floating Badges */}
          <div className="relative lg:col-span-6">
            <HeroScene />
          </div>
          {/* Animated Floating Pill (Payment Success Notification) */}
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
            className="absolute -bottom-4 left-4 z-10 flex items-center gap-3 rounded-2xl bg-white p-4 shadow-2xl border border-gray-100"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-600">
              ⚡
            </div>
            <div>
              <p className="text-xs font-bold text-gray-900">
                Payment Verified!
              </p>
              <p className="text-[11px] text-gray-500">
                ₦25,000 via OPay • Just now
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
