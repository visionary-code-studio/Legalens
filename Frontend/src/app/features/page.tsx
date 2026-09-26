"use client";

import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  BookOpen,
  FileSearch,
  GitCompare,
  Languages,
  ShieldCheck,
  MessageSquare,
  ListTodo,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Scale
} from "lucide-react";

export default function FeaturesPage() {
  const features = [
    {
      id: "lexilens",
      title: "LexiLens",
      subtitle: "Plain Language Legal Simplifier",
      icon: BookOpen,
      href: "/lexilens",
      tag: "Cognitive Accessibility",
      badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
      description:
        "Deconstructs dense contractual legalese into human-readable language. Preserves critical conditions, deadlines, and rights while eliminating archaic jargon.",
      highlights: [
        "Jargon-to-plain-English translation",
        "Key definitions and important terms glossary",
        "Parties affected breakdown",
        "One-click markdown summary export"
      ]
    },
    {
      id: "clauselens",
      title: "ClauseLens",
      subtitle: "Intelligent Clause Risk Analyzer",
      icon: FileSearch,
      href: "/clauselens",
      tag: "Contract Analytics",
      badgeColor: "bg-amber-50 text-amber-800 border-amber-200",
      description:
        "Automatically identifies, categorizes, and risk-scores contract provisions. Flags one-sided indemnities, perpetual non-competes, and excessive termination notice periods.",
      highlights: [
        "Automated clause taxonomy categorization",
        "3-Tier risk assignment (High, Medium, Low)",
        "Potential concerns & red flag highlights",
        "Executive contract risk report download"
      ]
    },
    {
      id: "comparelens",
      title: "CompareLens",
      subtitle: "High-Fidelity Document Redline",
      icon: GitCompare,
      href: "/comparelens",
      tag: "Version Intelligence",
      badgeColor: "bg-purple-50 text-purple-700 border-purple-200",
      description:
        "Compares two contract versions side-by-side to highlight additions, subtractions, and subtle semantic shifts that change your legal exposure.",
      highlights: [
        "Clause-level diff categorization (Added, Modified, Removed)",
        "Notice period & liability cap delta tracking",
        "Structured comparison matrix",
        "Downloadable redline diff report"
      ]
    },
    {
      id: "vaanilens",
      title: "VaaniLens",
      subtitle: "Vernacular Legal Translation",
      icon: Languages,
      href: "/vaanilens",
      tag: "Indic Multilingualism",
      badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
      description:
        "Empowers non-English speakers across India by explaining contracts in regional languages (Hindi, Bengali, Tamil, Telugu, Marathi, Gujarati, Kannada, Malayalam, Punjabi).",
      highlights: [
        "10+ Indian languages supported",
        "Preserves key statutory terms with transliterated definitions",
        "Interactive searchable language selector",
        "Side-by-side original and vernacular text"
      ]
    },
    {
      id: "digitallens",
      title: "DigitalLens",
      subtitle: "Document Authenticity & Integrity",
      icon: ShieldCheck,
      href: "/digitallens",
      tag: "Fraud Prevention",
      badgeColor: "bg-teal-50 text-teal-800 border-teal-200",
      description:
        "Evaluates digital documents for tampering indicators, metadata consistency, seal detection, and authority source validity before you trust or sign.",
      highlights: [
        "Metadata analysis & creation timestamp audit",
        "Visual tampering & typography anomaly detection",
        "Digital signature verification signal assessment",
        "Gazette & official order cross-referencing"
      ]
    },
    {
      id: "querylens",
      title: "QueryLens",
      subtitle: "Grounded Q&A with Strict Citations",
      icon: MessageSquare,
      href: "/querylens",
      tag: "Conversational RAG",
      badgeColor: "bg-indigo-50 text-indigo-700 border-indigo-200",
      description:
        "Ask plain-English questions about your document. QueryLens answers exclusively from the contract text, citing exact clause numbers and pages to prevent hallucinations.",
      highlights: [
        "Strict document-grounded citation answers",
        "Page and clause jump links",
        "Suggested high-impact legal questions",
        "Zero hallucination policy for unmentioned terms"
      ]
    },
    {
      id: "actionlens",
      title: "ActionLens",
      subtitle: "Executive Action Plan & Lawyer Prep",
      icon: ListTodo,
      href: "/actionlens",
      tag: "Empowerment & Action",
      badgeColor: "bg-rose-50 text-rose-700 border-rose-200",
      description:
        "Bridges the gap between understanding and taking action. Generates pre-signing checklists, critical calendar dates, and intelligent questions for your lawyer.",
      highlights: [
        "Interactive pre-signing checklist with progress tracking",
        "Important contractual timeline & notice milestones",
        "Curated questions to ask qualified legal counsel",
        "One-click action plan export"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col justify-between selection:bg-neutral-200">
      <Header />

      <main className="max-w-6xl w-full mx-auto px-6 lg:px-12 py-12 lg:py-16 space-y-12">
        {/* Page Hero */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 border border-neutral-200 text-xs font-semibold text-neutral-800">
            <Sparkles className="w-3.5 h-3.5 text-neutral-600" />
            <span>7 Specialized Legal Literacy Modules</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-neutral-900 tracking-tight leading-tight">
            Engineered for Clarity. Built for Empowerment.
          </h1>
          <p className="text-base text-neutral-600 leading-relaxed">
            Legalens breaks down dense legal agreements into actionable, verifiable, and understandable insights in your preferred language.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {features.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.id}
                className="bg-white rounded-3xl border border-neutral-200/90 p-8 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-black text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${feat.badgeColor}`}>
                      {feat.tag}
                    </span>
                  </div>

                  <div>
                    <h2 className="text-xl font-bold text-neutral-900 tracking-tight">{feat.title}</h2>
                    <p className="text-xs font-semibold text-neutral-500 mt-0.5">{feat.subtitle}</p>
                  </div>

                  <p className="text-xs text-neutral-600 leading-relaxed">{feat.description}</p>

                  <div className="pt-2 border-t border-neutral-100 space-y-2">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                      Key Capabilities:
                    </div>
                    <ul className="space-y-1.5">
                      {feat.highlights.map((h, i) => (
                        <li key={i} className="flex items-center gap-2 text-xs text-neutral-700">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-6">
                  <Link
                    href={feat.href}
                    className="inline-flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-neutral-50 hover:bg-black text-neutral-800 hover:text-white border border-neutral-200 hover:border-black text-xs font-semibold transition-all shadow-2xs"
                  >
                    <span>Launch {feat.title}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Legal Disclaimer Box */}
        <div className="p-6 rounded-3xl bg-neutral-100 border border-neutral-200/90 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
          <div className="w-10 h-10 rounded-2xl bg-white border border-neutral-300 flex items-center justify-center shrink-0">
            <Scale className="w-5 h-5 text-neutral-700" />
          </div>
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-wide">
              Legal Information & Assistance Notice
            </h4>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Legalens provides generative AI literacy, structural document decomposition, and translation assistance. It is designed to prepare you for informed discussions and does not constitute formal legal representation or legal advice.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
