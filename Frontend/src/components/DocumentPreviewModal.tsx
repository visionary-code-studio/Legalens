"use client";

import { useState } from "react";
import { X, FileText, Download, ZoomIn, ZoomOut, Search } from "lucide-react";

interface DocumentPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentName?: string;
  documentText?: string;
  documentId?: string;
  highlightClause?: string;
  clauseTitle?: string;
  clauseText?: string;
  pageNumber?: number;
}

export default function DocumentPreviewModal({
  isOpen,
  onClose,
  documentName,
  documentText,
  documentId: _documentId,
  highlightClause,
  clauseTitle,
  clauseText,
  pageNumber,
}: DocumentPreviewModalProps) {
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [searchQuery, setSearchQuery] = useState<string>("");

  if (!isOpen) return null;

  const resolvedDocName = documentName || clauseTitle || "Senior_Software_Engineer_Agreement.pdf";
  const displayHighlight = highlightClause || clauseTitle;
  const defaultText =
    clauseText ||
    documentText ||
    `LEGAL AGREEMENT: ${resolvedDocName}\n\n` +
    "1. DEFINITIONS AND INTERPRETATION\n" +
    "In this Agreement, 'Proprietary Information' means all tangible and intangible data.\n\n" +
    "2. TERM AND TERMINATION\n" +
    "Either party may terminate this agreement by providing 90 days prior written notice.\n\n" +
    "3. CONFIDENTIALITY AND NON-DISCLOSURE\n" +
    "The recipient agrees to hold and maintain the confidential information in strictest confidence for perpetual duration.\n\n" +
    "4. RESTRICTIVE COVENANTS AND NON-COMPETE\n" +
    "For 12 months post termination, employee shall not directly engage with competitors across India.\n\n" +
    "5. GOVERNING LAW AND JURISDICTION\n" +
    "This Agreement shall be governed by the laws of India, subject to exclusive court jurisdiction in Bengaluru.";

  const handleDownload = () => {
    const blob = new Blob([defaultText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = resolvedDocName.endsWith(".txt") ? resolvedDocName : `${resolvedDocName}.txt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-4xl h-[85vh] rounded-3xl shadow-2xl border border-neutral-200 flex flex-col overflow-hidden">
        {/* Modal Top Header */}
        <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between bg-neutral-50/80">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-black text-white flex items-center justify-center shadow-2xs">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-neutral-900 tracking-tight flex items-center gap-2">
                <span>{resolvedDocName}</span>
                {pageNumber && (
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-700 border border-neutral-300">
                    Page {pageNumber}
                  </span>
                )}
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  Verified Document
                </span>
              </h2>
              <p className="text-[11px] text-neutral-500">Original Document Preview & Section Grounding</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Zoom Controls */}
            <div className="hidden sm:flex items-center bg-white border border-neutral-200 rounded-xl px-2 py-1 gap-1 text-xs text-neutral-600 shadow-2xs">
              <button
                type="button"
                onClick={() => setZoomLevel((prev) => Math.max(70, prev - 15))}
                className="p-1 hover:text-black hover:bg-neutral-100 rounded-md"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="w-10 text-center font-mono text-[11px]">{zoomLevel}%</span>
              <button
                type="button"
                onClick={() => setZoomLevel((prev) => Math.min(150, prev + 15))}
                className="p-1 hover:text-black hover:bg-neutral-100 rounded-md"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Download Button */}
            <button
              type="button"
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-100 text-xs font-semibold text-neutral-800 transition-colors shadow-2xs cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Download</span>
            </button>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full hover:bg-neutral-200 flex items-center justify-center text-neutral-600 hover:text-black transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Search & Active Clause Banner */}
        <div className="px-6 py-2.5 bg-neutral-100/60 border-b border-neutral-200/80 flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Find in document..."
              className="w-full pl-8 pr-3 py-1 text-xs bg-white border border-neutral-200 rounded-lg text-neutral-800 placeholder:text-neutral-400 focus:outline-hidden focus:border-neutral-400"
            />
          </div>

          {displayHighlight && (
            <div className="text-xs text-neutral-700 flex items-center gap-1.5 font-medium truncate">
              <span className="text-neutral-400">Jumped to:</span>
              <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 font-semibold border border-amber-200 truncate">
                {displayHighlight}
              </span>
            </div>
          )}
        </div>

        {/* Document Content Pane */}
        <div className="flex-1 p-6 sm:p-10 overflow-y-auto bg-neutral-100/40 font-serif leading-relaxed text-neutral-800">
          <div
            className="max-w-2xl mx-auto bg-white p-8 sm:p-12 rounded-2xl shadow-sm border border-neutral-200 whitespace-pre-wrap selection:bg-amber-100"
            style={{ fontSize: `${(zoomLevel / 100) * 14}px` }}
          >
            {defaultText}
          </div>
        </div>

        {/* Modal Bottom Footer */}
        <div className="px-6 py-3 border-t border-neutral-200 bg-white flex items-center justify-between text-[11px] text-neutral-500">
          <span>Protected by Legalens Document Intelligence Sandbox</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-black text-white font-semibold hover:bg-neutral-800 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
