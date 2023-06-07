"use client";
import Link from "next/link";
import { useState } from "react";

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

  return <div>
    
  </div>;
};

export default Accordion;
