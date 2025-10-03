import Link from "next/link"
import Image from "next/image"
import HeroImage from "@/public/images/alotfy_Programmer_coding_on_laptop_sitting_on_desk_-_-_v4_styli_9fb2f0c6-7665-4891-b42c-89e8e4c6274b.png"
import Container from "./ui/Container"

export default async function Hero() {
  return (
      <section className="bg-gradient-custom border-b" id="hero">
        <div className="container mx-auto flex flex-col gap-10 p-5 sm:flex-row mb-10 justify-between items-center max-w-screen-xl min-h-[calc(100vh-80px)]">
          <div className="flex flex-col gap-4 text-center sm:text-start">
            <h1 className="text-5xl md:text-7xl font-extrabold uppercase font-main">
              Ahmed Lotfy
            </h1>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary">
              Full-Stack Software Engineer
            </h2>
            <p className="text-md md:text-lg text-muted-foreground max-w-2xl mt-4">
              I build beautiful, responsive, and scalable web applications.
              Let&apos;s create something amazing together.
            </p>
            <Link
              href="/resume.pdf"
              className="py-3 px-8 mt-8 w-60 self-center text-center sm:self-start bg-primary text-primary-foreground rounded-md hover:bg-primary/90 font-bold transition-all hover:rounded-lg border-2 border-solid sm:text-xl"
            >
              My Resume
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
      </section>
  )
}
