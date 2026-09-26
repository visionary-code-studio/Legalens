"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  Scale,
  ShieldAlert,
  HeartHandshake,
  CheckCircle2
} from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col justify-between selection:bg-neutral-200">
      <Header />

      <main className="max-w-5xl w-full mx-auto px-6 lg:px-12 py-12 lg:py-16 space-y-16">
        {/* Hero Section */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 border border-neutral-200 text-xs font-semibold text-neutral-800">
            <Scale className="w-3.5 h-3.5 text-neutral-600" />
            <span>Our Mission & Principles</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-neutral-900 tracking-tight leading-tight">
            Democratizing Legal Literacy for Everyone
          </h1>
          <p className="text-sm sm:text-base text-neutral-600 leading-relaxed">
            Legal knowledge shouldn&apos;t be locked behind archaic vocabulary or unaffordable hourly retainers. Legalens exists to make you legally educated.
          </p>
        </div>

        {/* The Core Formula */}
        <div className="bg-white rounded-3xl border border-neutral-200/90 p-8 sm:p-12 shadow-xs text-center space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-400">
            Our Guiding Principle
          </h2>
          <div className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-neutral-900 tracking-tight flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            <span className="text-neutral-400 line-through">Complex Law</span>
            <span className="text-neutral-300">→</span>
            <span className="px-3 py-1 bg-black text-white rounded-xl shadow-xs">Legalens</span>
            <span className="text-neutral-300">→</span>
            <span className="text-emerald-700">Clear Understanding</span>
            <span className="text-neutral-300">→</span>
            <span className="text-neutral-900">Informed Next Step</span>
          </div>
          <p className="text-xs text-neutral-500 max-w-xl mx-auto pt-2 leading-relaxed">
            We don&apos;t just summarize contracts. We build a cognitive bridge between ordinary citizens and complex legal frameworks.
          </p>
        </div>

        {/* The Problem We Solve */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-neutral-900 uppercase tracking-wider">
              <ShieldAlert className="w-4 h-4 text-amber-600" />
              <span>The Legal Literacy Gap</span>
            </div>
            <h3 className="text-2xl font-bold text-neutral-900 tracking-tight">
              Why Legal Agreements Are Broken for Everyday Users
            </h3>
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
              Every day, millions of people sign employment contracts, rental agreements, loan terms, and service agreements without truly understanding the liabilities, restrictive covenants, and dispute venues they are agreeing to.
            </p>
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
              In countries like India, the problem is compounded: agreements are drafted in convoluted English legalese that fewer than 15% of the population speaks with legal proficiency.
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-neutral-200/90 p-6 space-y-4 shadow-xs">
            <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-wide">
              How Legalens Solves This:
            </h4>
            <ul className="space-y-3">
              {[
                { title: "Cognitive Simplification", desc: "Turns legal Latin and archaic syntax into clean, conversational English." },
                { title: "Vernacular Equality", desc: "Explains clauses in Hindi, Bengali, Tamil, Telugu, and other regional tongues." },
                { title: "Objective Risk Highlighting", desc: "Flags gotchas like perpetual indemnities, non-competes, and excessive notice periods." },
                { title: "Action-Oriented Guidance", desc: "Prepares you with exact questions and checklists for your legal consultation." }
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-bold text-neutral-900 block">{item.title}</span>
                    <span className="text-[11px] text-neutral-500 leading-relaxed">{item.desc}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Ethical Boundaries Notice */}
        <div className="bg-neutral-100 rounded-3xl p-8 border border-neutral-200/90 space-y-3">
          <div className="flex items-center gap-2 text-neutral-900 font-bold text-xs uppercase tracking-wider">
            <HeartHandshake className="w-4 h-4 text-neutral-700" />
            <span>Our Commitment to Ethical AI</span>
          </div>
          <p className="text-xs text-neutral-600 leading-relaxed">
            Legalens operates strictly as an educational and assistance technology. We do not provide legal counsel, represent clients in court, or substitute for formal legal representation. When in doubt, our platform prepares you to consult a licensed advocate with confidence and precision.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
