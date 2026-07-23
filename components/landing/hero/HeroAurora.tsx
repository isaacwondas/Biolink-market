"use client";

import { motion } from "framer-motion";

export default function HeroAurora() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <motion.div
        animate={{
          rotate: [0, 360],
        }}
        transition={{
          duration: 90,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute left-1/2 top-1/2 h-[900px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[conic-gradient(at_center,#22c55e20,#0A2E1C15,#ffffff00,#22c55e20)] blur-3xl"
      />
    </div>
  );
}
