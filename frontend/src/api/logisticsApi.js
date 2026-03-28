import axios from "axios";

const API_BASE_URL = "http://localhost:3000/api/logistics";

// Configure axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Error handling interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

// ========== CLUB APIs ==========

export const clubAPI = {
  getAllClubs: (params = {}) => apiClient.get("/clubs", { params }),

  getClubById: (clubId) => apiClient.get(`/clubs/${clubId}`),

  createClub: (clubData) => apiClient.post("/clubs", clubData),

  updateClub: (clubId, clubData) =>
    apiClient.patch(`/clubs/${clubId}`, clubData),
};

// ========== ASSET APIs ==========

export const assetAPI = {
  getAllAssets: (params = {}) => apiClient.get("/assets", { params }),

  createAsset: (assetData) => apiClient.post("/assets", assetData),

  updateAsset: (assetId, assetData) =>
    apiClient.patch(`/assets/${assetId}`, assetData),

  deleteAsset: (assetId) => apiClient.delete(`/assets/${assetId}`),

  checkAvailability: (assetId, startDate, endDate, quantityNeeded = 1) =>
    apiClient.post("/availability/check", {
      assetId,
      startDate,
      endDate,
      quantityNeeded,
    }),
};

// ========== BOOKING APIs ==========

export const bookingAPI = {
  createBooking: (bookingData) => apiClient.post("/bookings", bookingData),

  getAllBookings: (params = {}) => apiClient.get("/bookings", { params }),

  approveBooking: (bookingId, approvedById) =>
    apiClient.patch(`/bookings/${bookingId}/approve`, { approvedById }),

  rejectBooking: (bookingId, rejectionReason) =>
    apiClient.patch(`/bookings/${bookingId}/reject`, { rejectionReason }),

  checkoutAsset: (bookingId) =>
    apiClient.patch(`/bookings/${bookingId}/checkout`),

  returnAsset: (bookingId, approvedReturnBy) =>
    apiClient.patch(`/bookings/${bookingId}/return`, { approvedReturnBy }),
};

// ========== DAMAGE REPORT APIs ==========

export const damageReportAPI = {
  reportDamage: (damageData) => apiClient.post("/damage-reports", damageData),

  getDamageReports: (params = {}) =>
    apiClient.get("/damage-reports", { params }),

  approveDamageReport: (reportId, approvalData) =>
    apiClient.patch(`/damage-reports/${reportId}/approve`, approvalData),

  rejectDamageReport: (reportId, rejectionData) =>
    apiClient.patch(`/damage-reports/${reportId}/reject`, rejectionData),
};

// ========== ADMIN APIs ==========

export const adminAPI = {
  getLogisticsStats: () => apiClient.get("/admin/stats"),
};

// ========== CUSTOM HOOKS ==========

import { useState, useCallback } from "react";

export const useClubs = () => {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchClubs = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      const response = await clubAPI.getAllClubs(params);
      setClubs(response.data.clubs);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch clubs");
    } finally {
      setLoading(false);
    }
  }, []);

  const addClub = useCallback(
    async (clubData) => {
      try {
        setLoading(true);
        const response = await clubAPI.createClub(clubData);
        setClubs([response.data.club, ...clubs]);
        return response.data.club;
      } catch (err) {
        setError(err.response?.data?.message || "Failed to create club");
      } finally {
        setLoading(false);
      }
    },
    [clubs],
  );

  return { clubs, loading, error, fetchClubs, addClub };
};

export const useAssets = () => {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAssets = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      const response = await assetAPI.getAllAssets(params);
      setAssets(response.data.assets);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch assets");
    } finally {
      setLoading(false);
    }
  }, []);

  const createAsset = useCallback(
    async (assetData) => {
      try {
        setLoading(true);
        const response = await assetAPI.createAsset(assetData);
        setAssets([response.data.asset, ...assets]);
        return response.data.asset;
      } catch (err) {
        setError(err.response?.data?.message || "Failed to create asset");
      } finally {
        setLoading(false);
      }
    },
    [assets],
  );

  const checkAssetAvailability = useCallback(
    async (assetId, startDate, endDate, quantityNeeded = 1) => {
      try {
        const response = await assetAPI.checkAvailability(
          assetId,
          startDate,
          endDate,
          quantityNeeded,
        );
        return response.data;
      } catch (err) {
        setError(err.response?.data?.message || "Failed to check availability");
      }
    },
    [],
  );

  return {
    assets,
    loading,
    error,
    fetchAssets,
    createAsset,
    checkAssetAvailability,
  };
};

export const useBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchBookings = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      const response = await bookingAPI.getAllBookings(params);
      setBookings(response.data.bookings);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch bookings");
    } finally {
      setLoading(false);
    }
  }, []);

  const createBooking = useCallback(
    async (bookingData) => {
      try {
        setLoading(true);
        const response = await bookingAPI.createBooking(bookingData);
        setBookings([response.data.booking, ...bookings]);
        return response.data.booking;
      } catch (err) {
        setError(err.response?.data?.message || "Failed to create booking");
      } finally {
        setLoading(false);
      }
    },
    [bookings],
  );

  const approveBooking = useCallback(
    async (bookingId, approvedById) => {
      try {
        setLoading(true);
        const response = await bookingAPI.approveBooking(
          bookingId,
          approvedById,
        );
        setBookings(
          bookings.map((b) => (b.id === bookingId ? response.data.booking : b)),
        );
        return response.data.booking;
      } catch (err) {
        setError(err.response?.data?.message || "Failed to approve booking");
      } finally {
        setLoading(false);
      }
    },
    [bookings],
  );

  const rejectBooking = useCallback(
    async (bookingId, rejectionReason) => {
      try {
        setLoading(true);
        const response = await bookingAPI.rejectBooking(
          bookingId,
          rejectionReason,
        );
        setBookings(
          bookings.map((b) => (b.id === bookingId ? response.data.booking : b)),
        );
        return response.data.booking;
      } catch (err) {
        setError(err.response?.data?.message || "Failed to reject booking");
      } finally {
        setLoading(false);
      }
    },
    [bookings],
  );

  return {
    bookings,
    loading,
    error,
    fetchBookings,
    createBooking,
    approveBooking,
    rejectBooking,
  };
};

export const useDamageReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchReports = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      const response = await damageReportAPI.getDamageReports(params);
      setReports(response.data.reports);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch reports");
    } finally {
      setLoading(false);
    }
  }, []);

  const reportDamage = useCallback(
    async (damageData) => {
      try {
        setLoading(true);
        const response = await damageReportAPI.reportDamage(damageData);
        setReports([response.data.damageReport, ...reports]);
        return response.data.damageReport;
      } catch (err) {
        setError(err.response?.data?.message || "Failed to report damage");
      } finally {
        setLoading(false);
      }
    },
    [reports],
  );

  const approveDamageReport = useCallback(
    async (reportId, approvalData) => {
      try {
        setLoading(true);
        const response = await damageReportAPI.approveDamageReport(
          reportId,
          approvalData,
        );
        setReports(
          reports.map((r) =>
            r.id === reportId ? response.data.damageReport : r,
          ),
        );
        return response.data.damageReport;
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to approve damage report",
        );
      } finally {
        setLoading(false);
      }
    },
    [reports],
  );

  return {
    reports,
    loading,
    error,
    fetchReports,
    reportDamage,
    approveDamageReport,
  };
};

export const useLogisticsStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminAPI.getLogisticsStats();
      setStats(response.data.stats);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch statistics");
    } finally {
      setLoading(false);
    }
  }, []);

  return { stats, loading, error, fetchStats };
};

// Export main API handlers for direct use
export default {
  clubAPI,
  assetAPI,
  bookingAPI,
  damageReportAPI,
  adminAPI,
  useClubs,
  useAssets,
  useBookings,
  useDamageReports,
  useLogisticsStats,
};
