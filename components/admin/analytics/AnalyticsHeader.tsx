import { Activity } from "lucide-react";

interface Props {
  businessName: string;
}

export default function AnalyticsHeader({ businessName }: Props) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h2 className="text-3xl font-black text-[#111827]">
          {businessName} Analytics
        </h2>

        <p className="text-sm text-[#6B7280] mt-1">
          Real-time performance overview for your storefront.
        </p>
      </div>

      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-50 border border-green-200 text-[#15803D] text-sm font-semibold">
        <Activity className="w-4 h-4" />
        Live Analytics
      </div>
    </div>
  );
}
