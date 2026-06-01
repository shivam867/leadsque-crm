"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  UserPlus, Upload, X, CheckCircle2, AlertCircle,
  FileText, Phone, Mail, MapPin, BookOpen,
  Megaphone, StickyNote, ChevronDown
} from "lucide-react";

const sources = ["Website", "Referral", "Cold Call", "Instagram Ad", "Google Ad", "YouTube", "Seminar", "Walk-in", "Other"];
const services = ["Prelims Pro Batch", "UPSC Full Course", "Mains Answer Writing", "State PCS Batch", "Optional Subject", "Test Series", "Interview Guidance"];

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
    const name  = obj["name"] || obj["fullname"] || "";
    const phone = obj["phone"] || obj["mobile"] || obj["contact"] || "";
    const email = obj["email"] || "";
    const source = obj["source"] || "Other";
    const service = obj["service"] || obj["course"] || "";
    const city  = obj["city"] || obj["location"] || "";
    const notes = obj["notes"] || obj["remarks"] || "";
    const missing: string[] = [];
    if (!name) missing.push("name");
    if (!phone) missing.push("phone");
    return {
      name, phone, email, source, service, city, notes,
      _valid: missing.length === 0,
      _error: missing.length ? `Missing: ${missing.join(", ")}` : undefined,
    };
  });
}

export default function AddLead() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("manual");
  const [form, setForm] = useState({
    name: "", phone: "", email: "", source: "", service: "", city: "", notes: "",
  });
  const [submitted, setSubmitted]   = useState(false);
  const [csvRows, setCsvRows]       = useState<CsvRow[]>([]);
  const [csvFile, setCsvFile]       = useState<string | null>(null);
  const [csvError, setCsvError]     = useState<string | null>(null);
  const [csvSubmitted, setCsvSubmitted] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => router.push("/rep/leads"), 1800);
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.name.endsWith(".csv")) { setCsvError("Please upload a .csv file."); return; }
    setCsvError(null);
    setCsvFile(file.name);
    const reader = new FileReader();
    reader.onload = ev => {
      const text = ev.target?.result as string;
      const rows = parseCsv(text);
      if (rows.length === 0) { setCsvError("No rows found. Check your CSV format."); return; }
      setCsvRows(rows);
    };
    reader.readAsText(file);
  };

  const handleCsvSubmit = () => {
    const valid = csvRows.filter(r => r._valid);
    if (!valid.length) return;
    setCsvSubmitted(true);
    setTimeout(() => router.push("/rep/leads"), 2000);
  };

  const validCount = csvRows.filter(r => r._valid).length;

  if (submitted || csvSubmitted) {
    const count = csvSubmitted ? validCount : 1;
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center animate-scale-in">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ background: "var(--success-light)" }}>
            <CheckCircle2 size={28} color="#059669" strokeWidth={2.5} />
          </div>
          <h2 className="text-2xl font-semibold mb-2"
            style={{ fontFamily: "'Syne', sans-serif", color: "var(--text-primary)" }}>
            {count === 1 ? "Lead Added!" : `${count} Leads Imported!`}
          </h2>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>Redirecting to your leads…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-7 max-w-2xl">
      {/* Header */}
      <div className="mb-6 animate-fade-up">
        <h1 className="text-2xl font-semibold tracking-tight mb-1"
          style={{ fontFamily: "'Syne', sans-serif", color: "var(--text-primary)" }}>
          Add New Lead
        </h1>
        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
          Capture a new student enquiry into the pipeline.
        </p>
      </div>

      {/* Mode toggle */}
      <div className="flex gap-2 mb-6 animate-fade-up delay-50">
        {(["manual", "csv"] as Mode[]).map(m => (
          <button key={m} onClick={() => setMode(m)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all"
            style={{
              background: mode === m ? "var(--accent)" : "var(--surface)",
              color: mode === m ? "#fff" : "var(--text-secondary)",
              border: `1px solid ${mode === m ? "var(--accent)" : "var(--border-strong)"}`,
            }}>
            {m === "manual"
              ? <><UserPlus size={14} /> Add Manually</>
              : <><Upload size={14} /> Import CSV</>}
          </button>
        ))}
      </div>

      {/* Manual form */}
      {mode === "manual" && (
        <form onSubmit={handleSubmit} className="card p-6 flex flex-col gap-5 animate-fade-up delay-100">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide flex items-center gap-1.5"
                style={{ color: "#374151" }}>
                <UserPlus size={11} /> Full Name *
              </label>
              <input className="input" name="name" placeholder="Rahul Sharma"
                value={form.name} onChange={handleChange} required />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide flex items-center gap-1.5"
                style={{ color: "#374151" }}>
                <Phone size={11} /> Phone *
              </label>
              <input className="input" name="phone" placeholder="+91 98000 00000"
                value={form.phone} onChange={handleChange} required />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide flex items-center gap-1.5"
              style={{ color: "#374151" }}>
              <Mail size={11} /> Email
            </label>
            <input className="input" name="email" type="email" placeholder="name@email.com"
              value={form.email} onChange={handleChange} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide flex items-center gap-1.5"
                style={{ color: "#374151" }}>
                <Megaphone size={11} /> Lead Source *
              </label>
              <div className="relative">
                <select className="input pr-8" name="source" value={form.source}
                  onChange={handleChange} required style={{ appearance: "none" }}>
                  <option value="">Select source…</option>
                  {sources.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
                  style={{ color: "#374151" }} />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide flex items-center gap-1.5"
                style={{ color: "#374151" }}>
                <BookOpen size={11} /> Course Interest *
              </label>
              <div className="relative">
                <select className="input pr-8" name="service" value={form.service}
                  onChange={handleChange} required style={{ appearance: "none" }}>
                  <option value="">Select course…</option>
                  {services.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
                  style={{ color: "#374151" }} />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide flex items-center gap-1.5"
              style={{ color: "#374151" }}>
              <MapPin size={11} /> City
            </label>
            <input className="input" name="city" placeholder="Delhi"
              value={form.city} onChange={handleChange} />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide flex items-center gap-1.5"
              style={{ color: "#374151" }}>
              <StickyNote size={11} /> Notes
            </label>
            <textarea className="input resize-none" name="notes" rows={3}
              placeholder="Attempt number, medium preference, exam target…"
              value={form.notes} onChange={handleChange} style={{ height: "auto" }} />
          </div>

          <div className="flex items-center gap-3 pt-2" style={{ borderTop: "1px solid var(--border)" }}>
            <button type="submit" className="btn-primary">
              <UserPlus size={15} />
              Save Lead
            </button>
            <button type="button" className="btn-secondary" onClick={() => router.back()}>
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* CSV Import */}
      {mode === "csv" && (
        <div className="animate-fade-up delay-100 flex flex-col gap-4">
          {/* Upload zone */}
          <div className="card p-6">
            <div
              onClick={() => fileRef.current?.click()}
              className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors"
              style={{ borderColor: "var(--border-strong)" }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = "var(--accent)"}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = "var(--border-strong)"}>
              <Upload size={28} style={{ color: "#374151", margin: "0 auto 12px" }} />
              <p className="text-sm font-medium mb-1" style={{ color: "var(--text-primary)" }}>
                {csvFile ? csvFile : "Click to upload a CSV file"}
              </p>
              <p className="text-xs" style={{ color: "#374151" }}>
                Required columns: name, phone — Optional: email, source, course, city, notes
              </p>
              <input ref={fileRef} type="file" accept=".csv" className="hidden" onChange={handleFile} />
            </div>

            {csvError && (
              <div className="flex items-center gap-2 mt-3 text-sm" style={{ color: "var(--error)" }}>
                <AlertCircle size={14} /> {csvError}
              </div>
            )}

            {/* Template hint */}
            <div className="mt-4 rounded-xl p-3" style={{ background: "var(--surface-2)" }}>
              <p className="text-xs font-semibold mb-1" style={{ color: "#374151" }}>
                Expected CSV format:
              </p>
              <code className="text-xs" style={{ color: "var(--text-secondary)", fontFamily: "'JetBrains Mono', monospace" }}>
                name,phone,email,source,course,city,notes
              </code>
            </div>
          </div>

          {/* Preview table */}
          {csvRows.length > 0 && (
            <div className="card overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3"
                style={{ borderBottom: "1px solid var(--border)", background: "var(--surface-2)" }}>
                <div className="flex items-center gap-2">
                  <FileText size={15} style={{ color: "#374151" }} />
                  <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                    Preview — {csvRows.length} rows
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <span style={{ color: "#059669" }}>{validCount} valid</span>
                  {csvRows.length - validCount > 0 &&
                    <span style={{ color: "#DC2626" }}>{csvRows.length - validCount} errors</span>}
                </div>
              </div>
              <div style={{ maxHeight: 280, overflowY: "auto" }}>
                <table className="w-full text-xs">
                  <thead>
                    <tr style={{ background: "var(--surface-2)" }}>
                      {["Name", "Phone", "Email", "Course", "City", "Status"].map(h => (
                        <th key={h} className="px-3 py-2 text-left font-semibold uppercase tracking-wide"
                          style={{ color: "#374151" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {csvRows.map((row, i) => (
                      <tr key={i} style={{
                        borderTop: "1px solid var(--border)",
                        background: row._valid ? undefined : "#FEF2F220",
                      }}>
                        <td className="px-3 py-2" style={{ color: "var(--text-primary)" }}>{row.name || "—"}</td>
                        <td className="px-3 py-2" style={{ color: "var(--text-secondary)", fontFamily: "monospace" }}>{row.phone || "—"}</td>
                        <td className="px-3 py-2" style={{ color: "#374151" }}>{row.email || "—"}</td>
                        <td className="px-3 py-2" style={{ color: "var(--text-secondary)" }}>{row.service || "—"}</td>
                        <td className="px-3 py-2" style={{ color: "#374151" }}>{row.city || "—"}</td>
                        <td className="px-3 py-2">
                          {row._valid
                            ? <span style={{ color: "#059669" }} className="flex items-center gap-1">
                                <CheckCircle2 size={12} /> Valid
                              </span>
                            : <span style={{ color: "#DC2626" }} className="flex items-center gap-1">
                                <X size={12} /> {row._error}
                              </span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="px-4 py-3 flex items-center gap-3" style={{ borderTop: "1px solid var(--border)" }}>
                <button onClick={handleCsvSubmit} disabled={!validCount} className="btn-primary">
                  <Upload size={14} />
                  Import {validCount} Lead{validCount !== 1 ? "s" : ""}
                </button>
                <button onClick={() => { setCsvRows([]); setCsvFile(null); }} className="btn-secondary">
                  <X size={14} /> Clear
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}