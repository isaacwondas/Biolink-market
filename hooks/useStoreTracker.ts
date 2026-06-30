"use client";

import { useEffect, useRef } from "react";
import { supabase } from "../app/lib/supabase";

export function useStoreTracker(vendorId: string) {
  const hasTracked = useRef(false);

  useEffect(() => {
    if (hasTracked.current || !vendorId) return;
    hasTracked.current = true;

    const recordTrafficLog = async () => {
      try {
        const userAgent = navigator.userAgent.toLowerCase();
        const isMobile =
          /mobile|iphone|ipad|ipod|android|blackberry|opera mini/i.test(
            userAgent,
          );
        const deviceType = isMobile ? "Mobile" : "Desktop";

        // Identify incoming traffic source
        let referrer = "Direct";
        if (document.referrer) {
          const refUrl = new URL(document.referrer);
          if (refUrl.hostname.includes("instagram.com")) referrer = "Instagram";
          else if (refUrl.hostname.includes("facebook.com"))
            referrer = "Facebook";
          else if (refUrl.hostname.includes("tiktok.com")) referrer = "TikTok";
          else referrer = "Other";
        }

        // Unique visitor check (24 hour window)
        const storageKey = `biomarket_visit_${vendorId}`;
        const lastVisit = localStorage.getItem(storageKey);
        let isUnique = true;

        if (lastVisit) {
          const timePassed = Date.now() - parseInt(lastVisit, 10);
          if (timePassed < 24 * 60 * 60 * 1000) {
            isUnique = false;
          }
        }

        localStorage.setItem(storageKey, Date.now().toString());

        await supabase.from("traffic_logs").insert({
          vendor_id: vendorId,
          referrer,
          device_type: deviceType,
          is_unique: isUnique,
        });
      } catch (err) {
        console.error("Traffic logging failed silently:", err);
      }
    };

    recordTrafficLog();
  }, [vendorId]);
}
