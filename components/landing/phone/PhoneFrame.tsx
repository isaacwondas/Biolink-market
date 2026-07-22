"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";
import { Smartphone } from "lucide-react";

interface PhoneFrameProps {
  children: React.ReactNode;
  overlay?: React.ReactNode;
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
      {/* Glow */}
      {/*<div className="absolute inset-0 rounded-[48px] bg-emerald-400/20 blur-3xl" />*/}
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
        bg-emerald-200/40
        blur-[120px]
    "
      />

      {/* Phone */}
      <div className="relative w-[330px] h-[680px] rounded-[42px] bg-zinc-950 border-[10px] border-black shadow-2xl overflow-hidden">
        {/* Camera */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-24 h-6 bg-black rounded-full z-50" />

        {/* Status Bar */}
        <div className="absolute top-0 left-0 right-0 h-12 flex items-center justify-between px-6 text-white text-xs bg-zinc-950 z-40">
          <span>9:41</span>

          <div className="flex items-center gap-2">
            <Smartphone size={12} />

            <div className="w-5 h-2 border rounded-sm border-white">
              <div className="w-4 h-full rounded-sm bg-green-400" />
            </div>
          </div>
        </div>

        {/* Screen */}

        <div className="absolute inset-0 pt-12 bg-white overflow-hidden">
          {children}
        </div>
        {overlay && (
          <div className="absolute inset-0 pointer-events-none z-50">
            {overlay}
          </div>
        )}
      </div>
    </motion.div>
  );
}
