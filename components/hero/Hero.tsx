"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import dynamic from "next/dynamic";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

const HeroCanvas = dynamic(() => import("./HeroCanvas"), { ssr: false });

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!containerRef.current || !textRef.current) return;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      gsap.set(".hero-element", { opacity: 1, y: 0, rotateX: 0 });
      gsap.set(".hero-canvas", { opacity: 1, scale: 1 });
      return;
    }

    const tl = gsap.timeline({ defaults: { ease: "power4.out", duration: 1.5 } });

    tl.fromTo(
      ".hero-canvas",
      { opacity: 0, scale: 1.2 },
      { opacity: 1, scale: 1, duration: 2.5, ease: "power2.out" },
      0
    )
    .fromTo(
      ".hero-title-line",
      { y: 120, opacity: 0, rotateX: -15, transformOrigin: "bottom center" },
      { y: 0, opacity: 1, rotateX: 0, stagger: 0.2, duration: 1.5, ease: "expo.out" },
      "-=1.8"
    )
    .fromTo(
      ".hero-fade",
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.1, duration: 1 },
      "-=1.2"
    );

    gsap.to(containerRef.current, {
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "bottom top",
        scrub: 1,
      },
      scale: 0.95,
      opacity: 0,
      y: 50,
      ease: "none",
    });

    gsap.to(textRef.current, {
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
      y: -200,
    });
  }, { scope: containerRef });

  return (
    <section 
      ref={containerRef}
      className="relative min-h-[100svh] flex flex-col items-center justify-center overflow-hidden bg-transparent"
    >
      {/* Decorative Grid Overlay */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* WebGL Canvas Background */}
      <div className="hero-canvas hero-element absolute inset-0 z-0 mix-blend-screen opacity-80 [mask-image:radial-gradient(circle_at_center,black_40%,transparent_80%)] pointer-events-none">
        <HeroCanvas />
      </div>

      {/* Main Content */}
      <div ref={textRef} className="relative z-20 flex flex-col items-center justify-center px-4 md:px-12 w-full max-w-[var(--container-width)] mx-auto mt-16 md:mt-0">
        
        {/* Top Badge */}
        <div className="hero-fade hero-element mb-6 md:mb-10 inline-flex items-center gap-3 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-[var(--color-accent)] animate-pulse" />
          <span className="text-xs md:text-sm font-mono tracking-widest uppercase text-white/80">Est. 2026 // Innovate</span>
        </div>

        {/* Title */}
        <h1 className="font-display font-bold tracking-tighter text-center uppercase flex flex-col items-center z-20">
          <div className="overflow-hidden pb-2 md:pb-4">
            <span className="hero-title-line hero-element block text-[13vw] sm:text-7xl md:text-8xl lg:text-[10rem] leading-[0.85] text-white">
              Tech
            </span>
          </div>
          <div className="overflow-hidden pb-2 md:pb-4">
            <span className="hero-title-line hero-element block text-[13vw] sm:text-7xl md:text-8xl lg:text-[10rem] leading-[0.85] text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-primary-dark)]">
              Society
            </span>
          </div>
        </h1>

        {/* Subtitle & CTA */}
        <div className="mt-8 md:mt-12 flex flex-col items-center max-w-2xl text-center">
          <p className="hero-fade hero-element text-base md:text-xl font-sans text-white/60 leading-relaxed text-balance">
            An immersive digital community of builders, creators, and innovators. 
            Pushing the boundaries of student-led technology and engineering.
          </p>
          
          <button 
            onClick={() => {
              import("@/lib/utils/scroll").then((mod) => {
                mod.scrollToSection("about");
              });
            }}
            data-cursor-style="white"
            className="hero-fade hero-element mt-8 md:mt-12 group relative px-8 py-4 bg-white text-black font-bold uppercase tracking-widest text-sm overflow-hidden rounded-full"
          >
            <span className="relative z-10">Discover More</span>
            <div className="absolute inset-0 bg-[var(--color-accent)] transform scale-y-0 origin-bottom transition-transform duration-300 ease-in-out group-hover:scale-y-100" />
            <span className="absolute inset-0 z-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-black font-bold uppercase tracking-widest text-sm">
              Discover More
            </span>
          </button>
        </div>

      </div>

      {/* Decorative Sidebar Lines (Desktop Only) */}
      <div className="hidden md:flex hero-fade hero-element absolute left-8 top-1/2 -translate-y-1/2 flex-col items-center gap-4 z-20">
        <div className="w-[1px] h-24 bg-gradient-to-b from-transparent to-white/30" />
        <span className="text-[10px] font-mono tracking-[0.3em] uppercase [writing-mode:vertical-lr] rotate-180 text-white/50">
          Scroll
        </span>
        <div className="w-[1px] h-24 bg-gradient-to-t from-transparent to-white/30" />
      </div>

      <div className="hidden md:flex hero-fade hero-element absolute right-8 top-1/2 -translate-y-1/2 flex-col items-center gap-4 z-20">
        <span className="text-[10px] font-mono tracking-[0.3em] uppercase [writing-mode:vertical-lr] text-white/50">
          01 / 10
        </span>
      </div>

      {/* Mobile Scroll Indicator */}
      <div className="hero-fade hero-element absolute bottom-8 left-1/2 -translate-x-1/2 flex md:hidden flex-col items-center gap-2 z-20 opacity-60">
        <span className="text-[10px] font-mono tracking-[0.2em] uppercase">Scroll</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-white to-transparent" />
      </div>

    </section>
  );
}
