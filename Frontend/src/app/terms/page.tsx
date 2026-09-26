"use client";

import Link from "next/link";
import Footer from "@/components/Footer";
import { ArrowLeft, Scale, CheckCircle2, AlertTriangle, ShieldCheck } from "lucide-react";

export default function TermsOfUsePage() {
  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col font-sans">
      {/* Top Header */}
      <header className="w-full bg-white border-b border-neutral-200 px-6 lg:px-12 py-4 flex items-center justify-between sticky top-0 z-30">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-600 hover:text-black transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Legalens Home</span>
        </Link>
        <span className="text-xs font-mono text-neutral-400">Terms of Service</span>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white border border-neutral-200 rounded-3xl p-8 sm:p-12 shadow-xs space-y-8">
          <div className="space-y-2 border-b border-neutral-100 pb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 text-neutral-800 text-xs font-semibold">
              <Scale className="w-3.5 h-3.5 text-neutral-900" />
              User Agreement
            </div>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-neutral-900 tracking-tight">
              Terms of Use & Platform Governance
            </h1>
            <p className="text-xs text-neutral-500">
              Last Revised: March 2026 • Governing Civic & Educational Use of Legalens Services
            </p>
          </div>

          <div className="prose prose-neutral max-w-none text-sm text-neutral-700 leading-relaxed space-y-6">
            <section className="space-y-3">
              <h2 className="text-lg font-serif font-bold text-neutral-900 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-neutral-700" />
                1. Educational and Informational Purpose
              </h2>
              <p>
                Legalens is an artificial intelligence-driven assistive tool engineered solely for legal literacy, statutory comprehension, and document breakdown. All generated summaries, clause assessments, redlines, and chat outputs are provided strictly for educational guidance and orientation.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-serif font-bold text-neutral-900 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-neutral-700" />
                2. No Attorney-Client Relationship
              </h2>
              <p>
                Utilization of Legalens does not create an attorney-client relationship under the Advocates Act, 1961, or any comparable bar association standard. The platform cannot represent you in judicial tribunals, provide bespoke litigation strategy, or execute affidavits on your behalf.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-serif font-bold text-neutral-900 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-neutral-700" />
                3. Acceptable Use and Safety Mandates
              </h2>
              <p>
                Users agree not to upload materials containing malware, state secrets, illegal content, or unredacted confidential third-party data without authorization. Any attempt to prompt inject, reverse engineer, or degrade platform availability will result in immediate termination of access.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
