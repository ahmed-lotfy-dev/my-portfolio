"use client";
import Link from "next/link";
import { useState } from "react";
import { IoArrowForwardSharp } from "react-icons/io5";
const Accordion = () => {
  const [isActive, setIsActive] = useState(false);
  const handleAccordion = () => {
    setIsActive(!isActive);
  };
  return (
    <div className="container mx-auto max-w-screen-xl w-full h-[10rem]  z-40">
      <div className="display flex flex-col">
        <div
          className="flex justify-between items-center w-full h-10 border-[1px] border-black py-[1.6rem] cursor-pointer"
          onClick={handleAccordion}
        >
          <h2 className="px-4">HTML , CSS Course</h2>
          <IoArrowForwardSharp
            className={`${isActive ? "rotate-90" : ""} mx-4`}
          />
        </div>

        <div
          className={`flex flex-row justify-between p-6 w-full bg-red-300 border-[1px] border-t-0 border-black ${
            isActive ? "flex active" : "closed"
          }`}
        >
          <div className="">
            <h3>Build Responsive Real-World Websites with HTML and CSS</h3>
          </div>
          <div className="space-x-5">
            <Link href="https://www.udemy.com/course/design-and-develop-a-killer-website-with-html5-and-css3/">
              Course Link
            </Link>
            <Link href="https://www.udemy.com/certificate/UC-155b5546-9c7a-4009-9266-78c078671603/">
              Certificate Link
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Accordion;
