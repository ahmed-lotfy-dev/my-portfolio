"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import Image from "next/image";

type FormData = {
  projectTitle: string;
  projectDescription: string;
  file: File;
};

const AddProject = () => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = handleSubmit(async (data, event) => {
    event?.preventDefault();
    try {
      const formData = new FormData();
      formData.append("projectTitle", data.projectTitle);
      formData.append("projectTitle", data.projectDescription);
      formData.append("projectTitle", data.file);

      const res = await fetch("/api/add-project", {
        body: formData,
        // headers: {
        //   "Content-Type": "application/x-www-form-urlencoded",
        //   // "Content-Type": "multipart/form-data",
        // },
        method: "post",
      });
      console.log(res.json());
    } catch (error) {
      console.log(error);
    }
  });

  return (
    <form
      className="flex flex-col justify-center items-center w-full gap-10 bg-gray-300 text-black"
      onSubmit={onSubmit}
    >
      <label>Project Title</label>
      <input {...register("projectTitle")} />
      <label>Project Description</label>
      <input {...register("projectDescription")} />
      <label>Image Upload</label>

      {!file ? (
        <div className="hidden"></div>
      ) : (
        <Image src={previewUrl} alt={previewUrl} width={100} height={100} />
      )}

      <input
        {...register("file")}
        type="file"
        name="myFile"
        id="myFile"
        onChange={(e) => {
          setFile(e.target.files![0]);
          setPreviewUrl(URL.createObjectURL(e.target.files![0]));
        }}
      />
      <button
        type="submit"
        onClick={() => {
          console.log("submitted");
          console.log(previewUrl);
        }}
      >
        Submit
      </button>
    </form>
  );
};

export default AddProject;