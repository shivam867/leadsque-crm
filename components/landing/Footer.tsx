"use client";

import {
  Activity,
  Lock,
  ShieldCheck,
} from "lucide-react";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-gray-100" style={{ background: "#F8F7F4" }}>
      <div className="max-w-6xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 flex-shrink-0"
        >
          <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center shadow-sm">
            <Activity
              size={13}
              color="white"
              strokeWidth={2.5}
            />
          </div>

          <span className="font-bold text-sm text-gray-900 tracking-tight">
            LeadFlow
          </span>
        </Link>

        <div className="flex items-center gap-4 text-xs text-gray-400 flex-wrap justify-center">
          <span className="flex items-center gap-1.5">
            <Lock size={11} className="text-gray-400" />
            Secure role-based access
          </span>

          <span className="text-gray-300">·</span>

          <span className="flex items-center gap-1.5">
            <ShieldCheck size={11} className="text-gray-400" />
            All data encrypted in transit
          </span>
        </div>

        <p className="text-xs text-gray-400">
          © {new Date().getFullYear()} LeadFlow
        </p>
      </div>
    </footer>
  );
}