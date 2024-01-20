"use client"
import { Button } from "../components/ui/button"
import { IoLogoGoogle, IoLogoGithub } from "react-icons/io5"
import { signIn } from "next-auth/react"
import Aside from "../components/dashboardcomponents/Aside"

function page() {
  return (
    <div className='flex h-[calc(100vh_-_10vh)] w-full'>
      <Aside />
      <div
        className='flex flex-col justify-start items-center w-full mt-10'
        suppressHydrationWarning
      >
        <Button onClick={() => signIn("google", { callbackUrl: "/dashboard" })}>
          <IoLogoGoogle className='text-2xl'></IoLogoGoogle>
          <span className='ml-3'>Sign in with Google</span>
        </Button>
        <Button
          className='mt-6'
          onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
        >
          <IoLogoGithub className='text-3xl'></IoLogoGithub>
          <span className='ml-3'>Sign in with Github</span>
        </Button>
      </div>
    </div>
  )
}

export default page
