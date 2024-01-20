"use client";
import Image from "next/image";
import { Project } from "@prisma/client";
import { HiEllipsisVertical, HiMiniTrash } from "react-icons/hi2";
import { AiTwotoneEdit } from "react-icons/ai";

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

type Props = {
  allProjects: Project[] | undefined;
};
export default function ProjectList({ allProjects }: Props) {
  return (
    <div className="mt-16 w-full flex gap-x-6">
      {allProjects?.map((proj) => (
        <div key={proj.id} className="mt-10 ml-6">
          <Card className="">
            <CardHeader className="flex justify-start">
              <div className="flex justify-between items-center">
                <CardTitle className="text-3xl">
                  {proj.projTitle.toUpperCase()}
                </CardTitle>
                <Popover>
                  <PopoverTrigger>
                    <HiEllipsisVertical size={22} />
                  </PopoverTrigger>
                  <PopoverContent>
                    <Card className="p-5">
                      <div
                        className="flex justify-start items-center cursor-pointer"
                        // onClick={() => editProjectAction(proj.id)}
                      >
                        <AiTwotoneEdit className="mr-3" size={20} />
                        <p>Edit Project</p>
                      </div>
                      <div
                        className="flex justify-start items-center mt-4 cursor-pointer"
                        onClick={() => deleteProjectAction(proj.id)}
                      >
                        <HiMiniTrash className="mr-3" size={20} />
                        <p>Delete Project</p>
                      </div>
                    </Card>
                  </PopoverContent>
                </Popover>
              </div>
              <CardDescription className="text-1xl font-bold mt-6">
                {proj.projDesc}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Image
                src={proj.projImageLink}
                width={300}
                height={200}
                alt={`${proj.projTitle} Image`}
              />
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
