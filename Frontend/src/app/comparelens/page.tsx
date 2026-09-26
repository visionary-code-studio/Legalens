"use client";

import { useState } from "react";
import DashboardTopNav from "@/components/DashboardTopNav";
import {
  GitCompare,
  Download,
  FileText,
  ArrowRightLeft,
  Sparkles,
  Loader2
} from "lucide-react";

interface CompareItem {
  id: number;
  clause: string;
  docA: string;
  docB: string;
  change: "Modified" | "Added" | "Removed";
  impact?: string;
}

export default function CompareLensPage() {
  const [filter, setFilter] = useState<"All" | "Modified" | "Added" | "Removed">("All");
  const [loading, setLoading] = useState<boolean>(false);
  const [diffItems, setDiffItems] = useState<CompareItem[]>([
    {
      id: 1,
      clause: "1. Termination & Notice",
      docA: "30 days prior notice",
      docB: "90 days prior written notice",
      change: "Modified",
      impact: "Notice duration increased threefold."
    },
    {
      id: 2,
      clause: "2. Post-Employment Non-Compete",
      docA: "6 months within city limits",
      docB: "12 months Pan-India",
      change: "Modified",
      impact: "Expanded geography nationwide and doubled period."
    },
    {
      id: 3,
      clause: "3. Remote Working Allowance",
      docA: "Not Mentioned",
      docB: "2 days per week remote allowed",
      change: "Added",
      impact: "Explicitly guarantees hybrid work option."
    },
    {
      id: 4,
      clause: "4. Relocation Expense Reimbursement",
      docA: "Up to ₹50,000 reimbursement",
      docB: "Struck Out",
      change: "Removed",
      impact: "Relocation allowance completely taken away."
    }
  ]);

  const handleCompare = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/api/comparelens/compare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          doc_a_id: "Contract_v1.pdf",
          doc_b_id: "Contract_v2.pdf"
        })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.changes && data.changes.length > 0) {
          const mapped: CompareItem[] = data.changes.map((c: any, idx: number) => ({
            id: idx + 1,
            clause: c.clause_or_section || `Clause ${idx + 1}`,
            docA: c.document_a_value || "None",
            docB: c.document_b_value || "None",
            change: (c.change_type as any) || "Modified",
            impact: c.impact_summary
          }));
          setDiffItems(mapped);
        }
      }
    } catch {
      // Offline fallback
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
    const docAName = "Contract_v1.pdf";
    const docBName = "Contract_v2.pdf";
    try {
      const res = await fetch("http://localhost:8000/api/comparelens/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          doc_a_name: docAName,
          doc_b_name: docBName,
          comparisons: diffItems,
        }),
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
                See what changed. Compare two documents and find differences instantly.
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
              <span>Live AI Redline</span>
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

        {/* Top Document Comparison Selectors */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 bg-white p-6 rounded-3xl border border-neutral-200/90 shadow-xs">
          {/* Document A */}
          <div className="flex-1 w-full flex items-center gap-3 p-4 rounded-2xl bg-neutral-50 border border-neutral-200/80">
            <div className="w-9 h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">
                Document A (Baseline)
              </div>
              <div className="text-sm font-bold text-neutral-900">Contract_v1.pdf</div>
              <div className="text-xs text-neutral-500">Initial Offer Draft</div>
            </div>
          </div>

          {/* Swap Indicator */}
          <div className="w-10 h-10 rounded-full bg-neutral-100 border border-neutral-300 flex items-center justify-center text-neutral-700 shadow-2xs shrink-0">
            <ArrowRightLeft className="w-4 h-4" />
          </div>

          {/* Document B */}
          <div className="flex-1 w-full flex items-center gap-3 p-4 rounded-2xl bg-neutral-50 border border-neutral-200/80">
            <div className="w-9 h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">
                Document B (Revised)
              </div>
              <div className="text-sm font-bold text-neutral-900">Contract_v2.pdf</div>
              <div className="text-xs text-neutral-500">Counterparty Revision</div>
            </div>
          </div>
        </div>

        {/* Filter Badges Row */}
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

        {/* Comparison Diff Table */}
        <div className="bg-white rounded-3xl border border-neutral-200/90 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-500 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-6">Clause / Section</th>
                  <th className="py-3.5 px-6">Document A (Baseline)</th>
                  <th className="py-3.5 px-6">Document B (Revised)</th>
                  <th className="py-3.5 px-6">Change Type</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 text-neutral-800">
                {filteredItems.map((row) => (
                  <tr key={row.id} className="hover:bg-neutral-50/60 transition-colors">
                    <td className="py-4 px-6 font-semibold text-neutral-900">
                      <div>{row.clause}</div>
                      {row.impact && <div className="text-[11px] font-normal text-neutral-500 mt-0.5">{row.impact}</div>}
                    </td>
                    <td className="py-4 px-6 text-neutral-600 font-medium">{row.docA}</td>
                    <td className="py-4 px-6 text-neutral-900 font-medium">{row.docB}</td>
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
