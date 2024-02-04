import React from "react";
import { HiEllipsisVertical } from "react-icons/hi2";
import { Popover, PopoverTrigger, PopoverContent } from "../ui/popover";
import { Button } from "../ui/button";

function BlogPopover() {
  const handleDelete = () => {
    console.log("Delete Blog");
  };
  return (
    <>
      <Popover>
        <PopoverTrigger>
          <HiEllipsisVertical size={22} />
        </PopoverTrigger>
        <PopoverContent className="w-full">
          <div className="cursor-pointer">
            <div className="w-full">
              <Button className="w-full mt-2" onClick={handleDelete}>
                Delete
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </>
  );
}

export { BlogPopover };
