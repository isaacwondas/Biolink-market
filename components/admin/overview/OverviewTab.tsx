"use client";

import WelcomeCard from "./WelcomeCard";
import BusinessSnapshot from "./BusinessSnapshot";
import QuickActions from "./QuickActions";
import ReceiptVerificationCard from "./ReceiptVerificationCard";
import RecentActivityCard from "./RecentActivityCard";

interface OverviewTabProps {
  vendor: any;
  structuralMetrics: any;
  timelineData: any[];
  initialTransactions: any[];
  onTransactionUpdate: (
    id: string,
    updates: {
      amount_paid: number;
      payment_status: string;
    },
  ) => void;
}

export default function OverviewTab({
  vendor,
  structuralMetrics,
  timelineData,
  initialTransactions,
  onTransactionUpdate,
}: OverviewTabProps) {
  return (
    <div className="space-y-6">
      {/* Welcome */}
      <WelcomeCard vendor={vendor} />
      {/* Snapshot */}
      <BusinessSnapshot
        totalViews={structuralMetrics.totalViews}
        totalProducts={structuralMetrics.totalProducts}
        totalClicks={structuralMetrics.totalSocialClicks}
        totalShares={structuralMetrics.totalShares}
      />

      <QuickActions
        vendor={vendor}
        storefrontUrl={`${window.location.origin}/${vendor.username}`}
      />

      <ReceiptVerificationCard
        initialTransactions={initialTransactions}
        onTransactionUpdate={onTransactionUpdate}
      />

      <RecentActivityCard vendor={vendor} transactions={initialTransactions} />
    </div>
  );
}
