export function scrollToSection(targetId: string, offset: number = 96) {
  const target = document.getElementById(targetId.replace(/^#/, ""));
  if (target) {
    const y = target.getBoundingClientRect().top + window.scrollY - offset;
    
    // Safely attempt lenis scroll first
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const lenis = (window as any).lenis;
    if (lenis && typeof lenis.scrollTo === "function") {
      lenis.scrollTo(y);
    } else {
      // Fallback to native scroll
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  }
}
