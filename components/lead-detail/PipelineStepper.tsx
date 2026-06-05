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
        <span style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          padding: "5px 14px", background: "#FEF2F2",
          border: "1px solid #FECACA", borderRadius: 99,
          fontSize: 12, fontWeight: 700, color: "#B91C1C",
        }}>
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#EF4444" }} />
          Lead {currentStatus}
        </span>
      </div>
    );
  }

  return (
    <div style={{ padding: "14px 24px 0", background: "var(--surface)" }}>
      {/* Chevron pipeline */}
      <div style={{ display: "flex", alignItems: "stretch", height: 40, gap: 0 }}>
        {ORDERED_STAGES.map((stage, i) => {
          const done = i < idx;
          const active = i === idx;
          const isLast = i === ORDERED_STAGES.length - 1;

          let bg = "#F0F0F0";
          let textColor = "#999999";
          let fontWeight = 500;

          if (done) { bg = "#111111"; textColor = "#FFFFFF"; fontWeight = 600; }
          else if (active) { bg = "#111111"; textColor = "#FFFFFF"; fontWeight = 700; }

          const W = `${100 / ORDERED_STAGES.length}%`;
          const chevronSize = 12;

          return (
            <div
              key={stage}
              style={{
                flex: 1,
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: bg,
                fontSize: 10,
                fontWeight,
                color: textColor,
                letterSpacing: "-0.01em",
                whiteSpace: "nowrap",
                overflow: "hidden",
                /* left notch */
                clipPath: i === 0
                  ? `polygon(0 0, calc(100% - ${chevronSize}px) 0, 100% 50%, calc(100% - ${chevronSize}px) 100%, 0 100%)`
                  : isLast
                  ? `polygon(0 0, 100% 0, 100% 100%, 0 100%, ${chevronSize}px 50%)`
                  : `polygon(0 0, calc(100% - ${chevronSize}px) 0, 100% 50%, calc(100% - ${chevronSize}px) 100%, 0 100%, ${chevronSize}px 50%)`,
                paddingLeft: i === 0 ? 14 : 20,
                paddingRight: isLast ? 14 : 20,
                transition: "background 0.25s ease",
              }}
            >
              {done ? (
                <Check size={10} strokeWidth={3} style={{ color: "#fff", marginRight: 4, flexShrink: 0 }} />
              ) : null}
              <span style={{ fontSize: 10, lineHeight: 1 }}>{stage}</span>

              {/* Separator gap */}
              {!isLast && (
                <div style={{
                  position: "absolute", right: -1, top: 0, bottom: 0, width: 2,
                  background: "var(--surface)", zIndex: 1,
                }} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}