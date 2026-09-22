"use client";

import { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const EVENTS = [
  {
    id: "01",
    title: "CORE ARCHITECTURE",
    description: "An intensive session dissecting modern systems design and high-performance infrastructure.",
    type: "WORKSHOP",
    status: "UPCOMING",
    visual: "workshop"
  },
  {
    id: "02",
    title: "APEX PROTOCOL",
    description: "48 hours of rapid prototyping, networking, and building intelligent web ecosystems.",
    type: "HACKATHON",
    status: "LIVE",
    visual: "hackathon"
  },
  {
    id: "03",
    title: "THE FUTURE OF COMPUTE",
    description: "A deep dive into decentralization and the edge computing paradigm.",
    type: "TALK",
    status: "UPCOMING",
    visual: "talk"
  },
  {
    id: "04",
    title: "CODE COLLISION",
    description: "A competitive algorithm and optimization challenge for senior developers.",
    type: "COMPETITION",
    status: "COMPLETED",
    visual: "competition"
  },
  {
    id: "05",
    title: "COMPONENT SYSTEMS",
    description: "Hands-on engineering focused on modular, scalable frontend structures.",
    type: "BUILD SESSION",
    status: "UPCOMING",
    visual: "build"
  },
  {
    id: "06",
    title: "FOUNDERS ASSEMBLY",
    description: "A gathering of builders, creators, and engineers sharing their latest experiments.",
    type: "MEETUP",
    status: "COMPLETED",
    visual: "meetup"
  }
];

const EventVisual = ({ type, isActive }: { type: string, isActive: boolean }) => {
  const visualRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!visualRef.current) return;
    if (isActive) {
      gsap.fromTo(visualRef.current.children, 
        { opacity: 0, scale: 0.9, rotate: -5 },
        { opacity: 1, scale: 1, rotate: 0, duration: 0.8, stagger: 0.1, ease: "power3.out" }
      );
    }
  }, { dependencies: [isActive] });

  if (!isActive) return null;

  return (
    <div ref={visualRef} className="absolute inset-0 flex items-center justify-center w-full h-full text-[var(--color-accent)]">
      {type === "workshop" && (
        <svg width="70%" height="70%" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5">
          <line x1="20" y1="0" x2="20" y2="100" className="opacity-40" />
          <line x1="50" y1="0" x2="50" y2="100" className="opacity-40" />
          <line x1="80" y1="0" x2="80" y2="100" className="opacity-40" />
          <line x1="0" y1="20" x2="100" y2="20" className="opacity-40" />
          <line x1="0" y1="50" x2="100" y2="50" className="opacity-40" />
          <line x1="0" y1="80" x2="100" y2="80" className="opacity-40" />
          <rect x="20" y="20" width="30" height="30" fill="currentColor" fillOpacity="0.2" />
          <rect x="50" y="50" width="30" height="30" fill="currentColor" fillOpacity="0.2" />
        </svg>
      )}
      {type === "hackathon" && (
        <svg width="70%" height="70%" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="20" cy="20" r="3" />
          <circle cx="80" cy="30" r="3" />
          <circle cx="50" cy="50" r="5" fill="currentColor" fillOpacity="0.2" />
          <circle cx="30" cy="80" r="3" />
          <circle cx="70" cy="80" r="3" />
          <line x1="22" y1="22" x2="48" y2="48" strokeDasharray="2 4" />
          <line x1="78" y1="32" x2="52" y2="48" strokeDasharray="2 4" />
          <line x1="32" y1="78" x2="48" y2="52" strokeDasharray="2 4" />
          <line x1="68" y1="78" x2="52" y2="52" strokeDasharray="2 4" />
        </svg>
      )}
      {type === "talk" && (
        <svg width="70%" height="70%" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="50" cy="50" r="5" fill="currentColor" />
          <circle cx="50" cy="50" r="15" className="opacity-80" />
          <circle cx="50" cy="50" r="30" className="opacity-50" />
          <circle cx="50" cy="50" r="45" className="opacity-20" />
        </svg>
      )}
      {type === "competition" && (
        <svg width="70%" height="70%" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="50" cy="50" r="40" className="opacity-20" />
          <circle cx="50" cy="50" r="25" className="opacity-40" />
          <circle cx="50" cy="50" r="10" className="opacity-60" />
          <line x1="10" y1="90" x2="50" y2="50" />
          <circle cx="50" cy="50" r="3" fill="currentColor" />
        </svg>
      )}
      {type === "build" && (
        <svg width="70%" height="70%" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="25" y="60" width="50" height="15" />
          <rect x="35" y="45" width="30" height="15" />
          <rect x="45" y="30" width="10" height="15" fill="currentColor" fillOpacity="0.2" />
          <line x1="20" y1="75" x2="80" y2="75" className="opacity-50" />
        </svg>
      )}
      {type === "meetup" && (
        <svg width="70%" height="70%" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M10 10 Q 50 10 50 50" className="opacity-40" />
          <path d="M90 10 Q 50 10 50 50" className="opacity-40" />
          <path d="M10 90 Q 50 90 50 50" className="opacity-40" />
          <path d="M90 90 Q 50 90 50 50" className="opacity-40" />
          <circle cx="50" cy="50" r="6" fill="currentColor" />
        </svg>
      )}
    </div>
  );
};

export default function Events() {
  const containerRef = useRef<HTMLElement>(null);
  const visualContainerRef = useRef<HTMLDivElement>(null);
  const [activeId, setActiveId] = useState("01");
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const displayId = hoveredId || activeId;

  useGSAP(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!prefersReducedMotion) {
      // Intro animations
      gsap.fromTo(".events-intro-el", 
        { opacity: 0, x: -20 }, 
        { 
          opacity: 1, x: 0, 
          duration: 1, 
          stagger: 0.15, 
          ease: "power3.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 70%",
          }
        }
      );

      // Row animations
      gsap.fromTo(".event-row",
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".events-list",
            start: "top 75%",
          }
        }
      );
    }

    // Scroll-driven active state
    const rows = gsap.utils.toArray(".event-row") as HTMLElement[];
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

  // Mouse interaction for the sticky visual area
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion || !visualContainerRef.current) return;

    const handleMouseMove = (e: MouseEvent) => {
      // Very subtle parallax based on mouse position within the window
      const x = (e.clientX / window.innerWidth - 0.5) * 20; 
      const y = (e.clientY / window.innerHeight - 0.5) * 20; 
      
      gsap.to(visualContainerRef.current, {
        x: x,
        y: y,
        duration: 1,
        ease: "power2.out"
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <section ref={containerRef} id="events" className="relative min-h-screen py-32 bg-transparent z-10">
      <div className="max-w-[var(--container-width)] mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
        
        {/* Left Column: Intro & Visual Area */}
        <div className="lg:col-span-5">
          <div className="sticky top-32 flex flex-col gap-12 lg:gap-24">
            
            <div className="flex flex-col">
              <div className="events-intro-el inline-flex items-center gap-4 mb-8">
                <span className="text-xs md:text-sm font-mono text-[var(--color-accent)]">04</span>
                <div className="h-[1px] w-12 bg-[var(--color-accent)]" />
                <span className="text-xs md:text-sm font-mono uppercase tracking-widest text-white/70">Events</span>
              </div>
              <h2 className="events-intro-el font-display font-bold uppercase tracking-tighter leading-[0.9] text-5xl md:text-6xl text-white">
                There&apos;s always <br />
                something <br className="hidden lg:block" />
                happening.
              </h2>
            </div>

            {/* Desktop Visual Area */}
            <div className="events-intro-el hidden lg:flex w-full max-w-[400px] aspect-square border border-white/10 bg-[var(--background)]/50 backdrop-blur-md items-center justify-center relative overflow-hidden">
              <div ref={visualContainerRef} className="absolute inset-0 w-full h-full">
                {EVENTS.map(event => (
                  <EventVisual key={event.id} type={event.visual} isActive={displayId === event.id} />
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Right Column: Event Timeline */}
        <div className="lg:col-span-7 relative">
          
          {/* Global Vertical Timeline Track */}
          <div className="absolute top-0 bottom-0 left-[23px] lg:left-[35px] w-[1px] bg-white/10 z-0" />

          <div className="events-list flex flex-col pb-32">
            {EVENTS.map((event) => {
              const isDominant = displayId === event.id;

              return (
                <div 
                  key={event.id}
                  data-id={event.id}
                  tabIndex={0}
                  role="article"
                  className="event-row relative z-10 py-12 lg:py-20 flex gap-8 lg:gap-16 group cursor-pointer focus:outline-none"
                  onMouseEnter={() => setHoveredId(event.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  onFocus={() => setHoveredId(event.id)}
                  onBlur={() => setHoveredId(null)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setHoveredId(event.id);
                    }
                  }}
                >
                  
                  {/* Active Segment Overlay on Timeline */}
                  <div 
                    className={`absolute top-0 bottom-0 left-[23px] lg:left-[35px] w-[2px] bg-[var(--color-accent)] origin-top transition-transform duration-700 ease-out z-20 ${
                      isDominant ? "scale-y-100" : "scale-y-0"
                    }`} 
                  />

                  {/* Number & Dot */}
                  <div className="relative pt-1 lg:pt-2 flex flex-col items-center w-12 lg:w-20 shrink-0 bg-[var(--background)]/80 backdrop-blur-sm z-30 group-focus-visible:ring-2 group-focus-visible:ring-[var(--color-accent)] group-focus-visible:ring-offset-4 group-focus-visible:ring-offset-[var(--background)]">
                    <span className={`font-mono text-xl lg:text-3xl transition-colors duration-500 bg-[var(--background)] px-1 ${
                      isDominant ? "text-[var(--color-accent)]" : "text-white/30 group-hover:text-white/50"
                    }`}>
                      {event.id}
                    </span>
                    {/* Inner glowing dot on the timeline */}
                    <div className={`mt-6 w-2 h-2 rounded-full transition-all duration-500 absolute top-12 lg:top-16 ${
                      isDominant ? "bg-[var(--color-accent)] scale-150 shadow-[0_0_10px_var(--color-accent)]" : "bg-white/20 scale-100"
                    }`} />
                  </div>

                  {/* Content Area */}
                  <div className="flex-1 flex flex-col relative z-30 pt-1">
                    <span className={`font-mono text-xs md:text-sm uppercase tracking-widest transition-colors duration-500 mb-2 ${
                      isDominant ? "text-white/70" : "text-white/30 group-hover:text-white/50"
                    }`}>
                      Event
                    </span>
                    
                    <h3 className={`font-display font-bold uppercase tracking-tighter text-4xl md:text-5xl lg:text-6xl transition-all duration-500 origin-left ${
                      isDominant ? "text-white scale-100 md:scale-105" : "text-white/40 group-hover:text-white/60 scale-100"
                    }`}>
                      {event.title}
                    </h3>
                    
                    <div className={`flex flex-wrap gap-4 mt-6 font-mono text-xs md:text-sm uppercase tracking-wider transition-colors duration-500 ${
                      isDominant ? "opacity-100" : "opacity-40"
                    }`}>
                      <div className="flex gap-2">
                        <span className="text-white/30">Type //</span>
                        <span className="text-white/90">{event.type}</span>
                      </div>
                      <div className="flex gap-2">
                        <span className="text-white/30">Status //</span>
                        <span className="text-[var(--color-accent)]">{event.status}</span>
                      </div>
                    </div>
                    
                    <div className={`mt-6 overflow-hidden transition-all duration-700 ease-in-out ${
                      isDominant ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
                    }`}>
                      <p className="text-white/70 text-base md:text-lg max-w-lg">
                        {event.description}
                      </p>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
