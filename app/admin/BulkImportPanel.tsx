"use client";

import React, { useState } from "react";
import { Download, Upload, Loader, CheckCircle, AlertTriangle } from "lucide-react";

interface SkippedRow {
  sheet: string;
  row: number;
  reason: string;
}

interface ImportResult {
  created: number;
  skipped: SkippedRow[];
}

export default function BulkImportPanel({ onImported }: { onImported: () => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);

  const handleImport = async () => {
    if (!file) return;
    setIsImporting(true);
    setResult(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/admin/products/import", { method: "POST", body: formData });
      const data = await res.json();
      if (data.success) {
        setResult({ created: data.created, skipped: data.skipped });
        setFile(null);
        onImported();
      } else {
        alert("Import failed: " + data.error);
      }
    } catch (err) {
      alert("Error: " + (err instanceof Error ? err.message : String(err)));
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="bg-slate-50/50 border border-teal-deep/5 rounded-2xl p-5 space-y-3">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h4 className="text-xs font-bold text-teal-deep">Bulk Import</h4>
          <p className="text-[12px] text-teal-deep/50">Download the store-by-store template, fill it in, and upload it back to create products in one go.</p>
        </div>
        <div className="flex items-center space-x-2">
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- downloads a generated file from an API route, not a page to client-navigate to */}
          <a
            href="/api/admin/products/import/template"
            className="flex items-center space-x-1.5 text-[12px] font-bold px-3 py-2 rounded-full border border-teal-deep/15 text-teal-deep hover:bg-teal-deep/5"
          >
            <Download className="w-3.5 h-3.5" /><span>Download Template</span>
          </a>
          <label className="flex items-center space-x-1.5 text-[12px] font-bold px-3 py-2 rounded-full border border-teal-deep/15 text-teal-deep hover:bg-teal-deep/5 cursor-pointer">
            <input type="file" accept=".xlsx" className="hidden" onChange={(e) => { setFile(e.target.files?.[0] || null); setResult(null); }} />
            <span>{file ? file.name : "Choose File"}</span>
          </label>
          <button
            onClick={handleImport}
            disabled={!file || isImporting}
            className="flex items-center space-x-1.5 text-[12px] font-bold px-4 py-2 rounded-full bg-teal-deep text-white hover:bg-teal-deep/90 disabled:opacity-40 transition-colors"
          >
            {isImporting ? <Loader className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
            <span>Import</span>
          </button>
        </div>
      </div>

      {result && (
        <div className="space-y-2 pt-2 border-t border-teal-deep/5">
          <div className="flex items-center space-x-1.5 text-xs font-bold text-emerald-600">
            <CheckCircle className="w-4 h-4" />
            <span>{result.created} product{result.created !== 1 ? "s" : ""} created</span>
          </div>
          {result.skipped.length > 0 && (
            <div className="space-y-1">
              <div className="flex items-center space-x-1.5 text-xs font-bold text-amber-600">
                <AlertTriangle className="w-4 h-4" />
                <span>{result.skipped.length} row{result.skipped.length !== 1 ? "s" : ""} skipped</span>
              </div>
              <ul className="text-[12px] text-teal-deep/60 space-y-0.5 max-h-32 overflow-y-auto">
                {result.skipped.map((s, i) => (
                  <li key={i}>{s.sheet} · row {s.row} — {s.reason}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
