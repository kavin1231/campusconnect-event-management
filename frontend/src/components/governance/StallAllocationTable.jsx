import { motion } from "framer-motion";
import { RotateCcw, Store } from "lucide-react";

const badgeStyle = {
  AVAILABLE: "border-blue-500/35 bg-blue-500/12 text-blue-200",
  RESERVED: "border-red-500/35 bg-red-500/12 text-red-200",
};

const StallAllocationTable = ({ stalls, loading, onRelease }) => {
  if (loading) {
    return (
      <div
        className="rounded-3xl border p-8 text-sm"
        style={{
          borderColor: "var(--border-color)",
          backgroundColor: "var(--bg-card)",
          color: "var(--text-muted)",
        }}
      >
        Loading stalls...
      </div>
    );
  }

  if (!stalls.length) {
    return (
      <div
        className="rounded-3xl border p-10 text-center"
        style={{ borderColor: "var(--border-color)", backgroundColor: "var(--bg-card)" }}
      >
        <div
          className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl"
          style={{ backgroundColor: "rgba(255,255,255,0.04)", color: "var(--primary-accent)" }}
        >
          <Store size={24} />
        </div>
        <h3 className="text-lg font-bold" style={{ color: "var(--text-main)" }}>
          No stalls found
        </h3>
        <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>
          Select another event or adjust filters to view stall allocations.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      <div
        className="hidden overflow-hidden rounded-3xl border xl:block"
        style={{ borderColor: "var(--border-color)", backgroundColor: "var(--bg-card)" }}
      >
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse text-left text-sm">
            <thead style={{ backgroundColor: "rgba(255,255,255,0.03)", color: "var(--text-muted)" }}>
              <tr>
                <th className="px-6 py-4 font-semibold">Stall #</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Vendor</th>
                <th className="px-6 py-4 font-semibold">Service Category</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {stalls.map((stall, index) => (
                <motion.tr
                  key={stall.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.02 }}
                  className="border-t transition hover:bg-white/[0.03]"
                  style={{ borderColor: "var(--border-color)", color: "var(--text-main)" }}
                >
                  <td className="px-6 py-4 font-semibold">Stall {stall.stallNumber}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${badgeStyle[stall.status] || badgeStyle.AVAILABLE}`}>
                      {stall.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">{stall.vendor?.name || "-"}</td>
                  <td className="px-6 py-4">{stall.serviceCategory || stall.vendor?.serviceCategory || "-"}</td>
                  <td className="px-6 py-4 text-right">
                    {stall.status === "RESERVED" ? (
                      <button
                        type="button"
                        onClick={() => onRelease(stall)}
                        className="inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold text-blue-100 transition hover:bg-blue-500/10"
                        style={{ borderColor: "rgba(59,130,246,0.3)" }}
                      >
                        <RotateCcw size={14} /> Release
                      </button>
                    ) : (
                      <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                        Available
                      </span>
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid gap-4 xl:hidden">
        {stalls.map((stall, index) => (
          <motion.div
            key={stall.id}
            className="rounded-3xl border p-5"
            style={{ borderColor: "var(--border-color)", backgroundColor: "var(--bg-card)" }}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.02 }}
          >
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-lg font-bold" style={{ color: "var(--text-main)" }}>
                Stall {stall.stallNumber}
              </h3>
              <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${badgeStyle[stall.status] || badgeStyle.AVAILABLE}`}>
                {stall.status}
              </span>
            </div>
            <p className="mt-3 text-sm" style={{ color: "var(--text-main)" }}>
              Vendor: {stall.vendor?.name || "-"}
            </p>
            <p className="mt-1 text-sm" style={{ color: "var(--text-main)" }}>
              Service: {stall.serviceCategory || stall.vendor?.serviceCategory || "-"}
            </p>
            {stall.status === "RESERVED" ? (
              <button
                type="button"
                onClick={() => onRelease(stall)}
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border px-3 py-3 text-sm font-semibold text-blue-100 transition hover:bg-blue-500/10"
                style={{ borderColor: "rgba(59,130,246,0.3)" }}
              >
                <RotateCcw size={14} /> Release Stall
              </button>
            ) : null}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default StallAllocationTable;
