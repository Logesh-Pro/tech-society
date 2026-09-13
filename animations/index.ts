import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

// Register ScrollTrigger globally
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export const initAnimations = () => {
  // Global animation config (e.g., default eases, durations)
  gsap.defaults({
    ease: "power3.out",
    duration: 1,
  });
};

// Reusable animation utilities can be added here
export const fadeUp = (targets: gsap.DOMTarget, vars?: gsap.TweenVars) => {
  return gsap.fromTo(
    targets,
    { y: 50, opacity: 0 },
    { y: 0, opacity: 1, ...vars }
  );
};
