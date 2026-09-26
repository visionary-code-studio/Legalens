"use client";

import Link from "next/link";
import Footer from "@/components/Footer";
import { ArrowLeft, Cookie, ShieldCheck, Settings, CheckCircle2, Lock } from "lucide-react";

export default function CookiePolicyPage() {
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
        <span className="text-xs font-mono text-neutral-400">Cookie & Storage Policy</span>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white border border-neutral-200 rounded-3xl p-8 sm:p-12 shadow-xs space-y-8">
          <div className="space-y-2 border-b border-neutral-100 pb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 text-neutral-800 text-xs font-semibold">
              <Cookie className="w-3.5 h-3.5 text-neutral-900" />
              Privacy & Transparency
            </div>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-neutral-900 tracking-tight">
              Cookie Policy
            </h1>
            <p className="text-xs text-neutral-500">
              Last updated: September 2026 • Governed by Digital Personal Data Protection (DPDP) Act, 2023
            </p>
          </div>

          <div className="prose prose-neutral max-w-none text-sm text-neutral-700 leading-relaxed space-y-6">
            <section className="space-y-3">
              <h2 className="text-lg font-serif font-bold text-neutral-900 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-neutral-700" />
                1. What Are Cookies & Local Storage?
              </h2>
              <p>
                Cookies and browser storage mechanisms (such as <code>localStorage</code> and <code>sessionStorage</code>) are compact text records saved securely in your browser to remember user preferences, maintain session state, and guarantee smooth, performant navigation across the Legalens platform.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-serif font-bold text-neutral-900 flex items-center gap-2">
                <Settings className="w-4 h-4 text-neutral-700" />
                2. Types of Cookies We Use
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/80 space-y-1.5">
                  <span className="font-bold text-neutral-900 text-xs flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Essential & Session Storage
                  </span>
                  <p className="text-xs text-neutral-600">
                    Maintains user login session, authentication status, and ensures the introductory cinematic splash screen only plays once per session.
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/80 space-y-1.5">
                  <span className="font-bold text-neutral-900 text-xs flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-blue-600" />
                    Privacy & Preferences
                  </span>
                  <p className="text-xs text-neutral-600">
                    Stores chosen vernacular language options (e.g., Hindi, Tamil, Bengali) and user interface accessibility adjustments without sharing third-party tracking data.
                  </p>
                </div>
              </div>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-serif font-bold text-neutral-900 flex items-center gap-2">
                <Lock className="w-4 h-4 text-neutral-700" />
                3. Zero Third-Party Advertising Trackers
              </h2>
              <p>
                Legalens is a civic intelligence and legal literacy platform. We do <strong>NOT</strong> sell user behavioral data, execute third-party cross-site advertising beacons, or monetize user legal documents. All document text analyzed within our 7 Lenses is processed transiently and securely.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-serif font-bold text-neutral-900 flex items-center gap-2">
                <Settings className="w-4 h-4 text-neutral-700" />
                4. Managing Your Cookie Settings
              </h2>
              <p>
                You can easily control or clear cookies and local storage directly via your browser settings (Chrome, Edge, Firefox, Safari). Please note that clearing session storage will reset your active login session and user interface preferences.
              </p>
            </section>
          </div>

          <div className="pt-6 border-t border-neutral-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs text-neutral-500">
              Questions regarding our data policies? Contact us at privacy@legalens.ai
            </span>
            <Link
              href="/privacy"
              className="text-xs font-semibold text-neutral-900 hover:underline"
            >
              Read full Privacy Policy →
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
