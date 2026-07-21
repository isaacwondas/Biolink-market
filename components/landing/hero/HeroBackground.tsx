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
          duration: 16,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute left-20 top-16 h-72 w-72 rounded-full bg-emerald-300/25 blur-3xl"
      />

      {/* Glow 2 */}

      <motion.div
        animate={{
          x: [40, -30, 40],
          y: [20, -30, 20],
          scale: [1.1, 1, 1.1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute right-12 bottom-16 h-80 w-80 rounded-full bg-cyan-300/20 blur-3xl"
      />

      {/* Glow 3 */}

      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 28,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-100/20 blur-[120px]"
      />
    </div>
  );
}
