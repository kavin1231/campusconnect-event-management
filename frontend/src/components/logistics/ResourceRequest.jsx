import { useState, useEffect } from "react";
import Sidebar from "../common/Sidebar";
import { logisticsAPI } from "../../services/api";
import { AnimatePresence, motion } from "framer-motion";
import { Search, SlidersHorizontal, Sparkles, Star } from "lucide-react";
import { FeedbackPanel, FeedbackToast } from "../common/FeedbackUI";

const ResourceRequest = () => {
  const [user, setUser] = useState(null);
  const [requestMode, setRequestMode] = useState("browse"); // browse or myRequests
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [availableAssets, setAvailableAssets] = useState([]);
  const [myRequests, setMyRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [toast, setToast] = useState(null);

  const [requestForm, setRequestForm] = useState({
    quantity: 1,
    neededDate: "",
    returnDate: "",
    purpose: "",
    contact: "",
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
    if (requestMode === "browse") {
      fetchAvailableAssets();
    } else {
      fetchMyRequests();
    }
  }, [requestMode]);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 2600);
    return () => clearTimeout(timer);
  }, [toast]);

  const showToast = (message, type = "info") => {
    setToast({ message, type });
  };

  const fetchAvailableAssets = async () => {
    setLoading(true);
    try {
      const data = await logisticsAPI.listAssets();
      if (data.success) {
        setErrorMsg("");
        setAvailableAssets(
          data.assets?.filter(
            (a) => Number(a.availableQty || a.available || 0) > 0,
          ) || [],
        );
      } else {
        setErrorMsg(data.message || "Unable to load available resources right now.");
      }
    } catch (error) {
      console.error("Failed to fetch available assets:", error);
      setErrorMsg("Unable to load available resources right now.");
    }
    setLoading(false);
  };

  const fetchMyRequests = async () => {
    setLoading(true);
    try {
      const data = await logisticsAPI.listRequests();
      if (data.success) {
        setErrorMsg("");
        setMyRequests(data.requests || []);
      } else {
        setErrorMsg(data.message || "Unable to load your requests right now.");
      }
    } catch (error) {
      console.error("Failed to fetch requests:", error);
      setErrorMsg("Unable to load your requests right now.");
    }
    setLoading(false);
  };

  const handleSubmitRequest = async () => {
    if (
      requestForm.quantity > 0 &&
      requestForm.neededDate &&
      requestForm.returnDate &&
      selectedAsset
    ) {
      try {
        const response = await logisticsAPI.requestAsset(selectedAsset.id, {
          quantity: parseInt(requestForm.quantity),
          neededDate: requestForm.neededDate,
          returnDate: requestForm.returnDate,
          purpose: requestForm.purpose,
          contact: requestForm.contact,
        });

        if (response.success) {
          setShowRequestModal(false);
          setRequestForm({
            quantity: 1,
            neededDate: "",
            returnDate: "",
            purpose: "",
            contact: "",
          });
          setSelectedAsset(null);
          setErrorMsg("");
          showToast("Request submitted successfully.", "success");
          fetchAvailableAssets();
        } else {
          showToast(response.message || "Failed to submit request.", "error");
        }
      } catch (error) {
        console.error("Failed to submit request:", error);
        showToast("Failed to submit request.", "error");
      }
    } else {
      showToast("Please fill in all required fields.", "warning");
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar isAdmin={true} />
      <div className="flex-1">
        <div className="resource-request bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 min-h-screen">
          <FeedbackToast toast={toast} onClose={() => setToast(null)} />

          {/* HEADER */}
          <motion.header
            className="bg-gray-900 border-b border-gray-700 sticky top-0 z-40"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <div className="px-8 py-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center text-2xl">
                  🔍
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">
                    Resource Requests
                  </h1>
                  <p className="text-gray-400 text-sm">
                    Browse & request resources from other clubs
                  </p>
                </div>
              </div>

              {/* MODE TOGGLE */}
              <div className="flex gap-2 border-b border-gray-700 mt-4">
                {["browse", "myRequests"].map((mode) => (
                  <motion.button
                    key={mode}
                    onClick={() => setRequestMode(mode)}
                    className={`px-6 py-3 font-semibold transition-all ${
                      requestMode === mode
                        ? "text-emerald-400 border-b-2 border-emerald-400"
                        : "text-gray-400 hover:text-gray-300"
                    }`}
                    whileTap={{ scale: 0.98 }}
                  >
                    {mode === "browse"
                      ? "🔍 Browse Resources"
                      : "📋 My Requests"}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.header>

          {/* MAIN CONTENT */}
          <div className="px-8 py-8 max-w-7xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={requestMode}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
              >
                {requestMode === "browse" ? (
                  <BrowseMode
                    assets={availableAssets}
                    loading={loading}
                    errorMsg={errorMsg}
                    onRetry={fetchAvailableAssets}
                    onRequest={(asset) => {
                      setSelectedAsset(asset);
                      setShowRequestModal(true);
                    }}
                  />
                ) : (
                  <MyRequestsMode
                    requests={myRequests}
                    loading={loading}
                    errorMsg={errorMsg}
                    onRetry={fetchMyRequests}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* REQUEST MODAL */}
          <AnimatePresence>
            {showRequestModal && selectedAsset && (
              <RequestModal
                asset={selectedAsset}
                form={requestForm}
                setForm={setRequestForm}
                onSubmit={handleSubmitRequest}
                onClose={() => {
                  setShowRequestModal(false);
                  setSelectedAsset(null);
                }}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

const BrowseMode = ({ assets, loading, errorMsg, onRetry, onRequest }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [priceRange, setPriceRange] = useState("all");
  const [availabilityFilter, setAvailabilityFilter] = useState("all");

  const getDailyRate = (asset) => {
    if (asset.pricePerDay) return Number(asset.pricePerDay);
    const value = Number(asset.value || 0);
    if (value > 0) return Math.max(20, Math.round(value * 0.025));
    return 35;
  };

  const filteredAssets = assets.filter((asset) => {
    const assetName = asset.name || "";
    const ownerName = (
      asset.owner?.name ||
      asset.owningClub?.name ||
      asset.club ||
      ""
    ).toString();
    const matchesSearch =
      assetName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ownerName.toLowerCase().includes(searchTerm.toLowerCase());
    const assetRate = getDailyRate(asset);
    const availableQty = Number(asset.availableQty || asset.available || 0);

    const matchesCategory =
      filterCategory === "all" || asset.category === filterCategory;
    const matchesAvailability =
      availabilityFilter === "all" ||
      (availabilityFilter === "available" && availableQty > 0) ||
      (availabilityFilter === "limited" && availableQty > 0 && availableQty < 3);
    const matchesPrice =
      priceRange === "all" ||
      (priceRange === "budget" && assetRate <= 50) ||
      (priceRange === "standard" && assetRate > 50 && assetRate <= 120) ||
      (priceRange === "premium" && assetRate > 120);

    return matchesSearch && matchesCategory && matchesAvailability && matchesPrice;
  });

  return (
    <div>
      {errorMsg && (
        <div className="mb-6">
          <FeedbackPanel
            type="error"
            title="Could not load resources"
            message={errorMsg}
            actionLabel="Try again"
            onAction={onRetry}
          />
        </div>
      )}

      <div className="mb-8 rounded-2xl border border-indigo-500/25 bg-gradient-to-r from-indigo-500/10 to-gray-900 p-5">
        <div className="flex items-center gap-2 mb-4 text-indigo-200">
          <Sparkles size={16} />
          <p className="text-xs uppercase tracking-[0.18em]">Marketplace Discovery</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
          <div className="lg:col-span-5 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
            <input
              type="text"
              placeholder="Search assets, clubs, or categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-indigo-500 outline-none transition"
            />
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="relative">
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:border-indigo-500 outline-none transition"
              >
                <option value="all">All Categories</option>
                <option value="Audio/Visual">Audio/Visual</option>
                <option value="Audio">Audio</option>
                <option value="Photography">Photography</option>
                <option value="Decoration">Decoration</option>
                <option value="Furniture">Furniture</option>
              </select>
            </div>

            <select
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:border-indigo-500 outline-none transition"
            >
              <option value="all">Any Price</option>
              <option value="budget">Budget ({"<="} $50/day)</option>
              <option value="standard">Standard ($51-$120/day)</option>
              <option value="premium">Premium ({">"}$120/day)</option>
            </select>

            <motion.button
              type="button"
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-gray-200 flex items-center justify-center gap-2"
              onClick={() =>
                setAvailabilityFilter((prev) =>
                  prev === "all"
                    ? "available"
                    : prev === "available"
                      ? "limited"
                      : "all",
                )
              }
              whileTap={{ scale: 0.98 }}
            >
              <SlidersHorizontal size={15} />
              {availabilityFilter === "all"
                ? "All Availability"
                : availabilityFilter === "available"
                  ? "Available Now"
                  : "Limited Stock"}
            </motion.button>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
          <span className="px-3 py-1 rounded-full bg-gray-800 border border-gray-700 text-gray-300">
            Showing <span className="text-white font-semibold">{filteredAssets.length}</span> result{filteredAssets.length !== 1 ? "s" : ""}
          </span>
          <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-300">
            {assets.filter((a) => Number(a.availableQty || a.available || 0) > 0).length} in stock
          </span>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, idx) => (
            <ResourceSkeleton key={idx} />
          ))}
        </div>
      ) : filteredAssets.length === 0 ? (
        <div className="bg-gray-800 border-2 border-dashed border-gray-700 rounded-xl p-12 text-center">
          <p className="text-gray-200 text-lg font-semibold">No matching resources</p>
          <p className="text-gray-500 text-sm mt-2">
            Try changing price, availability, or category filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAssets.map((asset) => (
            <ResourceCard
              key={asset.id}
              asset={asset}
              onRequest={() => onRequest(asset)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const ResourceCard = ({ asset, onRequest }) => {
  const [showImageGallery, setShowImageGallery] = useState(false);
  const dailyRate = asset.pricePerDay
    ? Number(asset.pricePerDay)
    : Math.max(20, Math.round(Number(asset.value || 1400) * 0.025));
  const rating = ((Number(asset.id || 1) % 5) + 3) / 2;
  const availability = Number(asset.availableQty || asset.available || 0);
  const displayImage =
    asset.thumbnail ||
    "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=900&q=80";

  return (
    <motion.div
      className="bg-gray-800 border border-gray-700 rounded-2xl overflow-hidden hover:border-indigo-400/60 hover:shadow-[0_20px_35px_rgba(0,0,0,0.35)] transition duration-300 group"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      {/* IMAGE SECTION */}
      <div
        className="relative bg-gray-900 aspect-video overflow-hidden cursor-pointer group"
        onClick={() => setShowImageGallery(true)}
      >
        <img
          src={displayImage}
          alt={asset.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[11px] font-semibold border bg-black/45 backdrop-blur border-white/15 text-white">
          {availability > 4 ? "In Stock" : availability > 0 ? "Limited" : "Out"}
        </div>

        {asset.images && asset.images.length > 0 && (
          <div className="absolute top-3 right-3 bg-black/70 text-white px-3 py-1 rounded-full text-xs font-semibold backdrop-blur">
            📸 {asset.images.length} photos
          </div>
        )}

        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
          <span className="text-white text-sm font-semibold">View Gallery</span>
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-2">
          <h3 className="text-lg font-bold text-white leading-tight">
            {asset.name || "Unnamed"}
          </h3>
          <p className="text-base font-extrabold text-indigo-300 whitespace-nowrap">
            ${dailyRate}/day
          </p>
        </div>

        <p className="text-gray-400 text-sm mb-2">
          From {asset.owner?.name || asset.owningClub?.name || asset.club || "Unknown"}
        </p>

        <div className="flex items-center gap-1 mb-3 text-amber-300">
          <Star size={14} fill="currentColor" />
          <span className="text-sm font-semibold">{rating.toFixed(1)}</span>
          <span className="text-xs text-gray-500">(market rating)</span>
        </div>

        <p className="text-gray-300 text-sm mb-4 line-clamp-2 min-h-[40px]">
          {asset.description || "No description available"}
        </p>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-gray-700 rounded-lg p-3">
            <p className="text-gray-400 text-xs mb-1">Availability</p>
            <p className="text-emerald-400 font-bold">
              {availability}
            </p>
          </div>
          <div className="bg-gray-700 rounded-lg p-3">
            <p className="text-gray-400 text-xs mb-1">Category</p>
            <p className="text-white text-sm font-medium">
              {asset.category || "—"}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4 text-sm">
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              String(asset.condition || "").toLowerCase() === "excellent"
                ? "bg-green-500/20 text-green-400"
                : "bg-yellow-500/20 text-yellow-400"
            }`}
          >
            {asset.condition || "good"}
          </span>
        </div>

        <motion.button
          onClick={onRequest}
          className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold transition group-hover:shadow-lg"
          whileTap={{ scale: 0.98 }}
        >
          Request Resource
        </motion.button>
      </div>

      {/* IMAGE GALLERY MODAL */}
      <AnimatePresence>
        {showImageGallery && (
          <ImageGalleryModal
            asset={asset}
            onClose={() => setShowImageGallery(false)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const MyRequestsMode = ({ requests, loading, errorMsg, onRetry }) => (
  <div className="space-y-4">
    {errorMsg ? (
      <FeedbackPanel
        type="error"
        title="Could not load requests"
        message={errorMsg}
        actionLabel="Try again"
        onAction={onRetry}
      />
    ) : loading ? (
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-12 text-center">
        <p className="text-gray-400 text-lg">Loading your requests...</p>
      </div>
    ) : requests.length === 0 ? (
      <div className="bg-gray-800 border-2 border-dashed border-gray-700 rounded-xl p-12 text-center">
        <p className="text-gray-400 text-lg">No requests yet</p>
      </div>
    ) : (
      requests.map((request) => (
        <div
          key={request.id}
          className="bg-gray-800 border border-gray-700 rounded-xl p-6 hover:border-gray-600 transition"
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-white">
                {request.asset?.name || "Unknown Asset"}
              </h3>
              <p className="text-gray-400 text-sm">
                From: {request.owner?.name || request.club?.name || "Unknown"}
              </p>
            </div>
            <span
              className={`px-4 py-2 text-sm rounded-full font-medium ${
                request.status === "approved" ||
                request.status === "checked_out"
                  ? "bg-green-500/20 text-green-400"
                  : "bg-yellow-500/20 text-yellow-400"
              }`}
            >
              {request.status
                ? request.status.replace(/_/g, " ").toUpperCase()
                : "PENDING"}
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <RequestDetail label="Quantity" value={request.quantity || "—"} />
            <RequestDetail
              label="Needed"
              value={request.neededDate || request.startDate || "—"}
            />
            <RequestDetail
              label="Return"
              value={request.returnDate || request.endDate || "—"}
            />
            <RequestDetail
              label="Requested"
              value={request.requestDate || request.createdAt || "—"}
            />
          </div>

          {request.status === "pending" && (
            <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
              <p className="text-yellow-300 text-sm">
                ⏳ Awaiting approval from{" "}
                {request.owner?.name || request.club?.name || "owner"}
              </p>
            </div>
          )}

          {(request.status === "approved" ||
            request.status === "checked_out") && (
            <div className="mt-4 flex gap-2">
              <button className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition">
                View Checkout Details
              </button>
              <button className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm transition">
                Cancel Request
              </button>
            </div>
          )}
        </div>
      ))
    )}
  </div>
);

const RequestDetail = ({ label, value }) => (
  <div>
    <p className="text-gray-400 text-xs font-medium mb-1">{label}</p>
    <p className="text-white font-medium">{value}</p>
  </div>
);

const RequestModal = ({ asset, form, setForm, onSubmit, onClose }) => (
  <motion.div
    className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.2 }}
  >
    <motion.div
      className="bg-gray-800 border border-gray-700 rounded-xl max-w-md w-full p-8"
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 14, scale: 0.98 }}
      transition={{ duration: 0.24, ease: "easeOut" }}
    >
      <h2 className="text-2xl font-bold text-white mb-2">Request Resource</h2>
      <p className="text-gray-400 mb-6">
        {asset.name} from {asset.owner?.name || asset.owningClub?.name || asset.club || "Unknown"}
      </p>

      <div className="space-y-4">
        <div>
          <label className="block text-gray-300 font-medium mb-2">
            Quantity *
          </label>
          <input
            type="number"
            min="1"
            max={asset.availableQty || asset.available || 1}
            value={form.quantity}
            onChange={(e) =>
              setForm({ ...form, quantity: parseInt(e.target.value) || 1 })
            }
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-emerald-500 outline-none transition"
          />
          <p className="text-gray-400 text-xs mt-1">
            Max available: {asset.availableQty || asset.available || 0}
          </p>
        </div>

        <div>
          <label className="block text-gray-300 font-medium mb-2">
            Needed Date *
          </label>
          <input
            type="date"
            value={form.neededDate}
            onChange={(e) => setForm({ ...form, neededDate: e.target.value })}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-emerald-500 outline-none transition"
          />
        </div>

        <div>
          <label className="block text-gray-300 font-medium mb-2">
            Return Date *
          </label>
          <input
            type="date"
            value={form.returnDate}
            onChange={(e) => setForm({ ...form, returnDate: e.target.value })}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-emerald-500 outline-none transition"
          />
        </div>

        <div>
          <label className="block text-gray-300 font-medium mb-2">
            Purpose
          </label>
          <textarea
            placeholder="Describe how you'll use this resource..."
            value={form.purpose}
            onChange={(e) => setForm({ ...form, purpose: e.target.value })}
            rows={3}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:border-emerald-500 outline-none transition resize-none"
          ></textarea>
        </div>

        <div>
          <label className="block text-gray-300 font-medium mb-2">
            Contact Info *
          </label>
          <input
            type="text"
            placeholder="Your phone or email"
            value={form.contact}
            onChange={(e) => setForm({ ...form, contact: e.target.value })}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:border-emerald-500 outline-none transition"
          />
        </div>
      </div>

      <div className="flex gap-3 mt-8">
        <motion.button
          onClick={onClose}
          className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-semibold transition"
          whileTap={{ scale: 0.98 }}
        >
          Cancel
        </motion.button>
        <motion.button
          onClick={onSubmit}
          className="flex-1 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold transition"
          whileTap={{ scale: 0.98 }}
        >
          Submit Request
        </motion.button>
      </div>
    </motion.div>
  </motion.div>
);

const ImageGalleryModal = ({ asset, onClose }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = asset.images || [];
  const displayImages =
    images.length > 0 ? images : asset.thumbnail ? [asset.thumbnail] : [];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % displayImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + displayImages.length) % displayImages.length,
    );
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <motion.div
        className="bg-gray-900 border border-gray-700 rounded-2xl max-w-3xl w-full overflow-hidden"
        initial={{ opacity: 0, y: 18, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 12, scale: 0.98 }}
        transition={{ duration: 0.24, ease: "easeOut" }}
      >
        {/* MAIN IMAGE */}
        <div className="relative bg-black aspect-video flex items-center justify-center overflow-hidden">
          {displayImages.length > 0 ? (
            <>
              <img
                src={displayImages[currentImageIndex]}
                alt={`${asset.name} - ${currentImageIndex + 1}`}
                className="w-full h-full object-contain"
              />
              {/* NAVIGATION ARROWS */}
              {displayImages.length > 1 && (
                <>
                  <motion.button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition z-10"
                    whileTap={{ scale: 0.95 }}
                  >
                    ◀
                  </motion.button>
                  <motion.button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition z-10"
                    whileTap={{ scale: 0.95 }}
                  >
                    ▶
                  </motion.button>
                  {/* IMAGE COUNTER */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-full text-sm font-semibold backdrop-blur">
                    {currentImageIndex + 1} / {displayImages.length}
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="text-gray-500 text-center">
              <span className="text-6xl block mb-4">📸</span>
              <p>No images available</p>
            </div>
          )}
        </div>

        {/* ASSET INFO */}
        <div className="p-6 border-t border-gray-700">
          <div className="mb-4">
            <h3 className="text-2xl font-bold text-white mb-2">{asset.name}</h3>
            <p className="text-gray-400">{asset.description}</p>
          </div>

          {/* THUMBNAILS GRID */}
          {displayImages.length > 1 && (
            <div className="mb-6">
              <p className="text-gray-400 text-sm mb-3">All photos:</p>
              <div className="grid grid-cols-4 gap-3 max-h-24 overflow-y-auto">
                {displayImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`relative rounded-lg overflow-hidden border-2 transition ${
                      currentImageIndex === idx
                        ? "border-emerald-500"
                        : "border-gray-600 hover:border-gray-500"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`Thumbnail ${idx + 1}`}
                      className="w-full h-16 object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ASSET DETAILS */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div>
              <p className="text-gray-400 text-xs mb-1">Quantity Available</p>
              <p className="text-white font-bold text-lg">{asset.availableQty || asset.available || 0}</p>
            </div>
            <div>
              <p className="text-gray-400 text-xs mb-1">Category</p>
              <p className="text-white font-bold">{asset.category}</p>
            </div>
            <div>
              <p className="text-gray-400 text-xs mb-1">Condition</p>
              <span
                className={`px-2 py-1 rounded text-xs font-semibold ${
                  asset.condition === "excellent"
                    ? "bg-green-500/20 text-green-400"
                    : "bg-yellow-500/20 text-yellow-400"
                }`}
              >
                {asset.condition}
              </span>
            </div>
            <div>
              <p className="text-gray-400 text-xs mb-1">From Club</p>
              <p className="text-white font-bold">{asset.owner?.name || asset.owningClub?.name || asset.club || "Unknown"}</p>
            </div>
          </div>

          {/* CLOSE BUTTON */}
          <motion.button
            onClick={onClose}
            className="w-full py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-semibold transition"
            whileTap={{ scale: 0.98 }}
          >
            Close Gallery
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

const ResourceSkeleton = () => (
  <div className="rounded-2xl border border-gray-700 bg-gray-800 overflow-hidden animate-pulse">
    <div className="h-44 bg-gray-700/60" />
    <div className="p-5 space-y-3">
      <div className="h-4 w-2/3 bg-gray-700 rounded" />
      <div className="h-3 w-1/2 bg-gray-700 rounded" />
      <div className="h-3 w-full bg-gray-700 rounded" />
      <div className="h-10 w-full bg-gray-700 rounded-xl mt-4" />
    </div>
  </div>
);

export default ResourceRequest;
