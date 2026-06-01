"use client";
import type { LeadScore, LeadStatus } from "@/data/dummy";

// ── Score Badge — text only, no emoji ────────────────────────────
const scoreConfig: Record<LeadScore, { label: string; bg: string; color: string; border: string }> = {
  Hot:    { label: "Hot",    bg: "#FEF2F2", color: "#B91C1C", border: "#FECACA" },
  Medium: { label: "Medium", bg: "#FFFBEB", color: "#92400E", border: "#FDE68A" },
  Cold:   { label: "Cold",   bg: "#EFF6FF", color: "#1D4ED8", border: "#BFDBFE" },
};

export function ScoreBadge({ score }: { score: LeadScore }) {
  const c = scoreConfig[score];
  return (
    <span
      className="badge text-xs font-semibold"
      style={{
        padding: "2px 8px",
        background: c.bg,
        color: c.color,
        border: `1px solid ${c.border}`,
        borderRadius: 6,
        whiteSpace: "nowrap",
      }}>
      {c.label}
    </span>
  );
}

// ── Status Badge ─────────────────────────────────────────────────
const statusConfig: Record<LeadStatus, { bg: string; color: string; border: string }> = {
  New:        { bg: "#EFF6FF", color: "#1D4ED8", border: "#BFDBFE" },
  Contacted:  { bg: "#F0F9FF", color: "#0369A1", border: "#BAE6FD" },
  Interested: { bg: "#F0FDF4", color: "#15803D", border: "#BBF7D0" },
  "Follow-up":{ bg: "#FFFBEB", color: "#B45309", border: "#FDE68A" },
  Qualified:  { bg: "#FAF5FF", color: "#7E22CE", border: "#DDD6FE" },
  Won:        { bg: "#ECFDF5", color: "#065F46", border: "#A7F3D0" },
  Lost:       { bg: "#FFF1F2", color: "#BE123C", border: "#FECDD3" },
  Spam:       { bg: "#F3F4F6", color: "#6B7280", border: "#E5E7EB" },
};

export function StatusBadge({ status }: { status: LeadStatus }) {
  const c = statusConfig[status];
  return (
    <span
      className="badge text-xs font-semibold"
      style={{
        padding: "2px 8px",
        background: c.bg,
        color: c.color,
        border: `1px solid ${c.border}`,
        borderRadius: 6,
        whiteSpace: "nowrap",
      }}>
      {status}
    </span>
  );
}

// ── Priority Dot ─────────────────────────────────────────────────
const priorityColor: Record<string, string> = {
  High:   "#DC2626",
  Medium: "#D97706",
  Low:    "#22C55E",
};

export function PriorityDot({ priority }: { priority: "High" | "Medium" | "Low" }) {
  return (
    <span
      className="flex-shrink-0"
      style={{
        width: 8,
        height: 8,
        borderRadius: "50%",
        background: priorityColor[priority],
        display: "inline-block",
      }}
    />
  );
}