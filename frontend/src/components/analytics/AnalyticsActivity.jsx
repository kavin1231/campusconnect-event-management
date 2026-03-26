import { useEffect, useState } from "react";
import Sidebar from "../common/Sidebar";
import { logisticsAPI } from "../../services/api";

const ActivityCard = ({ title, value, subtitle }) => (
  <div className="rounded-xl border border-slate-700/70 bg-[#111827] p-5">
    <p className="text-slate-400 text-xs uppercase tracking-wider">{title}</p>
    <p className="text-white text-2xl font-black mt-1">{value}</p>
    <p className="text-slate-500 text-sm mt-1">{subtitle}</p>
  </div>
);

const AnalyticsActivity = () => {
  const [activity, setActivity] = useState({
    pending: 0,
    checkedOut: 0,
    overdue: 0,
    returned: 0,
  });

  useEffect(() => {
    const load = async () => {
      try {
        const response = await logisticsAPI.listRequests();
        const requests = response?.requests || [];

        setActivity({
          pending: requests.filter((r) => r.status === "pending").length,
          checkedOut: requests.filter((r) => r.status === "checked_out").length,
          overdue: requests.filter((r) => r.status === "overdue").length,
          returned: requests.filter((r) => r.status === "returned").length,
        });
      } catch (error) {
        console.error("Failed to load analytics activity:", error);
      }
    };

    load();
  }, []);

  return (
    <div className="flex min-h-screen bg-[#0B0F19] text-[#E5E7EB]">
      <Sidebar isAdmin={true} />
      <div className="flex-1 p-5 md:p-8">
        <div className="rounded-2xl border border-slate-700/70 bg-[#111827] p-6 mb-6">
          <h1 className="text-3xl font-black text-white">User Activity</h1>
          <p className="text-slate-300 mt-2">
            Live activity split by request lifecycle status.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          <ActivityCard
            title="Pending"
            value={activity.pending}
            subtitle="Awaiting decision"
          />
          <ActivityCard
            title="Checked Out"
            value={activity.checkedOut}
            subtitle="Currently in transit"
          />
          <ActivityCard
            title="Overdue"
            value={activity.overdue}
            subtitle="Needs immediate follow-up"
          />
          <ActivityCard
            title="Returned"
            value={activity.returned}
            subtitle="Completed lifecycle"
          />
        </div>
      </div>
    </div>
  );
};

export default AnalyticsActivity;
