"use client"
import Image from "next/image"
import Link from "next/link"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card"
import { Button } from "@/src/components/ui/button"
import { deleteProjectAction } from "@/src/app/actions/projectsActions"
import { EditPopover } from "../EditPopover"
import { AspectRatio } from "@/src/components/ui/aspect-ratio"

export default function ProjectList({ allProjects }: any) {
  return (
    <div className="w-full h-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10 p-10">
      {allProjects?.map((proj: any) => (
        <Card key={proj.id} className="flex flex-col">
          <CardContent className="p-0">
            <AspectRatio ratio={16 / 9} className="rounded-t-lg">
              <Image
                src={proj.imageLink}
                alt={`${proj.title} Image`}
                fill
                className="object-cover rounded-t-lg"
              />
            </AspectRatio>
          </CardContent>
          <div className="p-6 flex flex-col flex-1">
            <CardHeader className="p-0">
              <div className="flex items-start justify-between gap-3">
                <CardTitle className="text-2xl font-bold">
                  {proj.title.toUpperCase()}
                </CardTitle>
                <EditPopover
                  EditedObject={proj}
                  onDeleteClick={() => deleteProjectAction(proj.id)}
                />
              </div>
            </CardHeader>
            <CardDescription className="text-sm font-medium break-words leading-relaxed mt-4 flex-1">
              {proj.desc}
            </CardDescription>
            <CardFooter className="mt-auto flex flex-wrap gap-4 p-0 pt-4">
              <Link href={proj.liveLink} target="_blank">
                <Button >Live</Button>
              </Link>
              <Link href={proj.repoLink} target="_blank">
                <Button variant="outline">Repo</Button>
              </Link>
            </CardFooter>
          </div>
        </Card>
      ))}
    </div>
  )
}
