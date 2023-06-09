"use client"
import { useRef, useState } from "react"
import Image from "next/image"
import toast, { Toaster } from "react-hot-toast"
import { TagsInput } from "react-tag-input-component"

import { AddProjectAction } from "../../_actions"

import { Input } from "@/src/app/components/ui/input"
import { Label } from "@/src/app/components/ui/label"
import { useUser } from "@clerk/nextjs"

type Props = {}

const notify = (message: string, status: boolean) =>
  status ? toast.success(message) : toast.error(message)

export default function AddProject({}: Props) {
  const imageLink = useRef()
  const [image, setImage] = useState<string>("")
  const [previewUrl, setPreviewUrl] = useState<string>("")
  const [selected, setSelected] = useState(["react"])
  const emailAddress = useUser().user?.emailAddresses[0].emailAddress as any

  return (
    <div className='flex w-full min-h-full'>
      <form
        className='flex flex-col justify-center items-center w-full gap-5 bg-gray-100 text-black '
        action={AddProjectAction}
      >
        <div className='flex flex-col items-center'>
          <label className='mb-5' htmlFor='projTitle'>
            Project Title
          </label>
          <input type='text' name='projTitle' />
        </div>
        <div className='flex flex-col items-center'>
          <label className='mb-5' htmlFor='projDesc'>
            Project Description
          </label>
          <input type='text' name='projDesc' />
        </div>
        <div className='flex flex-col items-center'>
          <label className='mb-5' htmlFor='projRepoLink'>
            Project Repo Link
          </label>
          <input type='text' name='projRepoLink' />
        </div>
        <div className='flex flex-col items-center'>
          <label className='mb-5' htmlFor='projLiveLink'>
            Project Live Link
          </label>
          <input type='text' name='projLiveLink' />
        </div>
        <Label htmlFor='picture'>Picture</Label>
        <Input className='w-1/4' type='file' name='projImageLink' />
        <Input
          className='w-1/4'
          type='hidden'
          name='emailAddress'
          value={emailAddress}
        />

        <input type='hidden' name='tags' value={selected} />
        {previewUrl ? (
          <Image src={image!} width={300} height={300} alt={`${previewUrl}`} />
        ) : (
          ""
        )}

        <Toaster position='top-right' />
        <div>
          <h1>Project Tags</h1>
          <TagsInput
            value={selected}
            onChange={setSelected}
            name='tags'
            placeHolder='enter fruits'
          />
        </div>
        <button
          type='submit'
          onClick={() => {
            if (emailAddress !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
              console.log(emailAddress)
              console.log(process.env.NEXT_PUBLIC_ADMIN_EMAIL)
              notify("sorry you don't have admin priviliges", false)
            } else {
              notify("Adding Completed Successfully", true)
            }
          }}
        >
          Submit
        </button>
      </form>
    </div>
  )
}
