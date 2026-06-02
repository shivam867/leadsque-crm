// ================================================================
// DIRECTOR MODULE — EXTENDED DUMMY DATA
// All numbers derived from / consistent with salesReps, managers, leads
// ================================================================

import { salesReps, managers, leads, lostReasons, leadSources, pipelineStages, revenueByMonth, escalations } from "@/data/dummy";

// ── REVENUE TREND (monthly, per team) ───────────────────────────
// Alpha: reps 1,2,6  → won: 8+9+6 = 23 deals
// Beta:  reps 3,4    → won: 8+6   = 14 deals
// Gamma: reps 5,7    → won: 8+7   = 15 deals
export const revenueByTeam = [
  { month: "Jan", Alpha: 18, Beta: 9,  Gamma: 7  },
  { month: "Feb", Alpha: 22, Beta: 11, Gamma: 5  },
  { month: "Mar", Alpha: 24, Beta: 12, Gamma: 7  },
  { month: "Apr", Alpha: 19, Beta: 10, Gamma: 8  },
  { month: "May", Alpha: 28, Beta: 13, Gamma: 8  },
  { month: "Jun", Alpha: 31, Beta: 15, Gamma: 10 },
];

// ── TEAM SUMMARIES (derived from salesReps) ──────────────────────
export const teamSummaries = [
  {
    team:       "Alpha",
    manager:    "Vikram Bose",
    managerAvatar: "VB",
    color:      "#1a56db",
    bg:         "#EFF6FF",
    border:     "#BFDBFE",
    reps:       salesReps.filter(r => r.team === "Alpha"),
    leads:      salesReps.filter(r => r.team === "Alpha").reduce((s, r) => s + r.leadsAssigned, 0),   // 28+31+18 = 77 → use 73 (manager's figure)
    won:        salesReps.filter(r => r.team === "Alpha").reduce((s, r) => s + r.wonThisMonth, 0),    // 8+9+6 = 23
    calls:      salesReps.filter(r => r.team === "Alpha").reduce((s, r) => s + r.callsToday, 0),      // 18+22+12 = 52
    conversion: Math.round(
      salesReps.filter(r => r.team === "Alpha").reduce((s, r) => s + r.conversionRate, 0) /
      salesReps.filter(r => r.team === "Alpha").length
    ), // avg ≈ 31
    trend: "+4%" as const,
    targetAchieved: 84,
    revenue: "₹26.8L",
    forecast: "₹31L",
  },
  {
    team:       "Beta",
    manager:    "Sunita Rao",
    managerAvatar: "SR",
    color:      "#7e3af2",
    bg:         "#F5F3FF",
    border:     "#DDD6FE",
    reps:       salesReps.filter(r => r.team === "Beta"),
    leads:      salesReps.filter(r => r.team === "Beta").reduce((s, r) => s + r.leadsAssigned, 0),    // 46
    won:        salesReps.filter(r => r.team === "Beta").reduce((s, r) => s + r.wonThisMonth, 0),     // 14
    calls:      salesReps.filter(r => r.team === "Beta").reduce((s, r) => s + r.callsToday, 0),       // 34
    conversion: Math.round(
      salesReps.filter(r => r.team === "Beta").reduce((s, r) => s + r.conversionRate, 0) /
      salesReps.filter(r => r.team === "Beta").length
    ), // avg ≈ 32
    trend: "+2%" as const,
    targetAchieved: 71,
    revenue: "₹21.3L",
    forecast: "₹24L",
  },
  {
    team:       "Gamma",
    manager:    "Amit Khanna",
    managerAvatar: "AK",
    color:      "#0e9f6e",
    bg:         "#F0FDF4",
    border:     "#BBF7D0",
    reps:       salesReps.filter(r => r.team === "Gamma"),
    leads:      salesReps.filter(r => r.team === "Gamma").reduce((s, r) => s + r.leadsAssigned, 0),   // 43
    won:        salesReps.filter(r => r.team === "Gamma").reduce((s, r) => s + r.wonThisMonth, 0),    // 15
    calls:      salesReps.filter(r => r.team === "Gamma").reduce((s, r) => s + r.callsToday, 0),      // 31
    conversion: Math.round(
      salesReps.filter(r => r.team === "Gamma").reduce((s, r) => s + r.conversionRate, 0) /
      salesReps.filter(r => r.team === "Gamma").length
    ), // avg ≈ 37
    trend: "+7%" as const,
    targetAchieved: 91,
    revenue: "₹14.3L",
    forecast: "₹17L",
  },
];

// ── MONTHLY TARGETS vs ACTUALS ────────────────────────────────────
export const monthlyTargets = [
  { month: "Jan", target: 35, actual: 32, enrolled: 38 },
  { month: "Feb", target: 36, actual: 38, enrolled: 44 },
  { month: "Mar", target: 40, actual: 41, enrolled: 48 },
  { month: "Apr", target: 42, actual: 36, enrolled: 41 },
  { month: "May", target: 46, actual: 48, enrolled: 52 },
  { month: "Jun", target: 50, actual: 53, enrolled: 58 },
];

// ── SOURCE ROI (extends leadSources with cost data) ───────────────
export const sourceROI = leadSources.map(s => ({
  ...s,
  closed: s.enrolled ?? 0,
  costPerLead:    s.source === "Referral"     ? 0    :
                  s.source === "Seminar"      ? 1800 :
                  s.source === "Walk-in"      ? 0    :
                  s.source === "Website"      ? 1200 :
                  s.source === "Instagram Ad" ? 2200 :
                  s.source === "Google Ad"    ? 2800 :
                  s.source === "YouTube"      ? 900  :
                  s.source === "Cold Call"    ? 600  : 1000,
  avgDealValue:   s.source === "Referral"     ? 48000 :
                  s.source === "Seminar"      ? 72000 :
                  s.source === "Walk-in"      ? 65000 :
                  s.source === "Website"      ? 29000 :
                  s.source === "Instagram Ad" ? 24000 :
                  s.source === "Google Ad"    ? 18000 :
                  s.source === "YouTube"      ? 31000 :
                  s.source === "Cold Call"    ? 22000 : 25000,
}));

// ── ESCALATIONS ENRICHED (same data, extra fields for director) ──
export const directorEscalations = escalations.map(e => ({
  ...e,
  team: salesReps.find(r => r.name === e.rep)?.team ?? "Alpha",
  age:  e.severity === "High" ? "2 days" : e.severity === "Medium" ? "3 days" : "4 days",
}));

// ── COHORT RETENTION (monthly batches) ──────────────────────────
export const cohortData = [
  { batch: "Jan '25", enrolled: 44, week4: 41, week8: 38, week12: 35, completion: 80 },
  { batch: "Feb '25", enrolled: 38, week4: 36, week8: 33, week12: 31, completion: 82 },
  { batch: "Mar '25", enrolled: 48, week4: 45, week8: 42, week12: 40, completion: 83 },
  { batch: "Apr '25", enrolled: 41, week4: 39, week8: 37, week12: null, completion: null },
  { batch: "May '25", enrolled: 52, week4: 50, week8: null, week12: null, completion: null },
];

// ── DIRECTOR KPIs ────────────────────────────────────────────────
// totalRevenue = sum revenueByMonth actual: 32+38+41+36+48+53 = 248 → ₹62.4L (×0.25L per unit)
export const directorKPIs = {
  totalRevenue:    "₹62.4L",
  revenueGrowth:   "+22%",
  totalLeads:      salesReps.reduce((s, r) => s + r.leadsAssigned, 0) * 5,  // 166×5 = 830, use 847
  conversionRate:  Math.round(
    salesReps.reduce((s, r) => s + r.conversionRate, 0) / salesReps.length
  ), // ≈ 33
  totalWon:        salesReps.reduce((s, r) => s + r.wonThisMonth, 0),        // 52
  totalLost:       lostReasons.reduce((s, r) => s + r.count, 0),             // 140
  avgDealValue:    "₹29,150",
  forecastQ2:      "₹78L",
  teamHealth:      89,
  openEscalations: escalations.length,                                        // 3
  activeReps:      salesReps.length,                                          // 7
  callsToday:      salesReps.reduce((s, r) => s + r.callsToday, 0),          // 117
  pipelineValue:   "₹1.07Cr",
  targetAchieved:  85,
};

// ── REP LEADERBOARD (all reps, derived) ─────────────────────────
export const repLeaderboard = [...salesReps]
  .sort((a, b) => b.conversionRate - a.conversionRate)
  .map((rep, i) => ({
    ...rep,
    rank:        i + 1,
    revenue:     `₹${(rep.wonThisMonth * 29150 / 100000).toFixed(1)}L`,
    medal:       i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : null,
    badge:       rep.conversionRate >= 38 ? "Star" :
                 rep.conversionRate >= 32 ? "Good" : "Needs Support",
    badgeColor:  rep.conversionRate >= 38 ? "#059669" :
                 rep.conversionRate >= 32 ? "#0369A1" : "#DC2626",
    badgeBg:     rep.conversionRate >= 38 ? "#ECFDF5" :
                 rep.conversionRate >= 32 ? "#EFF6FF" : "#FEF2F2",
  }));

// ── ALERTS / ACTION ITEMS FOR DIRECTOR ───────────────────────────
export const directorAlerts = [
  {
    id: "A-01",
    type: "escalation" as const,
    severity: "High" as const,
    title: "ESC-01 aging — 2 days open",
    detail: "Sneha Kulkarni (Aanya Sharma, Alpha) — parent call rescheduled twice",
    action: "Approve 8% discount to unblock",
    team: "Alpha",
  },
  {
    id: "A-02",
    type: "performance" as const,
    severity: "Medium" as const,
    title: "Kabir Singh conversion at 22%",
    detail: "Team Beta · 27 leads, only 6 won · 12 price-related losses this month",
    action: "Schedule coaching session with Sunita Rao",
    team: "Beta",
  },
  {
    id: "A-03",
    type: "revenue" as const,
    severity: "Medium" as const,
    title: "April target missed by 14%",
    detail: "₹36L actual vs ₹42L target · Beta team underperfomed",
    action: "Review Beta pipeline for Q2 recovery",
    team: "Beta",
  },
  {
    id: "A-04",
    type: "opportunity" as const,
    severity: "Low" as const,
    title: "Referral channel 0-cost, 33% conv.",
    detail: "6 leads, 2 enrolled, ₹0 acquisition cost — highest ROI source",
    action: "Launch rep incentive for referral generation",
    team: "All",
  },
  {
    id: "A-05",
    type: "escalation" as const,
    severity: "Low" as const,
    title: "ESC-03 scholarship request pending",
    detail: "Reema Kapoor — needs director-level approval for scholarship",
    action: "Approve or decline scholarship",
    team: "Alpha",
  },
];