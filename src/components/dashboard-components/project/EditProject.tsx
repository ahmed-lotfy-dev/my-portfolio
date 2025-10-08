"use client"
import { ChangeEvent, useRef, useState, FormEvent } from "react"

import Image from "next/image"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { editProjectAction } from "@/src/app/actions/projectsActions"
import { notify } from "@/src/lib/utils/toast"
import Submit from "@/src/components/ui/formSubmitBtn"
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/src/components/ui/dialog"
import { Textarea } from "@/src/components/ui/textarea"
import { TagsInput } from "react-tag-input-component"
import { DialogClose } from "@radix-ui/react-dialog"
import { Upload } from "../Upload"
import { Pencil } from "lucide-react"
import { authClient } from "@/src/lib/auth-client"

function EditProject({ EditedObject }: any) {
  const { id } = EditedObject
  const [editedProj, setEditedProj] = useState(EditedObject)
  // const editProjectActionWithObject = editProjectAction.bind(null, editedProj)

  const [imageUrl, setImageUrl] = useState("")

  const [selected, setSelected] = useState<string[]>(["featured"])

  const formRef = useRef<HTMLFormElement>(null)
  const { data: session } = authClient.useSession()
  const user = session?.user

  const InputHandler = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setEditedProj((prevEditedProj: any) => {
      return {
        ...prevEditedProj,
        [name]: value,
      }
    })
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    // Modified this line
    event.preventDefault() // Prevent default form submission
    const formData = new FormData(event.currentTarget)
    await editProjectAction(editedProj, formData)
  }

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="flex w-full min-h-full justify-center items-start mt-6">
        <Dialog>
          <DialogTrigger className="bg-primary text-primary-foreground hover:bg-primary/90 h-10 py-2 px-4 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background">
            <Pencil className="mr-3" size={20} />
            Edit Project
          </DialogTrigger>
          <DialogContent className="w-[700px]">
            <form
              onSubmit={handleSubmit}
              className="flex flex-col justify-center items-center w-full gap-5 text-black "
            >
              <Input
                className="w-2/3"
                type="text"
                name="title"
                placeholder="Project Title"
                value={editedProj.title}
                onChange={InputHandler}
              />

              <Textarea
                className="flex justify-center w-2/3"
                name="desc"
                placeholder="Project Description"
                value={editedProj.desc}
                onChange={InputHandler}
              />

              <Input
                className="w-2/3"
                type="text"
                name="repoLink"
                placeholder="Project Repo Link"
                value={editedProj.repoLink}
                onChange={InputHandler}
              />

              <Input
                className="w-2/3"
                type="text"
                name="liveLink"
                placeholder="Project Live Link"
                value={editedProj.liveLink}
                onChange={InputHandler}
              />

              <Upload setImageUrl={setImageUrl} imageType="Projects" />
              {editedProj.imageLink ? (
                <Image
                  className="m-auto"
                  src={editedProj.imageLink}
                  width={200}
                  height={200}
                  alt="Certificate Image"
                />
              ) : (
                <Image
                  className="m-auto"
                  src={imageUrl}
                  width={200}
                  height={200}
                  alt="Certificate Image"
                />
              )}
              <Input type="hidden" name="tags" value={selected} />
              <Input type="hidden" name="id" value={editedProj.id} />

              <Input
                type="hidden"
                name="imageLink"
                value={editedProj.imageLink}
              />

              <Label className="flex justify-center">Project Tags</Label>
              <TagsInput
                value={selected}
                onChange={setSelected}
                name="tags"
                placeHolder="Select Tech"
              />

              <DialogClose asChild>
                <Submit
                  btnText="Edit Project"
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

export { EditProject }
