"use client";
import Image from "next/image";
import { Project } from "@prisma/client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/src/app/components/ui/card";
import { Button } from "../ui/button";
import Link from "next/link";
import { Popover } from "../ui/popover";
import { PopoverContent, PopoverTrigger } from "@radix-ui/react-popover";

import { deleteProjectAction } from "../../actions";
import { EditPopover } from "../ui/EditPopover";
import { AspectRatio } from "../ui/aspect-ratio";

type Props = {
  allProjects: Project[] | undefined;
};
export default function ProjectList({ allProjects }: Props) {
  return (
    <div className="mt-16 w-full h-full flex gap-x-6">
      {allProjects?.map((proj) => (
        <div key={proj.id} className="mt-10 ml-6 h-full">
          <Card className="">
            <CardHeader className="flex justify-start">
              <div className="flex justify-between items-center">
                <CardTitle className="text-3xl">
                  {proj.projTitle.toUpperCase()}
                </CardTitle>
                <EditPopover
                  EditedObject={proj}
                  onDeleteClick={() => deleteProjectAction(proj.id)}
                />
              </div>
              <CardDescription className="text-1xl font-bold mt-6 w-[350px]">
                {proj.projDesc}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="w-[350px]">
                <AspectRatio ratio={16 / 9}>
                  <Image
                    src={proj.projImageLink}
                    alt={`${proj.projTitle} Image`}
                    fill
                  />
                </AspectRatio>
              </div>
            </CardContent>
            <CardFooter className="space-x-10 flex">
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
  );
}
