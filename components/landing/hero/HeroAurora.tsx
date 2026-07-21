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
          duration: 80,

          repeat: Infinity,

          ease: "linear",
        }}
        className="absolute

left-1/2

top-1/2

h-[900px]

w-[900px]

-rounded-full

bg-[conic-gradient(at_center,#22c55e20,#06b6d420,#ffffff00,#22c55e20)]

-translate-x-1/2

-translate-y-1/2

blur-3xl"
      />
    </div>
  );
}
