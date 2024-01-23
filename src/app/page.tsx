import Certificates from "@/src/app/components/Certificates";
import Hero from "@/src/app/components/Hero";
import Projects from "@/src/app/components/Projects";
import Skills from "@/src/app/components/Skills";
import About from "@/src/app/components/About";
import Contact from "@/src/app/components/Contact";
import { wait } from "./lib/wait";

export default async function HomePage() {
  await wait(3000);
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
}
