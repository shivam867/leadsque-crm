// ─── Types ────────────────────────────────────────────────────────────────────

export type DayData = {
  connected: number;
  noAnswer: number;
  busy: number;
  callLater: number;
  wrongNumber: number;
};

export type CallDataMap = Record<string, DayData>;

// ─── Outcome config ───────────────────────────────────────────────────────────

export const OUTCOMES: { key: keyof DayData; label: string; color: string }[] = [
  { key: "connected",   label: "Connected",  color: "#10B981" },
  { key: "noAnswer",    label: "No Answer",  color: "#6B7280" },
  { key: "busy",        label: "Busy",       color: "#F59E0B" },
  { key: "callLater",   label: "Call Later", color: "#8B5CF6" },
  { key: "wrongNumber", label: "Wrong #",    color: "#EF4444" },
];

export const HEAT_STYLES: Record<number, { bg: string; border: string }> = {
  0: { bg: "transparent", border: "var(--border)" },
  1: { bg: "#F9FAFB",     border: "#E5E7EB" },
  2: { bg: "#F3F4F6",     border: "#D1D5DB" },
  3: { bg: "#EEF2FF",     border: "#C7D2FE" },
  4: { bg: "#E0E7FF",     border: "#A5B4FC" },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function getTotal(d: DayData) {
  return d.connected + d.noAnswer + d.busy + d.callLater + d.wrongNumber;
}

export function getConnectRate(d: DayData) {
  const t = getTotal(d);
  return t ? Math.round((d.connected / t) * 100) : 0;
}

export function getHeat(total: number, thresholds = [4, 7, 10]): number {
  if (total === 0) return 0;
  if (total <= thresholds[0]) return 1;
  if (total <= thresholds[1]) return 2;
  if (total <= thresholds[2]) return 3;
  return 4;
}

export function mergeDayData(entries: DayData[]): DayData | null {
  if (!entries.length) return null;
  return entries.reduce((a, b) => ({
    connected:   a.connected   + b.connected,
    noAnswer:    a.noAnswer    + b.noAnswer,
    busy:        a.busy        + b.busy,
    callLater:   a.callLater   + b.callLater,
    wrongNumber: a.wrongNumber + b.wrongNumber,
  }));
}