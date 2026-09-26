"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Volume2, VolumeX } from "lucide-react";

interface VideoSplashScreenProps {
  onComplete: () => void;
}

export default function VideoSplashScreen({ onComplete }: VideoSplashScreenProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  // Default to unmuted so sound starts from initial load
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [isFadingOut, setIsFadingOut] = useState<boolean>(false);

  const handleFinish = useCallback(() => {
    if (isFadingOut) return;
    setIsFadingOut(true);
    setTimeout(() => {
      onComplete();
    }, 600);
  }, [isFadingOut, onComplete]);

  useEffect(() => {
    // Check reduced motion preference
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      onComplete();
      return;
    }

    const video = videoRef.current;
    if (!video) return;

    // Ensure audio is unmuted and volume is full from initial load
    video.muted = false;
    video.volume = 1.0;

    const attemptUnmutedPlay = async () => {
      try {
        await video.play();
        setIsMuted(false);
      } catch {
        // If browser autoplay policy strictly blocks unmuted audio before interaction:
        // Start muted to ensure video runs without lag, but attach instant global listeners to unmute on first gesture
        video.muted = true;
        setIsMuted(true);
        try {
          await video.play();
        } catch {
          handleFinish();
          return;
        }

        const enableSound = () => {
          if (videoRef.current) {
            videoRef.current.muted = false;
            videoRef.current.volume = 1.0;
            setIsMuted(false);
          }
          cleanupListeners();
        };

        const cleanupListeners = () => {
          window.removeEventListener("click", enableSound);
          window.removeEventListener("pointerdown", enableSound);
          window.removeEventListener("keydown", enableSound);
          window.removeEventListener("touchstart", enableSound);
        };

        window.addEventListener("click", enableSound, { once: true, passive: true });
        window.addEventListener("pointerdown", enableSound, { once: true, passive: true });
        window.addEventListener("keydown", enableSound, { once: true, passive: true });
        window.addEventListener("touchstart", enableSound, { once: true, passive: true });
      }
    };

    attemptUnmutedPlay();

    // Safety fallback timeout (in case video hangs or is longer than 20s)
    const fallbackTimer = setTimeout(() => {
      handleFinish();
    }, 18000);

    return () => {
      clearTimeout(fallbackTimer);
    };
  }, [handleFinish, onComplete]);

  const handleTimeUpdate = () => {
    if (videoRef.current && videoRef.current.duration) {
      const current = videoRef.current.currentTime;
      const total = videoRef.current.duration;
      setProgress((current / total) * 100);
    }
  };

  const toggleSound = () => {
    if (videoRef.current) {
      const newMuted = !videoRef.current.muted;
      videoRef.current.muted = newMuted;
      videoRef.current.volume = 1.0;
      setIsMuted(newMuted);
    }
  };

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-black flex items-center justify-center overflow-hidden transition-opacity duration-700 select-none ${
        isFadingOut ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* Video Player - Unmuted by default */}
      <video
        ref={videoRef}
        src="/Splash.mp4"
        playsInline
        autoPlay
        muted={false}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleFinish}
        onError={handleFinish}
        className="w-full h-full object-cover sm:object-contain bg-black"
      />

      {/* Subtle cinematic gradient overlays */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/60 via-transparent to-black/40" />

      {/* Controls Header */}
      <div className="absolute top-6 right-6 flex items-center gap-3 z-20">
        <button
          onClick={toggleSound}
          className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white/90 hover:text-white backdrop-blur-md border border-white/20 transition-all cursor-pointer shadow-lg"
          title={isMuted ? "Unmute audio" : "Mute audio"}
          type="button"
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-amber-300" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
        </button>
      </div>

      {/* Progress Bar at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10 z-20">
        <div
          className="h-full bg-gradient-to-r from-neutral-400 via-white to-amber-200 transition-all duration-150 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
