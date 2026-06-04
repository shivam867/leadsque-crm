"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  UserPlus, Upload, X, CheckCircle2, AlertCircle,
  FileText, Phone, Mail, MapPin, BookOpen,
  Megaphone, StickyNote, ChevronDown, ArrowLeft,
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
    <label style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 10, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 5 }}>
      {icon}{children}
      {required && <span style={{ color: "var(--danger)", marginLeft: 1 }}>*</span>}
    </label>
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

  const handleFile       = (e: React.ChangeEvent<HTMLInputElement>) => { const f = e.target.files?.[0]; if (f) processFile(f); };
  const handleDrop       = (e: React.DragEvent) => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files?.[0]; if (f) processFile(f); };
  const handleCsvSubmit  = () => { if (!validCount) return; setCsvSubmitted(true); setTimeout(() => router.push("/rep/leads"), 2000); };

  const validCount = csvRows.filter(r => r._valid).length;

  // ── Success screen ──
  if (submitted || csvSubmitted) {
    const count = csvSubmitted ? validCount : 1;
    return (
      <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg)" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: 60, height: 60, borderRadius: "50%", background: "var(--success-light)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
            <CheckCircle2 size={26} color="var(--success)" strokeWidth={2.5} />
          </div>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: "var(--text-primary)", margin: "0 0 5px", letterSpacing: "-0.02em" }}>
            {count === 1 ? "Lead Added!" : `${count} Leads Imported!`}
          </h2>
          <p style={{ fontSize: 13, color: "var(--text-secondary)", margin: 0 }}>Redirecting to your leads…</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "var(--bg)" }}>

      {/* ── Page header ── */}
      <div className="animate-fade-up" style={{ padding: "20px 24px 0", background: "var(--surface)", borderBottom: "1px solid var(--border)", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
          <button onClick={() => router.back()} className="btn-ghost" style={{ padding: "5px 8px", color: "var(--text-muted)", marginLeft: -4 }}>
            <ArrowLeft size={15} />
          </button>
          <div>
            <h1 className="page-title" style={{ fontSize: 18, marginBottom: 2 }}>Add New Lead</h1>
            <p className="page-subtitle">Capture a new enquiry into the pipeline.</p>
          </div>
        </div>

        {/* Mode toggle */}
        <div style={{ display: "flex", gap: 0, borderBottom: "1px solid var(--border)", marginLeft: -24, marginRight: -24, paddingLeft: 24 }}>
          {(["manual", "csv"] as Mode[]).map(m => (
            <button key={m} onClick={() => setMode(m)} style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "9px 16px",
              fontSize: 12, fontWeight: mode === m ? 700 : 500, cursor: "pointer",
              background: "none", border: "none",
              color: mode === m ? "var(--text-primary)" : "var(--text-secondary)",
              borderBottom: mode === m ? "2px solid var(--text-primary)" : "2px solid transparent",
              marginBottom: -1,
              transition: "all .15s",
            }}>
              {m === "manual" ? <><UserPlus size={13} />Add Manually</> : <><Upload size={13} />Import CSV</>}
            </button>
          ))}
        </div>
      </div>

      {/* ── Scrollable content ── */}
      <div className="animate-fade-up" style={{ flex: 1, overflowY: "auto", padding: "20px 24px 32px", animationDelay: "40ms" }}>

        {/* ── MANUAL FORM ── */}
        {mode === "manual" && (
          <form onSubmit={handleSubmit} style={{ maxWidth: 640 }}>
            <div className="card" style={{ overflow: "hidden", marginBottom: 14 }}>

              {/* Contact section */}
              <div style={{ padding: "16px 18px", borderBottom: "1px solid var(--surface-2)" }}>
                <p style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--text-muted)", margin: "0 0 14px" }}>Contact Information</p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                  <div>
                    <FieldLabel icon={<UserPlus size={10} />} required>Full Name</FieldLabel>
                    <input className="input" name="name" placeholder="Rahul Sharma" value={form.name} onChange={handleChange} required />
                  </div>
                  <div>
                    <FieldLabel icon={<Phone size={10} />} required>Phone</FieldLabel>
                    <input className="input" name="phone" placeholder="+91 98000 00000" value={form.phone} onChange={handleChange} required />
                  </div>
                </div>
                <div style={{ marginTop: 12 }}>
                  <FieldLabel icon={<Mail size={10} />}>Email</FieldLabel>
                  <input className="input" name="email" type="email" placeholder="name@email.com" value={form.email} onChange={handleChange} />
                </div>
                <div style={{ marginTop: 12 }}>
                  <FieldLabel icon={<MapPin size={10} />}>City</FieldLabel>
                  <div style={{ position: "relative" }}>
                    <select className="input" name="city" value={form.city} onChange={handleChange}>
                      <option value="">Select city…</option>
                      {cities.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              {/* Programme section */}
              <div style={{ padding: "16px 18px", borderBottom: "1px solid var(--surface-2)" }}>
                <p style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--text-muted)", margin: "0 0 14px" }}>Programme Details</p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                  <div>
                    <FieldLabel icon={<Megaphone size={10} />} required>Lead Source</FieldLabel>
                    <div style={{ position: "relative" }}>
                      <select className="input" name="source" value={form.source} onChange={handleChange} required>
                        <option value="">Select source…</option>
                        {sources.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <FieldLabel icon={<BookOpen size={10} />} required>Course Interest</FieldLabel>
                    <div style={{ position: "relative" }}>
                      <select className="input" name="service" value={form.service} onChange={handleChange} required>
                        <option value="">Select course…</option>
                        {services.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes section */}
              <div style={{ padding: "16px 18px" }}>
                <FieldLabel icon={<StickyNote size={10} />}>Notes</FieldLabel>
                <textarea
                  className="input"
                  name="notes" rows={3}
                  placeholder="Budget, timeline, any specific requirements..."
                  value={form.notes} onChange={handleChange}
                />
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: "flex", gap: 10 }}>
              <button type="submit" className="btn-primary" style={{ flex: 1, justifyContent: "center", padding: "10px 24px" }}>
                <UserPlus size={13} /> Save Lead
              </button>
              <button type="button" onClick={() => router.back()} className="btn-secondary" style={{ padding: "10px 20px" }}>
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* ── CSV IMPORT ── */}
        {mode === "csv" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14, maxWidth: 640 }}>
            <div className="card" style={{ padding: "18px" }}>
              {/* Drop zone */}
              <div
                onClick={() => fileRef.current?.click()}
                onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                style={{
                  border: `1.5px dashed ${dragOver ? "var(--accent)" : "var(--border-strong)"}`,
                  borderRadius: 10, padding: "28px 20px", textAlign: "center", cursor: "pointer",
                  background: dragOver ? "var(--accent-light)" : "var(--surface-2)", transition: "all .15s",
                }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: "var(--accent-light)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 10px" }}>
                  <Upload size={18} style={{ color: "var(--accent)" }} />
                </div>
                <p style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)", margin: "0 0 4px" }}>
                  {csvFile ? csvFile : "Drop your CSV here or click to browse"}
                </p>
                <p style={{ fontSize: 11, color: "var(--text-secondary)", margin: 0 }}>
                  Required: name, phone · Optional: email, source, course, city, notes
                </p>
                <input ref={fileRef} type="file" accept=".csv" style={{ display: "none" }} onChange={handleFile} />
              </div>

              {csvError && (
                <div style={{ display: "flex", alignItems: "center", gap: 7, marginTop: 10, padding: "8px 12px", background: "var(--danger-light)", border: "1px solid var(--danger-border)", borderRadius: 7 }}>
                  <AlertCircle size={13} style={{ color: "var(--danger)" }} />
                  <span style={{ fontSize: 12, color: "var(--danger)", fontWeight: 600 }}>{csvError}</span>
                </div>
              )}

              {/* Format hint */}
              <div style={{ marginTop: 12, padding: "9px 12px", background: "var(--surface-2)", borderRadius: 8, border: "1px solid var(--border)" }}>
                <p style={{ fontSize: 10, fontWeight: 700, color: "var(--text-secondary)", margin: "0 0 3px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Expected format</p>
                <code style={{ fontSize: 11, color: "var(--text-secondary)", fontFamily: "monospace" }}>
                  name,phone,email,source,course,city,notes
                </code>
              </div>
            </div>

            {/* Preview table */}
            {csvRows.length > 0 && (
              <div className="card" style={{ overflow: "hidden" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "11px 16px", borderBottom: "1px solid var(--border)", background: "var(--surface-2)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                    <FileText size={13} style={{ color: "var(--text-muted)" }} />
                    <span style={{ fontSize: 12, fontWeight: 700, color: "var(--text-primary)" }}>Preview — {csvRows.length} rows</span>
                  </div>
                  <div style={{ display: "flex", gap: 10, fontSize: 11 }}>
                    <span style={{ color: "var(--success)", fontWeight: 700 }}>{validCount} valid</span>
                    {csvRows.length - validCount > 0 && <span style={{ color: "var(--danger)", fontWeight: 700 }}>{csvRows.length - validCount} errors</span>}
                  </div>
                </div>

                <div style={{ maxHeight: 240, overflowY: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ background: "var(--surface-2)" }}>
                        {["Name", "Phone", "Email", "Course", "City", "Status"].map(h => (
                          <th key={h} style={{ textAlign: "left", padding: "7px 12px", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-muted)" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {csvRows.map((row, i) => (
                        <tr key={i} style={{ borderTop: "1px solid var(--surface-2)", background: row._valid ? undefined : "var(--danger-light)" }}>
                          <td style={{ padding: "7px 12px", fontSize: 12, color: "var(--text-primary)", fontWeight: 500 }}>{row.name || "—"}</td>
                          <td style={{ padding: "7px 12px", fontSize: 11, color: "var(--text-secondary)", fontFamily: "monospace" }}>{row.phone || "—"}</td>
                          <td style={{ padding: "7px 12px", fontSize: 11, color: "var(--text-secondary)" }}>{row.email || "—"}</td>
                          <td style={{ padding: "7px 12px", fontSize: 11, color: "var(--text-secondary)" }}>{row.service || "—"}</td>
                          <td style={{ padding: "7px 12px", fontSize: 11, color: "var(--text-secondary)" }}>{row.city || "—"}</td>
                          <td style={{ padding: "7px 12px" }}>
                            {row._valid
                              ? <span style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 10, fontWeight: 700, color: "var(--success)" }}><CheckCircle2 size={11} />Valid</span>
                              : <span style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 10, fontWeight: 700, color: "var(--danger)" }}><X size={11} />{row._error}</span>}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div style={{ padding: "11px 16px", borderTop: "1px solid var(--border)", display: "flex", gap: 10 }}>
                  <button onClick={handleCsvSubmit} disabled={!validCount} className={validCount ? "btn-primary" : "btn-secondary"} style={{ padding: "8px 18px" }}>
                    <Upload size={12} /> Import {validCount} Lead{validCount !== 1 ? "s" : ""}
                  </button>
                  <button onClick={() => { setCsvRows([]); setCsvFile(null); }} className="btn-secondary" style={{ padding: "8px 14px" }}>
                    <X size={12} /> Clear
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}