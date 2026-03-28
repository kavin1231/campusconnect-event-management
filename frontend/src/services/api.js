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
  getEventApprovals: async () => {
    const response = await fetchWithAuth("/events");
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

export default {
  authAPI,
  dashboardAPI,
  logisticsAPI,
  governanceAPI,
  chatbotAPI,
  eventsAPI,
  operationsAPI,
  sportsAPI,
};
