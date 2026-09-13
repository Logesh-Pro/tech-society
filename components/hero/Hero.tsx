"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Basic setup for future GSAP animations
    const ctx = gsap.context(() => {
      // Animation logic will go here
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={containerRef}
      className="relative min-h-screen flex flex-col items-center justify-center border-b border-white/10 pt-20"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/0 to-black/50 pointer-events-none" />
      <h1 className="text-5xl md:text-8xl font-bold tracking-tighter text-center max-w-5xl z-10">
        01 — HERO
      </h1>
      <p className="text-xl md:text-2xl mt-6 opacity-60 max-w-2xl text-center z-10">
        Immersive Digital Experience Placeholder
      </p>
    </section>
  );
}
