"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  UserPlus, Upload, X, CheckCircle2, AlertCircle,
  FileText, Phone, Mail, MapPin, BookOpen,
  Megaphone, StickyNote, ChevronDown,
} from "lucide-react";

const sources  = ["Website","Referral","Cold Call","Instagram Ad","Google Ad","YouTube","Seminar","Walk-in","WhatsApp","Other"];
const services = ["Foundation Program","Advanced Program","Crash Course","Online Live","Weekend Batch","Recorded Course","Test Series","One-on-One Mentorship","Interview Prep","Other"];
const cities   = ["Delhi","Mumbai","Bangalore","Chennai","Hyderabad","Pune","Kolkata","Jaipur","Lucknow","Ahmedabad","Kochi","Other"];

type Mode = "manual" | "csv";

interface CsvRow {
  name: string; phone: string; email: string;
  source: string; service: string; city: string; notes: string;
  _valid: boolean; _error?: string;
}

function parseCsv(text: string): CsvRow[] {
  const lines = text.trim().split("\n");
  if (lines.length < 2) return [];
  const header = lines[0].split(",").map(h => h.trim().toLowerCase().replace(/\s+/g, ""));
  return lines.slice(1).map(line => {
    const cols = line.split(",").map(c => c.trim().replace(/^"|"$/g, ""));
    const obj: Record<string, string> = {};
    header.forEach((h, i) => { obj[h] = cols[i] || ""; });
    const name    = obj["name"]  || obj["fullname"] || "";
    const phone   = obj["phone"] || obj["mobile"]   || obj["contact"] || "";
    const email   = obj["email"] || "";
    const source  = obj["source"] || "Other";
    const service = obj["service"] || obj["course"]  || "";
    const city    = obj["city"]   || obj["location"] || "";
    const notes   = obj["notes"] || obj["remarks"]   || "";
    const missing: string[] = [];
    if (!name)  missing.push("name");
    if (!phone) missing.push("phone");
    return { name, phone, email, source, service, city, notes, _valid: missing.length === 0, _error: missing.length ? `Missing: ${missing.join(", ")}` : undefined };
  });
}

function FieldLabel({ icon, children, required }: { icon: React.ReactNode; children: React.ReactNode; required?: boolean }) {
  return (
    <label style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, fontWeight: 700, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 5 }}>
      <span style={{ color: "var(--text-muted)" }}>{icon}</span>
      {children}
      {required && <span style={{ color: "var(--danger)", marginLeft: 1 }}>*</span>}
    </label>
  );
}

function SelectWrap({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ position: "relative" }}>
      {children}
      <ChevronDown size={14} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", pointerEvents: "none" }} />
    </div>
  );
}

export default function AddLead() {
  const router = useRouter();
  const [mode, setMode]       = useState<Mode>("manual");
  const [form, setForm]       = useState({ name: "", phone: "", email: "", source: "", service: "", city: "", notes: "" });
  const [submitted, setSubmitted]       = useState(false);
  const [csvRows, setCsvRows]           = useState<CsvRow[]>([]);
  const [csvFile, setCsvFile]           = useState<string | null>(null);
  const [csvError, setCsvError]         = useState<string | null>(null);
  const [csvSubmitted, setCsvSubmitted] = useState(false);
  const [dragOver, setDragOver]         = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => router.push("/rep/leads"), 1800);
  };

  const processFile = (file: File) => {
    if (!file.name.endsWith(".csv")) { setCsvError("Please upload a .csv file."); return; }
    setCsvError(null); setCsvFile(file.name);
    const reader = new FileReader();
    reader.onload = ev => {
      const rows = parseCsv(ev.target?.result as string);
      if (rows.length === 0) { setCsvError("No rows found. Check your CSV format."); return; }
      setCsvRows(rows);
    };
    reader.readAsText(file);
  };

  const handleFile   = (e: React.ChangeEvent<HTMLInputElement>) => { const f = e.target.files?.[0]; if (f) processFile(f); };
  const handleDrop   = (e: React.DragEvent) => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files?.[0]; if (f) processFile(f); };
  const handleCsvSubmit = () => { if (!validCount) return; setCsvSubmitted(true); setTimeout(() => router.push("/rep/leads"), 2000); };

  const validCount = csvRows.filter(r => r._valid).length;

  // ── Success screen ──
  if (submitted || csvSubmitted) {
    const count = csvSubmitted ? validCount : 1;
    return (
      <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg)" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: 64, height: 64, borderRadius: "50%", background: "var(--success-light)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
            <CheckCircle2 size={28} color="var(--success)" strokeWidth={2.5} />
          </div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: "var(--text-primary)", margin: "0 0 6px", letterSpacing: "-0.02em" }}>
            {count === 1 ? "Lead Added!" : `${count} Leads Imported!`}
          </h2>
          <p style={{ fontSize: 13, color: "var(--text-secondary)", margin: 0 }}>Redirecting to your leads…</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "24px 28px", maxWidth: 680, background: "var(--bg)", minHeight: "100%" }}>

      {/* Header */}
      <div style={{ marginBottom: 22 }}>
        <h1 className="page-title" style={{ marginBottom: 4 }}>Add New Lead</h1>
        <p className="page-subtitle">Capture a new enquiry into the pipeline.</p>
      </div>

      {/* Mode toggle */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, padding: 4 }}>
        {(["manual", "csv"] as Mode[]).map(m => (
          <button key={m} onClick={() => setMode(m)} style={{
            flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
            padding: "9px 16px", borderRadius: 7, fontSize: 13, fontWeight: 700, cursor: "pointer", transition: "all .15s",
            background: mode === m ? "var(--text-primary)" : "transparent",
            color: mode === m ? "#fff" : "var(--text-secondary)",
            border: "none",
          }}>
            {m === "manual" ? <><UserPlus size={14} />Add Manually</> : <><Upload size={14} />Import CSV</>}
          </button>
        ))}
      </div>

      {/* ── MANUAL FORM ── */}
      {mode === "manual" && (
        <form onSubmit={handleSubmit}>
          <div className="card" style={{ overflow: "hidden" }}>
            {/* Section: Contact */}
            <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--surface-2)" }}>
              <p style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-muted)", margin: "0 0 14px" }}>Contact Information</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <div>
                  <FieldLabel icon={<UserPlus size={11} />} required>Full Name</FieldLabel>
                  <input className="input" name="name" placeholder="Rahul Sharma" value={form.name} onChange={handleChange} required />
                </div>
                <div>
                  <FieldLabel icon={<Phone size={11} />} required>Phone</FieldLabel>
                  <input className="input" name="phone" placeholder="+91 98000 00000" value={form.phone} onChange={handleChange} required />
                </div>
              </div>
              <div style={{ marginTop: 14 }}>
                <FieldLabel icon={<Mail size={11} />}>Email</FieldLabel>
                <input className="input" name="email" type="email" placeholder="name@email.com" value={form.email} onChange={handleChange} />
              </div>
              <div style={{ marginTop: 14 }}>
                <FieldLabel icon={<MapPin size={11} />}>City</FieldLabel>
                <SelectWrap>
                  <select className="input" name="city" value={form.city} onChange={handleChange}>
                    <option value="">Select city…</option>
                    {cities.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </SelectWrap>
              </div>
            </div>

            {/* Section: Programme */}
            <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--surface-2)" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <div>
                  <FieldLabel icon={<Megaphone size={11} />} required>Lead Source</FieldLabel>
                  <SelectWrap>
                    <select className="input" name="source" value={form.source} onChange={handleChange} required>
                      <option value="">Select source…</option>
                      {sources.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </SelectWrap>
                </div>
                <div>
                  <FieldLabel icon={<BookOpen size={11} />} required>Course Interest</FieldLabel>
                  <SelectWrap>
                    <select className="input" name="service" value={form.service} onChange={handleChange} required>
                      <option value="">Select course…</option>
                      {services.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </SelectWrap>
                </div>
              </div>
            </div>

            {/* Section: Notes */}
            <div style={{ padding: "16px 20px" }}>
              <FieldLabel icon={<StickyNote size={11} />}>Notes</FieldLabel>
              <textarea
                className="input"
                name="notes" rows={3}
                placeholder="Budget, timeline, any specific requirements..."
                value={form.notes} onChange={handleChange}
              />
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
            <button type="submit" className="btn-primary" style={{ flex: 1, justifyContent: "center", padding: "11px 24px", borderRadius: 10 }}>
              <UserPlus size={14} /> Save Lead
            </button>
            <button type="button" onClick={() => router.back()} className="btn-secondary" style={{ padding: "11px 20px", borderRadius: 10 }}>
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* ── CSV IMPORT ── */}
      {mode === "csv" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {/* Upload zone */}
          <div className="card" style={{ padding: "20px" }}>
            <div
              onClick={() => fileRef.current?.click()}
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              style={{
                border: `2px dashed ${dragOver ? "var(--accent)" : "var(--border-strong)"}`,
                borderRadius: 11, padding: "32px 20px", textAlign: "center", cursor: "pointer",
                background: dragOver ? "var(--accent-light)" : "var(--surface-2)", transition: "all .15s",
              }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: "var(--accent-light)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
                <Upload size={20} style={{ color: "var(--accent)" }} />
              </div>
              <p style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)", margin: "0 0 4px" }}>
                {csvFile ? csvFile : "Drop your CSV here or click to browse"}
              </p>
              <p style={{ fontSize: 12, color: "var(--text-secondary)", margin: 0 }}>
                Required columns: name, phone — Optional: email, source, course, city, notes
              </p>
              <input ref={fileRef} type="file" accept=".csv" style={{ display: "none" }} onChange={handleFile} />
            </div>

            {csvError && (
              <div style={{ display: "flex", alignItems: "center", gap: 7, marginTop: 10, padding: "9px 12px", background: "var(--danger-light)", border: "1px solid var(--danger-border)", borderRadius: 8 }}>
                <AlertCircle size={14} style={{ color: "var(--danger)" }} />
                <span style={{ fontSize: 12, color: "var(--danger)", fontWeight: 600 }}>{csvError}</span>
              </div>
            )}

            {/* Template */}
            <div style={{ marginTop: 14, padding: "10px 14px", background: "var(--surface-2)", borderRadius: 9, border: "1px solid var(--border)" }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: "var(--text-secondary)", margin: "0 0 4px" }}>Expected CSV format:</p>
              <code style={{ fontSize: 11, color: "var(--text-secondary)", fontFamily: "monospace" }}>
                name,phone,email,source,course,city,notes
              </code>
            </div>
          </div>

          {/* Preview table */}
          {csvRows.length > 0 && (
            <div className="card" style={{ overflow: "hidden" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderBottom: "1px solid var(--border)", background: "var(--surface-2)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                  <FileText size={14} style={{ color: "var(--text-secondary)" }} />
                  <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)" }}>Preview — {csvRows.length} rows</span>
                </div>
                <div style={{ display: "flex", gap: 10, fontSize: 12 }}>
                  <span style={{ color: "var(--success)", fontWeight: 700 }}>{validCount} valid</span>
                  {csvRows.length - validCount > 0 && <span style={{ color: "var(--danger)", fontWeight: 700 }}>{csvRows.length - validCount} errors</span>}
                </div>
              </div>

              <div style={{ maxHeight: 260, overflowY: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: "var(--surface-2)" }}>
                      {["Name", "Phone", "Email", "Course", "City", "Status"].map(h => (
                        <th key={h} style={{ textAlign: "left", padding: "8px 12px", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-secondary)" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {csvRows.map((row, i) => (
                      <tr key={i} style={{ borderTop: "1px solid var(--surface-2)", background: row._valid ? undefined : "var(--danger-light)" }}>
                        <td style={{ padding: "8px 12px", fontSize: 12, color: "var(--text-primary)", fontWeight: 500 }}>{row.name || "—"}</td>
                        <td style={{ padding: "8px 12px", fontSize: 12, color: "var(--text-secondary)", fontFamily: "monospace" }}>{row.phone || "—"}</td>
                        <td style={{ padding: "8px 12px", fontSize: 12, color: "var(--text-secondary)" }}>{row.email || "—"}</td>
                        <td style={{ padding: "8px 12px", fontSize: 12, color: "var(--text-secondary)" }}>{row.service || "—"}</td>
                        <td style={{ padding: "8px 12px", fontSize: 12, color: "var(--text-secondary)" }}>{row.city || "—"}</td>
                        <td style={{ padding: "8px 12px" }}>
                          {row._valid
                            ? <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, fontWeight: 700, color: "var(--success)" }}><CheckCircle2 size={12} />Valid</span>
                            : <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, fontWeight: 700, color: "var(--danger)" }}><X size={12} />{row._error}</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div style={{ padding: "12px 16px", borderTop: "1px solid var(--border)", display: "flex", gap: 10 }}>
                <button onClick={handleCsvSubmit} disabled={!validCount} className={validCount ? "btn-primary" : "btn-secondary"} style={{ padding: "9px 20px" }}>
                  <Upload size={13} /> Import {validCount} Lead{validCount !== 1 ? "s" : ""}
                </button>
                <button onClick={() => { setCsvRows([]); setCsvFile(null); }} className="btn-secondary" style={{ padding: "9px 16px" }}>
                  <X size={13} /> Clear
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}