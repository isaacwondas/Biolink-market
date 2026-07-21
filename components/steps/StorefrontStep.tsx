"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function StorefrontStep() {
  return (
    <div className="bg-zinc-50 h-full">
      {/* Cover */}

      <div className="relative h-32">
        <Image
          src="/landing/store/banner.jpg"
          alt=""
          fill
          className="object-cover"
        />
      </div>

      {/* Profile */}

      <div className="px-5 -mt-10">
        <div className="relative w-20 h-20 rounded-full overflow-hidden border-4 border-white">
          <Image
            src="/landing/store/avatar.jpg"
            alt=""
            fill
            className="object-cover"
          />
        </div>

        <h2 className="mt-4 text-xl font-bold">Ada Fashion Hub</h2>

        <p className="text-gray-500">Custom dresses • Ready-to-wear</p>
      </div>

      {/* Product */}

      <motion.div
        whileHover={{
          y: -4,
        }}
        className="m-5 rounded-2xl bg-white p-4 shadow"
      >
        <div className="relative h-44 rounded-xl overflow-hidden">
          <Image
            src="/landing/store/product.jpg"
            alt=""
            fill
            className="object-cover"
          />
        </div>

        <h3 className="mt-3 font-semibold">Luxury Ankara Dress</h3>

        <div className="text-emerald-600 font-bold">₦35,000</div>
      </motion.div>
    </div>
  );
}
