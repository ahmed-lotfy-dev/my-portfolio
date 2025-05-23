import { getSingleProject } from "@/src/app/actions/projectsActions";

export default async function SingleProjectPage(
  props: {
    params: Promise<{ slug: string }>;
  }
) {
  const params = await props.params;
  const { slug } = params;
  const { singleProject } = await getSingleProject(slug);
  return <div>{singleProject?.title}</div>;
}

