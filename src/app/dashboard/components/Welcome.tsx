"use client"
import React from "react"
import { useUser } from "@clerk/nextjs"

export default async function Welcome() {
  const user = useUser().user
  console.log(user)
  return (
    <h2 className='mb-7'>
      Welcome {user?.firstName} {user?.lastName} to the dashboard.
    </h2>
  )
}
