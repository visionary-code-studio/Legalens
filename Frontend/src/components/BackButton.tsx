"use client";

import Link from "next/link";

interface BackButtonProps {
  href?: string;
  label?: string;
  className?: string;
}

export default function BackButton({
  href = "/dashboard",
  label = "Back to Dashboard",
  className = "",
}: BackButtonProps) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-2.5 text-xs font-semibold text-neutral-700 hover:text-black group transition-colors ${className}`}
      title={label}
    >
      {/* Black rounded square with white curved return arrow matching image reference */}
      <div className="w-8 h-8 rounded-xl bg-black text-white flex items-center justify-center shadow-xs transition-transform group-hover:scale-105 group-hover:-translate-x-0.5">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-4 h-4"
        >
          <polyline points="9 14 4 9 9 4" />
          <path d="M20 20v-7a4 4 0 0 0-4-4H4" />
        </svg>
      </div>
      {label && <span className="hidden sm:inline font-medium">{label}</span>}
    </Link>
  );
}
