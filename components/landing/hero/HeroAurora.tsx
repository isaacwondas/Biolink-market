"use client";

import { motion } from "framer-motion";

export default function HeroAurora() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div
        animate={{
          rotate: [0, 360],
          scale: [1, 1.08, 1],
        }}
        transition={{
          rotate: {
            duration: 120,
            repeat: Infinity,
            ease: "linear",
          },
          scale: {
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          },
        }}
        className="
          absolute
          left-1/2
          top-1/2
          h-[380px]
          w-[380px]
          sm:h-[650px]
          sm:w-[650px]
          lg:h-[950px]
          lg:w-[950px]
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          bg-emerald-100
          opacity-60
          blur-[100px]
          sm:blur-[140px]
          lg:blur-[180px]
        "
      />

      {/* Secondary Glow */}
      <motion.div
        animate={{
          scale: [1.1, 0.95, 1.1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="
          absolute
          left-1/2
          top-1/2
          h-[240px]
          w-[240px]
          sm:h-[420px]
          sm:w-[420px]
          lg:h-[600px]
          lg:w-[600px]
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          bg-emerald-200/40
          blur-[80px]
          sm:blur-[120px]
          lg:blur-[160px]
        "
      />
    </div>
  );
}
