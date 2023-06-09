import React from "react"
import Image from "next/image"
import image1 from "@/public/images/skills/docker.svg"
import getAllProjects from "../lib/getProjects"
export const dynamic = "force-dynamic"

export type project = {
  id: string
  certTitle: string
  certDesc: string
  certImage: string
  courseLink: string
  certProfLink: string
}

type Props = {}

export default async function projects({}: Props) {
  const allCertificates = await getAllProjects()

  return (
    <section className='container mx-auto flex flex-col justify-center items-center sm:items-start p-6 max-w-screen-xl mb-10'>
      <div className='flex flex-col justify-center items-center mx-auto py-10'>
        <h2 className='text-3xl font-bold '>Projects</h2>
      </div>
      <div className='flex justify-between items-center w-full p-6'>
        <div className='flex flex-col gap-5'>
          <h2 className='text-2xl font-semibold'>Project 1</h2>
          <p className='w-[85%]'>
            This project description where I talk about the projects and the
            tech used in making it
          </p>
        </div>
        <div className=''>
          <Image
            className=''
            src={image1}
            alt={"Project Title"}
            height={350}
            width={350}
          ></Image>
        </div>
      </div>
    </section>
  )
}
