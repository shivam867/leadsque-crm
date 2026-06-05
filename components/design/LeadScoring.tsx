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

const COLORS = ["#2563EB", "#7C3AED", "#059669", "#D97706"];

const BANDS = [
  { label: "Hot",  range: "70–100", color: "#B91C1C", bg: "#FEF2F2", border: "#FECACA", desc: "Follow up immediately" },
  { label: "Warm", range: "40–69",  color: "#B45309", bg: "#FFFBEB", border: "#FDE68A", desc: "Nurture actively"      },
  { label: "Cold", range: "0–39",   color: "#2563EB", bg: "#EFF6FF", border: "#BFDBFE", desc: "Periodic follow-up"   },
];

// ─── Stacked bar + legend ─────────────────────────────────────────
function WeightBar({ weights }: { weights: ScoreWeight[] }) {
  const total = weights.reduce((a, s) => a + s.weight, 0);
  const valid = total === 100;

  return (
    <div style={{
      background: "#fff", border: "1px solid #E5E7EB", borderRadius: 10, overflow: "hidden",
    }}>
      <div style={{
        padding: "9px 13px", borderBottom: "1px solid #F3F4F6", background: "#FAFAFA",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div>
          <p style={{ fontSize: 12, fontWeight: 700, color: "#111827", margin: 0 }}>Weight Distribution</p>
          <p style={{ fontSize: 10, color: "#9CA3AF", margin: "1px 0 0" }}>Must sum to 100 pts</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <span style={{ fontSize: 16, fontWeight: 900, color: valid ? "#059669" : "#B91C1C" }}>{total}</span>
          <span style={{ fontSize: 10, color: "#9CA3AF" }}>/100</span>
          {!valid && <AlertCircle size={12} style={{ color: "#B91C1C" }} />}
        </div>
      </div>
      <div style={{ padding: "12px 13px" }}>
        {/* Bar */}
        <div style={{ display: "flex", height: 6, borderRadius: 99, overflow: "hidden", gap: 2, marginBottom: 10 }}>
          {weights.map((s, i) => (
            <div key={s.id} style={{ flex: s.weight, background: COLORS[i % COLORS.length], borderRadius: 99 }} />
          ))}
        </div>
        {/* Legend */}
        {weights.map((s, i) => (
          <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: COLORS[i % COLORS.length], flexShrink: 0 }} />
            <span style={{ fontSize: 11, color: "#6B7280", flex: 1 }}>{s.label}</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: COLORS[i % COLORS.length] }}>{s.weight} pts</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Score bands card ─────────────────────────────────────────────
function ScoreBands() {
  return (
    <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 10, overflow: "hidden" }}>
      <div style={{ padding: "9px 13px", borderBottom: "1px solid #F3F4F6", background: "#FAFAFA" }}>
        <p style={{ fontSize: 12, fontWeight: 700, color: "#111827", margin: 0 }}>Score Bands</p>
        <p style={{ fontSize: 10, color: "#9CA3AF", margin: "1px 0 0" }}>How scores map to lead temperature</p>
      </div>
      <div style={{ padding: "8px 13px" }}>
        {BANDS.map((b, i) => (
          <div key={b.label} style={{
            display: "flex", alignItems: "center", gap: 8,
            padding: "7px 0",
            borderBottom: i < BANDS.length - 1 ? "1px solid #F9FAFB" : "none",
          }}>
            <span style={{
              fontSize: 10, fontWeight: 800, padding: "2px 8px", borderRadius: 99,
              background: b.bg, color: b.color, border: `1px solid ${b.border}`,
              minWidth: 32, textAlign: "center", flexShrink: 0,
            }}>{b.label}</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: "#6B7280", minWidth: 40, flexShrink: 0 }}>{b.range}</span>
            <span style={{ fontSize: 11, color: "#9CA3AF" }}>{b.desc}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Criteria row (one factor) ────────────────────────────────────
function CriteriaRow({ sw, color, onChange }: { sw: ScoreWeight; color: string; onChange: (s: ScoreWeight) => void }) {
  return (
    <div style={{
      background: "#fff", border: "1px solid #E5E7EB",
      borderRadius: 9, overflow: "hidden",
    }}>
      {/* Factor header */}
      <div style={{
        display: "flex", alignItems: "center", gap: 8,
        padding: "7px 11px", background: "#FAFAFA",
        borderBottom: "1px solid #F3F4F6",
      }}>
        <span style={{ width: 8, height: 8, borderRadius: "50%", background: color, flexShrink: 0 }} />
        <span style={{ flex: 1, fontSize: 12, fontWeight: 700, color: "#111827" }}>{sw.label}</span>
        <span style={{ fontSize: 10, color: "#9CA3AF" }}>max</span>
        <input
          type="number" value={sw.weight} min={0} max={100}
          onChange={e => onChange({ ...sw, weight: Number(e.target.value) })}
          style={{
            width: 42, fontSize: 11, fontWeight: 700, padding: "2px 5px", textAlign: "center",
            borderRadius: 5, border: "1px solid #E5E7EB", outline: "none", color,
          }}
        />
        <span style={{ fontSize: 10, color: "#9CA3AF" }}>pts</span>
      </div>
      {/* Options */}
      <div style={{ padding: "6px 11px", display: "flex", flexDirection: "column", gap: 4 }}>
        {sw.options.map((opt, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <input
              value={opt.label}
              onChange={e => {
                const o = [...sw.options]; o[i] = { ...opt, label: e.target.value };
                onChange({ ...sw, options: o });
              }}
              style={{ flex: 1, fontSize: 11, padding: "3px 7px", borderRadius: 5, border: "1px solid #F3F4F6", outline: "none", minWidth: 0 }}
            />
            <span style={{ fontSize: 10, color: "#D1D5DB" }}>→</span>
            <input
              type="number" value={opt.score} min={0} max={sw.weight}
              onChange={e => {
                const o = [...sw.options]; o[i] = { ...opt, score: Number(e.target.value) };
                onChange({ ...sw, options: o });
              }}
              style={{ width: 38, fontSize: 11, fontWeight: 700, padding: "3px 5px", textAlign: "center", borderRadius: 5, border: "1px solid #F3F4F6", outline: "none", color }}
            />
            <span style={{ fontSize: 9, color: "#9CA3AF", flexShrink: 0 }}>pts</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────
export default function LeadScoring({ scoreWeights, setScoreWeights }: {
  scoreWeights: ScoreWeight[];
  setScoreWeights: React.Dispatch<React.SetStateAction<ScoreWeight[]>>;
}) {
  const safe = scoreWeights ?? DEFAULT_SCORE_WEIGHTS;
  const update = (u: ScoreWeight) => setScoreWeights(prev => prev.map(s => s.id === u.id ? u : s));

  // Split criteria into two columns: 2 left, 2 right
  const left  = safe.slice(0, Math.ceil(safe.length / 2));
  const right = safe.slice(Math.ceil(safe.length / 2));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10, height: "100%" }}>

      {/* ── Top row: weight bar + score bands ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, flexShrink: 0 }}>
        <WeightBar weights={safe} />
        <ScoreBands />
      </div>

      {/* ── Bottom: scoring criteria two columns ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, flex: 1, minHeight: 0 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, overflowY: "auto" }}>
          {left.map((sw, i) => (
            <CriteriaRow key={sw.id} sw={sw} color={COLORS[i % COLORS.length]} onChange={update} />
          ))}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, overflowY: "auto" }}>
          {right.map((sw, i) => (
            <CriteriaRow key={sw.id} sw={sw} color={COLORS[(i + left.length) % COLORS.length]} onChange={update} />
          ))}
        </div>
      </div>

    </div>
  );
}