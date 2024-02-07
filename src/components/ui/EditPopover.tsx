import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Button } from "./button";
import { EditCertificate } from "../dashboard-components/EditCertificate";
import { EditProject } from "../dashboard-components/EditProject";
import { MoreVertical } from "lucide-react";

interface EditPopoverProps {
  onDeleteClick: () => void;
  EditedObject: any;
}
function EditPopover({ onDeleteClick, EditedObject }: EditPopoverProps) {
  const isCertificate = "courseLink" in EditedObject;

  return (
    <Popover>
      <PopoverTrigger>
        <MoreVertical size={22} />;
      </PopoverTrigger>
      <PopoverContent className="w-full">
        <div className="cursor-pointer">
          <div className="w-full">
            {isCertificate ? (
              <EditCertificate EditedObject={EditedObject} />
            ) : (
              <EditProject EditedObject={EditedObject} />
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
