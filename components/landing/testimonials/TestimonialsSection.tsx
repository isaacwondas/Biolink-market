"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import {
  colors,
  components,
  fadeUp,
  radius,
  shadows,
  spacing,
  transition,
  typography,
} from "@/app/lib/design-tokens";

const testimonials = [
  {
    name: "Adaora Nwosu",
    role: "Founder, Ada Fashion Hub",
    location: "Lagos",
    comment:
      "BioLink Market changed my Instagram shop! Customers no longer ask 'How much?'—they simply open my storefront, browse products and pay instantly.",
    rating: 5,
  },
  {
    name: "Emeka Okafor",
    role: "Boutique Tailor",
    location: "Abuja",
    comment:
      "The WhatsApp checkout saves me hours every week. Customers already know what they want before they message me.",
    rating: 5,
  },
  {
    name: "Aisha Bello",
    role: "Beauty & Studio Artist",
    location: "Kano",
    comment:
      "Having my OPay account and QR code in one place made selling at events so much easier. Payments are instant.",
    rating: 5,
  },
];

const avatarPalette = [
  { bg: "bg-[#22C55E]/10", text: "text-[#1A9F49]" },
  { bg: "bg-[#0A2E1C]/10", text: "text-[#0A2E1C]" },
  { bg: "bg-[#22C55E]/15", text: "text-[#22C55E]" },
];

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function TestimonialsSection() {
  return (
    <section className={`${spacing.section} ${colors.background}`}>
      <div className={spacing.container}>
        {/* Heading */}
        <div className={`${components.sectionHeading} mb-10`}>
          <div className={`${components.badge} bg-[#22C55E]/10 text-[#1A9F49]`}>
            Trusted by Merchants
          </div>

          <h2 className={`${typography.title} text-[#0A2E1C] mt-6`}>
            Loved by Nigerian business owners
          </h2>

          <p className={`${components.sectionBody} ${typography.body}`}>
            Thousands of entrepreneurs use BioLink Market every day to showcase
            products, receive payments and grow their businesses.
          </p>
        </div>

        {/* Aggregate trust bar */}
        <div className="mb-16 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
          <div className="flex items-center gap-2">
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className="h-4 w-4 fill-amber-400 text-amber-400"
                />
              ))}
            </div>
            <span className="text-sm font-bold text-[#0A2E1C]">4.9/5</span>
            <span className="text-sm text-slate-500">average rating</span>
          </div>

          <div className="hidden h-4 w-px bg-slate-200 sm:block" />

          <div className="text-sm text-slate-500">
            <span className="font-bold text-[#0A2E1C]">3,200+</span> active
            storefronts
          </div>

          <div className="hidden h-4 w-px bg-slate-200 sm:block" />

          <div className="text-sm text-slate-500">
            <span className="font-bold text-[#0A2E1C]">₦2.1B+</span> processed
            in payments
          </div>
        </div>

        {/* Cards */}
        <div className="grid gap-8 md:grid-cols-3">
          {testimonials.map((testimonial, index) => {
            const palette = avatarPalette[index % avatarPalette.length];

            return (
              <motion.div
                key={testimonial.name}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{
                  ...transition.default,
                  delay: index * 0.12,
                }}
                className={`${components.card} ${radius.xl} ${shadows.card} ${spacing.cardPaddingLg} relative flex flex-col justify-between overflow-hidden border border-gray-100 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:border-[#22C55E]/30`}
              >
                <Quote
                  className="absolute -right-2 -top-2 h-20 w-20 text-[#22C55E]/[0.06]"
                  strokeWidth={1}
                  fill="currentColor"
                />

                <div className="relative">
                  <div className="mb-4 flex gap-1">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-amber-400 text-amber-400"
                      />
                    ))}
                  </div>

                  <p
                    className={`${typography.bodySmall} text-slate-600 leading-relaxed`}
                  >
                    {testimonial.comment}
                  </p>
                </div>

                <div className="relative mt-8 flex items-center gap-3 border-t border-gray-100 pt-5">
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${palette.bg} ${palette.text} text-sm font-bold`}
                  >
                    {getInitials(testimonial.name)}
                  </div>

                  <div>
                    <h3 className="font-semibold text-[#0A2E1C]">
                      {testimonial.name}
                    </h3>

                    <p className={`${typography.caption} text-slate-500`}>
                      {testimonial.role} • {testimonial.location}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
