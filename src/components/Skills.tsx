"use client";
import Image from "next/image";
import html from "@/public/images/skills/html.svg";
import css from "@/public/images/skills/css3.svg";
import js from "@/public/images/skills/javascript.svg";
import react from "@/public/images/skills/react.svg";
import nodejs from "@/public/images/skills/nodejs.svg";
import mongodb from "@/public/images/skills/mongodb.svg";
import github from "@/public/images/skills/github.svg";
import graphql from "@/public/images/skills/graphql.svg";
import linux from "@/public/images/skills/linux.svg";
import docker from "@/public/images/skills/docker.svg";

import { AnimatePresence, motion } from "framer-motion";

export default function Skills() {
  return (
    <section
      className="flex flex-col justify-center items-center sm:items-start mx-auto  p-6 bg-gray-400"
      id="skills"
    >
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="container">
            <div className=" flex flex-col py-10 md:m-0 md:ml-2">
              <h2 className=" text-3xl font-bold">Skills</h2>
            </div>
            <div className="flex flex-wrap mx-auto justify-around max-w-screen-xl gap-10">
              <Image
                src={html}
                alt="html"
                width={90}
                height={90}
                className="bg-transparent opacity-[0.5] hover:opacity-[0.7] "
              />
              <Image
                src={css}
                alt="css"
                width={90}
                height={90}
                className="bg-transparent opacity-[0.5] hover:opacity-[0.7] "
              />
              <Image
                src={js}
                alt="js"
                width={90}
                height={90}
                className="bg-transparent opacity-[0.5] hover:opacity-[0.7] "
              />
              <Image
                src={react}
                alt="react"
                width={90}
                height={90}
                className="bg-transparent opacity-[0.5] hover:opacity-[0.7] "
              />
              <Image
                src={nodejs}
                alt="nodejs"
                width={95}
                height={95}
                className="bg-transparent  opacity-[0.5] hover:opacity-[0.9] "
              />
              <Image
                src={mongodb}
                alt="mongodb"
                width={90}
                height={90}
                className="bg-transparent opacity-[0.5] hover:opacity-[0.9] "
              />
              <Image
                src={graphql}
                alt="graphql"
                width={90}
                height={90}
                className="bg-transparent opacity-[0.5] hover:opacity-[0.9] "
              />
              <Image
                src={github}
                alt="github"
                width={90}
                height={90}
                className="bg-transparent opacity-[0.5] hover:opacity-[0.7] "
              />
              <Image
                src={linux}
                alt="linux"
                width={90}
                height={90}
                className="bg-transparent opacity-[0.5] hover:opacity-[0.7] "
              />
              <Image
                src={docker}
                alt="docker"
                width={90}
                height={90}
                className="bg-transparent opacity-[0.5] hover:opacity-[0.7] "
              />
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </section>
  );
}
