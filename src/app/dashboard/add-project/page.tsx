"use client"
import { useRef, useState } from "react"
import Image from "next/image"
import toast, { Toaster } from "react-hot-toast"
import { TagsInput } from "react-tag-input-component"

import { AddProjectAction } from "../../_actions"

import { Input } from "@/src/app/components/ui/input"
import { Label } from "@/src/app/components/ui/label"

type Props = {}

export default function AddProject({}: Props) {
  const imageLink = useRef()
  const [image, setImage] = useState<string>("")
  const [previewUrl, setPreviewUrl] = useState<string>("")
  const [selected, setSelected] = useState(["react"])
  const imageLinkRef = useRef<string | undefined>()

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
        <input type='hidden' name='tags' value={selected} />
        {previewUrl ? (
          <Image src={image!} width={300} height={300} alt={`${previewUrl}`} />
        ) : (
          ""
        )}

        <Toaster />
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
            setImage("")
            setPreviewUrl("")
            console.log("hello world frontend")
          }}
        >
          Submit
        </button>
      </form>
    </div>
  )
}
