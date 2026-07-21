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

export default function TestimonialsSection() {
  return (
    <section className={`${spacing.section} ${colors.background}`}>
      <div className={spacing.container}>
        {/* Heading */}
        <div className={`${components.sectionHeading} mb-16`}>
          <div className={`${components.badge} ${colors.badge}`}>
            Trusted by Merchants
          </div>

          <h2 className={`${typography.title} ${colors.text} mt-6`}>
            Loved by Nigerian business owners
          </h2>

          <p className={`${components.sectionBody} ${typography.body}`}>
            Thousands of entrepreneurs use BioLink Market every day to showcase
            products, receive payments and grow their businesses.
          </p>
        </div>

        {/* Cards */}
        <div className="grid gap-8 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{
                ...transition.default,
                delay: index * 0.15,
              }}
              className={`${components.card} ${radius.xl} ${shadows.card} ${spacing.cardPaddingLg} flex flex-col justify-between`}
            >
              <div>
                <Quote className="mb-5 h-8 w-8 text-emerald-500 opacity-40" />

                <div className="mb-4 flex gap-1">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>

                <p className={`${typography.bodySmall} italic`}>
                  "{testimonial.comment}"
                </p>
              </div>

              <div className="mt-8 border-t border-slate-200 pt-5">
                <h3 className="font-semibold text-slate-900">
                  {testimonial.name}
                </h3>

                <p className={typography.caption}>
                  {testimonial.role} • {testimonial.location}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
