"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import * as THREE from "three";

interface ThreeSplashScreenProps {
  onComplete: () => void;
}

export default function ThreeSplashScreen({ onComplete }: ThreeSplashScreenProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const [isFadingOut, setIsFadingOut] = useState<boolean>(false);
  const [storyStep, setStoryStep] = useState<number>(0);
  const isFinishedRef = useRef<boolean>(false);
  const cleanupListenersRef = useRef<(() => void) | null>(null);

  const handleFinish = useCallback(() => {
    if (isFinishedRef.current) return;
    isFinishedRef.current = true;

    // Immediately stop and mute the video so it never attempts to replay or stutter
    if (videoRef.current) {
      try {
        videoRef.current.pause();
        videoRef.current.muted = true;
      } catch {
        // ignore
      }
    }

    // Clean up all global motion listeners immediately
    if (cleanupListenersRef.current) {
      cleanupListenersRef.current();
      cleanupListenersRef.current = null;
    }

    setIsFadingOut(true);
    setTimeout(() => {
      onComplete();
    }, 700);
  }, [onComplete]);

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
      handleFinish();
      return;
    }

    const video = videoRef.current;
    if (!video) return;

    // Set initial audio volume
    video.volume = 1.0;

    // Helper to immediately activate sound
    const unmuteNow = () => {
      if (isFinishedRef.current) return;
      if (videoRef.current) {
        try {
          videoRef.current.muted = false;
          videoRef.current.volume = 1.0;
        } catch {
          // ignore
        }
      }
    };

    const motionEvents = [
      "pointerdown",
      "pointermove",
      "mousemove",
      "mouseenter",
      "mouseover",
      "wheel",
      "scroll",
      "touchstart",
      "click",
      "keydown"
    ];

    const autoUnmuteOnMotion = () => {
      if (isFinishedRef.current) return;
      unmuteNow();
      cleanupMotionListeners();
    };

    const cleanupMotionListeners = () => {
      motionEvents.forEach((evt) => {
        window.removeEventListener(evt, autoUnmuteOnMotion);
      });
    };

    cleanupListenersRef.current = cleanupMotionListeners;

    // Try starting unmuted immediately
    video.muted = false;
    video.currentTime = 0;

    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          // Playing unmuted successfully from start
        })
        .catch(() => {
          // Browser autoplay policy restricted unmuted playback on initial load.
          if (isFinishedRef.current) return;
          video.muted = true;
          video.play().catch(() => {});

          motionEvents.forEach((evt) => {
            window.addEventListener(evt, autoUnmuteOnMotion, { passive: true, once: true });
          });
        });
    }

    // Safety timeout giving the video full time to complete
    const safetyTimer = setTimeout(() => {
      handleFinish();
    }, 32000);

    return () => {
      clearTimeout(safetyTimer);
      cleanupMotionListeners();
    };
  }, [handleFinish]);

  return (
    <div
      role="dialog"
      aria-label="LEGALENS Cinematic Splash Screen"
      className={`fixed inset-0 z-[9999] bg-[#000000] flex items-center justify-center transition-opacity duration-700 ease-in-out select-none overflow-hidden ${
        isFadingOut ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* 1. Core Cinematic Video Background - Hardware GPU Accelerated */}
      <video
        ref={videoRef}
        src="/@LegalLens.mp4"
        autoPlay
        playsInline
        preload="auto"
        onEnded={() => {
          if (videoRef.current) {
            try {
              videoRef.current.pause();
              videoRef.current.muted = true;
            } catch {
              // ignore
            }
          }
          handleFinish();
        }}
        onError={() => {
          if (videoRef.current && !videoRef.current.src.endsWith("/LegalLens.mp4")) {
            videoRef.current.src = "/LegalLens.mp4";
            videoRef.current.play().catch(() => {});
          }
        }}
        style={{
          transform: "translateZ(0)",
          willChange: "transform"
        }}
        className="w-full h-full object-cover sm:object-contain bg-black relative z-10"
      />

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
