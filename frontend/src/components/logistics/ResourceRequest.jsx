import { useState, useEffect } from "react";
import { logisticsAPI } from "../../services/api";

const ResourceRequest = () => {
  const [user, setUser] = useState(null);
  const [requestMode, setRequestMode] = useState("browse"); // browse or myRequests
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [availableAssets, setAvailableAssets] = useState([]);
  const [myRequests, setMyRequests] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const fetchAvailableAssets = async () => {
    setLoading(true);
    try {
      const data = await logisticsAPI.listAssets();
      if (data.success) {
        setAvailableAssets(data.assets?.filter((a) => a.available > 0) || []);
      }
    } catch (error) {
      console.error("Failed to fetch available assets:", error);
    }
    setLoading(false);
  };

  const fetchMyRequests = async () => {
    setLoading(true);
    try {
      const data = await logisticsAPI.listRequests();
      if (data.success) {
        setMyRequests(data.requests || []);
      }
    } catch (error) {
      console.error("Failed to fetch requests:", error);
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
          alert("Request submitted successfully!");
          fetchAvailableAssets();
        }
      } catch (error) {
        console.error("Failed to submit request:", error);
        alert("Failed to submit request");
      }
    } else {
      alert("Please fill in all required fields");
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className="flex-1">
        <div className="resource-request bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 min-h-screen">
          {/* HEADER */}
          <header className="bg-gray-900 border-b border-gray-700 sticky top-0 z-40">
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
                  <button
                    key={mode}
                    onClick={() => setRequestMode(mode)}
                    className={`px-6 py-3 font-semibold transition-all ${
                      requestMode === mode
                        ? "text-emerald-400 border-b-2 border-emerald-400"
                        : "text-gray-400 hover:text-gray-300"
                    }`}
                  >
                    {mode === "browse"
                      ? "🔍 Browse Resources"
                      : "📋 My Requests"}
                  </button>
                ))}
              </div>
            </div>
          </header>

          {/* MAIN CONTENT */}
          <div className="px-8 py-8 max-w-7xl mx-auto">
            {requestMode === "browse" ? (
              <BrowseMode
                assets={availableAssets}
                onRequest={(asset) => {
                  setSelectedAsset(asset);
                  setShowRequestModal(true);
                }}
              />
            ) : (
              <MyRequestsMode requests={myRequests} />
            )}
          </div>

          {/* REQUEST MODAL */}
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
        </div>
      </div>
    </div>
  );
};

const BrowseMode = ({ assets, onRequest }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");

  const filteredAssets = assets.filter((asset) => {
    const matchesSearch =
      asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.owner.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      filterCategory === "all" || asset.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div>
      {/* SEARCH & FILTER */}
      <div className="mb-8 space-y-4">
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Search assets or clubs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-6 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-emerald-500 outline-none transition"
          />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-6 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-emerald-500 outline-none transition"
          >
            <option value="all">All Categories</option>
            <option value="Audio/Visual">Audio/Visual</option>
            <option value="Audio">Audio</option>
            <option value="Photography">Photography</option>
            <option value="Decoration">Decoration</option>
            <option value="Furniture">Furniture</option>
          </select>
        </div>

        {/* AVAILABILITY STATUS */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
          <p className="text-gray-400 text-sm">
            💡 Showing{" "}
            <span className="text-white font-bold">
              {filteredAssets.length}
            </span>{" "}
            available resource{filteredAssets.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* ASSETS GRID */}
      {filteredAssets.length === 0 ? (
        <div className="bg-gray-800 border-2 border-dashed border-gray-700 rounded-xl p-12 text-center">
          <p className="text-gray-400 text-lg">No resources found</p>
          <p className="text-gray-500 text-sm mt-2">
            Try adjusting your search or filters
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

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden hover:border-emerald-500/50 transition group">
      {/* IMAGE SECTION */}
      <div
        className="relative bg-gray-900 aspect-video overflow-hidden cursor-pointer group"
        onClick={() => setShowImageGallery(true)}
      >
        {asset.thumbnail ? (
          <img
            src={asset.thumbnail}
            alt={asset.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
            <span className="text-4xl text-gray-700">🖼️</span>
          </div>
        )}
        {/* IMAGE GALLERY BADGE */}
        {asset.images && asset.images.length > 0 && (
          <div className="absolute top-3 right-3 bg-black/70 text-white px-3 py-1 rounded-full text-xs font-semibold backdrop-blur">
            📸 {asset.images.length} photos
          </div>
        )}
        {/* HOVER OVERLAY */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
          <span className="text-white text-sm font-semibold">View Gallery</span>
        </div>
      </div>

      {/* HEADER */}
      <div className="bg-gradient-to-r from-emerald-500/10 to-emerald-600/10 p-4 border-b border-gray-700">
        <h3 className="text-lg font-bold text-white mb-1">{asset.name}</h3>
        <p className="text-gray-400 text-sm">From: {asset.owner}</p>
      </div>

      {/* CONTENT */}
      <div className="p-4">
        <p className="text-gray-300 text-sm mb-4 line-clamp-2">
          {asset.description}
        </p>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-gray-700 rounded-lg p-3">
            <p className="text-gray-400 text-xs mb-1">Available</p>
            <p className="text-emerald-400 font-bold">{asset.available}</p>
          </div>
          <div className="bg-gray-700 rounded-lg p-3">
            <p className="text-gray-400 text-xs mb-1">Category</p>
            <p className="text-white text-sm font-medium">{asset.category}</p>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4 text-sm">
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              asset.condition === "excellent"
                ? "bg-green-500/20 text-green-400"
                : "bg-yellow-500/20 text-yellow-400"
            }`}
          >
            {asset.condition}
          </span>
          <span className="text-gray-400 text-xs">
            Available until {asset.lastAvailable}
          </span>
        </div>

        <button
          onClick={onRequest}
          className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold transition group-hover:shadow-lg"
        >
          📦 Request Resource
        </button>
      </div>

      {/* IMAGE GALLERY MODAL */}
      {showImageGallery && (
        <ImageGalleryModal
          asset={asset}
          onClose={() => setShowImageGallery(false)}
        />
      )}
    </div>
  );
};

const MyRequestsMode = ({ requests }) => (
  <div className="space-y-4">
    {requests.length === 0 ? (
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
              <h3 className="text-lg font-bold text-white">{request.asset}</h3>
              <p className="text-gray-400 text-sm">From: {request.owner}</p>
            </div>
            <span
              className={`px-4 py-2 text-sm rounded-full font-medium ${
                request.status === "approved"
                  ? "bg-green-500/20 text-green-400"
                  : "bg-yellow-500/20 text-yellow-400"
              }`}
            >
              {request.status.toUpperCase()}
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <RequestDetail label="Quantity" value={request.quantity} />
            <RequestDetail label="Needed" value={request.neededDate} />
            <RequestDetail label="Return" value={request.returnDate} />
            <RequestDetail label="Requested" value={request.requestDate} />
          </div>

          {request.status === "pending" && (
            <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
              <p className="text-yellow-300 text-sm">
                ⏳ Awaiting approval from {request.owner}
              </p>
            </div>
          )}

          {request.status === "approved" && (
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
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <div className="bg-gray-800 border border-gray-700 rounded-xl max-w-md w-full p-8">
      <h2 className="text-2xl font-bold text-white mb-2">Request Resource</h2>
      <p className="text-gray-400 mb-6">
        {asset.name} from {asset.owner}
      </p>

      <div className="space-y-4">
        <div>
          <label className="block text-gray-300 font-medium mb-2">
            Quantity *
          </label>
          <input
            type="number"
            min="1"
            max={asset.available}
            value={form.quantity}
            onChange={(e) =>
              setForm({ ...form, quantity: parseInt(e.target.value) || 1 })
            }
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-emerald-500 outline-none transition"
          />
          <p className="text-gray-400 text-xs mt-1">
            Max available: {asset.available}
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
        <button
          onClick={onClose}
          className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-semibold transition"
        >
          Cancel
        </button>
        <button
          onClick={onSubmit}
          className="flex-1 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold transition"
        >
          Submit Request
        </button>
      </div>
    </div>
  </div>
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
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl max-w-3xl w-full overflow-hidden">
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
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition z-10"
                  >
                    ◀
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition z-10"
                  >
                    ▶
                  </button>
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
              <p className="text-white font-bold text-lg">{asset.available}</p>
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
              <p className="text-white font-bold">{asset.owner}</p>
            </div>
          </div>

          {/* CLOSE BUTTON */}
          <button
            onClick={onClose}
            className="w-full py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-semibold transition"
          >
            Close Gallery
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResourceRequest;
