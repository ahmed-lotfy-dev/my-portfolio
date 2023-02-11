"use client";
import Link from "next/link";
import { useState } from "react";
import { IoArrowForwardSharp } from "react-icons/io5";

const data: DataType[] = [
  {
    certTitle: "HTML, CSS Course",
    courseLink:
      "https://www.udemy.com/course/design-and-develop-a-killer-website-with-html5-and-css3/",
    certProfLink:
      "https://www.udemy.com/certificate/UC-155b5546-9c7a-4009-9266-78c078671603/",
  },
];

interface DataType {
  certTitle: string;
  courseLink: string;
  certProfLink: string;
}

const Accordion = () => {
  const [Index, setIndex] = useState(false);

  return (
    // <div className="container mx-auto max-w-screen-xl w-full h-[10rem]  z-40">
    //   <div className="flex flex-col">
    //     <div
    //       className="flex justify-between items-center w-full h-10 border-[1px] border-black py-[1.6rem] cursor-pointer"
    //       onClick={handleAccordion}
    //     >
    //       <h2 className="px-4">HTML , CSS Course</h2>
    //       <IoArrowForwardSharp
    //         className={`${isActive ? "rotate-90" : ""} mx-4`}
    //       />
    //     </div>

    //     <div
    //       className={`justify-between p-6 w-full bg-red-300 border-[1px] border-t-0 border-black ${
    //         isActive ? "flex active" : "closed"
    //       }`}
    //     >
    //       <div className="">
    //         <h3>Build Responsive Real-World Websites with HTML and CSS</h3>
    //       </div>
    //       <div className="space-x-5">
    //         <Link href="https://www.udemy.com/course/design-and-develop-a-killer-website-with-html5-and-css3/">
    //           Course Link
    //         </Link>
    //         <Link href="https://www.udemy.com/certificate/UC-155b5546-9c7a-4009-9266-78c078671603/">
    //           Certificate Link
    //         </Link>
    //       </div>
    //     </div>
    //   </div>
    // </div>
    <div className="flex flex-col justify-center items-center md:mt-32 md:mx-60 p-10 rounded-xl h-auto py-20 bg-gray-50">
      {/* <AccordionUi
        Index={Index}
        setIndex={setIndex}
        title={data.certTitle}
        courseLink={data.courseLink}
        certProfLink={data.certProfLink}
      /> */}
      {/*
      and pass too the index and setindex inside to manage its state
      will pass the props data and map over
      one accordion and then take the data
      to inside of accordion ui
      map over the projects array
      and pass the props data to
      the accordion ui*/}
    </div>
  );
};

export default Accordion;
