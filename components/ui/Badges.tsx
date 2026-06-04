"use client";

export type LeadScore  = "Hot" | "Warm" | "Cold";
export type LeadStatus =
  | "New" | "Contacted" | "Qualified" | "Proposal Sent"
  | "Negotiation" | "Enrolled" | "Not Interested" | "Lost";
export type Priority   = "High" | "Medium" | "Low";

/* ── Score badge ── */
const SCORE_STYLES: Record<LeadScore, { bg: string; color: string; border: string }> = {
  Hot:  { bg: "var(--danger-light)",  color: "var(--danger)",  border: "var(--danger-border)" },
  Warm: { bg: "var(--warning-light)", color: "var(--warning)", border: "var(--warning-border)" },
  Cold: { bg: "var(--surface-2)",     color: "var(--text-secondary)", border: "var(--border-strong)" },
};

export function ScoreBadge({ score }: { score: LeadScore }) {
  const s = SCORE_STYLES[score] ?? SCORE_STYLES.Cold;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      padding: "1px 7px", borderRadius: 4,
      fontSize: 10, fontWeight: 700, whiteSpace: "nowrap",
      background: s.bg, color: s.color, border: `1px solid ${s.border}`,
    }}>
      {score === "Hot" && <span style={{ fontSize: 9 }}>●</span>}
      {score}
    </span>
  );
}

/* ── Status badge ── */
const STATUS_STYLES: Record<LeadStatus, { bg: string; color: string; border: string }> = {
  "New":           { bg: "var(--info-light)",    color: "var(--info)",           border: "var(--info-border)" },
  "Contacted":     { bg: "var(--surface-2)",     color: "var(--text-secondary)", border: "var(--border)" },
  "Qualified":     { bg: "var(--accent-light)",  color: "var(--accent)",         border: "var(--accent-border)" },
  "Proposal Sent": { bg: "var(--accent-light)",  color: "var(--accent)",         border: "var(--accent-border)" },
  "Negotiation":   { bg: "var(--warning-light)", color: "var(--warning)",        border: "var(--warning-border)" },
  "Enrolled":      { bg: "var(--success-light)", color: "var(--success)",        border: "var(--success-border)" },
  "Not Interested":{ bg: "var(--surface-2)",     color: "var(--text-muted)",     border: "var(--border)" },
  "Lost":          { bg: "var(--danger-light)",  color: "var(--danger)",         border: "var(--danger-border)" },
};

export function StatusBadge({ status }: { status: LeadStatus }) {
  const s = STATUS_STYLES[status] ?? STATUS_STYLES["Contacted"];
  return (
    <span style={{
      display: "inline-flex", alignItems: "center",
      padding: "1px 7px", borderRadius: 4,
      fontSize: 10, fontWeight: 600, whiteSpace: "nowrap",
      background: s.bg, color: s.color, border: `1px solid ${s.border}`,
    }}>
      {status}
    </span>
  );
}

/* ── Priority dot ── */
const PRIORITY_COLORS: Record<Priority, string> = {
  High:   "var(--danger)",
  Medium: "var(--warning)",
  Low:    "var(--text-muted)",
};

export function PriorityDot({ priority }: { priority: Priority }) {
  return (
    <span style={{
      display: "inline-block",
      width: 7, height: 7, borderRadius: "50%", flexShrink: 0,
      background: PRIORITY_COLORS[priority] ?? "var(--text-muted)",
    }} />
  );
}