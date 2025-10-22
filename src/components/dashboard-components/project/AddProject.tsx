"use client"

import { useState, useRef, useEffect } from "react"
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
import { Textarea } from "@/src/components/ui/textarea"
import { TagsInput } from "react-tag-input-component"
import Submit from "@/src/components/ui/formSubmitBtn"
import { Upload } from "../Upload"
import { notify } from "@/src/lib/utils/toast"
import { authClient } from "@/src/lib/auth-client"
import { useActionState } from "react"
import { addProjectAction } from "@/src/app/actions/projectsActions"

function AddProjectComponent() {
  const [state, formAction] = useActionState(addProjectAction, null)
  const [selected, setSelected] = useState<string[]>(["featured"])
  const [imageUrl, setImageUrl] = useState("")
  const [open, setOpen] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)
  const { data: session } = authClient.useSession()
  const user = session?.user

  // ✅ Automatically close dialog & reset form on success
  useEffect(() => {
    if (state?.success) {
      notify("Project added successfully!", true)
      setOpen(false)
      setImageUrl("")
      formRef.current?.reset()
    } else if (state?.error && Object.keys(state.error).length > 0) {
      notify("Please fix the errors and try again.", false)
      // Clear inputs on validation error
      setImageUrl("")
      formRef.current?.reset()
    }
  }, [state])

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="flex w-full min-h-full justify-center items-start mt-6">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger className="bg-primary text-primary-foreground hover:bg-primary/90 h-10 py-2 px-4 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background">
            Add Project
          </DialogTrigger>

          <DialogContent className="max-w-[700px] overflow-y-auto max-h-[calc(100vh-100px)]">
            <DialogHeader>
              <DialogTitle>Add a New Project</DialogTitle>
              <DialogDescription>
                Fill in the details below to add a new project.
              </DialogDescription>
            </DialogHeader>

            <form
              ref={formRef}
              action={formAction}
              className="flex flex-col justify-start items-center w-full gap-5 text-black"
            >
              {/* Project Title */}
              <Input
                className="w-2/3 mt-10"
                type="text"
                name="title"
                placeholder="Project Title"
              />
              {state?.error?.title && (
                <p className="text-sm text-red-400">
                  {state.error.title._errors}
                </p>
              )}

              {/* Description */}
              <Textarea
                className="flex justify-center w-2/3"
                name="desc"
                placeholder="Project Description"
              />
              {state?.error?.desc && (
                <p className="text-sm text-red-400">
                  {state.error.desc._errors}
                </p>
              )}

              {/* Repo Link */}
              <Input
                className="w-2/3"
                type="text"
                name="repoLink"
                placeholder="Project Repo Link"
              />
              {state?.error?.repoLink && (
                <p className="text-sm text-red-400">
                  {state.error.repoLink._errors}
                </p>
              )}

              {/* Live Link */}
              <Input
                className="w-2/3"
                type="text"
                name="liveLink"
                placeholder="Project Live Link"
              />
              {state?.error?.liveLink && (
                <p className="text-sm text-red-400">
                  {state.error.liveLink._errors}
                </p>
              )}

              {/* Image Upload */}
              <Upload setImageUrl={setImageUrl} imageType="Projects" />
              {state?.error?.imageLink && (
                <p className="text-sm text-red-400">
                  {state.error.imageLink._errors}
                </p>
              )}
              {imageUrl && (
                <Image
                  className="m-auto"
                  src={imageUrl}
                  width={300}
                  height={300}
                  alt="Project Image"
                />
              )}
              <Input type="hidden" name="imageLink" value={imageUrl} />

              {/* Tags */}
              <Label className="flex justify-center">Project Tags</Label>
              <TagsInput
                value={selected}
                onChange={setSelected}
                name="tags"
                placeHolder="Select Tech"
              />
              <Input type="hidden" name="tags" value={selected} />

              {/* Submit */}
              <Submit
                btnText="Add Project"
                className="m-10"
                type="submit"
                disabled={!user?.email}
              />
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

export { AddProjectComponent }
