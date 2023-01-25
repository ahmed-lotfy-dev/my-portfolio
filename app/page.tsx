import Certificates from "@/components/certificates";
import Hero from "@/components/hero";
import Projects from "@/components/projects";
import Skills from "@/components/skills";

const Homepage = () => {
  return (
    <main className="font-main">
      <Hero />
      <Projects />
      <Certificates />
      <Skills />
    </main>
  );
};

export default Homepage;
