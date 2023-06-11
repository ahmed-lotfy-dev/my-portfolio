"use client"

import { useSession } from "next-auth/react"

import NotAuthenticated from "@/src/components/dashboardcomponents/NotAuthenticated"

import AddProjectComponent from "@/src/components/dashboardcomponents/AddProjectComponent"
import ProjectList from "@/src/components/dashboardcomponents/ProjectList"

export default function AddProject({}) {
  const { data: session } = useSession()
  const emailAddress = session?.user
  const user = session?.user

  return (
    <div className='w-full flex justify-center items-start'>
      {!user && <NotAuthenticated />}
      {user && (
        <div className='flex flex-col justify-center items-center'>
          <AddProjectComponent />
          <ProjectList />
        </div>
      )}
    </div>
  )
}
