import React, { ChangeEvent, useRef, useState } from "react";
import { Input } from "./input";
import { useSession } from "next-auth/react";
import { Toaster } from "react-hot-toast";
import { notify } from "../../lib/utils/toast";
import axios, { AxiosRequestConfig } from "axios";
import { Button } from "./button";
import { Progress } from "./progress";

function Upload() {
  const { data: session } = useSession();
  const emailAddress = session?.user.email;
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileUpload = async () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);
    formData.append("emailAddress", emailAddress);

    try {
      const options: AxiosRequestConfig = {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent: any) => {
          const percentage = (progressEvent.loaded * 100) / progressEvent.total;
          setProgress(+percentage.toFixed(2));
        },
      };
      console.log(progress);
      const { data } = await axios.post("/api/upload", formData, options);
      console.log(data);
      data.success ? notify(data.message, true) : notify(data.message, false);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };
  return (
    <div>
      <Progress value={progress} />
      <Button onClick={handleFileUpload}>Upload Image</Button>
      <Input
        type="file"
        accept="images/*"
        name="image"
        className="w-2/3"
        onChange={handleFileChange}
        multiple={true}
        ref={fileInputRef}
        style={{ display: "none" }} // Hide the file input
      />
      <Toaster position="top-right" />
    </div>
  );
}

export { Upload };
