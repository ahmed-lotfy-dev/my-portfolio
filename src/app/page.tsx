import Certificates from "@/src/components/certificates";
import Hero from "@/src/components/hero";
import Projects from "@/src/components/projects";
import Skills from "@/src/components/skills";
import About from "@/src/components/about";
import Contact from "@/src/components/contact";

const Homepage = () => {
  return (
    <main className="font-main">
      <Hero />
      <Skills />
      <Projects />
      <Certificates />
      <About />
      <Contact />
    </main>
  );
};

export default Homepage;
