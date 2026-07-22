"use client";

import { motion } from "framer-motion";

interface LiveActivityProps {
  icon: string;
  title: string;
  subtitle: string;
  className?: string;
}

export default function LiveActivity({
  icon,
  title,
  subtitle,
  className = "",
}: LiveActivityProps) {
  return (
    <motion.div
      animate={{
        y: [0, -10, 0],
      }}
      transition={{
        duration: 6,
        repeat: Infinity,
      }}
      className={`absolute rounded-2xl backdrop-blur-xl

bg-white/70

border-white/40

shadow-[0_15px_45px_rgba(0,0,0,.12)] shadow-xl border px-4 py-3 ${className}`}
    >
      <div className="flex items-center gap-3">
        <div className="text-xl">{icon}</div>

        <div>
          <p className="font-semibold text-sm">{title}</p>

          <p className="text-xs text-gray-500">{subtitle}</p>
        </div>
      </div>
    </motion.div>
  );
}
