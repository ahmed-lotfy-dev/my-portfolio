"use client"
import Image from "next/image"
import { Project } from "@prisma/client"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/src/app/components/ui/card"
import { Button } from "../ui/button"
import Link from "next/link"
type Props = {
  allProjects: Project[] | undefined
}
export default function ProjectList({ allProjects }: Props) {
  return (
    <div className='mt-16 w-full grid grid-cols-3 gap-x-6'>
      {allProjects?.map((proj) => (
        <div key={proj.id} className='mt-10 text-center'>
          <Card className=''>
            <CardHeader>
              <CardTitle className='text-3xl'>
                {proj.projTitle.toUpperCase()}
              </CardTitle>
              <CardDescription className='text-1xl font-bold mt-6'>
                {proj.projDesc}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Image
                className='m-auto object-cover'
                src={proj.projImageLink}
                width={350}
                height={350}
                alt={`${proj.projTitle} Image`}
              />
            </CardContent>
            <CardFooter className='space-x-10 flex justify-center'>
              <Link href={proj.projLiveLink}>
                <Button>Project Live Link</Button>
              </Link>
              <Link href={proj.projRepoLink}>
                <Button>Project Repo Link</Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      ))}
    </div>
  )
}
