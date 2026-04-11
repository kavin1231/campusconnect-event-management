/**
 * Centralized API service for all backend calls
 * Base URL configured from environment variables
 */

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

/**
 * Fetch wrapper with token authentication
 */
const fetchWithAuth = async (endpoint, options = {}) => {
  const token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // Handle 401 Unauthorized
  if (response.status === 401) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  }

  return response;
};

// ============================================
// AUTH ENDPOINTS
// ============================================
export const authAPI = {
  register: async (userData) => {
    const response = await fetchWithAuth("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    });
    return response.json();
  },

  login: async (email, password) => {
    const response = await fetchWithAuth("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    return response.json();
  },

  getProfile: async () => {
    const response = await fetchWithAuth("/auth/profile");
    return response.json();
  },

  updateProfile: async (userData) => {
    const response = await fetchWithAuth("/auth/profile", {
      method: "PUT",
      body: JSON.stringify(userData),
    });
    return response.json();
  },

  getAllStudents: async () => {
    const response = await fetchWithAuth("/auth/students");
    return response.json();
  },

  getAllUsers: async () => {
    const response = await fetchWithAuth("/auth/users");
    return response.json();
  },

  assignRole: async (assignmentData) => {
    const response = await fetchWithAuth("/auth/assign-role", {
      method: "POST",
      body: JSON.stringify(assignmentData),
    });
    return response.json();
  },

  revokeRole: async (userId) => {
    const response = await fetchWithAuth("/auth/revoke-role", {
      method: "POST",
      body: JSON.stringify({ userId }),
    });
    return response.json();
  },
};

// ============================================
// DASHBOARD ENDPOINTS
// ============================================
export const dashboardAPI = {
  getStats: async () => {
    const response = await fetchWithAuth("/dashboard/stats");
    return response.json();
  },

  getEvents: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await fetchWithAuth(`/dashboard/events?${params}`);
    return response.json();
  },

  registerEvent: async (eventId) => {
    const response = await fetchWithAuth(`/dashboard/register/${eventId}`, {
      method: "POST",
    });
    return response.json();
  },

  unregisterEvent: async (eventId) => {
    const response = await fetchWithAuth(`/dashboard/register/${eventId}`, {
      method: "DELETE",
    });
    return response.json();
  },
};

// ============================================
// LOGISTICS ENDPOINTS
// ============================================
export const logisticsAPI = {
  listAssets: async () => {
    const response = await fetchWithAuth("/logistics/assets");
    return response.json();
  },

  getAsset: async (id) => {
    const response = await fetchWithAuth(`/logistics/assets/${id}`);
    return response.json();
  },

  createAsset: async (assetData) => {
    const response = await fetchWithAuth("/logistics/assets", {
      method: "POST",
      body: JSON.stringify(assetData),
    });
    return response.json();
  },

  requestAsset: async (assetId, requestData) => {
    const response = await fetchWithAuth(
      `/logistics/assets/${assetId}/request`,
      {
        method: "POST",
        body: JSON.stringify(requestData),
      },
    );
    return response.json();
  },

  updateAsset: async (assetId, assetData) => {
    const response = await fetchWithAuth(`/logistics/assets/${assetId}`, {
      method: "PATCH",
      body: JSON.stringify(assetData),
    });
    return response.json();
  },

  deleteAsset: async (assetId) => {
    const response = await fetchWithAuth(`/logistics/assets/${assetId}`, {
      method: "DELETE",
    });
    return response.json();
  },

  listRequests: async () => {
    const response = await fetchWithAuth("/logistics/requests");
    return response.json();
  },

  approveRequest: async (requestId, approvedById) => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const resolvedApprovedById = approvedById || user?.id;
    if (!resolvedApprovedById) {
      return {
        success: false,
        message: "Unable to determine approver ID from current session.",
      };
    }
    const response = await fetchWithAuth(
      `/logistics/requests/${requestId}/approve`,
      {
        method: "PATCH",
        body: JSON.stringify({ approvedById: resolvedApprovedById }),
      },
    );
    return response.json();
  },

  rejectRequest: async (requestId, rejectionReason = "") => {
    const response = await fetchWithAuth(
      `/logistics/requests/${requestId}/reject`,
      {
        method: "PATCH",
        body: JSON.stringify({ rejectionReason }),
      },
    );
    return response.json();
  },

  checkoutAsset: async (requestId) => {
    const response = await fetchWithAuth(
      `/logistics/requests/${requestId}/checkout`,
      {
        method: "PATCH",
      },
    );
    return response.json();
  },

  returnAsset: async (requestId, approvedReturnBy) => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const resolvedApprovedReturnBy = approvedReturnBy || user?.id;
    if (!resolvedApprovedReturnBy) {
      return {
        success: false,
        message: "Unable to determine return approver ID from current session.",
      };
    }
    const response = await fetchWithAuth(
      `/logistics/requests/${requestId}/return`,
      {
        method: "PATCH",
        body: JSON.stringify({ approvedReturnBy: resolvedApprovedReturnBy }),
      },
    );
    return response.json();
  },

  reportDamage: async (requestId, damageData) => {
    const response = await fetchWithAuth(
      `/logistics/requests/${requestId}/damage`,
      {
        method: "PATCH",
        body: JSON.stringify(damageData),
      },
    );
    return response.json();
  },
};

// ============================================
// GOVERNANCE ENDPOINTS
// ============================================
export const governanceAPI = {
  // Event approvals
  getEventApprovals: async (status = null) => {
    const query = status ? `?status=${status}` : "";
    const response = await fetchWithAuth(`/events${query}`);
    return response.json();
  },

  approveEvent: async (eventId) => {
    const response = await fetchWithAuth(`/events/${eventId}/approve`, {
      method: "PATCH",
    });
    return response.json();
  },

  rejectEvent: async (eventId, reason) => {
    const response = await fetchWithAuth(`/events/${eventId}/reject`, {
      method: "PATCH",
      body: JSON.stringify({ reason }),
    });
    return response.json();
  },

  // President applications - Student endpoints
  applyForPresident: async (applicationData) => {
    const response = await fetchWithAuth("/president/apply", {
      method: "POST",
      body: JSON.stringify(applicationData),
    });
    return response.json();
  },

  getApplicationStatus: async () => {
    const response = await fetchWithAuth("/president/application-status");
    return response.json();
  },

  getStudentNotifications: async () => {
    const response = await fetchWithAuth("/president/notifications");
    return response.json();
  },

  markNotificationRead: async (notificationId) => {
    const response = await fetchWithAuth(
      `/president/notifications/${notificationId}/read`,
      {
        method: "PATCH",
      },
    );
    return response.json();
  },

  // President applications - Admin endpoints
  getPresidentApplications: async () => {
    const response = await fetchWithAuth("/president/applications");
    return response.json();
  },

  approvePresidentApplication: async (applicationId, additionalData = {}) => {
    const response = await fetchWithAuth(
      `/president/applications/${applicationId}/approve`,
      {
        method: "PATCH",
        body: JSON.stringify(additionalData),
      },
    );
    return response.json();
  },

  rejectPresidentApplication: async (applicationId, reason = "") => {
    const response = await fetchWithAuth(
      `/president/applications/${applicationId}/reject`,
      {
        method: "PATCH",
        body: JSON.stringify({ reason }),
      },
    );
    return response.json();
  },

  listEvents: async () => {
    const response = await fetchWithAuth("/events");
    return response.json();
  },

  listVendors: async (params = {}) => {
    const query = new URLSearchParams();
    if (params.search) query.set("search", params.search);
    if (params.status && params.status !== "ALL")
      query.set("status", params.status);
    if (params.serviceCategory && params.serviceCategory !== "ALL") {
      query.set("serviceCategory", params.serviceCategory);
    }

    const response = await fetchWithAuth(
      `/president/vendors${query.toString() ? `?${query.toString()}` : ""}`,
    );
    return response.json();
  },

  createVendor: async (vendorData) => {
    const response = await fetchWithAuth("/president/vendors", {
      method: "POST",
      body: JSON.stringify(vendorData),
    });
    return response.json();
  },

  updateVendor: async (vendorId, vendorData) => {
    const response = await fetchWithAuth(`/president/vendors/${vendorId}`, {
      method: "PATCH",
      body: JSON.stringify(vendorData),
    });
    return response.json();
  },

  deleteVendor: async (vendorId) => {
    const response = await fetchWithAuth(`/president/vendors/${vendorId}`, {
      method: "DELETE",
    });
    return response.json();
  },

  getStallsByEvent: async (params = {}) => {
    const query = new URLSearchParams();
    if (params.eventId) query.set("eventId", params.eventId);
    if (params.search) query.set("search", params.search);
    if (params.status && params.status !== "ALL")
      query.set("status", params.status);
    if (params.serviceCategory && params.serviceCategory !== "ALL") {
      query.set("serviceCategory", params.serviceCategory);
    }

    const response = await fetchWithAuth(
      `/president/stalls${query.toString() ? `?${query.toString()}` : ""}`,
    );
    return response.json();
  },

  getAvailableStallsByEvent: async (eventId, vendorId) => {
    const query = new URLSearchParams();
    if (eventId) query.set("eventId", eventId);
    if (vendorId) query.set("vendorId", vendorId);

    const response = await fetchWithAuth(
      `/president/stalls/available?${query.toString()}`,
    );
    return response.json();
  },

  assignStallToVendor: async (payload) => {
    const response = await fetchWithAuth("/president/stalls/assign", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    return response.json();
  },

  updateStallAllocation: async (stallId, payload) => {
    const response = await fetchWithAuth(`/president/stalls/${stallId}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
    return response.json();
  },

  releaseStall: async (stallId) => {
    const response = await fetchWithAuth(
      `/president/stalls/${stallId}/release`,
      {
        method: "PATCH",
      },
    );
    return response.json();
  },

  getStallMapData: async (eventId) => {
    const query = new URLSearchParams();
    if (eventId) query.set("eventId", eventId);

    const response = await fetchWithAuth(
      `/president/stalls/map?${query.toString()}`,
    );
    return response.json();
  },

  listSponsorships: async (params = {}) => {
    const query = new URLSearchParams();
    if (params.search) query.set("search", params.search);
    if (params.eventId && params.eventId !== "ALL")
      query.set("eventId", params.eventId);
    if (params.sponsorTier && params.sponsorTier !== "ALL")
      query.set("sponsorTier", params.sponsorTier);
    if (params.paymentStatus && params.paymentStatus !== "ALL")
      query.set("paymentStatus", params.paymentStatus);
    if (params.status && params.status !== "ALL")
      query.set("status", params.status);

    const response = await fetchWithAuth(
      `/president/sponsorships${query.toString() ? `?${query.toString()}` : ""}`,
    );
    return response.json();
  },

  createSponsorship: async (payload) => {
    const response = await fetchWithAuth("/president/sponsorships", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    return response.json();
  },

  updateSponsorship: async (id, payload) => {
    const response = await fetchWithAuth(`/president/sponsorships/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
    return response.json();
  },

  deleteSponsorship: async (id) => {
    const response = await fetchWithAuth(`/president/sponsorships/${id}`, {
      method: "DELETE",
    });
    return response.json();
  },
};

// ============================================
// CHATBOT ENDPOINTS
// ============================================
export const chatbotAPI = {
  query: async (message) => {
    const response = await fetchWithAuth("/chatbot/query", {
      method: "POST",
      body: JSON.stringify({ message }),
    });
    return response.json();
  },
};

// ============================================
// EVENTS ENDPOINTS
// ============================================
export const eventsAPI = {
  listEvents: async () => {
    const response = await fetchWithAuth("/events");
    return response.json();
  },
};

// ============================================
// OPERATIONS ENDPOINTS
// ============================================
export const operationsAPI = {
  getOverview: async () => {
    const response = await fetchWithAuth("/operations/overview");
    return response.json();
  },

  getIntelligence: async () => {
    const response = await fetchWithAuth("/operations/intelligence");
    return response.json();
  },

  listOrganizations: async () => {
    const response = await fetchWithAuth("/operations/organizations");
    return response.json();
  },

  createOrganization: async (payload) => {
    const response = await fetchWithAuth("/operations/organizations", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    return response.json();
  },

  listSponsorships: async (stage) => {
    const query = stage ? `?stage=${encodeURIComponent(stage)}` : "";
    const response = await fetchWithAuth(`/operations/sponsorships${query}`);
    return response.json();
  },

  moveSponsorshipStage: async (id, stage) => {
    const response = await fetchWithAuth(
      `/operations/sponsorships/${id}/stage`,
      {
        method: "PATCH",
        body: JSON.stringify({ stage }),
      },
    );
    return response.json();
  },

  listBudgets: async () => {
    const response = await fetchWithAuth("/operations/budgets");
    return response.json();
  },

  listVendors: async () => {
    const response = await fetchWithAuth("/operations/vendors");
    return response.json();
  },

  listStalls: async () => {
    const response = await fetchWithAuth("/operations/stalls");
    return response.json();
  },
};

// SPORTS ENDPOINTS
// ============================================
export const sportsAPI = {
  getAllSports: async () => {
    const response = await fetchWithAuth("/sports");
    return response.json();
  },

  createSport: async (sportData) => {
    const response = await fetchWithAuth("/sports", {
      method: "POST",
      body: JSON.stringify(sportData),
    });
    return response.json();
  },

  updateSport: async (id, sportData) => {
    const response = await fetchWithAuth(`/sports/${id}`, {
      method: "PUT",
      body: JSON.stringify(sportData),
    });
    return response.json();
  },

  deleteSport: async (id) => {
    const response = await fetchWithAuth(`/sports/${id}`, {
      method: "DELETE",
    });
    return response.json();
  },
};

// GROUP LINKS ENDPOINTS
// ============================================
export const groupLinksAPI = {
  getAllLinks: async () => {
    const response = await fetchWithAuth("/group-links");
    return response.json();
  },

  createLink: async (linkData) => {
    const response = await fetchWithAuth("/group-links", {
      method: "POST",
      body: JSON.stringify(linkData),
    });
    return response.json();
  },

  updateLink: async (id, linkData) => {
    const response = await fetchWithAuth(`/group-links/${id}`, {
      method: "PUT",
      body: JSON.stringify(linkData),
    });
    return response.json();
  },

  deleteLink: async (id) => {
    const response = await fetchWithAuth(`/group-links/${id}`, {
      method: "DELETE",
    });
    return response.json();
  },
};

// ============================================
// EVENT REQUEST ENDPOINTS
// ============================================
export const eventRequestAPI = {
  submitEventRequest: async (requestData) => {
    const response = await fetchWithAuth("/event-requests", {
      method: "POST",
      body: JSON.stringify(requestData),
    });
    return response.json();
  },

  getMyEventRequests: async () => {
    const response = await fetchWithAuth("/event-requests");
    return response.json();
  },

  getEventRequestById: async (id) => {
    const response = await fetchWithAuth(`/event-requests/${id}`);
    return response.json();
  },

  getAllEventRequests: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await fetchWithAuth(`/event-requests?${params}`);
    return response.json();
  },

  updateEventRequestStatus: async (id, statusData) => {
    const response = await fetchWithAuth(`/event-requests/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify(statusData),
    });
    return response.json();
  },

  deleteEventRequest: async (id) => {
    const response = await fetchWithAuth(`/event-requests/${id}`, {
      method: "DELETE",
    });
    return response.json();
  },

  getEventRequestStats: async () => {
    const response = await fetchWithAuth("/event-requests/stats");
    return response.json();
  },
};

// ============================================
// MERCHANDISE ENDPOINTS
// ============================================
export const merchandiseAPI = {
  getProducts: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const response = await fetchWithAuth(
      `/merchandise/products${query ? `?${query}` : ""}`,
    );
    return response.json();
  },

  createProduct: async (productData) => {
    const response = await fetchWithAuth("/merchandise/products", {
      method: "POST",
      body: JSON.stringify(productData),
    });
    return response.json();
  },

  updateProduct: async (id, productData) => {
    const response = await fetchWithAuth(`/merchandise/products/${id}`, {
      method: "PATCH",
      body: JSON.stringify(productData),
    });
    return response.json();
  },

  deleteProduct: async (id) => {
    const response = await fetchWithAuth(`/merchandise/products/${id}`, {
      method: "DELETE",
    });
    return response.json();
  },
};

// STUDY SUPPORT ENDPOINTS
// ============================================
export const studySupportAPI = {
  getMaterials: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const response = await fetchWithAuth(
      `/study-support/materials${query ? `?${query}` : ""}`,
    );
    return response.json();
  },

  getSessions: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const response = await fetchWithAuth(
      `/study-support/sessions${query ? `?${query}` : ""}`,
    );
    return response.json();
  },
};

export default {
  authAPI,
  dashboardAPI,
  logisticsAPI,
  governanceAPI,
  chatbotAPI,
  eventsAPI,
  operationsAPI,
  sportsAPI,
  groupLinksAPI,
  merchandiseAPI,
  studySupportAPI,
};
