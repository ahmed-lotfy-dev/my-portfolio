import { getSingleProject } from "@/src/app/lib/getProjects";

const page = async ({ params }: { params: { slug: string } }) => {
  const { slug } = params;
  const { singleProject } = await getSingleProject(slug);
  return <div>{singleProject?.projTitle}</div>;
};

export default page;
