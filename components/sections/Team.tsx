"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { TEAM_MEMBERS, TeamMember } from "@/data/team";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const ProfileVisual = ({ type }: { type: string }) => {
  const visualRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion || !visualRef.current) return;

    if (type === "central") {
      gsap.to(visualRef.current, { rotation: 360, duration: 100, repeat: -1, ease: "linear" });
    } else if (type === "ai") {
      gsap.to(visualRef.current.children, { y: "random(-5, 5)", x: "random(-5, 5)", duration: 4, repeat: -1, yoyo: true, ease: "sine.inOut", stagger: 0.2 });
    } else if (type === "web") {
      gsap.to(visualRef.current, { y: 15, duration: 3, repeat: -1, yoyo: true, ease: "sine.inOut" });
    } else if (type === "cyber") {
      gsap.to(visualRef.current, { rotationY: 15, rotationX: 15, duration: 5, repeat: -1, yoyo: true, ease: "sine.inOut" });
    } else if (type === "game") {
      gsap.to(visualRef.current.children, { scale: 1.05, duration: 2, repeat: -1, yoyo: true, ease: "power1.inOut", stagger: 0.5 });
    } else if (type === "faculty") {
      gsap.to(visualRef.current, { scale: 1.05, duration: 10, repeat: -1, yoyo: true, ease: "sine.inOut" });
    }
  }, [type]);

  return (
    <div ref={visualRef} className="absolute inset-0 flex items-center justify-center opacity-30 text-[var(--color-accent)] mix-blend-screen pointer-events-none transform-style-3d">
      {type === "faculty" && (
        <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1">
          <rect x="10" y="10" width="80" height="80" />
          <rect x="20" y="20" width="60" height="60" />
          <line x1="10" y1="10" x2="90" y2="90" />
          <line x1="90" y1="10" x2="10" y2="90" />
        </svg>
      )}
      {type === "central" && (
        <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1">
          <circle cx="50" cy="50" r="10" fill="currentColor" fillOpacity="0.2" />
          <circle cx="50" cy="50" r="30" strokeDasharray="2 4" />
          <circle cx="50" cy="50" r="45" />
          <line x1="50" y1="5" x2="50" y2="20" />
          <line x1="50" y1="80" x2="50" y2="95" />
          <line x1="5" y1="50" x2="20" y2="50" />
          <line x1="80" y1="50" x2="95" y2="50" />
        </svg>
      )}
      {type === "web" && (
        <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1">
          <path d="M0 30 Q 25 10, 50 30 T 100 30" />
          <path d="M0 50 Q 25 30, 50 50 T 100 50" />
          <path d="M0 70 Q 25 50, 50 70 T 100 70" />
        </svg>
      )}
      {type === "ai" && (
        <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1">
          <circle cx="30" cy="30" r="4" />
          <circle cx="70" cy="40" r="4" />
          <circle cx="40" cy="70" r="4" />
          <line x1="32" y1="32" x2="68" y2="38" />
          <line x1="32" y1="32" x2="38" y2="68" />
          <line x1="68" y1="42" x2="42" y2="68" />
        </svg>
      )}
      {type === "cyber" && (
        <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1">
          <polygon points="50,10 90,30 90,70 50,90 10,70 10,30" />
          <polygon points="50,20 80,35 80,65 50,80 20,65 20,35" strokeDasharray="2 4" />
          <circle cx="50" cy="50" r="5" />
        </svg>
      )}
      {type === "game" && (
        <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1">
          <rect x="25" y="25" width="50" height="50" rx="4" />
          <rect x="35" y="35" width="30" height="30" />
          <circle cx="50" cy="50" r="4" fill="currentColor" />
        </svg>
      )}
      {type === "grid" && (
        <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1">
          <line x1="33" y1="0" x2="33" y2="100" />
          <line x1="66" y1="0" x2="66" y2="100" />
          <line x1="0" y1="33" x2="100" y2="33" />
          <line x1="0" y1="66" x2="100" y2="66" />
        </svg>
      )}
    </div>
  );
};

export default function Team() {
  const containerRef = useRef<HTMLElement>(null);
  const modalOverlayRef = useRef<HTMLDivElement>(null);
  const modalContentRef = useRef<HTMLDivElement>(null);
  const profileVisualLayerRef = useRef<HTMLDivElement>(null);
  const profileContentRef = useRef<HTMLDivElement>(null);

  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [lastFocusedElement, setLastFocusedElement] = useState<HTMLElement | null>(null);

  // Group members by category
  const categories = TEAM_MEMBERS.reduce((acc, member) => {
    if (!acc[member.category]) acc[member.category] = [];
    acc[member.category].push(member);
    return acc;
  }, {} as Record<string, typeof TEAM_MEMBERS>);

  // Base Entrance Animation
  useGSAP(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!prefersReducedMotion) {
      gsap.fromTo(".team-intro-el", 
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

      gsap.fromTo(".team-row",
        { opacity: 0, y: 20 },
        {
          opacity: 1, y: 0,
          duration: 0.6,
          stagger: 0.05,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".team-list",
            start: "top 75%",
          }
        }
      );
    }
  }, { scope: containerRef });

  // Modal Open Animation
  useGSAP(() => {
    if (selectedMember) {
      document.body.style.overflow = "hidden";
      
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const isMobile = window.innerWidth < 768;
      
      if (!prefersReducedMotion) {
        gsap.to(modalOverlayRef.current, { opacity: 1, duration: 0.4, ease: "power2.out" });
        gsap.fromTo(modalContentRef.current, 
          { y: isMobile ? 200 : 50, opacity: 0, clipPath: "inset(10% 0 10% 0)", rotationX: isMobile ? 0 : 5 },
          { y: 0, opacity: 1, clipPath: "inset(0% 0 0% 0)", rotationX: 0, duration: 0.7, ease: "power3.out" }
        );
        gsap.fromTo(".modal-stagger", 
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.5, stagger: 0.05, ease: "power3.out", delay: 0.2 }
        );
      } else {
        gsap.set(modalOverlayRef.current, { opacity: 1 });
        gsap.set(modalContentRef.current, { opacity: 1, y: 0, clipPath: "inset(0% 0 0% 0)" });
        gsap.set(".modal-stagger", { opacity: 1, y: 0 });
      }

      modalContentRef.current?.focus();
    } else {
      document.body.style.overflow = "";
      if (lastFocusedElement) {
        lastFocusedElement.focus();
      }
    }
  }, [selectedMember]);

  // 3D Mouse Movement effect
  useGSAP(() => {
    if (!selectedMember) return;
    
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion || window.innerWidth < 768) return;

    const modal = modalContentRef.current;
    if (!modal) return;

    gsap.set(modalOverlayRef.current, { perspective: 1200 });
    gsap.set(modalContentRef.current, { transformStyle: "preserve-3d" });

    const xToModal = gsap.quickTo(modal, "rotationY", { ease: "power3", duration: 0.6 });
    const yToModal = gsap.quickTo(modal, "rotationX", { ease: "power3", duration: 0.6 });
    
    const xToVisual = gsap.quickTo(profileVisualLayerRef.current, "x", { ease: "power3", duration: 0.8 });
    const yToVisual = gsap.quickTo(profileVisualLayerRef.current, "y", { ease: "power3", duration: 0.8 });

    const xToContent = gsap.quickTo(profileContentRef.current, "x", { ease: "power3", duration: 0.5 });
    const yToContent = gsap.quickTo(profileContentRef.current, "y", { ease: "power3", duration: 0.5 });

    const handleMouseMove = (e: MouseEvent) => {
      const rect = modal.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const mouseX = e.clientX;
      const mouseY = e.clientY;
      
      const normX = (mouseX - centerX) / (rect.width / 2);
      const normY = (mouseY - centerY) / (rect.height / 2);
      
      const clampX = Math.max(-1, Math.min(1, normX));
      const clampY = Math.max(-1, Math.min(1, normY));

      // Panel subtle rotation
      xToModal(clampX * 3); 
      yToModal(-clampY * 3); 
      
      // Layers subtle translation (parallax depth)
      xToVisual(-clampX * 15);
      yToVisual(-clampY * 15);
      
      xToContent(-clampX * 4);
      yToContent(-clampY * 4);
    };

    const handleMouseLeave = () => {
      xToModal(0);
      yToModal(0);
      xToVisual(0);
      yToVisual(0);
      xToContent(0);
      yToContent(0);
    };

    window.addEventListener("mousemove", handleMouseMove);
    modal.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      modal.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [selectedMember]);

  const openProfile = (member: TeamMember, e: React.MouseEvent | React.KeyboardEvent) => {
    setLastFocusedElement(e.currentTarget as HTMLElement);
    setSelectedMember(member);
  };

  const closeProfile = useCallback(() => {
    const isMobile = window.innerWidth < 768;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!prefersReducedMotion && modalContentRef.current && modalOverlayRef.current) {
      // Reverse Hierarchy
      gsap.to(".modal-stagger", { opacity: 0, y: -10, duration: 0.3, stagger: -0.05, ease: "power2.in" });
      gsap.to(profileVisualLayerRef.current, { opacity: 0, scale: 0.9, duration: 0.3, ease: "power2.in" });
      
      gsap.to(modalContentRef.current, { 
        y: isMobile ? 200 : 30, opacity: 0, duration: 0.4, ease: "power2.in", delay: 0.1 
      });
      gsap.to(modalOverlayRef.current, { 
        opacity: 0, duration: 0.4, ease: "power2.in", delay: 0.2, onComplete: () => setSelectedMember(null) 
      });
    } else {
      setSelectedMember(null);
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && selectedMember) {
        closeProfile();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedMember, closeProfile]);

  useGSAP(() => {
    gsap.fromTo(".team-row",
      { opacity: 0, x: -20 },
      {
        opacity: 1, x: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".team-list",
          start: "top 75%",
        }
      }
    );
  }, { scope: containerRef });

  const getVisualType = (member: TeamMember) => {
    const cat = member.category.toUpperCase();
    if (cat === "FACULTY") return "faculty";
    if (cat === "CENTRAL LEADERSHIP") return "central";
    if (cat === "MACHINE LEARNING" || cat === "INTELLIGENT SYSTEMS") return "ai";
    if (cat === "WEB DEVELOPMENT") return "web";
    if (cat === "CYBER SECURITY") return "cyber";
    if (cat === "GAME & APP DEVELOPMENT") return "game";
    return "grid";
  };

  return (
    <section ref={containerRef} id="team" className="relative min-h-screen py-32 bg-transparent z-10">
      <div className="max-w-[var(--container-width)] mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8">
        
        {/* Left Column: Intro */}
        <div className="lg:col-span-5">
          <div className="sticky top-32">
            <div className="team-intro-el inline-flex items-center gap-4 mb-8">
              <span className="text-xs md:text-sm font-mono text-[var(--color-accent)]">06</span>
              <div className="h-[1px] w-12 bg-[var(--color-accent)]" />
              <span className="text-xs md:text-sm font-mono uppercase tracking-widest text-white/70">People</span>
            </div>
            <h2 className="team-intro-el font-display font-bold uppercase tracking-tighter leading-[0.9] text-5xl md:text-7xl text-white">
              The builders <br />
              behind the <br />
              society.
            </h2>
          </div>
        </div>

        {/* Right Column: Roster */}
        <div className="lg:col-span-7 team-list">
          {Object.entries(categories).map(([category, members], idx) => (
            <div key={idx} className="mb-24 last:mb-0">
              <h3 className="team-row font-mono text-xs md:text-sm tracking-widest text-[var(--color-accent)] mb-8 border-b border-white/5 pb-4">
                {category}
              </h3>
              <div className="flex flex-col">
                {members.map((member, mIdx) => (
                  <div 
                    key={mIdx}
                    role="button"
                    tabIndex={0}
                    onClick={(e) => openProfile(member, e)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        openProfile(member, e);
                      }
                    }}
                    className="team-row group flex flex-col md:flex-row md:items-center justify-between py-8 md:py-10 border-b border-white/10 cursor-pointer transition-colors duration-500 hover:border-white/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
                  >
                    <h4 className="font-display uppercase font-bold tracking-tighter text-3xl md:text-5xl text-white/80 transition-all duration-500 origin-left group-hover:scale-105 group-hover:text-white">
                      {member.name}
                    </h4>
                    <span className="text-white/40 font-mono text-sm md:text-base uppercase mt-2 md:mt-0 transition-colors duration-500 group-hover:text-[var(--color-accent)]">
                      {member.role}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Profile Modal */}
      <div 
        ref={modalOverlayRef}
        className={`fixed inset-0 z-[100] bg-[var(--background)]/80 backdrop-blur-md flex items-end md:items-center justify-center p-0 md:p-6 opacity-0 ${selectedMember ? "pointer-events-auto" : "pointer-events-none"}`}
        onClick={(e) => {
          if (e.target === modalOverlayRef.current) closeProfile();
        }}
        aria-hidden={!selectedMember}
      >
        <div 
          ref={modalContentRef}
          tabIndex={-1}
          role="dialog"
          aria-modal="true"
          className="w-full md:max-w-3xl bg-[var(--color-base)] border-t md:border border-white/10 p-8 md:p-16 relative overflow-hidden focus:outline-none max-h-[90vh] overflow-y-auto rounded-t-3xl md:rounded-none will-change-transform"
        >
          {selectedMember && (
            <>
              {/* Close Button */}
              <button 
                onClick={closeProfile}
                className="absolute top-6 right-6 w-12 h-12 flex items-center justify-center text-white/50 hover:text-white transition-colors z-20"
                aria-label="Close profile"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>

              {/* Decorative Visual */}
              <div 
                ref={profileVisualLayerRef}
                className="absolute right-0 top-0 w-64 h-64 md:w-96 md:h-96 pointer-events-none will-change-transform"
              >
                <ProfileVisual type={getVisualType(selectedMember)} />
              </div>

              {/* Content */}
              <div ref={profileContentRef} className="relative z-10 will-change-transform">
                <span className="modal-stagger font-mono text-xs uppercase tracking-widest text-[var(--color-accent)] block mb-6">
                  06 / People
                </span>
                
                <h2 className="modal-stagger font-display font-bold uppercase tracking-tighter text-5xl md:text-7xl text-white mb-2 leading-[0.9]">
                  {selectedMember.name}
                </h2>
                
                <p className="modal-stagger font-mono text-lg md:text-xl text-white/70 uppercase tracking-wide mb-12">
                  {selectedMember.role}
                </p>

                <div className="modal-stagger grid grid-cols-2 gap-8 border-t border-white/10 pt-8 mb-12">
                  <div className="flex flex-col gap-2">
                    <span className="font-mono text-xs uppercase tracking-widest text-white/30">Category</span>
                    <span className="font-mono text-sm uppercase text-white">{selectedMember.category}</span>
                  </div>
                  {(selectedMember.department || selectedMember.year) && (
                    <div className="flex flex-col gap-2">
                      <span className="font-mono text-xs uppercase tracking-widest text-white/30">Academic</span>
                      <span className="font-mono text-sm uppercase text-white">
                        {selectedMember.department} {selectedMember.year ? `// Yr ${selectedMember.year}` : ""}
                      </span>
                    </div>
                  )}
                </div>

                {/* Social/Contact Actions */}
                <div className="modal-stagger flex flex-wrap gap-6 pt-4">
                  {selectedMember.linkedin && (
                    <a 
                      href={selectedMember.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-sm uppercase tracking-widest text-white hover:text-[var(--color-accent)] transition-colors underline underline-offset-4 decoration-white/30 hover:decoration-[var(--color-accent)]"
                    >
                      LinkedIn
                    </a>
                  )}
                  {selectedMember.email && (
                    <a 
                      href={`mailto:${selectedMember.email}`}
                      className="font-mono text-sm uppercase tracking-widest text-white hover:text-[var(--color-accent)] transition-colors underline underline-offset-4 decoration-white/30 hover:decoration-[var(--color-accent)]"
                    >
                      Email
                    </a>
                  )}
                  {!selectedMember.linkedin && !selectedMember.email && (
                    <span className="font-mono text-xs uppercase tracking-widest text-white/20">
                      Contact information restricted
                    </span>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      
    </section>
  );
}
