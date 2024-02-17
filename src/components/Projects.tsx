import Image from "next/image";
import { getAllProjects } from "@/lib/getProjects";
import Link from "next/link";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Project } from "../db/schema/projects";
export default async function projects() {
  const { allProjects } = await getAllProjects();

  return (
    <section
      className="flex flex-col justify-center items-center sm:items-start mx-auto w-full p-6 bg-gray-100"
      id="projects"
    >
      <Card className="container p-10 bg-slate-300 shadow-slate-600 shadow-sm">
        <div className="flex flex-col py-10 md:m-0 md:ml-2 text-center md:text-start">
          <h2 className="text-3xl font-bold">Projects</h2>
        </div>
        <div className="flex flex-wrap justify-center md:justify-start mx-auto gap-10">
          {allProjects?.map((proj: Project) => (
            <div
              key={proj.id}
              className="flex flex-col justify-between w-full text-center mt-10 md:text-start max-w-[400px] md:max-w-xl border-black border p-6"
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
                  <Link href={proj.liveLink} target="_blank">
                    <Button>Project Live</Button>
                  </Link>
                  <Link href={proj.repoLink} target="_blank">
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
      </Card>
    </section>
  );
}
