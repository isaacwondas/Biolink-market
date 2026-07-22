"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";
import { Smartphone } from "lucide-react";
import { colors } from "@/app/lib/design-tokens";

interface PhoneFrameProps {
  children: ReactNode;
  overlay?: ReactNode;
}

export default function PhoneFrame({ children, overlay }: PhoneFrameProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 1,
        ease: "easeOut",
      }}
      className="relative mx-auto"
    >
      {/* Brand-aligned Vibrant Background Glow */}
      <div
        className="
          absolute
          left-1/2
          top-1/2
          h-[500px]
          w-[500px]
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          bg-emerald-500/20
          blur-[100px]
        "
      />

      {/* Phone Shell */}
      <div className="relative w-[330px] h-[680px] rounded-[42px] bg-zinc-950 border-[10px] border-slate-900 shadow-2xl overflow-hidden">
        {/* Dynamic Island / Camera */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-24 h-6 bg-black rounded-full z-50" />

        {/* Status Bar */}
        <div className="absolute top-0 left-0 right-0 h-12 flex items-center justify-between px-6 text-white text-xs bg-zinc-950 z-40">
          <span className="font-semibold">9:41</span>

          <div className="flex items-center gap-2">
            <Smartphone size={12} />
            <div className="w-5 h-2.5 border border-white/80 rounded-sm p-[1px]">
              <div className={`w-full h-full ${colors.brand} rounded-xs`} />
            </div>
          </div>
        </div>

        {/* Screen Container */}
        <div className="absolute inset-0 pt-12 bg-white overflow-hidden">
          {children}
        </div>

        {/* Floating Interactive Overlay */}
        {overlay && (
          <div className="absolute inset-0 pointer-events-none z-50">
            {overlay}
          </div>
        )}
      </div>
    </motion.div>
  );
}
