import { getSingleProject } from "@/src/app/actions/projectsActions"

export default async function SingleProjectPage(props: {
  params: Promise<{ slug: string }>
}) {
  const params = await props.params
  const { slug } = params
  const { project } = await getSingleProject(slug)
  return <div>{project?.title_en}</div>
}
