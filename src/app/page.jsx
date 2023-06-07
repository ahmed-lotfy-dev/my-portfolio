import Certificates from "./components/certificates"
import Hero from "@/src/app/components/hero"
import Projects from "@/src/app/components/projects"
import Skills from "@/src/app/components/skills"
import About from "@/src/app/components/about"
import Contact from "@/src/app/components/contact"


const Homepage = () => {
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

export default Homepage
