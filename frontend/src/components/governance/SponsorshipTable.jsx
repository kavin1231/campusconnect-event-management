import { motion } from "framer-motion";
import { Edit2, Trash2 } from "lucide-react";

const tierStyle = {
  BRONZE: "border-amber-700/40 bg-amber-700/15 text-amber-200",
  SILVER: "border-slate-400/40 bg-slate-400/15 text-slate-100",
  GOLD: "border-yellow-500/40 bg-yellow-500/15 text-yellow-100",
  PLATINUM: "border-cyan-400/40 bg-cyan-400/15 text-cyan-100",
};

const statusStyle = {
  ACTIVE: "border-emerald-500/35 bg-emerald-500/12 text-emerald-200",
  INACTIVE: "border-slate-500/35 bg-slate-500/12 text-slate-300",
};

const paymentStyle = {
  PAID: "text-emerald-300",
  PARTIAL: "text-amber-200",
  PENDING: "text-slate-300",
};

const formatCurrency = (value) => {
  return new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
};

const SponsorshipTable = ({ items, loading, onEdit, onDelete }) => {
  if (loading) {
    return (
      <div className="rounded-3xl border p-8 text-sm" style={{ borderColor: "var(--border-color)", backgroundColor: "var(--bg-card)", color: "var(--text-muted)" }}>
        Loading sponsorships...
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="rounded-3xl border p-10 text-center" style={{ borderColor: "var(--border-color)", backgroundColor: "var(--bg-card)" }}>
        <h3 className="text-lg font-bold" style={{ color: "var(--text-main)" }}>No sponsorships found</h3>
        <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>
          Add sponsorship records to track partner commitments.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="hidden overflow-hidden rounded-3xl border xl:block" style={{ borderColor: "var(--border-color)", backgroundColor: "var(--bg-card)" }}>
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse text-left text-sm">
            <thead style={{ backgroundColor: "rgba(255,255,255,0.03)", color: "var(--text-muted)" }}>
              <tr>
                <th className="px-6 py-4 font-semibold">Sponsor</th>
                <th className="px-6 py-4 font-semibold">Event</th>
                <th className="px-6 py-4 font-semibold">Amount</th>
                <th className="px-6 py-4 font-semibold">Tier</th>
                <th className="px-6 py-4 font-semibold">Payment</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <motion.tr
                  key={item.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.02 }}
                  className="border-t transition hover:bg-white/[0.03]"
                  style={{ borderColor: "var(--border-color)", color: "var(--text-main)" }}
                >
                  <td className="px-6 py-4">
                    <div className="font-semibold">{item.sponsorName}</div>
                    <div className="mt-1 text-xs" style={{ color: "var(--text-muted)" }}>
                      {item.companyName}
                    </div>
                  </td>
                  <td className="px-6 py-4">{item.event?.title || "-"}</td>
                  <td className="px-6 py-4 font-semibold">{formatCurrency(item.sponsorshipAmount)}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${tierStyle[item.sponsorTier] || tierStyle.BRONZE}`}>
                      {item.sponsorTier}
                    </span>
                  </td>
                  <td className={`px-6 py-4 text-xs font-semibold uppercase ${paymentStyle[item.paymentStatus] || paymentStyle.PENDING}`}>
                    {item.paymentStatus}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${statusStyle[item.status] || statusStyle.ACTIVE}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="inline-flex gap-2">
                      <button type="button" onClick={() => onEdit(item)} className="inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold" style={{ borderColor: "rgba(255,255,255,0.08)", color: "var(--text-main)" }}>
                        <Edit2 size={14} /> Edit
                      </button>
                      <button type="button" onClick={() => onDelete(item)} className="inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold text-red-200" style={{ borderColor: "rgba(239,68,68,0.3)" }}>
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid gap-4 xl:hidden">
        {items.map((item, index) => (
          <motion.div
            key={item.id}
            className="rounded-3xl border p-5"
            style={{ borderColor: "var(--border-color)", backgroundColor: "var(--bg-card)" }}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.02 }}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold" style={{ color: "var(--text-main)" }}>{item.sponsorName}</h3>
                <p className="text-sm" style={{ color: "var(--text-muted)" }}>{item.companyName}</p>
              </div>
              <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${tierStyle[item.sponsorTier] || tierStyle.BRONZE}`}>
                {item.sponsorTier}
              </span>
            </div>

            <p className="mt-3 text-sm" style={{ color: "var(--text-main)" }}>Event: {item.event?.title || "-"}</p>
            <p className="mt-1 text-sm font-semibold" style={{ color: "var(--text-main)" }}>
              Amount: {formatCurrency(item.sponsorshipAmount)}
            </p>
            <p className={`mt-1 text-xs font-semibold uppercase ${paymentStyle[item.paymentStatus] || paymentStyle.PENDING}`}>
              Payment: {item.paymentStatus}
            </p>

            <div className="mt-4 flex gap-2">
              <button type="button" onClick={() => onEdit(item)} className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border px-3 py-3 text-sm font-semibold" style={{ borderColor: "rgba(255,255,255,0.08)", color: "var(--text-main)" }}>
                <Edit2 size={14} /> Edit
              </button>
              <button type="button" onClick={() => onDelete(item)} className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border px-3 py-3 text-sm font-semibold text-red-200" style={{ borderColor: "rgba(239,68,68,0.3)" }}>
                <Trash2 size={14} /> Delete
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </>
  );
};

export default SponsorshipTable;
