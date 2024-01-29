import React, { Suspense } from "react";
import Image from "next/image";
import getAllProjects from "@/lib/getProjects";
export const dynamic = "force-dynamic";
import Link from "next/link";
import { Button } from "./ui/button";
import { Card } from "./ui/card";

export type Project = {
  id: string;
  projTitle: string;
  projDesc: string;
  projImage: string;
  courseLink: string;
  projProfLink: string;
  tags: string[];
};

export default async function projects() {
  const { allProjects } = await getAllProjects();

  return (
    <section
      className="container mx-auto flex flex-col justify-center items-center sm:items-start p-6 max-w-screen-xl mb-10"
      id="projects"
    >
      <div className="flex flex-col py-10 md:m-0 md:ml-2 text-center md:text-start">
        <h2 className="text-3xl font-bold">Projects</h2>
      </div>
      <div className="flex flex-col justify-between items-center w-full p-6 lg:flex-row md:justify-start">
        {allProjects?.map((proj) => (
          <div
            key={proj.id}
            className="flex flex-col justify-between w-full text-center mt-10 md:text-start max-w-[300px] md:max-w-xl"
          >
            <div className="order-1 text-center md:text-start">
              <h2 className="capitalize text-2xl font-semibold">
                {proj.projTitle}
              </h2>
              <p className="w-full mt-6 text-1xl font-light capitalize m-auto text-wrap md:mt-10 md:m-0 max-w-sm">
                {proj.projDesc}
              </p>
            </div>
            <div className="order-3 m-auto md:m-0">
              <div className="mt-12 space-x-6">
                <Link href={proj.projLiveLink} target="_blank">
                  <Button>Project Live</Button>
                </Link>
                <Link href={proj.projRepoLink} target="_blank">
                  <Button>Project Repo</Button>
                </Link>
              </div>
            </div>

            <div className="order-2 m-auto mt-8 md:m-0 md:p-0">
              <Image
                className="shadow-sm shadow-primary"
                src={proj.projImageLink}
                alt={"Project Title"}
                height={600}
                width={400}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}