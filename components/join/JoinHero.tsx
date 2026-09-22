"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function JoinHero() {
  const heroRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;
    gsap.fromTo(
      heroRef.current?.querySelectorAll(".jh") ?? [],
      { opacity: 0, y: 32 },
      { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: "power3.out", delay: 0.1 }
    );
  }, { scope: heroRef });

  const handleDiscover = () => {
    import("@/lib/utils/scroll").then((mod) => {
      mod.scrollToSection("membership-form");
    });
  };

  return (
    <div
      ref={heroRef}
      className="min-h-[65vh] flex flex-col justify-end px-6 md:px-12 xl:px-24 pt-40 pb-20 max-w-[var(--container-width)] mx-auto relative z-10"
    >
      <p className="jh font-mono text-[10px] tracking-[0.35em] uppercase text-[var(--color-accent)] mb-6">
        Tech Society // Access Request
      </p>

      <h1 className="jh font-display font-bold uppercase tracking-tighter leading-[0.88] text-6xl md:text-8xl xl:text-[9rem] text-white mb-10 max-w-4xl">
        Apply.
        <br />
        <span className="text-white/30">Build.</span>
        <br />
        Belong.
      </h1>

      <div className="jh flex flex-col sm:flex-row items-start sm:items-center gap-8">
        <p className="font-sans text-sm text-white/45 max-w-xs leading-relaxed">
          Join a community of engineers, creators, and makers. One application, no fluff.
        </p>
        <button
          onClick={handleDiscover}
          aria-label="Scroll to the application form"
          data-cursor-style="normal"
          className="group flex items-center gap-4 font-mono text-xs uppercase tracking-widest text-white/60 hover:text-[var(--color-accent)] transition-colors"
        >
          <span>Discover</span>
          <span className="relative flex items-center justify-center w-8 h-8 border border-white/20 group-hover:border-[var(--color-accent)] transition-colors">
            <svg className="w-3.5 h-3.5 translate-y-0 group-hover:translate-y-0.5 transition-transform duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </span>
        </button>
      </div>
    </div>
  );
}
