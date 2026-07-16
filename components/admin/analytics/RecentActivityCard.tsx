import {
  Eye,
  ShoppingCart,
  Receipt,
  Package,
  MessageCircle,
  MousePointerClick,
} from "lucide-react";

export interface Activity {
  id: string | number;
  event: string;
  product?: string;
  platform?: string;
  created_at: string;
}

interface Props {
  activities: Activity[];
}

function getIcon(event: string) {
  switch (event) {
    case "store_view":
      return Eye;

    case "product_view":
      return Package;

    case "add_to_cart":
      return ShoppingCart;

    case "checkout_started":
      return ShoppingCart;

    case "receipt_uploaded":
      return Receipt;

    case "social_click":
      return MessageCircle;

    default:
      return MousePointerClick;
  }
}

function getMessage(activity: Activity) {
  switch (activity.event) {
    case "store_view":
      return "Someone viewed your storefront";

    case "product_view":
      return `Someone viewed ${activity.product ?? "a product"}`;

    case "add_to_cart":
      return `Someone added ${activity.product ?? "a product"} to cart`;

    case "checkout_started":
      return "Someone started checkout";

    case "receipt_uploaded":
      return "A customer uploaded a payment receipt";

    case "social_click":
      return `Someone clicked your ${activity.platform} link`;

    default:
      return "New activity";
  }
}

function timeAgo(date: string) {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);

  if (seconds < 60) return "Just now";

  const minutes = Math.floor(seconds / 60);

  if (minutes < 60) return `${minutes} min${minutes > 1 ? "s" : ""} ago`;

  const hours = Math.floor(minutes / 60);

  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;

  const days = Math.floor(hours / 24);

  return `${days} day${days > 1 ? "s" : ""} ago`;
}

export default function RecentActivityCard({ activities }: Props) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold">Recent Activity</h3>

        <span className="text-xs text-gray-500">Live</span>
      </div>

      <div className="mt-6 space-y-4">
        {activities.length === 0 && (
          <div className="text-center py-10 text-sm text-gray-500">
            No activity yet.
          </div>
        )}

        {activities.map((activity) => {
          const Icon = getIcon(activity.event);

          return (
            <div
              key={activity.id}
              className="flex gap-4 items-start pb-4 border-b last:border-none"
            >
              <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center">
                <Icon className="w-5 h-5 text-[#22C55E]" />
              </div>

              <div className="flex-1">
                <p className="font-medium text-sm">{getMessage(activity)}</p>

                <p className="text-xs text-gray-500 mt-1">
                  {timeAgo(activity.created_at)}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
