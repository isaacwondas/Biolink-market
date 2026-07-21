"use client";

import { motion } from "framer-motion";

const steps = ["Store", "WhatsApp", "Payment", "Done"];

export default function ProgressBar({ active }: { active: number }) {
  return (
    <div className="flex justify-center gap-3 py-4">
      {steps.map((_, index) => (
        <motion.div
          key={index}
          animate={{
            width: active === index ? 36 : 10,
            backgroundColor: active >= index ? "#10b981" : "#d4d4d8",
          }}
          transition={{
            duration: 0.35,
          }}
          className="h-2 rounded-full"
        />
      ))}
    </div>
  );
}
