import { useEffect, useState } from "react";
import { getDashboardData } from "../services/dashboard.service";
import { buildDashboardMetrics } from "../services/dashboard.mapper";

export function useDashboard(vendorId: number) {
  const [loading, setLoading] = useState(true);

  const [dashboard, setDashboard] = useState<any>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);

      const raw = await getDashboardData(vendorId);

      const mapped = buildDashboardMetrics(raw);

      setDashboard(mapped);

      setLoading(false);
    }

    load();
  }, [vendorId]);

  return {
    loading,
    dashboard,
  };
}
