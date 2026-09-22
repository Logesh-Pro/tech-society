"use client";

import { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

import { DOMAINS } from "@/data/domains";

const DomainVisual = ({ type, isActive }: { type: string, isActive: boolean }) => {
  const visualRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!visualRef.current) return;
    if (isActive) {
      gsap.fromTo(visualRef.current.children, 
        { opacity: 0, scale: 0.8, y: 20 },
        { opacity: 1, scale: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "power3.out" }
      );
    }
  }, { dependencies: [isActive] });

  if (!isActive) return null;

  return (
    <div ref={visualRef} className="absolute inset-0 flex items-center justify-center w-full h-full text-[var(--color-accent)]">
      {type === "web" && (
        <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1">
          <rect x="20" y="30" width="40" height="30" />
          <rect x="40" y="45" width="40" height="30" className="opacity-50" strokeDasharray="2 2" />
          <line x1="20" y1="38" x2="60" y2="38" />
        </svg>
      )}
      {type === "ai" && (
        <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1">
          <circle cx="30" cy="50" r="3" fill="currentColor" />
          <circle cx="50" cy="30" r="3" fill="currentColor" />
          <circle cx="50" cy="70" r="3" fill="currentColor" />
          <circle cx="70" cy="50" r="3" fill="currentColor" />
          <line x1="33" y1="48" x2="47" y2="32" className="opacity-50" />
          <line x1="33" y1="52" x2="47" y2="68" className="opacity-50" />
          <line x1="53" y1="32" x2="67" y2="48" className="opacity-50" />
          <line x1="53" y1="68" x2="67" y2="52" className="opacity-50" />
        </svg>
      )}
      {type === "iot" && (
        <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1">
          <circle cx="50" cy="50" r="2" fill="currentColor" />
          <circle cx="50" cy="50" r="15" className="opacity-50" strokeDasharray="2 4" />
          <circle cx="50" cy="50" r="30" className="opacity-20" />
          <circle cx="35" cy="50" r="1.5" fill="currentColor" />
          <circle cx="65" cy="50" r="1.5" fill="currentColor" />
          <circle cx="50" cy="35" r="1.5" fill="currentColor" />
          <circle cx="50" cy="65" r="1.5" fill="currentColor" />
        </svg>
      )}
      {type === "app" && (
        <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1">
          <rect x="35" y="20" width="30" height="60" rx="4" />
          <line x1="45" y1="25" x2="55" y2="25" />
          <rect x="40" y="30" width="20" height="40" className="opacity-30" />
        </svg>
      )}
      {type === "security" && (
        <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1">
          <polygon points="50,20 80,35 80,65 50,80 20,65 20,35" className="opacity-50" />
          <polygon points="50,30 70,40 70,60 50,70 30,60 30,40" />
          <circle cx="50" cy="50" r="2" fill="currentColor" />
        </svg>
      )}
      {type === "cloud" && (
        <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1">
          <rect x="25" y="40" width="15" height="10" />
          <rect x="60" y="30" width="15" height="10" />
          <rect x="50" y="60" width="15" height="10" />
          <path d="M40 45 Q 50 45 50 50 T 60 35" className="opacity-50" strokeDasharray="1 3" />
          <path d="M40 45 Q 45 65 50 65" className="opacity-50" strokeDasharray="1 3" />
        </svg>
      )}
    </div>
  );
};

export default function Domains() {
  const containerRef = useRef<HTMLDivElement>(null);
  const rightColumnRef = useRef<HTMLDivElement>(null);
  const [activeId, setActiveId] = useState("01");
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // Use hoveredId if present, otherwise fallback to scroll-based activeId
  const displayId = hoveredId || activeId;

  useGSAP(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Entrance Animation
    if (!prefersReducedMotion) {
      gsap.fromTo(".domain-intro-el", 
        { opacity: 0, y: 30 }, 
        { 
          opacity: 1, y: 0, 
          duration: 1, 
          stagger: 0.2, 
          ease: "power3.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 70%",
          }
        }
      );

      gsap.fromTo(".domain-row-content",
        { opacity: 0, x: -20 },
        {
          opacity: 1, x: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 60%",
          }
        }
      );

      gsap.fromTo(".domain-line",
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 1.2,
          stagger: 0.1,
          ease: "power3.out",
          transformOrigin: "left center",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 60%",
          }
        }
      );
    }

    // Scroll-driven active state
    const rows = gsap.utils.toArray(".domain-row") as HTMLElement[];
    rows.forEach((row) => {
      const id = row.getAttribute("data-id");
      if (id) {
        ScrollTrigger.create({
          trigger: row,
          start: "top 50%",
          end: "bottom 50%",
          onEnter: () => setActiveId(id),
          onEnterBack: () => setActiveId(id),
        });
      }
    });

  }, { scope: containerRef });

  // Mouse interaction for the right visual area
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion || !rightColumnRef.current) return;

    const handleMouseMove = (e: MouseEvent) => {
      // Very subtle parallax based on mouse position within the window
      const x = (e.clientX / window.innerWidth - 0.5) * 30; // +/- 15px
      const y = (e.clientY / window.innerHeight - 0.5) * 30; // +/- 15px
      
      gsap.to(rightColumnRef.current, {
        x: x,
        y: y,
        rotateX: -y * 0.5,
        rotateY: x * 0.5,
        duration: 1,
        ease: "power2.out"
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <section ref={containerRef} id="domains" className="relative min-h-screen py-32 bg-transparent z-10">
      <div className="max-w-[var(--container-width)] mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">
        
        {/* Left Column: Intro */}
        <div className="lg:col-span-4">
          <div className="sticky top-32">
            <div className="domain-intro-el inline-flex items-center gap-4 mb-8">
              <span className="text-xs md:text-sm font-mono text-[var(--color-accent)]">02</span>
              <div className="h-[1px] w-12 bg-[var(--color-accent)]" />
              <span className="text-xs md:text-sm font-mono uppercase tracking-widest text-white/70">Areas of Exploration</span>
            </div>
            <h2 className="domain-intro-el font-display font-bold uppercase tracking-tighter leading-[0.9] text-5xl md:text-6xl text-white">
              Find your <br className="hidden lg:block" />
              direction.
            </h2>
          </div>
        </div>

        {/* Center Column: List */}
        <div className="lg:col-span-5 flex flex-col pt-12 lg:pt-0">
          {DOMAINS.map((domain) => {
            const isDominant = displayId === domain.id;
            
            return (
              <div 
                key={domain.id}
                data-id={domain.id}
                tabIndex={0}
                role="button"
                aria-pressed={isDominant}
                className="domain-row group relative py-10 lg:py-16 flex flex-col cursor-pointer transition-colors duration-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
                onMouseEnter={() => setHoveredId(domain.id)}
                onMouseLeave={() => setHoveredId(null)}
                onFocus={() => setHoveredId(domain.id)}
                onBlur={() => setHoveredId(null)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setHoveredId(domain.id);
                  }
                }}
              >
                <div className="absolute top-0 left-0 w-full h-[1px] bg-white/10 domain-line group-hover:bg-white/30 transition-colors duration-500" />
                <div className="domain-row-content">
                  <div className="flex items-baseline gap-4 md:gap-8 relative z-10">
                    <span 
                      className={`font-mono text-sm md:text-lg transition-all duration-500 ${
                        isDominant 
                          ? "text-[var(--color-accent)] -translate-y-2" 
                          : "text-white/20 group-hover:text-white/40"
                      }`}
                    >
                      {domain.id}
                    </span>
                    <h3 
                      className={`font-display uppercase font-bold tracking-tighter text-4xl md:text-5xl lg:text-6xl transition-all duration-500 origin-left ${
                        isDominant
                          ? "text-white scale-105"
                          : "text-white/30 group-hover:text-white/60"
                      }`}
                    >
                      {domain.title}
                    </h3>
                  </div>
                  
                  {/* Mobile/Tablet Description (always inline) */}
                  <div 
                    className={`mt-4 pl-12 md:pl-16 transition-all duration-500 lg:hidden ${
                      isDominant ? "opacity-100 h-auto" : "opacity-50"
                    }`}
                  >
                    <p className="text-white/60 text-sm md:text-base">{domain.description}</p>
                  </div>

                  {/* Desktop Description (reveals) */}
                  <div 
                    className={`hidden lg:block mt-6 pl-16 transition-all duration-500 overflow-hidden ${
                      isDominant ? "opacity-100 max-h-40 translate-y-0" : "opacity-0 max-h-0 -translate-y-4"
                    }`}
                  >
                    <p className="text-white/60 text-lg">{domain.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
          <div className="domain-line w-full h-[1px] bg-white/10" />
        </div>

        {/* Right Column: Visual Area (Desktop Only) */}
        <div className="hidden lg:block lg:col-span-3">
          <div className="sticky top-32 w-full aspect-square flex items-center justify-center border border-white/5 bg-black/20 backdrop-blur-sm overflow-hidden" style={{ perspective: "1000px" }}>
            <div ref={rightColumnRef} className="relative w-full h-full transform-style-preserve-3d">
              {DOMAINS.map(domain => (
                <DomainVisual key={domain.id} type={domain.visualType} isActive={displayId === domain.id} />
              ))}
            </div>
            
            {/* Corner Accents for the visual box */}
            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[var(--color-accent)] opacity-50" />
            <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-[var(--color-accent)] opacity-50" />
            <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-[var(--color-accent)] opacity-50" />
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[var(--color-accent)] opacity-50" />
          </div>
        </div>

      </div>
    </section>
  );
}
