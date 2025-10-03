import Certificates from "@/src/components/Certificates"
import Hero from "@/src/components/Hero"
import Projects from "@/src/components/Projects"
import Skills from "@/src/components/Skills"
import About from "@/src/components/About"
import Contact from "@/src/components/Contact"
import Container from "../components/ui/Container"
import { auth } from "../lib/auth"
import { headers } from "next/headers"

export default async function HomePage() {
  const header = await headers()
  const session = await auth.api.getSession({ headers: header })
  const user = session
  console.log({ user })
  
  return (
    <Container className="font-main">
      <Hero />
      <Skills />
      <Projects />
      <Certificates />
      <About />
      <Contact />
    </Container>
  )
}
