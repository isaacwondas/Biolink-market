import { Package } from "lucide-react";
import { AnalyticsMetrics } from "./types";

interface Props {
  metrics: AnalyticsMetrics;
  businessName: string;
}

export default function TopProductsCard({ metrics, businessName }: Props) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-5">
        <h3 className="text-lg font-bold text-gray-900">Top Products</h3>

        <p className="text-sm text-gray-500">
          Most viewed products from {businessName}.
        </p>
      </div>

      {metrics.topProducts.length === 0 ? (
        <div className="flex h-48 items-center justify-center rounded-xl border border-dashed border-gray-200 bg-gray-50">
          <div className="text-center">
            <Package className="mx-auto mb-3 h-10 w-10 text-gray-300" />

            <p className="font-medium text-gray-500">
              No product analytics yet
            </p>

            <p className="mt-1 text-sm text-gray-400">
              Product views will appear here.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {metrics.topProducts.map((product) => (
            <div
              key={product.id}
              className="flex items-center justify-between rounded-xl border border-gray-100 p-4"
            >
              <div>
                <p className="font-semibold text-gray-900">{product.name}</p>

                <p className="text-sm text-gray-500">{product.views} views</p>
              </div>

              <Package className="h-5 w-5 text-orange-500" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
