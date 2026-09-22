"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { COMMUNITY_ACTIVITIES } from "@/data/community";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Community() {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!prefersReducedMotion) {
      gsap.fromTo(".community-intro-el", 
        { opacity: 0, y: 30 }, 
        { 
          opacity: 1, y: 0, 
          duration: 1, 
          stagger: 0.15, 
          ease: "power3.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 70%",
          }
        }
      );

      gsap.fromTo(".activity-item",
        { opacity: 0, scale: 0.95, y: 20 },
        {
          opacity: 1, scale: 1, y: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".activities-list",
            start: "top 75%",
          }
        }
      );
    }
  }, { scope: containerRef });

  return (
    <section ref={containerRef} id="community" className="relative min-h-screen py-32 bg-transparent z-10 flex items-center">
      <div className="max-w-[var(--container-width)] mx-auto px-6 md:px-12 w-full grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8">
        
        {/* Left Column: Intro */}
        <div className="lg:col-span-5 flex flex-col justify-center">
          <div className="community-intro-el inline-flex items-center gap-4 mb-8">
            <span className="text-xs md:text-sm font-mono text-[var(--color-accent)]">05</span>
            <div className="h-[1px] w-12 bg-[var(--color-accent)]" />
            <span className="text-xs md:text-sm font-mono uppercase tracking-widest text-white/70">Community</span>
          </div>
          <h2 className="community-intro-el font-display font-bold uppercase tracking-tighter leading-[0.9] text-5xl md:text-7xl lg:text-8xl text-white">
            Tech is better <br className="hidden lg:block" />
            when it&apos;s <br className="hidden lg:block" />
            shared.
          </h2>
        </div>

        {/* Right Column: Activities Network Field */}
        <div className="lg:col-span-7 relative h-[600px] flex items-center justify-center">
          <div className="absolute inset-0 border border-white/5 bg-white/[0.01] rounded-3xl overflow-hidden group">
            {/* Background grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,black,transparent)]" />
            
            <div className="activities-list relative w-full h-full">
              {COMMUNITY_ACTIVITIES.map((activity, idx) => {
                // Pre-calculated pseudo-random positions for aesthetic distribution
                const positions = [
                  { top: '20%', left: '15%' },
                  { top: '15%', left: '60%' },
                  { top: '45%', left: '75%' },
                  { top: '75%', left: '65%' },
                  { top: '65%', left: '20%' },
                  { top: '45%', left: '35%' },
                ];
                const pos = positions[idx % positions.length];
                
                return (
                  <div 
                    key={idx}
                    className="activity-item absolute group/item cursor-crosshair"
                    style={{ top: pos.top, left: pos.left }}
                  >
                    <div className="relative flex items-center justify-center w-4 h-4">
                      {/* Node point */}
                      <div className="w-1.5 h-1.5 bg-white/20 rounded-full group-hover/item:bg-[var(--color-accent)] transition-colors duration-300 relative z-10" />
                      {/* Hover ring */}
                      <div className="absolute w-full h-full border border-[var(--color-accent)] rounded-full scale-0 opacity-0 group-hover/item:scale-150 group-hover/item:opacity-100 transition-all duration-500 ease-out" />
                    </div>
                    {/* Activity label */}
                    <span className="absolute top-6 left-1/2 -translate-x-1/2 font-mono text-xs uppercase tracking-widest text-white/30 whitespace-nowrap group-hover/item:text-[var(--color-accent)] transition-colors duration-300">
                      [{activity}]
                    </span>
                    {/* Connecting lines (pseudo-elements via border) */}
                    <div className="absolute top-2 left-2 w-[150px] h-[1px] bg-gradient-to-r from-[var(--color-accent)] to-transparent origin-left opacity-0 scale-x-0 group-hover/item:opacity-30 group-hover/item:scale-x-100 transition-all duration-700 ease-out rotate-45 pointer-events-none" />
                    <div className="absolute top-2 left-2 w-[100px] h-[1px] bg-gradient-to-r from-[var(--color-accent)] to-transparent origin-left opacity-0 scale-x-0 group-hover/item:opacity-30 group-hover/item:scale-x-100 transition-all duration-500 ease-out -rotate-[15deg] pointer-events-none delay-75" />
                  </div>
                );
              })}
            </div>
            
            <div className="absolute bottom-6 left-6 font-mono text-[9px] uppercase tracking-widest text-white/20">
              SYS.COMMUNITY_GRAPH // INTERACTIVE
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
