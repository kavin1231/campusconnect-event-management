import { C } from "./designSystem";

export const MY_EVENTS = [
  {
    id: "e1",
    title: "IEEE Annual Tech Symposium 2026",
    date: "Mar 28, 2026",
    time: "9:00 AM - 5:00 PM",
    venue: "Main Auditorium",
    type: "Conference",
    status: "published",
    description:
      "A day-long technology symposium bringing together students, faculty, and industry professionals to explore the frontiers of engineering and computing.",
    capacity: 320,
    registered: 287,
    category: "Technology",
    banner: null,
    tickets: [
      { name: "General Admission", price: 0, inventory: 300, sold: 287, enabled: true },
      { name: "VIP Access", price: 1500, inventory: 20, sold: 18, enabled: true },
    ],
    merch: [
      { name: "IEEE T-Shirt", price: 750, inventory: 100, sold: 64, enabled: true },
      { name: "Tote Bag", price: 350, inventory: 80, sold: 51, enabled: false },
    ],
    revenue: 42300,
    orders: 305,
  },
  {
    id: "e2",
    title: "Photography Workshop: Light & Composition",
    date: "Apr 10, 2026",
    time: "2:00 PM - 5:00 PM",
    venue: "Seminar Room A",
    type: "Workshop",
    status: "approved",
    description:
      "An intensive hands-on workshop exploring natural light, composition theory, and practical shooting techniques for intermediate photographers.",
    capacity: 35,
    registered: 0,
    category: "Arts & Culture",
    banner: null,
    tickets: [],
    merch: [],
    revenue: 0,
    orders: 0,
  },
  {
    id: "e3",
    title: "Music Night - Spring Edition",
    date: "Apr 20, 2026",
    time: "6:00 PM - 10:00 PM",
    venue: "Open Air Amphitheatre",
    type: "Concert",
    status: "pending",
    description:
      "An evening of live musical performances by student bands and solo artists. Featuring indie, jazz, and classical performances.",
    capacity: 500,
    registered: 0,
    category: "Arts & Culture",
    banner: null,
    tickets: [],
    merch: [],
    revenue: 0,
    orders: 0,
  },
  {
    id: "e4",
    title: "Hackathon: Build for Lanka 2026",
    date: "Apr 3, 2026",
    time: "8:00 AM - Apr 4, 8:00 PM",
    venue: "IT Lab Block",
    type: "Hackathon",
    status: "pending",
    description:
      "A 36-hour hackathon challenging students to build tech solutions for local community problems. Open to all faculties.",
    capacity: 80,
    registered: 0,
    category: "Technology",
    banner: null,
    tickets: [],
    merch: [],
    revenue: 0,
    orders: 0,
  },
  {
    id: "e5",
    title: "Freshers' Orientation 2026",
    date: "Mar 22, 2026",
    time: "9:00 AM - 1:00 PM",
    venue: "Main Auditorium",
    type: "Seminar",
    status: "published",
    description:
      "Official welcome event for the new intake of students. Includes department introductions, campus tour briefing, and social activities.",
    capacity: 600,
    registered: 524,
    category: "University Life",
    banner: null,
    tickets: [{ name: "New Student Entry", price: 0, inventory: 600, sold: 524, enabled: true }],
    merch: [{ name: "Welcome Kit", price: 500, inventory: 200, sold: 187, enabled: false }],
    revenue: 0,
    orders: 524,
  },
];

export const EVENT_TYPES = ["Workshop", "Guest Speaker", "Concert", "Sports Meet", "Seminar", "Cultural Show", "Exhibition", "Charity Drive", "Hackathon", "Networking Event", "Other"];
export const PURPOSES = ["Educational", "Charity / Fundraising", "Social / Recreational", "Cultural", "Professional Development", "Awareness Campaign", "Other"];
export const AUDIENCES = ["Faculty Students Only", "All University Students", "University-Wide (Staff + Students)", "General Public", "Invite Only"];
export const VENUES_LIST = ["Main Auditorium", "Open Air Amphitheatre", "Main Field", "Seminar Room A", "Seminar Room B", "Seminar Room C", "Lecture Hall 1", "Lecture Hall 2", "Student Union Hall", "Library Conference Room", "Engineering Lab Block", "Sports Complex", "Faculty Boardroom", "IT Lab Block", "Other"];
export const FUND_SOURCES = ["Student Activity Fund", "Department Budget", "Ticket Sales", "Sponsorship", "Donor Contribution", "Mixed Sources"];
export const FORM_STEPS = [{ id: 1, label: "Event Info", num: "01" }, { id: 2, label: "Organizers", num: "02" }, { id: 3, label: "Venue", num: "03" }, { id: 4, label: "Financials", num: "04" }, { id: 5, label: "Risk & Safety", num: "05" }];

export const VENUE_DATA = [
  { id: "v1", name: "Main Auditorium", capacity: 600, type: "Indoor", block: "Main Building", features: ["Stage", "AV System", "AC", "Projector"], status: "available" },
  { id: "v2", name: "Open Air Amphitheatre", capacity: 800, type: "Outdoor", block: "Central Grounds", features: ["Stage", "Sound System", "Lighting Rig"], status: "conflicted" },
  { id: "v3", name: "Main Field", capacity: 2000, type: "Outdoor", block: "Sports Complex", features: ["PA System", "Floodlights", "Equipment Room"], status: "available" },
  { id: "v4", name: "Seminar Room A", capacity: 40, type: "Indoor", block: "Arts Block", features: ["Whiteboard", "Projector", "AC"], status: "booked" },
  { id: "v5", name: "Seminar Room B", capacity: 40, type: "Indoor", block: "Arts Block", features: ["Whiteboard", "Projector", "AC"], status: "available" },
  { id: "v6", name: "Seminar Room C", capacity: 50, type: "Indoor", block: "Science Block", features: ["Smartboard", "Video Conf", "AC"], status: "available" },
  { id: "v7", name: "Lecture Hall 1", capacity: 180, type: "Indoor", block: "Main Building", features: ["Fixed Seating", "Projector", "Mic", "AC"], status: "available" },
  { id: "v8", name: "Lecture Hall 2", capacity: 180, type: "Indoor", block: "Main Building", features: ["Fixed Seating", "Projector", "Mic", "AC"], status: "booked" },
  { id: "v9", name: "Student Union Hall", capacity: 300, type: "Indoor", block: "Student Centre", features: ["Stage", "Kitchen", "Sound", "Flexible Seating"], status: "available" },
  { id: "v10", name: "Library Conference Room", capacity: 20, type: "Indoor", block: "Library", features: ["Video Conf", "Whiteboard", "AC"], status: "available" },
  { id: "v11", name: "Engineering Lab Block", capacity: 60, type: "Indoor", block: "Eng. Faculty", features: ["Workbenches", "Power Points", "Projector"], status: "conflicted" },
  { id: "v12", name: "Sports Complex", capacity: 500, type: "Indoor", block: "Sports Wing", features: ["Courts", "Changing Rooms", "PA", "Scoreboard"], status: "available" },
  { id: "v13", name: "Faculty Boardroom", capacity: 25, type: "Indoor", block: "Admin Building", features: ["Video Conf", "Whiteboard", "AC", "Catering"], status: "available" },
  { id: "v14", name: "IT Lab Block", capacity: 80, type: "Indoor", block: "IT Faculty", features: ["PCs", "High-Speed WiFi", "Projector", "AC"], status: "booked" },
];

export const EVENTS_BY_DAY = {
  3: [{ title: "Bio Lab Workshop", venue: "Engineering Lab Block", org: "IEEE Branch", conflict: false }],
  5: [
    { title: "Career Fair 2026", venue: "Main Auditorium", org: "Student Council", conflict: true },
    { title: "Open Rehearsal - Drama", venue: "Main Auditorium", org: "Drama Society", conflict: true },
  ],
  8: [{ title: "Guest Lecture: AI Ethics", venue: "Lecture Hall 1", org: "CS Department", conflict: false }],
  10: [{ title: "Basketball Semifinals", venue: "Sports Complex", org: "Sports Club", conflict: false }],
  15: [{ title: "Hackathon Day 1", venue: "IT Lab Block", org: "IEEE Branch", conflict: false }],
  16: [{ title: "Hackathon Day 2", venue: "IT Lab Block", org: "IEEE Branch", conflict: false }],
  20: [
    { title: "Music Night", venue: "Open Air Amphitheatre", org: "Music Club", conflict: true },
    { title: "Charity Gala", venue: "Open Air Amphitheatre", org: "Rotaract Club", conflict: true },
  ],
  22: [{ title: "Freshers Orientation", venue: "Main Auditorium", org: "Student Council", conflict: false }],
  28: [{ title: "Annual Sports Meet", venue: "Main Field", org: "Sports Council", conflict: false }],
};

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

export const UPCOMING_EVENTS_DASH = [
  { id: 1, title: "IEEE Annual Tech Symposium", date: "Mar 28, 2026", time: "9:00 AM", venue: "Main Auditorium", type: "Conference", attendees: 320, status: "approved" },
  { id: 2, title: "Hackathon Day 1", date: "Apr 3, 2026", time: "8:00 AM", venue: "IT Lab Block", type: "Hackathon", attendees: 80, status: "approved" },
  { id: 3, title: "Photography Workshop", date: "Apr 10, 2026", time: "2:00 PM", venue: "Seminar Room A", type: "Workshop", attendees: 35, status: "pending" },
  { id: 4, title: "Music Night", date: "Apr 20, 2026", time: "6:00 PM", venue: "Open Air Amphitheatre", type: "Concert", attendees: 500, status: "conflicted" },
];

export const RECENT_REQUESTS_DASH = [
  { id: 1, title: "Charity Gala Night", submitted: "Mar 20, 2026", type: "Charity Drive", status: "pending", venue: "Open Air Amphitheatre" },
  { id: 2, title: "Guest Lecture: AI Ethics", submitted: "Mar 18, 2026", type: "Guest Speaker", status: "approved", venue: "Lecture Hall 1" },
  { id: 3, title: "Annual Sports Meet", submitted: "Mar 15, 2026", type: "Sports Meet", status: "approved", venue: "Main Field" },
  { id: 4, title: "Bio Lab Workshop", submitted: "Mar 12, 2026", type: "Workshop", status: "rejected", venue: "Engineering Lab Block" },
  { id: 5, title: "Freshers' Orientation", submitted: "Mar 8, 2026", type: "Seminar", status: "approved", venue: "Main Auditorium" },
];

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

export const CAL_EVENTS = {
  3: [{ title: "Bio Lab Workshop", type: "Workshop", venue: "Engineering Lab Block", org: "IEEE Branch", conflict: false }],
  5: [
    { title: "Career Fair 2026", type: "Exhibition", venue: "Main Auditorium", org: "Student Council", conflict: true },
    { title: "Open Rehearsal - Drama", type: "Cultural Show", venue: "Main Auditorium", org: "Drama Society", conflict: true },
  ],
  8: [{ title: "Guest Lecture: AI Ethics", type: "Guest Speaker", venue: "Lecture Hall 1", org: "CS Department", conflict: false }],
  10: [{ title: "Basketball Semifinals", type: "Sports Meet", venue: "Sports Complex", org: "Sports Club", conflict: false }],
  11: [{ title: "Alumni Gathering", type: "Networking", venue: "Student Union Hall", org: "Alumni Association", conflict: false }],
  15: [{ title: "Hackathon Day 1", type: "Hackathon", venue: "IT Lab Block", org: "IEEE Branch", conflict: false }],
  16: [{ title: "Hackathon Day 2", type: "Hackathon", venue: "IT Lab Block", org: "IEEE Branch", conflict: false }],
  18: [{ title: "Faculty Research Expo", type: "Exhibition", venue: "Main Auditorium", org: "Research Dept", conflict: false }],
  20: [
    { title: "Music Night", type: "Concert", venue: "Open Air Amphitheatre", org: "Music Club", conflict: true },
    { title: "Charity Gala", type: "Charity Drive", venue: "Open Air Amphitheatre", org: "Rotaract Club", conflict: true },
  ],
  22: [{ title: "Freshers' Orientation", type: "Seminar", venue: "Main Auditorium", org: "Student Council", conflict: false }],
  25: [{ title: "Photography Workshop", type: "Workshop", venue: "Seminar Room A", org: "Photography Club", conflict: false }],
  28: [{ title: "Annual Sports Meet", type: "Sports Meet", venue: "Main Field", org: "Sports Council", conflict: false }],
};

export const CONFLICTS_DATA = [
  { date: `${CUR_MONTH + 1}/5`, time: "10:00 AM", title: "Venue Overlap: Main Auditorium", desc: "Career Fair vs. Open Rehearsal - Drama Society" },
  { date: `${CUR_MONTH + 1}/20`, time: "06:00 PM", title: "Venue Overlap: Amphitheatre", desc: "Music Night vs. Charity Gala - same outdoor stage" },
];

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

export const MERCH_PRODUCTS_INIT = [
  { id: "m1", name: "Annual Gala T-Shirt", price: 1900, inventory: 80, sold: 52, enabled: true, status: "instock", category: "Apparel", event: "IEEE Symposium", image: "T", desc: "Premium 100% cotton, unisex fit with neon..." },
  { id: "m2", name: "NEXORA Elite Hoodie", price: 4500, inventory: 30, sold: 22, enabled: true, status: "lowstock", category: "Apparel", event: "IEEE Symposium", image: "H", desc: "Heavyweight fleece with embroidered logo on..." },
  { id: "m3", name: "Tote Bag", price: 850, inventory: 120, sold: 88, enabled: false, status: "instock", category: "Accessories", event: "Music Night", image: "B", desc: "Canvas tote with event artwork printed..." },
  { id: "m4", name: "Lanyard & Badge Set", price: 350, inventory: 200, sold: 167, enabled: true, status: "instock", category: "Accessories", event: "IEEE Symposium", image: "L", desc: "Official conference lanyard with custom badge..." },
];

export const MERCH_ORDERS_INIT = [
  { id: "ORD-001", student: "Alex Thompson", item: "Annual Gala T-Shirt", size: "M", date: "Oct 12, 2023", payStatus: "paid", fulfillStatus: "collected" },
  { id: "ORD-002", student: "Sarah Chen", item: "NEXORA Elite Hoodie", size: "L", date: "Oct 11, 2023", payStatus: "collected", fulfillStatus: "pickedup" },
  { id: "ORD-003", student: "Marcus Johnson", item: "Annual Gala T-Shirt", size: "XL", date: "Oct 10, 2023", payStatus: "pending", fulfillStatus: "pending" },
  { id: "ORD-004", student: "Elena Rodriguez", item: "NEXORA Elite Hoodie", size: "S", date: "Oct 09, 2023", payStatus: "paid", fulfillStatus: "collected" },
  { id: "ORD-005", student: "Kevin Park", item: "Tote Bag", size: "-", date: "Oct 08, 2023", payStatus: "paid", fulfillStatus: "pending" },
  { id: "ORD-006", student: "Priya Sharma", item: "Lanyard & Badge Set", size: "-", date: "Oct 07, 2023", payStatus: "paid", fulfillStatus: "collected" },
  { id: "ORD-007", student: "James Wilson", item: "Annual Gala T-Shirt", size: "S", date: "Oct 06, 2023", payStatus: "pending", fulfillStatus: "pending" },
  { id: "ORD-008", student: "Yuki Tanaka", item: "NEXORA Elite Hoodie", size: "M", date: "Oct 05, 2023", payStatus: "paid", fulfillStatus: "pickedup" },
];
