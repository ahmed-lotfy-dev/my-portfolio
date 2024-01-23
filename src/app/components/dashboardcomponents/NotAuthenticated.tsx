"use client"
import { LoginButton } from "./auth-buttons"

export default function NotAuthenticated() {
  return (
    <div className='flex flex-col justify-center'>
      <h2 className='mt-6'>Sorry You{"'"}re Not Authenticated</h2>
      <LoginButton />
    </div>
  )
}
