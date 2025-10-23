import Link from "next/link"
import Image from "next/image"
import HeroImage from "@/public/images/alotfy_Programmer_coding_on_laptop_sitting_on_desk_-_-_v4_styli_9fb2f0c6-7665-4891-b42c-89e8e4c6274b.png"
import Section from "./ui/Section"
import { FileText } from "lucide-react"

export default async function Hero() {
  return (
    <Section
      className="bg-gradient-custom border-b pt-10 pb-4 sm:pt-14 sm:pb-6 lg:pt-16 lg:pb-1"
      id="hero"
    >
      <div className="container mx-auto flex flex-col gap-10 px-4 pt-6 sm:px-6 sm:pt-8 sm:flex-row justify-between items-center max-w-screen-xl min-h-[calc(100svh-64px)]">
        <div className="flex flex-col gap-4 text-center sm:text-start">
          <h1 className="text-5xl md:text-7xl font-extrabold uppercase font-main">
            Ahmed Lotfy
          </h1>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary">
            Full-Stack Software Engineer
          </h2>
          <p className="text-md md:text-lg text-muted-foreground max-w-2xl mt-4">
            I build responsive, and scalable web applications.
            Let&apos;s create something amazing together.
          </p>
          <Link
            href="/resume.pdf"
            className="group inline-flex items-center justify-center gap-2 mt-8 self-center sm:self-start rounded-full px-6 py-3 sm:text-lg font-semibold bg-primary text-primary-foreground shadow-md transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background hover:bg-accent"
          >
            <FileText className="h-5 w-5" />
            <span>My Resume</span>
          </Link>
        </div>
        <div className="relative">
          <Image
            className="rounded-full border-4 border-primary shadow-lg w-[250px] h-[250px] sm:w-[350px] sm:h-[350px] object-cover"
            src={HeroImage}
            priority={true}
            alt="Hero Image Developer Illustration"
            width={400}
            height={400}
          />
        </div>
      </div>
    </Section>
  )
}
