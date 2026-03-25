import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  CheckCircle2,
  XCircle,
  Package,
  Calendar,
  User,
  MapPin,
} from "lucide-react";
import "./BookingApprovals.css";

const API_BASE_URL = "http://localhost:3000/api";

const BookingApprovals = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState("PENDING");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectModal, setShowRejectModal] = useState(false);

  useEffect(() => {
    fetchBookings();
    const interval = setInterval(fetchBookings, 20000);
    return () => clearInterval(interval);
  }, [statusFilter]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (statusFilter !== "ALL") params.append("status", statusFilter);

      const response = await axios.get(
        `${API_BASE_URL}/logistics/bookings?${params}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        },
      );
      setBookings(response.data.bookings);
    } catch (error) {
      console.error("Failed to fetch bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (bookingId) => {
    try {
      const token = localStorage.getItem("token");
      const userId = JSON.parse(atob(token.split(".")[1])).id;
      await axios.patch(
        `${API_BASE_URL}/logistics/bookings/${bookingId}/approve`,
        { approvedById: userId },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      alert("Booking approved successfully");
      fetchBookings();
    } catch (error) {
      console.error("Failed to approve booking:", error);
      alert("Error approving booking");
    }
  };

  const handleReject = async (bookingId) => {
    if (!rejectReason.trim()) {
      alert("Please provide a rejection reason");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `${API_BASE_URL}/logistics/bookings/${bookingId}/reject`,
        { rejectionReason: rejectReason },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      alert("Booking rejected successfully");
      setShowRejectModal(false);
      setRejectReason("");
      fetchBookings();
    } catch (error) {
      console.error("Failed to reject booking:", error);
      alert("Error rejecting booking");
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  const formatDate = (date) => new Date(date).toLocaleDateString();

  return (
    <div className="booking-approvals">
      <div className="approvals-header">
        <h2>Booking Request Approvals</h2>
        <div className="filter-section">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="status-filter"
          >
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
            <option value="ALL">All</option>
          </select>
        </div>
      </div>

      {/* Bookings List */}
      <motion.div
        className="bookings-grid"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {loading ? (
          <div className="loading-state">Loading bookings...</div>
        ) : bookings.length === 0 ? (
          <div className="empty-state">
            <p>No {statusFilter.toLowerCase()} bookings found</p>
          </div>
        ) : (
          bookings.map((booking) => (
            <motion.div
              key={booking.id}
              className="booking-card"
              variants={itemVariants}
              layout
            >
              <div className="booking-card-header">
                <div className="asset-info">
                  <Package className="icon" />
                  <div>
                    <h3>{booking.asset.name}</h3>
                    <p className="club-name">{booking.owningClub.name}</p>
                  </div>
                </div>
                <span
                  className={`status-badge ${booking.status.toLowerCase()}`}
                >
                  {booking.status}
                </span>
              </div>

              <div className="booking-details">
                <div className="detail-row">
                  <span className="label">Requested by:</span>
                  <span className="value">{booking.requestingClub.name}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Requester:</span>
                  <span className="value">
                    <User size={16} /> {booking.requester.name}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="label">Quantity:</span>
                  <span className="value">{booking.quantityRequested}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Duration:</span>
                  <span className="value">
                    <Calendar size={16} /> {formatDate(booking.startDate)} to{" "}
                    {formatDate(booking.endDate)}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="label">Purpose:</span>
                  <span className="value">{booking.purpose}</span>
                </div>
              </div>

              {booking.status === "PENDING" && (
                <div className="booking-actions">
                  <button
                    className="btn btn-approve"
                    onClick={() => handleApprove(booking.id)}
                  >
                    <CheckCircle2 size={16} /> Approve
                  </button>
                  <button
                    className="btn btn-reject"
                    onClick={() => {
                      setSelectedBooking(booking.id);
                      setShowRejectModal(true);
                    }}
                  >
                    <XCircle size={16} /> Reject
                  </button>
                </div>
              )}

              {booking.status === "REJECTED" && booking.rejectionReason && (
                <div className="rejection-note">
                  <p>
                    <strong>Reason:</strong> {booking.rejectionReason}
                  </p>
                </div>
              )}
            </motion.div>
          ))
        )}
      </motion.div>

      {/* Reject Modal */}
      <AnimatePresence>
        {showRejectModal && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="modal-content"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <h3>Reject Booking Request</h3>
              <p>Please provide a reason for rejection:</p>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Enter rejection reason..."
                className="reject-textarea"
              />
              <div className="modal-actions">
                <button
                  className="btn btn-cancel"
                  onClick={() => {
                    setShowRejectModal(false);
                    setRejectReason("");
                  }}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-confirm-reject"
                  onClick={() => {
                    handleReject(selectedBooking);
                  }}
                >
                  Confirm Rejection
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BookingApprovals;
