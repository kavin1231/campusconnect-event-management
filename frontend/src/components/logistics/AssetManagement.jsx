import { useState, useEffect } from "react";
import { logisticsAPI } from "../../services/api";

const SummaryCard = ({ label, value, icon }) => (
  <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-400 text-sm font-medium mb-1">{label}</p>
        <p className="text-3xl font-bold text-white">{value}</p>
      </div>
      <div className="text-4xl opacity-30">{icon}</div>
    </div>
  </div>
);

const AssetCard = ({ asset, onEdit, onDelete }) => (
  <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 hover:border-gray-600 transition group">
    <div className="flex items-start justify-between mb-4">
      <div>
        <h3 className="text-lg font-bold text-white">{asset.name}</h3>
        <p className="text-gray-400 text-sm">{asset.category}</p>
      </div>
      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition">
        <button
          onClick={onEdit}
          className="p-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded"
        >
          ✏️
        </button>
        <button
          onClick={onDelete}
          className="p-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded"
        >
          🗑️
        </button>
      </div>
    </div>

    <p className="text-gray-300 text-sm mb-4 line-clamp-2">
      {asset.description}
    </p>

    <div className="grid grid-cols-2 gap-3 mb-4">
      <div className="bg-gray-700 rounded-lg p-3">
        <p className="text-gray-400 text-xs mb-1">Quantity</p>
        <p className="text-white font-bold">{asset.quantity}</p>
      </div>
      <div className="bg-gray-700 rounded-lg p-3">
        <p className="text-gray-400 text-xs mb-1">Available</p>
        <p className="text-green-400 font-bold">{asset.available}</p>
      </div>
    </div>

    <div className="flex items-center justify-between mb-3">
      <span
        className={`px-3 py-1 text-xs rounded-full font-medium ${
          asset.condition === "excellent"
            ? "bg-green-500/20 text-green-400"
            : "bg-yellow-500/20 text-yellow-400"
        }`}
      >
        {asset.condition}
      </span>
      <span className="text-gray-400 text-xs">
        Last maintenance: {asset.lastMaintenance}
      </span>
    </div>

    <button className="w-full py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg text-sm transition">
      View Requests
    </button>
  </div>
);

const AssetManagement = () => {
  const [user, setUser] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [clubAssets, setClubAssets] = useState([]);
  const [loading, setLoading] = useState(true);

  const [newAsset, setNewAsset] = useState({
    name: "",
    category: "Audio/Visual",
    quantity: 1,
    description: "",
    condition: "excellent",
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
        setClubAssets(data.assets || []);
      }
    } catch (error) {
      console.error("Failed to fetch assets:", error);
    }
    setLoading(false);
  };

  const handleAddAsset = async () => {
    if (newAsset.name && newAsset.quantity > 0) {
      try {
        const response = await logisticsAPI.createAsset({
          ...newAsset,
          quantity: parseInt(newAsset.quantity),
        });

        if (response.success) {
          fetchAssets();
          setNewAsset({
            name: "",
            category: "Audio/Visual",
            quantity: 1,
            description: "",
            condition: "excellent",
          });
          setShowAddModal(false);
          alert("✅ Asset created successfully!");
        }
      } catch (error) {
        console.error("Failed to create asset:", error);
        alert("Failed to create asset");
      }
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className="flex-1">
        <div className="asset-management bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 min-h-screen">
          {/* HEADER */}
          <header className="bg-gray-900 border-b border-gray-700 sticky top-0 z-40">
            <div className="px-8 py-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-lg flex items-center justify-center text-2xl">
                    📝
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-white">My Assets</h1>
                    <p className="text-gray-400 text-sm">
                      Manage resources available for sharing
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="px-6 py-2 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold rounded-lg transition"
                >
                  + Add Asset
                </button>
              </div>
            </div>
          </header>

          {/* MAIN CONTENT */}
          <div className="px-8 py-8 max-w-7xl mx-auto">
            {/* SUMMARY CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <SummaryCard
                label="Total Assets"
                value={clubAssets.length}
                icon="📦"
              />
              <SummaryCard
                label="Total Items"
                value={clubAssets.reduce((sum, a) => sum + a.quantity, 0)}
                icon="📊"
              />
              <SummaryCard
                label="Available"
                value={clubAssets.reduce((sum, a) => sum + a.available, 0)}
                icon="✓"
              />
              <SummaryCard
                label="Checked Out"
                value={clubAssets.reduce(
                  (sum, a) => sum + (a.quantity - a.available),
                  0,
                )}
                icon="🔄"
              />
            </div>

            {/* ASSETS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {clubAssets.map((asset) => (
                <AssetCard
                  key={asset.id}
                  asset={asset}
                  onEdit={() => {}}
                  onDelete={() => {}}
                />
              ))}
            </div>

            {clubAssets.length === 0 && (
              <div className="bg-gray-800 border-2 border-dashed border-gray-700 rounded-xl p-12 text-center">
                <p className="text-gray-400 text-lg mb-4">
                  No assets added yet
                </p>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg font-semibold transition"
                >
                  Start Adding Assets
                </button>
              </div>
            )}
          </div>

          {/* ADD ASSET MODAL */}
          {showAddModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-gray-800 border border-gray-700 rounded-xl max-w-md w-full p-8">
                <h2 className="text-2xl font-bold text-white mb-6">
                  Add New Asset
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-300 font-medium mb-2">
                      Asset Name *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Projector, Speaker System"
                      value={newAsset.name}
                      onChange={(e) =>
                        setNewAsset({ ...newAsset, name: e.target.value })
                      }
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:border-cyan-500 outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 font-medium mb-2">
                      Category *
                    </label>
                    <select
                      value={newAsset.category}
                      onChange={(e) =>
                        setNewAsset({ ...newAsset, category: e.target.value })
                      }
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-cyan-500 outline-none transition"
                    >
                      <option>Audio/Visual</option>
                      <option>Audio</option>
                      <option>Photography</option>
                      <option>Decoration</option>
                      <option>Furniture</option>
                      <option>Other</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-300 font-medium mb-2">
                        Quantity *
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={newAsset.quantity}
                        onChange={(e) =>
                          setNewAsset({
                            ...newAsset,
                            quantity: parseInt(e.target.value) || 1,
                          })
                        }
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-cyan-500 outline-none transition"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-300 font-medium mb-2">
                        Condition *
                      </label>
                      <select
                        value={newAsset.condition}
                        onChange={(e) =>
                          setNewAsset({
                            ...newAsset,
                            condition: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-cyan-500 outline-none transition"
                      >
                        <option>Excellent</option>
                        <option>Good</option>
                        <option>Fair</option>
                        <option>Poor</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-300 font-medium mb-2">
                      Description
                    </label>
                    <textarea
                      placeholder="Describe your asset..."
                      value={newAsset.description}
                      onChange={(e) =>
                        setNewAsset({
                          ...newAsset,
                          description: e.target.value,
                        })
                      }
                      rows={3}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:border-cyan-500 outline-none transition resize-none"
                    ></textarea>
                  </div>
                </div>

                <div className="flex gap-3 mt-8">
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-semibold transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddAsset}
                    className="flex-1 px-4 py-3 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg font-semibold transition"
                  >
                    Add Asset
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssetManagement;
