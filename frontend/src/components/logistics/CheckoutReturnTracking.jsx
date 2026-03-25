import { useState, useEffect } from "react";
import Sidebar from "../common/Sidebar";
import { logisticsAPI } from "../../services/api";

const CheckoutReturnTracking = () => {
  const [user, setUser] = useState(null);
  const [mode, setMode] = useState("active"); // active, history, overdue
  const [checkouts, setCheckouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCheckout, setSelectedCheckout] = useState(null);
  const [showReturnModal, setShowReturnModal] = useState(false);

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
    fetchCheckouts();
  }, []);

  const fetchCheckouts = async () => {
    setLoading(true);
    try {
      const data = await logisticsAPI.listRequests();
      if (data.success) {
        setCheckouts(data.requests || []);
      }
    } catch (error) {
      console.error("Failed to fetch checkouts:", error);
    }
    setLoading(false);
  };

  const filteredCheckouts = checkouts.filter((c) => {
    if (mode === "active") return ["active", "overdue"].includes(c.status);
    if (mode === "history") return c.status === "returned";
    if (mode === "overdue") return c.status === "overdue";
  });

  const getDaysRemaining = (dueDate) => {
    const due = new Date(dueDate);
    const today = new Date();
    const diff = Math.ceil((due - today) / (1000 * 60 * 60 * 24));
    return diff;
  };

  return (
    <div className="flex min-h-screen">
      <div className="flex-1">
        <div className="checkout-return bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 min-h-screen">
          {/* HEADER */}
          <header className="bg-gray-900 border-b border-gray-700 sticky top-0 z-40">
            <div className="px-8 py-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-2xl">
                  🔄
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">
                    Checkout & Returns
                  </h1>
                  <p className="text-gray-400 text-sm">
                    Track resource borrowing & returns
                  </p>
                </div>
              </div>

              {/* MODE TABS */}
              <div className="flex gap-2 border-b border-gray-700 mt-4">
                {[
                  {
                    id: "active",
                    label: "📦 Active Checkouts",
                    icon: "active",
                  },
                  { id: "overdue", label: "⚠️ Overdue", icon: "overdue" },
                  { id: "history", label: "✓ History", icon: "history" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setMode(tab.id)}
                    className={`px-6 py-3 font-semibold transition-all ${
                      mode === tab.id
                        ? "text-blue-400 border-b-2 border-blue-400"
                        : "text-gray-400 hover:text-gray-300"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </header>

          {/* MAIN CONTENT */}
          <div className="px-8 py-8 max-w-7xl mx-auto">
            {/* STATS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <StatBox
                label="Active Checkouts"
                value={checkouts.filter((c) => c.status === "active").length}
                color="blue"
                icon="📦"
              />
              <StatBox
                label="Overdue Items"
                value={checkouts.filter((c) => c.status === "overdue").length}
                color="red"
                icon="⚠️"
              />
              <StatBox
                label="Returned This Month"
                value={checkouts.filter((c) => c.status === "returned").length}
                color="green"
                icon="✓"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* LIST VIEW */}
              <div className="lg:col-span-2">
                {filteredCheckouts.length === 0 ? (
                  <div className="bg-gray-800 border-2 border-dashed border-gray-700 rounded-xl p-12 text-center">
                    <p className="text-gray-400 text-lg">No {mode} checkouts</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredCheckouts.map((checkout) => (
                      <CheckoutItem
                        key={checkout.id}
                        checkout={checkout}
                        isSelected={selectedCheckout?.id === checkout.id}
                        onSelect={() => setSelectedCheckout(checkout)}
                        daysRemaining={getDaysRemaining(checkout.dueDate)}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* DETAIL PANEL */}
              <div className="lg:col-span-1">
                {selectedCheckout ? (
                  <div className="bg-gray-800 border border-gray-700 rounded-xl p-8 sticky top-28">
                    <h2 className="text-xl font-bold text-white mb-6">
                      Details
                    </h2>

                    <div className="space-y-4 mb-6">
                      <DetailField
                        label="Asset"
                        value={selectedCheckout.asset}
                      />
                      <DetailField
                        label="Borrower Club"
                        value={selectedCheckout.club}
                      />
                      <DetailField
                        label="Contact"
                        value={selectedCheckout.borrowerContact}
                      />
                      <DetailField
                        label="Checked Out"
                        value={selectedCheckout.checkedOutDate}
                      />
                      <DetailField
                        label="Due Date"
                        value={selectedCheckout.dueDate}
                      />

                      {selectedCheckout.status === "returned" && (
                        <DetailField
                          label="Returned"
                          value={selectedCheckout.returnedDate}
                        />
                      )}

                      <div>
                        <p className="text-gray-400 text-sm font-medium mb-2">
                          Condition
                        </p>
                        <span
                          className={`px-3 py-1 text-sm rounded-full font-medium ${
                            selectedCheckout.condition === "excellent"
                              ? "bg-green-500/20 text-green-400"
                              : "bg-yellow-500/20 text-yellow-400"
                          }`}
                        >
                          {selectedCheckout.condition}
                        </span>
                      </div>

                      {selectedCheckout.notes && (
                        <div>
                          <p className="text-gray-400 text-sm font-medium mb-2">
                            Notes
                          </p>
                          <p className="text-gray-300 text-sm bg-gray-700 p-3 rounded">
                            {selectedCheckout.notes}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* ACTION BUTTONS */}
                    {selectedCheckout.status !== "returned" && (
                      <div className="space-y-2">
                        {selectedCheckout.status === "overdue" && (
                          <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg mb-3">
                            <p className="text-red-400 text-sm font-medium">
                              🔴 This item is overdue. Contact the borrower
                              immediately.
                            </p>
                          </div>
                        )}

                        <button
                          onClick={() => setShowReturnModal(true)}
                          className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition"
                        >
                          ✓ Process Return
                        </button>

                        {selectedCheckout.status === "overdue" && (
                          <button className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition">
                            📞 Send Reminder
                          </button>
                        )}
                      </div>
                    )}

                    {selectedCheckout.status === "returned" && (
                      <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                        <p className="text-green-400 text-sm font-medium">
                          ✓ Successfully Returned
                        </p>
                        <p className="text-green-200 text-xs mt-1">
                          Returned on {selectedCheckout.returnedDate}
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-gray-800 border border-gray-700 rounded-xl p-8 text-center sticky top-28">
                    <p className="text-gray-400">
                      Select a checkout to view details
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RETURN MODAL */}
          {showReturnModal && selectedCheckout && (
            <ReturnModal
              checkout={selectedCheckout}
              onClose={() => setShowReturnModal(false)}
              onSubmit={() => {
                alert("Return processed successfully!");
                setShowReturnModal(false);
                setSelectedCheckout(null);
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

const StatBox = ({ label, value, color, icon }) => {
  const colors = {
    blue: "bg-blue-500/20 text-blue-400",
    red: "bg-red-500/20 text-red-400",
    green: "bg-green-500/20 text-green-400",
  };

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm font-medium mb-1">{label}</p>
          <p className="text-3xl font-bold text-white">{value}</p>
        </div>
        <div className={`text-4xl opacity-30 ${colors[color]}`}>{icon}</div>
      </div>
    </div>
  );
};

const CheckoutItem = ({ checkout, isSelected, onSelect, daysRemaining }) => {
  const getStatusColor = () => {
    if (checkout.status === "overdue") return "from-red-500 to-red-600";
    if (checkout.status === "active") {
      if (daysRemaining <= 2) return "from-yellow-500 to-yellow-600";
      return "from-blue-500 to-blue-600";
    }
    return "from-green-500 to-green-600";
  };

  return (
    <div
      onClick={onSelect}
      className={`p-6 bg-gray-800 border-2 rounded-xl cursor-pointer transition ${
        isSelected ? "border-blue-500" : "border-gray-700 hover:border-gray-600"
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-lg font-bold text-white">{checkout.asset}</h3>
          <p className="text-gray-400 text-sm">Borrowed by: {checkout.club}</p>
        </div>
        <span
          className={`px-3 py-1 text-sm rounded-full font-medium text-white bg-gradient-to-r ${getStatusColor()}`}
        >
          {checkout.status === "returned"
            ? "✓ Returned"
            : checkout.status === "overdue"
              ? "⚠️ Overdue"
              : "📦 Active"}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-3 text-sm mb-3">
        <div>
          <p className="text-gray-500 text-xs">Checked Out</p>
          <p className="text-white font-medium">{checkout.checkedOutDate}</p>
        </div>
        <div>
          <p className="text-gray-500 text-xs">Due Date</p>
          <p className="text-white font-medium">{checkout.dueDate}</p>
        </div>
        <div>
          <p className="text-gray-500 text-xs">Days Remaining</p>
          <p
            className={`font-medium ${
              checkout.status === "returned"
                ? "text-green-400"
                : checkout.status === "overdue"
                  ? "text-red-400"
                  : "text-white"
            }`}
          >
            {checkout.status === "returned"
              ? "—"
              : checkout.status === "overdue"
                ? "Overdue"
                : getDaysRemaining(checkout.dueDate) + " days"}
          </p>
        </div>
      </div>

      <div className="h-1 bg-gray-700 rounded-full overflow-hidden">
        <div
          className={`h-full bg-gradient-to-r ${getStatusColor()}`}
          style={{
            width: checkout.status === "returned" ? "100%" : "60%",
          }}
        ></div>
      </div>
    </div>
  );
};

const DetailField = ({ label, value }) => (
  <div>
    <p className="text-gray-400 text-sm font-medium mb-1">{label}</p>
    <p className="text-white font-medium">{value}</p>
  </div>
);

const getDaysRemaining = (dueDate) => {
  const due = new Date(dueDate);
  const today = new Date();
  const diff = Math.ceil((due - today) / (1000 * 60 * 60 * 24));
  return diff;
};

const ReturnModal = ({ checkout, onClose, onSubmit }) => {
  const [returnData, setReturnData] = useState({
    condition: "excellent",
    damageReport: "",
    notes: "",
    penalty: 0,
  });

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 border border-gray-700 rounded-xl max-w-md w-full p-8">
        <h2 className="text-2xl font-bold text-white mb-2">Process Return</h2>
        <p className="text-gray-400 mb-6">{checkout.asset}</p>

        <div className="space-y-4">
          <div>
            <label className="block text-gray-300 font-medium mb-2">
              Return Condition *
            </label>
            <select
              value={returnData.condition}
              onChange={(e) =>
                setReturnData({ ...returnData, condition: e.target.value })
              }
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-500 outline-none transition"
            >
              <option value="excellent">Excellent - No damage</option>
              <option value="good">Good - Minor wear</option>
              <option value="fair">Fair - Visible damage</option>
              <option value="poor">Poor - Major damage</option>
            </select>
          </div>

          {returnData.condition !== "excellent" &&
            returnData.condition !== "good" && (
              <div>
                <label className="block text-gray-300 font-medium mb-2">
                  Damage Report
                </label>
                <textarea
                  placeholder="Describe the damage..."
                  value={returnData.damageReport}
                  onChange={(e) =>
                    setReturnData({
                      ...returnData,
                      damageReport: e.target.value,
                    })
                  }
                  rows={3}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:border-blue-500 outline-none transition resize-none"
                ></textarea>
              </div>
            )}

          {returnData.condition === "poor" && (
            <div>
              <label className="block text-gray-300 font-medium mb-2">
                Penalty Amount (₹)
              </label>
              <input
                type="number"
                value={returnData.penalty}
                onChange={(e) =>
                  setReturnData({
                    ...returnData,
                    penalty: parseInt(e.target.value) || 0,
                  })
                }
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-500 outline-none transition"
              />
            </div>
          )}

          <div>
            <label className="block text-gray-300 font-medium mb-2">
              Additional Notes
            </label>
            <textarea
              placeholder="Any other notes..."
              value={returnData.notes}
              onChange={(e) =>
                setReturnData({ ...returnData, notes: e.target.value })
              }
              rows={2}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:border-blue-500 outline-none transition resize-none"
            ></textarea>
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
            className="flex-1 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition"
          >
            Confirm Return
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutReturnTracking;
