"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import * as THREE from "three";
import { Volume2, VolumeX } from "lucide-react";

interface ThreeSplashScreenProps {
  onComplete: () => void;
}

export default function ThreeSplashScreen({ onComplete }: ThreeSplashScreenProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const [isFadingOut, setIsFadingOut] = useState<boolean>(false);
  const [storyStep, setStoryStep] = useState<number>(0);
  const [isAudioActive, setIsAudioActive] = useState<boolean>(true);

  const handleFinish = useCallback(() => {
    if (isFadingOut) return;
    setIsFadingOut(true);
    setTimeout(() => {
      onComplete();
    }, 600);
  }, [isFadingOut, onComplete]);

  // Storytelling sequence
  useEffect(() => {
    const t1 = setTimeout(() => setStoryStep(1), 1600);
    const t2 = setTimeout(() => setStoryStep(2), 3800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  // Lightweight, GPU-accelerated WebGL ambient beam dust (Zero main-thread lag)
  useEffect(() => {
    const container = canvasContainerRef.current;
    if (!container) return;

    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || window.innerHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 20;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: false,
      powerPreference: "low-power",
      precision: "lowp"
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(1);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // Ambient floating golden dust particles
    const particleCount = 50;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 30;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }

    particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.12,
      color: 0xdfbe7a, // Warm projector amber
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    const onResize = () => {
      if (!container) return;
      width = container.clientWidth;
      height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener("resize", onResize, { passive: true });

    let animationFrameId: number;
    const startTime = performance.now();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = (performance.now() - startTime) / 1000;

      particles.rotation.y = elapsedTime * 0.03;
      particles.rotation.x = Math.sin(elapsedTime * 0.2) * 0.03;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Video autoplay with instant audio unmuting without requiring click
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      onComplete();
      return;
    }

    const video = videoRef.current;
    if (!video) return;

    // Set initial audio volume
    video.volume = 1.0;

    // Helper to immediately activate sound
    const unmuteNow = () => {
      if (videoRef.current) {
        try {
          videoRef.current.muted = false;
          videoRef.current.volume = 1.0;
          setIsAudioActive(true);
        } catch {
          // ignore
        }
      }
    };

    // Try starting unmuted immediately
    video.muted = false;
    video.currentTime = 0;

    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          // Playing unmuted successfully
          setIsAudioActive(true);
        })
        .catch(() => {
          // Browser autoplay policy restricted unmuted playback on reload.
          // Start video playing, and immediately bind passive motion & focus listeners
          // so ANY mouse move, scroll, or window focus immediately unmutes audio!
          video.muted = true;
          video.play().catch(handleFinish);
          setIsAudioActive(false);

          const autoUnmuteOnMotion = () => {
            unmuteNow();
            cleanupMotionListeners();
          };

          const cleanupMotionListeners = () => {
            motionEvents.forEach((evt) => {
              window.removeEventListener(evt, autoUnmuteOnMotion);
            });
          };

          const motionEvents = [
            "pointermove",
            "mousemove",
            "mouseenter",
            "mouseover",
            "wheel",
            "scroll",
            "focus",
            "pageshow",
            "visibilitychange",
            "touchstart",
            "click",
            "keydown"
          ];

          motionEvents.forEach((evt) => {
            window.addEventListener(evt, autoUnmuteOnMotion, { passive: true, once: true });
          });

          // Also attempt rapid polling to unmute as soon as browser unlocks audio
          const pollTimer = setInterval(() => {
            if (videoRef.current && !videoRef.current.paused) {
              try {
                videoRef.current.muted = false;
                if (!videoRef.current.muted) {
                  setIsAudioActive(true);
                  clearInterval(pollTimer);
                }
              } catch {
                // Keep polling
              }
            }
          }, 200);

          setTimeout(() => clearInterval(pollTimer), 5000);
        });
    }

    // High timeout (120s) as safety boundary so full video plays to completion
    const safetyTimer = setTimeout(() => {
      handleFinish();
    }, 120000);

    return () => {
      clearTimeout(safetyTimer);
    };
  }, [handleFinish, onComplete]);

  const toggleSound = () => {
    if (videoRef.current) {
      const nextMuted = !videoRef.current.muted;
      videoRef.current.muted = nextMuted;
      videoRef.current.volume = 1.0;
      setIsAudioActive(!nextMuted);
    }
  };

  return (
    <div
      role="dialog"
      aria-label="LEGALENS Cinematic Splash Screen"
      className={`fixed inset-0 z-[9999] bg-[#000000] flex items-center justify-center transition-all duration-700 select-none overflow-hidden ${
        isFadingOut ? "opacity-0 pointer-events-none scale-105" : "opacity-100"
      }`}
    >
      {/* 1. Core Cinematic Video Background - Hardware GPU Accelerated */}
      <video
        ref={videoRef}
        src="/LegalLens.mp4"
        autoPlay
        playsInline
        preload="auto"
        onEnded={handleFinish}
        onError={() => {
          if (videoRef.current && videoRef.current.src.includes("LegalLens.mp4")) {
            videoRef.current.src = "/Splash.mp4";
            videoRef.current.play().catch(handleFinish);
          } else {
            handleFinish();
          }
        }}
        style={{
          transform: "translateZ(0)",
          willChange: "transform"
        }}
        className="w-full h-full object-cover sm:object-contain bg-black relative z-10"
      />

      {/* Sound Toggle Control (Top Right) */}
      <div className="absolute top-6 right-6 z-40 flex items-center gap-2">
        <button
          type="button"
          onClick={toggleSound}
          className="p-3 rounded-full bg-black/40 hover:bg-black/60 text-white/90 hover:text-white backdrop-blur-md border border-white/20 transition-all shadow-xl cursor-pointer flex items-center gap-2 text-xs font-medium"
          title={isAudioActive ? "Mute audio" : "Unmute audio"}
        >
          {isAudioActive ? (
            <>
              <Volume2 className="w-4 h-4 text-emerald-400 animate-pulse" />
              <span className="hidden sm:inline text-white/90 font-medium">Sound Active</span>
            </>
          ) : (
            <>
              <VolumeX className="w-4 h-4 text-amber-300" />
              <span className="hidden sm:inline text-amber-200 font-medium">Tap for Sound</span>
            </>
          )}
        </button>
      </div>

      {/* 2. Whisper-Light Three.js WebGL Dust Layer (Zero CPU overhead) */}
      <div
        ref={canvasContainerRef}
        className="absolute inset-0 z-20 pointer-events-none mix-blend-screen"
        aria-hidden="true"
      />

      {/* 3. Cinematic Storytelling Text Reveal */}
      <div className="absolute inset-0 z-30 flex flex-col items-center justify-center pointer-events-none text-center px-6">
        <div
          className={`transition-all duration-1000 ease-out transform ${
            storyStep === 0
              ? "opacity-100 translate-y-0 scale-100"
              : storyStep === 1
              ? "opacity-100 -translate-y-4 scale-100"
              : "opacity-0 -translate-y-8 scale-95"
          }`}
        >
          <span className="text-xs uppercase tracking-[0.35em] text-amber-300/90 font-medium mb-3 block drop-shadow-sm">
            Make Yourself Legally Educated
          </span>
          <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight drop-shadow-lg font-serif">
            Welcome to <span className="text-amber-400">Legalens</span>
          </h1>

          <div
            className={`transition-all duration-700 delay-300 mt-4 max-w-lg mx-auto ${
              storyStep >= 1 && storyStep < 2
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-2"
            }`}
          >
            <p className="text-xs sm:text-sm text-neutral-300 font-light tracking-wide leading-relaxed drop-shadow-md">
              Complex Law <span className="text-amber-400 font-bold mx-1">→</span> Legalens <span className="text-amber-400 font-bold mx-1">→</span> Clear Understanding
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
