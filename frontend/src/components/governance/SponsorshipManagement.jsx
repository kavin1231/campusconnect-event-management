import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { CircleCheckBig, CircleDollarSign, CirclePause, Filter, Plus, Search, ShieldCheck, Trophy } from "lucide-react";
import Sidebar from "../common/Sidebar";
import { FeedbackToast } from "../common/FeedbackUI";
import { governanceAPI } from "../../services/api";
import SponsorshipForm from "./SponsorshipForm";
import SponsorshipTable from "./SponsorshipTable";

const emptyForm = {
  sponsorName: "",
  companyName: "",
  contactPerson: "",
  contactPhone: "",
  sponsorEmail: "",
  eventId: "",
  sponsorshipAmount: "",
  sponsorshipType: "",
  paymentStatus: "PENDING",
  notes: "",
  status: "ACTIVE",
};

const getTierByAmount = (amount) => {
  const numeric = Number(amount || 0);
  if (numeric >= 300000) return "PLATINUM";
  if (numeric >= 150000) return "GOLD";
  if (numeric >= 50000) return "SILVER";
  return "BRONZE";
};

const formatCurrency = (value) => {
  return new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
};

const SponsorshipManagement = () => {
  const [items, setItems] = useState([]);
  const [summary, setSummary] = useState({ totalSponsors: 0, totalAmount: 0, paidSponsors: 0, activeSponsors: 0 });
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [eventFilter, setEventFilter] = useState("ALL");
  const [tierFilter, setTierFilter] = useState("ALL");
  const [paymentFilter, setPaymentFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formValues, setFormValues] = useState(emptyForm);
  const [formErrors, setFormErrors] = useState({});
  const [toast, setToast] = useState(null);

  useEffect(() => {
    loadEvents();
  }, []);

  useEffect(() => {
    loadSponsorships();
  }, [searchTerm, eventFilter, tierFilter, paymentFilter, statusFilter]);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(timer);
  }, [toast]);

  const tierPreview = useMemo(() => getTierByAmount(formValues.sponsorshipAmount), [formValues.sponsorshipAmount]);

  const loadEvents = async () => {
    try {
      const response = await governanceAPI.listEvents();
      if (response.success) {
        setEvents(response.events || []);
      }
    } catch (error) {
      console.error("Load events error:", error);
    }
  };

  const loadSponsorships = async () => {
    try {
      setLoading(true);
      const response = await governanceAPI.listSponsorships({
        search: searchTerm,
        eventId: eventFilter,
        sponsorTier: tierFilter,
        paymentStatus: paymentFilter,
        status: statusFilter,
      });

      if (response.success) {
        setItems(response.sponsorships || []);
        setSummary(response.summary || { totalSponsors: 0, totalAmount: 0, paidSponsors: 0, activeSponsors: 0 });
      } else {
        setToast({ type: "error", message: response.message || "Failed to load sponsorships" });
      }
    } catch (error) {
      console.error("Load sponsorships error:", error);
      setToast({ type: "error", message: "Failed to load sponsorships" });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormValues(emptyForm);
    setFormErrors({});
    setEditingItem(null);
  };

  const openCreate = () => {
    resetForm();
    setShowForm(true);
  };

  const openEdit = (item) => {
    setEditingItem(item);
    setFormValues({
      sponsorName: item.sponsorName || "",
      companyName: item.companyName || "",
      contactPerson: item.contactPerson || "",
      contactPhone: item.contactPhone || "",
      sponsorEmail: item.sponsorEmail || "",
      eventId: item.eventId ? String(item.eventId) : "",
      sponsorshipAmount: item.sponsorshipAmount !== undefined ? String(item.sponsorshipAmount) : "",
      sponsorshipType: item.sponsorshipType || "",
      paymentStatus: item.paymentStatus || "PENDING",
      notes: item.notes || "",
      status: item.status || "ACTIVE",
    });
    setFormErrors({});
    setShowForm(true);
  };

  const validateForm = () => {
    const errors = {};

    if (!formValues.sponsorName.trim()) errors.sponsorName = "Sponsor name is required";
    if (!formValues.companyName.trim()) errors.companyName = "Company name is required";
    if (!formValues.contactPerson.trim()) errors.contactPerson = "Contact person is required";
    if (!formValues.contactPhone.trim()) errors.contactPhone = "Phone is required";
    if (!formValues.sponsorEmail.trim()) errors.sponsorEmail = "Email is required";
    if (!formValues.eventId) errors.eventId = "Event is required";
    if (!formValues.sponsorshipType) errors.sponsorshipType = "Sponsorship type is required";

    const amount = Number(formValues.sponsorshipAmount);
    if (Number.isNaN(amount) || amount < 0) {
      errors.sponsorshipAmount = "Enter a valid sponsorship amount";
    }

    if (formValues.sponsorEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formValues.sponsorEmail)) {
      errors.sponsorEmail = "Enter a valid email address";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) {
      setToast({ type: "error", message: "Please fix the form errors and try again." });
      return;
    }

    try {
      setFormLoading(true);
      const payload = {
        ...formValues,
        eventId: Number(formValues.eventId),
        sponsorshipAmount: Number(formValues.sponsorshipAmount),
      };

      const response = editingItem
        ? await governanceAPI.updateSponsorship(editingItem.id, payload)
        : await governanceAPI.createSponsorship(payload);

      if (response.success) {
        setToast({ type: "success", message: editingItem ? "Sponsorship updated successfully" : "Sponsorship created successfully" });
        setShowForm(false);
        resetForm();
        await loadSponsorships();
      } else {
        setToast({ type: "error", message: response.message || "Unable to save sponsorship" });
      }
    } catch (error) {
      console.error("Save sponsorship error:", error);
      setToast({ type: "error", message: "Unable to save sponsorship" });
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (item) => {
    const confirmed = window.confirm(`Delete sponsorship ${item.sponsorName}?`);
    if (!confirmed) return;

    try {
      const response = await governanceAPI.deleteSponsorship(item.id);
      if (response.success) {
        setToast({ type: "success", message: "Sponsorship deleted successfully" });
        await loadSponsorships();
      } else {
        setToast({ type: "error", message: response.message || "Unable to delete sponsorship" });
      }
    } catch (error) {
      console.error("Delete sponsorship error:", error);
      setToast({ type: "error", message: "Unable to delete sponsorship" });
    }
  };

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: "var(--bg-darker)", color: "var(--text-main)" }}>
      <Sidebar isAdmin={true} />

      <div className="flex min-h-screen flex-1 flex-col">
        <FeedbackToast toast={toast} onClose={() => setToast(null)} />

        <div className="px-5 pt-8 pb-6 sm:px-8">
          <motion.div
            className="rounded-3xl border p-6 shadow-[0_20px_50px_rgba(0,0,0,0.15)]"
            style={{ borderColor: "var(--border-color)", background: "linear-gradient(to right, rgba(34,197,94,0.10), var(--bg-card))" }}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="mb-2 text-xs uppercase tracking-[0.18em]" style={{ color: "var(--primary-accent)" }}>President Dashboard</p>
                <h1 className="text-3xl font-black md:text-4xl">Sponsorship Management</h1>
                <p className="mt-2 max-w-2xl" style={{ color: "var(--text-muted)" }}>
                  Track sponsorship commitments, payment progress, and automatic tier badges.
                </p>
              </div>

              <button
                type="button"
                onClick={openCreate}
                className="inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
                style={{ backgroundColor: "var(--primary-accent)" }}
              >
                <Plus size={18} /> Add Sponsorship
              </button>
            </div>
          </motion.div>
        </div>

        <main className="mx-auto w-full max-w-[1320px] flex-1 px-5 pb-8 sm:px-8">
          <div className="mb-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <MetricCard icon={<ShieldCheck size={18} />} label="Total Sponsors" value={summary.totalSponsors} />
            <MetricCard icon={<CircleDollarSign size={18} />} label="Total Amount" value={formatCurrency(summary.totalAmount)} />
            <MetricCard icon={<CircleCheckBig size={18} />} label="Paid Sponsors" value={summary.paidSponsors} />
            <MetricCard icon={<CirclePause size={18} />} label="Active Sponsors" value={summary.activeSponsors} />
          </div>

          <div className="mb-6 rounded-3xl border p-5" style={{ borderColor: "var(--border-color)", backgroundColor: "var(--bg-card)" }}>
            <div className="grid gap-4 lg:grid-cols-5">
              <div className="relative lg:col-span-2">
                <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search sponsor, company, contact or email"
                  className="w-full rounded-2xl border py-3 pl-11 pr-4 text-sm outline-none transition focus:ring-2"
                  style={{ borderColor: "var(--border-color)", backgroundColor: "var(--bg-input)", color: "var(--text-main)" }}
                />
              </div>

              <FilterSelect value={eventFilter} onChange={setEventFilter} options={[{ value: "ALL", label: "All Events" }, ...events.map((event) => ({ value: String(event.id), label: event.title }))]} />
              <FilterSelect value={tierFilter} onChange={setTierFilter} options={[{ value: "ALL", label: "All Tiers" }, { value: "BRONZE", label: "Bronze" }, { value: "SILVER", label: "Silver" }, { value: "GOLD", label: "Gold" }, { value: "PLATINUM", label: "Platinum" }]} />
              <FilterSelect value={paymentFilter} onChange={setPaymentFilter} options={[{ value: "ALL", label: "All Payments" }, { value: "PENDING", label: "Pending" }, { value: "PARTIAL", label: "Partial" }, { value: "PAID", label: "Paid" }]} />
            </div>

            <div className="mt-4 grid gap-4 lg:grid-cols-5">
              <div className="lg:col-span-2" />
              <FilterSelect value={statusFilter} onChange={setStatusFilter} options={[{ value: "ALL", label: "All Statuses" }, { value: "ACTIVE", label: "Active" }, { value: "INACTIVE", label: "Inactive" }]} />
            </div>
          </div>

          <SponsorshipTable items={items} loading={loading} onEdit={openEdit} onDelete={handleDelete} />
        </main>

        <SponsorshipForm
          open={showForm}
          mode={editingItem ? "edit" : "create"}
          values={formValues}
          errors={formErrors}
          loading={formLoading}
          events={events}
          tierPreview={tierPreview}
          onChange={handleChange}
          onSubmit={handleSubmit}
          onClose={() => {
            setShowForm(false);
            resetForm();
          }}
        />
      </div>
    </div>
  );
};

const FilterSelect = ({ value, onChange, options }) => (
  <div className="relative">
    <Filter className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="w-full rounded-2xl border py-3 pl-11 pr-4 text-sm outline-none transition focus:ring-2"
      style={{ borderColor: "var(--border-color)", backgroundColor: "var(--bg-input)", color: "var(--text-main)" }}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>{option.label}</option>
      ))}
    </select>
  </div>
);

const MetricCard = ({ icon, label, value }) => (
  <div className="rounded-3xl border p-5 shadow-[0_18px_42px_rgba(0,0,0,0.12)]" style={{ borderColor: "var(--border-color)", backgroundColor: "var(--bg-card)" }}>
    <div className="flex items-center gap-3 text-emerald-300">
      <div className="rounded-2xl p-2" style={{ backgroundColor: "rgba(255,255,255,0.04)" }}>{icon}</div>
      <p className="text-xs font-semibold uppercase tracking-[0.18em]" style={{ color: "var(--text-muted)" }}>{label}</p>
    </div>
    <div className="mt-3 text-3xl font-black" style={{ color: "var(--text-main)" }}>{value}</div>
  </div>
);

export default SponsorshipManagement;
