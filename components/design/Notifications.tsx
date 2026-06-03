"use client";
import { useState } from "react";
import { ToggleLeft, ToggleRight } from "lucide-react";

export default function Notifications() {
  const [notifFollowUp,   setNotifFollowUp]   = useState(true);
  const [notifNewLead,    setNotifNewLead]    = useState(true);
  const [notifAssigned,   setNotifAssigned]   = useState(true);
  const [notifEnrolled,   setNotifEnrolled]   = useState(true);
  const [notifOverdue,    setNotifOverdue]    = useState(true);
  const [notifEscalation, setNotifEscalation] = useState(true);

  const groups = [
    {
      section: "Lead Events",
      items: [
        { label: "New lead assigned",  sub: "Notify rep when a lead is assigned to them",  val: notifAssigned,   set: setNotifAssigned   },
        { label: "New lead created",   sub: "Notify manager when any new lead is added",   val: notifNewLead,    set: setNotifNewLead    },
        { label: "Lead enrolled (Won)", sub: "Team notification when a deal closes",       val: notifEnrolled,   set: setNotifEnrolled   },
      ],
    },
    {
      section: "Follow-up & Tasks",
      items: [
        { label: "Follow-up due",      sub: "15 minutes before a scheduled follow-up",    val: notifFollowUp,   set: setNotifFollowUp   },
        { label: "Follow-up overdue",  sub: "Alert if a follow-up is past due by 1 hour", val: notifOverdue,    set: setNotifOverdue    },
      ],
    },
    {
      section: "Manager Alerts",
      items: [
        { label: "Escalation received", sub: "Notify manager immediately on escalation",  val: notifEscalation, set: setNotifEscalation },
      ],
    },
  ];

  return (
    <div style={{ maxWidth: 560 }}>
      {groups.map(group => (
        <div key={group.section} className="card" style={{ marginBottom: 12 }}>
          <div style={{ padding: "11px 16px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)", margin: 0 }}>{group.section}</p>
          </div>
          <div style={{ padding: "14px 16px" }}>
            {group.items.map((item, i) => (
              <div
                key={item.label}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  gap: 12, padding: "10px 0",
                  borderBottom: i < group.items.length - 1 ? "1px solid var(--surface-2)" : "none",
                }}
              >
                <div>
                  <p style={{ fontSize: 12, fontWeight: 600, color: "var(--text-primary)", margin: 0 }}>{item.label}</p>
                  <p style={{ fontSize: 11, color: "var(--text-secondary)", margin: "2px 0 0" }}>{item.sub}</p>
                </div>
                <button
                  onClick={() => item.set(!item.val)}
                  style={{ background: "none", border: "none", cursor: "pointer", flexShrink: 0, display: "flex", color: item.val ? "var(--success)" : "var(--border-strong)" }}
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