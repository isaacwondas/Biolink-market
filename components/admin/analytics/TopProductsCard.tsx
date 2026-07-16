import AnalyticsHeader from "./AnalyticsHeader";
import SummaryCards from "./SummaryCards";
import TopLinksCard from "./TopLinksCard";
import TopProductsCard from "./TopProductsCard";

import { AnalyticsMetrics } from "./types";

interface Props {
  metrics: AnalyticsMetrics;
  businessName: string;
}

export default function AnalyticsGrid({ metrics, businessName }: Props) {
  return (
    <div className="space-y-8">
      <AnalyticsHeader businessName={businessName} />

      <SummaryCards metrics={metrics} />

      <div className="grid lg:grid-cols-2 gap-6">
        <TopLinksCard metrics={metrics} />

        <TopProductsCard metrics={metrics} businessName={businessName} />
      </div>
    </div>
  );
}
