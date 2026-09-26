"use client";

import { useState } from "react";
import DashboardTopNav from "@/components/DashboardTopNav";
import {
  Download,
  Share2,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Maximize2,
  FileText,
  X,
  Info,
  CheckCircle2,
  BookOpen,
  Sparkles,
  Loader2
} from "lucide-react";

export default function LexiLensPage() {
  const [activeTab, setActiveTab] = useState<"simple" | "terms" | "summary">("simple");
  const [page, setPage] = useState<number>(3);
  const [isExplaining, setIsExplaining] = useState<boolean>(false);
  const [clauseText, setClauseText] = useState<string>(
    "The Employee shall not, during the term of this Agreement or thereafter, disclose, use, or exploit any confidential information of the Company without prior written consent."
  );

  const [explanation, setExplanation] = useState<{
    plain_explanation: string;
    key_points: string[];
    important_terms: string[];
    parties_affected: string[];
  }>({
    plain_explanation:
      "You must not share, use, or take advantage of the company's confidential information during or after your employment, unless you have written permission.",
    key_points: [
      "You cannot disclose company information.",
      "This applies even after you leave the company.",
      "You must get written permission if you want to share."
    ],
    important_terms: [
      "Confidential Information (Proprietary data, trade secrets)",
      "Prior Written Consent (Formal approval required)",
      "Survives Termination (Applies perpetually post-employment)"
    ],
    parties_affected: ["Employee", "Company"]
  });

  const handleExplain = async () => {
    if (!clauseText.trim()) return;
    setIsExplaining(true);
    try {
      const res = await fetch("http://localhost:8000/api/lexilens/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: clauseText })
      });
      if (res.ok) {
        const data = await res.json();
        setExplanation({
          plain_explanation: data.plain_explanation || explanation.plain_explanation,
          key_points: data.key_points || explanation.key_points,
          important_terms: data.important_terms || explanation.important_terms,
          parties_affected: data.parties_affected || explanation.parties_affected
        });
      }
    } catch {
      // Graceful offline fallback
    } finally {
      setIsExplaining(false);
    }
  };

  const handleDownloadExplanation = () => {
    const docName = "Senior_Software_Engineer_Employment_Agreement.pdf";
    const lines = [
      "# LEGALENS — LEXILENS SIMPLIFIED EXPLANATION",
      `**Document:** ${docName}`,
      `**Original Clause:**`,
      `> ${clauseText}`,
      "",
      "---",
      "## Plain English Summary",
      explanation.plain_explanation,
      "",
      "## Key Takeaways",
      ...explanation.key_points.map((p) => `- ${p}`),
      "",
      "## Important Legal Terms Defined",
      ...explanation.important_terms.map((t) => `- **${t}**`),
      "",
      "## Parties Affected",
      ...explanation.parties_affected.map((p) => `- ${p}`),
      "",
      "---",
      "*Disclaimer: This is an AI-generated explanation, not professional legal advice.*"
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/markdown;charset=utf-8" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `LexiLens_Explanation_${docName.replace(/\s+/g, "_")}.md`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col">
      <DashboardTopNav showBack />

      <main className="flex-1 max-w-7xl w-full mx-auto p-6 lg:p-8 space-y-6">
        {/* Module Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-black text-white flex items-center justify-center shadow-xs">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-neutral-900 tracking-tight">LexiLens</h1>
              <p className="text-xs text-neutral-500">
                Turn complex legal language into clear and simple explanations.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDownloadExplanation}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-neutral-200 bg-white text-xs font-semibold text-neutral-700 hover:border-black transition-colors shadow-2xs cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download</span>
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-neutral-200 bg-white text-xs font-semibold text-neutral-700 hover:border-black transition-colors shadow-2xs cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share</span>
            </button>
          </div>
        </div>

        {/* 2-Column Split Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Document Viewer (col-span-7) */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-neutral-200/90 p-5 shadow-xs space-y-4">
            {/* Document Header Chip */}
            <div className="flex items-center justify-between bg-neutral-50 p-2.5 rounded-2xl border border-neutral-200/70">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-neutral-900 block leading-tight">
                    Employment_Agreement.pdf
                  </span>
                  <span className="text-[11px] text-neutral-500">12 pages • Live Interactive Parser</span>
                </div>
              </div>
              <button
                type="button"
                aria-label="Close document"
                className="w-6 h-6 rounded-full hover:bg-neutral-200 flex items-center justify-center text-neutral-500 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Document Toolbar */}
            <div className="flex items-center justify-between px-3 py-1.5 bg-neutral-100/70 rounded-xl text-xs text-neutral-600">
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  aria-label="Previous page"
                  onClick={() => setPage(Math.max(1, page - 1))}
                  className="p-1 rounded hover:bg-white text-neutral-700 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="font-medium px-2">Page {page} of 12</span>
                <button
                  type="button"
                  aria-label="Next page"
                  onClick={() => setPage(Math.min(12, page + 1))}
                  className="p-1 rounded hover:bg-white text-neutral-700 cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button type="button" aria-label="Zoom out" className="p-1 rounded hover:bg-white"><ZoomOut className="w-3.5 h-3.5" /></button>
                <button type="button" aria-label="Zoom in" className="p-1 rounded hover:bg-white"><ZoomIn className="w-3.5 h-3.5" /></button>
                <button type="button" aria-label="Rotate" className="p-1 rounded hover:bg-white"><RotateCw className="w-3.5 h-3.5" /></button>
                <button type="button" aria-label="Fullscreen" className="p-1 rounded hover:bg-white"><Maximize2 className="w-3.5 h-3.5" /></button>
              </div>
            </div>

            {/* Editable Clause Textarea with Live AI Trigger */}
            <div className="p-5 rounded-2xl bg-[#fcfcfc] border border-neutral-200/80 space-y-3 font-serif text-sm leading-relaxed text-neutral-800">
              <div className="flex items-center justify-between">
                <span className="text-xs font-sans font-bold text-neutral-700">Selected Legal Clause:</span>
                <span className="text-[11px] font-sans px-2 py-0.5 rounded bg-neutral-200 text-neutral-700">Clause 8</span>
              </div>
              <textarea
                value={clauseText}
                onChange={(e) => setClauseText(e.target.value)}
                rows={4}
                className="w-full text-xs font-serif p-3 rounded-xl border border-neutral-300 bg-white focus:outline-none focus:ring-1 focus:ring-black leading-relaxed"
                placeholder="Paste or type any legal clause to explain in plain language..."
              />
              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] font-sans text-neutral-400">Click below to generate live Gemini analysis</span>
                <button
                  type="button"
                  onClick={handleExplain}
                  disabled={isExplaining}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-black text-white text-xs font-semibold hover:bg-neutral-800 transition-colors shadow-xs cursor-pointer"
                >
                  {isExplaining ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Simplifying...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Explain in Plain Words</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: AI Explanations Panel (col-span-5) */}
          <div className="lg:col-span-5 bg-white rounded-3xl border border-neutral-200/90 p-6 shadow-xs flex flex-col justify-between space-y-6">
            <div className="space-y-5">
              {/* Segmented Control Tabs */}
              <div className="flex items-center gap-1.5 p-1 bg-neutral-100 rounded-2xl text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setActiveTab("simple")}
                  className={`flex-1 py-2 rounded-xl transition-all text-center cursor-pointer ${
                    activeTab === "simple"
                      ? "bg-black text-white shadow-xs"
                      : "text-neutral-600 hover:text-black"
                  }`}
                >
                  Simple Explanation
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("terms")}
                  className={`flex-1 py-2 rounded-xl transition-all text-center cursor-pointer ${
                    activeTab === "terms"
                      ? "bg-black text-white shadow-xs"
                      : "text-neutral-600 hover:text-black"
                  }`}
                >
                  Key Terms
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("summary")}
                  className={`flex-1 py-2 rounded-xl transition-all text-center cursor-pointer ${
                    activeTab === "summary"
                      ? "bg-black text-white shadow-xs"
                      : "text-neutral-600 hover:text-black"
                  }`}
                >
                  Parties & Scope
                </button>
              </div>

              {activeTab === "simple" && (
                <>
                  {/* In Simple Words Card */}
                  <div className="p-5 rounded-2xl bg-neutral-50/80 border border-neutral-200/90 space-y-2.5 relative overflow-hidden">
                    <div className="w-1.5 h-full bg-emerald-500 absolute left-0 top-0" />
                    <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wider flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      In Simple Words
                    </h3>
                    <p className="text-sm text-neutral-700 leading-relaxed font-normal pl-1">
                      {explanation.plain_explanation}
                    </p>
                  </div>

                  {/* Key Points Card */}
                  <div className="p-5 rounded-2xl bg-neutral-50/80 border border-neutral-200/90 space-y-3">
                    <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
                      Key Points
                    </h3>
                    <ul className="space-y-2 text-xs text-neutral-700 leading-relaxed">
                      {explanation.key_points.map((point, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-black mt-1.5 shrink-0" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              )}

              {activeTab === "terms" && (
                <div className="p-5 rounded-2xl bg-neutral-50/80 border border-neutral-200/90 space-y-3">
                  <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
                    Defined Terms in this Clause
                  </h3>
                  <div className="space-y-2.5">
                    {explanation.important_terms.map((term, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-white border border-neutral-200 text-xs">
                        <span className="font-semibold text-neutral-900">{term}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "summary" && (
                <div className="p-5 rounded-2xl bg-neutral-50/80 border border-neutral-200/90 space-y-3">
                  <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
                    Affected Parties & Scope
                  </h3>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {explanation.parties_affected.map((party, idx) => (
                      <span key={idx} className="px-3 py-1.5 rounded-xl bg-white border border-neutral-300 text-xs font-medium text-neutral-800">
                        {party}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Disclaimer Footer */}
            <div className="pt-4 border-t border-neutral-100 flex items-center gap-2 text-[11px] text-neutral-500">
              <Info className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
              <span>This is an AI-generated explanation, not legal advice.</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
