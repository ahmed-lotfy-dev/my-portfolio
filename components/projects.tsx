import React from "react";
import Image from "next/image";
import image1 from "../public/images/skills/docker.svg";

function Projects() {
  return (
    <div className="container mx-auto flex flex-col justify-center items-center sm:items-start p-6 max-w-screen-xl mb-10">
      <div className="flex flex-col justify-center items-center">
        <h2 className="text-3xl font-bold">Projects</h2>
      </div>
      <div className="flex justify-between items-center w-full">
        <div className="flex flex-col gap-5">
          <h2 className="">Project 1</h2>
          <p className="">
            This project descreption where i talk about the projects and the
            tech used in making it
          </p>
        </div>
        <div className="">
          <Image
            className=""
            src={image1}
            alt={"Project Title"}
            height={350}
            width={350}
          ></Image>
        </div>
      </div>
    </div>
  );
}

export default Projects;
