import { useEffect, useState } from "react";
import Sidebar from "../common/Sidebar";
import { logisticsAPI } from "../../services/api";

const AnalyticsReports = () => {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await logisticsAPI.listRequests();
        const requests = response?.requests || [];
        setRows(requests.slice(0, 20));
      } catch (error) {
        console.error("Failed to load analytics reports:", error);
      }
    };

    load();
  }, []);

  return (
    <div className="flex min-h-screen bg-[#0B0F19] text-[#E5E7EB]">
      <Sidebar isAdmin={true} />
      <div className="flex-1 p-5 md:p-8">
        <div className="rounded-2xl border border-slate-700/70 bg-[#111827] p-6 mb-6">
          <h1 className="text-3xl font-black text-white">Usage Reports</h1>
          <p className="text-slate-300 mt-2">
            Recent request transactions for operational review.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-700/70 bg-[#111827] overflow-x-auto">
          <table className="w-full min-w-[760px] text-left">
            <thead className="bg-slate-900/70 text-slate-400 uppercase text-xs tracking-wider">
              <tr>
                <th className="px-5 py-3">Asset</th>
                <th className="px-5 py-3">Requester</th>
                <th className="px-5 py-3">Owner</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Due Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/70">
              {rows.length === 0 ? (
                <tr>
                  <td className="px-5 py-6 text-slate-400" colSpan={5}>
                    No report rows available.
                  </td>
                </tr>
              ) : (
                rows.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-800/40 transition">
                    <td className="px-5 py-4 text-slate-100">
                      {row.asset || "-"}
                    </td>
                    <td className="px-5 py-4 text-slate-300">
                      {row.club || "-"}
                    </td>
                    <td className="px-5 py-4 text-slate-300">
                      {row.owner || "-"}
                    </td>
                    <td className="px-5 py-4 text-slate-300 uppercase">
                      {(row.status || "-").replaceAll("_", " ")}
                    </td>
                    <td className="px-5 py-4 text-slate-300">
                      {row.dueDate || "-"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsReports;
