// Static data - Lists, types, sample data
export const EVENT_TYPES  = ["Workshop","Guest Speaker","Concert","Sports Meet","Seminar","Cultural Show","Exhibition","Charity Drive","Hackathon","Networking Event","Other"];
export const PURPOSES     = ["Educational","Charity / Fundraising","Social / Recreational","Cultural","Professional Development","Awareness Campaign","Other"];
export const AUDIENCES    = ["Faculty Students Only","All University Students","University-Wide (Staff + Students)","General Public","Invite Only"];
export const VENUES_LIST  = ["Main Auditorium","Open Air Amphitheatre","Main Field","Seminar Room A","Seminar Room B","Seminar Room C","Lecture Hall 1","Lecture Hall 2","Student Union Hall","Library Conference Room","Engineering Lab Block","Sports Complex","Faculty Boardroom","IT Lab Block","Other"];
export const FUND_SOURCES = ["Student Activity Fund","Department Budget","Ticket Sales","Sponsorship","Donor Contribution","Mixed Sources"];

export const MONTH_NAMES  = ["January","February","March","April","May","June","July","August","September","October","November","December"];
export const WEEK_DAYS    = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

export const TODAY = new Date();
export const CUR_YEAR = TODAY.getFullYear();
export const CUR_MONTH = TODAY.getMonth();

export const FORM_STEPS = [
  { id:1, label:"Event Info",   num:"01" },
  { id:2, label:"Organizers",   num:"02" },
  { id:3, label:"Venue",        num:"03" },
  { id:4, label:"Financials",   num:"04" },
  { id:5, label:"Risk & Safety", num:"05" }
];

export const VENUE_DATA = [
  { id:"v1",  name:"Main Auditorium",         capacity:600,  type:"Indoor",  block:"Main Building",   features:["Stage","AV System","AC","Projector"],         status:"available",  image:"🏛️" },
  { id:"v2",  name:"Open Air Amphitheatre",    capacity:800,  type:"Outdoor", block:"Central Grounds", features:["Stage","Sound System","Lighting Rig"],        status:"conflicted", image:"🎭" },
  { id:"v3",  name:"Main Field",               capacity:2000, type:"Outdoor", block:"Sports Complex",  features:["PA System","Floodlights","Equipment Room"],   status:"available",  image:"🏟️" },
  { id:"v4",  name:"Seminar Room A",           capacity:40,   type:"Indoor",  block:"Arts Block",      features:["Whiteboard","Projector","AC"],                 status:"booked",     image:"🏫" },
  { id:"v5",  name:"Seminar Room B",           capacity:40,   type:"Indoor",  block:"Arts Block",      features:["Whiteboard","Projector","AC"],                 status:"available",  image:"🏫" },
  { id:"v6",  name:"Seminar Room C",           capacity:50,   type:"Indoor",  block:"Science Block",   features:["Smartboard","Video Conf","AC"],                status:"available",  image:"🏫" },
  { id:"v7",  name:"Lecture Hall 1",           capacity:180,  type:"Indoor",  block:"Main Building",   features:["Fixed Seating","Projector","Mic","AC"],        status:"available",  image:"🎓" },
  { id:"v8",  name:"Lecture Hall 2",           capacity:180,  type:"Indoor",  block:"Main Building",   features:["Fixed Seating","Projector","Mic","AC"],        status:"booked",     image:"🎓" },
  { id:"v9",  name:"Student Union Hall",       capacity:300,  type:"Indoor",  block:"Student Centre",  features:["Stage","Kitchen","Sound","Flexible Seating"],  status:"available",  image:"🏢" },
  { id:"v10", name:"Library Conference Room",  capacity:20,   type:"Indoor",  block:"Library",         features:["Video Conf","Whiteboard","AC"],                status:"available",  image:"📚" },
  { id:"v11", name:"Engineering Lab Block",    capacity:60,   type:"Indoor",  block:"Eng. Faculty",    features:["Workbenches","Power Points","Projector"],      status:"conflicted", image:"⚙️" },
  { id:"v12", name:"Sports Complex",           capacity:500,  type:"Indoor",  block:"Sports Wing",     features:["Courts","Changing Rooms","PA","Scoreboard"],   status:"available",  image:"🏀" },
  { id:"v13", name:"Faculty Boardroom",        capacity:25,   type:"Indoor",  block:"Admin Building",  features:["Video Conf","Whiteboard","AC","Catering"],     status:"available",  image:"🪑" },
  { id:"v14", name:"IT Lab Block",             capacity:80,   type:"Indoor",  block:"IT Faculty",      features:["PCs","High-Speed WiFi","Projector","AC"],      status:"booked",     image:"💻" },
];

export const EVENTS_BY_DAY = {
  3:  [{ title:"Bio Lab Workshop",         type:"Workshop",      venue:"Engineering Lab Block",  org:"IEEE Branch",        conflict:false }],
  5:  [{ title:"Career Fair 2026",          type:"Exhibition",    venue:"Main Auditorium",        org:"Student Council",    conflict:true  },
       { title:"Open Rehearsal — Drama",    type:"Cultural Show", venue:"Main Auditorium",        org:"Drama Society",      conflict:true  }],
  8:  [{ title:"Guest Lecture: AI Ethics",  type:"Guest Speaker", venue:"Lecture Hall 1",         org:"CS Department",      conflict:false }],
  10: [{ title:"Basketball Semifinals",     type:"Sports Meet",   venue:"Sports Complex",         org:"Sports Club",        conflict:false }],
  11: [{ title:"Alumni Gathering",          type:"Networking",    venue:"Student Union Hall",     org:"Alumni Association", conflict:false }],
  15: [{ title:"Hackathon Day 1",           type:"Hackathon",     venue:"IT Lab Block",           org:"IEEE Branch",        conflict:false }],
  16: [{ title:"Hackathon Day 2",           type:"Hackathon",     venue:"IT Lab Block",           org:"IEEE Branch",        conflict:false }],
  18: [{ title:"Faculty Research Expo",     type:"Exhibition",    venue:"Main Auditorium",        org:"Research Dept",      conflict:false }],
  20: [{ title:"Music Night",               type:"Concert",       venue:"Open Air Amphitheatre",  org:"Music Club",         conflict:true  },
       { title:"Charity Gala",              type:"Charity Drive", venue:"Open Air Amphitheatre",  org:"Rotaract Club",      conflict:true  }],
  22: [{ title:"Freshers' Orientation",     type:"Seminar",       venue:"Main Auditorium",        org:"Student Council",    conflict:false }],
  25: [{ title:"Photography Workshop",      type:"Workshop",      venue:"Seminar Room A",         org:"Photography Club",   conflict:false }],
  28: [{ title:"Annual Sports Meet",        type:"Sports Meet",   venue:"Main Field",             org:"Sports Council",     conflict:false }],
};

export const CONFLICTS = [
  { date:`${CUR_MONTH+1}/5`,  time:"10:00 AM", title:"Venue Overlap: Main Auditorium",   desc:"Career Fair vs. Open Rehearsal — Drama Society" },
  { date:`${CUR_MONTH+1}/20`, time:"06:00 PM", title:"Venue Overlap: Amphitheatre",      desc:"Music Night vs. Charity Gala — same outdoor stage" },
];

export const TYPE_COLORS = {
  "Workshop":      { bg:"#EBF1F9",   text:"#053668",   dot:"#053668"  },
  "Exhibition":    { bg:"#FFF0E3",   text:"#7A3300",   dot:"#FF7100" },
  "Cultural Show": { bg:"#FEF3C7",   text:"#7A5F00",   dot:"#D97706"  },
  "Guest Speaker": { bg:"#E6F4ED",   text:"#1B7F4B",   dot:"#1B7F4B" },
  "Sports Meet":   { bg:"#F0FDF4",   text:"#166534",   dot:"#22C55E"  },
  "Networking":    { bg:"#EBF1F9",   text:"#053668",   dot:"#053668"  },
  "Hackathon":     { bg:"#EBF1F9",   text:"#053668",   dot:"#053668"  },
  "Concert":       { bg:"#FDF2F8",   text:"#7E22CE",   dot:"#A855F7"  },
  "Charity Drive": { bg:"#FEF2F2",   text:"#D93025",   dot:"#D93025"  },
  "Seminar":       { bg:"#F0F9FF",   text:"#0369A1",   dot:"#0EA5E9"  },
  "Conference":    { bg:"#EBF1F9",   text:"#053668",   dot:"#053668"  },
};

export const UPCOMING_EVENTS = [
  { id:1, title:"IEEE Annual Tech Symposium", date:"Mar 28, 2026", time:"9:00 AM",  venue:"Main Auditorium",       type:"Conference", attendees:320, status:"approved"   },
  { id:2, title:"Hackathon Day 1",            date:"Apr 3, 2026",  time:"8:00 AM",  venue:"IT Lab Block",          type:"Hackathon",  attendees:80,  status:"approved"   },
  { id:3, title:"Photography Workshop",       date:"Apr 10, 2026", time:"2:00 PM",  venue:"Seminar Room A",        type:"Workshop",   attendees:35,  status:"pending"    },
  { id:4, title:"Music Night",                date:"Apr 20, 2026", time:"6:00 PM",  venue:"Open Air Amphitheatre", type:"Concert",    attendees:500, status:"conflicted" },
];

export const RECENT_REQUESTS = [
  { id:1, title:"Charity Gala Night",       submitted:"Mar 20, 2026", type:"Charity Drive", status:"pending",  venue:"Open Air Amphitheatre" },
  { id:2, title:"Guest Lecture: AI Ethics", submitted:"Mar 18, 2026", type:"Guest Speaker", status:"approved", venue:"Lecture Hall 1"        },
  { id:3, title:"Annual Sports Meet",       submitted:"Mar 15, 2026", type:"Sports Meet",   status:"approved", venue:"Main Field"             },
  { id:4, title:"Bio Lab Workshop",         submitted:"Mar 12, 2026", type:"Workshop",      status:"rejected", venue:"Engineering Lab Block"  },
  { id:5, title:"Freshers' Orientation",    submitted:"Mar 8, 2026",  type:"Seminar",       status:"approved", venue:"Main Auditorium"        },
];

export const NOTIFICATIONS = [
  { id:1, text:"Your request for 'Music Night' has a venue conflict.",   time:"2h ago",  type:"conflict" },
  { id:2, text:"'Guest Lecture: AI Ethics' has been approved.",          time:"5h ago",  type:"approved" },
  { id:3, text:"Reminder: IEEE Symposium is in 4 days.",                 time:"1d ago",  type:"reminder" },
  { id:4, text:"'Bio Lab Workshop' request was rejected. See feedback.", time:"2d ago",  type:"rejected" },
];

export const FACULTIES = [
  "Faculty of Computing",
  "Faculty of Engineering",
  "Faculty of Business",
  "Faculty of Humanities & Sciences",
  "Faculty of Graduate Studies",
  "School of Architecture",
  "SLIIT Academy",
  "Faculty of Hospitality & Culinary"
];

export const CLUBS = [
  "SLIIT FOSS Community",
  "SLIIT Robotics Club",
  "SLIIT Mozi Club",
  "Rotaract Club of SLIIT",
  "SLIIT Leo Club",
  "SLIIT IEEE Student Branch",
  "SLIIT Gavel Club",
  "SLIIT AIESEC",
  "SLIIT Sports Council",
  "SLIIT Arts Society",
  "SLIIT Music Club",
  "SLIIT Drama Society",
  "SLIIT Photography Club",
  "SLIIT Nature Club",
  "SLIIT Media Unit",
  "SLIIT Gaming Community",
  "Software Engineering Community (SEC)",
  "Interactive Media Association (IMA)",
  "Cyber Security Community (CSC)",
  "Data Science Community (DSC)"
];

export const ORGANIZING_BODIES = [...FACULTIES, ...CLUBS];

