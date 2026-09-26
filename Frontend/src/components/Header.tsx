"use client";

import Link from "next/link";
import Image from "next/image";

export default function Header() {
  return (
    <header className="w-full bg-white border-b border-[#e5e5e5] px-6 lg:px-12 py-3.5 flex items-center justify-between sticky top-0 z-50">
      {/* Brand & Logo: Clean prominent logo + Brush font LEGALENS */}
      <div className="flex items-center gap-3">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-11 h-11 flex items-center justify-center transition-transform group-hover:scale-105">
            <Image
              src="/logo_updated.png"
              alt="LEGALENS Logo"
              width={44}
              height={44}
              className="object-contain w-full h-full drop-shadow-2xs"
              priority
            />
          </div>
          <span className="font-brush text-2xl sm:text-3xl tracking-wider text-black uppercase select-none">
            LEGALENS
          </span>
        </Link>
      </div>

      {/* Nav Links */}
      <nav className="hidden md:flex items-center gap-8 text-[14px] font-medium text-neutral-600">
        <Link href="/" className="hover:text-black transition-colors">Home</Link>
        <Link href="/features" className="hover:text-black transition-colors">Features</Link>
        <Link href="/how-it-works" className="hover:text-black transition-colors">How it Works</Link>
        <Link href="/about" className="hover:text-black transition-colors">About</Link>
        <Link href="/contact" className="hover:text-black transition-colors">Contact</Link>
      </nav>

      {/* Right Controls: Auth Actions */}
      <div className="flex items-center gap-3">
        <Link
          href="/login"
          className="text-[14px] font-medium px-4 py-2 text-neutral-800 hover:text-black transition-colors"
        >
          Login
        </Link>
        <Link
          href="/signup"
          className="text-[14px] font-medium px-5 py-2 rounded-full bg-black text-white hover:bg-neutral-800 transition-colors shadow-sm"
        >
          Sign Up
        </Link>
      </div>
    </header>
  );
}
