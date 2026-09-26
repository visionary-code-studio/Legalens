"use client";

import { useState, useEffect, useRef } from "react";
import DashboardTopNav from "@/components/DashboardTopNav";
import DocumentPreviewModal from "@/components/DocumentPreviewModal";
import { resilientFetch } from "@/lib/api";
import {
  Download,
  FileSearch,
  BookOpen,
  User,
  CheckSquare,
  AlertTriangle,
  FileText,
  ExternalLink,
  Sparkles,
  Loader2,
  UploadCloud
} from "lucide-react";

interface ClauseItem {
  id: number;
  title: string;
  risk: "High Risk" | "Medium Risk" | "Low Risk";
  meaning: string;
  who: string;
  obligations: string[];
  concerns: string[];
  section: string;
}

const DEFAULT_CLAUSES: ClauseItem[] = [
  {
    id: 1,
    title: "Confidentiality",
    risk: "Medium Risk",
    meaning: "You must keep the company's confidential information private and cannot share it without permission.",
    who: "Employee",
    obligations: [
      "Do not disclose confidential information",
      "Do not use it for personal gain",
      "Maintain confidentiality even after leaving"
    ],
    concerns: [
      "Broad definition of 'confidential information'",
      "No clear time limit specified"
    ],
    section: "Clause 8, Page 3"
  },
  {
    id: 2,
    title: "Termination",
    risk: "High Risk",
    meaning: "Outlines notice periods, grounds for immediate dismissal, and severance provisions.",
    who: "Both Parties",
    obligations: [
      "Serve a 90-day written notice period prior to resignation",
      "Hand over all company hardware and accounts immediately"
    ],
    concerns: [
      "90-day notice is unusually rigid and restricts career flexibility",
      "Employer retains right to waive notice without compensation"
    ],
    section: "Clause 12, Page 6"
  },
  {
    id: 3,
    title: "Payment Terms",
    risk: "Medium Risk",
    meaning: "Defines monthly salary disbursement schedule and reimbursable business expenses.",
    who: "Company & Employee",
    obligations: [
      "Submit expense bills by the 25th of each month",
      "Maintain valid bank account details"
    ],
    concerns: [
      "Discretionary delay clause during cashflow audits"
    ],
    section: "Clause 4, Page 2"
  },
  {
    id: 4,
    title: "Intellectual Property",
    risk: "Low Risk",
    meaning: "Standard work-for-hire assignment of all software and materials created during work hours.",
    who: "Employee",
    obligations: [
      "Assign all rights to inventions developed on company machines"
    ],
    concerns: [
      "Standard industry wording without aggressive overreach"
    ],
    section: "Clause 7, Page 3"
  },
  {
    id: 5,
    title: "Non-Compete",
    risk: "High Risk",
    meaning: "Prohibits working with any competitor in India for 12 months after leaving.",
    who: "Employee",
    obligations: [
      "Do not join a competing business within specified territories"
    ],
    concerns: [
      "May conflict with Section 27 of the Indian Contract Act (agreements in restraint of trade)",
      "Overly broad geographic scope"
    ],
    section: "Clause 14, Page 7"
  },
  {
    id: 6,
    title: "Governing Law",
    risk: "Medium Risk",
    meaning: "Specifies jurisdiction in New Delhi courts for resolving disputes.",
    who: "Both Parties",
    obligations: [
      "Submit to the exclusive jurisdiction of New Delhi courts"
    ],
    concerns: [
      "Litigation outside your resident city can incur high travel and legal expenses"
    ],
    section: "Clause 18, Page 9"
  },
  {
    id: 7,
    title: "Dispute Resolution",
    risk: "Low Risk",
    meaning: "Requires mediation before filing formal court litigation.",
    who: "Both Parties",
    obligations: [
      "Engage in 30 days of informal mediation in good faith"
    ],
    concerns: [],
    section: "Clause 19, Page 9"
  },
  {
    id: 8,
    title: "Miscellaneous",
    risk: "Low Risk",
    meaning: "Severability, waiver, and complete agreement terms.",
    who: "Both Parties",
    obligations: [
      "Written amendments only"
    ],
    concerns: [],
    section: "Clause 20, Page 10"
  }
];

export default function ClauseLensPage() {
  const [clauses, setClauses] = useState<ClauseItem[]>(DEFAULT_CLAUSES);
  const [selectedId, setSelectedId] = useState<number>(1);
  const [docName, setDocName] = useState<string>("Employment_Agreement.pdf");
  const [loading, setLoading] = useState<boolean>(false);
  const [previewOpen, setPreviewOpen] = useState<boolean>(false);
  const [downloading, setDownloading] = useState<boolean>(false);
  const [fullDocText, setFullDocText] = useState<string>("");
  const [activeDocId, setActiveDocId] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadContract = async (file: File) => {
    setLoading(true);
    setDocName(file.name);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await resilientFetch("/api/documents/upload", {
        method: "POST",
        body: formData
      });
      if (res.ok) {
        const data = await res.json();
        if (data.document) {
          setActiveDocId(data.document.document_id);
          if (data.document.full_text) setFullDocText(data.document.full_text);
          localStorage.setItem("legalens_active_doc_id", data.document.document_id);
          localStorage.setItem("legalens_active_doc_name", data.document.filename);
          if (data.document.full_text) localStorage.setItem("legalens_active_doc_text", data.document.full_text);
        }
        if (data.clauses && data.clauses.length > 0) {
          const mapped: ClauseItem[] = data.clauses.map((c: any, idx: number) => ({
            id: idx + 1,
            title: c.title || "Contract Clause",
            risk: (c.risk as any) || "Medium Risk",
            meaning: c.meaning || "Standard legal stipulation.",
            who: c.who_it_affects || "Both Parties",
            obligations: Array.isArray(c.key_obligations) ? c.key_obligations : [c.key_obligations],
            concerns: Array.isArray(c.potential_concerns) ? c.potential_concerns : [],
            section: c.section || `Clause ${idx + 1}`
          }));
          setClauses(mapped);
          setSelectedId(1);
          setLoading(false);
          return;
        }
      }
    } catch {
      // Fallback to text detection
    }

    try {
      const text = await file.text();
      setFullDocText(text);
      const form = new FormData();
      form.append("document_text", text);
      const detectRes = await resilientFetch("/api/clauselens/detect", {
        method: "POST",
        body: form
      });
      if (detectRes.ok) {
        const detectData = await detectRes.json();
        if (detectData && detectData.clauses && detectData.clauses.length > 0) {
          const mapped: ClauseItem[] = detectData.clauses.map((c: any, idx: number) => ({
            id: c.clause_id || idx + 1,
            title: c.clause_title || c.title || "Contract Clause",
            risk: (c.risk_level as any) || (c.risk as any) || "Medium Risk",
            meaning: c.meaning || "Standard legal stipulation.",
            who: c.who_it_affects || "Both Parties",
            obligations: Array.isArray(c.key_obligations) ? c.key_obligations : [c.key_obligations],
            concerns: Array.isArray(c.potential_concerns) ? c.potential_concerns : [],
            section: c.relevant_section || c.section || `Clause ${idx + 1}`
          }));
          setClauses(mapped);
          setSelectedId(1);
        }
      }
    } catch {
      // Keep state
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Check if URL parameter or localStorage has active document
    const params = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
    const docId = params?.get("doc_id") || localStorage.getItem("legalens_active_doc_id");
    const storedName = localStorage.getItem("legalens_active_doc_name");
    const storedText = localStorage.getItem("legalens_active_doc_text");
    if (storedName) setDocName(storedName);
    if (storedText) setFullDocText(storedText);
    if (docId) setActiveDocId(docId);

    if (docId) {
      setLoading(true);
      resilientFetch(`/api/documents/${docId}`)
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data) {
            if (data.full_text) setFullDocText(data.full_text);
            if (data.filename) setDocName(data.filename);
            if (data.clauses && data.clauses.length > 0) {
              const mapped: ClauseItem[] = data.clauses.map((c: any, idx: number) => ({
                id: idx + 1,
                title: c.title || "Contract Clause",
                risk: (c.risk as any) || "Medium Risk",
                meaning: c.meaning || "Standard legal stipulation.",
                who: c.who_it_affects || "Both Parties",
                obligations: Array.isArray(c.key_obligations) ? c.key_obligations : [c.key_obligations],
                concerns: Array.isArray(c.potential_concerns) ? c.potential_concerns : [],
                section: c.section || `Clause ${idx + 1}`
              }));
              setClauses(mapped);
              setSelectedId(1);
            }
          }
        })
        .catch(() => {
          // Keep default clauses if backend not accessible
        })
        .finally(() => setLoading(false));
    }
  }, []);

  const handleDownloadReport = async () => {
    setDownloading(true);
    try {
      const targetId = activeDocId || localStorage.getItem("legalens_active_doc_id");
      if (targetId) {
        const res = await resilientFetch(`/api/documents/${targetId}/export/report`);
        if (res.ok) {
          const blob = await res.blob();
          const downloadUrl = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = downloadUrl;
          a.download = `Legalens_Risk_Report_${docName.replace(/\s+/g, "_")}.md`;
          document.body.appendChild(a);
          a.click();
          a.remove();
          window.URL.revokeObjectURL(downloadUrl);
          return;
        }
      }
      // Client-side fallback report generation
      const reportLines = [
        `# LEGALENS — EXECUTIVE CONTRACT RISK REPORT`,
        `**Document Name:** ${docName}`,
        `**Analysis Date:** ${new Date().toLocaleDateString()}`,
        `**Total Clauses Analyzed:** ${clauses.length}`,
        `**Disclaimer:** This is an AI-generated explanation, not professional legal advice.`,
        ``,
        `---`,
        `## DETECTED CLAUSES & RISK ASSESSMENT`,
        ``
      ];
      clauses.forEach((c, idx) => {
        reportLines.push(`### ${idx + 1}. ${c.title} (${c.risk})`);
        reportLines.push(`- **Plain Meaning:** ${c.meaning}`);
        reportLines.push(`- **Parties Affected:** ${c.who}`);
        reportLines.push(`- **Key Obligations:**`);
        c.obligations.forEach((o) => reportLines.push(`  • ${o}`));
        if (c.concerns.length > 0) {
          reportLines.push(`- **Potential Concerns:**`);
          c.concerns.forEach((con) => reportLines.push(`  • ${con}`));
        }
        reportLines.push(`- **Reference:** ${c.section}`);
        reportLines.push(``);
      });
      const blob = new Blob([reportLines.join("\n")], { type: "text/markdown;charset=utf-8" });
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = `Legalens_Risk_Report_${docName.replace(/\s+/g, "_")}.md`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } finally {
      setDownloading(false);
    }
  };

  const currentClause = clauses.find((c) => c.id === selectedId) || clauses[0];

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case "High Risk":
        return "bg-red-50 text-red-700 border-red-200";
      case "Medium Risk":
        return "bg-amber-50 text-amber-800 border-amber-200";
      case "Low Risk":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      default:
        return "bg-neutral-100 text-neutral-700 border-neutral-200";
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col">
      <DashboardTopNav showBack />

      <main className="flex-1 max-w-7xl w-full mx-auto p-6 lg:p-8 space-y-6">
        {/* Module Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-black text-white flex items-center justify-center shadow-xs">
              <FileSearch className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-neutral-900 tracking-tight">ClauseLens</h1>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-neutral-200 text-neutral-800">
                  {docName}
                </span>
                {loading && <Loader2 className="w-3.5 h-3.5 animate-spin text-neutral-500" />}
              </div>
              <p className="text-xs text-neutral-500">
                See what matters. Instantly identify important clauses, obligations, risks and more.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept=".pdf,.docx,.doc,.txt,.md"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleUploadContract(f);
              }}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={loading}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-black text-white text-xs font-semibold hover:bg-neutral-800 transition-colors shadow-xs cursor-pointer"
            >
              <UploadCloud className="w-3.5 h-3.5" />
              <span>Upload Contract</span>
            </button>
            <button
              type="button"
              onClick={handleDownloadReport}
              disabled={downloading}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-neutral-200 text-xs font-semibold text-neutral-800 hover:border-black transition-colors shadow-2xs cursor-pointer"
            >
              {downloading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Download className="w-3.5 h-3.5" />
              )}
              <span>Download Report</span>
            </button>
          </div>
        </div>

        {/* 2-Column Split View */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Detected Clauses List (col-span-5) */}
          <div className="lg:col-span-5 bg-white rounded-3xl border border-neutral-200/90 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
              <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-neutral-700" />
                <span>Detected Clauses ({clauses.length})</span>
              </h3>
            </div>

            <div className="space-y-1.5 max-h-[540px] overflow-y-auto pr-1">
              {clauses.map((c) => {
                const isSelected = c.id === selectedId;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setSelectedId(c.id)}
                    className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-left text-xs transition-all cursor-pointer ${
                      isSelected
                        ? "bg-neutral-900 text-white shadow-xs font-semibold"
                        : "hover:bg-neutral-100/80 text-neutral-800"
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className={`w-4 text-center ${isSelected ? "text-neutral-400" : "text-neutral-400"}`}>
                        {c.id}.
                      </span>
                      <span className="truncate">{c.title}</span>
                    </div>

                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${
                        isSelected
                          ? "bg-neutral-800 text-white border-neutral-700"
                          : getRiskBadge(c.risk)
                      }`}
                    >
                      {c.risk}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Selected Clause Details (col-span-7) */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-neutral-200/90 p-7 shadow-xs space-y-6">
            {/* Clause Detail Header */}
            <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
              <div>
                <h2 className="text-lg font-bold text-neutral-900">
                  {currentClause?.title} Clause
                </h2>
              </div>
              <span
                className={`text-xs px-3 py-1 rounded-full border font-semibold ${getRiskBadge(
                  currentClause?.risk || "Low Risk"
                )}`}
              >
                {currentClause?.risk}
              </span>
            </div>

            {/* Section 1: What it means */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-bold text-neutral-800">
                <BookOpen className="w-4 h-4 text-neutral-600" />
                <span>What it means</span>
              </div>
              <p className="text-xs text-neutral-600 leading-relaxed pl-6">
                {currentClause?.meaning}
              </p>
            </div>

            {/* Section 2: Who it affects */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-bold text-neutral-800">
                <User className="w-4 h-4 text-neutral-600" />
                <span>Who it affects</span>
              </div>
              <p className="text-xs text-neutral-600 pl-6 font-medium">
                {currentClause?.who}
              </p>
            </div>

            {/* Section 3: Key Obligations */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-neutral-800">
                <CheckSquare className="w-4 h-4 text-neutral-600" />
                <span>Key Obligations</span>
              </div>
              <ul className="space-y-1.5 text-xs text-neutral-600 leading-relaxed pl-6">
                {currentClause?.obligations.map((ob, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-neutral-400">•</span>
                    <span>{ob}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Section 4: Potential Concerns */}
            {currentClause && currentClause.concerns.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-neutral-800">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>Potential Concerns</span>
                </div>
                <ul className="space-y-1.5 text-xs text-neutral-600 leading-relaxed pl-6">
                  {currentClause.concerns.map((con, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-amber-500 font-bold">•</span>
                      <span>{con}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Bottom Bar: Relevant Section */}
            <div className="pt-4 border-t border-neutral-100 flex items-center justify-between bg-neutral-50 p-4 rounded-2xl">
              <div className="flex items-center gap-2 text-xs text-neutral-600">
                <FileText className="w-4 h-4 text-neutral-500" />
                <span>Relevant Section:</span>
                <span className="font-semibold text-neutral-900">{currentClause?.section}</span>
              </div>
              <button
                type="button"
                onClick={() => setPreviewOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-neutral-200 text-xs font-medium text-neutral-800 hover:border-black transition-colors shadow-2xs cursor-pointer"
              >
                <span>Show in Document</span>
                <ExternalLink className="w-3 h-3 text-neutral-500" />
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* In-Browser Document Preview Modal with Clause Highlighting */}
      <DocumentPreviewModal
        isOpen={previewOpen}
        onClose={() => setPreviewOpen(false)}
        documentName={docName}
        documentText={fullDocText}
        documentId={activeDocId}
        highlightClause={currentClause?.section}
      />
    </div>
  );
}
