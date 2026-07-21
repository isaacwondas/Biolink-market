"use client";

import Link from "next/link";
import { Check } from "lucide-react";
import {
  colors,
  radius,
  shadows,
  spacing,
  typography,
} from "@/app/lib/design-tokens";

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
    <section
      id="pricing"
      className={`${spacing.section} bg-slate-900 text-white`}
    >
      <div className={spacing.container}>
        {/* Heading */}
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <div className="inline-flex items-center rounded-full border border-emerald-800 bg-emerald-950/60 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-emerald-400">
            Simple Pricing
          </div>

          <h2 className={`${typography.title} mt-6`}>
            Start completely free, scale as you grow
          </h2>

          <p className={`${typography.body} mt-4 text-slate-400`}>
            No credit card required. Launch your storefront in under two minutes
            and start receiving payments immediately.
          </p>
        </div>

        {/* Pricing Card */}
        <div
          className={`relative mx-auto max-w-md overflow-hidden border border-slate-700 bg-slate-800/90 p-10 ${radius.xl} ${shadows.floating}`}
        >
          {/* Badge */}
          <div className="absolute right-8 top-0 -translate-y-1/2 rounded-full bg-emerald-600 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-white shadow-lg">
            Most Popular
          </div>

          <h3 className="text-2xl font-bold">Starter Plan</h3>

          <p className="mt-2 text-sm text-slate-400">
            Perfect for Instagram, TikTok, Facebook and WhatsApp businesses.
          </p>

          {/* Price */}
          <div className="mt-8 flex items-end gap-2">
            <span className="text-5xl font-black tracking-tight">₦0</span>

            <span className="pb-1 text-sm text-slate-400">forever free</span>
          </div>

          {/* Features */}
          <ul className="mt-10 space-y-4">
            {features.map((feature) => (
              <li key={feature} className="flex items-center gap-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/15">
                  <Check className="h-4 w-4 text-emerald-400" />
                </div>

                <span className="text-sm text-slate-300">{feature}</span>
              </li>
            ))}
          </ul>

          {/* CTA */}
          <Link
            href="/signup"
            style={{ backgroundColor: colors.brand }}
            className={`mt-10 flex w-full items-center justify-center ${radius.lg} py-4 text-sm font-bold text-white transition-transform duration-200 hover:-translate-y-0.5`}
          >
            Create Your Storefront Free
          </Link>

          <p className="mt-4 text-center text-xs text-slate-500">
            No setup fee • No subscription • No hidden charges
          </p>
        </div>
      </div>
    </section>
  );
}
