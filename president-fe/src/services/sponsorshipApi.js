const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

function getTokenFromStorage() {
  const directToken =
    localStorage.getItem("token") || localStorage.getItem("nexora_token");
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

function normalizeDateValue(value) {
  if (!value) {
    return "";
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return String(value);
  }

  return parsed.toISOString().slice(0, 10);
}

function fromApiSponsorship(sponsorship) {
  return {
    id: sponsorship.id,
    name: sponsorship.name || "",
    amount: Number(sponsorship.amount) || 0,
    eventName: sponsorship.eventName || "",
    contact: sponsorship.contact || "",
    date: normalizeDateValue(sponsorship.date),
    remark: sponsorship.remark || "",
  };
}

function toApiSponsorship(input) {
  return {
    name: input.name,
    amount: Number(input.amount),
    eventName: input.eventName,
    contact: input.contact,
    date: input.date,
    remark: input.remark,
  };
}

export async function fetchSponsorships() {
  const data = await request("/api/president/sponsorships", { method: "GET" });
  return (data.sponsorships || []).map(fromApiSponsorship);
}

export async function createSponsorship(input) {
  const data = await request("/api/president/sponsorships", {
    method: "POST",
    body: JSON.stringify(toApiSponsorship(input)),
  });
  return fromApiSponsorship(data.sponsorship);
}

export async function updateSponsorship(id, input) {
  const data = await request(`/api/president/sponsorships/${id}`, {
    method: "PUT",
    body: JSON.stringify(toApiSponsorship(input)),
  });
  return fromApiSponsorship(data.sponsorship);
}

export async function deleteSponsorship(id) {
  await request(`/api/president/sponsorships/${id}`, {
    method: "DELETE",
  });
}
