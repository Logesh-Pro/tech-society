"use client";

import { useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

import { usePathname } from "next/navigation";

const SIGNALS = [15, 35, 60, 85, 98];

export default function GlobalScrollProgress() {
  const pathname = usePathname();
  const [progress, setProgress] = useState(0);
  const [mounted, setMounted] = useState(false);

  const shouldHide = pathname === "/join" || pathname === "/admin" || pathname === "/admin/login";

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      gsap.registerPlugin(ScrollTrigger);

      const st = ScrollTrigger.create({
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          setProgress(self.progress * 100);
        },
      });

      return () => {
        st.kill();
      };
    }
  }, []);

  if (!mounted || shouldHide) return null;

  return (
    <div 
      className="fixed right-2 md:right-3 top-24 bottom-4 z-40 w-2 pointer-events-none flex flex-col items-center" 
      aria-hidden="true"
    >
      {/* Base Rails (Unvisited) */}
      <div className="absolute inset-0 border-l border-r border-white/20 w-full" />

      {/* Base Sleepers (Unvisited) */}
      <div className="absolute inset-0 flex flex-col justify-between py-4 w-4 -ml-1">
        {Array.from({length: 24}).map((_, i) => (
          <div key={i} className="w-full h-[1px] bg-white/20" />
        ))}
      </div>

      {/* Signals */}
      {SIGNALS.map((sigPercent, idx) => {
        const isActive = Math.abs(progress - sigPercent) < 3; // active when train is near
        return (
          <div 
            key={idx}
            className="absolute right-3 w-1.5 h-1.5 rounded-sm border transition-all duration-300"
            style={{ 
              top: `${sigPercent}%`, 
              transform: 'translateY(-50%)',
              borderColor: isActive ? 'var(--color-accent)' : 'rgba(255,255,255,0.1)',
              backgroundColor: isActive ? 'var(--color-accent)' : 'transparent',
              boxShadow: isActive ? '0 0 6px var(--color-accent)' : 'none',
              opacity: isActive ? 1 : 0.3
            }}
          />
        );
      })}

      {/* Active Track (Visited) */}
      <div 
        className="absolute top-0 left-1/2 -translate-x-1/2 w-4 overflow-hidden"
        style={{ height: `${progress}%` }}
      >
        <div className="absolute top-0 left-0 w-full h-[calc(100vh-7rem)] flex flex-col items-center">
          {/* Active Rails */}
          <div className="absolute inset-0 left-1/2 -translate-x-1/2 w-2 border-l border-r border-[var(--color-accent)] opacity-50" />
          
          {/* Active Sleepers */}
          <div className="absolute inset-0 flex flex-col justify-between py-4 w-full">
            {Array.from({length: 24}).map((_, i) => (
              <div key={i} className="w-full h-[1px] bg-[var(--color-accent)] opacity-50" />
            ))}
          </div>
        </div>
      </div>

      {/* Train */}
      <div 
        className="absolute left-1/2 -translate-x-1/2 w-[14px] h-[22px] text-white transition-all duration-100 ease-linear"
        style={{ 
          top: `${progress}%`,
          marginTop: '-11px'
        }}
      >
        <svg 
          viewBox="0 0 16 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="1.5" 
          className="w-full h-full"
        >
          {/* Train Body */}
          <rect x="3" y="2" width="10" height="20" rx="1.5" fill="var(--background)" stroke="white" strokeOpacity="0.3" />
          {/* Windows/Engine blocks */}
          <rect x="5" y="5" width="6" height="5" rx="0.5" stroke="white" strokeOpacity="0.5" />
          <rect x="5" y="14" width="6" height="5" rx="0.5" stroke="white" strokeOpacity="0.5" />
          {/* Connecting mechanics */}
          <line x1="8" y1="10" x2="8" y2="14" className="opacity-30" />
          
          {/* Front Active Light Indicator */}
          <circle cx="8" cy="20" r="1" fill="var(--color-accent)" stroke="none" className="drop-shadow-[0_0_2px_var(--color-accent)]" />
          <circle cx="8" cy="4" r="0.5" fill="var(--color-accent)" stroke="none" className="drop-shadow-[0_0_2px_var(--color-accent)]" />
        </svg>
      </div>
    </div>
  );
}
