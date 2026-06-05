"use client";
import { useState } from "react";
import {
  format, startOfMonth, endOfMonth, eachDayOfInterval,
  getDay, isSameDay, isToday, subMonths, addMonths,
} from "date-fns";
import {
  ChevronLeft, ChevronRight, Phone, CheckCircle,
  TrendingUp, BarChart2,
} from "lucide-react";
import {
  DayData, CallDataMap, OUTCOMES, HEAT_STYLES,
  getTotal, getConnectRate, getHeat,
} from "../../data/callData";

// ─── Props ────────────────────────────────────────────────────────────────────

export type CallCalendarProps = {
  /** Callback that resolves call data for a given "yyyy-MM-dd" key */
  getDayData: (key: string) => DayData | null;

  /** Header label shown under "Call Calendar" */
  subtitle: string;

  /** Heat thresholds [low, med, high] — tune per rep vs team scale */
  heatThresholds?: [number, number, number];

  /** Optional slot rendered between header and stat strip (e.g. rep switcher) */
  headerSlot?: React.ReactNode;

  /** Optional slot rendered inside the day-detail panel, below outcome bars */
  detailSlot?: ((selectedKey: string, selData: DayData) => React.ReactNode) | null;

  /** Whether to show per-day connect-rate badge */
  showConnectRate?: boolean;
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function CallCalendar({
  getDayData,
  subtitle,
  heatThresholds = [4, 7, 10],
  headerSlot,
  detailSlot,
  showConnectRate = true,
}: CallCalendarProps) {
  const [current, setCurrent] = useState(new Date(2025, 4, 1));
  const [selected, setSelected] = useState<Date | null>(new Date(2025, 4, 28));

  const monthStart = startOfMonth(current);
  const days = eachDayOfInterval({ start: monthStart, end: endOfMonth(current) });
  const startPad = getDay(monthStart);

  // ── Month-level stats ──────────────────────────────────────────────────────
  const monthEntries = days
    .map(d => ({ key: format(d, "yyyy-MM-dd"), data: getDayData(format(d, "yyyy-MM-dd")) }))
    .filter((e): e is { key: string; data: DayData } => e.data !== null);

  const monthTotal     = monthEntries.reduce((a, e) => a + getTotal(e.data), 0);
  const monthConnected = monthEntries.reduce((a, e) => a + e.data.connected, 0);
  const connectRate    = monthTotal ? Math.round((monthConnected / monthTotal) * 100) : 0;
  const activeDays     = monthEntries.length;
  const avgPerDay      = activeDays ? Math.round(monthTotal / activeDays) : 0;
  const bestEntry      = monthEntries.reduce<{ key: string; total: number } | null>(
    (b, e) => { const t = getTotal(e.data); return !b || t > b.total ? { key: e.key, total: t } : b; },
    null,
  );

  // ── Selected day ───────────────────────────────────────────────────────────
  const selKey  = selected ? format(selected, "yyyy-MM-dd") : null;
  const selData = selKey ? getDayData(selKey) : null;

  // ── Stat strip items ───────────────────────────────────────────────────────
  const stats = [
    { label: "Total Calls",  value: monthTotal,         icon: <Phone size={14} />,       sub: "this month" },
    { label: "Connected",    value: monthConnected,      icon: <CheckCircle size={14} />, sub: `of ${monthTotal} calls` },
    { label: "Connect Rate", value: `${connectRate}%`,  icon: <TrendingUp size={14} />,  sub: "connection rate" },
    { label: "Avg / Day",    value: avgPerDay,           icon: <BarChart2 size={14} />,   sub: "calls per active day" },
    {
      label: "Best Day",
      value: bestEntry?.total ?? "—",
      icon: <TrendingUp size={14} />,
      sub: bestEntry ? format(new Date(bestEntry.key + "T00:00"), "EEE, MMM d") : "no data",
    },
  ];

  return (
    <div style={{ padding: "28px 32px", background: "var(--bg)", minHeight: "100%", fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, sans-serif" }}>

      {/* ── Header ── */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: headerSlot ? 16 : 28 }}>
        <div>
          <p style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", margin: "0 0 4px", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            {subtitle}
          </p>
          <h1 style={{ fontSize: 28, fontWeight: 700, margin: "0 0 4px", background: "linear-gradient(135deg, #111827, #374151)", backgroundClip: "text", WebkitBackgroundClip: "text", color: "transparent", letterSpacing: "-0.02em" }}>
            Call Calendar
          </h1>
          <p style={{ fontSize: 14, color: "var(--text-secondary)", margin: 0 }}>
            {format(current, "MMMM yyyy")}
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button style={navBtn} onClick={() => setCurrent(subMonths(current, 1))}><ChevronLeft size={14} /></button>
          <span style={{ fontSize: 15, fontWeight: 600, color: "var(--text-primary)", minWidth: 120, textAlign: "center", letterSpacing: "-0.01em" }}>
            {format(current, "MMMM yyyy")}
          </span>
          <button style={navBtn} onClick={() => setCurrent(addMonths(current, 1))}><ChevronRight size={14} /></button>
        </div>
      </div>

      {/* ── Optional slot (e.g. rep switcher) ── */}
      {headerSlot && <div style={{ marginBottom: 24 }}>{headerSlot}</div>}

      {/* ── Stat strip ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 14, marginBottom: 24 }}>
        {stats.map(s => (
          <div key={s.label} style={{ background: "var(--surface)", borderRadius: 20, padding: "16px 18px", border: "1px solid var(--border)", display: "flex", gap: 14, alignItems: "center", boxShadow: "0 1px 2px rgba(0,0,0,0.02)" }}>
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

      {/* ── Calendar + Side panel ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 20, marginBottom: 20 }}>

        {/* Calendar grid */}
        <div style={{ background: "var(--surface)", borderRadius: 24, border: "1px solid var(--border)", overflow: "hidden", boxShadow: "0 4px 12px rgba(0,0,0,0.02)" }}>
          {/* Weekday headers */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", background: "#F9FAFB", borderBottom: "1px solid var(--border)" }}>
            {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((d, i) => (
              <div key={d} style={{ padding: "12px 0", textAlign: "center", fontSize: 12, fontWeight: 600, color: i === 0 || i === 6 ? "#9CA3AF" : "#6B7280", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                {d}
              </div>
            ))}
          </div>

          {/* Day cells */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)" }}>
            {Array.from({ length: startPad }).map((_, i) => (
              <div key={`pad-${i}`} style={{ minHeight: 100, borderRight: "1px solid var(--border)", borderBottom: "1px solid var(--border)", background: "#FCFCFD" }} />
            ))}

            {days.map((day, idx) => {
              const key        = format(day, "yyyy-MM-dd");
              const data       = getDayData(key);
              const total      = data ? getTotal(data) : 0;
              const heat       = getHeat(total, heatThresholds);
              const isSelected = !!selected && isSameDay(day, selected);
              const isTodayDay = isToday(day);
              const col        = (startPad + idx) % 7;
              const isWeekend  = col === 0 || col === 6;
              const hs         = HEAT_STYLES[heat];

              const baseBg = isSelected
                ? "#F8FAFF"
                : heat > 0 ? hs.bg
                : isWeekend ? "#FCFCFD"
                : "var(--surface)";

              return (
                <div
                  key={key}
                  onClick={() => data && setSelected(isSelected ? null : day)}
                  onMouseEnter={e => { if (data && !isSelected) e.currentTarget.style.background = "#F3F4F6"; }}
                  onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = baseBg; }}
                  style={{
                    minHeight: 100,
                    borderRight: "1px solid var(--border)",
                    borderBottom: "1px solid var(--border)",
                    padding: "12px 10px 8px",
                    background: baseBg,
                    cursor: data ? "pointer" : "default",
                    transition: "background 0.15s ease",
                    position: "relative",
                    outline: isSelected ? "2px solid #6366F1" : "none",
                    outlineOffset: "-1px",
                    zIndex: isSelected ? 2 : 1,
                  }}
                >
                  {/* Date + total badge */}
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
                      <span style={{ fontSize: 10, fontWeight: 600, color: isSelected ? "#4F46E5" : "#4B5563", background: isSelected ? "#E0E7FF" : "#F3F4F6", padding: "2px 6px 2px 5px", borderRadius: 40, display: "flex", alignItems: "center", gap: 3 }}>
                        <Phone size={8} strokeWidth={2.5} />
                        {total}
                      </span>
                    )}
                  </div>

                  {/* Outcome bar chart */}
                  {data && (
                    <div style={{ display: "flex", gap: 2, alignItems: "flex-end", height: 36, marginTop: 4 }}>
                      {OUTCOMES.map(o => {
                        const val = data[o.key] as number;
                        if (val === 0) return null;
                        return (
                          <div
                            key={o.key}
                            title={`${o.label}: ${val}`}
                            style={{
                              flex: val,
                              height: `${Math.max((val / total) * 100 * 0.35, 6)}px`,
                              background: isSelected ? `rgba(99,102,241,${0.3 + (val / total) * 0.5})` : o.color,
                              borderRadius: "3px 3px 1px 1px",
                              transition: "height 0.2s cubic-bezier(0.2,0.9,0.4,1.1)",
                            }}
                          />
                        );
                      })}
                    </div>
                  )}

                  {/* Connect rate badge */}
                  {data && showConnectRate && !isSelected && (
                    <div style={{ position: "absolute", bottom: 2, right: 8, fontSize: 9, fontWeight: 700, color: "#111827", opacity: 0.45, letterSpacing: "0.01em" }}>
                      {getConnectRate(data)}%
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Side panel ── */}
        <div style={{ background: "var(--surface)", borderRadius: 24, border: "1px solid var(--border)", padding: "20px", boxShadow: "0 4px 12px rgba(0,0,0,0.02)" }}>
          {!selData || !selected ? (
            /* Empty state */
            <div style={{ textAlign: "center", padding: "32px 16px" }}>
              <div style={{ width: 48, height: 48, borderRadius: 24, background: "#F3F4F6", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px", border: "1px solid var(--border)" }}>
                <Phone size={20} style={{ color: "#6B7280" }} />
              </div>
              <p style={{ fontSize: 15, fontWeight: 600, color: "var(--text-primary)", margin: "0 0 6px" }}>Select a day</p>
              <p style={{ fontSize: 13, color: "var(--text-muted)", margin: 0 }}>Click any active day to see breakdown</p>
            </div>
          ) : (
            <>
              {/* Date heading */}
              <div style={{ marginBottom: 18 }}>
                <p style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: "#6B7280", margin: "0 0 6px" }}>
                  {format(selected, "EEEE")}
                </p>
                <p style={{ fontSize: 20, fontWeight: 700, color: "var(--text-primary)", margin: "0 0 10px", letterSpacing: "-0.02em", lineHeight: 1.2 }}>
                  {format(selected, "MMMM d, yyyy")}
                </p>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 12, fontWeight: 500, padding: "4px 12px", borderRadius: 30, background: "#F3F4F6", color: "#374151", border: "1px solid var(--border)" }}>
                    {getTotal(selData)} calls
                  </span>
                  <span style={{ fontSize: 12, fontWeight: 500, padding: "4px 12px", borderRadius: 30, background: "#ECFDF5", color: "#059669", border: "1px solid #D1FAE5" }}>
                    {getConnectRate(selData)}% connected
                  </span>
                </div>
              </div>

              {/* Colour bar */}
              <div style={{ display: "flex", height: 6, borderRadius: 6, overflow: "hidden", gap: 2, marginBottom: 20 }}>
                {OUTCOMES.map(o => {
                  const val = selData[o.key] as number;
                  if (val === 0) return null;
                  return <div key={o.key} style={{ flex: val, background: o.color }} />;
                })}
              </div>

              {/* Per-outcome rows */}
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {OUTCOMES.map(o => {
                  const val   = selData[o.key] as number;
                  const total = getTotal(selData);
                  const pct   = total ? Math.round((val / total) * 100) : 0;
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

              {/* Optional slot — e.g. per-rep breakdown */}
              {detailSlot && selKey && detailSlot(selKey, selData)}

              {/* Total footer */}
              <div style={{ marginTop: 20, paddingTop: 16, borderTop: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 12, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 500 }}>Total</span>
                <span style={{ fontSize: 20, fontWeight: 700, color: "#111827", letterSpacing: "-0.02em" }}>{getTotal(selData)}</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── Legend strip ── */}
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
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
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

// ─── Shared nav button style ──────────────────────────────────────────────────

const navBtn: React.CSSProperties = {
  padding: "8px 12px",
  borderRadius: 10,
  background: "var(--surface)",
  border: "1px solid var(--border)",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};