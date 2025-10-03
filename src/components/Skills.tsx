import Image from "next/image"
import { Card } from "./ui/card"

import html from "@/public/images/skills/html.svg"
import css from "@/public/images/skills/css3.svg"
import js from "@/public/images/skills/javascript.svg"
import react from "@/public/images/skills/react.svg"
import nodejs from "@/public/images/skills/nodejs.svg"
import mongodb from "@/public/images/skills/mongodb.svg"
import github from "@/public/images/skills/github.svg"
import graphql from "@/public/images/skills/graphql.svg"
import linux from "@/public/images/skills/linux.svg"
import docker from "@/public/images/skills/docker.svg"

interface Skill {
  src: string
  alt: string
}

const skillsList: Skill[] = [
  { src: html, alt: "HTML" },
  { src: css, alt: "CSS" },
  { src: js, alt: "JavaScript" },
  { src: react, alt: "React" },
  { src: nodejs, alt: "Node.js" },
  { src: mongodb, alt: "MongoDB" },
  { src: graphql, alt: "GraphQL" },
  { src: github, alt: "GitHub" },
  { src: linux, alt: "Linux" },
  { src: docker, alt: "Docker" },
]

export default function Skills() {
  // Duplicate skills to create seamless loop
  const loopSkills = [...skillsList, ...skillsList]

  return (
    <section className="flex flex-col items-center my-16 px-4" id="skills">
      <div className="container">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-extrabold text-blue-900 tracking-tight sm:text-5xl">
            My <span className="text-blue-600">Skills</span>
          </h2>
          <p className="mt-3 text-lg text-gray-600 max-w-2xl mx-auto px-2 sm:px-0">
            A quick glance at the tools and technologies I use most.
          </p>
        </div>

        {/* Auto-scrolling horizontal list */}
        <div className="relative overflow-hidden w-full sm:max-w-5xl mx-auto">
          <div className="inline-flex w-max gap-5 will-change-transform animate-[scrollX_30s_linear_infinite]">
            {loopSkills.map((skill, index) => (
              <div
                key={`${skill.alt}-${index}`}
                className="flex flex-col items-center justify-center min-w-[72px] sm:min-w-[100px]"
              >
                <Image
                  src={skill.src}
                  alt={skill.alt}
                  width={44}
                  height={44}
                  className="filter opacity-60 dark:invert dark:opacity-100 hover:grayscale-0 hover:opacity-100 transition-all duration-300 sm:w-[60px] sm:h-[60px]"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
