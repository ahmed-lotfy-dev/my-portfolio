"use client";
import { Upload } from "../components/Upload";

function page() {
  return (
    <div className="w-full min-h-screen flex flex-col justify-center items-center">
      <h1>Upload Page</h1>
      <Upload />
    </div>
  );
}

export default page;
