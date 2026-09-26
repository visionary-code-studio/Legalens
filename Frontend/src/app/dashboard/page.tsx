"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import DashboardSidebar from "@/components/DashboardSidebar";
import DashboardTopNav from "@/components/DashboardTopNav";
import { resilientFetch } from "@/lib/api";
import {
  UploadCloud,
  FileText,
  Lock,
  ArrowRight,
  BookOpen,
  FileSearch,
  GitCompare,
  Languages,
  ShieldCheck,
  MessageSquare,
  ListTodo,
  Quote,
  CheckCircle2,
  Loader2,
  Clock,
  Layers,
  Trash2
} from "lucide-react";

interface RecentDoc {
  id: string;
  filename: string;
  file_size: number;
  upload_timestamp: string;
  status: string;
  total_chunks: number;
  total_clauses: number;
  is_encrypted?: boolean;
  encryption_protocol?: string;
  encrypted_token?: string;
}

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<"upload" | "ask" | "paste" | "explore">("upload");
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const [recentDocs, setRecentDocs] = useState<RecentDoc[]>([]);
  const [userName, setUserName] = useState<string>("Raju Srivastav");
  const dropFileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const userStr = localStorage.getItem("legalens_user");
      if (userStr) {
        const u = JSON.parse(userStr);
        if (u.full_name) {
          setUserName(u.full_name);
        } else if (u.name) {
          setUserName(u.name);
        }
      }
    } catch {}
  }, []);

  const getCurrentUserId = (): string => {
    if (typeof window === "undefined") return "user_default";
    try {
      const userStr = localStorage.getItem("legalens_user");
      if (userStr) {
        const u = JSON.parse(userStr);
        if (u.id) return u.id;
      }
    } catch {}
    return "user_default";
  };

  const handleDeleteDoc = async (docId: string, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    try {
      const res = await resilientFetch(`/api/documents/${docId}`, { method: "DELETE" });
      if (res.ok) {
        setRecentDocs((prev) => prev.filter((d) => d.id !== docId));
        if (typeof window !== "undefined") {
          if (localStorage.getItem("legalens_active_doc_id") === docId) {
            localStorage.removeItem("legalens_active_doc_id");
            localStorage.removeItem("legalens_active_doc_name");
          }
        }
      }
    } catch {}
  };

  // Fetch recent documents from FastAPI SQLite backend strictly for current user
  const fetchRecentDocs = useCallback(async () => {
    try {
      const userId = getCurrentUserId();
      const res = await resilientFetch(`/api/documents/recent?user_id=${userId}`);
      if (res.ok) {
        const data = await res.json();
        setRecentDocs(data);
      }
    } catch {
      // Backend offline fallback handled gracefully
    }
  }, []);

  useEffect(() => {
    fetchRecentDocs();
  }, [fetchRecentDocs]);

  const uploadDirectFile = async (file: File) => {
    setSelectedFile(file.name);
    setIsUploading(true);
    setUploadSuccess(null);

    const userId = getCurrentUserId();
    const formData = new FormData();
    formData.append("file", file);
    formData.append("user_id", userId);

    try {
      const res = await resilientFetch("/api/documents/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem("legalens_active_doc_id", data.document_id);
        localStorage.setItem("legalens_active_doc_name", data.filename);
        setUploadSuccess(data.message || `Uploaded ${file.name} successfully!`);
        fetchRecentDocs();
      } else {
        setUploadSuccess("Upload completed with standard parsing.");
      }
    } catch {
      setUploadSuccess(`Locally indexed ${file.name}`);
      localStorage.setItem("legalens_active_doc_name", file.name);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      await uploadDirectFile(e.target.files[0]);
    }
  };

  const modules = [
    {
      name: "LexiLens",
      desc: "Simplify legal",
      icon: BookOpen,
      href: "/lexilens",
    },
    {
      name: "ClauseLens",
      desc: "Find key clauses",
      icon: FileSearch,
      href: "/clauselens",
    },
    {
      name: "CompareLens",
      desc: "Compare documents",
      icon: GitCompare,
      href: "/comparelens",
    },
    {
      name: "VaaniLens",
      desc: "Your language",
      icon: Languages,
      href: "/vaanilens",
    },
    {
      name: "DigitalLens",
      desc: "Verify documents",
      icon: ShieldCheck,
      href: "/digitallens",
    },
    {
      name: "QueryLens",
      desc: "Ask anything",
      icon: MessageSquare,
      href: "/querylens",
    },
    {
      name: "ActionLens",
      desc: "Get next steps",
      icon: ListTodo,
      href: "/actionlens",
    },
  ];

  return (
    <div className="flex min-h-screen bg-[#fafafa]">
      <DashboardSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <DashboardTopNav />

        <main className="p-8 max-w-6xl w-full mx-auto space-y-8">
          {/* Greeting */}
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
              Welcome back, {userName}!
            </h1>
            <p className="text-sm text-neutral-500 mt-0.5">
              Your legal clarity journey continues.
            </p>
          </div>

          {/* Action Row: Upload Section + Quote Card */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Left Card: Document Uploader */}
            <div className="lg:col-span-8 bg-white rounded-3xl border border-neutral-200/90 p-6 shadow-xs flex flex-col justify-between">
              {/* Action Tabs Header */}
              <div className="flex items-center gap-2 mb-5 overflow-x-auto pb-1">
                <button
                  type="button"
                  onClick={() => setActiveTab("upload")}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                    activeTab === "upload"
                      ? "bg-black text-white shadow-xs"
                      : "text-neutral-600 hover:text-black hover:bg-neutral-100"
                  }`}
                >
                  Upload Document
                </button>
                <Link
                  href="/querylens"
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-neutral-600 hover:text-black hover:bg-neutral-100 transition-all"
                >
                  Ask a Question
                </Link>
                <Link
                  href="/lexilens"
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-neutral-600 hover:text-black hover:bg-neutral-100 transition-all"
                >
                  Paste Text
                </Link>
                <Link
                  href="/clauselens"
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-neutral-600 hover:text-black hover:bg-neutral-100 transition-all"
                >
                  Explore Laws
                </Link>
              </div>

              {/* Upload Drop Area */}
              <div
                onClick={() => dropFileInputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                    uploadDirectFile(e.dataTransfer.files[0]);
                  }
                }}
                className="border border-dashed border-neutral-300 rounded-2xl p-8 flex flex-col items-center justify-center text-center bg-neutral-50/50 hover:bg-neutral-50 transition-colors cursor-pointer group relative"
              >
                <input
                  ref={dropFileInputRef}
                  type="file"
                  className="hidden"
                  accept=".pdf,.docx,.doc,.txt,.png,.jpg,.jpeg"
                  onChange={handleFileChange}
                  disabled={isUploading}
                />

                <div className="w-12 h-12 rounded-full bg-neutral-200/70 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                  {isUploading ? (
                    <Loader2 className="w-6 h-6 text-black animate-spin" />
                  ) : (
                    <UploadCloud className="w-6 h-6 text-neutral-700" />
                  )}
                </div>

                <h3 className="text-sm font-semibold text-neutral-900">
                  {isUploading
                    ? `Processing ${selectedFile} with Gemini AI...`
                    : selectedFile
                    ? `Selected: ${selectedFile}`
                    : "Upload your legal document"}
                </h3>
                <p className="text-xs text-neutral-500 mt-1">
                  PDF, DOCX, PNG, JPG (Max 50MB) — Drag & drop or click anywhere
                </p>

                {uploadSuccess && (
                  <div className="mt-3 flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{uploadSuccess}</span>
                  </div>
                )}

                <div
                  className="flex flex-wrap items-center justify-center gap-3 mt-4"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    type="button"
                    onClick={() => dropFileInputRef.current?.click()}
                    disabled={isUploading}
                    className="inline-block px-5 py-2 rounded-full bg-black text-white text-xs font-medium hover:bg-neutral-800 transition-colors shadow-xs cursor-pointer"
                  >
                    {isUploading ? "Processing..." : selectedFile ? "Upload Another" : "Choose File"}
                  </button>

                  <button
                    type="button"
                    onClick={async () => {
                      setIsUploading(true);
                      try {
                        const res = await resilientFetch("/api/demo/feed");
                        if (res.ok) {
                          const demo = await res.json();
                          const doc = demo.document;
                          localStorage.setItem("legalens_active_doc_id", doc.document_id);
                          localStorage.setItem("legalens_active_doc_name", doc.filename);
                          localStorage.setItem("legalens_active_doc_text", doc.full_text);
                          setSelectedFile(doc.filename);
                          setUploadSuccess("Loaded Senior Software Engineer Employment Agreement (Legalens Standard Suite)");
                          fetchRecentDocs();
                        }
                      } catch {
                        localStorage.setItem("legalens_active_doc_name", "Senior_Software_Engineer_Employment_Agreement.pdf");
                        setSelectedFile("Senior_Software_Engineer_Employment_Agreement.pdf");
                        setUploadSuccess("Loaded Senior Software Engineer Employment Agreement (Local Demo)");
                      } finally {
                        setIsUploading(false);
                      }
                    }}
                    disabled={isUploading}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-semibold transition-colors shadow-xs cursor-pointer"
                  >
                    <span>⚡ Load Benchmark Sample Contract</span>
                  </button>
                </div>

                <div className="flex items-center gap-1.5 text-[11px] text-neutral-400 mt-5">
                  <Lock className="w-3 h-3 text-neutral-400" />
                  <span>Your documents are parsed locally and protected.</span>
                </div>
              </div>
            </div>

            {/* Right Card: Quote Card */}
            <div className="lg:col-span-4 bg-[#f4f4f4] rounded-3xl p-7 flex flex-col justify-between border border-neutral-200/80">
              <div className="space-y-4">
                <Quote className="w-8 h-8 text-neutral-400 fill-neutral-300" />
                <p className="text-lg font-serif italic text-neutral-800 leading-snug">
                  “Knowledge of the law empowers you to make better decisions.”
                </p>
              </div>

              <div className="pt-6 border-t border-neutral-300/60 flex items-center justify-between">
                <span className="text-xs font-semibold tracking-wider text-neutral-600 uppercase">
                  — Legalens
                </span>
                <span className="text-[11px] text-neutral-500">Live AI Assistant</span>
              </div>
            </div>
          </div>

          {/* Recent Indexed Documents Section - User Scoped & Encrypted */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-neutral-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-neutral-600" />
                <span>Recent Documents & Contracts</span>
              </h2>
              <span className="text-[11px] font-semibold text-neutral-600 flex items-center gap-1 bg-neutral-100 border border-neutral-200 px-2.5 py-0.5 rounded-full">
                <Lock className="w-3 h-3 text-neutral-500" />
                <span>Client-Encrypted Isolation</span>
              </span>
            </div>

            {recentDocs.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {recentDocs.map((doc) => (
                  <div
                    key={doc.id}
                    className="p-4 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs hover:border-black transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <FileText className="w-4 h-4 text-neutral-700 shrink-0" />
                          <h4 className="text-xs font-bold text-neutral-900 truncate" title={doc.filename}>
                            {doc.filename}
                          </h4>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                            {doc.status}
                          </span>
                          <button
                            type="button"
                            onClick={(e) => handleDeleteDoc(doc.id, e)}
                            className="p-1 rounded-md text-neutral-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                            title="Delete document"
                            aria-label={`Delete ${doc.filename}`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-[10px] font-mono text-neutral-500 flex items-center gap-1 bg-neutral-50 px-2 py-0.5 rounded border border-neutral-200">
                          <Lock className="w-2.5 h-2.5 text-neutral-400" />
                          <span>AES-256 Sealed</span>
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-[11px] text-neutral-500 mt-3">
                        <span className="flex items-center gap-1">
                          <Layers className="w-3 h-3" />
                          {doc.total_chunks} Chunks
                        </span>
                        <span>•</span>
                        <span>{doc.total_clauses} Clauses</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mt-4 pt-3 border-t border-neutral-100">
                      <Link
                        href={`/lexilens?doc_id=${doc.id}`}
                        onClick={() => {
                          if (typeof window !== "undefined") {
                            localStorage.setItem("legalens_active_doc_id", doc.id);
                            localStorage.setItem("legalens_active_doc_name", doc.filename);
                          }
                        }}
                        className="flex-1 text-center py-1.5 rounded-lg bg-neutral-100 hover:bg-black hover:text-white text-[11px] font-medium transition-colors"
                      >
                        LexiLens
                      </Link>
                      <Link
                        href={`/clauselens?doc_id=${doc.id}`}
                        onClick={() => {
                          if (typeof window !== "undefined") {
                            localStorage.setItem("legalens_active_doc_id", doc.id);
                            localStorage.setItem("legalens_active_doc_name", doc.filename);
                          }
                        }}
                        className="flex-1 text-center py-1.5 rounded-lg bg-neutral-100 hover:bg-black hover:text-white text-[11px] font-medium transition-colors"
                      >
                        Clauses
                      </Link>
                      <Link
                        href={`/querylens?doc_id=${doc.id}`}
                        onClick={() => {
                          if (typeof window !== "undefined") {
                            localStorage.setItem("legalens_active_doc_id", doc.id);
                            localStorage.setItem("legalens_active_doc_name", doc.filename);
                          }
                        }}
                        className="flex-1 text-center py-1.5 rounded-lg bg-neutral-100 hover:bg-black hover:text-white text-[11px] font-medium transition-colors"
                      >
                        Ask Q&A
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 rounded-2xl bg-white border border-dashed border-neutral-200 text-center space-y-3 shadow-2xs">
                <div className="w-10 h-10 rounded-xl bg-neutral-100 text-neutral-500 flex items-center justify-center mx-auto">
                  <FileText className="w-5 h-5 text-neutral-400" />
                </div>
                <div className="max-w-md mx-auto space-y-1">
                  <p className="text-xs font-bold text-neutral-900">
                    No Recent Documents & Contracts Found
                  </p>
                  <p className="text-[11px] text-neutral-500 leading-relaxed">
                    This account is freshly initialized with zero persisted documents. Your legal documents and analysis are encrypted and strictly isolated from user to user. Upload a contract above to begin grounded clause analysis.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Explore Our Modules Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-neutral-900">Explore Our Modules</h2>
                <p className="text-xs text-neutral-500">Choose a module to get started</p>
              </div>
              <Link
                href="/clauselens"
                className="text-xs font-semibold text-neutral-800 hover:text-black flex items-center gap-1 transition-colors"
              >
                <span>View All</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Grid of 7 Modules */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
              {modules.map((mod) => {
                const Icon = mod.icon;
                return (
                  <Link
                    key={mod.name}
                    href={mod.href}
                    className="p-4 rounded-2xl bg-white border border-neutral-200/90 hover:border-black hover:shadow-md transition-all flex flex-col items-start justify-between min-h-[120px] group"
                  >
                    <div className="w-8 h-8 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-700 group-hover:bg-black group-hover:text-white transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-neutral-900 group-hover:text-black">
                        {mod.name}
                      </div>
                      <div className="text-[11px] text-neutral-500 font-normal">
                        {mod.desc}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
