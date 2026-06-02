// ================================================================
// LEADFLOW CRM — DUMMY DATA (Generic EdTech Edition)
// ================================================================

export type LeadStatus =
  | "New"
  | "Contacted"
  | "Qualified"
  | "Proposal Sent"
  | "Negotiation"
  | "Enrolled"
  | "Not Interested"
  | "Lost";

export type LeadScore = "Hot" | "Warm" | "Cold";
export type LeadPriority = "High" | "Medium" | "Low";

export type ActivityType = "call" | "note" | "status" | "followup" | "email" | "whatsapp" | "meeting";

export interface ActivityItem {
  time: string;
  type: ActivityType;
  text: string;
  by?: string;
}

export interface CallLog {
  id: string;
  date: string;
  time: string;
  result: "Connected" | "Not Connected" | "Busy" | "Wrong Number";
  duration?: string;
  remarks?: string;
  by: string;
}

export interface FollowUp {
  id: string;
  date: string;
  time: string;
  status: "Pending" | "Completed" | "Missed";
  remarks?: string;
  createdBy: string;
}

export interface CounselingNote {
  targetProgram: string;
  courseInterest: string;
  engagementLevel: string;
  previousExperience: string;
  budget: string;
  painPoints: string;
  createdAt: string;
  createdBy: string;
}

export interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string;
  source: string;
  service: string;
  status: LeadStatus;
  score: LeadScore;
  assignedTo: string;
  city: string;
  priority: LeadPriority;
  createdAt: string;
  followUpDate: string;
  notes: string;
  activity: ActivityItem[];
  callLogs: CallLog[];
  followUps: FollowUp[];
  counselingNote?: CounselingNote;
  parentName?: string;
  parentPhone?: string;
  lostReason?: string;
  // Generic lead scoring fields
  intakeTimeline?: "Immediate" | "1-3 months" | "3-6 months" | "6+ months";
  education?: "Graduate" | "Final Year" | "Working Professional" | "Post Graduate";
  engagementLevel?: "Just Exploring" | "Actively Researching" | "Ready to Enroll";
  budgetReadiness?: "High" | "Medium" | "Low";
  leadScore?: number;
  // Course interest tracking
  courseInterests?: string[];
}

export interface SalesRep {
  id: string;
  name: string;
  avatar: string;
  role: "rep" | "manager" | "director";
  team: string;
  leadsAssigned: number;
  callsToday: number;
  conversionRate: number;
  wonThisMonth: number;
}

// ── PIPELINE STAGES ──────────────────────────────────────────────
export const PIPELINE_STAGES: {
  status: LeadStatus;
  label: string;
  color: string;
  bg: string;
  border: string;
}[] = [
  { status: "New",           label: "New",           color: "#1D4ED8", bg: "#EFF6FF", border: "#BFDBFE" },
  { status: "Contacted",     label: "Contacted",     color: "#475569", bg: "#F8FAFC", border: "#CBD5E1" },
  { status: "Qualified",     label: "Qualified",     color: "#0369A1", bg: "#F0F9FF", border: "#BAE6FD" },
  { status: "Proposal Sent", label: "Proposal Sent", color: "#7C3AED", bg: "#FAF5FF", border: "#E9D5FF" },
  { status: "Negotiation",   label: "Negotiation",   color: "#B45309", bg: "#FFFBEB", border: "#FDE68A" },
  { status: "Enrolled",      label: "Enrolled",      color: "#065F46", bg: "#ECFDF5", border: "#A7F3D0" },
];

export const STATUS_CONFIG: Record<LeadStatus, { bg: string; text: string; border: string }> = {
  "New":           { bg: "#EFF6FF",  text: "#1D4ED8", border: "#BFDBFE" },
  "Contacted":     { bg: "#F8FAFC",  text: "#374151", border: "#CBD5E1" },
  "Qualified":     { bg: "#F0F9FF",  text: "#0369A1", border: "#BAE6FD" },
  "Proposal Sent": { bg: "#FAF5FF",  text: "#7E22CE", border: "#DDD6FE" },
  "Negotiation":   { bg: "#FFFBEB",  text: "#B45309", border: "#FDE68A" },
  "Enrolled":      { bg: "#ECFDF5",  text: "#065F46", border: "#A7F3D0" },
  "Not Interested":{ bg: "#FEF2F2",  text: "#B91C1C", border: "#FECACA" },
  "Lost":          { bg: "#FEF2F2",  text: "#B91C1C", border: "#FECACA" },
};

export const SCORE_CONFIG: Record<LeadScore, { bg: string; text: string; dot: string }> = {
  Hot:  { bg: "#FFF1F2", text: "#BE123C", dot: "#EF4444" },
  Warm: { bg: "#FFFBEB", text: "#B45309", dot: "#F59E0B" },
  Cold: { bg: "#EFF6FF", text: "#2563EB", dot: "#60A5FA" },
};

export const LOST_REASONS = [
  "Too Expensive",
  "Joined Competitor",
  "Preparing Independently",
  "Not Eligible",
  "No Response",
  "Parent / Sponsor Rejected",
  "Financial Issue",
  "Program Not Suitable",
  "Timing Not Right",
];

export const COURSE_OPTIONS = [
  "Foundation Program",
  "Advanced Program",
  "Crash Course",
  "Weekend Batch",
  "Online Live",
  "Recorded Course",
  "Test Series",
  "One-on-One Mentorship",
  "Interview Prep",
];

// ── SALES REPS ──────────────────────────────────────────────────
export const salesReps: SalesRep[] = [
  { id: "rep-1", name: "Aanya Sharma",  avatar: "AS", role: "rep",      team: "Alpha", leadsAssigned: 28, callsToday: 18, conversionRate: 34, wonThisMonth: 8  },
  { id: "rep-2", name: "Rohan Mehta",   avatar: "RM", role: "rep",      team: "Alpha", leadsAssigned: 31, callsToday: 22, conversionRate: 28, wonThisMonth: 9  },
  { id: "rep-3", name: "Priya Nair",    avatar: "PN", role: "rep",      team: "Beta",  leadsAssigned: 19, callsToday: 14, conversionRate: 41, wonThisMonth: 8  },
  { id: "rep-4", name: "Kabir Singh",   avatar: "KS", role: "rep",      team: "Beta",  leadsAssigned: 27, callsToday: 20, conversionRate: 22, wonThisMonth: 6  },
  { id: "rep-5", name: "Meera Iyer",    avatar: "MI", role: "rep",      team: "Gamma", leadsAssigned: 22, callsToday: 16, conversionRate: 36, wonThisMonth: 8  },
  { id: "rep-6", name: "Aryan Gupta",   avatar: "AG", role: "rep",      team: "Alpha", leadsAssigned: 18, callsToday: 12, conversionRate: 31, wonThisMonth: 6  },
  { id: "rep-7", name: "Divya Reddy",   avatar: "DR", role: "rep",      team: "Gamma", leadsAssigned: 21, callsToday: 15, conversionRate: 38, wonThisMonth: 7  },
];

export const managers: SalesRep[] = [
  { id: "mgr-1", name: "Vikram Bose",  avatar: "VB", role: "manager", team: "Alpha", leadsAssigned: 73, callsToday: 52, conversionRate: 31, wonThisMonth: 23 },
  { id: "mgr-2", name: "Sunita Rao",   avatar: "SR", role: "manager", team: "Beta",  leadsAssigned: 46, callsToday: 34, conversionRate: 33, wonThisMonth: 14 },
  { id: "mgr-3", name: "Amit Khanna",  avatar: "AK", role: "manager", team: "Gamma", leadsAssigned: 43, callsToday: 31, conversionRate: 37, wonThisMonth: 15 },
];

// ── LEADS ────────────────────────────────────────────────────────
export const leads: Lead[] = [
  {
    id: "L-1001",
    name: "Deepak Verma",
    phone: "+91 98100 11234",
    email: "deepak.verma@gmail.com",
    source: "Website",
    service: "Advanced Program",
    status: "Negotiation",
    score: "Hot",
    assignedTo: "Aanya Sharma",
    city: "Delhi",
    priority: "High",
    createdAt: "2025-05-20",
    followUpDate: "2025-05-28",
    notes: "Very interested in the Advanced Program. Working professional, prefers weekend batches. Offer early bird discount on follow-up.",
    intakeTimeline: "Immediate",
    education: "Working Professional",
    engagementLevel: "Ready to Enroll",
    budgetReadiness: "Medium",
    leadScore: 72,
    courseInterests: ["Advanced Program", "Test Series"],
    counselingNote: {
      targetProgram: "Advanced Program — Weekend Batch",
      courseInterest: "Advanced Program, Test Series Add-on",
      engagementLevel: "Ready to Enroll",
      previousExperience: "Self-study for 1 year",
      budget: "₹40,000 – ₹50,000",
      painPoints: "Needs structured curriculum. Weekend batch is a must. Budget slightly tight.",
      createdAt: "2025-05-20",
      createdBy: "Aanya Sharma",
    },
    activity: [
      { time: "10:30 AM · 20 May", type: "call",     text: "First call placed — answered on 2nd ring", by: "Aanya Sharma" },
      { time: "10:35 AM · 20 May", type: "note",     text: "Interested in Advanced batch, asked about weekend timings and study material", by: "Aanya Sharma" },
      { time: "10:40 AM · 20 May", type: "status",   text: "Status updated: New → Contacted", by: "Aanya Sharma" },
      { time: "11:00 AM · 22 May", type: "call",     text: "Follow-up call — discussed pricing, slight hesitation on budget", by: "Aanya Sharma" },
      { time: "11:15 AM · 22 May", type: "whatsapp", text: "Sent brochure and fee structure on WhatsApp", by: "Aanya Sharma" },
      { time: "9:00 AM  · 25 May", type: "followup", text: "Reminder set: call back with early bird discount offer", by: "Aanya Sharma" },
      { time: "11:30 AM · 26 May", type: "status",   text: "Status updated: Qualified → Negotiation", by: "Aanya Sharma" },
    ],
    callLogs: [
      { id: "cl-1001-1", date: "2025-05-20", time: "10:30 AM", result: "Connected",     duration: "12 min", remarks: "Discussed batch timings and fee structure", by: "Aanya Sharma" },
      { id: "cl-1001-2", date: "2025-05-22", time: "11:00 AM", result: "Connected",     duration: "8 min",  remarks: "Budget concern, considering early bird discount", by: "Aanya Sharma" },
    ],
    followUps: [
      { id: "fu-1001-1", date: "2025-05-28", time: "11:00 AM", status: "Pending", remarks: "Call with early bird discount offer", createdBy: "Aanya Sharma" },
    ],
  },

  {
    id: "L-1002",
    name: "Sneha Kulkarni",
    phone: "+91 99200 22345",
    email: "sneha.k@outlook.com",
    source: "Referral",
    service: "Foundation Program",
    status: "Proposal Sent",
    score: "Hot",
    assignedTo: "Aanya Sharma",
    city: "Mumbai",
    priority: "High",
    createdAt: "2025-05-19",
    followUpDate: "2025-05-27",
    notes: "Fresh graduate, full-time student. Parent referred. Interested in Foundation Program with add-ons. Needs accommodation info.",
    intakeTimeline: "Immediate",
    education: "Graduate",
    engagementLevel: "Ready to Enroll",
    budgetReadiness: "High",
    leadScore: 85,
    courseInterests: ["Foundation Program", "One-on-One Mentorship", "Interview Prep"],
    parentName: "Mr. Kulkarni",
    parentPhone: "+91 99200 22340",
    counselingNote: {
      targetProgram: "Foundation Program — Full Year",
      courseInterest: "Foundation + Mentorship",
      engagementLevel: "Ready to Enroll",
      previousExperience: "None",
      budget: "₹1,20,000 (Full program)",
      painPoints: "Needs accommodation guidance. Parent wants to speak before finalising.",
      createdAt: "2025-05-19",
      createdBy: "Aanya Sharma",
    },
    activity: [
      { time: "9:00 AM · 19 May",  type: "call",     text: "Introductory call — very focused, asked detailed curriculum questions", by: "Aanya Sharma" },
      { time: "9:45 AM · 19 May",  type: "status",   text: "Status: New → Qualified", by: "Aanya Sharma" },
      { time: "2:00 PM · 21 May",  type: "email",    text: "Sent full program brochure and faculty profiles", by: "Aanya Sharma" },
      { time: "4:30 PM · 23 May",  type: "call",     text: "30-min call — discussed program structure, schedule", by: "Aanya Sharma" },
      { time: "5:00 PM · 23 May",  type: "note",     text: "Parent will also join next call.", by: "Aanya Sharma" },
      { time: "10:00 AM · 25 May", type: "status",   text: "Status: Qualified → Proposal Sent", by: "Aanya Sharma" },
    ],
    callLogs: [
      { id: "cl-1002-1", date: "2025-05-19", time: "9:00 AM",  result: "Connected", duration: "25 min", remarks: "Curriculum discussion confirmed", by: "Aanya Sharma" },
      { id: "cl-1002-2", date: "2025-05-23", time: "4:30 PM",  result: "Connected", duration: "30 min", remarks: "Faculty discussion, accommodation query", by: "Aanya Sharma" },
    ],
    followUps: [
      { id: "fu-1002-1", date: "2025-05-27", time: "10:00 AM", status: "Pending", remarks: "Joint call with parent before enrollment", createdBy: "Aanya Sharma" },
    ],
  },

  {
    id: "L-1003",
    name: "Arjun Pillai",
    phone: "+91 97300 33456",
    email: "arjun.pillai@yahoo.com",
    source: "Cold Call",
    service: "Online Live Batch",
    status: "Qualified",
    score: "Warm",
    assignedTo: "Aanya Sharma",
    city: "Kochi",
    priority: "Medium",
    createdAt: "2025-05-18",
    followUpDate: "2025-05-29",
    notes: "Interested in online batch. Remote location, needs online-only mode. Budget is limited around ₹20,000-25,000.",
    intakeTimeline: "1-3 months",
    education: "Graduate",
    engagementLevel: "Actively Researching",
    budgetReadiness: "Low",
    leadScore: 42,
    courseInterests: ["Online Live", "Recorded Course"],
    counselingNote: {
      targetProgram: "Online Live Program",
      courseInterest: "Online Live, Recorded backup",
      engagementLevel: "Actively Researching",
      previousExperience: "None",
      budget: "₹20,000 – ₹25,000",
      painPoints: "Remote location, online only. Budget constraint. Needs EMI.",
      createdAt: "2025-05-18",
      createdBy: "Aanya Sharma",
    },
    activity: [
      { time: "3:00 PM · 18 May",  type: "call",     text: "Cold call answered — showed initial interest in online batch", by: "Aanya Sharma" },
      { time: "3:15 PM · 18 May",  type: "note",     text: "Needs online mode, budget ₹20-25k, EMI preferred", by: "Aanya Sharma" },
      { time: "3:20 PM · 18 May",  type: "status",   text: "Status: New → Contacted", by: "Aanya Sharma" },
      { time: "10:00 AM · 24 May", type: "call",     text: "Follow-up — asked about live vs recorded class options", by: "Aanya Sharma" },
      { time: "10:30 AM · 24 May", type: "status",   text: "Status: Contacted → Qualified", by: "Aanya Sharma" },
    ],
    callLogs: [
      { id: "cl-1003-1", date: "2025-05-18", time: "3:00 PM",  result: "Connected", duration: "6 min",  remarks: "Online batch interest, checking options", by: "Aanya Sharma" },
      { id: "cl-1003-2", date: "2025-05-24", time: "10:00 AM", result: "Connected", duration: "10 min", remarks: "EMI discussion, need manager approval", by: "Aanya Sharma" },
    ],
    followUps: [
      { id: "fu-1003-1", date: "2025-05-29", time: "6:00 PM", status: "Pending", remarks: "Share demo access and EMI option details", createdBy: "Aanya Sharma" },
    ],
  },

  {
    id: "L-1004",
    name: "Fatima Sheikh",
    phone: "+91 96400 44567",
    email: "fatima.sheikh@corp.in",
    source: "Instagram Ad",
    service: "Foundation Program",
    status: "New",
    score: "Warm",
    assignedTo: "Aanya Sharma",
    city: "Hyderabad",
    priority: "Medium",
    createdAt: "2025-05-22",
    followUpDate: "2025-05-28",
    notes: "Inbound from Instagram ad. Working professional planning a career shift. Has not been contacted yet.",
    intakeTimeline: "1-3 months",
    education: "Working Professional",
    engagementLevel: "Just Exploring",
    budgetReadiness: "Medium",
    leadScore: 35,
    courseInterests: ["Foundation Program", "Weekend Batch"],
    activity: [
      { time: "8:00 AM · 22 May", type: "note", text: "Lead captured via Instagram ad — filled enquiry form", by: "System" },
    ],
    callLogs: [],
    followUps: [
      { id: "fu-1004-1", date: "2025-05-28", time: "10:00 AM", status: "Pending", remarks: "First contact — qualifying call", createdBy: "Aanya Sharma" },
    ],
  },

  {
    id: "L-1005",
    name: "Rahul Saxena",
    phone: "+91 95500 55678",
    email: "r.saxena@gmail.com",
    source: "Seminar",
    service: "Foundation Program",
    status: "Enrolled",
    score: "Hot",
    assignedTo: "Aanya Sharma",
    city: "Pune",
    priority: "High",
    createdAt: "2025-05-10",
    followUpDate: "",
    notes: "Closed! Attended free seminar. Quick decision maker. Enrolled in Foundation Program. Upsell Test Series add-on in 3 months.",
    intakeTimeline: "Immediate",
    education: "Graduate",
    engagementLevel: "Ready to Enroll",
    budgetReadiness: "High",
    leadScore: 92,
    courseInterests: ["Foundation Program", "Test Series"],
    counselingNote: {
      targetProgram: "Foundation Program — Full Year",
      courseInterest: "Foundation + Test Series",
      engagementLevel: "Ready to Enroll",
      previousExperience: "Short term offline coaching",
      budget: "₹72,000 (Full year, paid in full)",
      painPoints: "Wants structured curriculum. Seminar quality impressed him.",
      createdAt: "2025-05-12",
      createdBy: "Aanya Sharma",
    },
    activity: [
      { time: "11:00 AM · 12 May", type: "call",   text: "Post-seminar follow-up — very positive response", by: "Aanya Sharma" },
      { time: "2:00 PM  · 13 May", type: "email",  text: "Sent program brochure and enrollment form", by: "Aanya Sharma" },
      { time: "11:30 AM · 15 May", type: "status", text: "Status: Proposal Sent → Negotiation", by: "Aanya Sharma" },
      { time: "12:00 PM · 15 May", type: "status", text: "Status: Negotiation → Enrolled", by: "Aanya Sharma" },
      { time: "12:05 PM · 15 May", type: "note",   text: "Fee paid in full ₹72,000. Onboarding scheduled for May 20.", by: "Aanya Sharma" },
    ],
    callLogs: [
      { id: "cl-1005-1", date: "2025-05-12", time: "11:00 AM", result: "Connected", duration: "18 min", remarks: "Very positive, wants to enroll immediately", by: "Aanya Sharma" },
    ],
    followUps: [],
  },

  {
    id: "L-1006",
    name: "Tanya Malhotra",
    phone: "+91 94600 66789",
    email: "tanya.m@gmail.com",
    source: "Website",
    service: "Crash Course",
    status: "Lost",
    score: "Cold",
    assignedTo: "Aanya Sharma",
    city: "Delhi",
    priority: "Low",
    createdAt: "2025-05-05",
    followUpDate: "",
    notes: "Lost to competitor. Price was the deciding factor. Highlight faculty credentials and success rate next time.",
    intakeTimeline: "Immediate",
    education: "Graduate",
    engagementLevel: "Actively Researching",
    budgetReadiness: "Low",
    leadScore: 18,
    lostReason: "Joined Competitor — Price difference of ₹8,000 was deciding factor.",
    courseInterests: ["Crash Course"],
    activity: [
      { time: "2:00 PM · 08 May", type: "call",   text: "Final call — student declined", by: "Aanya Sharma" },
      { time: "2:10 PM · 08 May", type: "status", text: "Status: Negotiation → Lost", by: "Aanya Sharma" },
      { time: "2:15 PM · 08 May", type: "note",   text: "Chose competitor. Price difference was main factor.", by: "Aanya Sharma" },
    ],
    callLogs: [
      { id: "cl-1006-1", date: "2025-05-08", time: "2:00 PM", result: "Connected", duration: "5 min", remarks: "Chose competitor, price was main factor", by: "Aanya Sharma" },
    ],
    followUps: [],
  },

  {
    id: "L-1007",
    name: "Nikhil Desai",
    phone: "+91 93700 77890",
    email: "nikhil.desai@gmail.com",
    source: "Referral",
    service: "Foundation Program",
    status: "Contacted",
    score: "Warm",
    assignedTo: "Aanya Sharma",
    city: "Ahmedabad",
    priority: "Medium",
    createdAt: "2025-05-21",
    followUpDate: "2025-05-30",
    notes: "Referred by Rahul Saxena. Commerce background, exploring options. Needs counseling session.",
    intakeTimeline: "3-6 months",
    education: "Graduate",
    engagementLevel: "Just Exploring",
    budgetReadiness: "Medium",
    leadScore: 48,
    courseInterests: ["Foundation Program", "Recorded Course"],
    activity: [
      { time: "4:00 PM · 21 May", type: "call",     text: "First contact — positive, exploring program options", by: "Aanya Sharma" },
      { time: "4:10 PM · 21 May", type: "status",   text: "Status: New → Contacted", by: "Aanya Sharma" },
      { time: "4:30 PM · 21 May", type: "followup", text: "Counseling session scheduled May 30 at 3 PM", by: "Aanya Sharma" },
    ],
    callLogs: [
      { id: "cl-1007-1", date: "2025-05-21", time: "4:00 PM", result: "Connected", duration: "8 min", remarks: "Intro call, scheduling counseling session", by: "Aanya Sharma" },
    ],
    followUps: [
      { id: "fu-1007-1", date: "2025-05-30", time: "3:00 PM", status: "Pending", remarks: "Counseling session — program guidance", createdBy: "Aanya Sharma" },
    ],
  },

  {
    id: "L-1008",
    name: "Kavita Joshi",
    phone: "+91 92800 88901",
    email: "kavita.joshi@gmail.com",
    source: "Cold Call",
    service: "Weekend Batch",
    status: "Not Interested",
    score: "Cold",
    assignedTo: "Aanya Sharma",
    city: "Jaipur",
    priority: "Low",
    createdAt: "2025-05-22",
    followUpDate: "",
    notes: "No answer across 3 attempts. Number appears invalid. Marked as not interested.",
    lostReason: "No Response — 3 attempts made, number appears invalid.",
    courseInterests: [],
    activity: [
      { time: "9:00 AM · 22 May",  type: "call",   text: "No answer — attempt 1", by: "Aanya Sharma" },
      { time: "11:00 AM · 22 May", type: "call",   text: "No answer — attempt 2", by: "Aanya Sharma" },
      { time: "2:00 PM  · 22 May", type: "call",   text: "No answer — attempt 3, number appears invalid", by: "Aanya Sharma" },
      { time: "2:30 PM  · 22 May", type: "status", text: "Status: New → Not Interested", by: "Aanya Sharma" },
    ],
    callLogs: [
      { id: "cl-1008-1", date: "2025-05-22", time: "9:00 AM",  result: "Not Connected", remarks: "No answer", by: "Aanya Sharma" },
      { id: "cl-1008-2", date: "2025-05-22", time: "11:00 AM", result: "Not Connected", remarks: "No answer", by: "Aanya Sharma" },
      { id: "cl-1008-3", date: "2025-05-22", time: "2:00 PM",  result: "Not Connected", remarks: "Number appears invalid", by: "Aanya Sharma" },
    ],
    followUps: [],
  },

  {
    id: "L-1009",
    name: "Siddharth Rao",
    phone: "+91 91900 99012",
    email: "sid.rao@gmail.com",
    source: "YouTube",
    service: "Advanced Program",
    status: "Qualified",
    score: "Hot",
    assignedTo: "Aanya Sharma",
    city: "Bangalore",
    priority: "High",
    createdAt: "2025-05-23",
    followUpDate: "2025-05-28",
    notes: "Found us via YouTube content. Very engaged. Has strong foundations but needs structured advanced program.",
    intakeTimeline: "Immediate",
    education: "Working Professional",
    engagementLevel: "Ready to Enroll",
    budgetReadiness: "High",
    leadScore: 76,
    courseInterests: ["Advanced Program", "One-on-One Mentorship"],
    counselingNote: {
      targetProgram: "Advanced Program — Intensive",
      courseInterest: "Advanced Program + Mentorship",
      engagementLevel: "Ready to Enroll",
      previousExperience: "Self-study via online content",
      budget: "₹18,000 – ₹25,000",
      painPoints: "Has knowledge but lacks structured delivery. Content quality is the key factor.",
      createdAt: "2025-05-23",
      createdBy: "Aanya Sharma",
    },
    activity: [
      { time: "10:00 AM · 23 May", type: "call",     text: "First call — very engaged, asked detailed curriculum questions", by: "Aanya Sharma" },
      { time: "10:40 AM · 23 May", type: "status",   text: "Status: New → Qualified", by: "Aanya Sharma" },
      { time: "11:00 AM · 23 May", type: "email",    text: "Sent advanced program study plan and faculty profile", by: "Aanya Sharma" },
      { time: "3:00 PM  · 26 May", type: "call",     text: "Second call — reviewed sample material, highly impressed", by: "Aanya Sharma" },
      { time: "3:25 PM  · 26 May", type: "followup", text: "Session scheduled for May 28 at 11 AM", by: "Aanya Sharma" },
    ],
    callLogs: [
      { id: "cl-1009-1", date: "2025-05-23", time: "10:00 AM", result: "Connected", duration: "22 min", remarks: "Discussed program, sent study plan", by: "Aanya Sharma" },
      { id: "cl-1009-2", date: "2025-05-26", time: "3:00 PM",  result: "Connected", duration: "15 min", remarks: "Very impressed, session scheduled", by: "Aanya Sharma" },
    ],
    followUps: [
      { id: "fu-1009-1", date: "2025-05-28", time: "11:00 AM", status: "Pending", remarks: "Intro session — show advanced module", createdBy: "Aanya Sharma" },
    ],
  },

  {
    id: "L-1010",
    name: "Pooja Nambiar",
    phone: "+91 90100 10123",
    email: "pooja.n@gmail.com",
    source: "Seminar",
    service: "Foundation Program",
    status: "Negotiation",
    score: "Hot",
    assignedTo: "Aanya Sharma",
    city: "Chennai",
    priority: "High",
    createdAt: "2025-05-16",
    followUpDate: "2025-05-27",
    notes: "Attended offline seminar. Serious candidate. Sponsors have approved fees. Wants to start from June 1 batch. Ready to enroll.",
    intakeTimeline: "Immediate",
    education: "Graduate",
    engagementLevel: "Ready to Enroll",
    budgetReadiness: "High",
    leadScore: 88,
    courseInterests: ["Foundation Program", "Test Series", "Interview Prep"],
    parentName: "Mr. Nambiar",
    parentPhone: "+91 90100 10120",
    counselingNote: {
      targetProgram: "Foundation Program — June Batch",
      courseInterest: "Foundation + Test Series",
      engagementLevel: "Ready to Enroll",
      previousExperience: "2 years with another institute",
      budget: "₹45,000",
      painPoints: "Previous coaching was too generic. Needs specialized structured approach.",
      createdAt: "2025-05-16",
      createdBy: "Aanya Sharma",
    },
    activity: [
      { time: "9:00 AM  · 16 May", type: "note",   text: "Met at seminar — very serious candidate", by: "Aanya Sharma" },
      { time: "11:00 AM · 17 May", type: "call",   text: "Follow-up — sponsor approved, wants June batch", by: "Aanya Sharma" },
      { time: "3:00 PM  · 20 May", type: "email",  text: "Sent enrollment form and payment details", by: "Aanya Sharma" },
      { time: "10:00 AM · 23 May", type: "status", text: "Status: Proposal Sent → Negotiation", by: "Aanya Sharma" },
    ],
    callLogs: [
      { id: "cl-1010-1", date: "2025-05-17", time: "11:00 AM", result: "Connected", duration: "14 min", remarks: "Sponsor-approved, June 1 batch seat needed", by: "Aanya Sharma" },
    ],
    followUps: [
      { id: "fu-1010-1", date: "2025-05-27", time: "9:00 AM", status: "Pending", remarks: "Payment confirmation — June 1 seat is urgent", createdBy: "Aanya Sharma" },
    ],
  },

  {
    id: "L-1011",
    name: "Harish Kumar",
    phone: "+91 89200 11234",
    email: "h.kumar@gmail.com",
    source: "Website",
    service: "Foundation Program",
    status: "New",
    score: "Warm",
    assignedTo: "Aanya Sharma",
    city: "Lucknow",
    priority: "Medium",
    createdAt: "2025-05-26",
    followUpDate: "2025-05-29",
    notes: "Just submitted enquiry form. Mentions interest in foundation program.",
    intakeTimeline: "3-6 months",
    education: "Graduate",
    engagementLevel: "Just Exploring",
    budgetReadiness: "Medium",
    leadScore: 30,
    courseInterests: ["Foundation Program"],
    activity: [
      { time: "2:30 PM · 26 May", type: "note", text: "Lead captured via website enquiry form", by: "System" },
    ],
    callLogs: [],
    followUps: [
      { id: "fu-1011-1", date: "2025-05-29", time: "10:00 AM", status: "Pending", remarks: "First qualifying call", createdBy: "Aanya Sharma" },
    ],
  },

  {
    id: "L-1012",
    name: "Reema Kapoor",
    phone: "+91 88300 22345",
    email: "reema.k@gmail.com",
    source: "Referral",
    service: "Online Live",
    status: "Contacted",
    score: "Cold",
    assignedTo: "Aanya Sharma",
    city: "Delhi",
    priority: "Low",
    createdAt: "2025-05-15",
    followUpDate: "2025-06-02",
    notes: "Student. Budget very limited — ₹10-12k max. Check if scholarship or installment plan is available.",
    intakeTimeline: "3-6 months",
    education: "Final Year",
    engagementLevel: "Just Exploring",
    budgetReadiness: "Low",
    leadScore: 22,
    courseInterests: ["Online Live", "Recorded Course"],
    activity: [
      { time: "11:00 AM · 15 May", type: "call",   text: "First call — interested but budget constrained", by: "Aanya Sharma" },
      { time: "11:20 AM · 15 May", type: "status", text: "Status: New → Contacted", by: "Aanya Sharma" },
      { time: "11:30 AM · 15 May", type: "note",   text: "Flagged for scholarship check with manager", by: "Aanya Sharma" },
    ],
    callLogs: [
      { id: "cl-1012-1", date: "2025-05-15", time: "11:00 AM", result: "Connected", duration: "7 min", remarks: "Budget ₹10-12k, needs scholarship or installment", by: "Aanya Sharma" },
    ],
    followUps: [
      { id: "fu-1012-1", date: "2025-06-02", time: "11:00 AM", status: "Pending", remarks: "Scholarship decision — call back", createdBy: "Aanya Sharma" },
    ],
  },

  {
    id: "L-1013",
    name: "Vikash Pandey",
    phone: "+91 87400 33456",
    email: "vikash.p@gmail.com",
    source: "Cold Call",
    service: "Crash Course",
    status: "Contacted",
    score: "Warm",
    assignedTo: "Aanya Sharma",
    city: "Varanasi",
    priority: "Medium",
    createdAt: "2025-05-20",
    followUpDate: "2025-05-28",
    notes: "First time caller. Showed interest in crash course but was travelling. Callback confirmed Monday.",
    intakeTimeline: "1-3 months",
    education: "Graduate",
    engagementLevel: "Just Exploring",
    budgetReadiness: "Medium",
    leadScore: 38,
    courseInterests: ["Crash Course"],
    activity: [
      { time: "2:00 PM · 20 May", type: "call",     text: "Cold call — answered, showed interest but travelling", by: "Aanya Sharma" },
      { time: "2:20 PM · 20 May", type: "status",   text: "Status: New → Contacted", by: "Aanya Sharma" },
      { time: "2:30 PM · 20 May", type: "followup", text: "Callback confirmed — Monday May 28 at 11 AM", by: "Aanya Sharma" },
    ],
    callLogs: [
      { id: "cl-1013-1", date: "2025-05-20", time: "2:00 PM", result: "Connected", duration: "5 min", remarks: "Travelling, confirmed Monday callback", by: "Aanya Sharma" },
    ],
    followUps: [
      { id: "fu-1013-1", date: "2025-05-28", time: "11:00 AM", status: "Pending", remarks: "Confirmed callback — explain crash course roadmap", createdBy: "Aanya Sharma" },
    ],
  },

  {
    id: "L-1014",
    name: "Ananya Singh",
    phone: "+91 86500 44567",
    email: "ananya.s@gmail.com",
    source: "Walk-in",
    service: "Foundation Program",
    status: "Negotiation",
    score: "Hot",
    assignedTo: "Aanya Sharma",
    city: "Delhi",
    priority: "High",
    createdAt: "2025-05-12",
    followUpDate: "2025-05-27",
    notes: "Walk-in enquiry. Shortlisted us over 2 other institutes. Needs payment confirmation call.",
    intakeTimeline: "Immediate",
    education: "Graduate",
    engagementLevel: "Ready to Enroll",
    budgetReadiness: "High",
    leadScore: 82,
    courseInterests: ["Foundation Program", "One-on-One Mentorship"],
    parentName: "Mr. & Mrs. Singh",
    parentPhone: "+91 86500 44560",
    counselingNote: {
      targetProgram: "Foundation Program — Drop Year",
      courseInterest: "Foundation + Mentorship",
      engagementLevel: "Ready to Enroll",
      previousExperience: "None",
      budget: "₹72,000 (2 installments preferred)",
      painPoints: "No prior experience in this field. Needs complete handholding.",
      createdAt: "2025-05-12",
      createdBy: "Aanya Sharma",
    },
    activity: [
      { time: "11:00 AM · 12 May", type: "note",   text: "Walk-in enquiry at centre", by: "Aanya Sharma" },
      { time: "11:30 AM · 12 May", type: "status", text: "Status: New → Contacted", by: "Aanya Sharma" },
      { time: "2:00 PM  · 14 May", type: "meeting", text: "Attended intro session — very impressed with faculty", by: "Aanya Sharma" },
      { time: "10:00 AM · 20 May", type: "call",   text: "Follow-up — shortlisted us over two competitors", by: "Aanya Sharma" },
      { time: "2:00 PM  · 24 May", type: "call",   text: "Parent joined call — approved enrollment", by: "Aanya Sharma" },
      { time: "3:00 PM  · 24 May", type: "status", text: "Status: Proposal Sent → Negotiation", by: "Aanya Sharma" },
    ],
    callLogs: [
      { id: "cl-1014-1", date: "2025-05-20", time: "10:00 AM", result: "Connected", duration: "12 min", remarks: "Shortlisted us over competitors", by: "Aanya Sharma" },
      { id: "cl-1014-2", date: "2025-05-24", time: "2:00 PM",  result: "Connected", duration: "25 min", remarks: "Joint call with parents — approved 2-installment plan", by: "Aanya Sharma" },
    ],
    followUps: [
      { id: "fu-1014-1", date: "2025-05-27", time: "10:00 AM", status: "Pending", remarks: "Send payment link, confirm June 1 seat", createdBy: "Aanya Sharma" },
    ],
  },

  {
    id: "L-1015",
    name: "Mohit Agarwal",
    phone: "+91 85600 55678",
    email: "mohit.a@gmail.com",
    source: "Google Ad",
    service: "Advanced Program",
    status: "New",
    score: "Cold",
    assignedTo: "Aanya Sharma",
    city: "Jaipur",
    priority: "Low",
    createdAt: "2025-05-27",
    followUpDate: "2025-05-29",
    notes: "Clicked Google ad. Just signed up. No info available yet.",
    intakeTimeline: "6+ months",
    education: "Graduate",
    engagementLevel: "Just Exploring",
    budgetReadiness: "Medium",
    leadScore: 25,
    courseInterests: ["Advanced Program"],
    activity: [
      { time: "6:00 PM · 27 May", type: "note", text: "Lead captured via Google Ad click", by: "System" },
    ],
    callLogs: [],
    followUps: [
      { id: "fu-1015-1", date: "2025-05-29", time: "6:00 PM", status: "Pending", remarks: "First call — qualify timeline and program interest", createdBy: "Aanya Sharma" },
    ],
  },

  {
    id: "L-1016",
    name: "Preethi Subramaniam",
    phone: "+91 84700 66789",
    email: "preethi.sub@gmail.com",
    source: "Referral",
    service: "Foundation Program",
    status: "Qualified",
    score: "Hot",
    assignedTo: "Aanya Sharma",
    city: "Coimbatore",
    priority: "High",
    createdAt: "2025-05-24",
    followUpDate: "2025-05-30",
    notes: "Referred by Rahul Saxena. Wants hybrid mode — weekend offline + online weekdays. Strong candidate.",
    intakeTimeline: "Immediate",
    education: "Working Professional",
    engagementLevel: "Ready to Enroll",
    budgetReadiness: "High",
    leadScore: 68,
    courseInterests: ["Foundation Program", "Weekend Batch", "Online Live"],
    counselingNote: {
      targetProgram: "Foundation Program — Hybrid",
      courseInterest: "Foundation Hybrid (Online + Weekend Offline)",
      engagementLevel: "Ready to Enroll",
      previousExperience: "None",
      budget: "₹50,000 (Hybrid)",
      painPoints: "Location constraint. Monthly travel to centre possible. Wants flexibility.",
      createdAt: "2025-05-24",
      createdBy: "Aanya Sharma",
    },
    activity: [
      { time: "9:00 AM · 24 May",  type: "call",   text: "First call — already aware via referral, very positive", by: "Aanya Sharma" },
      { time: "9:30 AM · 24 May",  type: "status", text: "Status: New → Qualified", by: "Aanya Sharma" },
      { time: "10:00 AM · 24 May", type: "note",   text: "Interested in hybrid mode. Weekend offline if visiting monthly.", by: "Aanya Sharma" },
      { time: "3:00 PM  · 26 May", type: "call",   text: "Second call — discussing hybrid structure", by: "Aanya Sharma" },
    ],
    callLogs: [
      { id: "cl-1016-1", date: "2025-05-24", time: "9:00 AM", result: "Connected", duration: "18 min", remarks: "Warm referral call — qualified", by: "Aanya Sharma" },
      { id: "cl-1016-2", date: "2025-05-26", time: "3:00 PM", result: "Connected", duration: "12 min", remarks: "Hybrid model discussion", by: "Aanya Sharma" },
    ],
    followUps: [
      { id: "fu-1016-1", date: "2025-05-30", time: "9:00 AM", status: "Pending", remarks: "Follow up after family discussion on hybrid model", createdBy: "Aanya Sharma" },
    ],
  },
];

// ── DASHBOARDS ──────────────────────────────────────────────────
export const repDashboard = {
  leadsToday: 6,
  callsMade: 18,
  pendingFollowUps: 5,
  overdueFollowUps: 1,
  conversionRate: 34,
  enrolledThisMonth: 8,
  pipelineValue: "₹6.8L",
  wonThisMonth: 8,
};

export const managerDashboard = {
  totalLeads: 182,
  activeReps: 7,
  teamConversionRate: 33,
  callsToday: 117,
  escalations: 3,
  overdue: 9,
  enrolledThisMonth: 52,
  topPerformer: "Priya Nair",
};

export const directorDashboard = {
  totalRevenue: "₹62.4L",
  revenueGrowth: "+22%",
  totalLeads: 847,
  conversionRate: 33,
  enrolledDeals: 214,
  lostLeads: 58,
  avgDealValue: "₹29,150",
  forecastThisQuarter: "₹78L",
  teamHealth: 89,
};

export const revenueByMonth = [
  { month: "Jan", revenue: 32, target: 35 },
  { month: "Feb", revenue: 38, target: 36 },
  { month: "Mar", revenue: 41, target: 40 },
  { month: "Apr", revenue: 36, target: 42 },
  { month: "May", revenue: 48, target: 46 },
  { month: "Jun", revenue: 53, target: 50 },
];

export const pipelineStages = [
  { stage: "New",           count: 47, value: "₹9.8L"  },
  { stage: "Contacted",     count: 38, value: "₹16.2L" },
  { stage: "Qualified",     count: 29, value: "₹24.5L" },
  { stage: "Proposal Sent", count: 24, value: "₹19.3L" },
  { stage: "Negotiation",   count: 12, value: "₹38.1L" },
  { stage: "Enrolled",      count: 14, value: "₹42.1L" },
  { stage: "Lost",          count: 9,  value: "—"       },
];

export const escalations = [
  { id: "ESC-01", lead: "Sneha Kulkarni", rep: "Aanya Sharma", reason: "Parent joint call rescheduled twice — lead getting cold", severity: "High",   raisedAt: "2025-05-26 9:00 AM" },
  { id: "ESC-02", lead: "Deepak Verma",   rep: "Aanya Sharma", reason: "Needs >10% discount approval from manager",              severity: "Medium", raisedAt: "2025-05-25 3:30 PM" },
  { id: "ESC-03", lead: "Reema Kapoor",   rep: "Aanya Sharma", reason: "Scholarship request — needs director approval",           severity: "Low",    raisedAt: "2025-05-24 11:00 AM" },
];

export const leadSources = [
  { source: "Referral",     leads: 6,  enrolled: 2, conversionRate: 33 },
  { source: "Seminar",      leads: 5,  enrolled: 2, conversionRate: 40 },
  { source: "Website",      leads: 8,  enrolled: 1, conversionRate: 13 },
  { source: "Instagram Ad", leads: 5,  enrolled: 1, conversionRate: 20 },
  { source: "Google Ad",    leads: 4,  enrolled: 0, conversionRate: 0  },
  { source: "Walk-in",      leads: 3,  enrolled: 1, conversionRate: 33 },
  { source: "YouTube",      leads: 4,  enrolled: 1, conversionRate: 25 },
  { source: "Cold Call",    leads: 7,  enrolled: 0, conversionRate: 0  },
];

export const lostReasons = [
  { reason: "Joined Competitor",     count: 23, trend: "up"   as const },
  { reason: "Too Expensive",         count: 38, trend: "up"   as const },
  { reason: "Timing Not Right",      count: 27, trend: "flat" as const },
  { reason: "No Response",           count: 19, trend: "down" as const },
  { reason: "Sponsor Rejected",      count: 11, trend: "flat" as const },
  { reason: "Financial Issue",       count: 14, trend: "up"   as const },
  { reason: "Self Study Preferred",  count: 8,  trend: "down" as const },
];