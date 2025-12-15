/**
 * Reusable delete confirmation dialog component
 * Consolidates AlertDialog patterns found across multiple components
 */

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/src/components/ui/alert-dialog";
import { Button } from "@/src/components/ui/button";
import { ReactNode } from "react";

interface DeleteConfirmationDialogProps {
  /** The name of the item being deleted (displayed in the message) */
  itemName: string;
  /** The type of item (e.g., "project", "certificate", "image") */
  itemType?: string;
  /** Callback function to execute when deletion is confirmed */
  onConfirm: () => void | Promise<void>;
  /** Optional: Custom trigger button. If not provided, a default delete button is used */
  trigger?: ReactNode;
  /** Optional: Custom dialog title */
  title?: string;
  /** Optional: Custom dialog description */
  description?: string;
  /** Optional: Custom confirm button text */
  confirmText?: string;
}

/**
 * A reusable confirmation dialog for delete actions
 * 
 * @example
 * ```tsx
 * <DeleteConfirmationDialog
 *   itemName={project.title}
 *   itemType="project"
 *   onConfirm={() => handleDelete(project.id)}
 * />
 * ```
 * 
 * @example With custom trigger
 * ```tsx
 * <DeleteConfirmationDialog
 *   itemName="My Certificate"
 *   onConfirm={handleDelete}
 *   trigger={
 *     <Button variant="destructive">
 *       <Trash2 /> Delete
 *     </Button>
 *   }
 * />
 * ```
 */
export function DeleteConfirmationDialog({
  itemName,
  itemType = "item",
  onConfirm,
  trigger,
  title = "Are you absolutely sure?",
  description,
  confirmText = "Delete Permanently",
}: DeleteConfirmationDialogProps) {
  const defaultDescription = `This will permanently delete ${itemType} "${itemName}". This action cannot be undone.`;

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {trigger || (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10 rounded-full"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 6h18" />
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
            </svg>
          </Button>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>
            {description || defaultDescription}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.stopPropagation();
              onConfirm();
            }}
            className="bg-destructive hover:bg-destructive/90"
          >
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
