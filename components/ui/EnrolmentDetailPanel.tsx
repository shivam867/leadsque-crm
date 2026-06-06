"use client";

import { useState } from "react";
import {
  X, Phone, Mail, MapPin, BookOpen, CalendarCheck, Clock,
  User, FileText, CreditCard, ChevronRight, CheckCircle2,
  AlertCircle, Download, MessageSquare, Users,
} from "lucide-react";
import { EnrolledLead, PAYMENT_COLORS, AVATAR_PALETTE } from "../../data/enrolment";

// ── Small helpers (scoped to this file) ──────────────────────────────────────
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.07em", color: "#525252", margin: "0 0 8px" }}>
      {children}
    </p>
  );
}

function Divider() {
  return <div style={{ height: 1, background: "#e5e7eb", margin: "14px 0" }} />;
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 0", borderBottom: "1px solid #f3f4f6" }}>
      <span style={{ color: "#9ca3af", flexShrink: 0 }}>{icon}</span>
      <span style={{ fontSize: 12, color: "#525252", minWidth: 90 }}>{label}</span>
      <span style={{ fontSize: 12, fontWeight: 600, color: "#111827", flex: 1, textAlign: "right" }}>{value}</span>
    </div>
  );
}

// ── EnrolmentPanel ────────────────────────────────────────────────────────────
export default function EnrolmentPanel({
  lead,
  idx,
  onClose,
}: {
  lead: EnrolledLead;
  idx: number;
  onClose: () => void;
}) {
  const [tab, setTab] = useState<"profile" | "payments" | "onboarding">("profile");

  const av          = AVATAR_PALETTE[idx % AVATAR_PALETTE.length];
  const doneSteps   = lead.onboardingSteps.filter(s => s.done).length;
  const totalSteps  = lead.onboardingSteps.length;
  const progressPct = Math.round((doneSteps / totalSteps) * 100);
  const collected   = lead.paymentHistory.reduce((s, p) => s + p.amount, 0);
  const balance     = lead.fee - collected;

  return (
    <aside style={{
      width: 356,
      flexShrink: 0,
      borderLeft: "1px solid #e5e7eb",
      background: "#fff",
      display: "flex",
      flexDirection: "column",
      height: "100%",
      overflow: "hidden",
      boxShadow: "-6px 0 24px rgba(0,0,0,0.08)",
    }}>

      {/* ── Header ── */}
      <div style={{ padding: 14, borderBottom: "1px solid #e5e7eb", flexShrink: 0 }}>

        {/* Name row */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 12 }}>
          <div style={{ width: 42, height: 42, borderRadius: 11, flexShrink: 0, background: av.bg, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 14, color: av.text, border: "1px solid #e5e7eb" }}>
            {lead.name.split(" ").map(w => w[0]).join("").slice(0, 2)}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontWeight: 700, fontSize: 15, color: "#111827", margin: 0, lineHeight: 1.2 }}>{lead.name}</p>
            <p style={{ fontSize: 11, color: "#374151", margin: "3px 0 0" }}>{lead.service} · Batch {lead.batch}</p>
            <p style={{ fontSize: 10, color: "#6b7280", margin: "2px 0 0" }}>Enrolled {lead.enrolledOn}</p>
          </div>
          <button
            onClick={onClose}
            style={{ width: 26, height: 26, borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid #e5e7eb", background: "transparent", color: "#374151", cursor: "pointer", flexShrink: 0 }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#f3f4f6"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
          >
            <X size={12} strokeWidth={2} />
          </button>
        </div>

        {/* Quick stats strip */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6, marginBottom: 12 }}>
          {[
            { label: "Fee",     value: `₹${(lead.fee / 1000).toFixed(0)}K`,                                            color: "#111827" },
            { label: "Payment", value: lead.paymentStatus,                                                               color: PAYMENT_COLORS[lead.paymentStatus] },
            { label: "Kit",     value: lead.kitStatus === "Dispatched" ? "Sent ✓" : lead.kitStatus,                     color: lead.kitStatus === "Dispatched" ? "#059669" : "#d97706" },
          ].map(({ label, value, color }) => (
            <div key={label} style={{ textAlign: "center", padding: "8px 6px", borderRadius: 8, background: "#f3f4f6", border: "1px solid #e5e7eb" }}>
              <p style={{ margin: 0, fontSize: 13, fontWeight: 800, color }}>{value}</p>
              <p style={{ margin: "2px 0 0", fontSize: 9, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: "#525252" }}>{label}</p>
            </div>
          ))}
        </div>

        {/* Onboarding progress bar */}
        <div style={{ marginBottom: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: "#374151" }}>Onboarding</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: progressPct === 100 ? "#059669" : "#374151" }}>{doneSteps}/{totalSteps} steps</span>
          </div>
          <div style={{ height: 5, background: "#e5e7eb", borderRadius: 99, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${progressPct}%`, background: progressPct === 100 ? "#059669" : "#6366f1", borderRadius: 99, transition: "width .4s" }} />
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 20, borderBottom: "1px solid #e5e7eb" }}>
          {(["profile", "payments", "onboarding"] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              background: "none", border: "none", padding: "6px 0 8px",
              fontSize: 13, fontWeight: tab === t ? 700 : 500,
              color: tab === t ? "#111827" : "#525252", cursor: "pointer",
              borderBottom: tab === t ? "2px solid #111827" : "2px solid transparent",
              transition: "color .1s, border-color .1s", textTransform: "capitalize",
            }}>{t}</button>
          ))}
        </div>
      </div>

      {/* ── Scrollable body ── */}
      <div style={{ flex: 1, overflowY: "auto" }}>

        {/* ── PROFILE ── */}
        {tab === "profile" && (
          <div style={{ padding: "14px" }}>
            <SectionLabel>Personal Details</SectionLabel>
            <InfoRow icon={<User size={12} />}    label="Date of Birth" value={lead.dob} />
            <InfoRow icon={<User size={12} />}    label="Gender"        value={lead.gender} />
            <InfoRow icon={<MapPin size={12} />}  label="City"          value={lead.city} />
            <InfoRow icon={<Phone size={12} />}   label="Contact"       value={lead.contact} />
            <InfoRow icon={<Mail size={12} />}    label="Email"         value={lead.email} />

            <Divider />
            <SectionLabel>Batch & Schedule</SectionLabel>
            <InfoRow icon={<BookOpen size={12} />}      label="Program" value={lead.service} />
            <InfoRow icon={<CalendarCheck size={12} />} label="Batch"   value={lead.batch} />
            <InfoRow icon={<CalendarCheck size={12} />} label="Starts"  value={lead.batchStartDate} />
            <InfoRow icon={<CalendarCheck size={12} />} label="Ends"    value={lead.batchEndDate} />
            <InfoRow icon={<Clock size={12} />}         label="Timings" value={lead.classTimings} />

            <Divider />
            <SectionLabel>Sales Rep</SectionLabel>
            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", background: "#f3f4f6", borderRadius: 8, border: "1px solid #e5e7eb", marginBottom: 14 }}>
              <div style={{ width: 30, height: 30, borderRadius: 8, background: "#dbeafe", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 11, color: "#1d4ed8" }}>
                {lead.repAvatar}
              </div>
              <div>
                <p style={{ fontSize: 13, fontWeight: 600, color: "#111827", margin: 0 }}>{lead.rep}</p>
                <p style={{ fontSize: 11, color: "#525252", margin: 0 }}>Enrolled this student</p>
              </div>
            </div>

            <SectionLabel>Documents</SectionLabel>
            <div style={{ display: "flex", flexDirection: "column", gap: 5, marginBottom: 14 }}>
              {lead.documents.map((doc, i) => {
                const ok = doc.includes("✓");
                return (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 10px", borderRadius: 7, background: ok ? "#d1fae5" : "#fee2e2", border: `1px solid ${ok ? "#6ee7b7" : "#fca5a5"}` }}>
                    {ok
                      ? <CheckCircle2 size={12} style={{ color: "#059669", flexShrink: 0 }} />
                      : <AlertCircle  size={12} style={{ color: "#dc2626", flexShrink: 0 }} />
                    }
                    <span style={{ fontSize: 12, fontWeight: 500, color: ok ? "#065f46" : "#991b1b", flex: 1 }}>
                      {doc.replace(" ✓", "").replace(" ✗", "")}
                    </span>
                    <span style={{ fontSize: 11, fontWeight: 700, color: ok ? "#059669" : "#dc2626" }}>
                      {ok ? "Received" : "Missing"}
                    </span>
                  </div>
                );
              })}
            </div>

            <SectionLabel>Counsellor Notes</SectionLabel>
            <div style={{ padding: "10px 12px", background: "#fef9ee", borderRadius: 8, border: "1px solid #fcd34d" }}>
              <p style={{ fontSize: 12, color: "#111827", lineHeight: 1.6, margin: 0 }}>{lead.counsellorNotes}</p>
            </div>
          </div>
        )}

        {/* ── PAYMENTS ── */}
        {tab === "payments" && (
          <div style={{ padding: "14px" }}>
            <SectionLabel>Fee Summary</SectionLabel>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 14 }}>
              {[
                { label: "Total Fee",  value: `₹${lead.fee.toLocaleString("en-IN")}`,   color: "#111827" },
                { label: "Status",     value: lead.paymentStatus,                         color: PAYMENT_COLORS[lead.paymentStatus] },
                { label: "Collected",  value: `₹${collected.toLocaleString("en-IN")}`,   color: "#059669" },
                { label: "Balance",    value: `₹${balance.toLocaleString("en-IN")}`,     color: balance === 0 ? "#059669" : "#dc2626" },
              ].map(({ label, value, color }) => (
                <div key={label} style={{ padding: "10px 12px", borderRadius: 8, background: "#f3f4f6", border: "1px solid #e5e7eb", textAlign: "center" }}>
                  <p style={{ fontSize: 16, fontWeight: 800, color, margin: 0 }}>{value}</p>
                  <p style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: "#525252", margin: "2px 0 0" }}>{label}</p>
                </div>
              ))}
            </div>

            <SectionLabel>Payment History</SectionLabel>
            {lead.paymentHistory.length === 0 ? (
              <div style={{ padding: "20px 0", textAlign: "center" }}>
                <AlertCircle size={18} style={{ color: "#dc2626", margin: "0 auto 6px", display: "block" }} />
                <p style={{ fontSize: 13, color: "#dc2626", fontWeight: 600, margin: 0 }}>No payments received</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 7, marginBottom: 14 }}>
                {lead.paymentHistory.map((p, i) => (
                  <div key={i} style={{ padding: "10px 12px", borderRadius: 8, background: "#f3f4f6", border: "1px solid #e5e7eb" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div>
                        <p style={{ fontSize: 14, fontWeight: 700, color: "#059669", margin: 0 }}>₹{p.amount.toLocaleString("en-IN")}</p>
                        <p style={{ fontSize: 11, color: "#525252", margin: "2px 0 0" }}>{p.mode} · {p.date}</p>
                      </div>
                      <span style={{ fontSize: 10, fontFamily: "monospace", color: "#9ca3af", background: "#e5e7eb", padding: "2px 6px", borderRadius: 4 }}>{p.ref}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <Divider />
            <SectionLabel>Actions</SectionLabel>
            {[
              { icon: <Download size={11} />,   label: "Download fee receipt",   color: "#059669", bg: "#d1fae5", border: "#6ee7b7" },
              { icon: <FileText size={11} />,   label: "View enrolment form",    color: "#1d4ed8", bg: "#dbeafe", border: "#bfdbfe" },
              { icon: <CreditCard size={11} />, label: "View payment breakdown", color: "#374151", bg: "#f3f4f6", border: "#e5e7eb" },
            ].map(({ icon, label, color, bg, border }) => (
              <button key={label} style={{ width: "100%", display: "flex", alignItems: "center", gap: 8, padding: "9px 12px", borderRadius: 8, marginBottom: 6, background: bg, border: `1px solid ${border}`, color, fontSize: 12, fontWeight: 600, cursor: "default", textAlign: "left" }}>
                {icon}{label}<ChevronRight size={10} style={{ marginLeft: "auto" }} />
              </button>
            ))}
          </div>
        )}

        {/* ── ONBOARDING ── */}
        {tab === "onboarding" && (
          <div style={{ padding: "14px" }}>
            <SectionLabel>Onboarding Checklist</SectionLabel>
            <div style={{ marginBottom: 12, padding: "10px 12px", background: "#f3f4f6", borderRadius: 8, border: "1px solid #e5e7eb", display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 38, height: 38, borderRadius: "50%", background: progressPct === 100 ? "#d1fae5" : "#e5e7eb", border: `2px solid ${progressPct === 100 ? "#059669" : "#9ca3af"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ fontSize: 12, fontWeight: 800, color: progressPct === 100 ? "#059669" : "#374151" }}>{progressPct}%</span>
              </div>
              <p style={{ fontSize: 12, fontWeight: 700, color: "#111827", margin: 0 }}>
                {progressPct === 100 ? "Fully onboarded 🎉" : `${totalSteps - doneSteps} step${totalSteps - doneSteps !== 1 ? "s" : ""} remaining`}
              </p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 16 }}>
              {lead.onboardingSteps.map((step, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", borderRadius: 8, background: step.done ? "#d1fae5" : "#f3f4f6", border: `1px solid ${step.done ? "#6ee7b7" : "#e5e7eb"}` }}>
                  {step.done
                    ? <CheckCircle2 size={15} style={{ color: "#059669", flexShrink: 0 }} />
                    : <div style={{ width: 15, height: 15, borderRadius: "50%", border: "1.5px solid #9ca3af", flexShrink: 0 }} />
                  }
                  <span style={{ fontSize: 12, fontWeight: 600, color: step.done ? "#065f46" : "#374151", textDecoration: step.done ? "line-through" : "none" }}>
                    {step.label}
                  </span>
                </div>
              ))}
            </div>

            <Divider />
            <SectionLabel>Welcome Kit</SectionLabel>
            <div style={{ padding: "12px 14px", borderRadius: 8, background: lead.kitStatus === "Dispatched" ? "#d1fae5" : "#fef3c7", border: `1px solid ${lead.kitStatus === "Dispatched" ? "#6ee7b7" : "#fcd34d"}`, display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
              {lead.kitStatus === "Dispatched"
                ? <CheckCircle2 size={16} style={{ color: "#059669" }} />
                : <Clock size={16} style={{ color: "#d97706" }} />
              }
              <div>
                <p style={{ fontSize: 13, fontWeight: 700, color: lead.kitStatus === "Dispatched" ? "#065f46" : "#92400e", margin: 0 }}>
                  Kit {lead.kitStatus}
                </p>
                <p style={{ fontSize: 11, color: "#525252", margin: "1px 0 0" }}>
                  {lead.kitStatus === "Dispatched" ? "Materials sent to student" : "Awaiting clearance"}
                </p>
              </div>
            </div>

            <SectionLabel>LMS & Communication</SectionLabel>
            {[
              { icon: <BookOpen size={11} />,      label: "LMS Access",     ok: lead.onboardingSteps[3].done, okText: "Active",  noText: "Not granted" },
              { icon: <Users size={11} />,          label: "WhatsApp Group", ok: lead.onboardingSteps[3].done, okText: "Added",   noText: "Pending" },
              { icon: <MessageSquare size={11} />, label: "Orientation",    ok: lead.onboardingSteps[4].done, okText: "Done",    noText: "Scheduled" },
            ].map(({ icon, label, ok, okText, noText }) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", borderRadius: 8, marginBottom: 6, background: "#f3f4f6", border: "1px solid #e5e7eb" }}>
                <span style={{ color: "#525252" }}>{icon}</span>
                <span style={{ fontSize: 12, color: "#374151", flex: 1 }}>{label}</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: ok ? "#059669" : "#d97706" }}>{ok ? okText : noText}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}