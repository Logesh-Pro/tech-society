"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function About() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useGSAP(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    // Pinning the section to create a sequence
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "+=200%", // pin for a while
        pin: true,
        scrub: 1,
      },
    });

    // 1. Reveal Label
    tl.fromTo(".about-label", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5 })
    
    // 2. Reveal Main Statement with clip/y transform
    .fromTo(".about-statement-1", { y: "100%", opacity: 0 }, { y: "0%", opacity: 1, duration: 0.8, stagger: 0.1, ease: "power3.out" })
    .fromTo(".about-statement-2", { y: "100%", opacity: 0 }, { y: "0%", opacity: 1, duration: 0.8, stagger: 0.1, ease: "power3.out" }, "-=0.4")
    
    // 3. Subtle connecting lines / nodes
    .fromTo(".about-node", { opacity: 0, scale: 0 }, { opacity: 1, scale: 1, stagger: 0.1, duration: 0.5 }, "-=0.5")
    .fromTo(".about-line-draw", { scaleY: 0 }, { scaleY: 1, transformOrigin: "top", duration: 0.8, ease: "power3.out" }, "-=0.3")

    // 4. Sequential Action Words (BUILD / DESIGN / LEARN / SHIP)
    .fromTo(".action-word", 
      { opacity: 0, x: -20 }, 
      { opacity: 1, x: 0, stagger: 0.2, duration: 0.8, ease: "power2.out" },
      "-=0.2"
    )
    
    // 5. Reveal Description text
    .fromTo(".about-description", 
      { opacity: 0, y: 30 }, 
      { opacity: 1, y: 0, duration: 0.8 }, 
      "-=0.4"
    );

    // Subtle parallax background line
    gsap.to(".bg-line", {
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
      y: 300,
      opacity: 0.2,
    });

  }, { scope: containerRef });

  return (
    <section ref={containerRef} id="about" className="relative min-h-screen flex items-center justify-center bg-transparent overflow-hidden">
      
      {/* Background Decor (Nodes/Lines) */}
      <div className="absolute left-1/4 top-0 w-[1px] h-[200%] bg-gradient-to-b from-transparent via-[var(--color-accent)] to-transparent opacity-10 bg-line pointer-events-none" />
      <div className="absolute right-1/4 top-[-50%] w-[1px] h-[200%] bg-gradient-to-b from-transparent via-white to-transparent opacity-5 bg-line pointer-events-none" />
      
      {/* Network Formation Visuals */}
      <div className="absolute top-[20%] left-[20%] z-0 flex flex-col items-center">
        <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] about-node" />
        <div className="w-[1px] h-32 bg-[var(--color-accent)]/30 about-line-draw" />
        <div className="w-1 h-1 rounded-full bg-white about-node" />
      </div>

      <div className="max-w-[var(--container-width)] mx-auto px-6 md:px-12 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 relative z-10">
        
        {/* Left Column: Label & Sequential Words */}
        <div className="lg:col-span-4 flex flex-col justify-between">
          <div className="about-label inline-flex items-center gap-4 mb-12 lg:mb-0">
            <span className="text-xs md:text-sm font-mono text-[var(--color-accent)]">01</span>
            <div className="h-[1px] w-12 bg-[var(--color-accent)]" />
            <span className="text-xs md:text-sm font-mono uppercase tracking-widest text-white/70">The Community</span>
          </div>

          <div className="hidden lg:flex flex-col gap-4 mt-auto">
            {["BUILD", "DESIGN", "LEARN", "SHIP"].map((word, i) => (
              <span key={word} className={`action-word font-display text-4xl lg:text-6xl font-bold uppercase tracking-tighter ${i === 0 ? "text-[var(--color-accent)]" : "text-white/10"}`}>
                {word}.
              </span>
            ))}
          </div>
        </div>

        {/* Right Column: Statements & Description */}
        <div className="lg:col-span-8 flex flex-col justify-center">
          <h2 className="font-display font-bold uppercase tracking-tighter leading-[0.9] text-5xl sm:text-6xl md:text-7xl lg:text-[6rem]">
            <span className="block overflow-hidden pb-2"><span className="about-statement-1 block text-white/50">We don&apos;t just</span></span>
            <span className="block overflow-hidden pb-2"><span className="about-statement-1 block text-white/50">learn technology.</span></span>
            <span className="block overflow-hidden pb-2"><span className="about-statement-2 block text-white">We build</span></span>
            <span className="block overflow-hidden pb-2"><span className="about-statement-2 block text-white">with it.</span></span>
          </h2>

          <div className="flex lg:hidden flex-wrap gap-4 mt-12">
            {["BUILD", "DESIGN", "LEARN", "SHIP"].map((word, i) => (
              <span key={word} className={`action-word font-display text-3xl font-bold uppercase tracking-tighter ${i === 0 ? "text-[var(--color-accent)]" : "text-white/20"}`}>
                {word}.
              </span>
            ))}
          </div>

          <div className="about-description mt-12 md:mt-16 max-w-xl">
            <p className="text-base md:text-lg lg:text-xl text-white/60 font-sans leading-relaxed text-balance">
              Tech Society is a collective of ambitious student engineers, designers, and visionaries. 
              We bridge the gap between theoretical knowledge and industry-grade execution. 
              Here, ideas evolve into tangible digital experiences, driven by a culture of relentless innovation.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
