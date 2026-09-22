"use client";

import { useEffect, useRef, useState } from "react";

export default function TechSocietySignature() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const letterRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const dotRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!mounted || !containerRef.current || !textRef.current || !dotRef.current) return;
    
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile = window.innerWidth < 768;

    if (prefersReducedMotion || isMobile) return;

    // We will use requestAnimationFrame for physical tracking for all tiny letters,
    // to handle velocity lag efficiently in one loop.
    let targetX = 0, targetY = 0;
    let currentX = 0, currentY = 0;
    let velX = 0, velY = 0;
    
    let isHovered = false;
    let lastMouseX = 0, lastMouseY = 0;
    let rafId: number;
    let time = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = containerRef.current!.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const distX = e.clientX - centerX;
      const distY = e.clientY - centerY;
      const dist = Math.sqrt(distX * distX + distY * distY);

      if (dist < 300) {
        isHovered = true;
        const strength = 1 - (dist / 300);
        // REPULSION: move AWAY from cursor
        targetX = -(distX * 0.05 * strength);
        targetY = -(distY * 0.05 * strength);
        
        // Clamp to max 8px
        const currentDist = Math.sqrt(targetX*targetX + targetY*targetY);
        if (currentDist > 8) {
          targetX = (targetX / currentDist) * 8;
          targetY = (targetY / currentDist) * 8;
        }

        // Calculate cursor velocity (simplified)
        velX = e.clientX - lastMouseX;
        velY = e.clientY - lastMouseY;
      } else {
        isHovered = false;
        targetX = 0;
        targetY = 0;
      }
      
      lastMouseX = e.clientX;
      lastMouseY = e.clientY;
    };

    const loop = () => {
      time += 0.02;

      // Inertia interpolation
      currentX += (targetX - currentX) * 0.08;
      currentY += (targetY - currentY) * 0.08;

      // Add velocity lag (spring back to 0)
      velX *= 0.9;
      velY *= 0.9;
      
      const lagX = velX * -0.05;
      const lagY = velY * -0.05;

      // Resting state drift
      let driftX = 0;
      let driftY = 0;
      if (!isHovered) {
        driftX = Math.sin(time) * 1.5;
        driftY = Math.cos(time * 0.8) * 1.5;
      }

      const finalX = currentX + lagX + driftX;
      const finalY = currentY + lagY + driftY;

      // Micro 3D Depth
      const rotX = isHovered ? (currentY / 8) * 1 : 0; 
      const rotY = isHovered ? (currentX / 8) * -1.5 : 0;

      // Apply to main text container
      if (textRef.current) {
        textRef.current.style.transform = `translate3d(${finalX}px, ${finalY}px, ${isHovered ? 2 : 0}px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
        
        const targetSpacing = isHovered ? 0.2 : 0.1;
        const currentSpacing = parseFloat(textRef.current.style.letterSpacing || "0.1");
        const newSpacing = currentSpacing + (targetSpacing - currentSpacing) * 0.1;
        textRef.current.style.letterSpacing = `${newSpacing}em`;
        
        const targetOpacity = isHovered ? 0.8 : 0.3;
        const currentOpacity = parseFloat(textRef.current.style.opacity || "0.3");
        textRef.current.style.opacity = `${currentOpacity + (targetOpacity - currentOpacity) * 0.1}`;
      }

      // Individual letters
      letterRefs.current.forEach((letter, i) => {
        if (!letter) return;
        // Letters closer to cursor move more. We simulate this by offsetting slightly based on index
        const offsetMult = (i - 5.5) * 0.1; 
        const lx = currentX * 0.3 * offsetMult;
        const ly = currentY * 0.3 * offsetMult;
        letter.style.transform = `translate3d(${lx}px, ${ly}px, 0)`;
      });

      // Dot Orbit
      const dotTargetOpacity = isHovered ? 1 : 0;
      const currentDotOpacity = parseFloat(dotRef.current?.style.opacity || "0");
      const newDotOpacity = currentDotOpacity + (dotTargetOpacity - currentDotOpacity) * 0.1;
      
      if (dotRef.current) {
        const orbitRadiusX = 12 * newDotOpacity;
        const orbitRadiusY = 30 * newDotOpacity;
        const orbitSpeed = time * 2;
        const dotX = Math.sin(orbitSpeed) * orbitRadiusX;
        const dotY = Math.cos(orbitSpeed) * orbitRadiusY;
        
        dotRef.current.style.transform = `translate3d(${dotX}px, ${dotY}px, 0)`;
        dotRef.current.style.opacity = `${newDotOpacity}`;
      }

      rafId = requestAnimationFrame(loop);
    };

    window.addEventListener("mousemove", handleMouseMove);
    rafId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, [mounted]);

  if (!mounted) return null;

  const chars = "TECH SOCIETY".split("");

  return (
    <div 
      ref={containerRef}
      className="hidden md:flex fixed right-8 bottom-12 z-40 w-8 h-64 items-center justify-center pointer-events-none"
      style={{ perspective: "400px" }}
    >
      <div 
        ref={textRef}
        className="relative flex items-center justify-center [writing-mode:vertical-rl] rotate-180 font-mono text-[10px] uppercase text-white tracking-[0.1em] whitespace-nowrap will-change-transform opacity-30"
        style={{ transformStyle: "preserve-3d" }}
      >
        {chars.map((char, i) => (
          <span 
            key={i} 
            ref={el => { letterRefs.current[i] = el; }}
            className={char === " " ? "my-1" : "will-change-transform inline-block"}
          >
            {char}
          </span>
        ))}
        <div 
          ref={dotRef}
          className="absolute top-1/2 left-1/2 w-1 h-1 bg-[var(--color-accent)] rounded-full opacity-0 shadow-[0_0_8px_var(--color-accent)] pointer-events-none will-change-transform -ml-0.5 -mt-0.5" 
        />
      </div>
    </div>
  );
}
