"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const NAV_LINKS = [
  { label: "About",     href: "/#about" },
  { label: "Domains",   href: "/#domains" },
  { label: "Projects",  href: "/#projects" },
  { label: "Events",    href: "/#events" },
  { label: "Community", href: "/#community" },
  { label: "Team",      href: "/#team" },
  { label: "Join",      href: "/join" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);
  const bgElementsRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    setMenuOpen(false);
    if (href.startsWith("/#") && pathname === "/") {
      e.preventDefault();
      const targetId = href.replace("/#", "");
      import("@/lib/utils/scroll").then((mod) => {
        mod.scrollToSection(targetId);
      });
    }
  };

  useGSAP(() => {
    if (menuOpen) {
      gsap.to(menuRef.current, {
        clipPath: "circle(150% at calc(100% - 3rem) 3rem)",
        duration: 0.8,
        ease: "power4.inOut",
        pointerEvents: "auto",
      });
      const linkTargets = linksRef.current?.children ? Array.from(linksRef.current.children) : [];
      if (linkTargets.length > 0) {
        gsap.fromTo(
          linkTargets,
          { x: -30, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.5, stagger: 0.05, ease: "power3.out", delay: 0.3 }
        );
      }
      const bgTargets = bgElementsRef.current?.children ? Array.from(bgElementsRef.current.children) : [];
      if (bgTargets.length > 0) {
        gsap.fromTo(
          bgTargets,
          { opacity: 0, scale: 0.8 },
          { opacity: 1, scale: 1, duration: 0.6, stagger: 0.1, ease: "power2.out", delay: 0.2 }
        );
      }
    } else {
      gsap.to(menuRef.current, {
        clipPath: "circle(0% at calc(100% - 3rem) 3rem)",
        duration: 0.8,
        ease: "power4.inOut",
        pointerEvents: "none",
      });
    }
  }, { scope: menuRef, dependencies: [menuOpen] });

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-colors duration-500 ${
          scrolled || menuOpen ? "bg-[var(--color-base)]/90 backdrop-blur-md border-b border-white/5" : "bg-transparent"
        }`}
      >
        <div className="max-w-[var(--container-width)] mx-auto px-6 h-24 flex items-center justify-between">
          <Link href="/" onClick={() => setMenuOpen(false)} className="text-2xl font-mono font-bold tracking-tighter z-50">
            TS<span className="text-[var(--color-accent)]">.</span>
          </Link>

          <button
            onClick={toggleMenu}
            data-cursor-style="normal"
            className="z-50 flex flex-col justify-center items-center w-12 h-12 rounded-full hover:bg-white/5 transition-colors"
            aria-label="Toggle menu"
          >
            <span
              className={`block w-6 h-0.5 bg-white transition-transform duration-300 ${
                menuOpen ? "rotate-45 translate-y-1" : "-translate-y-1"
              }`}
            />
            <span
              className={`block w-6 h-0.5 bg-white transition-transform duration-300 ${
                menuOpen ? "-rotate-45 -translate-y-0.5" : "translate-y-1"
              }`}
            />
          </button>
        </div>
      </header>

      {/* Full Screen Cinematic Menu */}
      <div
        ref={menuRef}
        className="fixed inset-0 z-40 bg-[#09090b] flex flex-col items-center justify-center pointer-events-none"
        style={{ clipPath: "circle(0% at calc(100% - 3rem) 3rem)" }}
      >
        {/* Technical Background Elements */}
        <div ref={bgElementsRef} className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-[1px] h-64 bg-white/5" />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-[1px] bg-white/5" />
          <div className="absolute top-1/2 left-12 grid grid-cols-2 gap-2 opacity-10">
            {[...Array(4)].map((_, i) => <div key={i} className="w-1 h-1 bg-[var(--color-accent)] rounded-full" />)}
          </div>
          <div className="absolute bottom-12 right-12 font-mono text-[10px] text-white/20 tracking-widest uppercase">
            SYS.NAV_ACTIVE
          </div>
        </div>

        <div className="pointer-events-auto flex flex-col items-start gap-4 md:gap-6 relative z-10" ref={linksRef}>
          {NAV_LINKS.map((link) => {
            const isCurrent = (pathname === "/" && link.href.startsWith("/#")) || pathname === link.href;
            return (
              <Link
                key={link.label}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link.href)}
                data-cursor-style="normal"
                className="group relative flex items-center gap-6 menu-link text-4xl md:text-6xl font-display font-bold uppercase tracking-tighter hover:text-white transition-colors"
              >
                <span className={`w-3 h-3 border border-[var(--color-accent)] transition-all duration-300 ${isCurrent ? 'bg-[var(--color-accent)]' : 'bg-transparent group-hover:bg-[var(--color-accent)]/50 group-hover:scale-125'}`} />
                <span className={`transition-transform duration-300 group-hover:translate-x-4 ${isCurrent ? 'text-white' : 'text-white/40'}`}>
                  {link.label}
                </span>
                <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-mono text-xs text-[var(--color-accent)] absolute -right-16 tracking-widest hidden md:block">
                  [ {link.label.substring(0, 3)} ]
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
