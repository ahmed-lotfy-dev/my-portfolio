'use client'
import { useState } from "react"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/app/components/ui/popover"

import { Input } from "@/src/app/components/ui/input"
import { Label } from "@/src/app/components/ui/label"
import { AddProjectAction } from "@/src/app/_actions"

import toast, { Toaster } from "react-hot-toast"

import { useSession } from "next-auth/react"

import { TagsInput } from "react-tag-input-component"

const notify = (message: string, status: boolean) =>
  status ? toast.success(message) : toast.error(message)

export default function AddProject() {
  const [selected, setSelected] = useState(["featured"])
  const { data: session } = useSession()
  const emailAddress = session?.user.email

  return (
    <div className='flex flex-col justify-center items-center'>
      <div className='flex w-full min-h-full justify-center items-start mt-6'>
        <Popover>
          <PopoverTrigger>Add New Project</PopoverTrigger>
          <PopoverContent className='w-[500px]'>
            <form
              className='flex flex-col justify-center items-center w-full gap-5  text-black '
              action={AddProjectAction}
            >
              <div className='flex flex-col items-center'>
                <Label className='mb-5 m-10' htmlFor='projTitle'>
                  Project Title
                </Label>
                <Input type='text' name='projTitle' />
              </div>
              <div className='flex flex-col items-center'>
                <Label className='mb-5' htmlFor='projDesc'>
                  Project Description
                </Label>
                <Input type='text' name='projDesc' />
              </div>
              <div className='flex flex-col items-center'>
                <Label className='mb-5' htmlFor='projRepoLink'>
                  Project Repo Link
                </Label>
                <Input type='text' name='projRepoLink' />
              </div>
              <div className='flex flex-col items-center'>
                <Label className='mb-5' htmlFor='projLiveLink'>
                  Project Live Link
                </Label>
                <Input type='text' name='projLiveLink' />
              </div>
              <Label htmlFor='picture'>Project Image</Label>
              <Input className='1/3s' type='file' name='projImageLink' />

              <Input type='hidden' name='tags' value={selected} />
              <Input type='hidden' name='emailAddress' value={emailAddress} />

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
                className='m-10'
                type='submit'
                onClick={() => {
                  if (emailAddress !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
                    console.log(emailAddress)
                    notify("sorry you don't have admin priviliges", false)
                  } else {
                    notify("Adding Completed Successfully", true)
                  }
                }}
              >
                Submit
              </button>
            </form>
          </PopoverContent>
        </Popover>
        <Toaster position='top-right' />
      </div>
    </div>
  )
}
