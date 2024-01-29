import Image from "next/image";
import myImage from "@/public/images/skills/css3.svg";
import React from "react";

export default function About() {
  return (
    <section className="bg-blue-300" id="about">
      <div className="container mx-auto max-w-screen-xl p-6">
        <h2 className="text-3xl font-extrabold text-center mt-16 mb-12">
          About Me
        </h2>
        {/* outer container grid */}
        <div className="grid grid-cols-6 grid-row-2  w-full justify-between text-lg font-semibold text-center md:text-start">
          {/* inside container grid for the text */}
          <div className="w-full md:w-5/6 sm:text-start text-md col-start-1 col-end-7 md:col-start-1 md:col-end-6 md:row-start-1 mt-12 leading-8 font-semibold mb-12">
            <h2 className="px-5 py-1 text-center md:text-start mt-6">
              Hello, I&apos;m Ahmed Lotfy, Full stack software developer coming
              from PC maintenance background & shifting my career.
            </h2>
            <h2 className="px-5 py-1 text-center md:text-start mt-6">
              I have a passion for technology and a strong desire to
              continuously learn and grow.
            </h2>
            <h2 className="px-5 py-1 text-center md:text-start mt-6">
              With experience in PC maintenance , I bring a unique perspective
              to software development.
            </h2>
            <h2 className="px-5 py-1 text-center md:text-start mt-6">
              If you are looking for a full-stack software engineer, I would
              love the opportunity to connect with you.
            </h2>
            <h2 className="px-5 py-1 text-center md:text-start mt-6">
              Please feel free to reach out to me. I am excited about the future
              and look forward to what opportunities coming in the future.
            </h2>
          </div>
          {/* inside container for my image */}
          <div className="m-auto aspect-auto col-start-1 col-end-7 row-start-1 row-end-2 md:col-start-5 md:col-end-7">
            <Image
              src={myImage}
              width={250}
              height={350}
              alt={"my image"}
              className="md:w-[300] md:h-[400px]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
