import Certificates from "@/src/components/homepage/Certificates"
import Hero from "@/src/components/homepage/Hero"
import Projects from "@/src/components/homepage/Projects"
import Skills from "@/src/components/homepage/Skills"
import About from "@/src/components/homepage/About"
import Contact from "@/src/components/homepage/Contact"
import Container from "@/src/components/ui/Container"
import { auth } from "@/src/lib/auth"
import { headers } from "next/headers"

import { use } from "react"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { useTranslations } from "next-intl"

export default async function HomePage({
  params,
}: {
  params: { locale: string }
}) {
  const header = await headers()
  const session = await auth.api.getSession({ headers: header })
  const user = session
  const { locale } = await params
  setRequestLocale(locale)

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
