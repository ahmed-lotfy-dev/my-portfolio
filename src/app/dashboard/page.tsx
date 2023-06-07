"use client"
import Link from "next/link"
import { useSession, signOut } from "next-auth/react"

type Props = {}

export default function Page({}: Props) {
  const { data: session, status } = useSession()

  return (
    <div className='min-h-full flex flex-col gap-3 w-full justify-start items-center mt-10'>
      <h2>Welcome {session?.user?.name?.split(" ")[0]} to the dashboard.</h2>
      <button
        onClick={() =>
          signOut({
            callbackUrl: `/dashboard`,
          })
        }
      >
        Sign Out
      </button>
    </div>
  )
}
