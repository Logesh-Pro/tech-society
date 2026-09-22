"use client";

import { useEffect, useRef, useState } from "react";

function getLabel(el: Element | null): string {
  if (!el) return "";
  const interactive = el.closest('a, button, input, textarea, select, [role="button"], [role="radio"], [role="option"], [data-cursor]');
  if (!interactive) return "";

  const attr = interactive.getAttribute("data-cursor");
  if (attr) return attr;

  const tag = interactive.tagName.toLowerCase();
  if (tag === "input" || tag === "textarea") return "INPUT";
  if (tag === "select" || interactive.getAttribute("role") === "listbox" || interactive.getAttribute("role") === "option") return "SELECT";
  
  if (tag === "button" || tag === "a" || interactive.getAttribute("role") === "button") {
    const txt = interactive.textContent?.toLowerCase() || "";
    if (txt.includes("submit") || txt.includes("request") || txt.includes("approve") || txt.includes("reject") || txt.includes("add") || txt.includes("login")) return "SUBMIT";
    return "OPEN";
  }

  return "";
}

function getLuminance(r: number, g: number, b: number) {
  const a = [r, g, b].map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

function parseColor(color: string): { r: number, g: number, b: number, a: number } | null {
  if (color.startsWith("rgb")) {
    const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
    if (match) {
      return {
        r: parseInt(match[1], 10),
        g: parseInt(match[2], 10),
        b: parseInt(match[3], 10),
        a: match[4] !== undefined ? parseFloat(match[4]) : 1
      };
    }
  }
  return null;
}

function isBright(el: Element | null): boolean {
  if (!el) return false;
  
  const interactive = el.closest('button, a, [role="button"]');
  if (interactive) {
    const classes = interactive.className || "";
    if (classes.includes("bg-[var(--color-accent)]") || classes.includes("bg-white")) {
      return true;
    }
  }

  let current: Element | null = interactive || el;
  while (current && current !== document.documentElement) {
    const style = window.getComputedStyle(current);
    const bgColor = style.backgroundColor;
    
    if (bgColor && bgColor !== "transparent" && bgColor !== "rgba(0, 0, 0, 0)") {
      const parsed = parseColor(bgColor);
      if (parsed && parsed.a > 0.1) {
        const lum = getLuminance(parsed.r, parsed.g, parsed.b);
        if (lum > 0.4) return true;
        if (parsed.a > 0.8) return false;
      }
    }
    current = current.parentElement;
  }
  return false;
}

export default function CustomCursor() {
  const containerRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const crossXRef = useRef<HTMLDivElement>(null);
  const crossYRef = useRef<HTMLDivElement>(null);
  const bracketRef = useRef<HTMLDivElement>(null);
  const backplateRef = useRef<HTMLDivElement>(null);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (!containerRef.current) return;

    // Mobile check
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Initialization flags
    let isFirstMove = true;
    let currentX = 0;
    let currentY = 0;

    const cursor = containerRef.current;
    
    // Direct pointer tracking
    const handlePointerMove = (e: PointerEvent) => {
      currentX = e.clientX;
      currentY = e.clientY;

      cursor.style.left = `${currentX}px`;
      cursor.style.top = `${currentY}px`;

      if (isFirstMove) {
        isFirstMove = false;
        cursor.style.visibility = "visible";
        cursor.style.opacity = "1";
        document.documentElement.classList.add("cursor-enhanced");
      }
    };

    const handlePointerOver = (e: PointerEvent) => {
      const el = e.target as Element;
      const interactive = el.closest('a, button, input, textarea, select, [role="button"], [data-cursor]');
      
      if (!interactive) return;

      const label = getLabel(el);
      const bright = isBright(el);

      // Label update
      if (labelRef.current) {
        if (label) {
          labelRef.current.textContent = `→ ${label}`;
          labelRef.current.style.opacity = "1";
          labelRef.current.style.transform = "translateY(-50%) translateX(0)";
        } else {
          labelRef.current.style.opacity = "0";
          labelRef.current.style.transform = "translateY(-50%) translateX(-4px)";
        }
      }

      // Visual styling for contrast
      const primaryColor = bright ? "#000" : "var(--color-accent)";
      const secondaryColor = bright ? "#000" : "rgba(255,255,255,0.7)";
      const backplateColor = bright ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.12)";

      if (labelRef.current) labelRef.current.style.color = primaryColor;
      if (dotRef.current) dotRef.current.style.backgroundColor = primaryColor;
      
      if (crossXRef.current) crossXRef.current.style.backgroundColor = secondaryColor;
      if (crossYRef.current) crossYRef.current.style.backgroundColor = secondaryColor;
      
      if (backplateRef.current) {
        backplateRef.current.style.backgroundColor = backplateColor;
        backplateRef.current.style.transform = "scale(1.2)";
      }

      if (bracketRef.current) {
        const borders = bracketRef.current.children;
        for (let i = 0; i < borders.length; i++) {
          (borders[i] as HTMLElement).style.borderColor = secondaryColor;
        }
      }

      // Micro-animation logic
      if (!prefersReducedMotion) {
        if (bracketRef.current) {
          bracketRef.current.style.transform = "scale(1.2)";
        }
        if (dotRef.current) {
          dotRef.current.style.transform = "scale(1.5)";
        }
      }
    };

    const handlePointerOut = (e: PointerEvent) => {
      const el = e.target as Element;
      const interactive = el.closest('a, button, input, textarea, select, [role="button"], [data-cursor]');
      
      if (!interactive) return;

      // Label reset
      if (labelRef.current) {
        labelRef.current.style.opacity = "0";
        labelRef.current.style.transform = "translateY(-50%) translateX(-4px)";
      }

      // Visual styling reset
      if (dotRef.current) dotRef.current.style.backgroundColor = "var(--color-accent)";
      if (crossXRef.current) crossXRef.current.style.backgroundColor = "rgba(255,255,255,0.2)";
      if (crossYRef.current) crossYRef.current.style.backgroundColor = "rgba(255,255,255,0.2)";
      
      if (backplateRef.current) {
        backplateRef.current.style.backgroundColor = "transparent";
        backplateRef.current.style.transform = "scale(1)";
      }

      if (bracketRef.current) {
        const borders = bracketRef.current.children;
        for (let i = 0; i < borders.length; i++) {
          (borders[i] as HTMLElement).style.borderColor = "rgba(255,255,255,0.5)";
        }
      }

      // Micro-animation reset
      if (!prefersReducedMotion) {
        if (bracketRef.current) {
          bracketRef.current.style.transform = "scale(1)";
        }
        if (dotRef.current) {
          dotRef.current.style.transform = "scale(1)";
        }
      }
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    document.addEventListener("pointerover", handlePointerOver);
    document.addEventListener("pointerout", handlePointerOut);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("pointerover", handlePointerOver);
      document.removeEventListener("pointerout", handlePointerOut);
      document.documentElement.classList.remove("cursor-enhanced");
    };
  }, [mounted]);

  if (!mounted) return null;

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      style={{ 
        position: 'fixed',
        left: '0px',
        top: '0px',
        width: '24px', 
        height: '24px', 
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
        zIndex: 99999,
        visibility: 'hidden',
        opacity: 0,
        transition: 'opacity 0.2s ease-out'
      }}
    >
      {/* Contrast Backplate */}
      <div 
        ref={backplateRef} 
        className="absolute inset-0 rounded-full transition-all duration-150 ease-out" 
      />

      <div 
        className="absolute inset-0 flex items-center justify-center"
      >
        {/* Center Dot */}
        <div 
          ref={dotRef} 
          className="absolute w-[2px] h-[2px] bg-[var(--color-accent)] transition-all duration-150 ease-out shadow-[0_0_8px_var(--color-accent)]" 
        />
        
        {/* Crosshair Lines */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div ref={crossXRef} className="absolute w-[16px] h-[1px] bg-white/20 transition-colors duration-150" />
          <div ref={crossYRef} className="absolute h-[16px] w-[1px] bg-white/20 transition-colors duration-150" />
        </div>
        
        {/* Corner Brackets */}
        <div ref={bracketRef} className="absolute inset-0 transition-transform duration-150 ease-out">
          <div className="absolute top-[2px] left-[2px] w-[4px] h-[4px] border-t-[1px] border-l-[1px] border-white/50 transition-colors duration-150" />
          <div className="absolute top-[2px] right-[2px] w-[4px] h-[4px] border-t-[1px] border-r-[1px] border-white/50 transition-colors duration-150" />
          <div className="absolute bottom-[2px] left-[2px] w-[4px] h-[4px] border-b-[1px] border-l-[1px] border-white/50 transition-colors duration-150" />
          <div className="absolute bottom-[2px] right-[2px] w-[4px] h-[4px] border-b-[1px] border-r-[1px] border-white/50 transition-colors duration-150" />
        </div>
      </div>

      {/* Contextual Label */}
      <span
        ref={labelRef}
        style={{
          position: 'absolute',
          left: '28px',
          top: '50%',
          transform: 'translateY(-50%) translateX(-4px)',
          fontFamily: 'monospace',
          fontSize: '9px',
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: 'var(--color-accent)',
          opacity: 0,
          whiteSpace: 'nowrap',
          transition: 'all 0.15s ease-out'
        }}
      />
    </div>
  );
}
