"use client";

import { useState, useRef } from "react";
import DashboardTopNav from "@/components/DashboardTopNav";
import { resilientFetch } from "@/lib/api";
import {
  GitCompare,
  Download,
  FileText,
  ArrowRightLeft,
  Sparkles,
  Loader2,
  UploadCloud,
  X,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

interface CompareItem {
  id: number;
  clause: string;
  docA: string;
  docB: string;
  change: "Modified" | "Added" | "Removed";
  impact?: string;
  significance?: "High" | "Medium" | "Low";
}

export default function CompareLensPage() {
  const [fileA, setFileA] = useState<File | null>(null);
  const [fileB, setFileB] = useState<File | null>(null);
  const [docAName, setDocAName] = useState<string>("Contract_v1.pdf");
  const [docBName, setDocBName] = useState<string>("Contract_v2.pdf");

  const [filter, setFilter] = useState<"All" | "Modified" | "Added" | "Removed">("All");
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  const fileInputARef = useRef<HTMLInputElement>(null);
  const fileInputBRef = useRef<HTMLInputElement>(null);

  const [diffItems, setDiffItems] = useState<CompareItem[]>([
    {
      id: 1,
      clause: "1. Termination & Notice",
      docA: "30 days prior notice",
      docB: "90 days prior written notice",
      change: "Modified",
      significance: "High",
      impact: "Notice duration increased threefold."
    },
    {
      id: 2,
      clause: "2. Post-Employment Non-Compete",
      docA: "6 months within city limits",
      docB: "12 months Pan-India",
      change: "Modified",
      significance: "High",
      impact: "Expanded geography nationwide and doubled period."
    },
    {
      id: 3,
      clause: "3. Remote Working Allowance",
      docA: "Not Mentioned",
      docB: "2 days per week remote allowed",
      change: "Added",
      significance: "Medium",
      impact: "Explicitly guarantees hybrid work option."
    },
    {
      id: 4,
      clause: "4. Relocation Expense Reimbursement",
      docA: "Up to ₹50,000 reimbursement",
      docB: "Struck Out",
      change: "Removed",
      significance: "Medium",
      impact: "Relocation allowance completely taken away."
    }
  ]);

  const handleSelectFileA = (file: File) => {
    setFileA(file);
    setDocAName(file.name);
    setErrorMessage(null);
    setSuccessNotice(`Document A loaded: ${file.name}`);
  };

  const handleSelectFileB = (file: File) => {
    setFileB(file);
    setDocBName(file.name);
    setErrorMessage(null);
    setSuccessNotice(`Document B loaded: ${file.name}`);
  };

  const handleRemoveFileA = () => {
    setFileA(null);
    setDocAName("Contract_v1.pdf");
    if (fileInputARef.current) fileInputARef.current.value = "";
  };

  const handleRemoveFileB = () => {
    setFileB(null);
    setDocBName("Contract_v2.pdf");
    if (fileInputBRef.current) fileInputBRef.current.value = "";
  };

  const handleCompare = async () => {
    setLoading(true);
    setErrorMessage(null);

    try {
      if (fileA && fileB) {
        // Upload both files for live AI redline analysis
        const formData = new FormData();
        formData.append("file_a", fileA);
        formData.append("file_b", fileB);

        const res = await resilientFetch("/api/comparelens/upload-and-compare", {
          method: "POST",
          body: formData
        });

        if (!res.ok) {
          throw new Error("Failed to compare uploaded files. Please check file formats.");
        }

        const data = await res.json();
        if (data.changes && Array.isArray(data.changes)) {
          const mapped: CompareItem[] = data.changes.map((c: any, idx: number) => ({
            id: c.id || idx + 1,
            clause: c.clause_or_section || `Clause ${idx + 1}`,
            docA: c.document_a_value || "—",
            docB: c.document_b_value || "—",
            change: (c.change_type as any) || "Modified",
            impact: c.impact_summary,
            significance: c.significance
          }));
          setDiffItems(mapped);
          setSuccessNotice(`Successfully analyzed ${mapped.length} contract variances using Gemini!`);
        }
      } else {
        // Compare sample/default IDs
        const res = await resilientFetch("/api/comparelens/compare", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            doc_a_id: "Contract_v1.pdf",
            doc_b_id: "Contract_v2.pdf"
          })
        });

        if (res.ok) {
          const data = await res.json();
          if (data.changes && Array.isArray(data.changes)) {
            const mapped: CompareItem[] = data.changes.map((c: any, idx: number) => ({
              id: c.id || idx + 1,
              clause: c.clause_or_section || `Clause ${idx + 1}`,
              docA: c.document_a_value || "—",
              docB: c.document_b_value || "—",
              change: (c.change_type as any) || "Modified",
              impact: c.impact_summary,
              significance: c.significance
            }));
            setDiffItems(mapped);
            setSuccessNotice(`Loaded baseline contract differences (${mapped.length} changes).`);
          }
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to run comparison. Ensure backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = diffItems.filter((item) => {
    if (filter === "All") return true;
    return item.change === filter;
  });

  const getChangeBadge = (change: string) => {
    switch (change) {
      case "Modified":
        return "bg-amber-50 text-amber-800 border-amber-200";
      case "Added":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "Removed":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-neutral-100 text-neutral-700 border-neutral-200";
    }
  };

  const [exporting, setExporting] = useState<boolean>(false);

  const handleExportComparison = async () => {
    setExporting(true);
    try {
      const res = await resilientFetch("/api/comparelens/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          doc_a_name: docAName,
          doc_b_name: docBName,
          comparisons: diffItems
        })
      });
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `Legalens_Comparison_${docAName.replace(/\s+/g, "_")}_vs_${docBName.replace(/\s+/g, "_")}.md`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
        return;
      }
    } catch {
      // Offline fallback
      const lines = [
        `# LEGALENS — REDLINE COMPARISON REPORT`,
        `**Comparing:** ${docAName} vs ${docBName}`,
        `**Differences Identified:** ${diffItems.length}`,
        `**Disclaimer:** AI-assisted comparison, not legal advice.`,
        ``,
        `| Clause / Section | Version A | Version B | Status |`,
        `| :--- | :--- | :--- | :--- |`
      ];
      diffItems.forEach((c) => {
        lines.push(`| ${c.clause} | ${c.docA} | ${c.docB} | **${c.change}** |`);
      });
      const blob = new Blob([lines.join("\n")], { type: "text/markdown;charset=utf-8" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Legalens_Comparison.md`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } finally {
      setExporting(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col">
      <DashboardTopNav showBack />

      <main className="flex-1 max-w-7xl w-full mx-auto p-6 lg:p-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-black text-white flex items-center justify-center shadow-xs">
              <GitCompare className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-neutral-900 tracking-tight">CompareLens</h1>
              <p className="text-xs text-neutral-500">
                Upload two contracts (old vs updated) to detect alterations, additions, and removed obligations in seconds.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCompare}
              disabled={loading}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-black text-white text-xs font-semibold hover:bg-neutral-800 transition-colors shadow-xs cursor-pointer"
            >
              {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
              <span>{fileA && fileB ? "Run AI Redline Comparison" : "Live AI Redline"}</span>
            </button>
            <button
              type="button"
              onClick={handleExportComparison}
              disabled={exporting}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-neutral-200 text-xs font-semibold text-neutral-800 hover:border-black transition-colors shadow-2xs self-start sm:self-auto cursor-pointer"
            >
              {exporting ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Download className="w-3.5 h-3.5" />
              )}
              <span>Export Comparison</span>
            </button>
          </div>
        </div>

        {/* Status Alerts */}
        {errorMessage && (
          <div className="flex items-center gap-2 p-3 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successNotice && !errorMessage && (
          <div className="flex items-center gap-2 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successNotice}</span>
          </div>
        )}

        {/* Dual Upload Zone: File A (Old) & File B (Updated) */}
        <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-center bg-white p-6 rounded-3xl border border-neutral-200/90 shadow-xs">
          {/* File A Box (5 cols) */}
          <div className="md:col-span-5 flex flex-col space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-neutral-800 uppercase tracking-wider">
                Document A — Old / Baseline Contract
              </span>
              {fileA && (
                <button
                  type="button"
                  onClick={handleRemoveFileA}
                  className="text-xs text-neutral-400 hover:text-red-600 flex items-center gap-1"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Remove</span>
                </button>
              )}
            </div>

            <input
              type="file"
              ref={fileInputARef}
              className="hidden"
              accept=".pdf,.docx,.doc,.txt,.md"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleSelectFileA(f);
              }}
            />

            {fileA ? (
              <div className="flex items-center justify-between p-4 rounded-2xl bg-neutral-50 border border-neutral-200/80">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="truncate">
                    <div className="text-xs font-bold text-neutral-900 truncate">{fileA.name}</div>
                    <div className="text-[11px] text-neutral-500">{formatFileSize(fileA.size)} • Old Baseline</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => fileInputARef.current?.click()}
                  className="px-2.5 py-1 text-xs font-medium text-neutral-700 bg-white border border-neutral-200 rounded-lg hover:border-black shrink-0 ml-2"
                >
                  Change
                </button>
              </div>
            ) : (
              <div
                onClick={() => fileInputARef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const f = e.dataTransfer.files?.[0];
                  if (f) handleSelectFileA(f);
                }}
                className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-neutral-300 hover:border-neutral-900 rounded-2xl cursor-pointer transition-colors bg-neutral-50/50 hover:bg-neutral-50"
              >
                <UploadCloud className="w-6 h-6 text-neutral-400 mb-2" />
                <span className="text-xs font-semibold text-neutral-800">Upload Old / Previous Version</span>
                <span className="text-[11px] text-neutral-400 mt-0.5">Click or drag PDF, DOCX, or TXT</span>
              </div>
            )}
          </div>

          {/* Swap Indicator (1 col) */}
          <div className="md:col-span-1 flex justify-center py-2 md:py-0">
            <div className="w-10 h-10 rounded-full bg-neutral-100 border border-neutral-300 flex items-center justify-center text-neutral-700 shadow-2xs">
              <ArrowRightLeft className="w-4 h-4" />
            </div>
          </div>

          {/* File B Box (5 cols) */}
          <div className="md:col-span-5 flex flex-col space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-neutral-800 uppercase tracking-wider">
                Document B — Revised / Updated Contract
              </span>
              {fileB && (
                <button
                  type="button"
                  onClick={handleRemoveFileB}
                  className="text-xs text-neutral-400 hover:text-red-600 flex items-center gap-1"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Remove</span>
                </button>
              )}
            </div>

            <input
              type="file"
              ref={fileInputBRef}
              className="hidden"
              accept=".pdf,.docx,.doc,.txt,.md"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleSelectFileB(f);
              }}
            />

            {fileB ? (
              <div className="flex items-center justify-between p-4 rounded-2xl bg-neutral-50 border border-neutral-200/80">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="truncate">
                    <div className="text-xs font-bold text-neutral-900 truncate">{fileB.name}</div>
                    <div className="text-[11px] text-neutral-500">{formatFileSize(fileB.size)} • New Revision</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => fileInputBRef.current?.click()}
                  className="px-2.5 py-1 text-xs font-medium text-neutral-700 bg-white border border-neutral-200 rounded-lg hover:border-black shrink-0 ml-2"
                >
                  Change
                </button>
              </div>
            ) : (
              <div
                onClick={() => fileInputBRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const f = e.dataTransfer.files?.[0];
                  if (f) handleSelectFileB(f);
                }}
                className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-neutral-300 hover:border-neutral-900 rounded-2xl cursor-pointer transition-colors bg-neutral-50/50 hover:bg-neutral-50"
              >
                <UploadCloud className="w-6 h-6 text-neutral-400 mb-2" />
                <span className="text-xs font-semibold text-neutral-800">Upload New / Updated Version</span>
                <span className="text-[11px] text-neutral-400 mt-0.5">Click or drag PDF, DOCX, or TXT</span>
              </div>
            )}
          </div>
        </div>

        {/* Filter Badges Row */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <button
              type="button"
              onClick={() => setFilter("All")}
              className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                filter === "All"
                  ? "bg-black text-white shadow-xs"
                  : "bg-white border border-neutral-200 text-neutral-700 hover:border-black"
              }`}
            >
              All Changes ({diffItems.length})
            </button>
            <button
              type="button"
              onClick={() => setFilter("Modified")}
              className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                filter === "Modified"
                  ? "bg-black text-white shadow-xs"
                  : "bg-white border border-neutral-200 text-neutral-700 hover:border-black"
              }`}
            >
              Modified ({diffItems.filter((i) => i.change === "Modified").length})
            </button>
            <button
              type="button"
              onClick={() => setFilter("Added")}
              className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                filter === "Added"
                  ? "bg-black text-white shadow-xs"
                  : "bg-white border border-neutral-200 text-neutral-700 hover:border-black"
              }`}
            >
              Added ({diffItems.filter((i) => i.change === "Added").length})
            </button>
            <button
              type="button"
              onClick={() => setFilter("Removed")}
              className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                filter === "Removed"
                  ? "bg-black text-white shadow-xs"
                  : "bg-white border border-neutral-200 text-neutral-700 hover:border-black"
              }`}
            >
              Removed ({diffItems.filter((i) => i.change === "Removed").length})
            </button>
          </div>

          <div className="text-xs text-neutral-500 font-medium">
            Comparing: <span className="font-semibold text-neutral-800">{docAName}</span> vs <span className="font-semibold text-neutral-800">{docBName}</span>
          </div>
        </div>

        {/* Comparison Diff Table */}
        <div className="bg-white rounded-3xl border border-neutral-200/90 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-500 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-6">Clause / Section</th>
                  <th className="py-3.5 px-6">Version A (Previous)</th>
                  <th className="py-3.5 px-6">Version B (Updated)</th>
                  <th className="py-3.5 px-6">Change Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 text-neutral-800">
                {filteredItems.map((row) => (
                  <tr key={row.id} className="hover:bg-neutral-50/60 transition-colors">
                    <td className="py-4 px-6 font-semibold text-neutral-900 max-w-xs">
                      <div>{row.clause}</div>
                      {row.impact && (
                        <div className="text-[11px] font-normal text-neutral-500 mt-1 leading-snug">
                          {row.impact}
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-6 text-neutral-600 font-medium leading-relaxed max-w-sm">
                      {row.docA}
                    </td>
                    <td className="py-4 px-6 text-neutral-900 font-medium leading-relaxed max-w-sm">
                      {row.docB}
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-semibold ${getChangeBadge(
                          row.change
                        )}`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-current" />
                        <span>{row.change}</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
