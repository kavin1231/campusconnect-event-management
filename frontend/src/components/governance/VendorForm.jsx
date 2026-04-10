import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

const fieldBase =
  "w-full rounded-xl border px-4 py-3 text-sm outline-none transition focus:ring-2 focus:ring-offset-0";

const VendorForm = ({
  open,
  mode,
  values,
  errors,
  loading,
  events = [],
  stalls = [],
  stallLoading = false,
  serviceCategoryOptions = [],
  onChange,
  onSubmit,
  onClose,
}) => {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[1200] flex items-center justify-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            className="relative w-full max-w-4xl rounded-3xl border shadow-[0_30px_80px_rgba(0,0,0,0.45)]"
            style={{
              borderColor: "var(--border-color)",
              backgroundColor: "var(--bg-card)",
            }}
            initial={{ y: 24, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 16, opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
          >
            <div
              className="flex items-start justify-between gap-4 border-b px-6 py-5"
              style={{ borderColor: "var(--border-color)" }}
            >
              <div>
                <p
                  className="text-xs tracking-[0.18em] uppercase"
                  style={{ color: "var(--primary-accent)" }}
                >
                  Vendor Management
                </p>
                <h2
                  className="mt-1 text-2xl font-black"
                  style={{ color: "var(--text-main)" }}
                >
                  {mode === "edit" ? "Edit Vendor" : "Add Vendor"}
                </h2>
                <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>
                  Maintain vendor contacts, services, and status from one place.
                </p>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border transition hover:opacity-80"
                style={{ borderColor: "var(--border-color)", color: "var(--text-muted)" }}
                aria-label="Close vendor form"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={onSubmit} className="px-6 py-6">
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <Field
                  label="Vendor Name"
                  required
                  name="name"
                  value={values.name}
                  onChange={onChange}
                  error={errors.name}
                  placeholder="SLIIT Food Services"
                />
                <Field
                  label="Company Name"
                  required
                  name="companyName"
                  value={values.companyName}
                  onChange={onChange}
                  error={errors.companyName}
                  placeholder="SLIIT Catering Pvt Ltd"
                />
                <SelectField
                  label="Service Category"
                  required
                  name="serviceCategory"
                  value={values.serviceCategory}
                  onChange={onChange}
                  error={errors.serviceCategory}
                  options={[
                    { value: "", label: "Select category" },
                    ...serviceCategoryOptions.map((item) => ({ value: item, label: item })),
                  ]}
                />
                <Field
                  label="Contact Person"
                  required
                  name="contactName"
                  value={values.contactName}
                  onChange={onChange}
                  error={errors.contactName}
                  placeholder="Nimal Perera"
                />
                <Field
                  label="Phone Number"
                  required
                  name="contactPhone"
                  value={values.contactPhone}
                  onChange={onChange}
                  error={errors.contactPhone}
                  placeholder="077 123 4567"
                />
                <Field
                  label="Email"
                  required
                  name="contactEmail"
                  type="email"
                  value={values.contactEmail}
                  onChange={onChange}
                  error={errors.contactEmail}
                  placeholder="vendor@company.com"
                />
                <SelectField
                  label="Event"
                  name="eventId"
                  value={values.eventId || ""}
                  onChange={onChange}
                  error={errors.eventId}
                  options={[
                    { value: "", label: "Select event" },
                    ...events.map((event) => ({ value: String(event.id), label: event.title })),
                  ]}
                />
                <SelectField
                  label="Stall"
                  name="stallId"
                  value={values.stallId || ""}
                  onChange={onChange}
                  error={errors.stallId}
                  disabled={!values.eventId || stallLoading}
                  options={[
                    {
                      value: "",
                      label: stallLoading
                        ? "Loading available stalls..."
                        : values.eventId
                          ? "No stall (unassigned)"
                          : "Select event first",
                    },
                    ...stalls.map((stall) => ({
                      value: String(stall.id),
                      label: `Stall ${stall.stallNumber} (${stall.status})`,
                    })),
                  ]}
                />
                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-semibold" style={{ color: "var(--text-main)" }}>
                    Address <span style={{ color: "var(--primary-accent)" }}>*</span>
                  </label>
                  <textarea
                    name="address"
                    rows={4}
                    value={values.address}
                    onChange={onChange}
                    placeholder="Full business address"
                    className={`${fieldBase} resize-none`}
                    style={{
                      borderColor: errors.address ? "rgba(239, 68, 68, 0.45)" : "var(--border-color)",
                      backgroundColor: "var(--bg-input)",
                      color: "var(--text-main)",
                    }}
                  />
                  {errors.address && (
                    <p className="mt-1.5 text-sm text-red-300">{errors.address}</p>
                  )}
                </div>
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
                  {loading ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Saving...
                    </>
                  ) : (
                    <>{mode === "edit" ? "Update Vendor" : "Create Vendor"}</>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const Field = ({ label, required, error, ...props }) => {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold" style={{ color: "var(--text-main)" }}>
        {label} {required && <span style={{ color: "var(--primary-accent)" }}>*</span>}
      </label>
      <input
        {...props}
        className={`${fieldBase} ${props.className || ""}`}
        style={{
          borderColor: error ? "rgba(239, 68, 68, 0.45)" : "var(--border-color)",
          backgroundColor: "var(--bg-input)",
          color: "var(--text-main)",
        }}
      />
      {error && <p className="mt-1.5 text-sm text-red-300">{error}</p>}
    </div>
  );
};

const SelectField = ({ label, required, error, options, disabled, ...props }) => {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold" style={{ color: "var(--text-main)" }}>
        {label} {required && <span style={{ color: "var(--primary-accent)" }}>*</span>}
      </label>
      <select
        {...props}
        disabled={disabled}
        className={`${fieldBase}`}
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
      {error && <p className="mt-1.5 text-sm text-red-300">{error}</p>}
    </div>
  );
};

export default VendorForm;
