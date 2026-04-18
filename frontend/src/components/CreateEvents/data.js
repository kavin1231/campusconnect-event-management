import { C } from "./designSystem";

export const MY_EVENTS = [];
export const EVENT_TYPES = ["Workshop", "Guest Speaker", "Concert", "Sports Meet", "Seminar", "Cultural Show", "Exhibition", "Charity Drive", "Hackathon", "Networking Event", "Other"];
export const PURPOSES = ["Educational", "Charity / Fundraising", "Social / Recreational", "Cultural", "Professional Development", "Awareness Campaign", "Other"];
export const AUDIENCES = ["Faculty Students Only", "All University Students", "University-Wide (Staff + Students)", "General Public", "Invite Only"];
export const VENUES_LIST = ["Main Auditorium", "Open Air Amphitheatre", "Main Field", "Seminar Room A", "Seminar Room B", "Seminar Room C", "Lecture Hall 1", "Lecture Hall 2", "Student Union Hall", "Library Conference Room", "Engineering Lab Block", "Sports Complex", "Faculty Boardroom", "IT Lab Block", "Other"];
export const FUND_SOURCES = ["Student Activity Fund", "Department Budget", "Ticket Sales", "Sponsorship", "Donor Contribution", "Mixed Sources"];
export const FORM_STEPS = [{ id: 1, label: "Event Info", num: "01" }, { id: 2, label: "Organizers", num: "02" }, { id: 3, label: "Venue", num: "03" }, { id: 4, label: "Financials", num: "04" }, { id: 5, label: "Risk & Safety", num: "05" }];

export const VENUE_DATA = [];

export const EVENTS_BY_DAY = {};

export function getVenueBookings(venueName) {
  const out = [];
  Object.entries(EVENTS_BY_DAY).forEach(([day, evs]) =>
    evs.forEach((e) => {
      if (e.venue === venueName) out.push({ day: parseInt(day, 10), ...e });
    }),
  );
  return out;
}

export function checkVenueConflict(venueName, date) {
  if (!venueName || !date) return null;
  const day = new Date(date).getDate();
  return getVenueBookings(venueName).filter((b) => b.day === day);
}

export const UPCOMING_EVENTS_DASH = [];

export const RECENT_REQUESTS_DASH = [];

export const DASH_STATUS_META = {
  approved: { bg: "#D97706", text: "#FEF3C7", label: "Approved" },
  pending: { bg: "#06B6D4", text: "#F0F9FA", label: "Pending" },
  rejected: { bg: "#EF4444", text: "#FEE2E2", label: "Rejected" },
  conflicted: { bg: "#8B5CF6", text: "#F3E8FF", label: "Conflicted" },
};

export const DASH_TYPE_COLORS = {
  Conference: { bg: "#312E81", text: "#8B5CF6" },
  Hackathon: { bg: "#312E81", text: "#8B5CF6" },
  Workshop: { bg: "#064E3B", text: "#10B981" },
  Concert: { bg: "#4C1D95", text: "#D8B4FE" },
  "Guest Speaker": { bg: "#064E3B", text: "#10B981" },
  "Sports Meet": { bg: "#064E3B", text: "#10B981" },
  "Charity Drive": { bg: "#7F1D1D", text: "#EF4444" },
  Seminar: { bg: "#0E5A8A", text: "#06B6D4" },
};

const TODAY_D = new Date();
export const CUR_YEAR = TODAY_D.getFullYear();
export const CUR_MONTH = TODAY_D.getMonth();
export const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
export const WEEK_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const CAL_EVENTS = {};

export const CONFLICTS_DATA = [];

export const CAL_TYPE_COLORS = {
  Workshop: { bg: "#312E81", text: "#8B5CF6", dot: "#8B5CF6" },
  Exhibition: { bg: "#1F2937", text: "#D97706", dot: "#D97706" },
  "Cultural Show": { bg: "#1F2937", text: "#D97706", dot: "#D97706" },
  "Guest Speaker": { bg: "#064E3B", text: "#10B981", dot: "#10B981" },
  "Sports Meet": { bg: "#064E3B", text: "#10B981", dot: "#10B981" },
  Networking: { bg: "#312E81", text: "#8B5CF6", dot: "#8B5CF6" },
  Hackathon: { bg: "#312E81", text: "#8B5CF6", dot: "#8B5CF6" },
  Concert: { bg: "#4C1D95", text: "#D8B4FE", dot: "#D8B4FE" },
  "Charity Drive": { bg: "#7F1D1D", text: "#EF4444", dot: "#EF4444" },
  Seminar: { bg: "#0E5A8A", text: "#06B6D4", dot: "#06B6D4" },
};

export const VENUE_NAMES_CAL = ["All Venues", "Main Auditorium", "Open Air Amphitheatre", "IT Lab Block", "Sports Complex", "Lecture Hall 1", "Main Field", "Seminar Room A", "Student Union Hall"];

export const MERCH_PRODUCTS_INIT = [];

export const MERCH_ORDERS_INIT = [];

