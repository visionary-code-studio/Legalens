"use client";

import { useState, useEffect } from "react";
import DashboardTopNav from "@/components/DashboardTopNav";
import { resilientFetch } from "@/lib/api";
import {
  ListTodo,
  Check,
  Calendar,
  HelpCircle,
  Download,
  Info,
  Loader2
} from "lucide-react";

export default function ActionLensPage() {
  const [activeTab, setActiveTab] = useState<"checklist" | "dates" | "lawyer">("checklist");
  const [docName] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("legalens_active_doc_name") || "Employment_Agreement.pdf";
    }
    return "Employment_Agreement.pdf";
  });

  const [checklist, setChecklist] = useState([
    { id: 1, text: "Negotiate 90-day notice period down to 30 or 45 days standard", completed: true },
    { id: 2, text: "Confirm exact severance provisions and payout timeline upon termination", completed: true },
    { id: 3, text: "Request written carve-out for personal open source code projects", completed: false },
    { id: 4, text: "Verify governing law jurisdiction and dispute arbitration venue in Bengaluru", completed: true },
    { id: 5, text: "Consult with a certified advocate regarding Section 27 non-compete enforceability", completed: false },
    { id: 6, text: "Archive digital audit certificate and signed counterpart securely", completed: true }
  ]);

  const [keyDates, setKeyDates] = useState([
    { event: "Written Resignation Notice Window", timeline: "90 Days Prior to Departure", section: "Clause 12" },
    { event: "Monthly Expense Reimbursement Submission", timeline: "25th of Every Month", section: "Clause 4" },
    { event: "Probation Performance Review Milestone", timeline: "90 Days from Joining", section: "Clause 3" },
    { event: "Post-Employment Non-Compete Expiry", timeline: "12 Months Post-Separation", section: "Clause 14" }
  ]);

  const [questionsForLawyer, setQuestionsForLawyer] = useState([
    {
      q: "Is the 90-day mandatory notice period enforceable under local labor laws?",
      context: "Clause 12 specifies 90 days, while standard market practice is 30 days."
    },
    {
      q: "Does the post-employment non-compete clause violate Section 27 of the Indian Contract Act?",
      context: "Agreements in restraint of trade are generally void in India under Section 27."
    },
    {
      q: "Does the dispute resolution clause mandate arbitration in Bengaluru, and who bears initial arbitration costs?",
      context: "Clause 19 designates Bengaluru courts and single-member arbitration tribunal."
    }
  ]);

  useEffect(() => {
    resilientFetch(`/api/actionlens/plan?document_name=${encodeURIComponent(docName)}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) {
          if (data.checklist && data.checklist.length > 0) {
            setChecklist(
              data.checklist.map((c: any, idx: number) => ({
                id: c.id || idx + 1,
                text: c.task,
                completed: c.completed ?? false
              }))
            );
          }
          if (data.key_dates && data.key_dates.length > 0) {
            setKeyDates(
              data.key_dates.map((d: any) => ({
                event: d.event,
                timeline: d.date_or_timeframe,
                section: d.clause_reference
              }))
            );
          }
          if (data.lawyer_questions && data.lawyer_questions.length > 0) {
            setQuestionsForLawyer(
              data.lawyer_questions.map((q: any) => ({
                q: q.question,
                context: q.context
              }))
            );
          }
        }
      })
      .catch(() => {
        // Fallback gracefully kept
      });
  }, [docName]);

  const toggleCheck = (id: number) => {
    setChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item))
    );
  };

  const [exporting, setExporting] = useState<boolean>(false);

  const handleExportActionPlan = async () => {
    setExporting(true);
    try {
      const res = await resilientFetch("/api/actionlens/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          document_name: docName,
          checklist: checklist.map((c) => `${c.text} [${c.completed ? "COMPLETED" : "PENDING"}]`),
          deadlines: keyDates,
          lawyer_questions: questionsForLawyer.map((q) => `${q.q} (${q.context})`),
        }),
      });
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `Legalens_Action_Plan_${docName.replace(/\s+/g, "_")}.md`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
        return;
      }
    } catch {
      // Offline fallback
      const lines = [
        `# LEGALENS — ACTION PLAN`,
        `**Document:** ${docName}`,
        `**Date:** ${new Date().toLocaleDateString()}`,
        ``,
        `## 1. PRE-SIGNING CHECKLIST`,
        ...checklist.map((c) => `- [${c.completed ? "x" : " "}] ${c.text}`),
        ``,
        `## 2. KEY DEADLINES`,
        ...keyDates.map((d) => `- **${d.event}** (${d.timeline}): ${d.section}`),
        ``,
        `## 3. QUESTIONS FOR LAWYER`,
        ...questionsForLawyer.map((q, idx) => `${idx + 1}. ${q.q} - ${q.context}`)
      ];
      const blob = new Blob([lines.join("\n")], { type: "text/markdown;charset=utf-8" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Legalens_Action_Plan.md`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col justify-between">
      <div>
        <DashboardTopNav showBack />

        <main className="max-w-4xl w-full mx-auto p-6 lg:p-8 space-y-6">
          {/* Module Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-black text-white flex items-center justify-center shadow-xs">
                <ListTodo className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold text-neutral-900 tracking-tight">ActionLens</h1>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-neutral-200 text-neutral-800">
                    {docName}
                  </span>
                </div>
                <p className="text-xs text-neutral-500">
                  Know what to do next. Get actionable insights and next steps.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleExportActionPlan}
              disabled={exporting}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-neutral-200 text-xs font-semibold text-neutral-800 hover:border-black transition-colors shadow-2xs self-start sm:self-auto cursor-pointer"
            >
              {exporting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
              <span>Export Action Plan</span>
            </button>
          </div>

          {/* Action Tabs Header */}
          <div className="flex items-center gap-2 p-1 bg-neutral-100/80 rounded-2xl max-w-md text-xs font-semibold">
            <button
              type="button"
              onClick={() => setActiveTab("checklist")}
              className={`flex-1 py-2 rounded-xl transition-all text-center cursor-pointer ${
                activeTab === "checklist"
                  ? "bg-black text-white shadow-xs"
                  : "text-neutral-600 hover:text-black"
              }`}
            >
              Checklist
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("dates")}
              className={`flex-1 py-2 rounded-xl transition-all text-center cursor-pointer ${
                activeTab === "dates"
                  ? "bg-black text-white shadow-xs"
                  : "text-neutral-600 hover:text-black"
              }`}
            >
              Key Dates
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("lawyer")}
              className={`flex-1 py-2 rounded-xl transition-all text-center cursor-pointer ${
                activeTab === "lawyer"
                  ? "bg-black text-white shadow-xs"
                  : "text-neutral-600 hover:text-black"
              }`}
            >
              Questions for Counsel
            </button>
          </div>

          {/* Tab 1: Checklist Content */}
          {activeTab === "checklist" && (
            <div className="bg-white rounded-3xl border border-neutral-200/90 p-6 shadow-xs space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
                  Contract Execution Checklist ({checklist.filter((c) => c.completed).length}/{checklist.length} Completed)
                </h3>
              </div>

              <div className="space-y-2.5">
                {checklist.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => toggleCheck(item.id)}
                    className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-neutral-50/80 border border-neutral-200/70 hover:bg-neutral-100/60 transition-colors cursor-pointer"
                  >
                    <div
                      className={`w-5 h-5 rounded-lg flex items-center justify-center transition-colors ${
                        item.completed
                          ? "bg-black text-white"
                          : "border border-neutral-400 bg-white"
                      }`}
                    >
                      {item.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                    <span
                      className={`text-xs select-none ${
                        item.completed
                          ? "text-neutral-400 line-through font-normal"
                          : "text-neutral-800 font-medium"
                      }`}
                    >
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 2: Key Dates */}
          {activeTab === "dates" && (
            <div className="bg-white rounded-3xl border border-neutral-200/90 p-6 shadow-xs space-y-3">
              <div className="flex items-center gap-2 pb-3 border-b border-neutral-100">
                <Calendar className="w-4 h-4 text-neutral-600" />
                <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
                  Important Contractual Timelines
                </h3>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {keyDates.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-neutral-50/80 border border-neutral-200/70 flex items-center justify-between"
                  >
                    <div>
                      <div className="text-xs font-bold text-neutral-900">{item.event}</div>
                      <div className="text-[11px] text-neutral-500 mt-0.5">{item.section}</div>
                    </div>
                    <span className="text-xs font-semibold px-3 py-1 rounded-full bg-neutral-200 text-neutral-800">
                      {item.timeline}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 3: Questions for Lawyer */}
          {activeTab === "lawyer" && (
            <div className="bg-white rounded-3xl border border-neutral-200/90 p-6 shadow-xs space-y-3">
              <div className="flex items-center gap-2 pb-3 border-b border-neutral-100">
                <HelpCircle className="w-4 h-4 text-neutral-600" />
                <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
                  Questions to Discuss with Your Legal Counsel
                </h3>
              </div>

              <div className="space-y-3">
                {questionsForLawyer.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-neutral-50/80 border border-neutral-200/70 space-y-1.5"
                  >
                    <div className="text-xs font-bold text-neutral-900 flex items-start gap-2">
                      <span className="w-4 h-4 rounded-full bg-black text-white text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{item.q}</span>
                    </div>
                    <p className="text-[11px] text-neutral-500 pl-6 leading-relaxed">
                      {item.context}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bottom Download Button matching Mockup */}
          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={handleExportActionPlan}
              disabled={exporting}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-black text-white text-xs font-semibold hover:bg-neutral-800 transition-all shadow-md cursor-pointer"
            >
              {exporting ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Download className="w-3.5 h-3.5" />
              )}
              <span>Download Action Plan</span>
            </button>
          </div>
        </main>
      </div>

      {/* Legal Disclaimer Footer */}
      <div className="max-w-4xl w-full mx-auto p-6">
        <div className="p-4 rounded-2xl bg-neutral-100/70 border border-neutral-200 text-xs text-neutral-500 flex items-center gap-2">
          <Info className="w-4 h-4 text-neutral-400 shrink-0" />
          <span>
            ActionLens provides preparatory guidance only and does not substitute for qualified legal representation.
          </span>
        </div>
      </div>
    </div>
  );
}
