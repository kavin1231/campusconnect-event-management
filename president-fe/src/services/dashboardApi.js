import { fetchVendors } from "./vendorApi";
import { fetchSponsorships } from "./sponsorshipApi";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

function formatDate(dateValue) {
  if (!dateValue) {
    return "-";
  }

  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) {
    return String(dateValue);
  }

  return date.toISOString().slice(0, 10);
}

function formatTime(dateValue) {
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) {
    return "--:--";
  }

  return date.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

function addHours(dateValue, hours) {
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) {
    return "--:--";
  }

  date.setHours(date.getHours() + hours);
  return date.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

async function fetchEvents() {
  const response = await fetch(`${API_BASE_URL}/api/events`);
  const payload = await response.json().catch(() => ({}));

  if (!response.ok || !payload.success) {
    throw new Error(payload?.message || "Failed to load events");
  }

  return payload.events || [];
}

function sameEventName(a, b) {
  return String(a || "").trim().toLowerCase() === String(b || "").trim().toLowerCase();
}

export async function fetchDashboardEvents() {
  const [events, sponsors, vendors] = await Promise.all([
    fetchEvents(),
    fetchSponsorships(),
    fetchVendors(),
  ]);

  return events.map((event) => {
    const eventSponsors = sponsors
      .filter((sponsor) => sameEventName(sponsor.eventName, event.title))
      .map((sponsor) => ({
        name: sponsor.name,
        amount: Number(sponsor.amount) || 0,
        profit_share: 0,
      }));

    const eventVendors = vendors
      .filter((vendor) => sameEventName(vendor.eventName, event.title))
      .map((vendor) => ({
        name: vendor.name,
        stall_id: vendor.stallId,
        fee: Number(vendor.fee) || 0,
        profit: Number(vendor.profit) || 0,
      }));

    const totalSponsorIncome = eventSponsors.reduce((sum, sponsor) => sum + sponsor.amount, 0);
    const totalVendorIncome = eventVendors.reduce((sum, vendor) => sum + vendor.fee, 0);

    const merchandiseIncome = 0;
    const expenses = {
      lighting: 0,
      sound: 0,
      costumes: 0,
      miscellaneous: 0,
    };
    const totalExpenses = 0;
    const totalIncome = totalSponsorIncome + totalVendorIncome + merchandiseIncome;

    return {
      id: event.id,
      event_name: event.title,
      date: formatDate(event.date),
      start_time: formatTime(event.date),
      end_time: addHours(event.date, 2),
      sponsors: eventSponsors,
      vendors: eventVendors,
      merchandise_income: merchandiseIncome,
      expenses,
      total_income: totalIncome,
      total_expenses: totalExpenses,
      total_profit: totalIncome - totalExpenses,
    };
  });
}
