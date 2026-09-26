"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  Mail,
  ChevronDown,
  CheckCircle2,
  Send,
  Loader2,
  MapPin,
  Sparkles
} from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    category: "General Inquiry",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: "Does Legalens provide legal advice or replace a licensed attorney?",
      a: "No. Legalens provides automated legal literacy, plain-language document explanations, and structured preparation tools. It is strictly an information and assistance platform and does not constitute formal legal advice or create an attorney-client relationship."
    },
    {
      q: "What file formats and sizes can I upload?",
      a: "Legalens supports PDF, Microsoft Word (.docx), and plain text (.txt) files up to 50MB in size. Multi-page contracts, lease agreements, NDAs, and terms of service are fully indexed and chunked."
    },
    {
      q: "Are my uploaded legal documents private and secure?",
      a: "Yes. Documents are parsed securely in local sandboxed sessions. We do not sell your contract data, share private clauses with third-party advertisers, or train publicly accessible models on your proprietary agreements."
    },
    {
      q: "Which Indian languages are currently supported by VaaniLens?",
      a: "VaaniLens supports 10 major Indian languages: Hindi, Bengali, Telugu, Tamil, Marathi, Gujarati, Kannada, Malayalam, and Punjabi, alongside English, while preserving critical statutory terminology."
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 700);
  };

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col justify-between selection:bg-neutral-200">
      <Header />

      <main className="max-w-6xl w-full mx-auto px-6 lg:px-12 py-12 lg:py-16 space-y-16">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 border border-neutral-200 text-xs font-semibold text-neutral-800">
            <Mail className="w-3.5 h-3.5 text-neutral-600" />
            <span>Get in Touch</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-neutral-900 tracking-tight leading-tight">
            We&apos;re Here to Help You Navigate Law
          </h1>
          <p className="text-sm sm:text-base text-neutral-600 leading-relaxed">
            Have questions about our modules, want to report an issue, or explore an institutional partnership? Reach out to the Legalens team.
          </p>
        </div>

        {/* 2-Column: Contact Form + Direct Info */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Interactive Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-neutral-200/90 p-8 shadow-xs">
            {isSubmitted ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-neutral-900">Message Received!</h3>
                <p className="text-xs text-neutral-600 max-w-sm mx-auto leading-relaxed">
                  Thank you for contacting Legalens. Our support and product team will review your inquiry and get back to you within 24 hours.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setIsSubmitted(false);
                    setFormData({ name: "", email: "", category: "General Inquiry", message: "" });
                  }}
                  className="px-5 py-2 rounded-xl bg-black text-white text-xs font-semibold hover:bg-neutral-800 transition-colors"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="text-base font-bold text-neutral-900 pb-2 border-b border-neutral-100">
                  Send us a message
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-neutral-700">Your Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Vaibhav Shaw"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs text-neutral-900 focus:outline-hidden focus:border-black transition-colors"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-neutral-700">Email Address</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="you@domain.com"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs text-neutral-900 focus:outline-hidden focus:border-black transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-700">Inquiry Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs text-neutral-900 bg-white focus:outline-hidden focus:border-black transition-colors"
                  >
                    <option>General Inquiry</option>
                    <option>Product Feedback & Ideas</option>
                    <option>Report a Bug or Issue</option>
                    <option>University / Legal Aid Partnership</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-700">Message</label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us what you're looking for or how we can assist..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs text-neutral-900 focus:outline-hidden focus:border-black transition-colors leading-relaxed"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-black text-white text-xs font-semibold hover:bg-neutral-800 transition-colors shadow-xs cursor-pointer"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  <span>{isSubmitting ? "Sending..." : "Submit Message"}</span>
                </button>
              </form>
            )}
          </div>

          {/* Right Column: Direct Info & Quick Highlights */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl border border-neutral-200/90 p-6 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-neutral-900">Direct Contact</h3>
              <div className="space-y-3 text-xs text-neutral-600">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-700">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-semibold text-neutral-900 block">Email Us</span>
                    <span>support@legalens.ai</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-700">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-semibold text-neutral-900 block">Headquarters</span>
                    <span>Bengaluru, Karnataka, India</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-neutral-100 border border-neutral-200 text-xs text-neutral-600 space-y-2">
              <div className="font-bold text-neutral-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-neutral-700" />
                <span>PromptWar Hackathon Edition</span>
              </div>
              <p className="leading-relaxed">
                Legalens is actively developing new document analysis models and regional language transformers. We welcome feedback from legal professionals, researchers, and everyday citizens!
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Accordion Section */}
        <div className="space-y-6 max-w-3xl mx-auto pt-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-neutral-900 tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-xs text-neutral-500">
              Clear answers to the most common questions about our platform.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((f, i) => {
              const isOpen = openFaq === i;
              return (
                <div
                  key={i}
                  className="bg-white rounded-2xl border border-neutral-200/90 overflow-hidden shadow-2xs transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                    className="w-full p-4 flex items-center justify-between text-left gap-4 cursor-pointer hover:bg-neutral-50/50"
                  >
                    <span className="text-xs sm:text-sm font-semibold text-neutral-900">{f.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-neutral-400 shrink-0 transition-transform duration-200 ${
                        isOpen ? "rotate-180 text-black" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 pt-1 text-xs text-neutral-600 leading-relaxed border-t border-neutral-100 bg-neutral-50/30">
                      {f.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
