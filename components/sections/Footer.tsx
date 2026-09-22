"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { label: "About",     href: "/#about" },
  { label: "Domains",   href: "/#domains" },
  { label: "Projects",  href: "/#projects" },
  { label: "Events",    href: "/#events" },
  { label: "Community", href: "/#community" },
  { label: "Team",      href: "/#team" },
  { label: "Join",      href: "/join" },
];

export default function Footer() {
  const pathname = usePathname();

  const scrollTo = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("/#") && (pathname === "/" || pathname === "")) {
      e.preventDefault();
      const targetId = href.replace("/#", "");
      import("@/lib/utils/scroll").then((mod) => {
        mod.scrollToSection(targetId);
      });
    }
  };

  return (
    <footer className="relative border-t border-white/10 bg-transparent z-10 pt-20 pb-10 px-6 md:px-12">
      <div className="max-w-[var(--container-width)] mx-auto">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-8 mb-24">
          
          {/* Brand */}
          <div className="md:col-span-4 flex flex-col justify-between">
            <h2 className="font-display font-bold uppercase tracking-tighter text-4xl text-white">
              Tech Society
            </h2>
          </div>

          {/* Nav */}
          <div className="md:col-span-4 flex flex-col gap-4">
            <h3 className="font-mono text-xs uppercase tracking-widest text-[var(--color-accent)] mb-4">Sitemap</h3>
            {NAV_LINKS.map((link) => (
              <Link 
                key={link.label}
                href={link.href}
                onClick={(e) => scrollTo(e, link.href)}
                className="font-mono text-sm uppercase tracking-widest text-white/50 hover:text-white transition-colors w-fit"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Control / Admin */}
          <div className="md:col-span-4 flex flex-col gap-4">
            <h3 className="font-mono text-xs uppercase tracking-widest text-[var(--color-accent)] mb-4">Control</h3>
            <Link 
              href="/admin/login"
              className="font-mono text-sm uppercase tracking-widest text-white/50 hover:text-[var(--color-accent)] transition-colors w-fit flex items-center gap-2"
            >
              Control Room <span>&rarr;</span>
            </Link>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 font-mono text-xs text-white/30 uppercase tracking-widest">
          <span>&copy; 2026 Tech Society</span>
          <div className="flex items-center gap-6">
            <span className="text-white/15">Privacy</span>
            <span className="text-white/15">Terms</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
