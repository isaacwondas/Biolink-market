"use client";

import { useStoreTracker } from "../hooks/useStoreTracker";

interface TrackerProps {
  vendorId: string;
}

export default function StoreTrackerTrigger({ vendorId }: TrackerProps) {
  useStoreTracker(vendorId);
  return null;
}
