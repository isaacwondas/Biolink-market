"use client";

import Image from "next/image";
import { motion } from "framer-motion";

interface MerchantCardProps {
  image: string;
  name: string;
  category: string;
}

export default function MerchantCard({
  image,
  name,
  category,
}: MerchantCardProps) {
  return (
    <motion.div
      whileHover={{
        scale: 1.04,
        y: -4,
      }}
      className="w-36 rounded-3xl backdrop-blur-xl

bg-white/70

border-white/40

shadow-[0_15px_45px_rgba(0,0,0,.12)] shadow-xl overflow-hidden border"
    >
      <div className="relative h-40">
        <Image src={image} alt={name} fill className="object-cover" />
      </div>

      <div className="p-3">
        <h4 className="font-semibold text-sm">{name}</h4>

        <p className="text-xs text-gray-500">{category}</p>
      </div>
    </motion.div>
  );
}
