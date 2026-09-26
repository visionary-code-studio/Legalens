"use client";

import { useState } from "react";
import DashboardTopNav from "@/components/DashboardTopNav";
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  FileText,
  X,
  Info,
  Sparkles,
  Loader2
} from "lucide-react";

export default function DigitalLensPage() {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<{
    document_name: string;
    overall_status: string;
    status_label: string;
    summary_verdict: string;
    signals: Array<{ name: string; status: string; summary: string; detail: string }>;
    recommended_action: string;
  }>({
    document_name: "Government_Order_2026.pdf",
    overall_status: "LIKELY_AUTHENTIC",
    status_label: "Likely Authentic — 4/5 Passed",
    summary_verdict: "The document displays coherent PDF metadata, verified digital signature block, and consistent typography without raster manipulation artifacts.",
    signals: [
      { name: "Document Integrity", status: "passed", summary: "PDF structure is intact and conforms to ISO 32000.", detail: "Standard font dictionary without overlaid text boxes." },
      { name: "Metadata Analysis", status: "passed", summary: "Creation timestamps match claimed publishing date.", detail: "Producer: Adobe Acrobat Pro v21.4." },
      { name: "Source Verification", status: "warning", summary: "Referenced Order #GO-2026-88 found in gazette draft repository.", detail: "Cross-check final gazette notification gazette.nic.in." },
      { name: "Signature Detection", status: "passed", summary: "Valid digital e-Sign certificate block detected.", detail: "Signer: Competent Authority, Govt of India." },
      { name: "Tampering Indicators", status: "passed", summary: "Zero anomalous pixel noise or font variance.", detail: "No post-signature visual editing identified." }
    ],
    recommended_action: "Document appears authentic. Confirm final gazette registration number before irreversible legal transactions."
  });

  const handleVerify = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/api/digitallens/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filename: result.document_name,
          pages: 2,
          file_size_kb: 580
        })
      });
      if (res.ok) {
        const data = await res.json();
        setResult(data);
      }
    } catch {
      // Offline fallback
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col">
      <DashboardTopNav showBack />

      <main className="flex-1 max-w-6xl w-full mx-auto p-6 lg:p-8 space-y-6">
        {/* Module Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-black text-white flex items-center justify-center shadow-xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-neutral-900 tracking-tight">DigitalLens</h1>
              <p className="text-xs text-neutral-500">
                Verify before you trust. AI-powered document authenticity analysis.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleVerify}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-black text-white text-xs font-semibold hover:bg-neutral-800 transition-colors shadow-xs cursor-pointer"
          >
            {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
            <span>Re-Verify Authenticity</span>
          </button>
        </div>

        {/* Document Identifier Chip */}
        <div className="flex items-center justify-between bg-white px-4 py-2.5 rounded-2xl border border-neutral-200/90 shadow-2xs max-w-md">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-neutral-900 block leading-tight">
                {result.document_name}
              </span>
              <span className="text-[11px] text-neutral-500">2 pages • 580 KB • e-Gazette Candidate</span>
            </div>
          </div>
          <button
            type="button"
            aria-label="Remove document"
            className="w-6 h-6 rounded-full hover:bg-neutral-100 flex items-center justify-center text-neutral-400"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Verification Analysis Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left Card: Authenticity Check Card (col-span-6) */}
          <div className="lg:col-span-6 bg-white rounded-3xl border border-neutral-200/90 p-8 shadow-xs flex flex-col items-center justify-center text-center space-y-5">
            <div className="w-20 h-20 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-inner">
              <CheckCircle2 className="w-12 h-12" />
            </div>

            <div className="space-y-1">
              <div className="text-xs font-bold text-neutral-400 uppercase tracking-widest">
                Authenticity Verdict
              </div>
              <h2 className="text-2xl font-extrabold text-emerald-600">{result.status_label}</h2>
              <p className="text-xs text-neutral-600 max-w-sm pt-1 leading-relaxed">
                {result.summary_verdict}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="px-5 py-2.5 rounded-xl bg-black text-white text-xs font-semibold hover:bg-neutral-800 transition-colors shadow-xs cursor-pointer"
            >
              View Detailed Forensic Report
            </button>
          </div>

          {/* Right Card: 5-Point Verification Checklist (col-span-6) */}
          <div className="lg:col-span-6 bg-white rounded-3xl border border-neutral-200/90 p-6 shadow-xs flex flex-col justify-between space-y-4">
            <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wider pb-2 border-b border-neutral-100">
              5-Point Forensic Signals
            </h3>

            <div className="space-y-3">
              {result.signals.map((sig, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-2xl bg-neutral-50/80 border border-neutral-200/70"
                >
                  <div className="flex items-center gap-3">
                    {sig.status === "passed" ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                    )}
                    <div>
                      <div className="text-xs font-semibold text-neutral-900">{sig.name}</div>
                      <div className="text-[11px] text-neutral-500">{sig.summary}</div>
                    </div>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      sig.status === "passed"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-amber-50 text-amber-800 border-amber-200"
                    }`}
                  >
                    {sig.status.toUpperCase()}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-2 text-[11px] text-neutral-400">
              Evaluated against India Gazette & Digital Signature Registry heuristics.
            </div>
          </div>
        </div>

        {/* Modal Forensic Report */}
        {showModal && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-neutral-200">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  <h3 className="text-sm font-bold text-neutral-900">Forensic Verification Report</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="w-7 h-7 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-neutral-500 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 text-xs text-neutral-700 max-h-[400px] overflow-y-auto pr-1">
                <div className="p-3 bg-neutral-50 rounded-xl">
                  <span className="font-bold block text-neutral-900 mb-1">Recommended Action:</span>
                  <p>{result.recommended_action}</p>
                </div>

                {result.signals.map((s, idx) => (
                  <div key={idx} className="p-3 border border-neutral-200 rounded-xl space-y-1">
                    <div className="flex items-center justify-between font-semibold">
                      <span>{s.name}</span>
                      <span className="text-[10px] uppercase font-bold text-neutral-500">{s.status}</span>
                    </div>
                    <p className="text-[11px] text-neutral-600">{s.detail}</p>
                  </div>
                ))}
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl bg-black text-white text-xs font-semibold hover:bg-neutral-800 cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Disclaimer Footer */}
        <div className="p-4 rounded-2xl bg-neutral-100/70 border border-neutral-200 text-xs text-neutral-500 flex items-center gap-2">
          <Info className="w-4 h-4 text-neutral-400 shrink-0" />
          <span>
            Verification is AI-assisted. Please verify with the issuing authority for final confirmation.
          </span>
        </div>
      </main>
    </div>
  );
}
