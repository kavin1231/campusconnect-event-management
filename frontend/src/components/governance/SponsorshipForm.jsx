import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

const fieldBase =
  "w-full rounded-xl border px-4 py-3 text-sm outline-none transition focus:ring-2 focus:ring-offset-0";

const SponsorshipForm = ({
  open,
  mode,
  values,
  errors,
  loading,
  events = [],
  tierPreview,
  onChange,
  onSubmit,
  onClose,
}) => {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[1200] flex items-center justify-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

          <motion.div
            className="relative w-full max-w-5xl rounded-3xl border shadow-[0_30px_80px_rgba(0,0,0,0.45)]"
            style={{ borderColor: "var(--border-color)", backgroundColor: "var(--bg-card)" }}
            initial={{ y: 24, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 16, opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
          >
            <div className="flex items-start justify-between gap-4 border-b px-6 py-5" style={{ borderColor: "var(--border-color)" }}>
              <div>
                <p className="text-xs uppercase tracking-[0.18em]" style={{ color: "var(--primary-accent)" }}>
                  President Dashboard
                </p>
                <h2 className="mt-1 text-2xl font-black" style={{ color: "var(--text-main)" }}>
                  {mode === "edit" ? "Edit Sponsorship" : "Add Sponsorship"}
                </h2>
                <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>
                  Manage sponsor commitments and payment progress in one place.
                </p>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border transition hover:opacity-80"
                style={{ borderColor: "var(--border-color)", color: "var(--text-muted)" }}
                aria-label="Close sponsorship form"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={onSubmit} className="px-6 py-6">
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <Field label="Sponsor Name" required name="sponsorName" value={values.sponsorName} onChange={onChange} error={errors.sponsorName} placeholder="Dialog Axiata" />
                <Field label="Company Name" required name="companyName" value={values.companyName} onChange={onChange} error={errors.companyName} placeholder="Dialog PLC" />
                <Field label="Contact Person" required name="contactPerson" value={values.contactPerson} onChange={onChange} error={errors.contactPerson} placeholder="Nimal Perera" />
                <Field label="Phone" required name="contactPhone" value={values.contactPhone} onChange={onChange} error={errors.contactPhone} placeholder="077 123 4567" />
                <Field label="Email" required type="email" name="sponsorEmail" value={values.sponsorEmail} onChange={onChange} error={errors.sponsorEmail} placeholder="sponsor@company.com" />
                <SelectField
                  label="Event"
                  required
                  name="eventId"
                  value={values.eventId}
                  onChange={onChange}
                  error={errors.eventId}
                  options={[
                    { value: "", label: "Select event" },
                    ...events.map((event) => ({ value: String(event.id), label: event.title })),
                  ]}
                />
                <Field label="Sponsorship Amount (LKR)" required type="number" min="0" step="1000" name="sponsorshipAmount" value={values.sponsorshipAmount} onChange={onChange} error={errors.sponsorshipAmount} placeholder="250000" />
                <SelectField
                  label="Sponsorship Type"
                  required
                  name="sponsorshipType"
                  value={values.sponsorshipType}
                  onChange={onChange}
                  error={errors.sponsorshipType}
                  options={[
                    { value: "", label: "Select type" },
                    { value: "CASH", label: "Cash" },
                    { value: "IN_KIND", label: "In-kind" },
                    { value: "MIXED", label: "Mixed" },
                  ]}
                />
                <SelectField
                  label="Payment Status"
                  required
                  name="paymentStatus"
                  value={values.paymentStatus}
                  onChange={onChange}
                  error={errors.paymentStatus}
                  options={[
                    { value: "PENDING", label: "Pending" },
                    { value: "PARTIAL", label: "Partial" },
                    { value: "PAID", label: "Paid" },
                  ]}
                />
                <SelectField
                  label="Status"
                  required
                  name="status"
                  value={values.status}
                  onChange={onChange}
                  error={errors.status}
                  options={[
                    { value: "ACTIVE", label: "Active" },
                    { value: "INACTIVE", label: "Inactive" },
                  ]}
                />

                <div>
                  <label className="mb-2 block text-sm font-semibold" style={{ color: "var(--text-main)" }}>
                    Sponsor Tier
                  </label>
                  <div
                    className="inline-flex rounded-full border px-3 py-2 text-xs font-semibold"
                    style={{ borderColor: "var(--border-color)", color: "var(--text-main)", backgroundColor: "rgba(255,255,255,0.03)" }}
                  >
                    {tierPreview}
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-semibold" style={{ color: "var(--text-main)" }}>
                    Notes
                  </label>
                  <textarea
                    name="notes"
                    rows={4}
                    value={values.notes}
                    onChange={onChange}
                    placeholder="Additional sponsorship details"
                    className={`${fieldBase} resize-none`}
                    style={{
                      borderColor: errors.notes ? "rgba(239, 68, 68, 0.45)" : "var(--border-color)",
                      backgroundColor: "var(--bg-input)",
                      color: "var(--text-main)",
                    }}
                  />
                  {errors.notes ? <p className="mt-1.5 text-sm text-red-300">{errors.notes}</p> : null}
                </div>
              </div>

              <div className="mt-8 flex flex-wrap items-center justify-end gap-3 border-t pt-5" style={{ borderColor: "var(--border-color)" }}>
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-xl border px-5 py-3 text-sm font-semibold transition hover:opacity-80"
                  style={{ borderColor: "var(--border-color)", color: "var(--text-main)" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-70"
                  style={{ backgroundColor: "var(--primary-accent)" }}
                >
                  {loading ? "Saving..." : mode === "edit" ? "Update Sponsorship" : "Create Sponsorship"}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};

const Field = ({ label, required, error, ...props }) => (
  <div>
    <label className="mb-2 block text-sm font-semibold" style={{ color: "var(--text-main)" }}>
      {label} {required ? <span style={{ color: "var(--primary-accent)" }}>*</span> : null}
    </label>
    <input
      {...props}
      className={fieldBase}
      style={{
        borderColor: error ? "rgba(239, 68, 68, 0.45)" : "var(--border-color)",
        backgroundColor: "var(--bg-input)",
        color: "var(--text-main)",
      }}
    />
    {error ? <p className="mt-1.5 text-sm text-red-300">{error}</p> : null}
  </div>
);

const SelectField = ({ label, required, error, options, ...props }) => (
  <div>
    <label className="mb-2 block text-sm font-semibold" style={{ color: "var(--text-main)" }}>
      {label} {required ? <span style={{ color: "var(--primary-accent)" }}>*</span> : null}
    </label>
    <select
      {...props}
      className={fieldBase}
      style={{
        borderColor: error ? "rgba(239, 68, 68, 0.45)" : "var(--border-color)",
        backgroundColor: "var(--bg-input)",
        color: "var(--text-main)",
      }}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
    {error ? <p className="mt-1.5 text-sm text-red-300">{error}</p> : null}
  </div>
);

export default SponsorshipForm;
