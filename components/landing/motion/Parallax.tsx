"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { ReactNode, useEffect } from "react";

interface Props {
  children: ReactNode;

  strength?: number;
}

export default function Parallax({
  children,

  strength = 20,
}: Props) {
  const mouseX = useMotionValue(0);

  const mouseY = useMotionValue(0);

  const x = useSpring(mouseX, {
    stiffness: 120,
    damping: 18,
  });

  const y = useSpring(mouseY, {
    stiffness: 120,
    damping: 18,
  });

  useEffect(() => {
    const move = (e: MouseEvent) => {
      const centerX = window.innerWidth / 2;

      const centerY = window.innerHeight / 2;

      mouseX.set((e.clientX - centerX) / strength);

      mouseY.set((e.clientY - centerY) / strength);
    };

    window.addEventListener("mousemove", move);

    return () => window.removeEventListener("mousemove", move);
  }, []);

  return (
    <motion.div
      style={{
        x,
        y,
      }}
    >
      {children}
    </motion.div>
  );
}
