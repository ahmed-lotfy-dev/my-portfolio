import React from "react";
import { HiEllipsisVertical } from "react-icons/hi2";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Button } from "./button";
import { EditCertificate } from "../dashboardcomponents/EditCertificate";
import { Certificate, Project } from "@prisma/client";
import { EditProject } from "../dashboardcomponents/EditProject";

interface EditPopoverProps {
  onDeleteClick: () => void;
  EditedObject: Certificate | Project;
}

function EditPopover({ onDeleteClick, EditedObject }: EditPopoverProps) {
  const isCertificate = "certTitle" in EditedObject;

  return (
    <Popover>
      <PopoverTrigger>
        <HiEllipsisVertical size={22} />
      </PopoverTrigger>
      <PopoverContent className="w-full">
        <div className="cursor-pointer">
          <div className="w-full">
            {isCertificate ? (
              <EditCertificate EditedObject={EditedObject as Certificate} />
            ) : (
              <EditProject EditedObject={EditedObject as Project} />
            )}
            <Button className="w-full mt-2" onClick={onDeleteClick}>
              Delete
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export { EditPopover };