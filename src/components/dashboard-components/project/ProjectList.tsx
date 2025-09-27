"use client"
import Image from "next/image"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card"
import { Button } from "@/src/components/ui/button"
import Link from "next/link"
import { deleteProjectAction } from "@/src/app/actions/projectsActions"
import { EditPopover } from "../EditPopover"
import { AspectRatio } from "@/src/components/ui/aspect-ratio"

type projectListProps = {}

export default function ProjectList({ allProjects }: any) {
  console.log(allProjects)
  return (
    <div className="w-full h-full flex gap-x-6">
      {allProjects?.map((proj: any) => (
        <div key={proj.id} className="mt-10 ml-6 h-full">
          <Card className="">
            <CardHeader className="flex justify-start">
              <div className="flex justify-between items-center">
                <CardTitle className="text-3xl">
                  {proj.title.toUpperCase()}
                </CardTitle>
                <EditPopover
                  EditedObject={proj}
                  onDeleteClick={() => deleteProjectAction(proj.id)}
                />
              </div>
              <CardDescription className="text-1xl font-bold mt-6 w-[350px]">
                {proj.desc}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="w-[350px]">
                <AspectRatio ratio={16 / 9}>
                  <Image
                    width={350}
                    height={300}
                    src={proj.imageLink}
                    alt={`${proj.projTitle} Image`}
                    fill
                  />
                </AspectRatio>
              </div>
            </CardContent>
            <CardFooter className="space-x-10 flex">
              <Link href={proj.liveLink}>
                <Button>Project Live Link</Button>
              </Link>
              <Link href={proj.repoLink}>
                <Button>Project Repo Link</Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      ))}
    </div>
  )
}
