"use client";
import { useState } from "react";
import {
  format, startOfMonth, endOfMonth, eachDayOfInterval,
  getDay, isSameDay, isToday, subMonths, addMonths,
} from "date-fns";
import { ChevronLeft, ChevronRight, Phone, CheckCircle, XCircle, Clock, PhoneOff, TrendingUp, Users, BarChart2 } from "lucide-react";

// ── Team reps ────────────────────────────────────────────────────────────────
const REPS = [
  { id: "all",   name: "All Reps",      avatar: "AR", color: "#6366F1" },
  { id: "as",    name: "Aanya Sharma",  avatar: "AS", color: "#7C3AED" },
  { id: "rk",    name: "Rahul Kapoor",  avatar: "RK", color: "#059669" },
  { id: "pm",    name: "Priya Mehta",   avatar: "PM", color: "#D97706" },
  { id: "sv",    name: "Siddharth V.",  avatar: "SV", color: "#EF4444" },
];

// ── Dummy data per rep per day ────────────────────────────────────────────────
type DayData = { connected: number; noAnswer: number; busy: number; callLater: number; wrongNumber: number };

const TEAM_DATA: Record<string, Record<string, DayData>> = {
  as: {
    "2025-05-01": { connected: 4, noAnswer: 2, busy: 1, callLater: 1, wrongNumber: 0 },
    "2025-05-02": { connected: 6, noAnswer: 3, busy: 2, callLater: 0, wrongNumber: 1 },
    "2025-05-05": { connected: 8, noAnswer: 4, busy: 1, callLater: 2, wrongNumber: 0 },
    "2025-05-07": { connected: 9, noAnswer: 2, busy: 0, callLater: 3, wrongNumber: 1 },
    "2025-05-08": { connected: 3, noAnswer: 5, busy: 2, callLater: 0, wrongNumber: 0 },
    "2025-05-12": { connected: 10, noAnswer: 3, busy: 2, callLater: 1, wrongNumber: 0 },
    "2025-05-14": { connected: 4, noAnswer: 2, busy: 3, callLater: 1, wrongNumber: 0 },
    "2025-05-19": { connected: 11, noAnswer: 2, busy: 1, callLater: 1, wrongNumber: 0 },
    "2025-05-21": { connected: 6, noAnswer: 1, busy: 2, callLater: 1, wrongNumber: 0 },
    "2025-05-27": { connected: 12, noAnswer: 2, busy: 1, callLater: 3, wrongNumber: 0 },
    "2025-05-28": { connected: 7, noAnswer: 5, busy: 3, callLater: 2, wrongNumber: 1 },
  },
  rk: {
    "2025-05-01": { connected: 5, noAnswer: 1, busy: 2, callLater: 0, wrongNumber: 0 },
    "2025-05-05": { connected: 6, noAnswer: 3, busy: 1, callLater: 1, wrongNumber: 1 },
    "2025-05-06": { connected: 9, noAnswer: 2, busy: 0, callLater: 2, wrongNumber: 0 },
    "2025-05-08": { connected: 4, noAnswer: 4, busy: 1, callLater: 1, wrongNumber: 0 },
    "2025-05-13": { connected: 8, noAnswer: 1, busy: 2, callLater: 2, wrongNumber: 0 },
    "2025-05-15": { connected: 11, noAnswer: 3, busy: 1, callLater: 0, wrongNumber: 0 },
    "2025-05-19": { connected: 7, noAnswer: 2, busy: 3, callLater: 1, wrongNumber: 1 },
    "2025-05-20": { connected: 5, noAnswer: 4, busy: 0, callLater: 3, wrongNumber: 0 },
    "2025-05-26": { connected: 9, noAnswer: 1, busy: 1, callLater: 2, wrongNumber: 0 },
    "2025-05-28": { connected: 6, noAnswer: 3, busy: 2, callLater: 1, wrongNumber: 0 },
  },
  pm: {
    "2025-05-02": { connected: 7, noAnswer: 2, busy: 1, callLater: 2, wrongNumber: 0 },
    "2025-05-06": { connected: 5, noAnswer: 3, busy: 2, callLater: 1, wrongNumber: 0 },
    "2025-05-07": { connected: 8, noAnswer: 1, busy: 0, callLater: 2, wrongNumber: 1 },
    "2025-05-09": { connected: 4, noAnswer: 4, busy: 2, callLater: 0, wrongNumber: 0 },
    "2025-05-13": { connected: 10, noAnswer: 2, busy: 1, callLater: 1, wrongNumber: 0 },
    "2025-05-14": { connected: 6, noAnswer: 3, busy: 3, callLater: 2, wrongNumber: 0 },
    "2025-05-20": { connected: 9, noAnswer: 1, busy: 0, callLater: 1, wrongNumber: 0 },
    "2025-05-22": { connected: 7, noAnswer: 2, busy: 2, callLater: 3, wrongNumber: 1 },
    "2025-05-27": { connected: 11, noAnswer: 3, busy: 1, callLater: 1, wrongNumber: 0 },
    "2025-05-28": { connected: 5, noAnswer: 2, busy: 1, callLater: 2, wrongNumber: 0 },
  },
  sv: {
    "2025-05-01": { connected: 3, noAnswer: 3, busy: 2, callLater: 1, wrongNumber: 1 },
    "2025-05-02": { connected: 5, noAnswer: 2, busy: 1, callLater: 1, wrongNumber: 0 },
    "2025-05-07": { connected: 7, noAnswer: 1, busy: 2, callLater: 0, wrongNumber: 0 },
    "2025-05-09": { connected: 6, noAnswer: 3, busy: 1, callLater: 2, wrongNumber: 0 },
    "2025-05-12": { connected: 8, noAnswer: 2, busy: 0, callLater: 1, wrongNumber: 1 },
    "2025-05-16": { connected: 5, noAnswer: 4, busy: 2, callLater: 2, wrongNumber: 0 },
    "2025-05-21": { connected: 9, noAnswer: 1, busy: 1, callLater: 3, wrongNumber: 0 },
    "2025-05-22": { connected: 4, noAnswer: 3, busy: 2, callLater: 1, wrongNumber: 0 },
    "2025-05-23": { connected: 7, noAnswer: 2, busy: 3, callLater: 0, wrongNumber: 1 },
    "2025-05-28": { connected: 8, noAnswer: 1, busy: 0, callLater: 2, wrongNumber: 0 },
  },
};

function mergeDay(dayKey: string): DayData | null {
  const entries = Object.values(TEAM_DATA).map(rd => rd[dayKey]).filter(Boolean) as DayData[];
  if (entries.length === 0) return null;
  return entries.reduce((a, b) => ({
    connected: a.connected + b.connected,
    noAnswer: a.noAnswer + b.noAnswer,
    busy: a.busy + b.busy,
    callLater: a.callLater + b.callLater,
    wrongNumber: a.wrongNumber + b.wrongNumber,
  }));
}

function getRepDay(repId: string, dayKey: string): DayData | null {
  if (repId === "all") return mergeDay(dayKey);
  return TEAM_DATA[repId]?.[dayKey] ?? null;
}

const OUTCOMES = [
  { key: "connected",   label: "Connected",  color: "#10B981" },
  { key: "noAnswer",    label: "No Answer",  color: "#6B7280" },
  { key: "busy",        label: "Busy",       color: "#F59E0B" },
  { key: "callLater",   label: "Call Later", color: "#8B5CF6" },
  { key: "wrongNumber", label: "Wrong #",    color: "#EF4444" },
];

function getTotal(d: DayData) { return d.connected + d.noAnswer + d.busy + d.callLater + d.wrongNumber; }
function getConnectRate(d: DayData) { const t = getTotal(d); return t ? Math.round((d.connected / t) * 100) : 0; }
function getHeat(total: number) {
  if (total === 0) return 0;
  if (total <= 8) return 1;
  if (total <= 16) return 2;
  if (total <= 26) return 3;
  return 4;
}
const HEAT_STYLES: Record<number, { bg: string; border: string }> = {
  0: { bg: "transparent",  border: "var(--border)" },
  1: { bg: "#F9FAFB",      border: "#E5E7EB" },
  2: { bg: "#F3F4F6",      border: "#D1D5DB" },
  3: { bg: "#EEF2FF",      border: "#C7D2FE" },
  4: { bg: "#E0E7FF",      border: "#A5B4FC" },
};

export default function ManagerCalendar() {
  const [current, setCurrent] = useState(new Date(2025, 4, 1));
  const [selected, setSelected] = useState<Date | null>(new Date(2025, 4, 28));
  const [activeRep, setActiveRep] = useState("all");

  const monthStart = startOfMonth(current);
  const monthEnd = endOfMonth(current);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startPad = getDay(monthStart);

  const monthEntries = days
    .map(d => ({ key: format(d, "yyyy-MM-dd"), data: getRepDay(activeRep, format(d, "yyyy-MM-dd")) }))
    .filter(e => e.data !== null) as { key: string; data: DayData }[];

  const monthTotal = monthEntries.reduce((a, e) => a + getTotal(e.data), 0);
  const monthConnected = monthEntries.reduce((a, e) => a + e.data.connected, 0);
  const connectRate = monthTotal ? Math.round((monthConnected / monthTotal) * 100) : 0;
  const activeDays = monthEntries.length;
  const avgPerDay = activeDays ? Math.round(monthTotal / activeDays) : 0;
  const bestDayEntry = monthEntries.reduce<{ key: string; total: number } | null>(
    (b, e) => { const t = getTotal(e.data); return !b || t > b.total ? { key: e.key, total: t } : b; }, null
  );

  const selKey = selected ? format(selected, "yyyy-MM-dd") : null;
  const selData = selKey ? getRepDay(activeRep, selKey) : null;
  const currentRep = REPS.find(r => r.id === activeRep)!;

  return (
    <div style={{ padding: "28px 32px", background: "var(--bg)", minHeight: "100%", fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, sans-serif" }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 28 }}>
        <div>
          <p style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", margin: "0 0 4px", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            Team Performance
          </p>
          <h1 style={{ fontSize: 28, fontWeight: 700, margin: "0 0 4px", background: "linear-gradient(135deg, #111827, #374151)", backgroundClip: "text", WebkitBackgroundClip: "text", color: "transparent", letterSpacing: "-0.02em" }}>
            Call Calendar
          </h1>
          <p style={{ fontSize: 14, color: "var(--text-secondary)", margin: 0 }}>
            {format(current, "MMMM yyyy")} · {activeRep === "all" ? "All Reps" : currentRep.name}
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button style={{ padding: "8px 12px", borderRadius: 10, background: "var(--surface)", border: "1px solid var(--border)", cursor: "pointer" }} onClick={() => setCurrent(subMonths(current, 1))}>
            <ChevronLeft size={14} />
          </button>
          <span style={{ fontSize: 15, fontWeight: 600, color: "var(--text-primary)", minWidth: 120, textAlign: "center", letterSpacing: "-0.01em" }}>
            {format(current, "MMMM yyyy")}
          </span>
          <button style={{ padding: "8px 12px", borderRadius: 10, background: "var(--surface)", border: "1px solid var(--border)", cursor: "pointer" }} onClick={() => setCurrent(addMonths(current, 1))}>
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* Rep selector - pill style */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 24 }}>
        {REPS.map(rep => (
          <button
            key={rep.id}
            onClick={() => { setActiveRep(rep.id); setSelected(null); }}
            style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "6px 16px", borderRadius: 40, cursor: "pointer",
              background: activeRep === rep.id ? "var(--surface)" : "var(--surface-2)",
              border: `1px solid ${activeRep === rep.id ? "var(--border-strong)" : "var(--border)"}`,
              color: activeRep === rep.id ? "var(--text-primary)" : "var(--text-secondary)",
              fontSize: 13, fontWeight: 500, transition: "all 0.2s",
              boxShadow: activeRep === rep.id ? "0 1px 2px rgba(0,0,0,0.05)" : "none",
            }}
          >
            <div style={{
              width: 24, height: 24, borderRadius: "50%",
              background: activeRep === rep.id ? rep.color : `${rep.color}20`,
              color: activeRep === rep.id ? "#fff" : rep.color,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 10, fontWeight: 700,
            }}>
              {rep.id === "all" ? <Users size={12} /> : rep.avatar}
            </div>
            {rep.name}
          </button>
        ))}
      </div>

      {/* Stats row - same as before */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 14, marginBottom: 24 }}>
        {[
          { label: "Total Calls",  value: monthTotal,     icon: <Phone size={14} />,       sub: "this month" },
          { label: "Connected",    value: monthConnected, icon: <CheckCircle size={14} />, sub: `of ${monthTotal} calls` },
          { label: "Connect Rate", value: `${connectRate}%`, icon: <TrendingUp size={14} />, sub: "team average" },
          { label: "Avg / Day",    value: avgPerDay,      icon: <BarChart2 size={14} />,   sub: "calls per active day" },
          { label: "Best Day",     value: bestDayEntry?.total ?? "—", icon: <TrendingUp size={14} />, sub: bestDayEntry ? format(new Date(bestDayEntry.key + "T00:00"), "EEE, MMM d") : "no data" },
        ].map(s => (
          <div key={s.label} style={{ background: "var(--surface)", borderRadius: 20, padding: "16px 18px", border: "1px solid var(--border)", display: "flex", gap: 14, alignItems: "center", boxShadow: "0 1px 2px rgba(0,0,0,0.02)" }}>
            <div style={{ width: 36, height: 36, borderRadius: 12, background: "linear-gradient(135deg, #F3F4F6, #FFF)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", color: "#4B5563" }}>
              {s.icon}
            </div>
            <div>
              <p style={{ fontSize: 24, fontWeight: 800, color: "var(--text-primary)", margin: "0 0 2px", letterSpacing: "-0.03em", lineHeight: 1 }}>{s.value}</p>
              <p style={{ fontSize: 12, fontWeight: 500, color: "var(--text-secondary)", margin: "0 0 2px" }}>{s.label}</p>
              <p style={{ fontSize: 11, color: "var(--text-muted)", margin: 0 }}>{s.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Calendar + Panel (original size, no flex grow) */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 20, marginBottom: 20 }}>

        {/* Calendar card - original size */}
        <div style={{ background: "var(--surface)", borderRadius: 24, border: "1px solid var(--border)", overflow: "hidden", boxShadow: "0 4px 12px rgba(0,0,0,0.02)" }}>
          {/* Weekday headers */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", background: "#F9FAFB", borderBottom: "1px solid var(--border)" }}>
            {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((d, i) => (
              <div key={d} style={{ padding: "12px 0", textAlign: "center", fontSize: 12, fontWeight: 600, color: i === 0 || i === 6 ? "#9CA3AF" : "#6B7280", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                {d}
              </div>
            ))}
          </div>

          {/* Day grid - fixed cell height like original (90px) */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)" }}>
            {Array.from({ length: startPad }).map((_, i) => (
              <div key={`pad-${i}`} style={{ minHeight: 90, borderRight: "1px solid var(--border)", borderBottom: "1px solid var(--border)", background: "#FCFCFD" }} />
            ))}

            {days.map((day, idx) => {
              const key = format(day, "yyyy-MM-dd");
              const data = getRepDay(activeRep, key);
              const total = data ? getTotal(data) : 0;
              const heat = getHeat(total);
              const isSelected = !!selected && isSameDay(day, selected);
              const isTodayDay = isToday(day);
              const col = (startPad + idx) % 7;
              const isWeekend = col === 0 || col === 6;
              const hs = HEAT_STYLES[heat];

              return (
                <div
                  key={key}
                  onClick={() => data && setSelected(isSelected ? null : day)}
                  style={{
                    minHeight: 90,
                    borderRight: "1px solid var(--border)",
                    borderBottom: "1px solid var(--border)",
                    padding: "10px 10px 8px",
                    background: isSelected ? "#F8FAFF" : heat > 0 ? hs.bg : isWeekend ? "#FCFCFD" : "var(--surface)",
                    cursor: data ? "pointer" : "default",
                    transition: "background 0.15s ease",
                    position: "relative",
                    outline: isSelected ? "2px solid #6366F1" : "none",
                    outlineOffset: "-1px",
                    zIndex: isSelected ? 2 : 1,
                  }}
                  onMouseEnter={e => { if (data && !isSelected) e.currentTarget.style.background = "#F3F4F6"; }}
                  onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = isSelected ? "#F8FAFF" : heat > 0 ? hs.bg : isWeekend ? "#FCFCFD" : "var(--surface)"; }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 7 }}>
                    <span style={{
                      fontSize: 13, fontWeight: isTodayDay ? 700 : 500,
                      color: isSelected ? "#1F2937" : isTodayDay ? "#6366F1" : isWeekend ? "#9CA3AF" : "#374151",
                      width: 26, height: 26, display: "flex", alignItems: "center", justifyContent: "center",
                      borderRadius: "50%",
                      background: isTodayDay && !isSelected ? "#EEF2FF" : "transparent",
                    }}>
                      {format(day, "d")}
                    </span>
                    {total > 0 && (
                      <span style={{
                        fontSize: 10, fontWeight: 600,
                        color: isSelected ? "#4F46E5" : "#4B5563",
                        background: isSelected ? "#E0E7FF" : "#F3F4F6",
                        padding: "2px 7px", borderRadius: 40,
                      }}>
                        {total}
                      </span>
                    )}
                  </div>

                  {/* Stacked bar */}
                  {data && (
                    <div style={{ display: "flex", gap: 2, alignItems: "flex-end", height: 32, marginTop: 4 }}>
                      {OUTCOMES.map(o => {
                        const val = data[o.key as keyof DayData] as number;
                        if (val === 0) return null;
                        const pct = (val / total) * 100;
                        return (
                          <div key={o.key} title={`${o.label}: ${val}`} style={{
                            flex: val, height: `${Math.max(pct * 0.3, 5)}px`,
                            background: isSelected ? `rgba(99,102,241,${0.3 + (val / total) * 0.5})` : o.color,
                            borderRadius: "2px 2px 1px 1px", transition: "height 0.2s",
                          }} />
                        );
                      })}
                    </div>
                  )}

                  {data && activeRep !== "all" && !isSelected && (
                    <div style={{ position: "absolute", bottom: 6, right: 7, fontSize: 9, fontWeight: 600, color: "#059669", opacity: 0.7 }}>
                      {getConnectRate(data)}%
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Panel */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Day detail card */}
          <div style={{ background: "var(--surface)", borderRadius: 24, border: "1px solid var(--border)", padding: "20px", boxShadow: "0 4px 12px rgba(0,0,0,0.02)" }}>
            {!selData || !selected ? (
              <div style={{ textAlign: "center", padding: "32px 16px" }}>
                <div style={{ width: 48, height: 48, borderRadius: 24, background: "#F3F4F6", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px", border: "1px solid var(--border)" }}>
                  <Phone size={20} style={{ color: "#6B7280" }} />
                </div>
                <p style={{ fontSize: 15, fontWeight: 600, color: "var(--text-primary)", margin: "0 0 6px" }}>Select a day</p>
                <p style={{ fontSize: 13, color: "var(--text-muted)", margin: 0 }}>Click any active day to see breakdown</p>
              </div>
            ) : (
              <>
                <div style={{ marginBottom: 18 }}>
                  <p style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: "#6B7280", margin: "0 0 6px" }}>
                    {format(selected, "EEEE")}
                  </p>
                  <p style={{ fontSize: 20, fontWeight: 700, color: "var(--text-primary)", margin: "0 0 10px", letterSpacing: "-0.02em" }}>
                    {format(selected, "MMMM d, yyyy")}
                  </p>
                  <div style={{ display: "flex", gap: 8 }}>
                    <span style={{ fontSize: 12, fontWeight: 500, padding: "4px 12px", borderRadius: 30, background: "#F3F4F6", color: "#374151", border: "1px solid var(--border)" }}>
                      {getTotal(selData)} calls
                    </span>
                    <span style={{ fontSize: 12, fontWeight: 500, padding: "4px 12px", borderRadius: 30, background: "#ECFDF5", color: "#059669", border: "1px solid #D1FAE5" }}>
                      {getConnectRate(selData)}% connected
                    </span>
                  </div>
                </div>

                {/* Outcome bars */}
                <div style={{ display: "flex", height: 6, borderRadius: 6, overflow: "hidden", gap: 2, marginBottom: 20 }}>
                  {OUTCOMES.map(o => {
                    const val = selData[o.key as keyof DayData] as number;
                    if (val === 0) return null;
                    return <div key={o.key} style={{ flex: val, background: o.color }} />;
                  })}
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {OUTCOMES.map(o => {
                    const val = selData[o.key as keyof DayData] as number;
                    const total = getTotal(selData);
                    const pct = total ? Math.round((val / total) * 100) : 0;
                    return (
                      <div key={o.key} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width: 10, height: 10, borderRadius: 3, background: o.color, flexShrink: 0 }} />
                        <span style={{ fontSize: 13, color: "#4B5563", flex: 1 }}>{o.label}</span>
                        <div style={{ width: 56, height: 4, background: "#E5E7EB", borderRadius: 4, overflow: "hidden" }}>
                          <div style={{ height: "100%", width: `${pct}%`, background: o.color, borderRadius: 4 }} />
                        </div>
                        <span style={{ fontSize: 13, fontWeight: 600, color: "#111827", minWidth: 22, textAlign: "right" }}>{val}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Per-rep breakdown for "all" view */}
                {activeRep === "all" && selKey && (
                  <div style={{ marginTop: 20, paddingTop: 16, borderTop: "1px solid var(--border)" }}>
                    <p style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: "#6B7280", margin: "0 0 12px" }}>
                      By Rep
                    </p>
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      {REPS.filter(r => r.id !== "all").map(rep => {
                        const rd = TEAM_DATA[rep.id]?.[selKey];
                        const rt = rd ? getTotal(rd) : 0;
                        const total = getTotal(selData);
                        return (
                          <div key={rep.id} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <div style={{ width: 22, height: 22, borderRadius: "50%", background: `${rep.color}20`, color: rep.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700 }}>
                              {rep.avatar}
                            </div>
                            <span style={{ fontSize: 12, color: "#4B5563", flex: 1 }}>{rep.name.split(" ")[0]}</span>
                            <div style={{ width: 56, height: 4, background: "#E5E7EB", borderRadius: 4, overflow: "hidden" }}>
                              <div style={{ height: "100%", width: `${total ? (rt / total) * 100 : 0}%`, background: rep.color, borderRadius: 4 }} />
                            </div>
                            <span style={{ fontSize: 13, fontWeight: 600, color: "#111827", minWidth: 22, textAlign: "right" }}>{rt}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div style={{ marginTop: 20, paddingTop: 16, borderTop: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 12, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 500 }}>Total</span>
                  <span style={{ fontSize: 20, fontWeight: 700, color: "#111827", letterSpacing: "-0.02em" }}>{getTotal(selData)}</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* HORIZONTAL STRIP: Outcome Key + Volume Heat - full width below calendar */}
      <div style={{ background: "var(--surface)", borderRadius: 20, border: "1px solid var(--border)", padding: "12px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap" }}>
          <span style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: "#6B7280" }}>Outcome Key</span>
          {OUTCOMES.map(o => (
            <div key={o.key} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 10, height: 10, borderRadius: 3, background: o.color }} />
              <span style={{ fontSize: 12, color: "#4B5563" }}>{o.label}</span>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: "#6B7280" }}>Volume Heat</span>
          <div style={{ display: "flex", gap: 6 }}>
            {[0,1,2,3,4].map(h => (
              <div key={h} style={{ width: 22, height: 22, borderRadius: 6, background: h === 0 ? "#F3F4F6" : HEAT_STYLES[h].bg, border: `1px solid ${HEAT_STYLES[h].border}` }} />
            ))}
            <span style={{ fontSize: 10, color: "#6B7280", marginLeft: 4 }}>Low → High</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        :root {
          --bg: #FFFFFF;
          --surface: #FFFFFF;
          --surface-2: #F9FAFB;
          --border: #E5E7EB;
          --border-strong: #D1D5DB;
          --text-primary: #111827;
          --text-secondary: #4B5563;
          --text-muted: #6B7280;
        }
        @media (prefers-color-scheme: dark) {
          :root {
            --bg: #0F172A;
            --surface: #1E293B;
            --surface-2: #334155;
            --border: #334155;
            --border-strong: #475569;
            --text-primary: #F1F5F9;
            --text-secondary: #CBD5E1;
            --text-muted: #94A3B8;
          }
        }
      `}</style>
    </div>
  );
}