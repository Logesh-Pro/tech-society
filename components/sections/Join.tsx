"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import Link from "next/link";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Join() {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!prefersReducedMotion) {
      gsap.fromTo(".join-el", 
        { opacity: 0, y: 40 }, 
        { 
          opacity: 1, y: 0, 
          duration: 1, 
          stagger: 0.2, 
          ease: "power3.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 75%",
          }
        }
      );
    }
  }, { scope: containerRef });

  return (
    <section ref={containerRef} id="join" className="relative min-h-[80vh] flex flex-col items-center justify-center bg-transparent z-10 py-32 px-6">
      
      <div className="join-el inline-flex items-center gap-4 mb-12">
        <span className="text-xs md:text-sm font-mono text-[var(--color-accent)]">07</span>
        <div className="h-[1px] w-12 bg-[var(--color-accent)]" />
        <span className="text-xs md:text-sm font-mono uppercase tracking-widest text-white/70">Join</span>
      </div>

      <h2 className="join-el font-display font-bold uppercase tracking-tighter leading-[0.85] text-6xl md:text-8xl lg:text-[10rem] text-center text-white mb-20 max-w-6xl">
        Your next <br />
        project <br />
        starts here.
      </h2>

      <div className="join-el">
        <Link 
          href="/join"
          data-cursor-style="white"
          className="group relative inline-flex items-center justify-center px-12 py-6 bg-white text-[var(--background)] font-mono font-bold uppercase tracking-widest text-lg md:text-xl transition-transform duration-500 hover:scale-105"
        >
          <span className="relative z-10">Join Tech Society</span>
          <div className="absolute inset-0 bg-[var(--color-accent)] scale-y-0 origin-bottom transition-transform duration-500 group-hover:scale-y-100 z-0" />
        </Link>
      </div>
      
    </section>
  );
}
