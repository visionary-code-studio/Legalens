"use client";

import Link from "next/link";
import { useState } from "react";
import { Mail, CheckCircle2, Scale } from "lucide-react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  return (
    <footer className="w-full bg-[#fbfbfb] text-neutral-900 font-sans antialiased overflow-hidden pt-16" role="contentinfo" aria-label="Site footer">
      {/* 1. Top Newsletter Section */}
      <div className="max-w-4xl mx-auto px-6 text-center space-y-4 mb-16">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-neutral-900 tracking-tight font-serif">
          Subscribe to our newsletter
        </h2>
        <p className="text-sm text-neutral-500 max-w-lg mx-auto">
          Sign up today and get verified statutory updates and legal intelligence.
        </p>

        {subscribed ? (
          <div className="inline-flex items-center gap-2 p-3 bg-neutral-900 text-white text-xs font-semibold rounded-2xl shadow-sm">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Thank you for subscribing to Legalens legislative updates!</span>
          </div>
        ) : (
          <form
            onSubmit={handleSubscribe}
            className="flex flex-col sm:flex-row items-center justify-center gap-2 max-w-md mx-auto pt-2"
          >
            <div className="relative w-full">
              <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                className="w-full pl-10 pr-4 py-3 text-xs bg-white border border-neutral-300 rounded-xl text-neutral-900 placeholder:text-neutral-400 shadow-2xs focus:outline-hidden focus:border-neutral-900 transition-colors"
              />
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-3 bg-black text-white text-xs font-bold rounded-xl hover:bg-neutral-800 transition-colors shadow-xs shrink-0 cursor-pointer"
            >
              Get started
            </button>
          </form>
        )}

        {/* Team Avatar Row */}
        <div className="flex items-center justify-center gap-2 pt-2 text-xs text-neutral-600">
          <span className="font-medium">Our legal experts are ready to help!</span>
          <div className="flex -space-x-2">
            <div className="w-6 h-6 rounded-full bg-neutral-800 text-[10px] text-white font-bold flex items-center justify-center ring-2 ring-white">
              VS
            </div>
            <div className="w-6 h-6 rounded-full bg-neutral-600 text-[10px] text-white font-bold flex items-center justify-center ring-2 ring-white">
              AK
            </div>
            <div className="w-6 h-6 rounded-full bg-neutral-400 text-[10px] text-white font-bold flex items-center justify-center ring-2 ring-white">
              RM
            </div>
            <div className="w-6 h-6 rounded-full bg-amber-600 text-[10px] text-white font-bold flex items-center justify-center ring-2 ring-white">
              SP
            </div>
          </div>
        </div>
      </div>

      {/* 2. Floating Dark Banner Card Overlapping the Footer */}
      <div className="max-w-6xl mx-auto px-6 relative z-10 -mb-28">
        <div className="bg-[#111111] rounded-3xl p-8 sm:p-12 lg:p-14 border border-neutral-800 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Subtle background glow */}
          <div className="absolute -top-24 -left-24 w-80 h-80 bg-neutral-800/40 rounded-full blur-3xl pointer-events-none" />

          {/* Left Content */}
          <div className="space-y-4 max-w-md relative z-10 text-center md:text-left">
            <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight font-serif">
              Experience superior <br />
              <span className="text-white">legal intelligence</span>
            </h3>
            <p className="text-xs sm:text-sm text-neutral-400 font-light">
              150+ statutory provisions and regulatory frameworks analyzed.
            </p>
            <div className="pt-2">
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center px-6 py-3 bg-white text-black text-xs font-bold rounded-xl hover:bg-neutral-200 transition-all hover:scale-105 shadow-md"
              >
                Get started
              </Link>
            </div>
          </div>

          {/* Right Holographic Globe / Network Graphic */}
          <div className="relative w-64 h-64 sm:w-72 sm:h-72 shrink-0 flex items-center justify-center">
            {/* Ambient glow */}
            <div className="absolute inset-0 bg-radial from-neutral-700/20 via-transparent to-transparent rounded-full" />
            
            {/* Radial Radar / Globe SVG */}
            <svg viewBox="0 0 240 240" className="w-full h-full text-white/40 drop-shadow-lg animate-pulse" style={{ animationDuration: "6s" }}>
              <defs>
                <radialGradient id="globeGrad" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.25" />
                  <stop offset="70%" stopColor="#ffffff" stopOpacity="0.05" />
                  <stop offset="100%" stopColor="#000000" stopOpacity="0" />
                </radialGradient>
              </defs>
              <circle cx="120" cy="120" r="100" fill="url(#globeGrad)" stroke="rgba(255,255,255,0.15)" strokeWidth="1" strokeDasharray="3 3" />
              <ellipse cx="120" cy="120" rx="90" ry="40" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
              <ellipse cx="120" cy="120" rx="60" ry="90" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
              <ellipse cx="120" cy="120" rx="90" ry="70" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
              
              {/* Pulsing Nodes */}
              <circle cx="110" cy="90" r="3.5" fill="#ffffff" className="animate-ping" style={{ transformOrigin: "110px 90px" }} />
              <circle cx="110" cy="90" r="2.5" fill="#ffffff" />
              <circle cx="150" cy="110" r="2" fill="#d4d4d4" />
              <circle cx="85" cy="140" r="2.5" fill="#ffffff" />
              <circle cx="135" cy="155" r="2" fill="#a3a3a3" />
              <circle cx="70" cy="100" r="1.5" fill="#737373" />
              <circle cx="165" cy="80" r="2" fill="#e5e5e5" />

              {/* Connecting vectors */}
              <line x1="110" y1="90" x2="150" y2="110" stroke="rgba(255,255,255,0.3)" strokeWidth="0.8" />
              <line x1="110" y1="90" x2="85" y2="140" stroke="rgba(255,255,255,0.3)" strokeWidth="0.8" />
              <line x1="85" y1="140" x2="135" y2="155" stroke="rgba(255,255,255,0.2)" strokeWidth="0.8" />
            </svg>
          </div>
        </div>
      </div>

      {/* 3. Main Pitch Black Footer */}
      <div className="w-full bg-[#000000] text-white pt-40 pb-12 border-t border-[#1f1f1f]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-16">
            
            {/* Left Column: Brand & Contact Info */}
            <div className="lg:col-span-2 space-y-5">
              <Link href="/" className="inline-flex items-center gap-2 group">
                <div className="w-7 h-7 rounded-lg bg-white text-black flex items-center justify-center font-serif font-black text-sm shadow-md">
                  <Scale className="w-4 h-4 text-black" />
                </div>
                <span className="font-serif text-xl font-bold tracking-tight text-white group-hover:text-neutral-300 transition-colors">
                  legalens
                </span>
              </Link>

              <div className="text-xs text-neutral-400 space-y-1 font-light leading-relaxed">
                <p>Legalens AI Civic Intelligence Center</p>
                <p>High Court Division, Institutional Area</p>
                <p>New Delhi / Bengaluru, India</p>
              </div>

              <div className="pt-2 grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="block text-[11px] text-neutral-500 uppercase tracking-wider mb-1">
                    Phone number
                  </span>
                  <a href="tel:18002011019" className="text-white hover:underline font-medium">
                    1-800-201-1019
                  </a>
                </div>
                <div>
                  <span className="block text-[11px] text-neutral-500 uppercase tracking-wider mb-1">
                    Email
                  </span>
                  <a href="mailto:support@legalens.ai" className="text-white hover:underline font-medium">
                    support@legalens.ai
                  </a>
                </div>
              </div>
            </div>

            {/* Column 2: Quick links */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 font-sans">
                Quick links
              </h4>
              <ul className="space-y-2 text-xs text-neutral-300">
                <li>
                  <Link href="/features" className="hover:text-white transition-colors">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="/how-it-works" className="hover:text-white transition-colors">
                    How it works
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="hover:text-white transition-colors">
                    About us
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white transition-colors">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white transition-colors">
                    Contact us
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Lenses */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 font-sans">
                Lenses
              </h4>
              <ul className="space-y-2 text-xs text-neutral-300">
                <li>
                  <Link href="/querylens" className="hover:text-white transition-colors">
                    QueryLens
                  </Link>
                </li>
                <li>
                  <Link href="/lexilens" className="hover:text-white transition-colors">
                    LexiLens
                  </Link>
                </li>
                <li>
                  <Link href="/comparelens" className="hover:text-white transition-colors">
                    CompareLens
                  </Link>
                </li>
                <li>
                  <Link href="/actionlens" className="hover:text-white transition-colors">
                    ActionLens
                  </Link>
                </li>
                <li>
                  <Link href="/vaanilens" className="hover:text-white transition-colors">
                    VaaniLens
                  </Link>
                </li>
                <li>
                  <Link href="/digitallens" className="hover:text-white transition-colors">
                    DigitalLens
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 4: Legal */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 font-sans">
                Legal
              </h4>
              <ul className="space-y-2 text-xs text-neutral-300">
                <li>
                  <Link href="/terms" className="hover:text-white transition-colors">
                    Terms of service
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-white transition-colors">
                    Privacy policy
                  </Link>
                </li>
                <li>
                  <Link href="/cookie-policy" className="hover:text-white transition-colors">
                    Cookie policy
                  </Link>
                </li>
                <li>
                  <Link href="/disclaimer" className="hover:text-white transition-colors">
                    Disclaimer
                  </Link>
                </li>
              </ul>
            </div>

          </div>

          {/* Centered Sub-Footer Copyright */}
          <div className="border-t border-[#1a1a1a] pt-8 text-center text-xs text-neutral-500">
            © 2026 Legalens. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
