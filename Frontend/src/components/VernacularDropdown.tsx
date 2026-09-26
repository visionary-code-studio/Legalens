"use client";

import { useState, useRef, useEffect } from "react";
import { Globe, ChevronDown, Search, Check } from "lucide-react";

export interface VernacularLanguage {
  name: string;
  label: string;
  native: string;
  code: string;
}

export const VERNACULAR_LANGUAGES: VernacularLanguage[] = [
  { name: "Hindi", label: "हिन्दी (Hindi)", native: "हिन्दी", code: "HI" },
  { name: "Bengali", label: "বাংলা (Bengali)", native: "বাংলা", code: "BN" },
  { name: "Telugu", label: "తెలుగు (Telugu)", native: "తెలుగు", code: "TE" },
  { name: "Tamil", label: "தமிழ் (Tamil)", native: "தமிழ்", code: "TA" },
  { name: "Marathi", label: "मराठी (Marathi)", native: "मराठी", code: "MR" },
  { name: "Gujarati", label: "ગુજરાતી (Gujarati)", native: "ગુજરાતી", code: "GU" },
  { name: "Kannada", label: "ಕನ್ನಡ (Kannada)", native: "ಕನ್ನಡ", code: "KN" },
  { name: "Malayalam", label: "മലയാളം (Malayalam)", native: "മലയാളം", code: "ML" },
  { name: "Punjabi", label: "ਪੰਜਾਬੀ (Punjabi)", native: "ਪੰਜਾਬੀ", code: "PA" },
  { name: "English", label: "English", native: "English", code: "EN" },
];

interface VernacularDropdownProps {
  selectedLang: string;
  onSelect: (langName: string) => void;
  className?: string;
}

export default function VernacularDropdown({
  selectedLang,
  onSelect,
  className = "",
}: VernacularDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const currentOption =
    VERNACULAR_LANGUAGES.find(
      (l) => l.name.toLowerCase() === selectedLang.toLowerCase()
    ) || VERNACULAR_LANGUAGES[0];

  const filtered = VERNACULAR_LANGUAGES.filter(
    (l) =>
      l.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.native.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleChoose = (name: string) => {
    onSelect(name);
    setIsOpen(false);
    setSearchQuery("");
  };

  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      {/* Trigger Pill matching Mockup */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-neutral-200 text-xs font-semibold text-neutral-800 shadow-2xs hover:bg-neutral-50 transition-colors focus:outline-hidden cursor-pointer"
        aria-expanded={isOpen}
      >
        <Globe className="w-4 h-4 text-neutral-600" />
        <span>{currentOption?.label}</span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-neutral-400 transition-transform duration-200 ${
            isOpen ? "rotate-180 text-black" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu Modal matching reference image */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-neutral-200 py-3 px-3 z-50 animate-in fade-in zoom-in-95 duration-150">
          {/* Search Input Bar */}
          <div className="relative mb-3">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search language..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-800 placeholder:text-neutral-400 focus:outline-hidden focus:border-neutral-400 focus:bg-white transition-all"
              autoFocus
            />
          </div>

          {/* Languages List */}
          <div className="max-h-60 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
            {filtered.length > 0 ? (
              filtered.map((lang) => {
                const isSelected =
                  lang.name.toLowerCase() === selectedLang.toLowerCase();
                return (
                  <button
                    key={lang.name}
                    type="button"
                    onClick={() => handleChoose(lang.name)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs text-left transition-colors cursor-pointer ${
                      isSelected
                        ? "bg-neutral-100/80 text-neutral-900 font-bold"
                        : "text-neutral-700 hover:bg-neutral-50 font-medium"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-full bg-neutral-100 border border-neutral-200 flex items-center justify-center text-[10px] font-bold text-neutral-700">
                        {lang.code}
                      </span>
                      <span>{lang.label}</span>
                    </div>

                    {isSelected && (
                      <Check className="w-4 h-4 text-emerald-600 stroke-[2.5]" />
                    )}
                  </button>
                );
              })
            ) : (
              <div className="py-4 text-center text-xs text-neutral-400">
                No languages found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
