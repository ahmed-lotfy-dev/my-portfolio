"use client"

import { signIn, signOut } from "next-auth/react"

export const LoginButton = () => {
  return (
    <button className='mt-6' onClick={() => signIn()}>
      Sign in
    </button>
  )
}

export const LogoutButton = () => {
  return (
    <button className='mt-6' onClick={() => signOut()}>
      Sign Out
    </button>
  )
}
