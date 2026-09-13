import Hero from "@/components/hero/Hero";

export default function Home() {
  return (
    <>
      <Hero />
      
      <section id="about" className="min-h-screen flex items-center justify-center border-b border-white/10">
        <h2 className="text-4xl md:text-6xl font-bold opacity-30">02 — ABOUT / COMMUNITY</h2>
      </section>

      <section id="what-we-do" className="min-h-screen flex items-center justify-center border-b border-white/10 bg-white/5">
        <h2 className="text-4xl md:text-6xl font-bold opacity-30">03 — WHAT WE DO</h2>
      </section>

      <section id="domains" className="min-h-screen flex items-center justify-center border-b border-white/10">
        <h2 className="text-4xl md:text-6xl font-bold opacity-30">04 — DOMAINS</h2>
      </section>

      <section id="projects" className="min-h-screen flex items-center justify-center border-b border-white/10 bg-white/5">
        <h2 className="text-4xl md:text-6xl font-bold opacity-30">05 — PROJECTS</h2>
      </section>

      <section id="events" className="min-h-screen flex items-center justify-center border-b border-white/10">
        <h2 className="text-4xl md:text-6xl font-bold opacity-30">06 — EVENTS</h2>
      </section>

      <section id="community" className="min-h-screen flex items-center justify-center border-b border-white/10 bg-white/5">
        <h2 className="text-4xl md:text-6xl font-bold opacity-30">07 — COMMUNITY</h2>
      </section>

      <section id="team" className="min-h-screen flex items-center justify-center border-b border-white/10">
        <h2 className="text-4xl md:text-6xl font-bold opacity-30">08 — TEAM</h2>
      </section>

      <section id="join" className="min-h-screen flex items-center justify-center border-b border-white/10 bg-white/5">
        <h2 className="text-4xl md:text-6xl font-bold opacity-30">09 — JOIN THE COMMUNITY</h2>
      </section>

      <footer className="py-24 flex items-center justify-center">
        <h2 className="text-2xl font-bold opacity-30">10 — FOOTER</h2>
      </footer>
    </>
  );
}
