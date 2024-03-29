import Certificates from "@/src/components/Certificates";
import Hero from "@/src/components/Hero";
import Projects from "@/src/components/Projects";
import Skills from "@/src/components/Skills";
import About from "@/src/components/About";
import Contact from "@/src/components/Contact";

export default async function HomePage() {
  return (
    <div className="font-main">
      <Hero />
      <Skills />
      <Projects />
      <Certificates />
      <About />
      <Contact />
    </div>
  );
}
