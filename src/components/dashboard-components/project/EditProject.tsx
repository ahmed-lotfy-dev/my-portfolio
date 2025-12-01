"use client";
import { ChangeEvent, useRef, useState, FormEvent } from "react";

import Image from "next/image";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { editProjectAction } from "@/src/app/actions/projectsActions";
import { notify } from "@/src/lib/utils/toast";
import Submit from "@/src/components/ui/formSubmitBtn";
import { Switch } from "@/src/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/components/ui/dialog";
import { Textarea } from "@/src/components/ui/textarea";
import { DialogClose } from "@radix-ui/react-dialog";
import { Upload } from "../Upload";
import { Pencil } from "lucide-react";
import { authClient } from "@/src/lib/auth-client";
import { useTranslations } from "next-intl";

function EditProject({ EditedObject }: any) {
  const t = useTranslations("projects");
  const { id } = EditedObject;
  const [editedProj, setEditedProj] = useState(EditedObject);
  // const editProjectActionWithObject = editProjectAction.bind(null, editedProj)

  const [imageUrl, setImageUrl] = useState("");

  const formRef = useRef<HTMLFormElement>(null);
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const InputHandler = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditedProj((prevEditedProj: any) => {
      // Special handling for categories field
      if (name === "categories") {
        return {
          ...prevEditedProj,
          [name]: value.split(",").map((cat) => cat.trim()),
        };
      }
      return {
        ...prevEditedProj,
        [name]: value,
      };
    });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    // Modified this line
    event.preventDefault(); // Prevent default form submission
    const formData = new FormData(event.currentTarget);
    await editProjectAction(editedProj, formData);
  };

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="flex w-full min-h-full justify-center items-start">
        <Dialog>
          <DialogTrigger className="bg-primary text-primary-foreground hover:bg-primary/90 h-10 py-2 px-4 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background">
            <Pencil className="mr-3" size={20} />
            Edit Project
          </DialogTrigger>
          <DialogContent className="w-[700px] overflow-y-auto max-h-[calc(100vh-100px)] bg-blue-500">
            <DialogHeader className="flex justify-center items-center mt-3">
              <DialogTitle>{t("edit-title")}</DialogTitle>
              <DialogDescription>{t("edit-desc")}</DialogDescription>
            </DialogHeader>
            <form
              onSubmit={handleSubmit}
              ref={formRef}
              className="flex flex-col gap-5 justify-center items-center w-full bg-background text-foreground"
            >
              <Input
                className="w-2/3"
                type="text"
                name="title_en"
                placeholder="Project Title (EN)"
                value={editedProj.title_en}
                onChange={InputHandler}
              />

              <Input
                className="w-2/3"
                type="text"
                name="title_ar"
                placeholder="Project Title (AR)"
                value={editedProj.title_ar}
                onChange={InputHandler}
              />

              <Textarea
                className="flex justify-center w-2/3"
                name="desc_en"
                placeholder="Project Description (EN)"
                value={editedProj.desc_en}
                onChange={InputHandler}
              />

              <Textarea
                className="flex justify-center w-2/3"
                name="desc_ar"
                placeholder="Project Description (AR)"
                value={editedProj.desc_ar}
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
              <Input type="hidden" name="id" value={editedProj.id} />

              <Input
                type="hidden"
                name="imageLink"
                value={editedProj.imageLink}
              />

              <Label className="flex justify-center bg-black">
                {t("placeholders.categories")}
              </Label>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t("placeholders.categories_helper")}
              </p>
              <Input
                className="w-2/3"
                type="text"
                name="categories"
                placeholder={t("placeholders.categories")}
                value={
                  Array.isArray(editedProj.categories)
                    ? editedProj.categories.join(", ")
                    : editedProj.categories || ""
                }
                onChange={InputHandler}
              />

              {/* Published Toggle */}
              <div className="flex items-center justify-between w-2/3 p-4 border rounded-md">
                <div className="space-y-0.5">
                  <Label htmlFor="published-edit">{t("publish_toggle")}</Label>
                  <p className="text-sm text-muted-foreground">
                    {t("publish_toggle_desc")}
                  </p>
                </div>
                <Switch
                  id="published-edit"
                  checked={editedProj.published !== false}
                  onCheckedChange={(checked) =>
                    setEditedProj({ ...editedProj, published: checked })
                  }
                />
              </div>
              <input
                type="hidden"
                name="published"
                value={editedProj.published !== false ? "true" : "false"}
              />

              <DialogClose asChild>
                <Submit btnText="Edit Project" className="m-10" type="submit" />
              </DialogClose>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

export { EditProject };
