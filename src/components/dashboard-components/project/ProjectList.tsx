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
import SafeImage from "../../ui/SafeImage"

type projectListProps = {}

export default function ProjectList({ allProjects }: any) {
  console.log(allProjects)
  return (
    <div className="w-full h-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
      {allProjects?.map((proj: any) => (
        <Card key={proj.id} className="flex h-full flex-col">
          <CardHeader className="space-y-3">
            <div className="flex items-start justify-between gap-3">
              <CardTitle className="text-2xl font-bold">
                {proj.title.toUpperCase()}
              </CardTitle>
              <EditPopover
                EditedObject={proj}
                onDeleteClick={() => deleteProjectAction(proj.id)}
              />
            </div>
            <CardDescription className="text-sm font-medium">
              {proj.desc}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="w-full">
              <AspectRatio ratio={16 / 9}>
                <SafeImage
                  width={800}
                  height={450}
                  src={proj.imageLink}
                  alt={`${proj.projTitle} Image`}
                  fill
                />
              </AspectRatio>
            </div>
          </CardContent>
          <CardFooter className="mt-auto flex gap-4">
            <Link href={proj.liveLink}>
              <Button>Project Live Link</Button>
            </Link>
            <Link href={proj.repoLink}>
              <Button variant="outline">Project Repo Link</Button>
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
