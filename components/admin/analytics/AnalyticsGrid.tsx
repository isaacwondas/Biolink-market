import AnalyticsHeader from "./AnalyticsHeader";
import SummaryCards from "./SummaryCards";
import RecentActivityCard from "./RecentActivityCard";
import { AnalyticsMetrics } from "./types";
import type { Activity } from "./RecentActivityCard";

interface Props {
  metrics: AnalyticsMetrics;
  businessName: string;
  recentActivity: Activity[];
}

export default function AnalyticsGrid({
  metrics,
  businessName,
  recentActivity,
}: Props) {
  return (
    <div className="space-y-8">
      <AnalyticsHeader businessName={businessName} />

      <SummaryCards metrics={metrics} />
      <RecentActivityCard activities={recentActivity} />

      {/* TopLinksCard */}

      {/* TopProductsCard */}

      {/* TrafficFunnel */}

      {/* StorePerformance */}
    </div>
  );
}
