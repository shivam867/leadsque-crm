import type { LeadStatus, LeadScore, LeadPriority } from "@/data/dummy";
import { STATUS_CONFIG, SCORE_CONFIG } from "@/data/dummy";

export function StatusBadge({ status }: { status: LeadStatus }) {
  const c = STATUS_CONFIG[status] ?? STATUS_CONFIG["New"];
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      fontSize: 11, fontWeight: 600, padding: "2px 9px",
      borderRadius: 99, background: c.bg, color: c.text,
      border: `1px solid ${c.border}`, whiteSpace: "nowrap" as const,
    }}>
      {status}
    </span>
  );
}

export function ScoreBadge({ score }: { score: LeadScore }) {
  const c = SCORE_CONFIG[score] ?? SCORE_CONFIG.Cold;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      fontSize: 11, fontWeight: 600, padding: "2px 8px",
      borderRadius: 99, background: c.bg, color: c.text,
    }}>
      <span style={{ width: 5, height: 5, borderRadius: "50%", background: c.dot }} />
      {score}
    </span>
  );
}

const PRIORITY_COLORS: Record<LeadPriority, string> = {
  High:   "#E24B4A",
  Medium: "#EF9F27",
  Low:    "#9CA3AF",
};

export function PriorityDot({ priority }: { priority: LeadPriority }) {
  return (
    <span
      title={`Priority: ${priority}`}
      style={{
        display: "inline-block",
        width: 8, height: 8, borderRadius: "50%", flexShrink: 0,
        background: PRIORITY_COLORS[priority] ?? "#9CA3AF",
      }}
    />
  );
}

export function ScoreBar({ score }: { score: number }) {
  const color = score >= 70 ? "#059669" : score >= 40 ? "#D97706" : "#9CA3AF";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{ flex: 1, height: 4, background: "#E5E7EB", borderRadius: 99, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${score}%`, background: color, borderRadius: 99 }} />
      </div>
      <span style={{ fontSize: 12, fontWeight: 700, color, minWidth: 24, textAlign: "right" as const }}>{score}</span>
    </div>
  );
}