"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

import { PROJECTS } from "@/data/projects";

const ProjectVisual = ({ type }: { type: string }) => {
  return (
    <div className="w-full h-full flex items-center justify-center text-white/20 transition-colors duration-500 group-hover:text-[var(--color-accent)]">
      {type === "ai" && (
        <svg width="60%" height="60%" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="30" cy="30" r="10" className="project-fragment" />
          <circle cx="70" cy="70" r="10" className="opacity-50 project-fragment" />
          <path d="M40 40 L60 60" className="opacity-50 project-fragment" />
          <circle cx="70" cy="30" r="4" className="project-fragment" />
          <path d="M40 35 L60 35" className="opacity-30 project-fragment" strokeDasharray="2 2" />
        </svg>
      )}
      {type === "iot" && (
        <svg width="60%" height="60%" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="50" cy="50" r="2" fill="currentColor" className="project-fragment" />
          <circle cx="50" cy="50" r="15" strokeDasharray="2 4" className="project-fragment" />
          <circle cx="50" cy="50" r="30" className="opacity-30 project-fragment" />
          <path d="M50 20 L50 10 M50 80 L50 90 M20 50 L10 50 M80 50 L90 50" className="opacity-50 project-fragment" />
        </svg>
      )}
      {type === "data" && (
        <svg width="60%" height="60%" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="20" y="60" width="15" height="30" className="project-fragment" />
          <rect x="45" y="40" width="15" height="50" className="opacity-70 project-fragment" />
          <rect x="70" y="20" width="15" height="70" className="opacity-40 project-fragment" />
          <path d="M20 50 L45 30 L70 10" className="opacity-50 project-fragment" strokeDasharray="2 2" />
          <circle cx="70" cy="10" r="3" className="project-fragment" />
        </svg>
      )}
      {type === "robotics" && (
        <svg width="60%" height="60%" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="30" y="30" width="40" height="40" rx="5" className="project-fragment" />
          <circle cx="40" cy="45" r="4" className="project-fragment" />
          <circle cx="60" cy="45" r="4" className="project-fragment" />
          <path d="M40 65 L60 65" className="project-fragment" />
          <path d="M30 50 L15 50" className="opacity-50 project-fragment" />
          <path d="M70 50 L85 50" className="opacity-50 project-fragment" />
        </svg>
      )}
      {type === "blockchain" && (
        <svg width="60%" height="60%" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="40" y="20" width="20" height="20" className="project-fragment" />
          <rect x="20" y="60" width="20" height="20" className="opacity-50 project-fragment" />
          <rect x="60" y="60" width="20" height="20" className="opacity-50 project-fragment" />
          <path d="M50 40 L30 60" className="opacity-50 project-fragment" />
          <path d="M50 40 L70 60" className="opacity-50 project-fragment" />
          <path d="M40 45 Q 45 65 50 65" className="opacity-50 project-fragment" strokeDasharray="1 3" />
        </svg>
      )}
      {type === "web" && (
        <svg width="60%" height="60%" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="15" y="25" width="70" height="50" rx="2" className="project-fragment" />
          <line x1="15" y1="35" x2="85" y2="35" className="opacity-50 project-fragment" />
          <rect x="25" y="45" width="20" height="20" className="opacity-50 project-fragment" />
          <rect x="50" y="45" width="25" height="8" className="opacity-50 project-fragment" />
          <rect x="50" y="57" width="25" height="8" className="opacity-50 project-fragment" />
        </svg>
      )}
      {type === "cyber" && (
        <svg width="60%" height="60%" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5">
          <polygon points="50,15 85,30 85,70 50,85 15,70 15,30" className="project-fragment" />
          <polygon points="50,25 75,37 75,63 50,75 25,63 25,37" className="opacity-50 project-fragment" />
          <circle cx="50" cy="50" r="6" className="project-fragment" />
        </svg>
      )}
      {type === "cloud" && (
        <svg width="60%" height="60%" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="20" y="30" width="20" height="15" rx="2" className="project-fragment" />
          <rect x="60" y="20" width="20" height="15" rx="2" className="project-fragment" />
          <rect x="40" y="60" width="20" height="15" rx="2" className="project-fragment" />
          <path d="M40 37 L60 27 M30 45 L40 60 M70 35 L60 60" className="opacity-40 project-fragment" strokeDasharray="2 3" />
        </svg>
      )}
    </div>
  );
};

export default function Projects() {
  const containerRef = useRef<HTMLElement>(null);
  const [activeId, setActiveId] = useState("01");
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const displayId = hoveredId || activeId;

  useGSAP(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!prefersReducedMotion) {
      // Intro animations
      gsap.fromTo(".project-intro-el", 
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

      // Row fragment animations
      gsap.fromTo(".project-row-num",
        { opacity: 0, x: -30 },
        {
          opacity: 1, x: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: { trigger: ".projects-list", start: "top 75%" }
        }
      );
      gsap.fromTo(".project-row-meta",
        { opacity: 0, y: 20 },
        {
          opacity: 1, y: 0,
          duration: 0.8,
          stagger: 0.15,
          delay: 0.2,
          ease: "power3.out",
          scrollTrigger: { trigger: ".projects-list", start: "top 75%" }
        }
      );
      gsap.fromTo(".project-row-title",
        { opacity: 0, clipPath: "inset(0 100% 0 0)" },
        {
          opacity: 1, clipPath: "inset(0 0% 0 0)",
          duration: 1,
          stagger: 0.15,
          delay: 0.4,
          ease: "power4.out",
          scrollTrigger: { trigger: ".projects-list", start: "top 75%" }
        }
      );
      gsap.fromTo(".project-row-desc",
        { opacity: 0, x: 30 },
        {
          opacity: 1, x: 0,
          duration: 1,
          stagger: 0.15,
          delay: 0.5,
          ease: "power3.out",
          scrollTrigger: { trigger: ".projects-list", start: "top 75%" }
        }
      );
      gsap.fromTo(".project-row-visual",
        { opacity: 0, scale: 0.8 },
        {
          opacity: 1, scale: 1,
          duration: 1,
          stagger: 0.15,
          delay: 0.6,
          ease: "back.out(1.5)",
          scrollTrigger: { trigger: ".projects-list", start: "top 75%" }
        }
      );
    }

    // Scroll-driven active state
    const rows = gsap.utils.toArray(".project-row") as HTMLElement[];
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

  return (
    <section ref={containerRef} id="projects" className="relative min-h-screen py-32 bg-transparent z-10">
      <div className="max-w-[var(--container-width)] mx-auto px-6 md:px-12">
        
        {/* Intro Section */}
        <div className="mb-24 lg:mb-32">
          <div className="project-intro-el inline-flex items-center gap-4 mb-8">
            <span className="text-xs md:text-sm font-mono text-[var(--color-accent)]">03</span>
            <div className="h-[1px] w-12 bg-[var(--color-accent)]" />
            <span className="text-xs md:text-sm font-mono uppercase tracking-widest text-white/70">Projects</span>
          </div>
          <h2 className="project-intro-el font-display font-bold uppercase tracking-tighter leading-[0.9] text-5xl md:text-7xl lg:text-8xl text-white max-w-4xl">
            Ideas become <br />
            real things.
          </h2>
          <p className="project-intro-el mt-8 text-lg md:text-xl text-white/60 max-w-xl font-light">
            From experiments to working products, we learn by building.
          </p>
        </div>

        {/* Projects List */}
        <div className="projects-list flex flex-col">
          {PROJECTS.map((project) => {
            const isDominant = displayId === project.id;

            return (
              <div 
                key={project.id}
                data-id={project.id}
                tabIndex={0}
                role="article"
                className={`project-row group relative border-t border-white/10 py-12 lg:py-20 flex flex-col lg:flex-row lg:items-center gap-8 cursor-pointer transition-all duration-700 outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] ${
                  isDominant ? "opacity-100" : "opacity-40 hover:opacity-70"
                }`}
                onMouseEnter={() => setHoveredId(project.id)}
                onMouseLeave={() => setHoveredId(null)}
                onFocus={() => setHoveredId(project.id)}
                onBlur={() => setHoveredId(null)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setHoveredId(project.id);
                  }
                }}
              >
                {/* Number & Title Area */}
                <div className="lg:w-1/2 flex flex-col md:flex-row md:items-baseline gap-4 md:gap-8 lg:pr-12">
                  <span className={`project-row-num font-mono text-lg transition-colors duration-500 ${
                    isDominant ? "text-[var(--color-accent)]" : "text-white/30"
                  }`}>
                    {project.id}
                  </span>
                  <div>
                    <h3 className={`project-row-title font-display uppercase font-bold tracking-tighter text-4xl md:text-5xl lg:text-6xl transition-transform duration-500 origin-left ${
                      isDominant ? "text-white scale-105" : "text-white scale-100"
                    }`}>
                      {project.title}
                    </h3>
                  </div>
                </div>

                {/* Description & Metadata */}
                <div className="lg:w-1/3 flex flex-col gap-6">
                  <p className={`project-row-desc text-base md:text-lg transition-colors duration-500 ${
                    isDominant ? "text-white/80" : "text-white/50"
                  }`}>
                    {project.description}
                  </p>
                  
                  <div className="project-row-meta flex flex-wrap gap-6 font-mono text-xs md:text-sm uppercase tracking-wider">
                    <div className="flex flex-col gap-1">
                      <span className="text-white/30">Domain</span>
                      <span className={isDominant ? "text-[var(--color-accent)]" : "text-white/70"}>
                        {project.domain}
                      </span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-white/30">Status</span>
                      <span className={isDominant ? "text-white" : "text-white/70"}>
                        {project.status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Visual Area */}
                <div className="project-row-visual hidden lg:flex lg:w-1/6 justify-end">
                  <div className={`w-32 h-32 border transition-all duration-500 flex items-center justify-center ${
                    isDominant 
                      ? "border-[var(--color-accent)]/30 bg-[var(--color-accent)]/5 scale-110" 
                      : "border-white/5 bg-white/0 scale-100"
                  }`}>
                    <ProjectVisual type={project.visual} />
                  </div>
                </div>
              </div>
            );
          })}
          <div className="border-t border-white/10 w-full" />
        </div>

      </div>
    </section>
  );
}
