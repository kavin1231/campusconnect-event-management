import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Filter, LayoutGrid, MapPinned, Search, Store } from "lucide-react";
import Sidebar from "../common/Sidebar";
import { FeedbackToast } from "../common/FeedbackUI";
import { governanceAPI } from "../../services/api";
import StallAllocationTable from "./StallAllocationTable";
import StallMapView from "./StallMapView";

const StallAllocation = () => {
  const MOCK_EVENTS = [
    { id: 1, title: "Tech Expo 2026" },
    { id: 2, title: "Campus Carnival" },
  ];

  const MOCK_STALLS = [
    { id: 1, stallNumber: 1, status: "RESERVED", vendor: { name: "Ceylon Bites" }, serviceCategory: "Food & Beverage" },
    { id: 2, stallNumber: 2, status: "RESERVED", vendor: { name: "Pixel Print" }, serviceCategory: "Art & Crafts" },
    { id: 3, stallNumber: 3, status: "AVAILABLE", vendor: null, serviceCategory: "Technology" },
    { id: 4, stallNumber: 4, status: "AVAILABLE", vendor: null, serviceCategory: "Education" },
  ];

  const [events, setEvents] = useState(MOCK_EVENTS);
  const [selectedEventId, setSelectedEventId] = useState(String(MOCK_EVENTS[0].id));
  const [selectedEventName, setSelectedEventName] = useState(MOCK_EVENTS[0].title);
  const [stalls, setStalls] = useState(MOCK_STALLS);
  const [loading, setLoading] = useState(false);
  const [mapLoading, setMapLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [serviceFilter, setServiceFilter] = useState("ALL");
  const [viewMode, setViewMode] = useState("list");
  const [toast, setToast] = useState(null);

  useEffect(() => {
    loadEvents();
  }, []);

  useEffect(() => {
    if (!selectedEventId) return;
    loadStalls();
  }, [selectedEventId, searchTerm, statusFilter, serviceFilter]);

  useEffect(() => {
    if (!selectedEventId || viewMode !== "map") return;
    loadMapData();
  }, [selectedEventId, viewMode]);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(timer);
  }, [toast]);

  const loadEvents = async () => {
    try {
      const response = await governanceAPI.listEvents();
      if (response.success) {
        const eventRows = response.events || [];
        const nextEvents = eventRows.length ? eventRows : MOCK_EVENTS;
        setEvents(nextEvents);
        if (nextEvents.length > 0) {
          setSelectedEventId(String(nextEvents[0].id));
          setSelectedEventName(nextEvents[0].title);
        }
      } else {
        setEvents(MOCK_EVENTS);
        setSelectedEventId(String(MOCK_EVENTS[0].id));
        setSelectedEventName(MOCK_EVENTS[0].title);
      }
    } catch (error) {
      console.error("Load events failed:", error);
      setEvents(MOCK_EVENTS);
      setSelectedEventId(String(MOCK_EVENTS[0].id));
      setSelectedEventName(MOCK_EVENTS[0].title);
      setToast({ type: "error", message: "Failed to load events" });
    }
  };

  const loadStalls = async () => {
    try {
      setLoading(true);
      const response = await governanceAPI.getStallsByEvent({
        eventId: selectedEventId,
        search: searchTerm,
        status: statusFilter,
        serviceCategory: serviceFilter,
      });

      if (response.success) {
        setStalls(response.stalls?.length ? response.stalls : MOCK_STALLS);
      } else {
        setStalls(MOCK_STALLS);
        setToast({ type: "error", message: response.message || "Failed to load stalls" });
      }
    } catch (error) {
      console.error("Load stalls failed:", error);
      setStalls(MOCK_STALLS);
      setToast({ type: "error", message: "Failed to load stalls" });
    } finally {
      setLoading(false);
    }
  };

  const loadMapData = async () => {
    try {
      setMapLoading(true);
      const response = await governanceAPI.getStallMapData(selectedEventId);
      if (response.success) {
        setStalls(response.stalls?.length ? response.stalls : MOCK_STALLS);
      } else {
        setStalls(MOCK_STALLS);
      }
    } catch (error) {
      console.error("Load map data failed:", error);
      setStalls(MOCK_STALLS);
      setToast({ type: "error", message: "Failed to load map data" });
    } finally {
      setMapLoading(false);
    }
  };

  const handleEventChange = (value) => {
    setSelectedEventId(value);
    const event = events.find((entry) => String(entry.id) === String(value));
    setSelectedEventName(event?.title || "");
  };

  const handleRelease = async (stall) => {
    const confirmed = window.confirm(`Release Stall ${stall.stallNumber}?`);
    if (!confirmed) return;

    try {
      const response = await governanceAPI.releaseStall(stall.id);
      if (response.success) {
        setToast({ type: "success", message: `Stall ${stall.stallNumber} released successfully` });
        await loadStalls();
      } else {
        setToast({ type: "error", message: response.message || "Unable to release stall" });
      }
    } catch (error) {
      console.error("Release stall failed:", error);
      setToast({ type: "error", message: "Unable to release stall" });
    }
  };

  const serviceCategories = useMemo(() => {
    return Array.from(
      new Set(
        stalls
          .map((stall) => stall.serviceCategory || stall.vendor?.serviceCategory)
          .filter(Boolean),
      ),
    ).sort();
  }, [stalls]);

  const metrics = useMemo(() => {
    const reserved = stalls.filter((stall) => stall.status === "RESERVED").length;
    return {
      total: stalls.length,
      reserved,
      available: stalls.length - reserved,
    };
  }, [stalls]);

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: "var(--bg-darker)", color: "var(--text-main)" }}>
      <Sidebar isAdmin={true} />

      <div className="flex min-h-screen flex-1 flex-col">
        <FeedbackToast toast={toast} onClose={() => setToast(null)} />

        <div className="px-5 pt-8 pb-6 sm:px-8">
          <motion.div
            className="rounded-3xl border p-6 shadow-[0_20px_50px_rgba(0,0,0,0.15)]"
            style={{
              borderColor: "var(--border-color)",
              background: "linear-gradient(to right, rgba(59,130,246,0.12), var(--bg-card))",
            }}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            <p className="mb-2 text-xs uppercase tracking-[0.18em]" style={{ color: "var(--primary-accent)" }}>
              President Dashboard
            </p>
            <h1 className="text-3xl font-black md:text-4xl">Stall Allocation</h1>
            <p className="mt-2 max-w-2xl" style={{ color: "var(--text-muted)" }}>
              Allocate and monitor 20 event stall spaces with conflict-safe assignment and map-based visibility.
            </p>
          </motion.div>
        </div>

        <main className="mx-auto w-full max-w-[1320px] flex-1 px-5 pb-8 sm:px-8">
          <div className="mb-8 grid gap-4 md:grid-cols-3">
            <MetricCard icon={<Store size={18} />} label="Total Stalls" value={metrics.total || 20} />
            <MetricCard icon={<LayoutGrid size={18} />} label="Reserved" value={metrics.reserved} />
            <MetricCard icon={<MapPinned size={18} />} label="Available" value={metrics.available || (metrics.total ? metrics.available : 20)} />
          </div>

          <div className="mb-6 rounded-3xl border p-5" style={{ borderColor: "var(--border-color)", backgroundColor: "var(--bg-card)" }}>
            <div className="grid gap-4 lg:grid-cols-4">
              <div className="relative">
                <Filter className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <select
                  value={selectedEventId}
                  onChange={(event) => handleEventChange(event.target.value)}
                  className="w-full rounded-2xl border py-3 pl-11 pr-4 text-sm outline-none transition focus:ring-2"
                  style={{ borderColor: "var(--border-color)", backgroundColor: "var(--bg-input)", color: "var(--text-main)" }}
                >
                  {events.map((event) => (
                    <option key={event.id} value={event.id}>
                      {event.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="relative">
                <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search vendor or stall number"
                  className="w-full rounded-2xl border py-3 pl-11 pr-4 text-sm outline-none transition focus:ring-2"
                  style={{ borderColor: "var(--border-color)", backgroundColor: "var(--bg-input)", color: "var(--text-main)" }}
                />
              </div>

              <div className="relative">
                <Filter className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <select
                  value={serviceFilter}
                  onChange={(event) => setServiceFilter(event.target.value)}
                  className="w-full rounded-2xl border py-3 pl-11 pr-4 text-sm outline-none transition focus:ring-2"
                  style={{ borderColor: "var(--border-color)", backgroundColor: "var(--bg-input)", color: "var(--text-main)" }}
                >
                  <option value="ALL">All Categories</option>
                  {serviceCategories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div className="relative">
                <Filter className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <select
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value)}
                  className="w-full rounded-2xl border py-3 pl-11 pr-4 text-sm outline-none transition focus:ring-2"
                  style={{ borderColor: "var(--border-color)", backgroundColor: "var(--bg-input)", color: "var(--text-main)" }}
                >
                  <option value="ALL">All Statuses</option>
                  <option value="RESERVED">Reserved</option>
                  <option value="AVAILABLE">Available</option>
                </select>
              </div>
            </div>

            <div className="mt-4 inline-flex overflow-hidden rounded-xl border" style={{ borderColor: "var(--border-color)" }}>
              <button
                type="button"
                onClick={() => setViewMode("list")}
                className="px-4 py-2 text-sm font-semibold"
                style={{
                  backgroundColor: viewMode === "list" ? "rgba(59,130,246,0.2)" : "transparent",
                  color: "var(--text-main)",
                }}
              >
                List View
              </button>
              <button
                type="button"
                onClick={() => setViewMode("map")}
                className="px-4 py-2 text-sm font-semibold"
                style={{
                  backgroundColor: viewMode === "map" ? "rgba(59,130,246,0.2)" : "transparent",
                  color: "var(--text-main)",
                }}
              >
                Map View
              </button>
            </div>
          </div>

          {viewMode === "list" ? (
            <StallAllocationTable stalls={stalls} loading={loading} onRelease={handleRelease} />
          ) : (
            <StallMapView stalls={stalls} loading={mapLoading} eventName={selectedEventName} />
          )}
        </main>
      </div>
    </div>
  );
};

const MetricCard = ({ icon, label, value }) => (
  <div
    className="rounded-3xl border p-5 shadow-[0_18px_42px_rgba(0,0,0,0.12)]"
    style={{ borderColor: "var(--border-color)", backgroundColor: "var(--bg-card)" }}
  >
    <div className="flex items-center gap-3 text-blue-300">
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

export default StallAllocation;
