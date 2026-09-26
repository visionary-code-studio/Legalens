"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Play, Pause, Volume2, VolumeX, Maximize2, RotateCcw, ArrowRight, ShieldCheck, Scale, CheckCircle2 } from "lucide-react";

export default function WatchDemoPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current && videoRef.current.duration) {
      setProgress((videoRef.current.currentTime / videoRef.current.duration) * 100);
    }
  };

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        videoRef.current.requestFullscreen();
      }
    }
  };

  const restartVideo = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const demoChapters = [
    { title: "Introduction to Legalens", time: "0:00", desc: "Why legal literacy matters for every citizen and professional in India." },
    { title: "The 7 Specialized Lenses", time: "0:15", desc: "LexiLens, ClauseLens, CompareLens, VaaniLens, DigitalLens, QueryLens & ActionLens." },
    { title: "Vernacular Document Translation", time: "0:35", desc: "Deep-translator & OCR processing with bilingual statutory preservation." },
    { title: "Grounded AI & Zero Data Logging", time: "0:50", desc: "Client-encrypted document isolation and DPDPA 2023 compliance." }
  ];

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col justify-between font-sans selection:bg-neutral-200">
      <Header />

      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-10 lg:py-14 space-y-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 border border-neutral-200 text-xs font-semibold text-neutral-800">
            <Scale className="w-3.5 h-3.5" />
            <span>Platform Demonstration</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-neutral-900 tracking-tight font-serif">
            Watch Legalens in Action
          </h1>
          <p className="text-sm sm:text-base text-neutral-600 leading-relaxed">
            Experience how Legalens bridges the gap between intricate legal statutes and clear, empowering civic understanding.
          </p>
        </div>

        {/* Video Player Box */}
        <div className="relative rounded-3xl overflow-hidden bg-black shadow-2xl border border-neutral-800 group">
          <video
            ref={videoRef}
            src="/Legal%20Lens%20Demo.mp4"
            autoPlay
            playsInline
            controls
            onTimeUpdate={handleTimeUpdate}
            onEnded={() => setIsPlaying(false)}
            onError={() => {
              if (videoRef.current && !videoRef.current.src.endsWith("/LegalLens.mp4")) {
                videoRef.current.src = "/LegalLens.mp4";
                videoRef.current.play().catch(() => {});
              }
            }}
            className="w-full aspect-video object-contain bg-black cursor-pointer"
            onClick={togglePlay}
          />

          {/* Video Control Bar Overlay */}
          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4 sm:p-6 flex flex-col gap-3 transition-opacity">
            {/* Progress Bar */}
            <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden cursor-pointer">
              <div
                className="h-full bg-amber-400 transition-all duration-150"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Bottom Controls */}
            <div className="flex items-center justify-between text-white">
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={togglePlay}
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
                  title={isPlaying ? "Pause" : "Play"}
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                </button>

                <button
                  type="button"
                  onClick={restartVideo}
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
                  title="Restart"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={toggleMute}
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
                  title={isMuted ? "Unmute" : "Mute"}
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>

                <span className="text-xs font-mono text-neutral-300">
                  Legalens Product Overview (Official Video)
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={toggleFullscreen}
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
                  title="Fullscreen"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Video Key Takeaways & Chapters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border border-neutral-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-neutral-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>What You&apos;ll Discover in This Demo</span>
            </h2>
            <ul className="space-y-3 text-xs sm:text-sm text-neutral-600 leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-black mt-2 shrink-0" />
                <span><strong>7 Specialized Legal Lenses:</strong> How to dissect agreements, detect hidden liabilities, and extract critical dates in seconds.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-black mt-2 shrink-0" />
                <span><strong>Multi-lingual Indian Law:</strong> Real-time translation to Hindi, Tamil, Bengali, Telugu, and more with crucial statutory doctrines preserved.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-black mt-2 shrink-0" />
                <span><strong>Zero Data Logging Guarantee:</strong> Ephemeral document parsing compliant with India&apos;s DPDPA 2023 privacy standard.</span>
              </li>
            </ul>

            <div className="pt-2">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-black text-white text-xs font-bold hover:bg-neutral-800 transition-colors shadow-xs"
              >
                <span>Try Legalens Workspace Free</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          <div className="bg-white border border-neutral-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-neutral-900">
              Demo Highlights & Milestones
            </h2>
            <div className="space-y-3">
              {demoChapters.map((chap, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200/80 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-neutral-900">{chap.title}</span>
                    <span className="text-[11px] font-mono text-neutral-400">{chap.time}</span>
                  </div>
                  <p className="text-[11px] text-neutral-500 leading-relaxed">
                    {chap.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 text-xs text-neutral-500">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>DPDPA 2023 Compliant • Grounded in Indian Law</span>
        </div>
      </main>

      <Footer />
    </div>
  );
}
