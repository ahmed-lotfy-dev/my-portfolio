import Link from "next/link";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/components/ui/popover";
import { Button } from "@/src/components/ui/button";
import { MoreVertical, Pencil } from "lucide-react";
import { EditCertificate } from "../certificates/EditCertificate";

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
              <Button
                variant="ghost"
                className="w-full justify-start pl-2"
                asChild
              >
                <Link href={`/dashboard/projects/${EditedObject.id}`}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </Link>
              </Button>
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
