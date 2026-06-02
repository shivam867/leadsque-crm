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

// ─── Shared input style ─────────────────────────────────────────
const iStyle: React.CSSProperties = {
  width: "100%", padding: "9px 12px", fontSize: 13,
  borderRadius: 9, border: "1px solid #D1D5DB",
  background: "#fff", color: "#111827", outline: "none",
  boxSizing: "border-box", transition: "border-color .15s",
};
const selStyle: React.CSSProperties = {
  ...iStyle, appearance: "none", paddingRight: 32, cursor: "pointer",
};

function FieldLabel({ icon, children, required }: { icon: React.ReactNode; children: React.ReactNode; required?: boolean }) {
  return (
    <label style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, fontWeight: 700, color: "#374151", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 5 }}>
      <span style={{ color: "#9CA3AF" }}>{icon}</span>
      {children}
      {required && <span style={{ color: "#EF4444", marginLeft: 1 }}>*</span>}
    </label>
  );
}

function SelectWrap({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ position: "relative" }}>
      {children}
      <ChevronDown size={14} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", color: "#9CA3AF", pointerEvents: "none" }} />
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
      <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#F9FAFB" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#ECFDF5", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
            <CheckCircle2 size={28} color="#059669" strokeWidth={2.5} />
          </div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: "#111827", margin: "0 0 6px", letterSpacing: "-0.02em" }}>
            {count === 1 ? "Lead Added!" : `${count} Leads Imported!`}
          </h2>
          <p style={{ fontSize: 13, color: "#6B7280", margin: 0 }}>Redirecting to your leads…</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "24px 28px", maxWidth: 680, background: "#F9FAFB", minHeight: "100%" }}>

      {/* Header */}
      <div style={{ marginBottom: 22 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: "#111827", margin: "0 0 4px", letterSpacing: "-0.02em" }}>Add New Lead</h1>
        <p style={{ fontSize: 13, color: "#6B7280", margin: 0 }}>Capture a new enquiry into the pipeline.</p>
      </div>

      {/* Mode toggle */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20, background: "#fff", border: "1px solid #E5E7EB", borderRadius: 10, padding: 4 }}>
        {(["manual", "csv"] as Mode[]).map(m => (
          <button key={m} onClick={() => setMode(m)} style={{
            flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
            padding: "9px 16px", borderRadius: 7, fontSize: 13, fontWeight: 700, cursor: "pointer", transition: "all .15s",
            background: mode === m ? "#111827" : "transparent",
            color: mode === m ? "#fff" : "#6B7280",
            border: "none",
          }}>
            {m === "manual" ? <><UserPlus size={14} />Add Manually</> : <><Upload size={14} />Import CSV</>}
          </button>
        ))}
      </div>

      {/* ── MANUAL FORM ── */}
      {mode === "manual" && (
        <form onSubmit={handleSubmit}>
          <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 14, overflow: "hidden" }}>
            {/* Section: Contact */}
            <div style={{ padding: "16px 20px", borderBottom: "1px solid #F3F4F6" }}>
              <p style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.06em", color: "#9CA3AF", margin: "0 0 14px" }}>Contact Information</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <div>
                  <FieldLabel icon={<UserPlus size={11} />} required>Full Name</FieldLabel>
                  <input style={iStyle} name="name" placeholder="Rahul Sharma" value={form.name} onChange={handleChange} required
                    onFocus={e => (e.currentTarget.style.borderColor = "#2563EB")}
                    onBlur={e  => (e.currentTarget.style.borderColor = "#D1D5DB")} />
                </div>
                <div>
                  <FieldLabel icon={<Phone size={11} />} required>Phone</FieldLabel>
                  <input style={iStyle} name="phone" placeholder="+91 98000 00000" value={form.phone} onChange={handleChange} required
                    onFocus={e => (e.currentTarget.style.borderColor = "#2563EB")}
                    onBlur={e  => (e.currentTarget.style.borderColor = "#D1D5DB")} />
                </div>
              </div>
              <div style={{ marginTop: 14 }}>
                <FieldLabel icon={<Mail size={11} />}>Email</FieldLabel>
                <input style={iStyle} name="email" type="email" placeholder="name@email.com" value={form.email} onChange={handleChange}
                  onFocus={e => (e.currentTarget.style.borderColor = "#2563EB")}
                  onBlur={e  => (e.currentTarget.style.borderColor = "#D1D5DB")} />
              </div>
              <div style={{ marginTop: 14 }}>
                <FieldLabel icon={<MapPin size={11} />}>City</FieldLabel>
                <SelectWrap>
                  <select style={selStyle} name="city" value={form.city} onChange={handleChange}>
                    <option value="">Select city…</option>
                    {cities.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </SelectWrap>
              </div>
            </div>

            {/* Section: Programme */}
            <div style={{ padding: "16px 20px", borderBottom: "1px solid #F3F4F6" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <div>
                  <FieldLabel icon={<Megaphone size={11} />} required>Lead Source</FieldLabel>
                  <SelectWrap>
                    <select style={selStyle} name="source" value={form.source} onChange={handleChange} required>
                      <option value="">Select source…</option>
                      {sources.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </SelectWrap>
                </div>
                <div>
                  <FieldLabel icon={<BookOpen size={11} />} required>Course Interest</FieldLabel>
                  <SelectWrap>
                    <select style={selStyle} name="service" value={form.service} onChange={handleChange} required>
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
              <textarea style={{ ...iStyle, resize: "none", height: "auto", lineHeight: 1.55 } as React.CSSProperties}
                name="notes" rows={3}
                placeholder="Budget, timeline, any specific requirements..."
                value={form.notes} onChange={handleChange}
                onFocus={e => (e.currentTarget.style.borderColor = "#2563EB")}
                onBlur={e  => (e.currentTarget.style.borderColor = "#D1D5DB")}
              />
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
            <button type="submit" style={{
              display: "flex", alignItems: "center", gap: 7, padding: "11px 24px",
              borderRadius: 10, background: "#111827", color: "#fff",
              fontSize: 13, fontWeight: 700, border: "none", cursor: "pointer", flex: 1,
              justifyContent: "center",
            }}>
              <UserPlus size={14} /> Save Lead
            </button>
            <button type="button" onClick={() => router.back()} style={{
              padding: "11px 20px", borderRadius: 10, background: "#fff",
              color: "#374151", fontSize: 13, fontWeight: 600,
              border: "1px solid #E5E7EB", cursor: "pointer",
            }}>
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* ── CSV IMPORT ── */}
      {mode === "csv" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {/* Upload zone */}
          <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 14, padding: "20px" }}>
            <div
              onClick={() => fileRef.current?.click()}
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              style={{
                border: `2px dashed ${dragOver ? "#2563EB" : "#D1D5DB"}`,
                borderRadius: 11, padding: "32px 20px", textAlign: "center", cursor: "pointer",
                background: dragOver ? "#EFF6FF" : "#F9FAFB", transition: "all .15s",
              }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: "#EFF6FF", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
                <Upload size={20} style={{ color: "#2563EB" }} />
              </div>
              <p style={{ fontSize: 14, fontWeight: 700, color: "#111827", margin: "0 0 4px" }}>
                {csvFile ? csvFile : "Drop your CSV here or click to browse"}
              </p>
              <p style={{ fontSize: 12, color: "#6B7280", margin: 0 }}>
                Required columns: name, phone — Optional: email, source, course, city, notes
              </p>
              <input ref={fileRef} type="file" accept=".csv" style={{ display: "none" }} onChange={handleFile} />
            </div>

            {csvError && (
              <div style={{ display: "flex", alignItems: "center", gap: 7, marginTop: 10, padding: "9px 12px", background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 8 }}>
                <AlertCircle size={14} style={{ color: "#B91C1C" }} />
                <span style={{ fontSize: 12, color: "#B91C1C", fontWeight: 600 }}>{csvError}</span>
              </div>
            )}

            {/* Template */}
            <div style={{ marginTop: 14, padding: "10px 14px", background: "#F9FAFB", borderRadius: 9, border: "1px solid #E5E7EB" }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: "#374151", margin: "0 0 4px" }}>Expected CSV format:</p>
              <code style={{ fontSize: 11, color: "#6B7280", fontFamily: "monospace" }}>
                name,phone,email,source,course,city,notes
              </code>
            </div>
          </div>

          {/* Preview table */}
          {csvRows.length > 0 && (
            <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 14, overflow: "hidden" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderBottom: "1px solid #F3F4F6", background: "#F9FAFB" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                  <FileText size={14} style={{ color: "#374151" }} />
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>Preview — {csvRows.length} rows</span>
                </div>
                <div style={{ display: "flex", gap: 10, fontSize: 12 }}>
                  <span style={{ color: "#059669", fontWeight: 700 }}>{validCount} valid</span>
                  {csvRows.length - validCount > 0 && <span style={{ color: "#B91C1C", fontWeight: 700 }}>{csvRows.length - validCount} errors</span>}
                </div>
              </div>

              <div style={{ maxHeight: 260, overflowY: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: "#F9FAFB" }}>
                      {["Name", "Phone", "Email", "Course", "City", "Status"].map(h => (
                        <th key={h} style={{ textAlign: "left", padding: "8px 12px", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "#6B7280" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {csvRows.map((row, i) => (
                      <tr key={i} style={{ borderTop: "1px solid #F9FAFB", background: row._valid ? undefined : "#FEF2F210" }}>
                        <td style={{ padding: "8px 12px", fontSize: 12, color: "#111827", fontWeight: 500 }}>{row.name || "—"}</td>
                        <td style={{ padding: "8px 12px", fontSize: 12, color: "#374151", fontFamily: "monospace" }}>{row.phone || "—"}</td>
                        <td style={{ padding: "8px 12px", fontSize: 12, color: "#374151" }}>{row.email || "—"}</td>
                        <td style={{ padding: "8px 12px", fontSize: 12, color: "#374151" }}>{row.service || "—"}</td>
                        <td style={{ padding: "8px 12px", fontSize: 12, color: "#374151" }}>{row.city || "—"}</td>
                        <td style={{ padding: "8px 12px" }}>
                          {row._valid
                            ? <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, fontWeight: 700, color: "#059669" }}><CheckCircle2 size={12} />Valid</span>
                            : <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, fontWeight: 700, color: "#B91C1C" }}><X size={12} />{row._error}</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div style={{ padding: "12px 16px", borderTop: "1px solid #E5E7EB", display: "flex", gap: 10 }}>
                <button onClick={handleCsvSubmit} disabled={!validCount} style={{
                  display: "flex", alignItems: "center", gap: 7, padding: "9px 20px",
                  borderRadius: 9, background: validCount ? "#111827" : "#E5E7EB",
                  color: validCount ? "#fff" : "#9CA3AF", fontSize: 13, fontWeight: 700,
                  border: "none", cursor: validCount ? "pointer" : "not-allowed",
                }}>
                  <Upload size={13} /> Import {validCount} Lead{validCount !== 1 ? "s" : ""}
                </button>
                <button onClick={() => { setCsvRows([]); setCsvFile(null); }} style={{
                  display: "flex", alignItems: "center", gap: 6, padding: "9px 16px",
                  borderRadius: 9, background: "#fff", color: "#374151",
                  fontSize: 13, fontWeight: 600, border: "1px solid #E5E7EB", cursor: "pointer",
                }}>
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