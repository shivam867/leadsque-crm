"use client";
import { useState } from "react";
import { Users } from "lucide-react";
import CallCalendar from "./CallCalendar";
import { DayData, CallDataMap, mergeDayData, getTotal } from "../../data/callData";

// ─── Rep data ─────────────────────────────────────────────────────────────────

const REP_DATA: CallDataMap = {
  "2025-05-01": { connected: 4,  noAnswer: 2, busy: 1, callLater: 1, wrongNumber: 0 },
  "2025-05-02": { connected: 6,  noAnswer: 3, busy: 2, callLater: 0, wrongNumber: 1 },
  "2025-05-05": { connected: 8,  noAnswer: 4, busy: 1, callLater: 2, wrongNumber: 0 },
  "2025-05-06": { connected: 5,  noAnswer: 1, busy: 3, callLater: 1, wrongNumber: 0 },
  "2025-05-07": { connected: 9,  noAnswer: 2, busy: 0, callLater: 3, wrongNumber: 1 },
  "2025-05-08": { connected: 3,  noAnswer: 5, busy: 2, callLater: 0, wrongNumber: 0 },
  "2025-05-09": { connected: 7,  noAnswer: 1, busy: 1, callLater: 2, wrongNumber: 0 },
  "2025-05-12": { connected: 10, noAnswer: 3, busy: 2, callLater: 1, wrongNumber: 0 },
  "2025-05-13": { connected: 6,  noAnswer: 4, busy: 0, callLater: 2, wrongNumber: 1 },
  "2025-05-14": { connected: 4,  noAnswer: 2, busy: 3, callLater: 1, wrongNumber: 0 },
  "2025-05-15": { connected: 8,  noAnswer: 1, busy: 1, callLater: 0, wrongNumber: 0 },
  "2025-05-16": { connected: 5,  noAnswer: 3, busy: 2, callLater: 3, wrongNumber: 0 },
  "2025-05-19": { connected: 11, noAnswer: 2, busy: 1, callLater: 1, wrongNumber: 0 },
  "2025-05-20": { connected: 7,  noAnswer: 4, busy: 0, callLater: 2, wrongNumber: 1 },
  "2025-05-21": { connected: 6,  noAnswer: 1, busy: 2, callLater: 1, wrongNumber: 0 },
  "2025-05-22": { connected: 9,  noAnswer: 3, busy: 1, callLater: 0, wrongNumber: 0 },
  "2025-05-23": { connected: 4,  noAnswer: 2, busy: 3, callLater: 2, wrongNumber: 0 },
  "2025-05-26": { connected: 8,  noAnswer: 1, busy: 0, callLater: 1, wrongNumber: 0 },
  "2025-05-27": { connected: 12, noAnswer: 2, busy: 1, callLater: 3, wrongNumber: 0 },
  "2025-05-28": { connected: 7,  noAnswer: 5, busy: 3, callLater: 2, wrongNumber: 1 },
};

export function RepCalendar() {
  return (
    <CallCalendar
      subtitle="My Performance · Aanya Sharma"
      getDayData={key => REP_DATA[key] ?? null}
      heatThresholds={[4, 7, 10]}
      showConnectRate
    />
  );
}

// ─── Team / Manager data ──────────────────────────────────────────────────────

const REPS = [
  { id: "all", name: "All Reps",     avatar: "AR", color: "#6366F1" },
  { id: "as",  name: "Aanya Sharma", avatar: "AS", color: "#7C3AED" },
  { id: "rk",  name: "Rahul Kapoor", avatar: "RK", color: "#059669" },
  { id: "pm",  name: "Priya Mehta",  avatar: "PM", color: "#D97706" },
  { id: "sv",  name: "Siddharth V.", avatar: "SV", color: "#EF4444" },
];

const TEAM_DATA: Record<string, CallDataMap> = {
  as: {
    "2025-05-01": { connected: 4,  noAnswer: 2, busy: 1, callLater: 1, wrongNumber: 0 },
    "2025-05-02": { connected: 6,  noAnswer: 3, busy: 2, callLater: 0, wrongNumber: 1 },
    "2025-05-05": { connected: 8,  noAnswer: 4, busy: 1, callLater: 2, wrongNumber: 0 },
    "2025-05-07": { connected: 9,  noAnswer: 2, busy: 0, callLater: 3, wrongNumber: 1 },
    "2025-05-08": { connected: 3,  noAnswer: 5, busy: 2, callLater: 0, wrongNumber: 0 },
    "2025-05-12": { connected: 10, noAnswer: 3, busy: 2, callLater: 1, wrongNumber: 0 },
    "2025-05-14": { connected: 4,  noAnswer: 2, busy: 3, callLater: 1, wrongNumber: 0 },
    "2025-05-19": { connected: 11, noAnswer: 2, busy: 1, callLater: 1, wrongNumber: 0 },
    "2025-05-21": { connected: 6,  noAnswer: 1, busy: 2, callLater: 1, wrongNumber: 0 },
    "2025-05-27": { connected: 12, noAnswer: 2, busy: 1, callLater: 3, wrongNumber: 0 },
    "2025-05-28": { connected: 7,  noAnswer: 5, busy: 3, callLater: 2, wrongNumber: 1 },
  },
  rk: {
    "2025-05-01": { connected: 5,  noAnswer: 1, busy: 2, callLater: 0, wrongNumber: 0 },
    "2025-05-05": { connected: 6,  noAnswer: 3, busy: 1, callLater: 1, wrongNumber: 1 },
    "2025-05-06": { connected: 9,  noAnswer: 2, busy: 0, callLater: 2, wrongNumber: 0 },
    "2025-05-08": { connected: 4,  noAnswer: 4, busy: 1, callLater: 1, wrongNumber: 0 },
    "2025-05-13": { connected: 8,  noAnswer: 1, busy: 2, callLater: 2, wrongNumber: 0 },
    "2025-05-15": { connected: 11, noAnswer: 3, busy: 1, callLater: 0, wrongNumber: 0 },
    "2025-05-19": { connected: 7,  noAnswer: 2, busy: 3, callLater: 1, wrongNumber: 1 },
    "2025-05-20": { connected: 5,  noAnswer: 4, busy: 0, callLater: 3, wrongNumber: 0 },
    "2025-05-26": { connected: 9,  noAnswer: 1, busy: 1, callLater: 2, wrongNumber: 0 },
    "2025-05-28": { connected: 6,  noAnswer: 3, busy: 2, callLater: 1, wrongNumber: 0 },
  },
  pm: {
    "2025-05-02": { connected: 7,  noAnswer: 2, busy: 1, callLater: 2, wrongNumber: 0 },
    "2025-05-06": { connected: 5,  noAnswer: 3, busy: 2, callLater: 1, wrongNumber: 0 },
    "2025-05-07": { connected: 8,  noAnswer: 1, busy: 0, callLater: 2, wrongNumber: 1 },
    "2025-05-09": { connected: 4,  noAnswer: 4, busy: 2, callLater: 0, wrongNumber: 0 },
    "2025-05-13": { connected: 10, noAnswer: 2, busy: 1, callLater: 1, wrongNumber: 0 },
    "2025-05-14": { connected: 6,  noAnswer: 3, busy: 3, callLater: 2, wrongNumber: 0 },
    "2025-05-20": { connected: 9,  noAnswer: 1, busy: 0, callLater: 1, wrongNumber: 0 },
    "2025-05-22": { connected: 7,  noAnswer: 2, busy: 2, callLater: 3, wrongNumber: 1 },
    "2025-05-27": { connected: 11, noAnswer: 3, busy: 1, callLater: 1, wrongNumber: 0 },
    "2025-05-28": { connected: 5,  noAnswer: 2, busy: 1, callLater: 2, wrongNumber: 0 },
  },
  sv: {
    "2025-05-01": { connected: 3,  noAnswer: 3, busy: 2, callLater: 1, wrongNumber: 1 },
    "2025-05-02": { connected: 5,  noAnswer: 2, busy: 1, callLater: 1, wrongNumber: 0 },
    "2025-05-07": { connected: 7,  noAnswer: 1, busy: 2, callLater: 0, wrongNumber: 0 },
    "2025-05-09": { connected: 6,  noAnswer: 3, busy: 1, callLater: 2, wrongNumber: 0 },
    "2025-05-12": { connected: 8,  noAnswer: 2, busy: 0, callLater: 1, wrongNumber: 1 },
    "2025-05-16": { connected: 5,  noAnswer: 4, busy: 2, callLater: 2, wrongNumber: 0 },
    "2025-05-21": { connected: 9,  noAnswer: 1, busy: 1, callLater: 3, wrongNumber: 0 },
    "2025-05-22": { connected: 4,  noAnswer: 3, busy: 2, callLater: 1, wrongNumber: 0 },
    "2025-05-23": { connected: 7,  noAnswer: 2, busy: 3, callLater: 0, wrongNumber: 1 },
    "2025-05-28": { connected: 8,  noAnswer: 1, busy: 0, callLater: 2, wrongNumber: 0 },
  },
};

function getTeamDay(repId: string, key: string): DayData | null {
  if (repId === "all") {
    return mergeDayData(
      Object.values(TEAM_DATA).map(rd => rd[key]).filter(Boolean) as DayData[]
    );
  }
  return TEAM_DATA[repId]?.[key] ?? null;
}

export function ManagerCalendar() {
  const [activeRep, setActiveRep] = useState("all");

  const currentRep = REPS.find(r => r.id === activeRep)!;

  // Rep switcher — passed as headerSlot
  const repSwitcher = (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
      {REPS.map(rep => (
        <button
          key={rep.id}
          onClick={() => setActiveRep(rep.id)}
          style={{
            display: "flex", alignItems: "center", gap: 8,
            padding: "6px 16px", borderRadius: 40, cursor: "pointer",
            background: activeRep === rep.id ? "var(--surface)" : "var(--surface-2)",
            border: `1px solid ${activeRep === rep.id ? "var(--border-strong)" : "var(--border)"}`,
            color: activeRep === rep.id ? "var(--text-primary)" : "var(--text-secondary)",
            fontSize: 13, fontWeight: 500,
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
  );

  // Per-rep breakdown — passed as detailSlot (only in "all" view)
  const detailSlot = activeRep === "all"
    ? (selKey: string, selData: DayData) => (
        <div style={{ marginTop: 20, paddingTop: 16, borderTop: "1px solid var(--border)" }}>
          <p style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: "#6B7280", margin: "0 0 12px" }}>
            By Rep
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {REPS.filter(r => r.id !== "all").map(rep => {
              const rd    = TEAM_DATA[rep.id]?.[selKey];
              const rt    = rd ? getTotal(rd) : 0;
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
      )
    : null;

  return (
    <CallCalendar
      subtitle={`Team Performance · ${activeRep === "all" ? "All Reps" : currentRep.name}`}
      getDayData={key => getTeamDay(activeRep, key)}
      heatThresholds={[8, 16, 26]}
      headerSlot={repSwitcher}
      detailSlot={detailSlot}
      showConnectRate={activeRep !== "all"}
    />
  );
}