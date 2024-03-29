import { ChangeEvent, Dispatch, SetStateAction, useRef, useState } from "react";
import { Input } from "@/src/components/ui/input";
import { notify } from "@/src/app/lib/utils/toast";
import { Button } from "@/src/components/ui/button";

type UploadProps = {
  setImageUrl: React.Dispatch<React.SetStateAction<string>>;
  imageType: string;
};

function Upload({ setImageUrl, imageType }: UploadProps) {
  const [pending, setPending] = useState(false);
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
      const data = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const response = await data.json();
      response.success
        ? notify(response.message, true)
        : notify(response.message, false);
      setImageUrl(response.imageLink);
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
