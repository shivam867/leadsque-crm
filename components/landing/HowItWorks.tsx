"use client";
import { useState, useEffect } from "react";
import {
  Database,
  Sparkles,
  UserCheck,
  ArrowLeftRight,
  PhoneCall,
  BarChart3,
  Zap,
  ChevronRight,
  ArrowRight,
  ArrowDown,
  ArrowLeft,
} from "lucide-react";

type StepData = {
  id: number;
  icon: React.ElementType;
  label: string;
  desc: string;
  detail: string;
  bg: string;
  accent: string;
  iconColor: string;
  tier: "all" | "ai" | "pro";
  tierLabel?: string;
  tierBg?: string;
};

const steps: StepData[] = [
  {
    id: 1,
    icon: Database,
    label: "CRM Data Pull",
    desc: "All lead data synced from existing CRM including raw comments and DNP logs.",
    detail:
      "Pulls comment history, Did-Not-Pick logs, counselor notes, and raw lead fields from LeadSquared, Meritto, or Zoho. Zero disruption to existing workflow.",
    bg: "#E6F1FB",
    accent: "#0C447C",
    iconColor: "#185FA5",
    tier: "all",
  },
  {
    id: 2,
    icon: Sparkles,
    label: "Data Enhancement",
    desc: "AI extracts best call times, competitor signals, and objection types from every note.",
    detail:
      "Reads past DNP patterns to calculate optimal call windows per lead. Scans counselor notes to surface competitor mentions, price objections, and academic context — invisibly enriching every record.",
    bg: "#E1F5EE",
    accent: "#085041",
    iconColor: "#0F6E56",
    tier: "ai",
    tierLabel: "AI+",
    tierBg: "#0F6E5618",
  },
  {
    id: 3,
    icon: UserCheck,
    label: "Smart Follow-Up",
    desc: "Non-enrolled leads enter a structured monthly engagement cycle with weekend worksheets.",
    detail:
      "Mon–Fri: lightweight personalised messages check readiness. Saturday–Sunday: subject-specific diagnostic worksheet sent via WhatsApp at each parent's individually-calculated optimal time.",
    bg: "#EEEDFE",
    accent: "#26215C",
    iconColor: "#534AB7",
    tier: "pro",
    tierLabel: "Pro",
    tierBg: "#534AB718",
  },
  {
    id: 4,
    icon: ArrowLeftRight,
    label: "Lead Segregation",
    desc: "Post-follow-up, every lead is split: Actionable (sales-ready) vs Non-Actionable (re-engage).",
    detail:
      "Actionable signals: clear buying interest, price or batch doubts, competitor evaluation, spouse consultation needed. Non-actionable leads kept warm on a 6-month monthly cycle — never pushed to sales.",
    bg: "#FAEEDA",
    accent: "#412402",
    iconColor: "#854F0B",
    tier: "all",
  },
  {
    id: 5,
    icon: PhoneCall,
    label: "Sales Handoff",
    desc: "Actionable leads passed to counselors with full AI context — pre-call brief, opening line, objections.",
    detail:
      "Counselor sees: urgency flag, emotional state (Warming Up / Hesitant / High Urgency), language preference, competitor intel, suggested opening line, best time to call — all on one screen, readable in 60 seconds.",
    bg: "#FAECE7",
    accent: "#4A1B0C",
    iconColor: "#993C1D",
    tier: "ai",
    tierLabel: "AI+",
    tierBg: "#993C1D18",
  },
  {
    id: 6,
    icon: BarChart3,
    label: "Analytics & Reporting",
    desc: "Complete visibility: leakage reports, counselor performance, 30-day enrollment prediction.",
    detail:
      "Director sees: revenue momentum (+18% QoQ), revenue leakage analysis, pipeline funnel, top source breakdown. Team leader sees: counselor talk ratios, coaching flags, escalation status. All real-time.",
    bg: "#E1F5EE",
    accent: "#085041",
    iconColor: "#0F6E56",
    tier: "pro",
    tierLabel: "Pro",
    tierBg: "#534AB718",
  },
];

function TierBadge({ step }: { step: StepData }) {
  if (!step.tierLabel) return null;
  return (
    <span
      style={{
        position: "absolute",
        top: 10,
        right: 10,
        fontSize: 9,
        fontWeight: 800,
        letterSpacing: "0.7px",
        textTransform: "uppercase",
        color: step.iconColor,
        background: step.tierBg ?? `${step.iconColor}18`,
        padding: "2px 7px",
        borderRadius: 4,
      }}
    >
      {step.tierLabel}
    </span>
  );
}

function StepCard({
  step,
  active,
  onClick,
}: {
  step: StepData;
  active: boolean;
  onClick: () => void;
}) {
  const Icon = step.icon;
  return (
    <button
      onClick={onClick}
      role="tab"
      aria-selected={active}
      aria-controls="step-detail-panel"
      id={`step-tab-${step.id}`}
      style={{
        flex: 1,
        background: active ? step.bg : "transparent",
        borderRadius: 12,
        padding: "14px 14px 14px",
        display: "flex",
        flexDirection: "column",
        gap: 8,
        cursor: "pointer",
        border: active ? `1.5px solid ${step.iconColor}50` : "1.5px solid #D1D5DB",
        transition: "all 0.2s ease",
        position: "relative",
        minWidth: 0,
        textAlign: "left",
        width: "100%",
      }}
    >
      <TierBadge step={step} />
      <div
        style={{
          width: 34,
          height: 34,
          borderRadius: 8,
          background: active ? "rgba(255,255,255,0.8)" : "#ECEAE6",
          border: "1px solid #E5E7EB",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Icon size={16} color={active ? step.iconColor : "#6B7280"} />
      </div>
      <div
        style={{
          fontSize: 13,
          fontWeight: 700,
          color: active ? step.accent : "#1F2937",
          lineHeight: 1.25,
        }}
      >
        {step.label}
      </div>
      <div
        style={{
          fontSize: 11.5,
          color: active ? step.iconColor : "#4B5563",
          lineHeight: 1.55,
        }}
      >
        {step.desc}
      </div>
    </button>
  );
}

export default function HowItWorks() {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 700);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const active = steps.find((s) => s.id === activeStep)!;

  return (
    <section id="how-it-works" style={{ padding: "96px 0" }}>
      <div style={{ maxWidth: 1152, margin: "0 auto", padding: "0 24px" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 14px",
              borderRadius: 999,
              background: "#EEF2FF",
              border: "1px solid #C7D2FE",
              marginBottom: 20,
            }}
          >
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#4F46E5", display: "inline-block" }} />
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.9px", textTransform: "uppercase", color: "#4338CA" }}>
              How It Works
            </span>
          </div>
          <h2 style={{ fontSize: 32, fontWeight: 800, color: "#111827", letterSpacing: "-0.5px", marginBottom: 12, lineHeight: 1.2 }}>
            Six steps. One data spine.
          </h2>
          <p style={{ fontSize: 15, color: "#374151", lineHeight: 1.7, maxWidth: 480, margin: "0 auto" }}>
            Every lead flows through this exact pipeline — from the moment it enters the CRM to the moment it converts, or is queued for re-engagement.
          </p>
        </div>

        {/* Pipeline diagram */}
        <div
          role="tablist"
          aria-label="Pipeline steps"
          style={{
            background: "transparent",
            border: "1px solid #E5E7EB",
            borderRadius: 16,
            padding: isMobile ? "20px 16px" : "28px 28px 20px",
            marginBottom: 20,
          }}
        >
          {isMobile ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <div style={{ textAlign: "center", marginBottom: 8, fontSize: 12, fontWeight: 600, color: "#6B7280" }}>
                Step {activeStep} of {steps.length}
              </div>
              {steps.map((step, i) => (
                <div key={step.id}>
                  <StepCard step={step} active={activeStep === step.id} onClick={() => setActiveStep(step.id)} />
                  {i < steps.length - 1 && (
                    <div style={{ display: "flex", justifyContent: "center", margin: "4px 0" }}>
                      <ArrowDown size={18} color="#9CA3AF" strokeWidth={1.5} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <>
              {/* Row 1: Steps 1 → 2 → 3 */}
              <div style={{ display: "flex", alignItems: "stretch", gap: 0 }}>
                {[steps[0], steps[1], steps[2]].map((step, i) => (
                  <div key={step.id} style={{ display: "flex", alignItems: "center", flex: 1, minWidth: 0 }}>
                    <StepCard step={step} active={activeStep === step.id} onClick={() => setActiveStep(step.id)} />
                    {i < 2 && (
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, width: 32 }}>
                        <ArrowRight size={18} color="#9CA3AF" strokeWidth={1.5} />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Down arrow — right-aligned under step 3 */}
              <div style={{ display: "flex", justifyContent: "flex-end", padding: "6px 0" }}>
                <div style={{ width: "calc(33.33% - 16px)", display: "flex", justifyContent: "center" }}>
                  <ArrowDown size={20} color="#9CA3AF" strokeWidth={1.5} />
                </div>
              </div>

              {/* Row 2: Steps 6 ← 5 ← 4 */}
              <div style={{ display: "flex", alignItems: "stretch", gap: 0 }}>
                <div style={{ display: "flex", alignItems: "center", flex: 1, minWidth: 0 }}>
                  <StepCard step={steps[5]} active={activeStep === steps[5].id} onClick={() => setActiveStep(steps[5].id)} />
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, width: 32 }}>
                  <ArrowLeft size={18} color="#9CA3AF" strokeWidth={1.5} />
                </div>
                <div style={{ display: "flex", alignItems: "center", flex: 1, minWidth: 0 }}>
                  <StepCard step={steps[4]} active={activeStep === steps[4].id} onClick={() => setActiveStep(steps[4].id)} />
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, width: 32 }}>
                  <ArrowLeft size={18} color="#9CA3AF" strokeWidth={1.5} />
                </div>
                <div style={{ display: "flex", alignItems: "center", flex: 1, minWidth: 0 }}>
                  <StepCard step={steps[3]} active={activeStep === steps[3].id} onClick={() => setActiveStep(steps[3].id)} />
                </div>
              </div>
            </>
          )}

          {/* Footer hint */}
          <div
            style={{
              marginTop: 20,
              padding: "10px 14px",
              background: "transparent",
              border: "1px solid #E5E7EB",
              borderRadius: 8,
              display: "flex",
              alignItems: "flex-start",
              gap: 8,
            }}
          >
            <Zap size={13} color="#374151" style={{ flexShrink: 0, marginTop: 2 }} />
            <div style={{ fontSize: 13, color: "#1F2937", lineHeight: 1.6 }}>
              <span style={{ fontWeight: 700 }}>Click any step to learn more. </span>
              Tags show which tier unlocks each step —{" "}
              <span style={{ color: "#185FA5", fontWeight: 600 }}>no tag = all tiers</span>,{" "}
              <span style={{ color: "#0F6E56", fontWeight: 600 }}>AI+</span>, or{" "}
              <span style={{ color: "#534AB7", fontWeight: 600 }}>Pro</span>.
            </div>
          </div>
        </div>

        {/* Detail panel */}
        <div
          key={activeStep}
          id="step-detail-panel"
          role="tabpanel"
          aria-labelledby={`step-tab-${activeStep}`}
          style={{
            background: active.bg,
            border: `1px solid ${active.iconColor}30`,
            borderRadius: 16,
            padding: "24px 28px",
            animation: "fadeSlideIn 0.25s ease",
          }}
        >
          {/* Icon + text row */}
          <div style={{ display: "flex", alignItems: "flex-start", gap: 20 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: "rgba(255,255,255,0.75)",
                border: "1px solid rgba(0,0,0,0.08)",
                display: isMobile ? "none" : "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              {(() => {
                const I = active.icon;
                return <I size={20} color={active.iconColor} />;
              })()}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8, flexWrap: "wrap" }}>
                <h3 style={{ fontSize: 16, fontWeight: 800, color: active.accent, margin: 0 }}>
                  Step {active.id}: {active.label}
                </h3>
                {active.tierLabel && (
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 800,
                      letterSpacing: "0.6px",
                      textTransform: "uppercase",
                      color: active.iconColor,
                      background: active.tierBg ?? `${active.iconColor}20`,
                      padding: "2px 8px",
                      borderRadius: 4,
                    }}
                  >
                    {active.tierLabel}
                  </span>
                )}
              </div>
              <p style={{ fontSize: 14, color: active.accent, lineHeight: 1.7, margin: 0, opacity: 0.85 }}>
                {active.detail}
              </p>
            </div>
          </div>

          {/* Next button — separate row, aligned right, only on non-last steps */}
          {activeStep < 6 && (
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 16 }}>
              <button
                onClick={() => setActiveStep(activeStep + 1)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  padding: "9px 16px",
                  borderRadius: 8,
                  background: active.iconColor,
                  color: "white",
                  fontSize: 12,
                  fontWeight: 700,
                  border: "none",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                }}
              >
                Next <ChevronRight size={13} />
              </button>
            </div>
          )}
        </div>

      </div>
    </section>
  );
}