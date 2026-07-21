"use client";

import { motion } from "framer-motion";

interface DemoCursorProps {
  x: number;
  y: number;
  clicking?: boolean;
}

export default function DemoCursor({
  x,
  y,
  clicking = false,
}: DemoCursorProps) {
  return (
    <motion.div
      animate={{
        x,
        y,
        scale: clicking ? 0.85 : 1,
      }}
      transition={{
        type: "spring",
        stiffness: 250,
        damping: 20,
      }}
      className="absolute z-50 pointer-events-none"
    >
      <svg width="26" height="34" viewBox="0 0 26 34" fill="none">
        <path
          d="M2 2L21 19L13 20L17 31L13 32L9 21L2 28V2Z"
          fill="white"
          stroke="#111"
          strokeWidth="2"
        />
      </svg>

      {clicking && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: [0, 1.4, 0] }}
          transition={{ duration: 0.45 }}
          className="absolute left-2 top-2 h-5 w-5 rounded-full border-2 border-emerald-500"
        />
      )}
    </motion.div>
  );
}
