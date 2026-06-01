"use client";
import { useState } from "react";
import type { Lead, LeadStatus } from "@/data/dummy";
import {
  X, PhoneCall, PhoneMissed, Clock, Check,
  Brain, ExternalLink, ChevronRight, MapPin,
  Zap, Ban, Sparkles,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────

type OutcomeColor = "green" | "gray" | "amber" | "red";

interface Outcome {
  label: string;
  status?: LeadStatus;
  icon: React.ReactNode;
  color: OutcomeColor;
}

// ─── Constants ───────────────────────────────────────────────────

const OUTCOMES: Outcome[] = [
  {
    label: "Interested",
    status: "Interested",
    icon: <PhoneCall size={13} strokeWidth={2} />,
    color: "green",
  },
  {
    label: "No answer",
    icon: <PhoneMissed size={13} strokeWidth={2} />,
    color: "gray",
  },
  {
    label: "Call later",
    status: "Follow-up",
    icon: <Clock size={13} strokeWidth={2} />,
    color: "amber",
  },
  {
    label: "Wrong no.",
    status: "Spam",
    icon: <Ban size={13} strokeWidth={2} />,
    color: "red",
  },
];

const OUTCOME_STYLES: Record<OutcomeColor, {
  activeBg: string;
  activeBorder: string;
  activeText: string;
  iconActiveBg: string;
  pillBg: string;
  pillText: string;
  pillBorder: string;
}> = {
  green: {
    activeBg: "#ECFDF5",
    activeBorder: "#A7F3D0",
    activeText: "#059669",
    iconActiveBg: "#059669",
    pillBg: "#ECFDF5",
    pillText: "#059669",
    pillBorder: "#A7F3D0",
  },
  gray: {
    activeBg: "#F1F5F9",
    activeBorder: "#94A3B8",
    activeText: "#475569",
    iconActiveBg: "#64748B",
    pillBg: "#F9FAFB",
    pillText: "#6B7280",
    pillBorder: "#E5E7EB",
  },
  amber: {
    activeBg: "#FFFBEB",
    activeBorder: "#FCD34D",
    activeText: "#B45309",
    iconActiveBg: "#D97706",
    pillBg: "#FFFBEB",
    pillText: "#B45309",
    pillBorder: "#FDE68A",
  },
  red: {
    activeBg: "#FEF2F2",
    activeBorder: "#FECACA",
    activeText: "#B91C1C",
    iconActiveBg: "#DC2626",
    pillBg: "#FEF2F2",
    pillText: "#B91C1C",
    pillBorder: "#FECACA",
  },
};

const SCORE_STYLES: Record<string, { bg: string; text: string; dot: string }> = {
  Hot: { bg: "#FEF2F2", text: "#B91C1C", dot: "#EF4444" },
  Warm: { bg: "#FFFBEB", text: "#B45309", dot: "#F59E0B" },
  Medium: { bg: "#FFFBEB", text: "#B45309", dot: "#F59E0B" },
  Cold: { bg: "#EFF6FF", text: "#2563EB", dot: "#60A5FA" },
};

const STATUS_STYLES: Record<string, { bg: string; text: string; border: string }> = {
  New: { bg: "#EFF6FF", text: "#1D4ED8", border: "#BFDBFE" },
  Contacted: { bg: "#F1F5F9", text: "#475569", border: "#CBD5E1" },
  Interested: { bg: "#ECFDF5", text: "#059669", border: "#A7F3D0" },
  "Follow-up": { bg: "#FFFBEB", text: "#B45309", border: "#FDE68A" },
  Qualified: { bg: "#F5F3FF", text: "#7C3AED", border: "#C4B5FD" },
  Won: { bg: "#ECFDF5", text: "#065F46", border: "#34D399" },
  Lost: { bg: "#FEF2F2", text: "#B91C1C", border: "#FECACA" },
  Spam: { bg: "#F9FAFB", text: "#6B7280", border: "#E5E7EB" },
};

const AVATAR_PALETTE = [
  { bg: "#EFF6FF", text: "#1D4ED8" },
  { bg: "#F0FDF4", text: "#15803D" },
  { bg: "#FFF7ED", text: "#C2410C" },
  { bg: "#F5F3FF", text: "#6D28D9" },
];

// ─── Helpers ─────────────────────────────────────────────────────

function initials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
}

// ─── Sub-components ──────────────────────────────────────────────

function Section({
  label,
  children,
  last,
}: {
  label: string;
  children: React.ReactNode;
  last?: boolean;
}) {
  return (
    <div
      style={{
        padding: "12px 14px",
        borderBottom: last ? "none" : "1px solid var(--border)",
      }}
    >
      <p
        style={{
          margin: "0 0 8px",
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: "0.07em",
          textTransform: "uppercase",
          color: "var(--text-secondary)",
        }}
      >
        {label}
      </p>
      {children}
    </div>
  );
}

function AiRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 7 }}>
      <span style={{ color: "#2563EB", marginTop: 1, flexShrink: 0 }}>{icon}</span>
      <div>
        <p
          style={{
            margin: "0 0 2px",
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: "0.05em",
            textTransform: "uppercase",
            color: "#2563EB",
          }}
        >
          {label}
        </p>
        <p style={{ margin: 0, fontSize: 12, color: "#1E3A8A", lineHeight: 1.5 }}>
          {value}
        </p>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────

export default function LeadDetailPanel({
  lead,
  onClose,
  onOpenFullPage,
  onOpenCallIntelligence,
  avatarIndex = 0,
}: {
  lead: Lead;
  onClose: () => void;
  onOpenFullPage: (lead: Lead) => void;
  onOpenCallIntelligence: (lead: Lead) => void;
  avatarIndex?: number;
}) {
  const [stage, setStage] = useState<LeadStatus>(lead.status);
  const [outcome, setOutcome] = useState<Outcome | null>(null);
  const [notes, setNotes] = useState(lead.notes ?? "");

  const av = AVATAR_PALETTE[avatarIndex % AVATAR_PALETTE.length];
  const score = SCORE_STYLES[lead.score] ?? SCORE_STYLES.Cold;
  const stageStyle = STATUS_STYLES[stage] ?? STATUS_STYLES.Spam;

  const selectOutcome = (o: Outcome) => {
    setOutcome(o);
    if (o.status) setStage(o.status);
  };

  return (
    <aside
      style={{
        width: 360,
        flexShrink: 0,
        borderLeft: "1px solid var(--border)",
        background: "var(--surface)",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        overflow: "hidden",
      }}
    >
      {/* ── HEADER ── */}
      <div
        style={{
          padding: "14px",
          borderBottom: "1px solid var(--border)",
          flexShrink: 0,
        }}
      >
        {/* Avatar · name · close */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 8 }}>
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              flexShrink: 0,
              background: av.bg,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 600,
              fontSize: 13,
              color: av.text,
              letterSpacing: "0.03em",
              border: "1px solid var(--border)",
            }}
          >
            {initials(lead.name)}
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <p
              style={{
                fontWeight: 600,
                fontSize: 14,
                color: "var(--text-primary)",
                margin: 0,
                lineHeight: 1.25,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {lead.name}
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 3 }}>
              <MapPin size={10} strokeWidth={2} style={{ color: "var(--text-secondary)", flexShrink: 0 }} />
              <span style={{ fontSize: 11, color: "var(--text-secondary)" }}>{lead.city}</span>
              <span style={{ fontSize: 11, color: "var(--border-strong)" }}>·</span>
              <span style={{ fontSize: 11, color: "var(--text-secondary)" }}>{lead.source}</span>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                marginTop: 5,
                marginLeft: -50,
              }}
            >
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                  fontSize: 11,
                  fontWeight: 600,
                  padding: "3px 8px",
                  borderRadius: 50,
                  background: score.bg,
                  color: score.text,
                  border: "1px solid var(--border)",
                }}
              >
                <span
                  style={{
                    width: 5,
                    height: 5,
                    borderRadius: "50%",
                    background: score.dot,
                    display: "inline-block",
                  }}
                />
                {lead.score}
              </span>

              <span
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  padding: "3px 8px",
                  borderRadius: 99,
                  background: stageStyle.bg,
                  color: stageStyle.text,
                  border: `1px solid ${stageStyle.border}`,
                }}
              >
                {stage}
              </span>
            </div>
          </div>



          <button
            onClick={onClose}
            style={{
              width: 26,
              height: 26,
              borderRadius: 7,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "1px solid var(--border)",
              background: "transparent",
              color: "var(--text-secondary)",
              cursor: "pointer",
              flexShrink: 0,
            }}
          >
            <X size={12} strokeWidth={2} />
          </button>
        </div>



        {/* Action buttons */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
          <button
            onClick={() => onOpenFullPage(lead)}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 5,
              padding: "10px 0",
              borderRadius: 8,
              background: "var(--surface-2)",
              border: "1px solid var(--border)",
              color: "var(--text-secondary)",
              fontSize: 12.5,
              fontWeight: 550,
              cursor: "pointer",
              transition: "background 0.12s, color 0.12s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = "#EFF6FF";
              (e.currentTarget as HTMLElement).style.color = "#1D4ED8";
              (e.currentTarget as HTMLElement).style.borderColor = "#BFDBFE";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "var(--surface-2)";
              (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)";
              (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
            }}
          >
            <ExternalLink size={11} strokeWidth={2} />
            Full detail
          </button>

          <button
            onClick={() => onOpenCallIntelligence(lead)}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 5,
              padding: "10px 0",
              borderRadius: 8,
              background: "#1D4ED8",
              border: "none",
              color: "#fff",
              fontSize: 12.5,
              fontWeight: 550,
              cursor: "pointer",
              transition: "background 0.12s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = "#1E40AF";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "#1D4ED8";
            }}
          >
            <Brain size={11} strokeWidth={2} />
            Call intel
          </button>
        </div>
      </div>

      {/* ── SCROLLABLE BODY ── */}
      <div style={{ flex: 1, overflowY: "auto" }}>

        {/* ── Log Call Outcome ── */}
        <Section label="Log call outcome">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 6,
            }}
          >
            {OUTCOMES.map((o) => {
              const isSelected = outcome?.label === o.label;
              const s = OUTCOME_STYLES[o.color];
              return (
                <button
                  key={o.label}
                  onClick={() => selectOutcome(o)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 7,
                    padding: "6px 8px",
                    borderRadius: 8,
                    border: `1px solid ${isSelected ? s.activeBorder : "var(--border)"}`,
                    background: isSelected ? s.activeBg : "var(--surface-2)",
                    cursor: "pointer",
                    transition: "all 0.12s",
                    textAlign: "left",
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) {
                      (e.currentTarget as HTMLElement).style.background = s.activeBg;
                      (e.currentTarget as HTMLElement).style.borderColor = s.activeBorder;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      (e.currentTarget as HTMLElement).style.background = "var(--surface-2)";
                      (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
                    }
                  }}
                >
                  {/* Icon */}
                  <div
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: 7,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      background: isSelected ? s.iconActiveBg : "var(--surface)",
                      border: `1px solid ${isSelected ? s.iconActiveBg : "var(--border-strong)"}`,
                      color: isSelected ? "#fff" : "var(--text-secondary)",
                      transition: "all 0.12s",
                    }}
                  >
                    {o.icon}
                  </div>

                  {/* Text */}
                  <div>
                    <p
                      style={{
                        margin: 0,
                        fontSize: 11,
                        fontWeight: 600,
                        color: isSelected ? s.activeText : "var(--text-primary)",
                        lineHeight: 1.2,
                      }}
                    >
                      {o.label}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Confirmation strip */}
          {outcome && (
            <div
              style={{
                marginTop: 8,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "7px 10px",
                borderRadius: 8,
                background: "var(--surface-2)",
                border: "1px solid var(--border)",
              }}
            >
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  fontSize: 11,
                  color: "var(--text-secondary)",
                }}
              >
                <Check size={11} strokeWidth={2.5} style={{ color: "#059669" }} />
                Outcome logged
              </span>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  padding: "2px 8px",
                  borderRadius: 99,
                  background: stageStyle.bg,
                  color: stageStyle.text,
                  border: `1px solid ${stageStyle.border}`,
                }}
              >
                Stage → {stage}
              </span>
            </div>
          )}
        </Section>

        {/* ── AI Pre-Call Brief ── */}
        <Section label="AI pre-call brief">
          <div
            style={{
              background: "#EFF6FF",
              border: "1px solid #BFDBFE",
              borderRadius: 10,
              padding: "11px 12px",
            }}
          >
            <AiRow
              icon={<Sparkles size={12} strokeWidth={2} />}
              label="Summary"
              value={lead.aiSummary.summary}
            />

            <hr
              style={{
                border: "none",
                borderTop: "1px solid #BFDBFE",
                margin: "9px 0",
              }}
            />

            <AiRow
              icon={<Clock size={12} strokeWidth={2} />}
              label="Best time to call"
              value={lead.aiSummary.bestTimeToCall}
            />

            <div style={{ marginTop: 7 }}>
              <AiRow
                icon={<Zap size={12} strokeWidth={2} />}
                label="Next action"
                value={lead.aiSummary.nextAction}
              />
            </div>

            <button
              onClick={() => onOpenCallIntelligence(lead)}
              style={{
                marginTop: 10,
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 5,
                padding: "7px 0",
                borderRadius: 8,
                background: "#DBEAFE",
                color: "#1D4ED8",
                border: "1px solid #BFDBFE",
                fontSize: 13,
                fontWeight: 700,
                cursor: "pointer",
                transition: "background 0.12s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = "#BFDBFE";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = "#DBEAFE";
              }}
            >
              <Brain size={11} strokeWidth={2} />
              Open full call intelligence
              <ChevronRight size={11} strokeWidth={2.5} />
            </button>
          </div>
        </Section>

        {/* ── AI Call Summary ── */}
        <Section label="AI call summary">
          <p
            style={{
              margin: 0,
              fontSize: 12,
              color: "var(--text-secondary)",
              lineHeight: 1.65,
            }}
          >
            {lead.aiSummary.summary}
          </p>
        </Section>

        {/* ── Notes ── */}
        <Section label="Notes" last>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
            placeholder="Add a note…"
            style={{
              width: "100%",
              fontSize: 12,
              borderRadius: 8,
              padding: "8px 10px",
              resize: "vertical",
              lineHeight: 1.6,
              boxSizing: "border-box",
              background: "var(--surface-2)",
              border: "1px solid var(--border-strong)",
              color: "var(--text-primary)",
              fontFamily: "inherit",
              outline: "none",
              transition: "border-color 0.12s",
            }}
            onFocus={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = "#BFDBFE";
            }}
            onBlur={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = "var(--border-strong)";
            }}
          />
        </Section>
      </div>
    </aside>
  );
}