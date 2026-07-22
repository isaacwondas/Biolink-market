"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import MerchantCard from "./MerchantCard";
import { merchants } from "./merchantData";

export default function MerchantCarousel() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % merchants.length);
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative h-[420px] w-[180px]">
      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{
            opacity: 0,
            y: 40,
            scale: 0.95,
          }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
          }}
          exit={{
            opacity: 0,
            y: -30,
            scale: 0.95,
          }}
          transition={{
            duration: 0.8,
          }}
          className="absolute"
        >
          <MerchantCard {...merchants[active]} />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
