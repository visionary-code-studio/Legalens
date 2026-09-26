"use client";

import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  UploadCloud,
  Layers,
  Cpu,
  Globe2,
  CheckCircle,
  ArrowRight,
  FileCheck2
} from "lucide-react";

export default function HowItWorksPage() {
  const steps = [
    {
      step: "01",
      title: "Secure Document Intake & Safe Parsing",
      icon: UploadCloud,
      desc: "Drag and drop your PDF, Word (DOCX), or plain text agreement. Your file is parsed locally within an isolated sandbox. Proprietary credentials and personal data are never exposed.",
      details: [
        "Local SQLite indexing & temporary storage",
        "Path-traversal and malicious payload sanitization",
        "Multi-page PDF text layer extraction"
      ]
    },
    {
      step: "02",
      title: "Structure-Aware Semantic Chunking",
      icon: Layers,
      desc: "Unlike standard naive text splitters that cut sentences in half, Legalens's custom chunker recognizes contractual anatomy: Articles, Provisions, Recitals, Schedules, and numbered sub-clauses.",
      details: [
        "Identifies 'Clause X', 'Section 1.1', and 'SCHEDULE A' boundaries",
        "Preserves parent-child clause hierarchy and titles",
        "Maintains context windows with token budget safeguards"
      ]
    },
    {
      step: "03",
      title: "Dual-Layer GenAI Risk & Obligation Scoring",
      icon: Cpu,
      desc: "Google Gemini 2.5 Flash Lite analyzes each provision with strict legal taxonomy schemas. It determines who the clause affects, what specific duties it imposes, and flags potential gotchas.",
      details: [
        "3-Tier risk assignment (High, Medium, Low Risk)",
        "Grounded citation of section and estimated page number",
        "Detection of non-competes, one-sided indemnities, and perpetual terms"
      ]
    },
    {
      step: "04",
      title: "Vernacular Translation & Term Preservation",
      icon: Globe2,
      desc: "For non-English speakers, VaaniLens translates complex legal concepts into Hindi, Bengali, Tamil, Telugu, Marathi, and more, while preserving statutory legal terminology.",
      details: [
        "Translates semantic meaning rather than word-for-word literal confusion",
        "Retains authoritative English legal clause side-by-side",
        "Provides plain language definitions for difficult Latin/legal jargon"
      ]
    },
    {
      step: "05",
      title: "Actionable Next Steps & Lawyer Prep",
      icon: CheckCircle,
      desc: "You receive a structured pre-signing checklist, calendar timeline for critical deadlines (e.g. 90-day notice periods), and concise questions to ask your legal counsel.",
      details: [
        "Interactive checklist to confirm every milestone before signing",
        "Downloadable executive report for offline review",
        "Empowers you to have productive, cost-effective lawyer consultations"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col justify-between selection:bg-neutral-200">
      <Header />

      <main className="max-w-5xl w-full mx-auto px-6 lg:px-12 py-12 lg:py-16 space-y-12">
        {/* Hero Section */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 border border-neutral-200 text-xs font-semibold text-neutral-800">
            <FileCheck2 className="w-3.5 h-3.5 text-neutral-600" />
            <span>The Legalens Intelligence Architecture</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-neutral-900 tracking-tight leading-tight">
            How Legalens Transforms Complex Law into Clarity
          </h1>
          <p className="text-sm sm:text-base text-neutral-600 leading-relaxed">
            From raw, jargon-heavy contracts to simple language, grounded risk alerts, and actionable next steps.
          </p>
        </div>

        {/* Steps Timeline */}
        <div className="space-y-6">
          {steps.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-3xl border border-neutral-200/90 p-8 shadow-xs flex flex-col md:flex-row gap-6 items-start"
              >
                <div className="flex items-center gap-4 shrink-0">
                  <span className="font-mono text-2xl font-extrabold text-neutral-300">
                    {s.step}
                  </span>
                  <div className="w-12 h-12 rounded-2xl bg-black text-white flex items-center justify-center shadow-xs">
                    <Icon className="w-6 h-6" />
                  </div>
                </div>

                <div className="flex-1 space-y-3">
                  <h2 className="text-lg font-bold text-neutral-900 tracking-tight">
                    {s.title}
                  </h2>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    {s.desc}
                  </p>

                  <div className="pt-2 border-t border-neutral-100 grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {s.details.map((d, i) => (
                      <div key={i} className="flex items-start gap-1.5 text-[11px] text-neutral-600 font-medium">
                        <span className="text-black font-bold">✓</span>
                        <span>{d}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA Card */}
        <div className="bg-black text-white rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-xl relative overflow-hidden">
          <div className="max-w-xl mx-auto space-y-3 relative z-10">
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Ready to understand your agreements?
            </h3>
            <p className="text-xs sm:text-sm text-neutral-400">
              Upload your agreement or test any clause in seconds. No credit card required.
            </p>
            <div className="pt-2">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-white text-black font-bold text-xs hover:bg-neutral-100 transition-all shadow-md group"
              >
                <span>Get Started Now</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
