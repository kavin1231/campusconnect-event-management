import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Filter, Plus, Search, Store, Users, CircleAlert, CircleCheckBig, CircleX } from "lucide-react";
import Sidebar from "../common/Sidebar";
import { FeedbackToast } from "../common/FeedbackUI";
import { governanceAPI } from "../../services/api";
import VendorForm from "./VendorForm";
import VendorTable from "./VendorTable";

const SERVICE_CATEGORY_OPTIONS = [
  "Food & Beverage",
  "Clothing",
  "Accessories",
  "Technology",
  "Education",
  "Health & Beauty",
  "Art & Crafts",
  "Other",
];

const emptyForm = {
  name: "",
  companyName: "",
  serviceCategory: "",
  vendorFee: "",
  contactName: "",
  contactPhone: "",
  contactEmail: "",
  address: "",
  status: "ACTIVE",
  eventId: "",
  stallId: "",
};

const MOCK_VENDORS = [
  {
    id: 1,
    name: "Ceylon Bites",
    companyName: "Ceylon Foods Pvt Ltd",
    serviceCategory: "Food & Beverage",
    vendorFee: 120000,
    contactName: "Nimal Perera",
    contactPhone: "+94 77 123 4567",
    contactEmail: "nimal@ceylonbites.lk",
    address: "Colombo 07",
    status: "ACTIVE",
    eventStallAllocations: [{ id: 11, event: { id: 1, title: "Tech Expo 2026" } }],
  },
  {
    id: 2,
    name: "Pixel Print",
    companyName: "Pixel Print Studio",
    serviceCategory: "Art & Crafts",
    vendorFee: 85000,
    contactName: "Suresh Silva",
    contactPhone: "+94 70 222 7788",
    contactEmail: "hello@pixelprint.lk",
    address: "Kandy",
    status: "ACTIVE",
    eventStallAllocations: [{ id: 12, event: { id: 2, title: "Campus Carnival" } }],
  },
  {
    id: 3,
    name: "Byte Mart",
    companyName: "Byte Mart Solutions",
    serviceCategory: "Technology",
    vendorFee: 70000,
    contactName: "Ayesha Khan",
    contactPhone: "+94 71 889 3322",
    contactEmail: "sales@bytemart.lk",
    address: "Nugegoda",
    status: "INACTIVE",
    eventStallAllocations: [],
  },
];

const MOCK_EVENTS = [
  { id: 1, title: "Tech Expo 2026" },
  { id: 2, title: "Campus Carnival" },
  { id: 3, title: "Arts Week Showcase" },
];

const MOCK_STALLS = [
  { id: 11, stallNumber: 1, status: "RESERVED", vendor: { name: "Ceylon Bites" }, serviceCategory: "Food & Beverage" },
  { id: 12, stallNumber: 2, status: "RESERVED", vendor: { name: "Pixel Print" }, serviceCategory: "Art & Crafts" },
  { id: 13, stallNumber: 3, status: "AVAILABLE", vendor: null, serviceCategory: "Technology" },
];

const VendorManagement = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [vendors, setVendors] = useState(MOCK_VENDORS);
  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [serviceFilter, setServiceFilter] = useState("ALL");
  const [showForm, setShowForm] = useState(false);
  const [editingVendor, setEditingVendor] = useState(null);
  const [toast, setToast] = useState(null);
  const [formValues, setFormValues] = useState(emptyForm);
  const [formErrors, setFormErrors] = useState({});
  const [events, setEvents] = useState(MOCK_EVENTS);
  const [availableStalls, setAvailableStalls] = useState(MOCK_STALLS);
  const [stallLoading, setStallLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");

    if (!token || !userStr) {
      navigate("/login");
      return;
    }

    try {
      setUser(JSON.parse(userStr));
    } catch {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    if (!user) return;
    loadVendors();
    loadEvents();
  }, [user, searchTerm, statusFilter, serviceFilter]);

  useEffect(() => {
    if (!formValues.eventId) {
      setAvailableStalls([]);
      return;
    }

    loadAvailableStalls(formValues.eventId, editingVendor?.id);
  }, [formValues.eventId, editingVendor?.id]);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(timer);
  }, [toast]);

  const showToast = (message, type = "info") => {
    setToast({ message, type });
  };

  const loadVendors = async () => {
    try {
      setLoading(true);
      const data = await governanceAPI.listVendors({
        search: searchTerm.trim(),
        status: statusFilter,
        serviceCategory: serviceFilter,
      });

      if (data.success) {
        setVendors(data.vendors?.length ? data.vendors : MOCK_VENDORS);
      } else {
        setVendors(MOCK_VENDORS);
        showToast(data.message || "Unable to load vendors", "error");
      }
    } catch (error) {
      console.error("Failed to load vendors:", error);
      setVendors(MOCK_VENDORS);
      showToast(error.message || "Unable to load vendors", "error");
    } finally {
      setLoading(false);
    }
  };

  const loadEvents = async () => {
    try {
      const data = await governanceAPI.listEvents();
      if (data.success) {
        const normalizedEvents = (data.events || [])
          .map((event) => ({
            id: event.id ?? event.eventId,
            title: event.title || event.eventName,
          }))
          .filter((event) => event.id && event.title);

        setEvents(normalizedEvents.length ? normalizedEvents : MOCK_EVENTS);
      } else {
        setEvents(MOCK_EVENTS);
      }
    } catch (error) {
      console.error("Failed to load events:", error);
      setEvents(MOCK_EVENTS);
    }
  };

  const loadAvailableStalls = async (eventId, vendorId) => {
    try {
      setStallLoading(true);
      const data = await governanceAPI.getAvailableStallsByEvent(eventId, vendorId);
      if (data.success) {
        setAvailableStalls(data.stalls?.length ? data.stalls : MOCK_STALLS);
      } else {
        setAvailableStalls(MOCK_STALLS);
      }
    } catch (error) {
      console.error("Failed to load available stalls:", error);
      setAvailableStalls(MOCK_STALLS);
    } finally {
      setStallLoading(false);
    }
  };

  const serviceCategories = useMemo(() => {
    return Array.from(new Set(vendors.map((vendor) => vendor.serviceCategory).filter(Boolean))).sort();
  }, [vendors]);

  const metrics = useMemo(() => {
    const active = vendors.filter((vendor) => (vendor.status || "").toUpperCase() === "ACTIVE").length;
    const inactive = vendors.filter((vendor) => (vendor.status || "").toUpperCase() === "INACTIVE").length;
    return {
      total: vendors.length,
      active,
      inactive,
      filtered: vendors.length,
    };
  }, [vendors]);

  const resetForm = () => {
    setFormValues(emptyForm);
    setFormErrors({});
    setEditingVendor(null);
    setAvailableStalls([]);
  };

  const openCreateForm = () => {
    resetForm();
    setShowForm(true);
  };

  const openEditForm = (vendor) => {
    setEditingVendor(vendor);
    setFormValues({
      name: vendor.name || "",
      companyName: vendor.companyName || "",
      serviceCategory: vendor.serviceCategory || "",
      contactName: vendor.contactName || "",
      contactPhone: vendor.contactPhone || "",
      contactEmail: vendor.contactEmail || "",
      vendorFee:
        vendor.vendorFee !== undefined && vendor.vendorFee !== null
          ? String(vendor.vendorFee)
          : "",
      address: vendor.address || "",
      status: (vendor.status || "ACTIVE").toUpperCase(),
      eventId: vendor.eventStallAllocations?.[0]?.event?.id
        ? String(vendor.eventStallAllocations[0].event.id)
        : "",
      stallId: vendor.eventStallAllocations?.[0]?.id
        ? String(vendor.eventStallAllocations[0].id)
        : "",
    });
    setFormErrors({});
    setShowForm(true);
  };

  const validateForm = () => {
    const nextErrors = {};
    const requiredFields = [
      ["name", "Vendor name"],
      ["companyName", "Company name"],
      ["serviceCategory", "Service category"],
      ["contactName", "Contact person"],
      ["contactPhone", "Phone number"],
      ["contactEmail", "Email"],
      ["address", "Address"],
      ["status", "Status"],
    ];

    requiredFields.forEach(([key, label]) => {
      if (!formValues[key] || !String(formValues[key]).trim()) {
        nextErrors[key] = `${label} is required`;
      }
    });

    if (formValues.contactEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formValues.contactEmail)) {
      nextErrors.contactEmail = "Enter a valid email address";
    }

    if (formValues.contactPhone && String(formValues.contactPhone).replace(/\D/g, "").length < 8) {
      nextErrors.contactPhone = "Enter a valid phone number";
    }

    const fee = Number(formValues.vendorFee);
    if (Number.isNaN(fee) || fee < 0) {
      nextErrors.vendorFee = "Vendor fee must be a non-negative number";
    }

    if (formValues.eventId && formValues.stallId) {
      const selected = availableStalls.find(
        (stall) => String(stall.id) === String(formValues.stallId),
      );
      if (!selected) {
        nextErrors.stallId = "Selected stall is no longer available for this event";
      }
    }

    setFormErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleFieldChange = (event) => {
    const { name, value } = event.target;
    setFormValues((current) => {
      if (name === "eventId") {
        return {
          ...current,
          eventId: value,
          // Prevent stale selection from previous event and force fresh stall choices.
          stallId: "",
        };
      }

      return { ...current, [name]: value };
    });
    setFormErrors((current) => ({ ...current, [name]: undefined }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) {
      showToast("Please fix the form errors and try again.", "error");
      return;
    }

    try {
      setFormLoading(true);
      const payload = {
        ...formValues,
        status: formValues.status.toUpperCase(),
        vendorFee: Number(formValues.vendorFee || 0),
        eventId: formValues.eventId ? Number(formValues.eventId) : undefined,
        stallId: formValues.stallId ? Number(formValues.stallId) : undefined,
      };

      const response = editingVendor
        ? await governanceAPI.updateVendor(editingVendor.id, payload)
        : await governanceAPI.createVendor(payload);

      if (response.success) {
        showToast(
          editingVendor ? "Vendor updated successfully." : "Vendor created successfully.",
          "success",
        );
        setShowForm(false);
        resetForm();
        await loadVendors();
      } else {
        showToast(response.message || "Unable to save vendor", "error");
      }
    } catch (error) {
      console.error("Save vendor error:", error);
      showToast(error.message || "Unable to save vendor", "error");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (vendor) => {
    const confirmed = window.confirm(`Delete ${vendor.name}? This action cannot be undone.`);
    if (!confirmed) return;

    try {
      const response = await governanceAPI.deleteVendor(vendor.id);
      if (response.success) {
        showToast("Vendor deleted successfully.", "success");
        await loadVendors();
      } else {
        showToast(response.message || "Unable to delete vendor", "error");
      }
    } catch (error) {
      console.error("Delete vendor error:", error);
      showToast(error.message || "Unable to delete vendor", "error");
    }
  };

  if (!user) {
    return <div className="p-10 text-white">Loading...</div>;
  }

  return (
    <div
      className="flex min-h-screen"
      style={{ backgroundColor: "var(--bg-darker)", color: "var(--text-main)" }}
    >
      <Sidebar isAdmin={true} />

      <div className="flex min-h-screen flex-1 flex-col">
        <FeedbackToast toast={toast} onClose={() => setToast(null)} />

        <div className="px-5 pt-8 sm:px-8 pb-6">
          <motion.div
            className="rounded-3xl border p-6 shadow-[0_20px_50px_rgba(0,0,0,0.15)]"
            style={{
              borderColor: "var(--border-color)",
              background: "linear-gradient(to right, rgba(99, 102, 241, 0.10), var(--bg-card))",
            }}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p
                  className="mb-2 text-xs uppercase tracking-[0.18em]"
                  style={{ color: "var(--primary-accent)" }}
                >
                  President Dashboard
                </p>
                <h1 className="text-3xl font-black md:text-4xl" style={{ color: "var(--text-main)" }}>
                  Vendor Management
                </h1>
                <p className="mt-2 max-w-2xl" style={{ color: "var(--text-muted)" }}>
                  Manage event vendors, service partners, and contact details from a single workspace.
                </p>
              </div>

              <button
                type="button"
                onClick={openCreateForm}
                className="inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
                style={{ backgroundColor: "var(--primary-accent)" }}
              >
                <Plus size={18} /> Add Vendor
              </button>
            </div>
          </motion.div>
        </div>

        <main className="mx-auto w-full flex-1 max-w-[1320px] px-5 pb-8 sm:px-8">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 mb-8">
            <MetricCard
              icon={<Store size={18} />}
              label="Total Vendors"
              value={metrics.total}
              accent="indigo"
            />
            <MetricCard
              icon={<CircleCheckBig size={18} />}
              label="Active"
              value={metrics.active}
              accent="emerald"
            />
            <MetricCard
              icon={<CircleX size={18} />}
              label="Inactive"
              value={metrics.inactive}
              accent="slate"
            />
            <MetricCard
              icon={<Users size={18} />}
              label="Service Categories"
              value={serviceCategories.length}
              accent="amber"
            />
          </div>

          <div
            className="mb-6 rounded-3xl border p-5"
            style={{ borderColor: "var(--border-color)", backgroundColor: "var(--bg-card)" }}
          >
            <div className="grid gap-4 lg:grid-cols-[1.5fr_0.8fr_0.8fr]">
              <div className="relative">
                <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search vendor, company, service, contact, or address"
                  className="w-full rounded-2xl border py-3 pl-11 pr-4 text-sm outline-none transition focus:ring-2"
                  style={{
                    borderColor: "var(--border-color)",
                    backgroundColor: "var(--bg-input)",
                    color: "var(--text-main)",
                  }}
                />
              </div>

              <div className="relative">
                <Filter className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full rounded-2xl border py-3 pl-11 pr-4 text-sm outline-none transition focus:ring-2"
                  style={{
                    borderColor: "var(--border-color)",
                    backgroundColor: "var(--bg-input)",
                    color: "var(--text-main)",
                  }}
                >
                  <option value="ALL">All Statuses</option>
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                </select>
              </div>

              <div className="relative">
                <Filter className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <select
                  value={serviceFilter}
                  onChange={(e) => setServiceFilter(e.target.value)}
                  className="w-full rounded-2xl border py-3 pl-11 pr-4 text-sm outline-none transition focus:ring-2"
                  style={{
                    borderColor: "var(--border-color)",
                    backgroundColor: "var(--bg-input)",
                    color: "var(--text-main)",
                  }}
                >
                  <option value="ALL">All Categories</option>
                  {serviceCategories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <VendorTable
            vendors={vendors}
            loading={loading}
            onEdit={openEditForm}
            onDelete={handleDelete}
          />
        </main>

        <VendorForm
          open={showForm}
          mode={editingVendor ? "edit" : "create"}
          values={formValues}
          errors={formErrors}
          loading={formLoading}
          events={events}
          stalls={availableStalls}
          stallLoading={stallLoading}
          serviceCategoryOptions={SERVICE_CATEGORY_OPTIONS}
          onChange={handleFieldChange}
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

const MetricCard = ({ icon, label, value, accent }) => {
  const colorMap = {
    indigo: "text-indigo-300",
    emerald: "text-emerald-300",
    slate: "text-slate-300",
    amber: "text-amber-300",
  };

  return (
    <div
      className="rounded-3xl border p-5 shadow-[0_18px_42px_rgba(0,0,0,0.12)]"
      style={{ borderColor: "var(--border-color)", backgroundColor: "var(--bg-card)" }}
    >
      <div className={`flex items-center gap-3 ${colorMap[accent] || colorMap.indigo}`}>
        <div className="rounded-2xl p-2" style={{ backgroundColor: "rgba(255,255,255,0.04)" }}>
          {icon}
        </div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em]" style={{ color: "var(--text-muted)" }}>
          {label}
        </p>
      </div>
      <div className="mt-3 text-3xl font-black" style={{ color: "var(--text-main)" }}>
        {value}
      </div>
    </div>
  );
};

export default VendorManagement;
