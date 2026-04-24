import { useEffect, useMemo, useState } from "react";
import Sidebar from "../common/Sidebar";
import { logisticsAPI } from "../../services/api";
import { FeedbackPanel } from "../common/FeedbackUI";

const formatDate = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toISOString().split("T")[0];
};

const normalizeStatus = (value) =>
  String(value || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_");

const isActiveBookingStatus = (status) =>
  ["approved", "checked_out", "overdue"].includes(normalizeStatus(status));

const ResourceAvailabilityEngine = () => {
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [viewMode, setViewMode] = useState("timeline");
  const [assets, setAssets] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    fetchAssetsAndRequests();
  }, []);

  const fetchAssetsAndRequests = async () => {
    setLoading(true);
    try {
      const [assetsData, requestsData] = await Promise.all([
        logisticsAPI.listAssets(),
        logisticsAPI.listRequests(),
      ]);

      if (!assetsData.success || !requestsData.success) {
        throw new Error(
          assetsData.message || requestsData.message || "Failed to load data",
        );
      }

      const loadedAssets = assetsData.assets || [];
      setAssets(loadedAssets);
      setRequests(requestsData.requests || []);
      setErrorMsg("");

      if (!selectedAsset && loadedAssets.length > 0) {
        setSelectedAsset(loadedAssets[0]);
      }
    } catch (error) {
      console.error("Failed to fetch availability data:", error);
      setErrorMsg(error.message || "Unable to load availability data right now.");
    } finally {
      setLoading(false);
    }
  };

  const normalizedRequests = useMemo(
    () =>
      requests.map((request) => ({
        ...request,
        status: normalizeStatus(request.status),
        assetId: request.assetDetails?.id,
        assetName: request.assetDetails?.name || request.asset || "Resource Item",
        borrower:
          request.ownerDetails?.name || request.owner || request.club || "Organizer",
        clubName: request.club || "General",
        startDate: request.startDate || request.neededDate,
        endDate: request.endDate || request.returnDate,
      })),
    [requests],
  );

  const selectedAssetBookings = useMemo(() => {
    if (!selectedAsset) return [];
    return normalizedRequests.filter(
      (request) => request.assetId === selectedAsset.id && request.startDate && request.endDate,
    );
  }, [normalizedRequests, selectedAsset]);

  const activeBookings = useMemo(
    () => selectedAssetBookings.filter((booking) => isActiveBookingStatus(booking.status)),
    [selectedAssetBookings],
  );

  const modeBookings = useMemo(() => {
    if (viewMode === "timeline") return selectedAssetBookings;
    return selectedAssetBookings;
  }, [selectedAssetBookings, viewMode]);

  const selectedAssetSummary = useMemo(() => {
    if (!selectedAsset) {
      return {
        totalQty: 0,
        availableQty: 0,
        activeCount: 0,
      };
    }

    return {
      totalQty: Number(selectedAsset.quantity || 0),
      availableQty: Number(selectedAsset.availableQty || selectedAsset.available || 0),
      activeCount: activeBookings.length,
    };
  }, [selectedAsset, activeBookings]);

  return (
    <div className="flex min-h-screen">
      <Sidebar isAdmin={true} />
      <div className="flex-1">
        <div className="availability-engine bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 min-h-screen">
          <header className="bg-gray-900 border-b border-gray-700 sticky top-0 z-40">
            <div className="px-8 py-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-rose-500 to-rose-600 rounded-lg flex items-center justify-center text-2xl">
                  ⚙️
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">Resource Availability Engine</h1>
                  <p className="text-gray-400 text-sm">Real-time conflict detection and booking insights</p>
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                {["timeline", "calendar"].map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setViewMode(mode)}
                    className={`px-6 py-2 rounded-lg font-medium transition ${
                      viewMode === mode
                        ? "bg-rose-600 text-white"
                        : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    }`}
                  >
                    {mode === "timeline" ? "Timeline" : "Calendar"}
                  </button>
                ))}
              </div>
            </div>
          </header>

          <div className="px-8 py-8 max-w-7xl mx-auto">
            {errorMsg && (
              <div className="mb-6">
                <FeedbackPanel
                  type="error"
                  title="Could not load availability data"
                  message={errorMsg}
                  actionLabel="Try again"
                  onAction={fetchAssetsAndRequests}
                />
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              <div className="lg:col-span-1">
                <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 sticky top-28">
                  <h2 className="text-lg font-bold text-white mb-4">Assets</h2>
                  <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                    {loading ? (
                      <div className="space-y-2">
                        {Array.from({ length: 5 }).map((_, idx) => (
                          <div key={idx} className="h-14 rounded-lg bg-gray-700/70 animate-pulse" />
                        ))}
                      </div>
                    ) : assets.length === 0 ? (
                      <FeedbackPanel
                        type="info"
                        title="No assets available"
                        message="Add assets to begin availability scheduling."
                      />
                    ) : (
                      assets.map((asset) => (
                        <button
                          key={asset.id}
                          onClick={() => setSelectedAsset(asset)}
                          className={`w-full text-left p-4 rounded-lg transition ${
                            selectedAsset?.id === asset.id
                              ? "bg-rose-600 text-white"
                              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                          }`}
                        >
                          <p className="font-medium">{asset.name || "Unnamed"}</p>
                          <p className="text-xs mt-1">
                            {asset.availableQty || asset.available || 0}/{asset.quantity || 0} available
                          </p>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              </div>

              <div className="lg:col-span-3">
                {loading ? (
                  <div className="bg-gray-800 border border-gray-700 rounded-xl p-12 text-center">
                    <p className="text-gray-400 text-lg">Loading availability timeline...</p>
                  </div>
                ) : selectedAsset ? (
                  <div className="bg-gray-800 border border-gray-700 rounded-xl p-8">
                    <div className="mb-6 flex flex-wrap gap-4 items-start justify-between">
                      <div>
                        <h2 className="text-2xl font-bold text-white mb-2">{selectedAsset.name || "Unnamed"}</h2>
                        <p className="text-gray-400 text-sm">
                          Owner: {selectedAsset.owner?.name || selectedAsset.club || "General"}
                        </p>
                      </div>
                      <div className="grid grid-cols-3 gap-3 min-w-[320px]">
                        <StatPill label="Total" value={selectedAssetSummary.totalQty} />
                        <StatPill label="Available" value={selectedAssetSummary.availableQty} tone="green" />
                        <StatPill label="Active" value={selectedAssetSummary.activeCount} tone="blue" />
                      </div>
                    </div>

                    {viewMode === "timeline" ? (
                      <TimelineView bookings={modeBookings} />
                    ) : (
                      <CalendarView bookings={modeBookings} />
                    )}

                    <div className="mt-8">
                      <h3 className="text-lg font-bold text-white mb-4">Bookings</h3>
                      {modeBookings.length === 0 ? (
                        <p className="text-gray-400">No bookings for this asset</p>
                      ) : (
                        <div className="space-y-3">
                          {modeBookings
                            .sort((a, b) => new Date(b.startDate) - new Date(a.startDate))
                            .map((booking) => (
                              <BookingCard key={booking.id} booking={booking} />
                            ))}
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-800 border border-gray-700 rounded-xl p-12 text-center">
                    <p className="text-gray-400 text-lg">Select an asset to view availability details</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatPill = ({ label, value, tone = "default" }) => {
  const toneClass =
    tone === "green"
      ? "text-emerald-300 border-emerald-500/30 bg-emerald-500/10"
      : tone === "blue"
        ? "text-blue-300 border-blue-500/30 bg-blue-500/10"
        : "text-white border-gray-600 bg-gray-700/60";

  return (
    <div className={`rounded-lg border px-3 py-2 ${toneClass}`}>
      <p className="text-[11px] uppercase tracking-wide opacity-80">{label}</p>
      <p className="text-lg font-bold leading-tight">{value}</p>
    </div>
  );
};

const TimelineView = ({ bookings }) => {
  if (bookings.length === 0) {
    return (
      <div className="bg-gray-700 rounded-lg p-6 text-center text-gray-400">
        No booking timeline data available
      </div>
    );
  }

  const sorted = [...bookings].sort(
    (a, b) => new Date(a.startDate) - new Date(b.startDate),
  );

  const minDate = new Date(sorted[0].startDate);
  const maxDate = new Date(
    sorted.reduce(
      (latest, booking) =>
        new Date(booking.endDate) > latest ? new Date(booking.endDate) : latest,
      new Date(sorted[0].endDate),
    ),
  );

  const totalDays = Math.max(
    1,
    Math.ceil((maxDate - minDate) / (1000 * 60 * 60 * 24)),
  );

  return (
    <div className="bg-gray-700 rounded-lg p-6 space-y-3">
      {sorted.map((booking) => {
        const start = new Date(booking.startDate);
        const end = new Date(booking.endDate);
        const offsetDays = Math.max(
          0,
          Math.ceil((start - minDate) / (1000 * 60 * 60 * 24)),
        );
        const durationDays = Math.max(
          1,
          Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1,
        );

        const left = (offsetDays / totalDays) * 100;
        const width = (durationDays / totalDays) * 100;

        return (
          <div key={booking.id}>
            <div className="flex items-center justify-between mb-1 text-xs text-gray-300">
              <span>{booking.borrower}</span>
              <span>
                {formatDate(booking.startDate)} to {formatDate(booking.endDate)}
              </span>
            </div>
            <div className="h-6 bg-gray-800 rounded relative overflow-hidden">
              <div
                className={`absolute h-full rounded ${
                  booking.status === "returned"
                    ? "bg-emerald-500"
                    : booking.status === "overdue"
                      ? "bg-red-500"
                      : "bg-rose-500"
                }`}
                style={{ left: `${left}%`, width: `${Math.min(width, 100)}%` }}
                title={`${booking.borrower} (${booking.quantityRequested || booking.quantity || 1})`}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

const CalendarView = ({ bookings }) => {
  const now = new Date();
  const [visibleMonth, setVisibleMonth] = useState(
    new Date(now.getFullYear(), now.getMonth(), 1),
  );
  const [selectedDateKey, setSelectedDateKey] = useState(null);

  const year = visibleMonth.getFullYear();
  const month = visibleMonth.getMonth();
  const firstDay = new Date(year, month, 1);
  const startOffset = (firstDay.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthLabel = visibleMonth.toLocaleDateString(undefined, {
    month: "long",
    year: "numeric",
  });

  const dateToKey = (day) =>
    `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

  const getBookingsForDateKey = (key) =>
    bookings.filter((booking) => {
      if (!booking.startDate || !booking.endDate) return false;
      return booking.startDate <= key && booking.endDate >= key;
    });

  const bookingCountForDay = (day) => {
    const key = dateToKey(day);
    return getBookingsForDateKey(key).length;
  };

  const selectedDayBookings = useMemo(() => {
    if (!selectedDateKey) return [];
    return getBookingsForDateKey(selectedDateKey).sort(
      (a, b) => new Date(a.startDate) - new Date(b.startDate),
    );
  }, [bookings, selectedDateKey]);

  const goToPreviousMonth = () => {
    setVisibleMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
    setSelectedDateKey(null);
  };

  const goToNextMonth = () => {
    setVisibleMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
    setSelectedDateKey(null);
  };

  const goToCurrentMonth = () => {
    setVisibleMonth(new Date(now.getFullYear(), now.getMonth(), 1));
    setSelectedDateKey(null);
  };

  return (
    <div className="bg-gray-700 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4 gap-2">
        <h4 className="text-white font-semibold text-sm">{monthLabel}</h4>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={goToPreviousMonth}
            className="px-3 py-1 rounded-md bg-gray-800 border border-gray-600 text-gray-200 text-xs hover:bg-gray-750"
          >
            Previous
          </button>
          <button
            type="button"
            onClick={goToCurrentMonth}
            className="px-3 py-1 rounded-md bg-gray-800 border border-gray-600 text-gray-200 text-xs hover:bg-gray-750"
          >
            Current
          </button>
          <button
            type="button"
            onClick={goToNextMonth}
            className="px-3 py-1 rounded-md bg-gray-800 border border-gray-600 text-gray-200 text-xs hover:bg-gray-750"
          >
            Next
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2 mb-3">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
          <div key={day} className="text-center text-gray-300 text-xs font-bold">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {Array.from({ length: startOffset }).map((_, idx) => (
          <div key={`blank-${idx}`} className="h-16" />
        ))}

        {Array.from({ length: daysInMonth }, (_, index) => {
          const day = index + 1;
          const dayKey = dateToKey(day);
          const count = bookingCountForDay(day);
          const isSelected = selectedDateKey === dayKey;
          const isToday =
            dayKey ===
            `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(
              now.getDate(),
            ).padStart(2, "0")}`;

          return (
            <button
              type="button"
              key={day}
              onClick={() => setSelectedDateKey(dayKey)}
              className={`h-16 rounded-lg border p-2 ${
                isSelected
                  ? "bg-rose-500/35 border-rose-400"
                  : count > 0
                  ? "bg-rose-500/20 border-rose-500/40"
                  : "bg-gray-800 border-gray-600"
              }`}
            >
              <p className={`text-xs font-semibold ${isToday ? "text-rose-300" : "text-white"}`}>
                {day}
              </p>
              {count > 0 && (
                <p className="text-[11px] text-rose-200 mt-1">{count} booking{count > 1 ? "s" : ""}</p>
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-4 border-t border-gray-600 pt-4">
        <h5 className="text-sm text-white font-semibold mb-2">
          {selectedDateKey ? `Bookings on ${selectedDateKey}` : "Select a day to view bookings"}
        </h5>

        {selectedDateKey && selectedDayBookings.length === 0 && (
          <p className="text-xs text-gray-300">No bookings on this day.</p>
        )}

        {selectedDayBookings.length > 0 && (
          <div className="space-y-2">
            {selectedDayBookings.map((booking) => (
              <div
                key={`day-${selectedDateKey}-${booking.id}`}
                className="rounded-md border border-gray-600 bg-gray-800 px-3 py-2"
              >
                <p className="text-sm text-white font-medium">{booking.borrower}</p>
                <p className="text-xs text-gray-300">
                  {formatDate(booking.startDate)} to {formatDate(booking.endDate)} | Qty {booking.quantityRequested || booking.quantity || 1}
                </p>
                <p className="text-xs text-gray-400 mt-1 uppercase">
                  {booking.status.replace(/_/g, " ")}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const BookingCard = ({ booking }) => (
  <div className="p-4 bg-gray-700 rounded-lg border border-gray-600 hover:border-rose-500/50 transition">
    <div className="flex items-start justify-between gap-3">
      <div>
        <p className="text-white font-bold">{booking.borrower}</p>
        <p className="text-gray-300 text-sm mt-1">
          {formatDate(booking.startDate)} to {formatDate(booking.endDate)}
        </p>
        <p className="text-gray-400 text-xs mt-1">
          Qty: {booking.quantityRequested || booking.quantity || 1}
          {booking.clubName ? ` | Club: ${booking.clubName}` : ""}
        </p>
      </div>
      <span
        className={`px-3 py-1 text-xs rounded-full font-medium uppercase ${
          booking.status === "returned"
            ? "bg-emerald-500/20 text-emerald-300"
            : booking.status === "overdue"
              ? "bg-red-500/20 text-red-300"
              : "bg-yellow-500/20 text-yellow-300"
        }`}
      >
        {booking.status.replace(/_/g, " ")}
      </span>
    </div>
  </div>
);

export default ResourceAvailabilityEngine;
