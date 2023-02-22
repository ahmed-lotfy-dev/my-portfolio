"use client";
import { useState } from "react";
import Image from "next/image";

type FormData = {
  projectTitle: string;
  projectDescription: string;
  file: File;
};

const AddProject = () => {
  const [image, setImage] = useState<string | Blob>("");
  const [previewUrl, setPreviewUrl] = useState<string>("");

  const changeHandler = async (event: any) => {
    if (event.target.files && event.target.files[0]) {
      const i = event.target.files[0];

      setImage(i);
      setPreviewUrl(URL.createObjectURL(i));
    }
  };

  const submitHandler = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const body = new FormData();
    // @ts-ignore
    body.append("projectTitle", event.target.projectTitle.value);
    // @ts-ignore
    body.append("projectDescription", event.target.projectDescription.value);
    body.append("file", image);
    const response = await fetch("/api/projects/add-project", {
      method: "POST",
      body,
    });
    const res = await response.json();
    console.log(res);
  };

  return (
    <form
      className="flex flex-col justify-center items-center w-full gap-5 bg-gray-300 text-black"
      onSubmit={submitHandler}
      encType="multipart/form-data"
    >
      <label htmlFor="projectTitle">Project Title</label>
      <input type="text" name="projectTitle" />
      <label htmlFor="projectDescription">Project Description</label>
      <input type="text" name="projectDescription" />
      <label htmlFor="upload">Image Upload</label>

      {!image ? (
        <div className="hidden"></div>
      ) : (
        <Image src={previewUrl} alt={previewUrl} width={100} height={100} />
      )}

      <input type="file" name="image" onChange={changeHandler} />
      <button type="submit">Submit</button>
    </form>
  );
};

export default AddProject;
