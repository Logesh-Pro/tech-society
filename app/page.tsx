import Hero from "@/components/hero/Hero";
import About from "@/components/sections/About";
import Domains from "@/components/sections/Domains";
import Projects from "@/components/sections/Projects";
import Events from "@/components/sections/Events";
import Community from "@/components/sections/Community";
import Team from "@/components/sections/Team";
import Join from "@/components/sections/Join";
import Footer from "@/components/sections/Footer";

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Domains />
      <Projects />
      <Events />
      <Community />
      <Team />
      <Join />
      <Footer />
    </>
  );
}
