import { useEffect, useState } from "react";
import Sidebar from "../common/Sidebar";
import { logisticsAPI } from "../../services/api";

const StatTile = ({ label, value, tone }) => {
  const toneClass =
    tone === "blue"
      ? "border-blue-500/30 bg-blue-500/10 text-blue-200"
      : tone === "emerald"
        ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-200"
        : tone === "amber"
          ? "border-amber-500/30 bg-amber-500/10 text-amber-200"
          : "border-indigo-500/30 bg-indigo-500/10 text-indigo-200";

  return (
    <div className={`rounded-xl border p-4 ${toneClass}`}>
      <p className="text-xs uppercase tracking-wider opacity-80">{label}</p>
      <p className="text-2xl font-black mt-2">{value}</p>
    </div>
  );
};

const AnalyticsOverview = () => {
  const [stats, setStats] = useState({
    totalAssets: 0,
    activeRequests: 0,
    overdue: 0,
    returned: 0,
  });

  useEffect(() => {
    const load = async () => {
      try {
        const [assetsRes, requestsRes] = await Promise.all([
          logisticsAPI.listAssets(),
          logisticsAPI.listRequests(),
        ]);

        const assets = assetsRes?.assets || [];
        const requests = requestsRes?.requests || [];

        setStats({
          totalAssets: assets.length,
          activeRequests: requests.filter((r) => r.status === "checked_out")
            .length,
          overdue: requests.filter((r) => r.status === "overdue").length,
          returned: requests.filter((r) => r.status === "returned").length,
        });
      } catch (error) {
        console.error("Failed to load analytics overview:", error);
      }
    };

    load();
  }, []);

  return (
    <div className="flex min-h-screen bg-[#0B0F19] text-[#E5E7EB]">
      <Sidebar isAdmin={true} />
      <div className="flex-1 p-5 md:p-8">
        <div className="rounded-2xl border border-slate-700/70 bg-[#111827] p-6 mb-6">
          <h1 className="text-3xl font-black text-white">Analytics Overview</h1>
          <p className="text-slate-300 mt-2">
            High-level operational metrics for logistics activity.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <StatTile
            label="Total Assets"
            value={stats.totalAssets}
            tone="indigo"
          />
          <StatTile
            label="Active Requests"
            value={stats.activeRequests}
            tone="blue"
          />
          <StatTile
            label="Overdue Returns"
            value={stats.overdue}
            tone="amber"
          />
          <StatTile label="Returned" value={stats.returned} tone="emerald" />
        </div>
      </div>
    </div>
  );
};

export default AnalyticsOverview;
