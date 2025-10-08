import Image from "next/image"
import Link from "next/link"
import { Button } from "./ui/button"
import { Card } from "./ui/card"
import { getAllProjects } from "@/src/app/actions/projectsActions"
import Section from "./ui/Section"

export default async function Projects() {
  const { allProjects } = await getAllProjects()

  return (
    <Section className="flex flex-col items-center" id="projects">
      <div className="container">
        <div className="text-center mb-10">
          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground [font-variation-settings:'wght'_800]">
            My <span className="text-primary">Projects</span>
          </h2>
          <p className="mt-3 text-lg text-muted-foreground max-w-2xl mx-auto px-2 sm:px-0">
            Here are some of the projects I&apos;ve worked on.
          </p>
        </div>
        <div className="w-full grid gap-8 [grid-template-columns:repeat(auto-fit,minmax(280px,1fr))] justify-items-stretch">
          {allProjects?.map((proj) => (
            <Card
              key={proj.id}
              className="flex h-full flex-col justify-between overflow-hidden hover:shadow-md transition-shadow duration-300"
            >
              <div className="relative w-full h-56">
                <Image
                  src={proj.imageLink}
                  alt={proj.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-2xl font-bold mb-2">{proj.title}</h3>
                <p className="text-muted-foreground flex-grow">{proj.desc}</p>
                <div className="mt-4 flex justify-end gap-4">
                  <Link href={proj.liveLink} target="_blank">
                    <Button>Live</Button>
                  </Link>
                  <Link href={proj.repoLink} target="_blank">
                    <Button variant="outline">Repo</Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </Section>
  )
}
