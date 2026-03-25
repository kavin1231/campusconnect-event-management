import { C, FONT } from "../constants/colors";
import { Icon } from "../components/common/Icon";
import { VENUES_LIST, VENUE_DATA, EVENTS_BY_DAY } from "../constants/staticData";

// Venue helper functions
export function getVenueBookings(venueName) {
  const bookings = [];
  Object.entries(EVENTS_BY_DAY).forEach(([day, events]) => {
    events.forEach(ev => { if (ev.venue === venueName) bookings.push({ day: parseInt(day), ...ev }); });
  });
  return bookings;
}

export function checkVenueConflict(venueName, date) {
  if (!venueName || !date) return null;
  const day = new Date(date).getDate();
  return getVenueBookings(venueName).filter(b => b.day === day);
}

export function getVenueStatus(status) {
  const statusColor = s => 
    s === "available"
      ? { bg: "#E6F4ED", color: C.success, border: "#A7D7BE" }
      : s === "booked"
      ? { bg: C.primaryLight, color: C.primary, border: C.border }
      : { bg: C.secLight, color: C.secondary, border: "rgba(255,113,0,.3)" };
  return statusColor(status);
}

export function getEventTypeColor(type) {
  const TYPE_COLORS = {
    "Workshop":      { bg: "#EBF1F9",   text: "#053668",   dot: "#053668"  },
    "Exhibition":    { bg: "#FFF0E3",   text: "#7A3300",   dot: "#FF7100" },
    "Cultural Show": { bg: "#FEF3C7",   text: "#7A5F00",   dot: "#D97706"  },
    "Guest Speaker": { bg: "#E6F4ED",   text: "#1B7F4B",   dot: "#1B7F4B" },
    "Sports Meet":   { bg: "#F0FDF4",   text: "#166534",   dot: "#22C55E"  },
    "Networking":    { bg: "#EBF1F9",   text: "#053668",   dot: "#053668"  },
    "Hackathon":     { bg: "#EBF1F9",   text: "#053668",   dot: "#053668"  },
    "Concert":       { bg: "#FDF2F8",   text: "#7E22CE",   dot: "#A855F7"  },
    "Charity Drive": { bg: "#FEF2F2",   text: "#D93025",   dot: "#D93025"  },
    "Seminar":       { bg: "#F0F9FF",   text: "#0369A1",   dot: "#0EA5E9"  },
    "Conference":    { bg: "#EBF1F9",   text: "#053668",   dot: "#053668"  },
  };
  return TYPE_COLORS[type] || { bg: C.primaryLight, text: C.primary };
}
