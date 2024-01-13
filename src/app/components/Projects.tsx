import React from "react"
import Image from "next/image"
import getAllProjects from "@/lib/getProjects"
export const dynamic = "force-dynamic"
import Link from "next/link"
import { Button } from "./ui/button"

export type Project = {
  id: string
  projTitle: string
  projDesc: string
  projImage: string
  courseLink: string
  projProfLink: string
  tags: string[]
}

export default async function projects() {
  const { allProjects } = await getAllProjects()

  return (
    <section className='container mx-auto flex flex-col justify-center items-center sm:items-start p-6 max-w-screen-xl mb-10'>
      <div className='flex flex-col justify-center items-center mx-auto py-10'>
        <h2 className='text-3xl font-bold '>Projects</h2>
      </div>
      <div className='flex flex-col justify-between items-center w-full p-6'>
        {allProjects?.map((proj) => (
          <div key={proj.id} className='flex justify-between w-full'>
            <div className=''>
              <h2 className='capitalize text-2xl font-semibold'>
                {proj.projTitle}
              </h2>
              <p className='w-2/3 mt-6 text-1xl font-light capitalize'>
                {proj.projDesc}
              </p>
              <div className='mt-12 space-x-6 '>
                <Link href={proj.projLiveLink} target='_blank'>
                  <Button>Project Live</Button>
                </Link>
                <Link href={proj.projRepoLink} target='_blank'>
                  <Button>Project Repo</Button>
                </Link>
              </div>{" "}
            </div>
            <Image
              className=''
              src={proj.projImageLink}
              alt={"Project Title"}
              height={350}
              width={350}
            ></Image>
          </div>
        ))}
      </div>
    </section>
  )
}
