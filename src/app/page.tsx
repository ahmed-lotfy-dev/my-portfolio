import Certificates from "@/src/app/components/Certificates"
import Hero from "@/src/app/components/Hero"
import Projects from "@/src/app/components/Projects"
import Skills from "@/src/app/components/Skills"
import About from "@/src/app/components/About"
import Contact from "@/src/app/components/Contact"

export default function HomePage() {
  return (
    <main className='font-main'>
      <Hero />
      <Skills />
      <Projects />
      <Certificates />
      <About />
      <Contact />
    </main>
  )
}
