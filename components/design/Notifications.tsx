"use client";
import { useState } from "react";
import { ToggleLeft, ToggleRight } from "lucide-react";

// ─── Main Component ───────────────────────────────────────────────
export default function Notifications() {
  const [notifFollowUp,   setNotifFollowUp]   = useState(true);
  const [notifNewLead,    setNotifNewLead]    = useState(true);
  const [notifAssigned,   setNotifAssigned]   = useState(true);
  const [notifEnrolled,   setNotifEnrolled]   = useState(true);
  const [notifOverdue,    setNotifOverdue]    = useState(true);
  const [notifEscalation, setNotifEscalation] = useState(true);

  const card: React.CSSProperties = {
    background: "#fff", border: "1px solid #E5E7EB",
    borderRadius: 12, overflow: "hidden", marginBottom: 12,
  };

  const cardHeader: React.CSSProperties = {
    padding: "11px 16px", borderBottom: "1px solid #F3F4F6",
    display: "flex", alignItems: "center", justifyContent: "space-between",
  };

  const cardBody: React.CSSProperties = { padding: "14px 16px" };

  const groups = [
    {
      section: "Lead Events",
      items: [
        { label: "New lead assigned",   sub: "Notify rep when a lead is assigned to them",  val: notifAssigned,   set: setNotifAssigned   },
        { label: "New lead created",     sub: "Notify manager when any new lead is added",   val: notifNewLead,    set: setNotifNewLead    },
        { label: "Lead enrolled (Won)",  sub: "Team notification when a deal closes",        val: notifEnrolled,   set: setNotifEnrolled   },
      ],
    },
    {
      section: "Follow-up & Tasks",
      items: [
        { label: "Follow-up due",        sub: "15 minutes before a scheduled follow-up",    val: notifFollowUp,   set: setNotifFollowUp   },
        { label: "Follow-up overdue",    sub: "Alert if a follow-up is past due by 1 hour", val: notifOverdue,    set: setNotifOverdue    },
      ],
    },
    {
      section: "Manager Alerts",
      items: [
        { label: "Escalation received",  sub: "Notify manager immediately on escalation",   val: notifEscalation, set: setNotifEscalation },
      ],
    },
  ];

  return (
    <div style={{ maxWidth: 560 }}>
      {groups.map(group => (
        <div key={group.section} style={card}>
          <div style={cardHeader}>
            <p style={{ fontSize: 13, fontWeight: 700, color: "#111827", margin: 0 }}>{group.section}</p>
          </div>
          <div style={cardBody}>
            {group.items.map((item, i) => (
              <div
                key={item.label}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  gap: 12, padding: "10px 0",
                  borderBottom: i < group.items.length - 1 ? "1px solid #F9FAFB" : "none",
                }}
              >
                <div>
                  <p style={{ fontSize: 12, fontWeight: 600, color: "#111827", margin: 0 }}>{item.label}</p>
                  <p style={{ fontSize: 11, color: "#6B7280", margin: "2px 0 0" }}>{item.sub}</p>
                </div>
                <button
                  onClick={() => item.set(!item.val)}
                  style={{
                    background: "none", border: "none", cursor: "pointer",
                    flexShrink: 0, display: "flex",
                    color: item.val ? "#059669" : "#D1D5DB",
                  }}
                >
                  {item.val ? <ToggleRight size={22} /> : <ToggleLeft size={22} />}
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}