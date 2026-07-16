import { BarChart3, User, Building2, Package, Link2 } from "lucide-react";

export type DashboardTab =
  | "overview"
  | "profile"
  | "banks"
  | "products"
  | "social";

export const NAV = [
  {
    id: "overview",
    label: "Overview",
    icon: BarChart3,
  },
  {
    id: "profile",
    label: "Profile",
    icon: User,
  },
  {
    id: "banks",
    label: "Banks",
    icon: Building2,
  },
  {
    id: "products",
    label: "Products",
    icon: Package,
  },
  {
    id: "social",
    label: "Social",
    icon: Link2,
  },
] as const;
