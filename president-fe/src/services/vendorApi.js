const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

function getTokenFromStorage() {
  const directToken = localStorage.getItem("token") || localStorage.getItem("nexora_token");
  if (directToken) {
    return directToken;
  }

  try {
    const rawUser = localStorage.getItem("nexora_user");
    if (!rawUser) {
      return null;
    }
    const parsed = JSON.parse(rawUser);
    return parsed?.token || null;
  } catch {
    return null;
  }
}

async function request(path, options = {}) {
  const token = getTokenFromStorage();
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload?.message || `Request failed with status ${response.status}`);
  }

  return payload;
}

function fromApiVendor(vendor) {
  return {
    id: vendor.id,
    name: vendor.name,
    stallId: Number(vendor.stallId),
    contactNumber: vendor.phone || "",
    eventName: vendor.eventName || "-",
    fee: Number(vendor.fee) || 0,
    email: vendor.email || "",
    profit: Number(vendor.profit) || 0,
  };
}

function toApiVendor(input) {
  return {
    name: input.name,
    contactNumber: input.contactNumber,
    stallId: input.stallId,
    fee: Number(input.fee),
    profit: Number(input.profit || 0),
    email: input.email,
    eventName: input.eventName,
  };
}

export async function fetchVendors() {
  const data = await request("/api/president/vendors", { method: "GET" });
  return (data.vendors || []).map(fromApiVendor);
}

export async function createVendor(input) {
  const data = await request("/api/president/vendors", {
    method: "POST",
    body: JSON.stringify(toApiVendor(input)),
  });
  return fromApiVendor(data.vendor);
}

export async function updateVendor(id, input) {
  const data = await request(`/api/president/vendors/${id}`, {
    method: "PUT",
    body: JSON.stringify(toApiVendor(input)),
  });
  return fromApiVendor(data.vendor);
}

export async function deleteVendor(id) {
  await request(`/api/president/vendors/${id}`, {
    method: "DELETE",
  });
}
