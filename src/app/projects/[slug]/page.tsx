import React from "react";
import { getSingleProject } from "../../lib/getProjects";

const page = async ({ params }: { params: { slug: string } }) => {
  const { slug } = params;
  const { project } = await getSingleProject(slug);
  return <div>{project?.projTitle}</div>;
};

export default page;
