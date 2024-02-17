import { Input } from "@/src/components/ui/input";
import React from "react";

type Props = {};

const page = (props: Props) => {
  return (
    <div className="w-full justify-center items-center">
      <Input type="file" name="file" className="w-1/3 m-auto mt-10" />
    </div>
  );
};

export default page;
