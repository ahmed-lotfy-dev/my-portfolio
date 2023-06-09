import React from "react"
import { currentUser } from "@clerk/nextjs"

export default async function Welcome() {
  const user = await currentUser()
  console.log(user)
  return (
    <h2 className='mb-7'>
      Welcome {user?.firstName} {user?.lastName} to the dashboard.
    </h2>
  )
}
