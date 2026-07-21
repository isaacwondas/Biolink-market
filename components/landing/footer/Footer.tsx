"use client";

import Link from "next/link";
import { colors, spacing, typography } from "@/app/lib/design-tokens";

export default function Footer() {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 text-slate-400">
      <div
        className={`${spacing.container} flex flex-col items-center justify-between gap-8 py-10 md:flex-row`}
      >
        {/* Brand */}
        <div className="text-center md:text-left">
          <Link href="/" className="inline-block">
            <span className="text-2xl font-black tracking-tight text-white">
              BioLink
              <span style={{ color: colors.brand }}>.Market</span>
            </span>
          </Link>

          <p className={`${typography.caption} mt-2 max-w-xs text-slate-500`}>
            Simple payment-link storefronts built for social commerce.
          </p>
        </div>

        {/* Navigation */}
        <nav className="flex flex-wrap items-center justify-center gap-6 text-sm font-medium">
          <Link href="#features" className="transition-colors hover:text-white">
            Features
          </Link>

          <Link href="#pricing" className="transition-colors hover:text-white">
            Pricing
          </Link>

          <Link href="#faq" className="transition-colors hover:text-white">
            FAQ
          </Link>

          <Link href="/terms" className="transition-colors hover:text-white">
            Terms
          </Link>

          <Link href="/privacy" className="transition-colors hover:text-white">
            Privacy
          </Link>
        </nav>

        {/* Copyright */}
        <div className="text-center md:text-right">
          <p className={`${typography.caption} text-slate-500`}>
            © {new Date().getFullYear()} Rivemation.
          </p>

          <p className={`${typography.caption} mt-1 text-slate-600`}>
            All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
