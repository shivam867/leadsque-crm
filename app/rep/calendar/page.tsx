"use client";
import { useState } from "react";
import {
  format, startOfMonth, endOfMonth, eachDayOfInterval,
  getDay, isSameDay, isToday, subMonths, addMonths,
} from "date-fns";
import { ChevronLeft, ChevronRight, Phone, CheckCircle, XCircle, Clock, PhoneOff, TrendingUp, BarChart2 } from "lucide-react";

const CALL_DATA: Record<string, {
  connected: number; noAnswer: number; busy: number; callLater: number; wrongNumber: number;
}> = {
  "2025-05-01": { connected: 4, noAnswer: 2, busy: 1, callLater: 1, wrongNumber: 0 },
  "2025-05-02": { connected: 6, noAnswer: 3, busy: 2, callLater: 0, wrongNumber: 1 },
  "2025-05-05": { connected: 8, noAnswer: 4, busy: 1, callLater: 2, wrongNumber: 0 },
  "2025-05-06": { connected: 5, noAnswer: 1, busy: 3, callLater: 1, wrongNumber: 0 },
  "2025-05-07": { connected: 9, noAnswer: 2, busy: 0, callLater: 3, wrongNumber: 1 },
  "2025-05-08": { connected: 3, noAnswer: 5, busy: 2, callLater: 0, wrongNumber: 0 },
  "2025-05-09": { connected: 7, noAnswer: 1, busy: 1, callLater: 2, wrongNumber: 0 },
  "2025-05-12": { connected: 10, noAnswer: 3, busy: 2, callLater: 1, wrongNumber: 0 },
  "2025-05-13": { connected: 6, noAnswer: 4, busy: 0, callLater: 2, wrongNumber: 1 },
  "2025-05-14": { connected: 4, noAnswer: 2, busy: 3, callLater: 1, wrongNumber: 0 },
  "2025-05-15": { connected: 8, noAnswer: 1, busy: 1, callLater: 0, wrongNumber: 0 },
  "2025-05-16": { connected: 5, noAnswer: 3, busy: 2, callLater: 3, wrongNumber: 0 },
  "2025-05-19": { connected: 11, noAnswer: 2, busy: 1, callLater: 1, wrongNumber: 0 },
  "2025-05-20": { connected: 7, noAnswer: 4, busy: 0, callLater: 2, wrongNumber: 1 },
  "2025-05-21": { connected: 6, noAnswer: 1, busy: 2, callLater: 1, wrongNumber: 0 },
  "2025-05-22": { connected: 9, noAnswer: 3, busy: 1, callLater: 0, wrongNumber: 0 },
  "2025-05-23": { connected: 4, noAnswer: 2, busy: 3, callLater: 2, wrongNumber: 0 },
  "2025-05-26": { connected: 8, noAnswer: 1, busy: 0, callLater: 1, wrongNumber: 0 },
  "2025-05-27": { connected: 12, noAnswer: 2, busy: 1, callLater: 3, wrongNumber: 0 },
  "2025-05-28": { connected: 7, noAnswer: 5, busy: 3, callLater: 2, wrongNumber: 1 },
};

const OUTCOMES = [
  { key: "connected",   label: "Connected",  color: "#10B981", icon: <CheckCircle size={11} /> },
  { key: "noAnswer",    label: "No Answer",  color: "#6B7280", icon: <PhoneOff size={11} /> },
  { key: "busy",        label: "Busy",       color: "#F59E0B", icon: <Clock size={11} /> },
  { key: "callLater",   label: "Call Later", color: "#8B5CF6", icon: <Phone size={11} /> },
  { key: "wrongNumber", label: "Wrong #",    color: "#EF4444", icon: <XCircle size={11} /> },
];

function getTotal(d: typeof CALL_DATA[string]) {
  return d.connected + d.noAnswer + d.busy + d.callLater + d.wrongNumber;
}

function getConnectRate(d: typeof CALL_DATA[string]) {
  const t = getTotal(d);
  return t ? Math.round((d.connected / t) * 100) : 0;
}

// Modern, subtle heat scale (low to high intensity)
function getHeat(total: number) {
  if (total === 0) return 0;
  if (total <= 4) return 1;
  if (total <= 7) return 2;
  if (total <= 10) return 3;
  return 4;
}

const HEAT_STYLES: Record<number, { bg: string; border: string; textMuted?: string }> = {
  0: { bg: "transparent",        border: "var(--border)" },
  1: { bg: "#F9FAFB",            border: "#E5E7EB" },
  2: { bg: "#F3F4F6",            border: "#D1D5DB" },
  3: { bg: "#EEF2FF",            border: "#C7D2FE" },
  4: { bg: "#E0E7FF",            border: "#A5B4FC" },
};

export default function RepCalendar() {
  const [current, setCurrent] = useState(new Date(2025, 4, 1));
  const [selected, setSelected] = useState<Date | null>(new Date(2025, 4, 28));

  const monthStart = startOfMonth(current);
  const monthEnd = endOfMonth(current);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startPad = getDay(monthStart);

  const monthKey = format(current, "yyyy-MM");
  const monthEntries = Object.entries(CALL_DATA).filter(([k]) => k.startsWith(monthKey));
  const monthTotal = monthEntries.reduce((a, [, v]) => a + getTotal(v), 0);
  const monthConnected = monthEntries.reduce((a, [, v]) => a + v.connected, 0);
  const connectRate = monthTotal ? Math.round((monthConnected / monthTotal) * 100) : 0;
  const activeDays = monthEntries.length;
  const bestDay = monthEntries.reduce<[string, number]>(
    (b, [k, v]) => getTotal(v) > b[1] ? [k, getTotal(v)] : b, ["", 0]
  );
  const avgPerDay = activeDays ? Math.round(monthTotal / activeDays) : 0;

  const selKey = selected ? format(selected, "yyyy-MM-dd") : null;
  const selData = selKey ? CALL_DATA[selKey] : null;

  return (
    <div style={{ padding: "28px 32px", background: "var(--bg)", minHeight: "100%", fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, sans-serif" }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 28 }}>
        <div>
          <p style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", margin: "0 0 4px", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            My Performance
          </p>
          <h1 style={{ fontSize: 28, fontWeight: 700, margin: "0 0 4px", background: "linear-gradient(135deg, #111827, #374151)", backgroundClip: "text", WebkitBackgroundClip: "text", color: "transparent", letterSpacing: "-0.02em" }}>
            Call Calendar
          </h1>
          <p style={{ fontSize: 14, color: "var(--text-secondary)", margin: 0 }}>
            Aanya Sharma · {format(current, "MMMM yyyy")}
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button style={{ padding: "8px 12px", borderRadius: 10, background: "var(--surface)", border: "1px solid var(--border)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }} onClick={() => setCurrent(subMonths(current, 1))}>
            <ChevronLeft size={14} />
          </button>
          <span style={{ fontSize: 15, fontWeight: 600, color: "var(--text-primary)", minWidth: 120, textAlign: "center", letterSpacing: "-0.01em" }}>
            {format(current, "MMMM yyyy")}
          </span>
          <button style={{ padding: "8px 12px", borderRadius: 10, background: "var(--surface)", border: "1px solid var(--border)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }} onClick={() => setCurrent(addMonths(current, 1))}>
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* Stat strip — cleaner cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 14, marginBottom: 24 }}>
        {[
          { label: "Total Calls",   value: monthTotal,                    icon: <Phone size={14} />,       sub: "this month" },
          { label: "Connected",     value: monthConnected,                icon: <CheckCircle size={14} />, sub: `of ${monthTotal} calls` },
          { label: "Connect Rate",  value: `${connectRate}%`,             icon: <TrendingUp size={14} />,  sub: "connection rate" },
          { label: "Avg / Day",     value: avgPerDay,                     icon: <BarChart2 size={14} />,   sub: "calls per active day" },
          { label: "Best Day",      value: bestDay[1] || "—",             icon: <TrendingUp size={14} />,  sub: bestDay[0] ? format(new Date(bestDay[0] + "T00:00"), "EEE, MMM d") : "no data" },
        ].map((s, i) => (
          <div key={s.label} style={{ background: "var(--surface)", borderRadius: 20, padding: "16px 18px", boxShadow: "0 1px 2px rgba(0,0,0,0.02), 0 1px 1px rgba(0,0,0,0.03)", border: "1px solid var(--border)", transition: "all 0.2s", display: "flex", gap: 14, alignItems: "center" }}>
            <div style={{ width: 36, height: 36, borderRadius: 12, background: "linear-gradient(135deg, #F3F4F6, #FFF)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: "#4B5563" }}>
              {s.icon}
            </div>
            <div style={{ minWidth: 0 }}>
              <p style={{ fontSize: 24, fontWeight: 800, color: "var(--text-primary)", margin: "0 0 2px", letterSpacing: "-0.03em", lineHeight: 1 }}>{s.value}</p>
              <p style={{ fontSize: 12, fontWeight: 500, color: "var(--text-secondary)", margin: "0 0 2px" }}>{s.label}</p>
              <p style={{ fontSize: 11, color: "var(--text-muted)", margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{s.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Calendar + Panel */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 20 }}>

        {/* Calendar card */}
        <div style={{ background: "var(--surface)", borderRadius: 24, border: "1px solid var(--border)", overflow: "hidden", boxShadow: "0 4px 12px rgba(0,0,0,0.02)" }}>
          {/* Weekday headers */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", background: "#F9FAFB", borderBottom: "1px solid var(--border)" }}>
            {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((d, i) => (
              <div key={d} style={{ padding: "12px 0", textAlign: "center", fontSize: 12, fontWeight: 600, color: i === 0 || i === 6 ? "#9CA3AF" : "#6B7280", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                {d}
              </div>
            ))}
          </div>

          {/* Day grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)" }}>
            {Array.from({ length: startPad }).map((_, i) => (
              <div key={`pad-${i}`} style={{ minHeight: 100, borderRight: "1px solid var(--border)", borderBottom: "1px solid var(--border)", background: "#FCFCFD" }} />
            ))}

            {days.map((day, idx) => {
              const key = format(day, "yyyy-MM-dd");
              const data = CALL_DATA[key];
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
                    minHeight: 100,
                    borderRight: "1px solid var(--border)",
                    borderBottom: "1px solid var(--border)",
                    padding: "12px 10px 8px",
                    background: isSelected ? "#F8FAFF" : heat > 0 ? hs.bg : isWeekend ? "#FCFCFD" : "var(--surface)",
                    cursor: data ? "pointer" : "default",
                    transition: "background 0.15s ease, box-shadow 0.1s",
                    position: "relative",
                    outline: isSelected ? "2px solid #6366F1" : "none",
                    outlineOffset: "-1px",
                    zIndex: isSelected ? 2 : 1,
                  }}
                  onMouseEnter={e => { if (data && !isSelected) e.currentTarget.style.background = "#F3F4F6"; }}
                  onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = isSelected ? "#F8FAFF" : heat > 0 ? hs.bg : isWeekend ? "#FCFCFD" : "var(--surface)"; }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
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
                        padding: "2px 7px", borderRadius: 40, letterSpacing: "-0.01em",
                      }}>
                        {total}
                      </span>
                    )}
                  </div>

                  {/* Stacked bar */}
                  {data && (
                    <div style={{ display: "flex", gap: 2, alignItems: "flex-end", height: 36, marginTop: 4 }}>
                      {OUTCOMES.map(o => {
                        const val = data[o.key as keyof typeof data] as number;
                        if (val === 0) return null;
                        const pct = (val / total) * 100;
                        return (
                          <div
                            key={o.key}
                            title={`${o.label}: ${val}`}
                            style={{
                              flex: val,
                              height: `${Math.max(pct * 0.35, 6)}px`,
                              background: isSelected ? `rgba(99,102,241,${0.3 + (val / total) * 0.5})` : o.color,
                              borderRadius: "3px 3px 1px 1px",
                              transition: "height 0.2s cubic-bezier(0.2, 0.9, 0.4, 1.1)",
                            }}
                          />
                        );
                      })}
                    </div>
                  )}

                  {data && !isSelected && (
                    <div style={{
                      position: "absolute", bottom: 8, right: 10,
                      fontSize: 10, fontWeight: 600, color: "#059669",
                      opacity: 0.7,
                    }}>
                      {getConnectRate(data)}%
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right panel — more polished */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Day detail */}
          <div style={{ background: "var(--surface)", borderRadius: 24, border: "1px solid var(--border)", padding: "20px", boxShadow: "0 4px 12px rgba(0,0,0,0.02)", flex: selData ? "none" : 1 }}>
            {!selData ? (
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
                    {selected && format(selected, "EEEE")}
                  </p>
                  <p style={{ fontSize: 20, fontWeight: 700, color: "var(--text-primary)", margin: "0 0 10px", letterSpacing: "-0.02em", lineHeight: 1.2 }}>
                    {selected && format(selected, "MMMM d, yyyy")}
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

                <div style={{ display: "flex", height: 6, borderRadius: 6, overflow: "hidden", gap: 2, marginBottom: 20 }}>
                  {OUTCOMES.map(o => {
                    const val = selData[o.key as keyof typeof selData] as number;
                    if (val === 0) return null;
                    return <div key={o.key} style={{ flex: val, background: o.color }} />;
                  })}
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {OUTCOMES.map(o => {
                    const val = selData[o.key as keyof typeof selData] as number;
                    const total = getTotal(selData);
                    const pct = total ? Math.round((val / total) * 100) : 0;
                    return (
                      <div key={o.key} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <span style={{ color: o.color, display: "flex", flexShrink: 0, width: 16 }}>{o.icon}</span>
                        <span style={{ fontSize: 13, color: "#4B5563", flex: 1, letterSpacing: "-0.01em" }}>{o.label}</span>
                        <div style={{ width: 56, height: 4, background: "#E5E7EB", borderRadius: 4, overflow: "hidden" }}>
                          <div style={{ height: "100%", width: `${pct}%`, background: o.color, borderRadius: 4 }} />
                        </div>
                        <span style={{ fontSize: 13, fontWeight: 600, color: "#111827", minWidth: 22, textAlign: "right" }}>{val}</span>
                      </div>
                    );
                  })}
                </div>

                <div style={{ marginTop: 20, paddingTop: 16, borderTop: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 12, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 500 }}>Total</span>
                  <span style={{ fontSize: 20, fontWeight: 700, color: "#111827", letterSpacing: "-0.02em" }}>{getTotal(selData)}</span>
                </div>
              </>
            )}
          </div>

          {/* Legend refined */}
          <div style={{ background: "var(--surface)", borderRadius: 24, border: "1px solid var(--border)", padding: "18px 20px" }}>
            <p style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: "#6B7280", margin: "0 0 14px" }}>
              Outcome Key
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
              {OUTCOMES.map(o => (
                <div key={o.key} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 10, height: 10, borderRadius: 3, background: o.color, flexShrink: 0 }} />
                  <span style={{ fontSize: 13, color: "#4B5563" }}>{o.label}</span>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 18, paddingTop: 14, borderTop: "1px solid var(--border)" }}>
              <p style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: "#6B7280", margin: "0 0 12px" }}>
                Volume Heat
              </p>
              <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                {[0,1,2,3,4].map(h => (
                  <div key={h} style={{ width: 22, height: 22, borderRadius: 6, background: h === 0 ? "#F3F4F6" : HEAT_STYLES[h].bg, border: `1px solid ${HEAT_STYLES[h].border}`, transition: "all 0.1s" }} />
                ))}
                <span style={{ fontSize: 11, color: "#6B7280", marginLeft: 6 }}>Low → High</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        :root {
          --bg: #FFFFFF;
          --surface: #FFFFFF;
          --surface-2: #F9FAFB;
          --surface-3: #F3F4F6;
          --border: #E5E7EB;
          --text-primary: #111827;
          --text-secondary: #4B5563;
          --text-muted: #6B7280;
        }
        @media (prefers-color-scheme: dark) {
          :root {
            --bg: #0F172A;
            --surface: #1E293B;
            --surface-2: #334155;
            --surface-3: #475569;
            --border: #334155;
            --text-primary: #F1F5F9;
            --text-secondary: #CBD5E1;
            --text-muted: #94A3B8;
          }
          .gradient-text {
            background: linear-gradient(135deg, #E2E8F0, #94A3B8);
            -webkit-background-clip: text;
            background-clip: text;
          }
        }
      `}</style>
    </div>
  );
}