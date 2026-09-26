"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ThreeSplashScreen from "@/components/ThreeSplashScreen";
import HeroWebGL from "@/components/HeroWebGL";
import { ArrowRight, Play } from "lucide-react";

export default function LandingPage() {
  // Splash screen plays once on initial website visit, never when returning from other pages
  const [showSplash, setShowSplash] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const completed =
        sessionStorage.getItem("legalens_splash_completed") ||
        localStorage.getItem("legalens_splash_completed");
      return !completed;
    }
    return false;
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const completed =
        sessionStorage.getItem("legalens_splash_completed") ||
        localStorage.getItem("legalens_splash_completed");
      if (completed) {
        setShowSplash(false);
      }
    }
  }, []);

  const handleSplashComplete = () => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("legalens_splash_completed", "true");
      localStorage.setItem("legalens_splash_completed", "true");
    }
    setShowSplash(false);
  };

  return (
    <>
      {showSplash && <ThreeSplashScreen onComplete={handleSplashComplete} />}

      <div className="min-h-screen bg-[#fcfcfc] flex flex-col justify-between selection:bg-neutral-200 overflow-x-hidden relative">
        {/* Top Navbar */}
        <Header />

        {/* Hero Section */}
        <main className="flex-1 relative flex flex-col justify-center max-w-7xl mx-auto w-full px-6 lg:px-12 py-8 lg:py-14">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-4 items-center relative">
            
            {/* Left Hero Column */}
            <div className="lg:col-span-7 space-y-7 z-10 py-6">
              <div className="space-y-4">
                <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight text-[#0a0a0a] leading-[1.08]">
                  Make Yourself <br />
                  <span className="text-black">Legally Educated.</span>
                </h1>
                <p className="text-base lg:text-lg text-neutral-600 max-w-xl font-normal leading-relaxed pt-1">
                  Understand. Verify. Compare. Translate. Ask. Act. <br />
                  Your AI-powered legal companion for a more informed you.
                </p>
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4 pt-1">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-black text-white font-medium hover:bg-neutral-800 transition-all shadow-md group"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  href="/demo"
                  className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full border border-neutral-300 bg-white text-neutral-800 font-medium hover:border-black transition-colors shadow-2xs group"
                >
                  <div className="w-5 h-5 rounded-full bg-neutral-100 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors">
                    <Play className="w-2.5 h-2.5 fill-current ml-0.5" />
                  </div>
                  <span>Watch Demo</span>
                </Link>
              </div>

              {/* Metrics Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-10 border-t border-neutral-200/90">
                <div>
                  <div className="text-3xl font-extrabold text-black tracking-tight">7+</div>
                  <div className="text-xs font-medium text-neutral-500 mt-1">Powerful Modules</div>
                </div>
                <div>
                  <div className="text-3xl font-extrabold text-black tracking-tight">10+</div>
                  <div className="text-xs font-medium text-neutral-500 mt-1">Languages Supported</div>
                </div>
                <div>
                  <div className="text-3xl font-extrabold text-black tracking-tight">100%</div>
                  <div className="text-xs font-medium text-neutral-500 mt-1">User-Centric</div>
                </div>
                <div>
                  <div className="text-3xl font-extrabold text-black tracking-tight">Accessible</div>
                  <div className="text-xs font-medium text-neutral-500 mt-1">Legal Knowledge</div>
                </div>
              </div>
            </div>

            {/* Right Hero Column: Lady Justice Statue smoothly gliding into position */}
            <div className="lg:col-span-5 relative flex items-center justify-center lg:justify-end min-h-[460px] lg:min-h-[580px]">
              {/* Three.js Interactive Ambient Particle Field */}
              <HeroWebGL />

              {/* Background artistic ribbons/waves */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden">
                <svg
                  viewBox="0 0 600 600"
                  className="w-full h-full opacity-40 text-neutral-300 scale-125 translate-x-10"
                  fill="none"
                >
                  <path
                    d="M100,500 C250,450 350,200 500,100 C550,70 600,80 650,120"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M50,550 C200,480 320,250 480,120 C530,90 580,100 630,140"
                    stroke="currentColor"
                    strokeWidth="1.2"
                  />
                  <path
                    d="M150,580 C280,500 380,300 520,160 C570,120 620,130 670,170"
                    stroke="currentColor"
                    strokeWidth="0.8"
                  />
                </svg>
              </div>

              {/* Handwritten calligraphic quote text */}
              <div className="absolute right-0 top-16 lg:top-24 z-20 pointer-events-none text-right pr-2">
                <span className="font-serif italic text-neutral-600 text-sm tracking-wide block">
                  Law
                </span>
                <span className="font-serif italic text-neutral-600 text-sm tracking-wide block">
                  for a more
                </span>
                <span className="font-serif italic text-neutral-800 text-base font-medium tracking-wide block">
                  informed
                </span>
                <span className="font-serif italic text-neutral-800 text-base font-semibold tracking-wide block">
                  tomorrow.
                </span>
              </div>

              {/* Lady Justice Statue PNG (Statue2.png - High Quality) */}
              <div className="relative z-10 w-full max-w-[400px] lg:max-w-[460px] h-[480px] lg:h-[580px] flex items-end justify-center">
                <Image
                  src="/Statue2.png"
                  alt="Lady Justice — Legalens"
                  width={460}
                  height={580}
                  priority
                  quality={100}
                  className="object-contain h-full w-auto drop-shadow-xl"
                />
              </div>
            </div>

          </div>
        </main>

        {/* Black & White Authoritative Footer */}
        <Footer />
      </div>
    </>
  );
}
