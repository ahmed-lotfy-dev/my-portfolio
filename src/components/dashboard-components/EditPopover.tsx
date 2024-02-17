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

  return (
    <Popover>
      <PopoverTrigger>
        <MoreVertical size={22} />
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
