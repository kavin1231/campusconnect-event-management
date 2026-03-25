import { useState, useEffect } from "react";
import Sidebar from "../common/Sidebar";
import { logisticsAPI } from "../../services/api";

const ResourceAvailabilityEngine = () => {
  const [user, setUser] = useState(null);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [viewMode, setViewMode] = useState("timeline"); // timeline or calendar
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);

  const [newBooking, setNewBooking] = useState({
    assetId: null,
    club: "",
    startDate: "",
    endDate: "",
  });

  // Get user role from localStorage
  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        setUser(JSON.parse(userStr));
      } catch (error) {
        console.error("Error parsing user:", error);
      }
    }
  }, []);

  useEffect(() => {
    fetchAssets();
  }, []);

  const fetchAssets = async () => {
    setLoading(true);
    try {
      const data = await logisticsAPI.listAssets();
      if (data.success) {
        // Map assets to include bookings info from requests
        const assetsData = data.assets || [];
        setAssets(
          assetsData.map((asset) => ({
            ...asset,
            bookings: [],
          })),
        );
      }
    } catch (error) {
      console.error("Failed to fetch assets:", error);
    }
    setLoading(false);
  };

  const getAvailableSlots = (assetId, startDate, endDate) => {
    const asset = assets.find((a) => a.id === assetId);
    if (!asset) return true;

    const start = new Date(startDate);
    const end = new Date(endDate);

    return !asset.bookings.some((booking) => {
      const bookingStart = new Date(booking.startDate);
      const bookingEnd = new Date(booking.endDate);

      return (
        (start >= bookingStart && start <= bookingEnd) ||
        (end >= bookingStart && end <= bookingEnd) ||
        (start <= bookingStart && end >= bookingEnd)
      );
    });
  };

  const isSlotAvailable = getAvailableSlots(
    newBooking.assetId,
    newBooking.startDate,
    newBooking.endDate,
  );

  return (
    <div className="flex min-h-screen">
      <div className="flex-1">
        <div className="availability-engine bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 min-h-screen">
          {/* HEADER */}
          <header className="bg-gray-900 border-b border-gray-700 sticky top-0 z-40">
            <div className="px-8 py-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-rose-500 to-rose-600 rounded-lg flex items-center justify-center text-2xl">
                  🚫
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">
                    Resource Availability Engine
                  </h1>
                  <p className="text-gray-400 text-sm">
                    Prevent double bookings & manage schedules
                  </p>
                </div>
              </div>

              {/* VIEW MODE TOGGLE */}
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
                    {mode === "timeline" ? "📊 Timeline" : "📅 Calendar"}
                  </button>
                ))}
              </div>
            </div>
          </header>

          {/* MAIN CONTENT */}
          <div className="px-8 py-8 max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* LEFT SIDEBAR - ASSET SELECTION */}
              <div className="lg:col-span-1">
                <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 sticky top-28">
                  <h2 className="text-lg font-bold text-white mb-4">
                    📦 Assets
                  </h2>
                  <div className="space-y-2">
                    {assets.map((asset) => (
                      <button
                        key={asset.id}
                        onClick={() => setSelectedAsset(asset)}
                        className={`w-full text-left p-4 rounded-lg transition ${
                          selectedAsset?.id === asset.id
                            ? "bg-rose-600 text-white"
                            : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                        }`}
                      >
                        <p className="font-medium">{asset.name}</p>
                        <p className="text-xs mt-1">
                          {asset.bookings.length} booking
                          {asset.bookings.length !== 1 ? "s" : ""}
                        </p>
                      </button>
                    ))}
                  </div>

                  {/* BOOKING FORM */}
                  <div className="mt-6 pt-6 border-t border-gray-700">
                    <h3 className="text-sm font-bold text-white mb-3">
                      New Booking
                    </h3>
                    <div className="space-y-3">
                      <select
                        value={newBooking.assetId || ""}
                        onChange={(e) =>
                          setNewBooking({
                            ...newBooking,
                            assetId: parseInt(e.target.value) || null,
                          })
                        }
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:border-rose-500 outline-none transition"
                      >
                        <option value="">Select Asset</option>
                        {assets.map((asset) => (
                          <option key={asset.id} value={asset.id}>
                            {asset.name}
                          </option>
                        ))}
                      </select>

                      <input
                        type="date"
                        value={newBooking.startDate}
                        onChange={(e) =>
                          setNewBooking({
                            ...newBooking,
                            startDate: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:border-rose-500 outline-none transition"
                      />

                      <input
                        type="date"
                        value={newBooking.endDate}
                        onChange={(e) =>
                          setNewBooking({
                            ...newBooking,
                            endDate: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:border-rose-500 outline-none transition"
                      />

                      <input
                        type="text"
                        placeholder="Club name"
                        value={newBooking.club}
                        onChange={(e) =>
                          setNewBooking({ ...newBooking, club: e.target.value })
                        }
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 text-sm focus:border-rose-500 outline-none transition"
                      />

                      {newBooking.startDate && newBooking.endDate && (
                        <div
                          className={`p-3 rounded-lg text-sm font-medium ${
                            isSlotAvailable
                              ? "bg-green-500/20 text-green-400"
                              : "bg-red-500/20 text-red-400"
                          }`}
                        >
                          {isSlotAvailable
                            ? "✓ Slot Available"
                            : "✗ Slot Booked"}
                        </div>
                      )}

                      <button
                        disabled={!isSlotAvailable || !newBooking.club}
                        className="w-full py-2 bg-rose-600 hover:bg-rose-700 disabled:bg-gray-700 disabled:opacity-50 text-white rounded-lg font-medium transition"
                      >
                        Create Booking
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT CONTENT - BOOKINGS VIEW */}
              <div className="lg:col-span-3">
                {selectedAsset ? (
                  <div className="bg-gray-800 border border-gray-700 rounded-xl p-8">
                    <div className="mb-6">
                      <h2 className="text-2xl font-bold text-white mb-2">
                        {selectedAsset.name}
                      </h2>
                      <p className="text-gray-400">
                        Owner: {selectedAsset.owner}
                      </p>
                    </div>

                    {viewMode === "timeline" ? (
                      <TimelineView bookings={selectedAsset.bookings} />
                    ) : (
                      <CalendarView bookings={selectedAsset.bookings} />
                    )}

                    {/* BOOKINGS LIST */}
                    <div className="mt-8">
                      <h3 className="text-lg font-bold text-white mb-4">
                        📋 Bookings
                      </h3>
                      {selectedAsset.bookings.length === 0 ? (
                        <p className="text-gray-400">
                          No bookings for this asset
                        </p>
                      ) : (
                        <div className="space-y-3">
                          {selectedAsset.bookings.map((booking) => (
                            <BookingCard key={booking.id} booking={booking} />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-800 border border-gray-700 rounded-xl p-12 text-center">
                    <p className="text-gray-400 text-lg">
                      Select an asset to view bookings
                    </p>
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

const TimelineView = ({ bookings }) => {
  const months = ["Mar", "Apr", "May"];

  return (
    <div className="bg-gray-700 rounded-lg p-6 overflow-x-auto">
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((week) => (
          <div key={week} className="flex items-center gap-4">
            <span className="text-gray-400 text-sm font-medium w-20">
              Week {week}
            </span>
            <div className="flex-1 h-10 bg-gray-600 rounded relative overflow-hidden">
              {bookings.map((booking) => {
                const startDate = new Date(booking.startDate);
                const endDate = new Date(booking.endDate);
                const position = ((startDate.getDate() - 1) / 30) * 100;
                const width =
                  ((endDate.getDate() - startDate.getDate()) / 30) * 100 || 3;

                return (
                  <div
                    key={booking.id}
                    style={{
                      left: `${position}%`,
                      width: `${width}%`,
                    }}
                    className={`absolute h-full flex items-center px-2 text-xs text-white font-medium ${
                      booking.status === "approved"
                        ? "bg-green-500"
                        : "bg-yellow-500"
                    }`}
                  >
                    <span className="truncate">{booking.club}</span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const CalendarView = ({ bookings }) => {
  const daysInMonth = 31;
  const firstDay = 3; // March starts on Monday

  return (
    <div className="bg-gray-700 rounded-lg p-6">
      <div className="grid grid-cols-7 gap-2 mb-4">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
          <div
            key={day}
            className="text-center font-bold text-gray-300 text-sm p-2"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {Array.from({ length: firstDay + daysInMonth }).map((_, index) => {
          const date = index - firstDay + 1;
          if (date <= 0 || date > daysInMonth)
            return <div key={index} className="h-20"></div>;

          const dateStr = `2024-03-${String(date).padStart(2, "0")}`;
          const dayBookings = bookings.filter(
            (b) => b.startDate <= dateStr && b.endDate >= dateStr,
          );

          return (
            <div
              key={date}
              className={`h-20 p-2 rounded-lg border ${
                dayBookings.length > 0
                  ? "bg-rose-500/20 border-rose-500/50"
                  : "bg-gray-800 border-gray-600"
              }`}
            >
              <p className="text-white font-bold text-sm mb-1">{date}</p>
              {dayBookings.map((booking) => (
                <p key={booking.id} className="text-xs text-gray-300 truncate">
                  {booking.club}
                </p>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const BookingCard = ({ booking }) => (
  <div className="p-4 bg-gray-700 rounded-lg border border-gray-600 hover:border-rose-500/50 transition">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-white font-bold">{booking.club}</p>
        <p className="text-gray-400 text-sm">
          {booking.startDate} to {booking.endDate}
        </p>
      </div>
      <span
        className={`px-3 py-1 text-xs rounded-full font-medium ${
          booking.status === "approved"
            ? "bg-green-500/20 text-green-400"
            : "bg-yellow-500/20 text-yellow-400"
        }`}
      >
        {booking.status.toUpperCase()}
      </span>
    </div>
  </div>
);

export default ResourceAvailabilityEngine;
