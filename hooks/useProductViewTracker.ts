"use client";

import { useEffect, useRef } from "react";
import { trackProductView } from "@/app/lib/trackClick";

export function useProductViewTracker(vendorId: number, productId: number) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const storageKey = `product-view-${vendorId}-${productId}`;

    // Prevent duplicate tracking in the same browser session
    if (sessionStorage.getItem(storageKey)) {
      return;
    }

    const observer = new IntersectionObserver(
      async ([entry]) => {
        if (!entry.isIntersecting) return;

        sessionStorage.setItem(storageKey, "1");

        await trackProductView(vendorId, productId);

        observer.disconnect();
      },
      {
        threshold: 0.5, // Track when at least 50% is visible
      },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [vendorId, productId]);

  return ref;
}
