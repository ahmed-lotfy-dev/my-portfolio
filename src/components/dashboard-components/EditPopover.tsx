import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/components/ui/popover";
import { Button } from "@/src/components/ui/button";
import { MoreVertical } from "lucide-react";
import { EditCertificate } from "./certificate/EditCertificate";
import { EditProject } from "./project/EditProject";
interface EditPopoverProps {
  onDeleteClick: () => void;
  EditedObject: any;
}
function EditPopover({ onDeleteClick, EditedObject }: EditPopoverProps) {
  const isCertificate = "courseLink" in EditedObject;

  const handleDelete = () => {
    if (
      window.confirm(
        "Are you sure you want to delete this? This action cannot be undone."
      )
    ) {
      onDeleteClick();
    }
  };

  return (
    <Popover>
      <PopoverTrigger>
        <MoreVertical size={22} />
      </PopoverTrigger>
      <PopoverContent className="w-full">
        <div className="">
          <div className="w-full">
            {isCertificate ? (
              <EditCertificate EditedObject={EditedObject} />
            ) : (
              <EditProject EditedObject={EditedObject} />
            )}
            <Button
              className="w-full mt-2 cursor-pointer"
              onClick={handleDelete}
            >
              Delete
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export { EditPopover };
