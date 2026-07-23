"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  ExternalLink,
  Heart,
  MessageCircle,
  ShoppingBag,
  Star,
} from "lucide-react";

const products = [
  {
    name: "Luxury Ankara Gown",
    price: "₦18,500",
    image:
      "https://images.unsplash.com/photo-1595777712802-52d44cebc6ff?w=200&q=80",
  },
  {
    name: "Premium Leather Bag",
    price: "₦27,000",
    image:
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=200&q=80",
  },
  {
    name: "Classic Heels",
    price: "₦15,000",
    image:
      "https://images.unsplash.com/photo-1543163521-9a539c45dd15?w=200&q=80",
  },
];

export default function StorefrontSection() {
  return (
    <section className="relative overflow-hidden bg-white py-24 px-4 sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-gradient-to-br from-[#22C55E]/5 via-transparent to-[#0A2E1C]/3" />

      <div className="relative max-w-7xl mx-auto">
        <div className="grid items-center gap-20 lg:grid-cols-2">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wider bg-[#22C55E]/10 text-[#15803D]">
              Your Digital Store
            </div>

            <h2 className="mt-6 text-4xl md:text-5xl font-black tracking-tight text-[#111827]">
              A beautiful storefront your customers will love.
            </h2>

            <p className="mt-5 text-lg text-[#6B7280] leading-relaxed">
              Every merchant gets a fast, mobile-first storefront with product
              listings, WhatsApp checkout, payment verification and a shareable
              bio link that works everywhere.
            </p>

            <div className="mt-10 space-y-4">
              {[
                "Unlimited product listings",
                "Optimized for Instagram & TikTok traffic",
                "Share one link everywhere",
                "Lightning-fast mobile experience",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-4 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] p-4 hover:border-[#22C55E]/30 transition-colors"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#22C55E]/10 text-[#22C55E] font-bold flex-shrink-0">
                    ✓
                  </div>

                  <span className="font-medium text-[#374151]">{item}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            {/* Floating Notification */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{
                repeat: Infinity,
                duration: 3,
              }}
              className="absolute -left-8 -top-6 z-20 rounded-2xl border border-[#E5E7EB] bg-white px-5 py-4 shadow-xl"
            >
              <div className="text-sm font-bold text-[#111827]">
                🎉 New Order
              </div>
              <div className="text-xs text-[#6B7280]">₦18,500 received</div>
            </motion.div>

            {/* Store Card */}
            <div className="overflow-hidden rounded-3xl border border-[#E5E7EB] bg-white shadow-2xl">
              {/* Cover */}
              <div className="relative h-48 bg-gradient-to-tr from-[#15803D] to-[#22C55E] px-8 pt-6">
                <span className="text-sm font-black tracking-tight text-white">
                  BioLink<span className="text-white/70">.Market</span>
                </span>

                {/* Avatar + Name, anchored to the bottom of the cover */}
                <div className="absolute bottom-0 left-8 flex translate-y-1/2 items-end gap-4">
                  <div className="flex h-24 w-24 flex-shrink-0 items-center justify-center rounded-full border-4 border-white bg-[#0A2E1C] text-2xl font-black text-white shadow-md">
                    ZD
                  </div>

                  <div className="pb-3">
                    <h3 className="text-xl font-black text-white drop-shadow-sm">
                      Zainab's Designs
                    </h3>

                    <div className="mt-1 flex items-center gap-2 text-sm text-white/90">
                      <Star className="h-4 w-4 fill-white text-white" />
                      4.9 Rating
                    </div>
                  </div>
                </div>
              </div>

              {/* Profile */}
              <div className="px-8 pb-8 pt-14">
                {/* Products */}
                <div className="grid gap-4">
                  {products.map((product) => (
                    <motion.div
                      key={product.name}
                      whileHover={{ scale: 1.02 }}
                      className="flex items-center gap-4 rounded-xl border border-[#E5E7EB] p-3 hover:border-[#22C55E]/50 transition-all"
                    >
                      <div className="h-16 w-16 overflow-hidden rounded-lg bg-[#F9FAFB] flex-shrink-0">
                        <Image
                          src={product.image}
                          alt={product.name}
                          width={64}
                          height={64}
                          className="h-full w-full object-cover"
                          unoptimized
                        />
                      </div>

                      <div className="flex-1">
                        <div className="font-semibold text-[#111827]">
                          {product.name}
                        </div>

                        <div className="text-sm text-[#22C55E] font-bold">
                          {product.price}
                        </div>
                      </div>

                      <ShoppingBag className="h-5 w-5 text-[#9CA3AF]" />
                    </motion.div>
                  ))}
                </div>

                {/* Actions */}
                <div className="mt-8 flex gap-3">
                  <button className="flex-1 rounded-xl bg-[#22C55E] hover:bg-[#15803D] py-3 text-sm font-bold text-white transition-colors">
                    Shop Now
                  </button>

                  <button className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#E5E7EB] text-[#6B7280] hover:text-[#111827] hover:border-[#22C55E] transition-colors">
                    <MessageCircle className="h-5 w-5" />
                  </button>

                  <button className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#E5E7EB] text-[#6B7280] hover:text-[#111827] hover:border-[#22C55E] transition-colors">
                    <Heart className="h-5 w-5" />
                  </button>

                  <button className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#E5E7EB] text-[#6B7280] hover:text-[#111827] hover:border-[#22C55E] transition-colors">
                    <ExternalLink className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Floating Badge */}
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{
                repeat: Infinity,
                duration: 4,
              }}
              className="absolute -right-8 bottom-10 rounded-2xl bg-[#111827] px-5 py-4 text-white shadow-xl"
            >
              <div className="text-lg font-bold">328</div>
              <div className="text-xs opacity-90">Visitors Today</div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
