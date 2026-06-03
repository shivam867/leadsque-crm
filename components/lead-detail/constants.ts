import { LeadStatus, LeadScore, ActivityType } from "./types";

export const STATUS_CONFIG: Record<LeadStatus, { bg: string; text: string; border: string }> = {
  "New":            { bg: "#EFF6FF", text: "#1D4ED8", border: "#BFDBFE" },
  "Contacted":      { bg: "#F8FAFC", text: "#374151", border: "#CBD5E1" },
  "Qualified":      { bg: "#F0F9FF", text: "#0369A1", border: "#BAE6FD" },
  "Proposal Sent":  { bg: "#FAF5FF", text: "#7E22CE", border: "#DDD6FE" },
  "Negotiation":    { bg: "#FFFBEB", text: "#B45309", border: "#FDE68A" },
  "Enrolled":       { bg: "#ECFDF5", text: "#065F46", border: "#A7F3D0" },
  "Not Interested": { bg: "#FEF2F2", text: "#B91C1C", border: "#FECACA" },
  "Lost":           { bg: "#FEF2F2", text: "#B91C1C", border: "#FECACA" },
};

export const SCORE_CONFIG: Record<LeadScore, { bg: string; text: string; dot: string }> = {
  Hot:  { bg: "#FFF1F2", text: "#BE123C", dot: "#EF4444" },
  Warm: { bg: "#FFFBEB", text: "#B45309", dot: "#F59E0B" },
  Cold: { bg: "#EFF6FF", text: "#2563EB", dot: "#60A5FA" },
};

export const ORDERED_STAGES: LeadStatus[] = [
  "New", "Contacted", "Qualified", "Proposal Sent", "Negotiation", "Enrolled",
];

export const LOST_REASONS = [
  "Too Expensive", "Joined Competitor", "Preparing Independently",
  "Not Eligible", "No Response", "Parent / Sponsor Rejected",
  "Financial Issue", "Program Not Suitable", "Timing Not Right",
];

export const COURSE_OPTIONS = [
  "Foundation Program", "Advanced Program", "Crash Course",
  "Weekend Batch", "Online Live", "Recorded Course",
  "Test Series", "One-on-One Mentorship", "Interview Prep",
];

export const ESCALATION_REASONS = [
  "Needs discount approval", "Requesting refund or exception",
  "Budget negotiation required", "High-value lead — needs senior attention",
  "Repeated no-shows — needs intervention", "Complaint or grievance", "Other",
];

export const STAGE_OPENING_LINES: Partial<Record<LeadStatus, string[]>> = {
  "New": [
    "Hi {name}, I'm calling from Pinnacle — you'd shown interest in our {service}. Do you have 2 minutes?",
    "Hello {name}, this is a quick follow-up on your enquiry about {service}. Is this a good time?",
  ],
  "Contacted": [
    "Hi {name}, we spoke briefly earlier — I wanted to share some program details that might help you decide.",
    "{name} ji, just following up on our last conversation. Have you had a chance to go through the brochure?",
  ],
  "Qualified": [
    "{name} ji, based on what you shared, I think the {service} is perfect for your goal. Let me walk you through the structure.",
    "Hi {name}, I've put together a personalised plan for you. Can I take 5 minutes to walk you through it?",
  ],
  "Proposal Sent": [
    "Hi {name}, I sent over the proposal earlier — wanted to check if you had any questions or need clarification on the fee.",
    "{name} ji, just checking in on the proposal. Our {service} batch starts soon — wanted to make sure you don't miss the seat.",
  ],
  "Negotiation": [
    "{name} ji, Aanya here from Pinnacle — just calling with the early-bird offer I promised. Five minutes to lock in your evening-batch seat?",
    "Hi {name}, I have some good news on the pricing front. Do you have a moment to discuss?",
  ],
  "Enrolled": [
    "Hi {name}, welcome to the Pinnacle family! I'm calling to confirm your onboarding details and answer any questions.",
    "{name} ji, your batch starts soon — just wanted to make sure everything is set for day one!",
  ],
  "Not Interested": [
    "Hi {name}, I completely understand. Would it be okay if I reached out in a few months when the timing is better?",
  ],
  "Lost": [
    "Hi {name}, I hope things worked out. If you ever reconsider {service}, we'd love to have you — no pressure at all.",
  ],
};

export const ACTIVITY_COLORS: Record<ActivityType, string> = {
  call: "#2563EB", note: "#D97706", status: "#7C3AED",
  followup: "#059669", email: "#0891B2", whatsapp: "#25D366", meeting: "#374151",
};

export const ACTIVITY_LABELS: Record<ActivityType, string> = {
  call: "Call", note: "Note", status: "Status change",
  followup: "Follow-up set", email: "Email", whatsapp: "WhatsApp", meeting: "Meeting",
};

export function getInitials(name: string): string {
  return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
}

export function interpolate(template: string, name: string, service: string): string {
  return template.replace("{name}", name.split(" ")[0]).replace("{service}", service);
}