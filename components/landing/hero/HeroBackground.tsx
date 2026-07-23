"use client";

import { motion } from "framer-motion";

export default function HeroBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Glow 1 */}
      <motion.div
        animate={{
          x: [-30, 40, -30],
          y: [-20, 30, -20],
          scale: [1, 1.15, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute left-4 top-8 h-40 w-40 rounded-full bg-[#22C55E]/25 blur-2xl sm:left-12 sm:top-16 sm:h-56 sm:w-56 sm:blur-3xl lg:left-20 lg:h-72 lg:w-72"
      />

      {/* Glow 2 */}
      <motion.div
        animate={{
          x: [40, -30, 40],
          y: [20, -30, 20],
          scale: [1.1, 1, 1.1],
        }}
        transition={{
          duration: 24,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute right-4 bottom-8 h-44 w-44 rounded-full bg-[#0A2E1C]/15 blur-2xl sm:right-8 sm:bottom-16 sm:h-64 sm:w-64 sm:blur-3xl lg:right-12 lg:h-80 lg:w-80"
      />

      {/* Glow 3 */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute left-1/2 top-1/2 h-[220px] w-[220px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#22C55E]/10 blur-[60px] sm:h-[320px] sm:w-[320px] sm:blur-[90px] lg:h-[420px] lg:w-[420px] lg:blur-[120px]"
      />
    </div>
  );
}
