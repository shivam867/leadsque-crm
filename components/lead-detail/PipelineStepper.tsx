"use client";
import { Check } from "lucide-react";
import { LeadStatus } from "./types";
import { ORDERED_STAGES, STATUS_CONFIG } from "./constants";

interface PipelineStepperProps {
  currentStatus: LeadStatus;
}

export default function PipelineStepper({ currentStatus }: PipelineStepperProps) {
  const idx = ORDERED_STAGES.indexOf(currentStatus);
  const isTerminal = currentStatus === "Lost" || currentStatus === "Not Interested";

  if (isTerminal) {
    return (
      <div style={{ padding: "10px 24px 14px" }}>
        <span
          style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            padding: "5px 14px", background: "#FEF2F2",
            border: "1px solid #FECACA", borderRadius: 99,
            fontSize: 12, fontWeight: 700, color: "#B91C1C",
          }}
        >
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#EF4444" }} />
          Lead {currentStatus}
        </span>
      </div>
    );
  }

  const progressPct = ORDERED_STAGES.length > 1
    ? (idx / (ORDERED_STAGES.length - 1)) * 100
    : 0;

  return (
    <div style={{ padding: "14px 28px 16px", background: "#fff" }}>
      <div style={{ position: "relative" }}>
        {/* Track */}
        <div
          style={{
            position: "absolute", top: 14, left: 14, right: 14,
            height: 2, background: "#E5E7EB", borderRadius: 99,
          }}
        />
        {/* Progress fill */}
        {idx > 0 && (
          <div
            style={{
              position: "absolute", top: 14, left: 14,
              width: `calc(${progressPct}% - 28px)`,
              height: 2,
              background: "linear-gradient(90deg, #2563EB, #60A5FA)",
              borderRadius: 99,
              transition: "width 0.4s ease",
            }}
          />
        )}
        {/* Steps */}
        <div style={{ display: "flex", justifyContent: "space-between", position: "relative" }}>
          {ORDERED_STAGES.map((stage, i) => {
            const done = i < idx;
            const active = i === idx;
            const cfg = STATUS_CONFIG[stage];
            return (
              <div key={stage} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                <div
                  style={{
                    width: 30, height: 30, borderRadius: "50%",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    background: done ? "#2563EB" : "#fff",
                    border: done ? "none" : active ? `2.5px solid ${cfg.text}` : "2px solid #E5E7EB",
                    boxShadow: active
                      ? `0 0 0 4px ${cfg.text}15`
                      : done ? "0 2px 6px rgba(37,99,235,0.2)" : "none",
                    zIndex: 1, position: "relative",
                    transition: "all 0.3s ease",
                  }}
                >
                  {done
                    ? <Check size={12} style={{ color: "#fff" }} strokeWidth={3} />
                    : active
                      ? <div style={{ width: 9, height: 9, borderRadius: "50%", background: cfg.text }} />
                      : <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#D1D5DB" }} />
                  }
                </div>
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: active ? 800 : done ? 600 : 400,
                    color: active ? cfg.text : done ? "#374151" : "#9CA3AF",
                    whiteSpace: "nowrap",
                    transition: "color 0.3s ease",
                  }}
                >
                  {stage}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}