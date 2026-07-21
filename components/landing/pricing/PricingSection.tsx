"use client";

import Link from "next/link";
import { Check } from "lucide-react";

export default function PricingSection() {
  return (
    <section className="py-20 bg-slate-900 text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-3 py-1 rounded-full">
            Simple Pricing
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold">
            Start completely free, scale as you grow
          </h2>
          <p className="mt-3 text-slate-400 text-sm">
            No credit card needed. Set up your digital link in under 60 seconds.
          </p>
        </div>

        <div className="max-w-md mx-auto bg-slate-800/80 rounded-3xl border border-slate-700 p-8 shadow-2xl relative">
          <div className="absolute -top-3 right-6 bg-emerald-600 text-white text-[10px] uppercase font-extrabold tracking-widest px-3 py-1 rounded-full">
            Most Popular
          </div>

          <h3 className="text-xl font-bold">Starter Plan</h3>
          <p className="text-xs text-slate-400 mt-1">
            Perfect for Instagram, TikTok & WhatsApp merchants
          </p>

          <div className="mt-6 flex items-baseline gap-1">
            <span className="text-4xl font-extrabold">₦0</span>
            <span className="text-slate-400 text-xs">/ forever free</span>
          </div>

          <ul className="mt-8 space-y-3.5 text-xs sm:text-sm text-slate-300">
            {[
              "1 Custom Storefront Link",
              "Unlimited Product Listings",
              "WhatsApp Checkout Button",
              "Direct Bank Transfer & QR Code",
              "Basic Analytics Dashboard",
              "Zero Commission on Sales",
            ].map((item, idx) => (
              <li key={idx} className="flex items-center gap-2.5">
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <Link
            href="/signup"
            className="mt-8 block w-full text-center rounded-xl bg-emerald-600 py-3.5 text-sm font-bold text-white shadow-lg hover:bg-emerald-500 transition"
          >
            Create Your Storefront Free
          </Link>
        </div>
      </div>
    </section>
  );
}
