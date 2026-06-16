"use client";

import { useMemo, useState } from "react";
import {
  X, Phone, Mail, MapPin, BookOpen, CalendarCheck, Clock,
  User, FileText, CreditCard, ChevronRight, CheckCircle2,
  AlertCircle, AlertTriangle, Download, MessageSquare, Users, Lock, Plus,
  Percent, Check, CalendarClock,
} from "lucide-react";
import {
  EnrolledLead, DiscountRequest, PAYMENT_COLORS, AVATAR_PALETTE,
} from "../../data/enrolment";

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

type PaymentRow = { date: string; amount: number; mode: string; ref: string };

// ── Payment status model ──────────────────────────────────────────────────────
type PayStatus = "Pending" | "Partial" | "Paid" | "Overdue";

// Existing PAYMENT_COLORS may not include "Overdue" — overlay safe defaults.
const STATUS_COLORS: Record<PayStatus, string> = {
  Pending: "#6b7280",
  Partial: "#d97706",
  Paid: "#059669",
  Overdue: "#dc2626",
  ...(PAYMENT_COLORS as Partial<Record<PayStatus, string>>),
};

const rupee = (n: number) => "₹" + n.toLocaleString("en-IN");

type ScheduleStatus = "Paid" | "Partial" | "Overdue" | "Upcoming";
const SCHEDULE_STYLE: Record<ScheduleStatus, { fg: string; bg: string; border: string }> = {
  Paid:     { fg: "#065f46", bg: "#d1fae5", border: "#6ee7b7" },
  Partial:  { fg: "#92400e", bg: "#fef3c7", border: "#fcd34d" },
  Overdue:  { fg: "#991b1b", bg: "#fee2e2", border: "#fca5a5" },
  Upcoming: { fg: "#374151", bg: "#f3f4f6", border: "#e5e7eb" },
};

// Build an installment plan and derive each line's state from what's collected.
// Due dates are anchored around "today" so partial/overdue states are visible in the demo.
function buildSchedule(netPayable: number, collected: number) {
  const mkDate = (offsetDays: number) => {
    const d = new Date();
    d.setDate(d.getDate() + offsetDays);
    return d;
  };
  const defs = [
    { label: "Registration",  pct: 0.30, due: mkDate(-6) },
    { label: "Installment 1", pct: 0.40, due: mkDate(18) },
    { label: "Installment 2", pct: 0.30, due: mkDate(45) },
  ];

  let remaining = collected;
  const now = new Date();

  return defs.map((def) => {
    const amount = Math.round(netPayable * def.pct);
    const paidHere = Math.min(remaining, amount);
    remaining -= paidHere;

    let status: ScheduleStatus;
    if (amount > 0 && paidHere >= amount) status = "Paid";
    else if (paidHere > 0) status = "Partial";
    else if (def.due < now) status = "Overdue";
    else status = "Upcoming";

    return {
      label: def.label,
      amount,
      status,
      dueLabel: def.due.toLocaleDateString("en-IN", { day: "2-digit", month: "short" }),
    };
  });
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

  // ── Editable payment tracking (operations team) ──────────────────────────────
  // Seeded with the lead's dummy data; in production wire these to your backend.
  const [totalFee, setTotalFee] = useState<number>(lead.fee);
  const [payments, setPayments] = useState<PaymentRow[]>(lead.paymentHistory);
  const [amtInput, setAmtInput] = useState<string>("");
  const [modeInput, setModeInput] = useState<string>("UPI");

  // ── Discount approval (raised by the sales rep, decided by operations) ────────
  const [discount, setDiscount] = useState<DiscountRequest | undefined>(lead.discountRequest);

  // ₹ value the rep is asking for (percent requests are resolved against the fee).
  const requestedDiscount =
    discount
      ? discount.type === "percent"
        ? Math.round(totalFee * (discount.value / 100))
        : discount.value
      : 0;

  const [approveAmt, setApproveAmt]   = useState<string>(String(requestedDiscount || ""));
  const [decisionNote, setDecisionNote] = useState<string>("");

  const appliedDiscount = discount?.status === "Approved" ? (discount.approvedAmount ?? 0) : 0;
  const netPayable      = Math.max(totalFee - appliedDiscount, 0);

  const collected = payments.reduce((s, p) => s + p.amount, 0);
  const balance   = Math.max(netPayable - collected, 0);

  const schedule = useMemo(() => buildSchedule(netPayable, collected), [netPayable, collected]);
  const isOverdue = schedule.some(s => s.status === "Overdue") && balance > 0;

  const status: PayStatus =
    netPayable > 0 && collected >= netPayable ? "Paid"
    : isOverdue                               ? "Overdue"
    : collected > 0                           ? "Partial"
    : "Pending";
  const statusColor = STATUS_COLORS[status];

  const pct = netPayable > 0 ? Math.min(100, Math.round((collected / netPayable) * 100)) : 0;

  function addPayment() {
    const amt = parseInt(amtInput, 10);
    if (!amt || amt <= 0) return;
    setPayments(prev => [
      ...prev,
      {
        date: new Date().toISOString().slice(0, 10),
        amount: amt,
        mode: modeInput,
        ref: "TXN" + Math.floor(Math.random() * 9_000_000 + 1_000_000),
      },
    ]);
    setAmtInput("");
  }

  function removePayment(i: number) {
    setPayments(prev => prev.filter((_, idx) => idx !== i));
  }

  function decideDiscount(decision: "Approved" | "Rejected") {
    if (!discount) return;
    const approvedAmount =
      decision === "Approved" ? Math.max(0, parseInt(approveAmt || "0", 10)) : 0;
    setDiscount({
      ...discount,
      status: decision,
      approvedAmount,
      decidedBy: "Operations",                       // swap for the logged-in user
      decidedOn: new Date().toISOString().slice(0, 10),
      decisionNote: decisionNote.trim() || undefined,
    });
  }

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

        {/* Quick stats strip — Fee shows NET payable, Payment chip reflects LIVE status */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6, marginBottom: 12 }}>
          {[
            { label: appliedDiscount > 0 ? "Net Fee" : "Fee", value: `₹${(netPayable / 1000).toFixed(0)}K`,            color: "#111827" },
            { label: "Payment", value: status,                                                                        color: statusColor },
            { label: "Kit",     value: lead.kitStatus === "Dispatched" ? "Sent ✓" : lead.kitStatus,                   color: lead.kitStatus === "Dispatched" ? "#059669" : "#d97706" },
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

            {/* ── Sales Rep Note (READ-ONLY, mirrored from the rep's lead page) ── */}
            <SectionLabel>Sales Rep Note</SectionLabel>
            <div style={{ padding: "10px 12px", background: "#eef2ff", borderRadius: 8, border: "1px solid #c7d2fe", marginBottom: 14 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 22, height: 22, borderRadius: 6, background: "#dbeafe", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 9, color: "#1d4ed8" }}>
                    {lead.repAvatar}
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 600, color: "#3730a3" }}>{lead.rep}</span>
                </div>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 3, fontSize: 9, fontWeight: 700, color: "#6b7280", background: "#fff", border: "1px solid #e5e7eb", padding: "2px 7px", borderRadius: 99 }}>
                  <Lock size={9} /> Read-only
                </span>
              </div>
              <p style={{ fontSize: 12, color: "#1e1b4b", lineHeight: 1.6, margin: 0 }}>{lead.salesRepNote}</p>
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

        {/* ── PAYMENTS (editable by operations) ── */}
        {tab === "payments" && (
          <div style={{ padding: "14px" }}>

            {/* ── Payment pipeline (Pending → Partial → Paid, with Overdue alert) ── */}
            <SectionLabel>Payment Pipeline</SectionLabel>
            <div style={{ padding: "14px 12px 12px", borderRadius: 8, background: "#f9fafb", border: "1px solid #e5e7eb", marginBottom: 14 }}>
              {/* track + nodes */}
              <div style={{ display: "flex", alignItems: "center", margin: "0 4px 10px" }}>
                {(["Pending", "Partial", "Paid"] as const).map((stage, i) => {
                  const reached =
                    stage === "Pending" ? true :
                    stage === "Partial" ? collected > 0 :
                    netPayable > 0 && collected >= netPayable;
                  const dot = isOverdue && stage !== "Paid"
                    ? "#dc2626"
                    : reached ? (status === "Paid" ? "#059669" : "#6366f1") : "#d1d5db";
                  return (
                    <div key={stage} style={{ display: "flex", alignItems: "center", flex: i < 2 ? 1 : "0 0 auto" }}>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
                        <div style={{ width: 16, height: 16, borderRadius: "50%", background: reached ? dot : "#fff", border: `2px solid ${dot}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                          {reached && stage !== "Pending" && <Check size={9} strokeWidth={3.5} color="#fff" />}
                        </div>
                        <span style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em", color: reached ? "#374151" : "#9ca3af" }}>{stage}</span>
                      </div>
                      {i < 2 && (
                        <div style={{ flex: 1, height: 3, margin: "0 6px 16px", borderRadius: 99, background: "#e5e7eb", overflow: "hidden" }}>
                          <div style={{ height: "100%", width: i === 0 ? (collected > 0 ? "100%" : "0%") : `${Math.max(0, Math.min(100, (pct - 50) * 2))}%`, background: status === "Paid" ? "#059669" : isOverdue ? "#dc2626" : "#6366f1", transition: "width .4s" }} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 10, borderTop: "1px solid #e5e7eb" }}>
                <span style={{ fontSize: 11, color: "#525252" }}>{rupee(collected)} of {rupee(netPayable)} collected</span>
                <span style={{ fontSize: 11, fontWeight: 800, color: statusColor }}>{pct}%</span>
              </div>
              {isOverdue && (
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 10, padding: "7px 10px", borderRadius: 7, background: "#fee2e2", border: "1px solid #fca5a5" }}>
                  <AlertTriangle size={13} style={{ color: "#dc2626", flexShrink: 0 }} />
                  <span style={{ fontSize: 11, fontWeight: 600, color: "#991b1b" }}>An installment is past its due date</span>
                </div>
              )}
            </div>

            {/* ── Discount approval (sales rep → operations) ── */}
            <SectionLabel>Discount Approval</SectionLabel>
            {!discount ? (
              <div style={{ padding: "12px", borderRadius: 8, background: "#f3f4f6", border: "1px solid #e5e7eb", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
                <Percent size={13} style={{ color: "#9ca3af" }} />
                <span style={{ fontSize: 12, color: "#6b7280" }}>No discount requested for this enrolment</span>
              </div>
            ) : (
              <div style={{
                padding: "12px",
                borderRadius: 8,
                marginBottom: 16,
                background: discount.status === "Approved" ? "#d1fae5" : discount.status === "Rejected" ? "#f3f4f6" : "#fffbeb",
                border: `1px solid ${discount.status === "Approved" ? "#6ee7b7" : discount.status === "Rejected" ? "#e5e7eb" : "#fcd34d"}`,
              }}>
                {/* requester row */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 22, height: 22, borderRadius: 6, background: "#dbeafe", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 9, color: "#1d4ed8" }}>
                      {discount.repAvatar}
                    </div>
                    <div>
                      <p style={{ fontSize: 11, fontWeight: 700, color: "#111827", margin: 0 }}>{discount.requestedBy}</p>
                      <p style={{ fontSize: 9, color: "#6b7280", margin: 0 }}>requested {discount.requestedOn}</p>
                    </div>
                  </div>
                  <span style={{
                    fontSize: 9, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.04em",
                    color: "#fff", padding: "3px 8px", borderRadius: 99,
                    background: discount.status === "Approved" ? "#059669" : discount.status === "Rejected" ? "#6b7280" : "#d97706",
                  }}>{discount.status}</span>
                </div>

                {/* requested amount */}
                <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 6 }}>
                  <span style={{ fontSize: 20, fontWeight: 800, color: "#111827" }}>
                    {discount.type === "percent" ? `${discount.value}%` : rupee(discount.value)}
                  </span>
                  <span style={{ fontSize: 11, color: "#525252" }}>
                    {discount.type === "percent" ? `≈ ${rupee(requestedDiscount)} off` : "off the course fee"}
                  </span>
                </div>

                {/* reason */}
                <p style={{ fontSize: 11, color: "#374151", lineHeight: 1.5, margin: "0 0 10px", fontStyle: "italic" }}>
                  “{discount.reason}”
                </p>

                {discount.status === "Pending" ? (
                  <>
                    {/* operations can approve full or a different amount */}
                    <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 10px", borderRadius: 7, background: "#fff", border: "1px solid #fcd34d", marginBottom: 8 }}>
                      <span style={{ fontSize: 11, color: "#525252", whiteSpace: "nowrap" }}>Approve ₹</span>
                      <input
                        type="number"
                        value={approveAmt}
                        onChange={e => setApproveAmt(e.target.value)}
                        style={{ flex: 1, minWidth: 0, border: "none", background: "transparent", outline: "none", fontSize: 14, fontWeight: 800, color: "#111827" }}
                      />
                    </div>
                    <input
                      placeholder="Add a note (optional)"
                      value={decisionNote}
                      onChange={e => setDecisionNote(e.target.value)}
                      style={{ width: "100%", boxSizing: "border-box", padding: "7px 10px", borderRadius: 7, border: "1px solid #e5e7eb", fontSize: 12, outline: "none", color: "#111827", marginBottom: 8 }}
                    />
                    <div style={{ display: "flex", gap: 8 }}>
                      <button
                        onClick={() => decideDiscount("Rejected")}
                        style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 5, padding: "9px", borderRadius: 8, border: "1px solid #fca5a5", background: "#fff", color: "#dc2626", fontSize: 12, fontWeight: 700, cursor: "pointer" }}
                      >
                        <X size={13} /> Reject
                      </button>
                      <button
                        onClick={() => decideDiscount("Approved")}
                        style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 5, padding: "9px", borderRadius: 8, border: "none", background: "#059669", color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer" }}
                      >
                        <Check size={13} /> Approve
                      </button>
                    </div>
                  </>
                ) : (
                  <div style={{ display: "flex", alignItems: "center", gap: 8, paddingTop: 8, borderTop: `1px solid ${discount.status === "Approved" ? "#6ee7b7" : "#e5e7eb"}` }}>
                    {discount.status === "Approved"
                      ? <CheckCircle2 size={14} style={{ color: "#059669", flexShrink: 0 }} />
                      : <X size={14} style={{ color: "#6b7280", flexShrink: 0 }} />}
                    <span style={{ fontSize: 11, color: "#374151", flex: 1 }}>
                      {discount.status === "Approved"
                        ? <>Applied <b>{rupee(appliedDiscount)}</b> off · by {discount.decidedBy}</>
                        : <>Rejected by {discount.decidedBy}</>}
                      {discount.decisionNote ? ` — ${discount.decisionNote}` : ""}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* ── Fee summary ── */}
            <SectionLabel>Fee Summary</SectionLabel>
            <div style={{ padding: "10px 12px", borderRadius: 8, background: "#f9fafb", border: "1px solid #e5e7eb", marginBottom: 14 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "5px 0" }}>
                <span style={{ fontSize: 12, color: "#525252" }}>Course fee</span>
                <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>₹</span>
                  <input
                    type="number"
                    value={totalFee}
                    onChange={e => setTotalFee(Math.max(0, parseInt(e.target.value || "0", 10)))}
                    style={{ width: 84, textAlign: "right", border: "none", background: "transparent", outline: "none", fontSize: 13, fontWeight: 700, color: "#111827" }}
                  />
                </div>
              </div>
              {appliedDiscount > 0 && (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "5px 0", borderTop: "1px solid #f3f4f6" }}>
                  <span style={{ fontSize: 12, color: "#525252" }}>Discount</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#059669" }}>− {rupee(appliedDiscount)}</span>
                </div>
              )}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "7px 0 3px", borderTop: "1px solid #e5e7eb", marginTop: 3 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: "#111827" }}>Net payable</span>
                <span style={{ fontSize: 14, fontWeight: 800, color: "#111827" }}>{rupee(netPayable)}</span>
              </div>
            </div>

            {/* Live summary: collected / pending / status */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 16 }}>
              <div style={{ padding: "10px 6px", borderRadius: 8, background: "#f3f4f6", border: "1px solid #e5e7eb", textAlign: "center" }}>
                <p style={{ fontSize: 15, fontWeight: 800, color: "#059669", margin: 0 }}>{rupee(collected)}</p>
                <p style={{ fontSize: 9, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", color: "#525252", margin: "2px 0 0" }}>Paid</p>
              </div>
              <div style={{ padding: "10px 6px", borderRadius: 8, background: "#f3f4f6", border: "1px solid #e5e7eb", textAlign: "center" }}>
                <p style={{ fontSize: 15, fontWeight: 800, color: balance === 0 ? "#059669" : "#dc2626", margin: 0 }}>{rupee(balance)}</p>
                <p style={{ fontSize: 9, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", color: "#525252", margin: "2px 0 0" }}>Pending</p>
              </div>
              <div style={{ padding: "10px 6px", borderRadius: 8, background: "#f3f4f6", border: "1px solid #e5e7eb", textAlign: "center", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                <span style={{ alignSelf: "center", fontSize: 11, fontWeight: 800, color: "#fff", background: statusColor, padding: "3px 10px", borderRadius: 99 }}>{status}</span>
                <p style={{ fontSize: 9, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", color: "#525252", margin: "5px 0 0" }}>Status</p>
              </div>
            </div>

            {/* ── Payment schedule (per-installment states) ── */}
            <SectionLabel>Payment Schedule</SectionLabel>
            <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 16 }}>
              {schedule.map((row, i) => {
                const s = SCHEDULE_STYLE[row.status];
                return (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", borderRadius: 8, background: s.bg, border: `1px solid ${s.border}` }}>
                    <CalendarClock size={13} style={{ color: s.fg, flexShrink: 0, opacity: 0.7 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 12, fontWeight: 600, color: s.fg, margin: 0 }}>{row.label}</p>
                      <p style={{ fontSize: 10, color: "#6b7280", margin: "1px 0 0" }}>Due {row.dueLabel}</p>
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 700, color: "#111827" }}>{rupee(row.amount)}</span>
                    <span style={{ fontSize: 9, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.04em", color: s.fg, background: "#fff", border: `1px solid ${s.border}`, padding: "2px 7px", borderRadius: 99, whiteSpace: "nowrap" }}>{row.status}</span>
                  </div>
                );
              })}
            </div>

            {/* Record a payment */}
            <SectionLabel>Record a Payment</SectionLabel>
            <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
              <input
                type="number"
                placeholder="Amount"
                value={amtInput}
                onChange={e => setAmtInput(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") addPayment(); }}
                style={{ flex: 1, minWidth: 0, padding: "8px 10px", borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 13, outline: "none", color: "#111827" }}
              />
              <select
                value={modeInput}
                onChange={e => setModeInput(e.target.value)}
                style={{ padding: "8px 8px", borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 13, background: "#fff", color: "#374151", outline: "none" }}
              >
                <option>UPI</option>
                <option>Cash</option>
                <option>Card</option>
                <option>Bank Transfer</option>
              </select>
              <button
                onClick={addPayment}
                style={{ display: "flex", alignItems: "center", gap: 4, padding: "8px 12px", borderRadius: 8, border: "none", background: "#111827", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" }}
              >
                <Plus size={13} /> Add
              </button>
            </div>

            {/* Recorded payments */}
            <SectionLabel>Payments Recorded ({payments.length})</SectionLabel>
            {payments.length === 0 ? (
              <div style={{ padding: "20px 0", textAlign: "center" }}>
                <AlertCircle size={18} style={{ color: "#dc2626", margin: "0 auto 6px", display: "block" }} />
                <p style={{ fontSize: 13, color: "#dc2626", fontWeight: 600, margin: 0 }}>No payments recorded yet</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 7, marginBottom: 14 }}>
                {payments.map((p, i) => (
                  <div key={i} style={{ padding: "10px 12px", borderRadius: 8, background: "#f3f4f6", border: "1px solid #e5e7eb", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
                    <div style={{ minWidth: 0 }}>
                      <p style={{ fontSize: 14, fontWeight: 700, color: "#059669", margin: 0 }}>{rupee(p.amount)}</p>
                      <p style={{ fontSize: 11, color: "#525252", margin: "2px 0 0" }}>{p.mode} · {p.date}</p>
                    </div>
                    <button
                      onClick={() => removePayment(i)}
                      title="Remove payment"
                      style={{ width: 24, height: 24, borderRadius: 6, border: "1px solid #fca5a5", background: "#fee2e2", color: "#dc2626", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
                    >
                      <X size={12} />
                    </button>
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