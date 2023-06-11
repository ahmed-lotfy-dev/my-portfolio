import { getServerSession } from "next-auth"
import { authOptions } from "../../lib/auth"

import NotAuthenticated from "@/src/app/components/dashboardcomponents/NotAuthenticated"
import AddProjectComponent from "@/src/app/components/dashboardcomponents/AddProjectComponent"
import ProjectList from "@/src/app/components/dashboardcomponents/ProjectList"
import getAllProjects from "../../lib/getProjects"

export default async function AddProject({}) {
  const user = await getServerSession(authOptions)
  const { allProjects } = await getAllProjects()
  return (
    <div className='w-full flex justify-center items-start'>
      {!user && <NotAuthenticated />}
      {user && (
        <div className='flex flex-col justify-center items-center'>
          <AddProjectComponent />
          <ProjectList allProjects={allProjects} />
        </div>
      )}
    </div>
  )
}
