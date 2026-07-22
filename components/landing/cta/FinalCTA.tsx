"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import {
  colors,
  radius,
  shadows,
  spacing,
  typography,
} from "@/app/lib/design-tokens";

export default function FinalCTA() {
  return (
    <section
      className={`${spacing.section} bg-gradient-to-b from-white via-slate-50 to-white`}
    >
      <div className={spacing.container}>
        <div
          className={`mx-auto max-w-5xl ${radius.xl} ${shadows.floating} bg-gradient-to-tr from-[#1A9F49] to-[#22C55E] px-8 py-16 text-center lg:px-16`}
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-xs font-semibold text-white">
            <Sparkles className="h-4 w-4" />
            Get Started Today
          </div>

          <h2
            className={`${typography.title} mx-auto mt-6 max-w-3xl text-white`}
          >
            Ready to turn your followers into paying customers?
          </h2>

          <p
            className={`${typography.body} mx-auto mt-5 max-w-2xl text-white/90`}
          >
            Join thousands of merchants using BioLink Market to receive direct
            payments, showcase products, and grow their business—all from one
            simple storefront.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/signup"
              className={`inline-flex items-center justify-center gap-2 ${radius.lg} bg-white px-8 py-4 text-sm font-bold text-[#1A9F49] transition-transform duration-200 hover:-translate-y-0.5`}
            >
              Create Storefront Free
              <ArrowRight className="h-4 w-4" />
            </Link>

            <p className="text-sm text-white/80">
              No credit card • Setup in under 2 minutes
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
