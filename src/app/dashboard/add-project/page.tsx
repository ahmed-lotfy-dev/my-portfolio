"use client"
import { useState } from "react"
import Image from "next/image"
import toast, { Toaster } from "react-hot-toast"
import { TagsInput } from "react-tag-input-component"

import { AddProjectAction } from "@/src/app/_actions"

import "@uploadthing/react/styles.css"
import { UploadButton } from "@uploadthing/react"
//@ts-ignore
import { OurFileRouter } from "./api/uploadthing/core"
import React from "react"

type Props = {}

export default function AddProject({}: Props) {
  const [image, setImage] = useState<string>("")
  const [previewUrl, setPreviewUrl] = useState<string>("")
  const [selected, setSelected] = useState(["react"])

  return (
    <div className='flex w-full min-h-full'>
      <form
        className='flex flex-col justify-center items-center w-full gap-5 bg-gray-300 text-black '
        action={AddProjectAction}
      >
        <div className='flex flex-col items-center'>
          <label className='mb-5' htmlFor='projectTitle'>
            Project Title
          </label>
          <input type='text' name='projectTitle' />
        </div>
        <div className='flex flex-col items-center'>
          <label className='mb-5' htmlFor='projectDesc'>
            Project Description
          </label>
          <input type='text' name='projectDesc' />
        </div>
        <div className='flex flex-col items-center'>
          <label className='mb-5' htmlFor='projectRepoLink'>
            Project Repo Link
          </label>
          <input type='text' name='projectRepoLink' />
        </div>
        <div className='flex flex-col items-center'>
          <label className='mb-5' htmlFor='projectLiveLink'>
            Project Live Link
          </label>
          <input type='text' name='projectLiveLink' />
        </div>
        <input type='hidden' name='projectImageLink' value={previewUrl} />
        {previewUrl ? (
          <Image src={image!} width={300} height={300} alt={`${previewUrl}`} />
        ) : (
          ""
        )}

        <UploadButton<OurFileRouter>
          //@ts-ignore
          endpoint='imageUploader'
          onClientUploadComplete={(res) => {
            // Do something with the response
            console.log("Files: ", res)
            setPreviewUrl(res![0].fileUrl)
            setImage(res![0].fileUrl)
            toast.success("poject image uploaded successfully", {
              position: "top-right",
            })
          }}
          onUploadError={(error: Error) => {
            // Do something with the error.
            alert(`ERROR! ${error.message}`)
          }}
        />
        <Toaster />
        <div>
          <h1>Add Fruits</h1>
          <TagsInput
            value={selected}
            onChange={setSelected}
            name='tags'
            placeHolder='enter fruits'
          />
          <em>press enter or comma to add new tag</em>
        </div>
        <button
          type='submit'
          onSubmit={() => {
            setImage("")
            setPreviewUrl("")
          }}
        >
          Submit
        </button>
      </form>
    </div>
  )
}
