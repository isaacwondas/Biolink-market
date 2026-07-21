"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <span className="text-lg font-black text-white tracking-tight">
            BioLink<span className="text-emerald-500">.Market</span>
          </span>
          <p className="text-xs text-slate-500 mt-1">
            Simple payment link storefronts for social commerce.
          </p>
        </div>

        <div className="flex items-center gap-6 text-xs font-semibold">
          <Link href="#features" className="hover:text-white transition">
            Features
          </Link>
          <Link href="#pricing" className="hover:text-white transition">
            Pricing
          </Link>
          <Link href="/terms" className="hover:text-white transition">
            Terms
          </Link>
          <Link href="/privacy" className="hover:text-white transition">
            Privacy
          </Link>
        </div>

        <p className="text-xs text-slate-600">
          © {new Date().getFullYear()} Rivemation. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
