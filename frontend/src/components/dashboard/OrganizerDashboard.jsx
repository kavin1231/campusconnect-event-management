import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../common/Sidebar";
import { useTheme } from "../../context/ThemeContext";
import { logisticsAPI, eventsAPI, resolveImageUrl } from "../../services/api";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowRight,
  Brain,
  Calendar,
  ClipboardCheck,
  Clock3,
  Building2,
  Package,
  Link,
  MapPin,
  ShieldCheck,
  Ticket,
  Truck,
  Moon,
  Sun,
} from "lucide-react";
import { CONFLICTS } from "../../constants/staticData";

const OrganizerDashboard = () => {
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme } = useTheme();
  const [user, setUser] = useState(null);
  const [requests, setRequests] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState([]);
  const [eventsLoading, setEventsLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");

    if (!token || !userStr) {
      navigate("/login");
      return;
    }

    try {
      const userData = JSON.parse(userStr);
      setUser(userData);
    } catch (e) {
      navigate("/login");
    }

    fetchStats();
    fetchEvents();
  }, [navigate]);

  const fetchEvents = async () => {
    try {
      setEventsLoading(true);
      const [publishedRes, ongoingRes] = await Promise.all([
        eventsAPI.listEvents({ status: "PUBLISHED" }),
        eventsAPI.listEvents({ status: "ONGOING" }),
      ]);

      const published = publishedRes?.events || [];
      const ongoing = ongoingRes?.events || [];
      const combined = [...published, ...ongoing].sort((a, b) =>
        new Date(a.date) - new Date(b.date),
      );
      setEvents(combined);
      setStats((prev) => ({
        ...(prev || {}),
        totalEvents: combined.length,
      }));
    } catch (error) {
      console.error("Failed to fetch events:", error);
      setEvents([]);
    } finally {
      setEventsLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      setLoading(true);
      const [assetsResponse, requestsResponse, linksResponse] = await Promise.all([
        logisticsAPI.listAssets(),
        logisticsAPI.listRequests(),
        import("../../services/api").then(m => m.groupLinksAPI.getAllLinks())
      ]);

      const assets = assetsResponse?.assets || [];
      const requestsData = requestsResponse?.requests || [];
      const linksData = linksResponse?.links || [];
      setRequests(requestsData);

      const availableAssets = assets.filter(
        (a) =>
          (a.status || "").toUpperCase() === "AVAILABLE" ||
          Number(a.availableQty || a.available || 0) > 0,
      ).length;
      const activeRequests = requestsData.filter(
        (r) => r.status === "pending",
      ).length;
      const inTransit = requestsData.filter(
        (r) => r.status === "checked_out",
      ).length;
      const overdueReturns = requestsData.filter(
        (r) =>
          r.status === "overdue" ||
          (r.dueDate && new Date(r.dueDate) < new Date()),
      ).length;

      setStats((prev) => ({
        ...(prev || {}),
        availableAssets,
        activeRequests,
        inTransit,
        overdueReturns,
        totalLinks: linksData.length,
        totalEvents: prev?.totalEvents ?? 0,
        activeConflicts: CONFLICTS.length,
      }));
    } catch (error) {
      console.error("Failed to fetch organizer stats:", error);
      setStats((prev) => ({
        ...(prev || {}),
        availableAssets: 0,
        activeRequests: 0,
        inTransit: 0,
        overdueReturns: 0,
        totalLinks: 0,
      }));
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <div className="p-10 text-white">Loading...</div>;

  const recent = requests.slice(0, 5);

  const formatEventDate = (value) => {
    if (!value) return "TBD";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "TBD";
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
  };

  const statusClass = (status) => {
    if (status === "overdue") return "text-red-300 border-red-500/30 bg-red-500/10";
    if (status === "pending") return "text-amber-300 border-amber-500/30 bg-amber-500/10";
    if (status === "checked_out") return "text-blue-300 border-blue-500/30 bg-blue-500/10";
    return "text-emerald-300 border-emerald-500/30 bg-emerald-500/10";
  };

  return (
    <div 
      className="min-h-screen flex"
      style={{
        backgroundColor: "var(--bg-darker)",
        color: "var(--text-main)"
      }}
    >
      <Sidebar isAdmin={true} />

      <div className="flex flex-col min-h-screen flex-1">
        <main className="flex-1 px-5 sm:px-8 pb-8 max-w-[1320px] mx-auto w-full">
          <motion.div
            className="rounded-3xl border p-6 shadow-[0_20px_50px_rgba(0,0,0,0.15)] mb-8"
            style={{
              borderColor: "var(--border-color)",
              background: isDarkMode 
                ? "linear-gradient(to right, rgba(99, 102, 241, 0.1), var(--bg-card))" 
                : "linear-gradient(to right, rgba(255, 107, 53, 0.05), var(--bg-nav))"
            }}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            <div className="flex justify-between items-start gap-4">
              <div>
                <p 
                  className="text-xs tracking-[0.18em] uppercase mb-2"
                  style={{ color: "var(--primary-accent)", opacity: 0.8 }}
                >
                  Organizer Workspace
                </p>
                <h1 
                  className="text-3xl md:text-4xl font-black mb-2"
                  style={{ color: "var(--text-main)" }}
                >
                  Event Organizer Dashboard
                </h1>
                <p 
                  className="max-w-2xl"
                  style={{ color: "var(--text-muted)" }}
                >
                  Manage event logistics, track inter-club asset sharing, and
                  monitor active requests.
                </p>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            {[
              {
                title: "Total Events",
                value: stats?.totalEvents || "0",
                icon: Ticket,
                color: "text-indigo-300",
                lightColor: "text-[#053668]",
                path: "/my-events"
              },
              {
                title: "Active Conflicts",
                value: stats?.activeConflicts || "0",
                icon: MapPin,
                color: "text-red-300",
                lightColor: "text-[#FF7100]",
                path: "/calendar"
              },
              {
                title: "Available Assets",
                value: stats?.availableAssets || "0",
                icon: Package,
                color: "text-emerald-300",
                lightColor: "text-[#053668]",
                path: "/logistics/assets"
              },
              {
                title: "Active Requests",
                value: stats?.activeRequests || "0",
                icon: ClipboardCheck,
                color: "text-blue-300",
                lightColor: "text-[#053668]",
                path: "/logistics/admin"
              },
              {
                title: "In Transit",
                value: stats?.inTransit || "0",
                icon: Truck,
                color: "text-amber-300",
                lightColor: "text-[#FF7100]",
                path: "/logistics/admin"
              },
            ].map((card, i) => (
              <motion.div
                key={i}
                className="rounded-2xl p-4 border transition cursor-pointer"
                style={{
                  borderColor: "var(--border-color)",
                  backgroundColor: "var(--bg-card)",
                }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.25, ease: "easeOut" }}
                whileHover={{ y: -3, boxShadow: "var(--sp-shadow-lg)" }}
                onClick={() => card.path && navigate(card.path)}
              >
                <div className="flex items-center gap-2" style={{ color: "var(--primary-accent)" }}>
                  <card.icon size={16} />
                  <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                    {card.title}
                  </p>
                </div>
                <p className="text-3xl font-black mt-2" style={{ color: "var(--text-main)" }}>
                  {loading ? "..." : card.value}
                </p>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="grid grid-cols-1 xl:grid-cols-3 gap-5"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12, duration: 0.3, ease: "easeOut" }}
          >
            <section className="xl:col-span-2 rounded-2xl border" style={{ borderColor: "var(--border-color)", backgroundColor: "var(--bg-card)" }}>
              <div className="px-5 py-4 border-b flex items-center justify-between" style={{ borderColor: "var(--border-color)" }}>
                <h2 className="text-sm uppercase tracking-[0.15em]" style={{ color: "var(--text-main)" }}>
                  Recent Requests
                </h2>
                <span className="text-xs" style={{ color: "var(--primary-accent)" }}>{recent.length} items</span>
              </div>

              <div className="divide-y" style={{ borderColor: "var(--border-color)" }}>
                {recent.length === 0 ? (
                  <div className="px-5 py-6" style={{ color: "var(--text-muted)" }}>No request activity yet.</div>
                ) : (
                  recent.map((r) => (
                    <motion.div
                      key={r.id}
                      className="px-5 py-4 flex items-center justify-between gap-3 transition"
                      whileHover={{ backgroundColor: "var(--bg-nav)" }}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                    >
                      <div>
                        <p className="font-semibold" style={{ color: "var(--text-main)" }}>{r.asset || "Unnamed Asset"}</p>
                        <p className="text-sm" style={{ color: "var(--text-muted)" }}>Needed: {r.neededDate || "-"} | Return: {r.returnDate || "-"}</p>
                      </div>
                      <span className={`px-2.5 py-1 rounded-full border text-xs uppercase font-semibold ${statusClass(r.status)}`}>
                        {(r.status || "pending").replaceAll("_", " ")}
                      </span>
                    </motion.div>
                  ))
                )}
              </div>
            </section>

            <div className="flex flex-col gap-5">
            <section className={`rounded-2xl border ${isDarkMode ? "border-slate-700/70 bg-[#111827]" : "border-[#FF7100]/30 bg-[#FFFFFF]"} p-5`}>
              <h2 className={`text-sm uppercase tracking-[0.15em] ${isDarkMode ? "text-slate-300" : "text-[#053668]"} mb-4`}>
                  Quick Operations
                </h2>
                <div className="grid grid-cols-1 gap-3">
                  <button 
                    onClick={() => navigate('/operations/stalls')}
                    className="flex items-center justify-between p-4 rounded-xl border border-indigo-500/20 bg-indigo-500/5 hover:bg-indigo-500/10 transition group text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400">
                        <Building2 size={20} />
                      </div>
                      <div>
                        <p className="font-bold text-white group-hover:text-indigo-300 transition">Stall Allocation</p>
                        <p className="text-xs text-slate-400">Allocate and track event stalls</p>
                      </div>
                    </div>
                    <ArrowRight size={18} className="text-slate-500 group-hover:text-white transition" />
                  </button>

                  <button 
                    onClick={() => navigate('/operations/sponsorships')}
                    className="flex items-center justify-between p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/10 transition group text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
                        <ShieldCheck size={20} />
                      </div>
                      <div>
                        <p className="font-bold text-white group-hover:text-emerald-300 transition">Sponsorship Pipeline</p>
                        <p className="text-xs text-slate-400">Track and manage event partners</p>
                      </div>
                    </div>
                    <ArrowRight size={18} className="text-slate-500 group-hover:text-white transition" />
                  </button>

                  <button 
                    onClick={() => navigate('/operations/vendors')}
                    className="flex items-center justify-between p-4 rounded-xl border border-amber-500/20 bg-amber-500/5 hover:bg-amber-500/10 transition group text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400">
                        <Truck size={20} />
                      </div>
                      <div>
                        <p className="font-bold text-white group-hover:text-amber-300 transition">Vendor Management</p>
                        <p className="text-xs text-slate-400">Handle external service providers</p>
                      </div>
                    </div>
                    <ArrowRight size={18} className="text-slate-500 group-hover:text-white transition" />
                  </button>

                  <button 
                    onClick={() => navigate('/operations/intelligence')}
                    className="flex items-center justify-between p-4 rounded-xl border border-purple-500/20 bg-purple-500/5 hover:bg-purple-500/10 transition group text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-purple-500/20 text-purple-400">
                        <Brain size={20} />
                      </div>
                      <div>
                        <p className="font-bold text-white group-hover:text-purple-300 transition">Intelligence Dashboard</p>
                        <p className="text-xs text-slate-400">Advanced event analytics & insights</p>
                      </div>
                    </div>
                    <ArrowRight size={18} className="text-slate-500 group-hover:text-white transition" />
                  </button>
                </div>
              </section>

              <section className={`rounded-2xl border ${isDarkMode ? "border-slate-700/70 bg-[#111827]" : "border-[#FF7100]/30 bg-[#FFFFFF]"} p-5`}>
                <h2 className={`text-sm uppercase tracking-[0.15em] ${isDarkMode ? "text-slate-300" : "text-[#053668]"} mb-4`}>
                  Event Operations
                </h2>
                <div className="grid grid-cols-1 gap-3">
                  <button 
                    onClick={() => navigate('/create-events')}
                    className="flex items-center justify-between p-4 rounded-xl border border-indigo-500/20 bg-indigo-500/5 hover:bg-indigo-500/10 transition group text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400">
                        <Ticket size={20} />
                      </div>
                      <div>
                        <p className="font-bold text-white group-hover:text-indigo-300 transition">New Event Request</p>
                        <p className="text-xs text-slate-400">Submit a new event for permission</p>
                      </div>
                    </div>
                    <ArrowRight size={18} className="text-slate-500 group-hover:text-white transition" />
                  </button>

                  <button 
                    onClick={() => navigate('/calendar')}
                    className="flex items-center justify-between p-4 rounded-xl border border-amber-500/20 bg-amber-500/5 hover:bg-amber-500/10 transition group text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400">
                        <Calendar size={20} />
                      </div>
                      <div>
                        <p className="font-bold text-white group-hover:text-amber-300 transition">Conflict Calendar</p>
                        <p className="text-xs text-slate-400">Check venue and date availability</p>
                      </div>
                    </div>
                    <ArrowRight size={18} className="text-slate-500 group-hover:text-white transition" />
                  </button>

                  <button 
                    onClick={() => navigate('/my-events')}
                    className="flex items-center justify-between p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/10 transition group text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
                        <ArrowRight size={20} />
                      </div>
                      <div>
                        <p className="font-bold text-white group-hover:text-emerald-300 transition">My Events</p>
                        <p className="text-xs text-slate-400">Track and manage your events</p>
                      </div>
                    </div>
                    <ArrowRight size={18} className="text-slate-500 group-hover:text-white transition" />
                  </button>
                </div>
              </section>

              <section className={`rounded-2xl border ${isDarkMode ? "border-slate-700/70 bg-[#111827]" : "border-[#FF7100]/30 bg-[#FFFFFF]"} p-5`}>
                <h2 className={`text-sm uppercase tracking-[0.15em] ${isDarkMode ? "text-slate-300" : "text-[#053668]"} mb-4`}>
                  Published & Ongoing Events
                </h2>
                <div className="space-y-3">
                  {eventsLoading ? (
                    <p className="text-xs text-slate-400">Loading events...</p>
                  ) : events.length === 0 ? (
                    <p className="text-xs text-slate-400">No published events yet.</p>
                  ) : (
                    events.slice(0, 3).map((ev) => (
                      <div key={ev.id} className={`p-3 rounded-xl border ${isDarkMode ? "border-slate-700/50 bg-slate-800/30" : "border-[#FF7100]/20 bg-[#F7ECB5]/10"}`}>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-700/30 flex-shrink-0">
                            <img
                              src={resolveImageUrl(ev.image)}
                              alt={ev.title}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.style.display = "none";
                              }}
                            />
                          </div>
                          <div className="flex-1">
                            <p className={`font-bold text-sm ${isDarkMode ? "text-white" : "text-[#053668]"}`}>{ev.title}</p>
                            <div className="flex items-center gap-3 mt-1.5">
                              <p className="text-[10px] text-slate-400 inline-flex items-center gap-1">
                                <Calendar size={10} /> {formatEventDate(ev.date)}
                              </p>
                              <p className="text-[10px] text-slate-400 inline-flex items-center gap-1">
                                <MapPin size={10} /> {ev.venue || "TBD"}
                              </p>
                            </div>
                          </div>
                          <span className={`text-[10px] font-bold px-2 py-1 rounded-full border ${isDarkMode ? "border-emerald-500/40 text-emerald-300" : "border-[#1B7F4B]/30 text-[#1B7F4B]"}`}>
                            {(ev.status || "PUBLISHED").toUpperCase()}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                  <button
                    onClick={() => navigate('/my-events')}
                    className={`w-full py-2 text-xs font-bold text-center rounded-lg border ${isDarkMode ? "border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/10" : "border-[#FF7100]/30 text-[#FF7100] hover:bg-[#FF7100]/10"} transition`}
                  >
                    View All Events
                  </button>
                </div>
              </section>
            </div>
          </motion.div>
        </main>

        <footer className="border-t py-5 text-center text-sm" style={{ borderColor: "var(--border-color)", backgroundColor: "var(--bg-darker)", color: "var(--text-muted)" }}>
          © 2026 NEXORA Event Management System
        </footer>
      </div>
    </div>
  );
};

export default OrganizerDashboard;
