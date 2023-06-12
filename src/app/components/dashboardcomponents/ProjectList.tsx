"use client"

import { Project } from "../Projects"

type Props = {
  allProjects: Project[] | undefined
}
export default function ProjectList({ allProjects }: Props) {
  console.log(allProjects)
  return (
    <div className='mt-6'>
      {allProjects?.map((proj) => (
        <div key={proj.id}>{proj.projTitle}</div>
      ))}
    </div>
  )
}
