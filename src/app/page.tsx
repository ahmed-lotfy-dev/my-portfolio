import Certificates from "@/src/components/Certificates";
import Hero from "@/src/components/Hero";
import Projects from "@/src/components/Projects";
import Skills from "@/src/components/Skills";
import About from "@/src/components/About";
import Contact from "@/src/components/Contact";
import { auth } from "@/src/auth";

export default async function HomePage() {
  const session = await auth();
  console.log(session?.user);
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
