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
  const loopSkills = [...skillsList,...skillsList ]

  return (
    <section
      className="flex flex-col items-center w-full py-16 px-4 sm:px-6 md:px-8 bg-gradient-to-b from-blue-50 to-blue-100 dark:bg-slate-950"
      id="skills"
    >
      <Card className="container p-8 md:p-12 bg-white rounded-xl shadow-2xl shadow-blue-200/50 max-w-6xl">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-extrabold text-blue-900 tracking-tight sm:text-5xl">
            My <span className="text-blue-600">Skills</span>
          </h2>
          <p className="mt-3 text-lg text-gray-600 max-w-2xl mx-auto">
            A quick glance at the tools and technologies I use most.
          </p>
        </div>

        {/* Auto-scrolling horizontal list */}
        <div className="relative overflow-hidden w-full">
          <div className="flex gap-5 animate-[scrollX_30s_linear_infinite] w-max">
            {skillsList.map((skill, index) => (
              <div
                key={`${skill.alt}-${index}`}
                className="flex flex-col items-center justify-center min-w-[100px] sm:min-w-[120px]"
              >
                <Image
                  src={skill.src}
                  alt={skill.alt}
                  width={60}
                  height={60}
                  className="filter grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
                />
  
              </div>
            ))}
          </div>
        </div>
      </Card>
    </section>
  )
}
