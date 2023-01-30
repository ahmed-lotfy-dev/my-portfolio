import Certificates from "@/components/certificates";
import Hero from "@/components/hero";
import Projects from "@/components/projects";
import Skills from "@/components/skills";
import About from "@/components/about";
import Contact from "@/components/contact";

const Homepage = () => {
  return (
    <main className="font-main">
      <Hero />
      <About />
      <Projects />
      <Certificates />
      <Contact />
      <Skills />
    </main>
  );
};

export default Homepage;
