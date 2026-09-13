"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-colors duration-300 ${
        scrolled ? "bg-black/80 backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <div className="max-w-[var(--container-width)] mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="text-xl font-mono font-bold tracking-tighter">
          STS<span className="text-[var(--color-accent)]">.</span>
        </Link>
        <nav className="hidden md:flex gap-8 text-sm font-medium">
          <Link href="#about" className="hover:text-[var(--color-accent)] transition-colors">
            About
          </Link>
          <Link href="#domains" className="hover:text-[var(--color-accent)] transition-colors">
            Domains
          </Link>
          <Link href="#projects" className="hover:text-[var(--color-accent)] transition-colors">
            Projects
          </Link>
          <Link href="#events" className="hover:text-[var(--color-accent)] transition-colors">
            Events
          </Link>
        </nav>
        <button className="bg-[var(--color-accent)] text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-[var(--color-accent-hover)] transition-colors">
          Join Us
        </button>
      </div>
    </header>
  );
}
