"use client";
import { useState } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import Toast from "../components/Toast";

interface FormData extends EventTarget {
  certTitle: {
    value: string;
  };
  certDesc: {
    value: string;
  };
  courseLink: {
    value: string;
  };
  certProfLink: {
    value: string;
  };
  certImage: {
    value: string;
  };
  file: File;
}

const AddCertificate = () => {
  const { data: session, status } = useSession();
  const role = session?.user?.role;

  const [image, setImage] = useState<string | Blob>("");
  const [previewUrl, setPreviewUrl] = useState<string>("");

  const changeHandler = async (event: any) => {
    if (event.target.files && event.target.files[0]) {
      const i = event.target.files[0];
      setImage(i);
      setPreviewUrl(URL.createObjectURL(i));
    }
  };

  const submitHandler = async (event: React.FormEvent<EventTarget>) => {
    if (role === "USER") {
      event.preventDefault();
    }
    if (role === "ADMIN") {
      console.log(image);
      console.log(previewUrl);
      const target = event.target as FormData;

      event.preventDefault();
      const body = new FormData();
      body.append("certTitle", target.certTitle.value);
      body.append("certDesc", target.certDesc.value);
      body.append("courseLink", target.courseLink.value);
      body.append("certProfLink", target.certProfLink.value);
      body.append("certImage", target.certImage.value);
      body.append("file", image);
      const response = await fetch("/api/certificates/add-certificate", {
        method: "POST",
        body,
      });
      const res = await response.json();
      console.log(res);
    }
  };

  return (
    <form
      className="flex flex-col justify-center items-center w-full gap-5 bg-gray-300 text-black"
      onSubmit={submitHandler}
      encType="multipart/form-data"
    >
      <label htmlFor="certTitle">Certificate Title</label>
      <input type="text" name="certTitle" />
      <label htmlFor="certDesc">Certificate Description</label>
      <input type="textarea" name="certDesc" />
      <label htmlFor="courseLink">Course Link</label>
      <input type="text" name="courseLink" />
      <label htmlFor="certProfLink">Certificate Proof</label>
      <input type="text" name="certProfLink" />
      <label htmlFor="certImage">Certificate Image</label>
      <input type="text" name="certImage" />

      <label htmlFor="upload">Image Upload</label>
      {!image ? (
        <div className="hidden"></div>
      ) : (
        <Image src={previewUrl} alt={previewUrl} width={100} height={100} />
      )}
      <Toast message={"message"} />

      <input type="file" name="image" onChange={changeHandler} />
      <button type="submit">Submit</button>
    </form>
  );
};

export default AddCertificate;
