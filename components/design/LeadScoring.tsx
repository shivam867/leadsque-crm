"use client";
import { AlertCircle } from "lucide-react";

export interface ScoreWeight {
  id: string;
  label: string;
  weight: number;
  options: { label: string; score: number }[];
}

export const DEFAULT_SCORE_WEIGHTS: ScoreWeight[] = [
  {
    id: "sw1", label: "Intake Timeline", weight: 25,
    options: [
      { label: "Immediate",  score: 25 },
      { label: "1-3 months", score: 18 },
      { label: "3-6 months", score: 10 },
      { label: "6+ months",  score: 4  },
    ],
  },
  {
    id: "sw2", label: "Engagement Level", weight: 30,
    options: [
      { label: "Ready to Enroll",      score: 30 },
      { label: "Actively Researching", score: 18 },
      { label: "Just Exploring",       score: 6  },
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
      { label: "Post Graduate",        score: 20 },
      { label: "Graduate",             score: 17 },
      { label: "Working Professional", score: 14 },
      { label: "Final Year",           score: 8  },
    ],
  },
];

// Chart colors for the stacked bar — intentional data-driven palette
const CHART_COLORS = ["var(--accent)", "var(--accent)", "var(--success)", "var(--warning)"];
const CHART_COLORS_HEX = ["#2563EB", "#7C3AED", "#059669", "#D97706"]; // used for legend dots

function ScoreWeightRow({ sw, onChange }: { sw: ScoreWeight; onChange: (s: ScoreWeight) => void }) {
  return (
    <div style={{ border: "1px solid var(--surface-3)", borderRadius: 9, padding: "10px 12px", marginBottom: 7 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 7 }}>
        <span style={{ fontSize: 12, fontWeight: 700, color: "var(--text-primary)" }}>{sw.label}</span>
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <span style={{ fontSize: 10, color: "var(--text-muted)" }}>Max</span>
          <input
            type="number"
            value={sw.weight}
            min={0}
            max={100}
            onChange={e => onChange({ ...sw, weight: Number(e.target.value) })}
            className="input"
            style={{ width: 48, fontSize: 11, padding: "3px 6px", textAlign: "center" }}
          />
          <span style={{ fontSize: 10, color: "var(--text-muted)" }}>pts</span>
        </div>
      </div>
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
              className="input"
              style={{ flex: 1, fontSize: 11, padding: "4px 7px" }}
            />
            <span style={{ fontSize: 10, color: "var(--text-muted)", flexShrink: 0 }}>→</span>
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
              className="input"
              style={{ width: 44, fontSize: 11, padding: "4px 6px", textAlign: "center" }}
            />
            <span style={{ fontSize: 10, color: "var(--text-muted)", flexShrink: 0 }}>pts</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function WeightDistribution({ scoreWeights }: { scoreWeights: ScoreWeight[] }) {
  const totalWeight = scoreWeights.reduce((a, sw) => a + sw.weight, 0);
  const isValid = totalWeight === 100;

  return (
    <div className="card">
      <div style={{ padding: "11px 16px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <p style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)", margin: 0 }}>Weight Distribution</p>
          <p style={{ fontSize: 11, color: "var(--text-secondary)", margin: "2px 0 0" }}>Should sum to 100</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <span style={{ fontSize: 14, fontWeight: 800, color: isValid ? "var(--success)" : "var(--danger)" }}>
            {totalWeight}/100
          </span>
          {!isValid && <AlertCircle size={13} style={{ color: "var(--danger)" }} />}
        </div>
      </div>
      <div style={{ padding: "14px 16px" }}>
        {/* Stacked bar */}
        <div style={{ display: "flex", height: 7, borderRadius: 99, overflow: "hidden", marginBottom: 10, gap: 2 }}>
          {scoreWeights.map((sw, i) => (
            <div key={sw.id} style={{ flex: sw.weight, background: CHART_COLORS_HEX[i % CHART_COLORS_HEX.length], borderRadius: 99 }} />
          ))}
        </div>
        {scoreWeights.map((sw, i) => (
          <div key={sw.id} style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 4 }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: CHART_COLORS_HEX[i % CHART_COLORS_HEX.length], flexShrink: 0 }} />
            <span style={{ fontSize: 11, color: "var(--text-secondary)", flex: 1 }}>{sw.label}</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: CHART_COLORS_HEX[i % CHART_COLORS_HEX.length] }}>{sw.weight}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ScoreBands() {
  const bands = [
    { label: "Hot",  range: "70–100", color: "var(--danger)",  bg: "var(--danger-light)",  desc: "Follow up immediately" },
    { label: "Warm", range: "40–69",  color: "var(--warning)", bg: "var(--warning-light)", desc: "Nurture actively" },
    { label: "Cold", range: "0–39",   color: "var(--info)",    bg: "var(--info-light)",    desc: "Periodic follow-up" },
  ];

  return (
    <div className="card">
      <div style={{ padding: "11px 16px", borderBottom: "1px solid var(--border)" }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)", margin: 0 }}>Score Bands</p>
      </div>
      <div style={{ padding: "14px 16px" }}>
        {bands.map(b => (
          <div key={b.label} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: "1px solid var(--surface-2)" }}>
            <span style={{ fontSize: 10, fontWeight: 800, padding: "2px 8px", borderRadius: 99, background: b.bg, color: b.color, minWidth: 34, textAlign: "center" }}>
              {b.label}
            </span>
            <span style={{ fontSize: 11, fontWeight: 700, color: "var(--text-secondary)", minWidth: 44 }}>{b.range}</span>
            <span style={{ fontSize: 11, color: "var(--text-secondary)" }}>{b.desc}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function LeadScoring({ scoreWeights, setScoreWeights }: {
  scoreWeights: ScoreWeight[];
  setScoreWeights: React.Dispatch<React.SetStateAction<ScoreWeight[]>>;
}) {
  const updateWeight = (updated: ScoreWeight) =>
    setScoreWeights(prev => prev.map(s => s.id === updated.id ? updated : s));

  return (
    <div style={{ maxWidth: 680 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <WeightDistribution scoreWeights={scoreWeights} />
          <ScoreBands />
        </div>
        <div className="card">
          <div style={{ padding: "11px 16px", borderBottom: "1px solid var(--border)" }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)", margin: 0 }}>Scoring Criteria</p>
          </div>
          <div style={{ padding: "14px 16px" }}>
            {scoreWeights.map(sw => (
              <ScoreWeightRow key={sw.id} sw={sw} onChange={updateWeight} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}