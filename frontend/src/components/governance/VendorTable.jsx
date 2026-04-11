import { motion } from "framer-motion";
import { Edit2, Trash2, Building2, Phone, Mail, MapPin } from "lucide-react";

const statusStyles = {
  ACTIVE: "border-emerald-500/30 bg-emerald-500/15 text-emerald-200",
  INACTIVE: "border-slate-500/30 bg-slate-500/15 text-slate-200",
};

const VendorTable = ({ vendors, loading, onEdit, onDelete }) => {
  if (loading) {
    return (
      <div
        className="rounded-3xl border p-8 text-sm"
        style={{ borderColor: "var(--border-color)", backgroundColor: "var(--bg-card)", color: "var(--text-muted)" }}
      >
        Loading vendors...
      </div>
    );
  }

  if (!vendors.length) {
    return (
      <div
        className="rounded-3xl border p-10 text-center"
        style={{ borderColor: "var(--border-color)", backgroundColor: "var(--bg-card)" }}
      >
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl" style={{ backgroundColor: "rgba(255,255,255,0.04)", color: "var(--primary-accent)" }}>
          <Building2 size={24} />
        </div>
        <h3 className="text-lg font-bold" style={{ color: "var(--text-main)" }}>
          No vendors found
        </h3>
        <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>
          Create a vendor record to start tracking service partners.
        </p>
      </div>
    );
  }

  return (
    <>
      <div
        className="hidden overflow-hidden rounded-3xl border xl:block"
        style={{ borderColor: "var(--border-color)", backgroundColor: "var(--bg-card)" }}
      >
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse text-left text-sm">
            <thead style={{ backgroundColor: "rgba(255,255,255,0.03)" }}>
              <tr style={{ color: "var(--text-muted)" }}>
                <th className="px-6 py-4 font-semibold">Vendor</th>
                <th className="px-6 py-4 font-semibold">Company</th>
                <th className="px-6 py-4 font-semibold">Service</th>
                <th className="px-6 py-4 font-semibold">Vendor Fee</th>
                <th className="px-6 py-4 font-semibold">Contact</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {vendors.map((vendor, index) => (
                <motion.tr
                  key={vendor.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className="border-t transition hover:bg-white/[0.03]"
                  style={{ borderColor: "var(--border-color)", color: "var(--text-main)" }}
                >
                  <td className="px-6 py-4">
                    <div className="font-semibold">{vendor.name}</div>
                    <div className="mt-1 text-xs" style={{ color: "var(--text-muted)" }}>
                      {vendor.address}
                    </div>
                  </td>
                  <td className="px-6 py-4">{vendor.companyName}</td>
                  <td className="px-6 py-4">{vendor.serviceCategory}</td>
                  <td className="px-6 py-4">LKR {Number(vendor.vendorFee || 0).toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Phone size={14} className="text-slate-400" />
                        <span>{vendor.contactName}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs" style={{ color: "var(--text-muted)" }}>
                        <Mail size={14} />
                        <span>{vendor.contactEmail || "-"}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${statusStyles[vendor.status] || statusStyles.INACTIVE}`}>
                      {vendor.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="inline-flex gap-2">
                      <button
                        type="button"
                        onClick={() => onEdit(vendor)}
                        className="inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold transition hover:opacity-85"
                        style={{ borderColor: "rgba(255,255,255,0.08)", color: "var(--text-main)" }}
                      >
                        <Edit2 size={14} /> Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(vendor)}
                        className="inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold text-red-200 transition hover:bg-red-500/10"
                        style={{ borderColor: "rgba(239,68,68,0.3)" }}
                      >
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
        {vendors.map((vendor, index) => (
          <motion.div
            key={vendor.id}
            className="rounded-3xl border p-5"
            style={{ borderColor: "var(--border-color)", backgroundColor: "var(--bg-card)" }}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.03 }}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold" style={{ color: "var(--text-main)" }}>
                  {vendor.name}
                </h3>
                <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>
                  {vendor.companyName}
                </p>
              </div>
              <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${statusStyles[vendor.status] || statusStyles.INACTIVE}`}>
                {vendor.status}
              </span>
            </div>

            <div className="mt-4 space-y-3 text-sm" style={{ color: "var(--text-main)" }}>
              <Line icon={<Building2 size={14} />} label="Service" value={vendor.serviceCategory} />
              <Line icon={<Building2 size={14} />} label="Vendor Fee" value={`LKR ${Number(vendor.vendorFee || 0).toLocaleString()}`} />
              <Line icon={<Phone size={14} />} label="Contact" value={vendor.contactName} />
              <Line icon={<Mail size={14} />} label="Email" value={vendor.contactEmail || "-"} />
              <Line icon={<MapPin size={14} />} label="Address" value={vendor.address} />
            </div>

            <div className="mt-5 flex gap-2">
              <button
                type="button"
                onClick={() => onEdit(vendor)}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border px-3 py-3 text-sm font-semibold transition hover:opacity-85"
                style={{ borderColor: "rgba(255,255,255,0.08)", color: "var(--text-main)" }}
              >
                <Edit2 size={14} /> Edit
              </button>
              <button
                type="button"
                onClick={() => onDelete(vendor)}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border px-3 py-3 text-sm font-semibold text-red-200 transition hover:bg-red-500/10"
                style={{ borderColor: "rgba(239,68,68,0.3)" }}
              >
                <Trash2 size={14} /> Delete
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </>
  );
};

const Line = ({ icon, label, value }) => (
  <div className="flex items-start gap-3">
    <span className="mt-0.5 text-slate-400">{icon}</span>
    <div>
      <p className="text-xs uppercase tracking-[0.15em]" style={{ color: "var(--text-muted)" }}>
        {label}
      </p>
      <p className="mt-0.5">{value}</p>
    </div>
  </div>
);

export default VendorTable;
