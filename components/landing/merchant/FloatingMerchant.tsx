"use client";

import Image from "next/image";
import { motion } from "framer-motion";

interface FloatingMerchantProps {
  image: string;
  name: string;
  category: string;
  className?: string;
  delay?: number;
}

export default function FloatingMerchant({
  image,
  name,
  category,
  className = "",
  delay = 0,
}: FloatingMerchantProps) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 20,
      }}
      animate={{
        opacity: 1,
        y: [0, -12, 0],
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        delay,
        ease: "easeInOut",
      }}
      className={`absolute ${className}`}
    >
      <div className="w-36 rounded-3xl overflow-hidden bg-white shadow-2xl border border-zinc-200">
        <div className="relative h-36">
          <Image src={image} alt={name} fill className="object-cover" />
        </div>

        <div className="p-3">
          <h4 className="font-semibold text-sm">{name}</h4>

          <p className="text-xs text-gray-500">{category}</p>
        </div>
      </div>
    </motion.div>
  );
}
