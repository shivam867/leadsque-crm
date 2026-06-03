"use client";
import { useState } from "react";
import {
  ArrowLeft, Phone, Mail, MapPin, Check, Activity, Copy,
  PhoneCall, Layers, AlertTriangle,
} from "lucide-react";
import { Lead, LeadStatus } from "./types";
import { STATUS_CONFIG, SCORE_CONFIG, getInitials } from "./constants";
import PipelineStepper from "./PipelineStepper";
import IntelStrip from "./IntelStrip";
import OverviewTab from "./OverviewTab";
import { CallLogsTab, ActivityTab, EscalateTab } from "./OtherTabs";

const DEMO_LEAD: Lead = {
  id: "L-1001", name: "Deepak Verma", phone: "+91 98100 11234", email: "deepak.verma@gmail.com",
  source: "Website", service: "Advanced Program", status: "Negotiation", score: "Hot",
  assignedTo: "Aanya Sharma", city: "Delhi", priority: "High", createdAt: "2025-05-20",
  followUpDate: "2025-05-28",
  notes: "Very interested in the Advanced Program. Working professional, prefers weekend batches. Offer early bird discount on follow-up.",
  intakeTimeline: "Immediate", education: "Working Professional", engagementLevel: "Ready to Enroll",
  budgetReadiness: "Medium", leadScore: 72,
  courseInterests: ["Advanced Program", "Test Series"],
  counselingNote: {
    targetProgram: "Advanced Program — Weekend Batch",
    courseInterest: "Advanced Program, Test Series Add-on",
    engagementLevel: "Ready to Enroll",
    previousExperience: "Self-study for 1 year",
    budget: "₹40,000 – ₹50,000",
    painPoints: "Needs structured curriculum. Weekend batch is a must. Budget slightly tight.",
    createdAt: "2025-05-20", createdBy: "Aanya Sharma",
  },
  activity: [
    { time: "10:30 AM · 20 May", type: "call",     text: "First call placed — answered on 2nd ring",                        by: "Aanya Sharma" },
    { time: "10:35 AM · 20 May", type: "note",     text: "Interested in Advanced batch, asked about weekend timings",        by: "Aanya Sharma" },
    { time: "10:40 AM · 20 May", type: "status",   text: "Status updated: New → Contacted",                                 by: "Aanya Sharma" },
    { time: "11:00 AM · 22 May", type: "call",     text: "Follow-up call — discussed pricing, slight hesitation on budget", by: "Aanya Sharma" },
    { time: "11:15 AM · 22 May", type: "whatsapp", text: "Sent brochure and fee structure on WhatsApp",                    by: "Aanya Sharma" },
    { time: "9:00 AM · 25 May",  type: "followup", text: "Reminder set: call back with early bird discount offer",          by: "Aanya Sharma" },
    { time: "11:30 AM · 26 May", type: "status",   text: "Status updated: Qualified → Negotiation",                         by: "Aanya Sharma" },
  ],
  callLogs: [
    { id: "cl-1", date: "2025-05-20", time: "10:30 AM", result: "Connected", duration: "12 min", remarks: "Discussed batch timings and fee structure", by: "Aanya Sharma" },
    { id: "cl-2", date: "2025-05-22", time: "11:00 AM", result: "Connected", duration: "8 min",  remarks: "Budget concern, considering early bird discount", by: "Aanya Sharma" },
  ],
  followUps: [
    { id: "fu-1", date: "2025-05-28", time: "11:00 AM", status: "Pending", remarks: "Call with early bird discount offer", createdBy: "Aanya Sharma" },
  ],
  intelligence: {
    competitorIntel: "No competitor named directly. As an IT professional he has likely browsed StudyIQ and Unacademy — stress our structured offline-style evening batch and personal faculty access.",
    bestTimeToCall: "Friday 11:00 AM – 1:00 PM",
    bestTimeNote: "Call Friday 11 AM with early bird discount. Highlight evening batch and test series.",
    handlingObjections: [
      { objection: "Budget objection",      response: "Offer early-bird discount + 2-installment split." },
      { objection: "Time concern",          response: "Emphasise 7-9 PM slot + recorded backup sessions." },
      { objection: "Competitor comparison", response: "Stress offline-style teaching + personal faculty access." },
    ],
    languagePreference: ["Hindi", "English"],
    dealProbability: 72,
    preBriefNote: "Deepak is a warm lead with a clear need. He's a working professional on his second UPSC attempt. Budget concern is temporary. High close probability if contacted Friday with a discount offer.",
    aiKeyPoints: [
      "2nd attempt — Prelims cleared in 2024, Mains was the gap",
      "Working professional — needs evening/weekend batch",
      "Budget concern is seasonal, not structural",
    ],
  },
};

type TabKey = "overview" | "calls" | "activity" | "escalate";

interface LeadDetailPageProps {
  lead?: Lead;
  onBack?: () => void;
}

export default function LeadDetailPage({ lead: propLead, onBack }: LeadDetailPageProps) {
  const lead = propLead ?? DEMO_LEAD;

  const [selectedStatus, setSelectedStatus] = useState<LeadStatus>(lead.status);
  const [tab, setTab]     = useState<TabKey>("overview");
  const [copied, setCopied] = useState(false);

  const sc     = STATUS_CONFIG[selectedStatus] ?? STATUS_CONFIG["New"];
  const scorec = SCORE_CONFIG[lead.score] ?? SCORE_CONFIG.Cold;

  const copyPhone = () => {
    navigator.clipboard.writeText(lead.phone);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const leadScoreColor = (s: number) => s >= 70 ? "var(--success)" : s >= 40 ? "var(--warning)" : "var(--text-muted)";

  const TABS: { key: TabKey; label: string; icon: React.ReactNode }[] = [
    { key: "overview", label: "Overview",  icon: <Layers size={13} />        },
    { key: "calls",    label: "Call Logs", icon: <PhoneCall size={13} />     },
    { key: "activity", label: "Activity",  icon: <Activity size={13} />      },
    { key: "escalate", label: "Escalate",  icon: <AlertTriangle size={13} /> },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "var(--surface-2)", fontFamily: "'Bricolage Grotesque', sans-serif" }}>

      {/* Sticky Nav */}
      <div style={{ height: 52, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 24px", borderBottom: "1px solid var(--border)", background: "var(--surface)", position: "sticky", top: 0, zIndex: 10 }}>
        <button
          onClick={onBack ?? (() => {})}
          className="btn-secondary"
          style={{ fontSize: 12, padding: "5px 12px" }}
        >
          <ArrowLeft size={13} strokeWidth={2.5} /> Back to Leads
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 11, fontFamily: "monospace", color: "var(--text-muted)" }}>{lead.id}</span>
          <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 99, background: sc.bg, color: sc.text, border: `1px solid ${sc.border}`, transition: "all 0.2s" }}>
            {selectedStatus}
          </span>
          <a href={`tel:${lead.phone}`} style={{ textDecoration: "none" }}>
            <button className="btn-primary" style={{ fontSize: 12, padding: "6px 14px" }}>
              <Phone size={12} /> Call Now
            </button>
          </a>
        </div>
      </div>

      {/* Hero */}
      <div style={{ background: "var(--surface)", borderBottom: "1px solid var(--border)" }}>
        <div style={{ padding: "16px 24px 12px", display: "flex", alignItems: "flex-start", gap: 14 }}>
          {/* Avatar */}
          <div style={{ width: 52, height: 52, borderRadius: 14, flexShrink: 0, background: "var(--info-light)", color: "var(--info)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, fontWeight: 800, letterSpacing: "-0.02em", boxShadow: "0 0 0 3px var(--info-border)" }}>
            {getInitials(lead.name)}
          </div>

          {/* Name & contact */}
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: 20, fontWeight: 800, color: "var(--text-primary)", margin: "0 0 5px", letterSpacing: "-0.03em" }}>{lead.name}</h1>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center" }}>
              <button onClick={copyPhone} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "var(--text-secondary)", background: "transparent", border: "none", cursor: "pointer", padding: 0, fontFamily: "monospace" }}>
                <Phone size={12} style={{ color: "var(--text-muted)" }} />{lead.phone}
                {copied ? <Check size={10} style={{ color: "var(--success)" }} /> : <Copy size={10} style={{ color: "var(--border-strong)" }} />}
              </button>
              <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "var(--text-secondary)" }}>
                <Mail size={12} style={{ color: "var(--text-muted)" }} />{lead.email}
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "var(--text-secondary)" }}>
                <MapPin size={12} style={{ color: "var(--text-muted)" }} />{lead.city}
              </span>
            </div>
          </div>

          {/* Score & lead score */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 7, flexShrink: 0 }}>
            <div style={{ display: "flex", gap: 6 }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 99, background: scorec.bg, color: scorec.text }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: scorec.dot }} />{lead.score}
              </span>
              <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 99, background: "var(--surface-2)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>
                {lead.service}
              </span>
            </div>
            {typeof lead.leadScore === "number" && (
              <div style={{ display: "flex", alignItems: "center", gap: 8, background: "var(--surface-2)", padding: "5px 12px", borderRadius: 99, border: "1px solid var(--border)" }}>
                <span style={{ fontSize: 11, color: "var(--text-secondary)", fontWeight: 600 }}>Lead Score</span>
                <div style={{ width: 70, height: 4, background: "var(--border)", borderRadius: 99, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${lead.leadScore}%`, borderRadius: 99, background: leadScoreColor(lead.leadScore) }} />
                </div>
                <span style={{ fontSize: 14, fontWeight: 900, color: leadScoreColor(lead.leadScore) }}>
                  {lead.leadScore}
                </span>
              </div>
            )}
          </div>
        </div>

        <PipelineStepper currentStatus={selectedStatus} />
        <IntelStrip lead={lead} currentStatus={selectedStatus} />

        {/* Tab bar */}
        <div style={{ display: "flex", padding: "0 24px", borderTop: "1px solid var(--surface-3)", marginTop: 14 }}>
          {TABS.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              style={{
                display: "flex", alignItems: "center", gap: 5, padding: "11px 16px",
                fontSize: 13, fontWeight: 600, border: "none", cursor: "pointer",
                borderBottom: tab === t.key ? "2.5px solid var(--text-primary)" : "2.5px solid transparent",
                color: tab === t.key ? "var(--text-primary)" : "var(--text-muted)",
                background: "transparent",
              }}
            >
              {t.icon}{t.label}
              {t.key === "escalate" && (
                <span style={{ fontSize: 9, fontWeight: 800, padding: "1px 5px", borderRadius: 99, background: "var(--danger-light)", color: "var(--danger)" }}>!</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div style={{ padding: "20px 24px" }}>
        {tab === "overview" && <OverviewTab lead={lead} currentStatus={selectedStatus} onStatusChange={setSelectedStatus} />}
        {tab === "calls"    && <CallLogsTab lead={lead} />}
        {tab === "activity" && <ActivityTab lead={lead} />}
        {tab === "escalate" && <EscalateTab lead={lead} />}
      </div>
    </div>
  );
}