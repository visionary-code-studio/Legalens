"use client";

import Link from "next/link";
import Footer from "@/components/Footer";
import { ArrowLeft, AlertOctagon, HelpCircle, FileCheck, ExternalLink } from "lucide-react";

export default function DisclaimerPage() {
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
        <span className="text-xs font-mono text-neutral-400">Legal Disclaimer</span>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white border border-neutral-200 rounded-3xl p-8 sm:p-12 shadow-xs space-y-8">
          <div className="space-y-2 border-b border-neutral-100 pb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 text-neutral-800 text-xs font-semibold">
              <AlertOctagon className="w-3.5 h-3.5 text-neutral-900" />
              Statutory Limitation
            </div>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-neutral-900 tracking-tight">
              Disclaimer & Limitation of Liability
            </h1>
            <p className="text-xs text-neutral-500">
              Prescribed Statutory Disclosure • Bar Council of India Guidelines Compliant
            </p>
          </div>

          <div className="prose prose-neutral max-w-none text-sm text-neutral-700 leading-relaxed space-y-6">
            <section className="space-y-3">
              <h2 className="text-lg font-serif font-bold text-neutral-900 flex items-center gap-2">
                <AlertOctagon className="w-4 h-4 text-neutral-700" />
                1. Not Formal Legal Advice
              </h2>
              <p>
                The outputs provided by Legalens (including clause simplifications, risk scores, redline comparisons, statutory citations, and voice responses) are generated via artificial intelligence algorithms for preliminary education. They must NEVER be substituted for independent counsel from an enrolled advocate or qualified legal practitioner.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-serif font-bold text-neutral-900 flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-neutral-700" />
                2. Limitation of Liability
              </h2>
              <p>
                In no event shall Legalens, its developers, researchers, or contributors be held liable for any damages, legal penalties, contract breaches, or forfeiture of rights arising from reliance upon AI-generated answers or analysis. Users are advised to review all legal instruments with an authorized attorney prior to execution.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-serif font-bold text-neutral-900 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-neutral-700" />
                3. Pro Bono & Legal Aid Assistance
              </h2>
              <p>
                If you require free or subsidized formal legal representation in India, please contact the National Legal Services Authority (NALSA) or your respective State / District Legal Services Authority.
              </p>
              <div className="pt-2">
                <a
                  href="https://nalsa.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-black text-white text-xs font-semibold hover:bg-neutral-800 transition-colors"
                >
                  <span>Visit NALSA Portal</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
