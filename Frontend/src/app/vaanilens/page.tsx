"use client";

import { useState, useRef } from "react";
import DashboardTopNav from "@/components/DashboardTopNav";
import VernacularDropdown from "@/components/VernacularDropdown";
import { resilientFetch } from "@/lib/api";
import {
  Languages,
  FileText,
  Sparkles,
  Info,
  Loader2,
  BookMarked,
  UploadCloud,
  FileCheck,
  Download,
  Copy,
  Check,
  RotateCcw
} from "lucide-react";

interface PreservedTerm {
  term?: string;
  original?: string;
  regional_translation?: string;
  meaning?: string;
  explanation?: string;
}

export default function VaaniLensPage() {
  const [activeTab, setActiveTab] = useState<"document" | "snippet">("document");
  const [selectedLang, setSelectedLang] = useState<string>("Hindi");

  // Snippet mode state
  const [text, setText] = useState<string>(
    "The Tenant shall pay the monthly rent on or before the 5th day of each calendar month without fail, failing which penal interest at 18% per annum shall accrue."
  );
  const [snippetLoading, setSnippetLoading] = useState<boolean>(false);
  const [vernacularResult, setVernacularResult] = useState<string>(
    "किरायेदार को प्रत्येक कैलेंडर माह की 5 तारीख या उससे पहले मासिक किराये का भुगतान बिना किसी चूक के करना होगा, अन्यथा 18% प्रति वर्ष की दर से दंडात्मक ब्याज देय होगा।"
  );
  const [preservedTerms, setPreservedTerms] = useState<PreservedTerm[]>([
    { term: "Without fail", regional_translation: "बिना किसी चूक के (सख्त समय-सीमा)" },
    { term: "Penal Interest", regional_translation: "दंडात्मक ब्याज (देरी से भुगतान का शुल्क)" },
    { term: "Accrue", regional_translation: "ब्याज जुड़ना या देय होना" }
  ]);

  // Document upload mode state
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [docLoading, setDocLoading] = useState<boolean>(false);
  const [docError, setDocError] = useState<string | null>(null);
  const [docResult, setDocResult] = useState<{
    filename: string;
    original_text: string;
    translated_text: string;
    word_count: number;
    paragraphs_count: number;
    preserved_terms: PreservedTerm[];
  } | null>(null);

  const [copiedOriginal, setCopiedOriginal] = useState(false);
  const [copiedTranslated, setCopiedTranslated] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle snippet translation
  const handleTranslateSnippet = async (targetLang: string) => {
    setSelectedLang(targetLang);
    setSnippetLoading(true);
    try {
      const res = await resilientFetch("/api/vaanilens/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: text,
          target_language: targetLang
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.vernacular_explanation) {
          setVernacularResult(data.vernacular_explanation);
        }
        if (data.preserved_terms && data.preserved_terms.length > 0) {
          setPreservedTerms(
            data.preserved_terms.map((item: { original: string; meaning: string }) => ({
              term: item.original,
              regional_translation: item.meaning
            }))
          );
        }
      }
    } catch {
      // offline fallback handled by initial state
    } finally {
      setSnippetLoading(false);
    }
  };

  // Handle document file change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0]);
      setDocError(null);
    }
  };

  // Handle document translation upload
  const handleTranslateDocument = async () => {
    if (!uploadedFile) {
      setDocError("Please select a document file (.pdf, .docx, .txt, or image) to translate.");
      return;
    }

    setDocLoading(true);
    setDocError(null);

    const formData = new FormData();
    formData.append("file", uploadedFile);
    formData.append("target_language", selectedLang);

    try {
      const res = await resilientFetch("/api/vaanilens/translate-document", {
        method: "POST",
        body: formData
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.detail || "Document translation failed. Please try again.");
      }

      const data = await res.json();
      setDocResult({
        filename: data.filename,
        original_text: data.original_text,
        translated_text: data.translated_text,
        word_count: data.word_count || data.original_text.split(/\s+/).length,
        paragraphs_count: data.paragraphs_count || 1,
        preserved_terms: data.preserved_terms || []
      });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setDocError(err.message);
      } else {
        setDocError("Failed to process document with translation engine.");
      }
    } finally {
      setDocLoading(false);
    }
  };

  // Export translated document
  const handleExportTranslation = async () => {
    if (!docResult) return;

    try {
      const res = await resilientFetch("/api/vaanilens/export-translation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filename: docResult.filename,
          target_language: selectedLang,
          translated_text: docResult.translated_text,
          preserved_terms: docResult.preserved_terms
        })
      });

      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `Legalens_Translation_${selectedLang}_${docResult.filename}.md`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (e) {
      console.error("Export error:", e);
    }
  };

  // Sample document quick loader
  const loadSampleDocument = () => {
    const sampleText = `STANDARD COMMERCIAL LEASE & INDEMNITY AGREEMENT

1. Term of Tenancy and Rent: The Tenant covenants to pay the Lessor a monthly rental on or before the 5th day of each calendar month. Failing which, penal interest at 18% per annum shall accrue automatically.

2. Maintenance & Permitted Use: The Premises shall be utilized solely for residential purposes. The Tenant shall not cause nuisance or permit illegal activities on the premises.

3. Termination & Mandatory Notice: Either party may terminate this agreement upon sixty (60) days prior written notice. Breach of contract by either party allows immediate termination without liability.

4. Governing Law & Arbitration: This agreement is governed by the laws of India. Any dispute arising out of or in connection with this contract shall be referred to arbitration seated in New Delhi.`;

    const blob = new Blob([sampleText], { type: "text/plain" });
    const file = new File([blob], "Sample_Commercial_Lease_Agreement.txt", { type: "text/plain" });
    setUploadedFile(file);
    setDocError(null);
  };

  const copyToClipboard = (textToCopy: string, isOriginal: boolean) => {
    navigator.clipboard.writeText(textToCopy);
    if (isOriginal) {
      setCopiedOriginal(true);
      setTimeout(() => setCopiedOriginal(false), 2000);
    } else {
      setCopiedTranslated(true);
      setTimeout(() => setCopiedTranslated(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col font-sans">
      <DashboardTopNav showBack />

      <main className="flex-1 max-w-6xl w-full mx-auto p-6 lg:p-8 space-y-6">
        {/* Module Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-black text-white flex items-center justify-center shadow-xs">
              <Languages className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-neutral-900 tracking-tight">VaaniLens</h1>
                <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-800 border border-neutral-200">
                  OCR + Deep-Translator
                </span>
              </div>
              <p className="text-xs text-neutral-500">
                Grounded legal document translation & OCR for all Indian regional languages.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <VernacularDropdown
              selectedLang={selectedLang}
              onSelect={(targetLang) => {
                setSelectedLang(targetLang);
                if (activeTab === "snippet") {
                  handleTranslateSnippet(targetLang);
                }
              }}
            />
          </div>
        </div>

        {/* Mode Switch Tabs */}
        <div className="flex items-center gap-2 p-1 bg-neutral-200/60 rounded-2xl w-fit">
          <button
            type="button"
            onClick={() => setActiveTab("document")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "document"
                ? "bg-white text-black shadow-xs"
                : "text-neutral-600 hover:text-black"
            }`}
          >
            Upload Legal Document (.pdf, .docx, .txt, OCR)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("snippet")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "snippet"
                ? "bg-white text-black shadow-xs"
                : "text-neutral-600 hover:text-black"
            }`}
          >
            Type / Paste Single Clause
          </button>
        </div>

        {/* TAB 1: FULL DOCUMENT UPLOAD & TRANSLATION */}
        {activeTab === "document" && (
          <div className="space-y-6">
            {/* Upload Zone Card */}
            <div className="bg-white rounded-3xl border border-neutral-200/90 p-6 sm:p-8 shadow-xs space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-sm font-bold text-neutral-900 uppercase tracking-wider">
                    Upload Legal Document for Vernacular Translation
                  </h2>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Supports contracts, affidavits, legal notices, and statutory agreements (.pdf, .docx, .txt, or scanned image files via OCR).
                  </p>
                </div>
                <button
                  type="button"
                  onClick={loadSampleDocument}
                  className="text-xs font-semibold text-neutral-700 hover:text-black underline cursor-pointer self-start sm:self-auto"
                >
                  Load Sample Lease Contract
                </button>
              </div>

              {/* Drag & Drop Area */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-neutral-300 hover:border-black rounded-2xl p-8 text-center cursor-pointer transition-colors bg-neutral-50/50 hover:bg-neutral-50 flex flex-col items-center justify-center gap-3"
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".pdf,.docx,.doc,.txt,.png,.jpg,.jpeg"
                  className="hidden"
                />

                <div className="w-12 h-12 rounded-2xl bg-neutral-100 flex items-center justify-center text-neutral-700">
                  <UploadCloud className="w-6 h-6" />
                </div>

                <div className="space-y-1">
                  <p className="text-xs font-bold text-neutral-900">
                    {uploadedFile ? uploadedFile.name : "Click to browse or drag and drop legal document"}
                  </p>
                  <p className="text-[11px] text-neutral-500">
                    PDF, DOCX, TXT or PNG/JPG images (OCR auto-applied) up to 25MB
                  </p>
                </div>

                {uploadedFile && (
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-neutral-200 rounded-full text-xs font-semibold text-neutral-800 shadow-xs">
                    <FileCheck className="w-3.5 h-3.5 text-black" />
                    <span>{(uploadedFile.size / 1024).toFixed(1)} KB ready for translation</span>
                  </div>
                )}
              </div>

              {docError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 flex items-center gap-2">
                  <Info className="w-4 h-4 text-red-600 shrink-0" />
                  <span>{docError}</span>
                </div>
              )}

              {/* Action Toolbar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-t border-neutral-100">
                <div className="text-xs text-neutral-500 flex items-center gap-2">
                  <span>Target Regional Language:</span>
                  <span className="font-bold text-neutral-900 px-2 py-0.5 rounded-md bg-neutral-100 border border-neutral-200">
                    {selectedLang}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  {uploadedFile && (
                    <button
                      type="button"
                      onClick={() => {
                        setUploadedFile(null);
                        setDocResult(null);
                      }}
                      className="px-4 py-2 rounded-xl text-xs font-semibold text-neutral-600 hover:text-black hover:bg-neutral-100 transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reset</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={handleTranslateDocument}
                    disabled={docLoading || !uploadedFile}
                    className="px-6 py-2.5 rounded-xl bg-black text-white text-xs font-bold hover:bg-neutral-800 transition-colors shadow-xs flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {docLoading ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Processing OCR & deep-translator...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Translate Document to {selectedLang}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Document Translation Result View */}
            {docResult && (
              <div className="space-y-4 animate-in fade-in duration-300">
                {/* Result Header & Export Bar */}
                <div className="bg-white rounded-2xl border border-neutral-200/90 p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-black text-white flex items-center justify-center font-bold text-xs">
                      {selectedLang.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-neutral-900">
                        {docResult.filename} • Translated to {selectedLang}
                      </h3>
                      <p className="text-[11px] text-neutral-500">
                        {docResult.word_count} words • {docResult.paragraphs_count} sections translated via deep-translator
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleExportTranslation}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black text-white text-xs font-semibold hover:bg-neutral-800 transition-colors cursor-pointer shadow-xs"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download Translated (.md)</span>
                    </button>
                  </div>
                </div>

                {/* Side-by-Side Comparison */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* Left: Original Document */}
                  <div className="bg-white rounded-3xl border border-neutral-200/90 p-6 shadow-xs space-y-3 flex flex-col">
                    <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-neutral-500" />
                        <span className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
                          Original English Document
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(docResult.original_text, true)}
                        className="p-1.5 rounded-lg hover:bg-neutral-100 text-neutral-500 hover:text-black transition-colors"
                        title="Copy original"
                      >
                        {copiedOriginal ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                    <div className="flex-1 max-h-96 overflow-y-auto p-4 rounded-2xl bg-neutral-50 border border-neutral-200/80 font-serif text-xs leading-relaxed text-neutral-800 whitespace-pre-wrap">
                      {docResult.original_text}
                    </div>
                  </div>

                  {/* Right: Vernacular Translation */}
                  <div className="bg-white rounded-3xl border border-neutral-200/90 p-6 shadow-xs space-y-3 flex flex-col relative overflow-hidden">
                    <div className="w-1.5 h-full bg-black absolute left-0 top-0" />
                    <div className="flex items-center justify-between pb-2 border-b border-neutral-100 pl-1">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-black" />
                        <span className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
                          Vernacular Translation ({selectedLang})
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(docResult.translated_text, false)}
                        className="p-1.5 rounded-lg hover:bg-neutral-100 text-neutral-500 hover:text-black transition-colors"
                        title="Copy translation"
                      >
                        {copiedTranslated ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                    <div className="flex-1 max-h-96 overflow-y-auto p-4 rounded-2xl bg-neutral-50 border border-neutral-200/80 text-sm leading-relaxed text-neutral-900 whitespace-pre-wrap font-medium">
                      {docResult.translated_text}
                    </div>
                  </div>
                </div>

                {/* Preserved Crucial Legal Terms */}
                {docResult.preserved_terms && docResult.preserved_terms.length > 0 && (
                  <div className="bg-white rounded-3xl border border-neutral-200/90 p-6 shadow-xs space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-neutral-900 uppercase tracking-wider">
                      <BookMarked className="w-4 h-4 text-neutral-700" />
                      <span>Crucial Statutory & Contractual Terms Preserved (Bilingual Clarity)</span>
                    </div>
                    <p className="text-xs text-neutral-500">
                      These core legal doctrines are kept bilingual so regional language speakers understand their strict legal meaning without loss of judicial precision.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2">
                      {docResult.preserved_terms.map((term, idx) => (
                        <div key={idx} className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200/80 space-y-1">
                          <p className="text-xs font-bold text-neutral-900">
                            {term.term || term.original}
                          </p>
                          <p className="text-xs text-neutral-700 font-medium">
                            {term.regional_translation || term.meaning}
                          </p>
                          {term.explanation && (
                            <p className="text-[11px] text-neutral-400">
                              {term.explanation}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: SINGLE CLAUSE SNIPPET */}
        {activeTab === "snippet" && (
          <div className="space-y-4">
            {/* Card 1: Original Legal Text */}
            <div className="bg-white rounded-3xl border border-neutral-200/90 p-6 shadow-xs space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-neutral-900 uppercase tracking-wider">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-neutral-500" />
                  <span>Original Legal Clause</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleTranslateSnippet(selectedLang)}
                  disabled={snippetLoading}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-black text-white text-xs font-medium hover:bg-neutral-800 transition-colors cursor-pointer"
                >
                  {snippetLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                  <span>Translate</span>
                </button>
              </div>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={3}
                className="w-full p-4 rounded-2xl bg-neutral-50 border border-neutral-200/80 font-serif text-sm leading-relaxed text-neutral-800 focus:outline-hidden focus:ring-1 focus:ring-black"
                placeholder="Paste any legal clause to translate..."
              />
            </div>

            {/* Card 2: Vernacular Explanation */}
            <div className="bg-white rounded-3xl border border-neutral-200/90 p-6 shadow-xs space-y-3 relative overflow-hidden">
              <div className="w-1.5 h-full bg-black absolute left-0 top-0" />
              <div className="flex items-center justify-between text-xs font-bold text-neutral-900 uppercase tracking-wider pl-1">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-black" />
                  <span>Explanation in {selectedLang}</span>
                </div>
                {snippetLoading && (
                  <div className="flex items-center gap-1.5 text-xs text-neutral-500 font-normal lowercase">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    <span>translating...</span>
                  </div>
                )}
              </div>
              <div className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200 text-base leading-relaxed text-neutral-900 font-medium pl-4">
                {vernacularResult}
              </div>

              {/* Preserved Legal Concepts */}
              {preservedTerms.length > 0 && (
                <div className="pt-3 border-t border-neutral-100 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-800 uppercase tracking-wider">
                    <BookMarked className="w-3.5 h-3.5 text-neutral-600" />
                    <span>Crucial Legal Terms Preserved</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    {preservedTerms.map((term, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-white border border-neutral-200/80 text-xs">
                        <span className="font-bold text-neutral-900">{term.term || term.original}: </span>
                        <span className="text-neutral-600">{term.regional_translation || term.meaning}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Disclaimer Footer */}
        <div className="p-4 rounded-2xl bg-neutral-100/70 border border-neutral-200 text-xs text-neutral-500 flex items-center gap-2">
          <Info className="w-4 h-4 text-neutral-400 shrink-0" />
          <span>
            This is an AI-generated vernacular translation. The original English legal text remains legally authoritative in judicial proceedings under Indian jurisdiction.
          </span>
        </div>
      </main>
    </div>
  );
}
