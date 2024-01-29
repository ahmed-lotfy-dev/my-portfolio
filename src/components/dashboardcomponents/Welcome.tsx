"use client"
import React from "react"
import { useSession } from "next-auth/react"
import {NotAuthenticated} from "./NotAuthenticated"
import { LogoutButton } from "./auth-buttons"

export default function Welcome() {
  const { data: session } = useSession()
  const user = session?.user
  console.log(user)
  return (
    <div className=''>
      {!user && <NotAuthenticated />}
      {user && (
        <div className='flex flex-col justify-center items-center w-full'>
          <h2 className='mb-6'>
            Welcome {user?.name.split(" ")[0]} {user?.name.split(" ")[1]} to the
            dashboard.
          </h2>
          <LogoutButton />
        </div>
      )}
    </div>
  )
}
