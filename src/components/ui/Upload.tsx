import { ChangeEvent, Dispatch, SetStateAction, useRef, useState } from "react";
import { Input } from "./input";
import { notify } from "@/src/app/lib/utils/toast";
import axios, { AxiosRequestConfig } from "axios";
import { Button } from "./button";
import { useSession } from "next-auth/react";

type UploadProps = {
  setImageUrl: React.Dispatch<React.SetStateAction<string>>;
  imageType: string;
};

function Upload({ setImageUrl, imageType }: UploadProps) {
  const { data: session } = useSession();
  const user = session?.user;  const [pending, setPending] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileUpload = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setPending(true);
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);
    formData.append("image-type", imageType);

    try {
      const options: AxiosRequestConfig = {
        headers: { "Content-Type": "multipart/form-data" },
      };

      const { data } = await axios.post("/api/upload", formData, options);
      data.success ? notify(data.message, true) : notify(data.message, false);
      console.log(data);
      setImageUrl(data.imageLink);
      setPending(false);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  return (
    <div>
      <Button onClick={handleFileUpload} disabled={pending}>
        {pending ? "Uploading..." : "Upload Image"}
      </Button>
      <Input
        type="file"
        accept="images/*"
        name="image"
        className="w-2/3"
        onChange={handleFileChange}
        multiple={true}
        ref={fileInputRef}
        style={{ display: "none" }}
      />
    </div>
  );
}

export { Upload };
