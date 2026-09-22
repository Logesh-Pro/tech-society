"use client";

import { useEffect, useRef, useState, useMemo } from "react";

type BackgroundElement = {
  id: string;
  type: "text" | "tech-label" | "sys-label" | "bracket" | "v-line" | "h-line" | "grid" | "crosshair" | "box" | "ring";
  content: string;
  x: number; // vw
  y: number; // vh
  scale: number;
  rotation: number;
  layer: "ultra-near" | "near" | "mid" | "far";
  baseOpacity: number;
};

const TECH_TERMS = [
  "REACT", "NEXT.JS", "TAILWIND", "TYPESCRIPT", "JAVASCRIPT", 
  "GSAP", "THREE.JS", "WEBGL", "NODE", "GITHUB", 
  "API", "AI", "ML", "IOT", "OPEN SOURCE"
];

const SYS_LABELS = [
  "//", "{}", "[]", "</>", ".tsx", ".css", ".json", "/api", "/src", "/components",
  "COMPONENT", "MODULE", "BUILD", "DEPLOY", "COMMIT", "PUSH", "MERGE"
];

function generateElements(isMobile: boolean): BackgroundElement[] {
  const elements: BackgroundElement[] = [];
  const count = isMobile ? 30 : 100;

  const getLayer = (i: number) => {
    if (i % 6 === 0) return "ultra-near"; 
    if (i % 3 === 0) return "near";       
    if (i % 2 === 0) return "mid";        
    return "far";                         
  };

  const getOpacity = (layer: string, type: string) => {
    let op = 0.15;
    if (layer === "ultra-near") op = 0.08; 
    else if (layer === "near") op = 0.12;
    else if (layer === "mid") op = 0.18;
    else op = 0.25; 
    
    if (type === "text" || type === "tech-label" || type === "sys-label") op *= 0.85;
    return op;
  };

  for (let i = 0; i < count; i++) {
    const layer = getLayer(i);
    
    let type: BackgroundElement["type"];
    const typeRoll = Math.random();
    if (typeRoll < 0.15) type = "text"; 
    else if (typeRoll < 0.35) type = "tech-label";
    else if (typeRoll < 0.50) type = "sys-label";
    else if (typeRoll < 0.60) type = "bracket";
    else if (typeRoll < 0.70) type = "v-line";
    else if (typeRoll < 0.80) type = "h-line";
    else if (typeRoll < 0.85) type = "grid";
    else if (typeRoll < 0.90) type = "crosshair";
    else if (typeRoll < 0.95) type = "box";
    else type = "ring";

    // Keep elements towards the edges to avoid center collision
    let x = Math.random() * 120 - 10;
    let y = Math.random() * 120 - 10;
    
    // Push away from exact center area to protect main typography
    if (x > 30 && x < 70 && y > 30 && y < 70) {
      if (Math.random() > 0.5) {
        x = x > 50 ? x + 25 : x - 25;
      } else {
        y = y > 50 ? y + 25 : y - 25;
      }
    }

    let content = "";
    if (type === "text") {
      content = ["{", "}", "[", "]", "<", ">", "/", "+", "="][Math.floor(Math.random() * 9)];
    } else if (type === "tech-label") {
      content = TECH_TERMS[Math.floor(Math.random() * TECH_TERMS.length)];
    } else if (type === "sys-label") {
      content = SYS_LABELS[Math.floor(Math.random() * SYS_LABELS.length)];
    }

    // Scale depends on layer
    let baseScale = Math.random() * 1 + 0.5;
    if (layer === "ultra-near") baseScale *= 2;
    else if (layer === "near") baseScale *= 1.5;
    else if (layer === "mid") baseScale *= 1;
    else baseScale *= 0.8;

    elements.push({
      id: `bg-el-${i}`,
      type,
      content,
      x,
      y,
      scale: baseScale,
      rotation: Math.random() * 360,
      layer,
      baseOpacity: getOpacity(layer, type)
    });
  }
  return elements;
}

export default function GlobalBracketField() {
  const elementsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      setIsMobile(window.matchMedia("(max-width: 768px)").matches);
      setIsClient(true);
    }, 0);
    return () => clearTimeout(t);
  }, []);

  const elements = useMemo(() => {
    if (!isClient) return [];
    return generateElements(isMobile);
  }, [isClient, isMobile]);

  useEffect(() => {
    if (!isClient || elements.length === 0 || isMobile) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let scrollPercent = 0;
    let animationFrameId: number;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      // Mouse interaction is very subtle: 1-6px as requested
      targetX = ((mouseX - centerX) / centerX) * 6;
      targetY = ((mouseY - centerY) / centerY) * 6;
    };

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll = Math.max(1, document.body.scrollHeight - window.innerHeight);
      scrollPercent = scrollY / maxScroll;
    };

    const loop = () => {
      currentX += (targetX - currentX) * 0.05;
      currentY += (targetY - currentY) * 0.05;

      const time = performance.now() * 0.0005;

      elementsRef.current.forEach((el, index) => {
        if (!el) return;
        const data = elements[index];
        if (!data) return;

        let depthMultiplier = 0;
        let rotateMultiplier = 0;
        let scrollParallax = 0;

        if (data.layer === "ultra-near") {
          depthMultiplier = 1; rotateMultiplier = 4; scrollParallax = -scrollPercent * 600;
        } else if (data.layer === "near") {
          depthMultiplier = 0.5; rotateMultiplier = 2; scrollParallax = -scrollPercent * 300;
        } else if (data.layer === "mid") {
          depthMultiplier = 0.25; rotateMultiplier = 0.5; scrollParallax = -scrollPercent * 150;
        } else {
          depthMultiplier = 0.1; rotateMultiplier = 0.2; scrollParallax = -scrollPercent * 50;
        }

        const moveX = currentX * depthMultiplier;
        const moveY = currentY * depthMultiplier + scrollParallax;
        const addRot = currentX * rotateMultiplier;
        
        // Slow opacity breathing (0.8 to 1.2 multiplier)
        const breath = Math.sin(time * 0.5 + index) * 0.2 + 1.0;
        
        // Slow drifting
        const driftX = Math.sin(time * 0.1 + index) * 5;
        const driftY = Math.cos(time * 0.15 + index) * 5;

        // Apply visual updates
        el.style.opacity = (data.baseOpacity * breath).toString();
        el.style.transform = `translate3d(calc(${data.x}vw + ${moveX + driftX}px), calc(${data.y}vh + ${moveY + driftY}px), 0) scale(${data.scale}) rotate(${data.rotation + addRot}deg)`;
      });

      animationFrameId = requestAnimationFrame(loop);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("scroll", handleScroll, { passive: true });
    loop();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isClient, elements, isMobile]);

  if (!isClient) return null;

  return (
    <div className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden bg-transparent select-none">
      {elements.map((el, i) => (
        <div
          key={el.id}
          ref={(node) => { elementsRef.current[i] = node; }}
          className="absolute top-0 left-0 text-[var(--color-text-dim,rgba(255,255,255,0.8))] will-change-transform"
          style={{
            transform: `translate3d(${el.x}vw, ${el.y}vh, 0) scale(${el.scale}) rotate(${el.rotation}deg)`,
            opacity: el.baseOpacity,
          }}
        >
          {el.type === "text" && (
            <span className="font-mono font-light text-6xl leading-none opacity-50">{el.content}</span>
          )}
          {el.type === "tech-label" && (
            <span className="font-mono font-bold text-xs md:text-sm uppercase tracking-[0.2em]">{el.content}</span>
          )}
          {el.type === "sys-label" && (
            <span className="font-mono text-xs md:text-sm uppercase tracking-widest opacity-80">{el.content}</span>
          )}
          {el.type === "bracket" && (
            <span className="font-display font-bold text-8xl opacity-30">{"["}</span>
          )}
          {el.type === "v-line" && (
            <div className="w-[1px] h-32 bg-white" />
          )}
          {el.type === "h-line" && (
            <div className="w-32 h-[1px] bg-white" />
          )}
          {el.type === "ring" && (
            <div className="w-24 h-24 rounded-full border border-white" />
          )}
          {el.type === "box" && (
            <div className="w-16 h-16 border border-white" />
          )}
          {el.type === "grid" && (
            <div className="grid grid-cols-3 gap-2 opacity-50">
              {[...Array(9)].map((_, j) => (
                <div key={j} className="w-1 h-1 rounded-full bg-[var(--color-accent,white)]" />
              ))}
            </div>
          )}
          {el.type === "crosshair" && (
            <div className="relative w-12 h-12">
              <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white opacity-50" />
              <div className="absolute top-0 left-1/2 w-[1px] h-full bg-white opacity-50" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
