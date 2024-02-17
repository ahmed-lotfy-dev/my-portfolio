import { getSingleProject } from "@/src/app/actions/projectsActions";

export default async function SingleProjectPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;
  const { singleProject } = await getSingleProject(slug);
  return <div>{singleProject?.title}</div>;
}

