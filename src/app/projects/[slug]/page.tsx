import React from "react";
import { getSingleProject } from "@/src/app/lib/getProjects";

const page = async ({ params }: { params: { slug: string } }) => {
  const { slug } = params;
  const { project } = await getSingleProject(slug);
  return <div>{project?.title}</div>;
};

export default page;
