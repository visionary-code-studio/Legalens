"use client";

import Link from "next/link";
import Footer from "@/components/Footer";
import { ArrowLeft, Shield, Lock, EyeOff, Server, FileText } from "lucide-react";

export default function PrivacyPolicyPage() {
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
        <span className="text-xs font-mono text-neutral-400">DPDPA 2023 Compliant</span>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white border border-neutral-200 rounded-3xl p-8 sm:p-12 shadow-xs space-y-8">
          <div className="space-y-2 border-b border-neutral-100 pb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 text-neutral-800 text-xs font-semibold">
              <Shield className="w-3.5 h-3.5 text-neutral-900" />
              Statutory Privacy Charter
            </div>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-neutral-900 tracking-tight">
              Privacy Policy & Data Fiduciary Notice
            </h1>
            <p className="text-xs text-neutral-500">
              Effective Date: March 2026 • In Compliance with India Digital Personal Data Protection Act (DPDPA), 2023
            </p>
          </div>

          <div className="prose prose-neutral max-w-none text-sm text-neutral-700 leading-relaxed space-y-6">
            <section className="space-y-3">
              <h2 className="text-lg font-serif font-bold text-neutral-900 flex items-center gap-2">
                <Lock className="w-4 h-4 text-neutral-700" />
                1. Zero-Retention Document Processing
              </h2>
              <p>
                Legalens operates on an ephemeral analysis architecture. When you upload contracts, agreements, or legal notices, they are processed in an isolated in-memory runtime solely to generate explanations, redline comparisons, or statutory answers. Once your active session concludes or the browser window is closed, your document text is purged from memory and is never used to train generalized foundation models.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-serif font-bold text-neutral-900 flex items-center gap-2">
                <EyeOff className="w-4 h-4 text-neutral-700" />
                2. Automated PII Sanitization
              </h2>
              <p>
                Before any document segment or user prompt is submitted to the Gemini intelligence inference pipeline, our client-side and backend sanitation layers redact Personally Identifiable Information (PII) including Aadhaar numbers, PAN cards, passport numbers, email addresses, and financial account identifiers.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-serif font-bold text-neutral-900 flex items-center gap-2">
                <Server className="w-4 h-4 text-neutral-700" />
                3. Data Principal Rights
              </h2>
              <p>
                Under Section 11 of the Digital Personal Data Protection Act, 2023, you hold the right to access, rectify, and erase any information voluntarily shared during support requests or newsletter signups. To exercise these rights, submit a formal request to <span className="font-semibold text-black">privacy@legalens.ai</span>.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-serif font-bold text-neutral-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-neutral-700" />
                4. Third-Party Intelligence Providers
              </h2>
              <p>
                Legal queries utilize Google Gemini Enterprise API under zero-data-logging agreements. No user documents or civic queries are incorporated into public machine learning corpora.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
