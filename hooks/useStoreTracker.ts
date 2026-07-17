"use client";

import { useEffect, useRef } from "react";
import { supabase } from "../app/lib/supabase";

export function useStoreTracker(vendorId: number) {
  const hasTracked = useRef(false);

  useEffect(() => {
    if (hasTracked.current || !vendorId) return;

    hasTracked.current = true;

    async function recordTrafficLog() {
      try {
        const userAgent = navigator.userAgent.toLowerCase();

        const deviceType =
          /mobile|iphone|ipad|ipod|android|blackberry|opera mini/i.test(
            userAgent,
          )
            ? "Mobile"
            : "Desktop";

        let referrer = "Direct";

        if (document.referrer) {
          const refUrl = new URL(document.referrer);

          if (refUrl.hostname.includes("instagram"))
            referrer = "Instagram";
          else if (refUrl.hostname.includes("facebook"))
            referrer = "Facebook";
          else if (refUrl.hostname.includes("tiktok"))
            referrer = "TikTok";
          else if (refUrl.hostname.includes("google"))
            referrer = "Google";
          else
            referrer = "Other";
        }

        const storageKey = `biomarket_visit_${vendorId}`;

        const lastVisit = localStorage.getItem(storageKey);

        let isUnique = true;

        if (lastVisit) {
          const elapsed = Date.now() - Number(lastVisit);

          if (elapsed < 24 * 60 * 60 * 1000) {
            isUnique = false;
          }
        }

        localStorage.setItem(storageKey, Date.now().toString());

        await supabase.from("traffic_logs").insert({
          vendor_id: vendorId,

          event_type: "store_view",

          referrer,

          device_type: deviceType,

          is_unique: isUnique,

          page: window.location.pathname,

          viewed_at: new Date().toISOString(),
        });
      } catch (err) {
        console.error("Traffic logging failed:", err);
      }
    }

    recordTrafficLog();
  }, [vendorId]);
}