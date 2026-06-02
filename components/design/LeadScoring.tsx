"use client";
import { AlertCircle } from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────
export interface ScoreWeight {
  id: string;
  label: string;
  weight: number;
  options: { label: string; score: number }[];
}

// ─── Constants ───────────────────────────────────────────────────
export const DEFAULT_SCORE_WEIGHTS: ScoreWeight[] = [
  {
    id: "sw1", label: "Intake Timeline", weight: 25,
    options: [
      { label: "Immediate",   score: 25 },
      { label: "1-3 months",  score: 18 },
      { label: "3-6 months",  score: 10 },
      { label: "6+ months",   score: 4  },
    ],
  },
  {
    id: "sw2", label: "Engagement Level", weight: 30,
    options: [
      { label: "Ready to Enroll",        score: 30 },
      { label: "Actively Researching",   score: 18 },
      { label: "Just Exploring",         score: 6  },
    ],
  },
  {
    id: "sw3", label: "Budget Readiness", weight: 25,
    options: [
      { label: "High",   score: 25 },
      { label: "Medium", score: 15 },
      { label: "Low",    score: 5  },
    ],
  },
  {
    id: "sw4", label: "Education", weight: 20,
    options: [
      { label: "Post Graduate",       score: 20 },
      { label: "Graduate",            score: 17 },
      { label: "Working Professional", score: 14 },
      { label: "Final Year",          score: 8  },
    ],
  },
];

// ─── Shared styles ────────────────────────────────────────────────
const card: React.CSSProperties = {
  background: "#fff", border: "1px solid #E5E7EB",
  borderRadius: 12, overflow: "hidden",
};

const cardHeader: React.CSSProperties = {
  padding: "11px 16px", borderBottom: "1px solid #F3F4F6",
  display: "flex", alignItems: "center", justifyContent: "space-between",
};

const cardBody: React.CSSProperties = { padding: "14px 16px" };

const sectionTitle: React.CSSProperties = {
  fontSize: 13, fontWeight: 700, color: "#111827", margin: 0,
};

const sectionSub: React.CSSProperties = {
  fontSize: 11, color: "#6B7280", margin: "2px 0 0",
};

const inputStyle: React.CSSProperties = {
  fontSize: 12, padding: "7px 10px", borderRadius: 7,
  border: "1px solid #E5E7EB", color: "#111827",
  background: "#fff", outline: "none", width: "100%",
  boxSizing: "border-box" as const,
};

const CHART_COLORS = ["#2563EB", "#7C3AED", "#059669", "#D97706"];

// ─── Score Weight Row ─────────────────────────────────────────────
function ScoreWeightRow({
  sw, onChange,
}: {
  sw: ScoreWeight;
  onChange: (s: ScoreWeight) => void;
}) {
  return (
    <div style={{ border: "1px solid #F0F0F0", borderRadius: 9, padding: "10px 12px", marginBottom: 7 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 7 }}>
        <span style={{ fontSize: 12, fontWeight: 700, color: "#111827" }}>{sw.label}</span>
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <span style={{ fontSize: 10, color: "#9CA3AF" }}>Max</span>
          <input
            type="number"
            value={sw.weight}
            min={0}
            max={100}
            onChange={e => onChange({ ...sw, weight: Number(e.target.value) })}
            style={{ ...inputStyle, width: 48, fontSize: 11, padding: "3px 6px", textAlign: "center" }}
          />
          <span style={{ fontSize: 10, color: "#9CA3AF" }}>pts</span>
        </div>
      </div>

      {/* Options */}
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {sw.options.map((opt, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <input
              value={opt.label}
              onChange={e => {
                const o = [...sw.options];
                o[i] = { ...opt, label: e.target.value };
                onChange({ ...sw, options: o });
              }}
              style={{ ...inputStyle, flex: 1, fontSize: 11, padding: "4px 7px" }}
            />
            <span style={{ fontSize: 10, color: "#9CA3AF", flexShrink: 0 }}>→</span>
            <input
              type="number"
              value={opt.score}
              min={0}
              max={sw.weight}
              onChange={e => {
                const o = [...sw.options];
                o[i] = { ...opt, score: Number(e.target.value) };
                onChange({ ...sw, options: o });
              }}
              style={{ ...inputStyle, width: 44, fontSize: 11, padding: "4px 6px", textAlign: "center" }}
            />
            <span style={{ fontSize: 10, color: "#9CA3AF", flexShrink: 0 }}>pts</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Weight Distribution Overview ─────────────────────────────────
function WeightDistribution({ scoreWeights }: { scoreWeights: ScoreWeight[] }) {
  const totalWeight = scoreWeights.reduce((a, sw) => a + sw.weight, 0);

  return (
    <div style={card}>
      <div style={cardHeader}>
        <div>
          <p style={sectionTitle}>Weight Distribution</p>
          <p style={sectionSub}>Should sum to 100</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <span style={{ fontSize: 14, fontWeight: 800, color: totalWeight === 100 ? "#059669" : "#B91C1C" }}>
            {totalWeight}/100
          </span>
          {totalWeight !== 100 && <AlertCircle size={13} style={{ color: "#B91C1C" }} />}
        </div>
      </div>
      <div style={cardBody}>
        {/* Stacked bar */}
        <div style={{ display: "flex", height: 7, borderRadius: 99, overflow: "hidden", marginBottom: 10, gap: 2 }}>
          {scoreWeights.map((sw, i) => (
            <div
              key={sw.id}
              style={{ flex: sw.weight, background: CHART_COLORS[i % CHART_COLORS.length], borderRadius: 99 }}
            />
          ))}
        </div>
        {scoreWeights.map((sw, i) => (
          <div key={sw.id} style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 4 }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: CHART_COLORS[i % CHART_COLORS.length], flexShrink: 0 }} />
            <span style={{ fontSize: 11, color: "#374151", flex: 1 }}>{sw.label}</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: CHART_COLORS[i % CHART_COLORS.length] }}>{sw.weight}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Score Bands ──────────────────────────────────────────────────
function ScoreBands() {
  const bands = [
    { label: "Hot",  range: "70–100", color: "#BE123C", bg: "#FFF1F2", desc: "Follow up immediately" },
    { label: "Warm", range: "40–69",  color: "#B45309", bg: "#FFFBEB", desc: "Nurture actively"      },
    { label: "Cold", range: "0–39",   color: "#2563EB", bg: "#EFF6FF", desc: "Periodic follow-up"    },
  ];

  return (
    <div style={card}>
      <div style={cardHeader}><p style={sectionTitle}>Score Bands</p></div>
      <div style={cardBody}>
        {bands.map(b => (
          <div key={b.label} style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: "8px 0", borderBottom: "1px solid #F9FAFB",
          }}>
            <span style={{
              fontSize: 10, fontWeight: 800, padding: "2px 8px",
              borderRadius: 99, background: b.bg, color: b.color,
              minWidth: 34, textAlign: "center",
            }}>
              {b.label}
            </span>
            <span style={{ fontSize: 11, fontWeight: 700, color: "#374151", minWidth: 44 }}>{b.range}</span>
            <span style={{ fontSize: 11, color: "#6B7280" }}>{b.desc}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────
export default function LeadScoring({
  scoreWeights,
  setScoreWeights,
}: {
  scoreWeights: ScoreWeight[];
  setScoreWeights: React.Dispatch<React.SetStateAction<ScoreWeight[]>>;
}) {
  const updateWeight = (updated: ScoreWeight) =>
    setScoreWeights(prev => prev.map(s => s.id === updated.id ? updated : s));

  return (
    <div style={{ maxWidth: 680 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>

        {/* Left column: distribution + bands */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <WeightDistribution scoreWeights={scoreWeights} />
          <ScoreBands />
        </div>

        {/* Right column: criteria */}
        <div style={card}>
          <div style={cardHeader}><p style={sectionTitle}>Scoring Criteria</p></div>
          <div style={cardBody}>
            {scoreWeights.map(sw => (
              <ScoreWeightRow key={sw.id} sw={sw} onChange={updateWeight} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}