"use client"
import { useState, useRef, useActionState } from "react"

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/components/ui/dialog"

import Image from "next/image"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { addProjectAction } from "@/src/app/actions/projectsActions"

import { notify } from "@/src/lib/utils/toast"

import { TagsInput } from "react-tag-input-component"

import { Textarea } from "@/src/components/ui/textarea"
import Submit from "@/src/components/ui/formSubmitBtn"
import { Upload } from "../Upload"
import { authClient } from "@/src/lib/auth-client"

function AddProjectComponent() {
  const [state, formAction] = useActionState(addProjectAction, null)
  const [selected, setSelected] = useState<string[]>(["featured"])
  const [imageUrl, setImageUrl] = useState("")
  const formRef = useRef<HTMLFormElement>(null)
  const { data: session } = authClient.useSession()
  const user = session?.user

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="flex w-full min-h-full justify-center items-start mt-6">
        <Dialog>
          <DialogTrigger className="bg-primary text-primary-foreground hover:bg-primary/90 h-10 py-2 px-4 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background">
            Add Project
          </DialogTrigger>
          <DialogContent className="max-w-[700px]">
            <form
              action={formAction}
              className="flex flex-col justify-start items-center w-full gap-5 text-black "
            >
              <Input
                className="w-2/3 mt-10"
                type="text"
                name="title"
                placeholder="Project Title"
              />
              <p className="text-sm text-red-400">
                {state?.error?.title && state?.error?.title?._errors}
              </p>

              <Textarea
                className="flex justify-center w-2/3"
                name="desc"
                placeholder="Project Description"
              ></Textarea>
              <p className="text-sm text-red-400">
                {state?.error?.desc && state?.error?.desc?._errors}
              </p>

              <Input
                className="w-2/3"
                type="text"
                name="repoLink"
                placeholder="Project Repo Link"
              />
              <p className="text-sm text-red-400">
                {state?.error?.repoLink && state?.error?.repoLink?._errors}{" "}
              </p>

              <Input
                className="w-2/3"
                type="text"
                name="liveLink"
                placeholder="Project Live Link"
              />
              <p className="text-sm text-red-400">
                {state?.error?.liveLink && state?.error?.liveLink?._errors}
              </p>

              <Upload setImageUrl={setImageUrl} imageType="Projects" />
              <p className="text-sm text-red-400">
                {state?.error?.imageLink && state?.error?.imageLink?._errors}
              </p>
              {imageUrl && (
                <Image
                  className="m-auto"
                  src={imageUrl}
                  width={300}
                  height={300}
                  alt="Certificate Image"
                />
              )}
              <Input type="hidden" name="imageLink" value={imageUrl} />
              <Input type="hidden" name="tags" value={selected} />

              <Label className="flex justify-center">Project Tags</Label>
              <TagsInput
                value={selected}
                onChange={setSelected}
                name="tags"
                placeHolder="Select Tech"
              />

              <DialogClose asChild>
                <Submit
                  btnText="Edit Certificate"
                  className="m-10"
                  type="submit"
                  onClick={() => {
                    if (user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
                      notify("Editing Completed Successfully", true)
                      setImageUrl("")
                      formRef.current?.reset()
                    } else {
                      notify("You don't have privilege to do this", false)
                    }
                  }}
                />
              </DialogClose>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

export { AddProjectComponent }
