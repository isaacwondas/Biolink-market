"use client";

import { motion } from "framer-motion";

export default function FloatingToast({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 30,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      exit={{
        opacity: 0,
        y: 20,
      }}
      className="absolute bottom-5 left-1/2 -translate-x-1/2 rounded-2xl bg-white shadow-xl px-5 py-4 border"
    >
      <div className="font-semibold">{title}</div>

      <div className="text-sm text-gray-500">{subtitle}</div>
    </motion.div>
  );
}
