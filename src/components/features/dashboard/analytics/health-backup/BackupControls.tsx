
import { Database, FileImage, HardDrive } from "lucide-react";
import { Button } from "@/src/components/ui/button";

interface BackupControlsProps {
  isAdmin: boolean;
  onTrigger: (type: 'full' | 'sql' | 'media') => void;
}

export function BackupControls({ isAdmin, onTrigger }: BackupControlsProps) {
  return (
    <div className="flex gap-2">
      <Button
        size="sm"
        variant="outline"
        onClick={() => onTrigger('sql')}
        disabled={!isAdmin}
        title={!isAdmin ? "Admin access required" : "Backup database only"}
        className="gap-2"
      >
        <Database className="w-4 h-4" />
        <span className="hidden sm:inline">SQL</span>
      </Button>
      <Button
        size="sm"
        variant="outline"
        onClick={() => onTrigger('media')}
        disabled={!isAdmin}
        title={!isAdmin ? "Admin access required" : "Backup media files only"}
        className="gap-2"
      >
        <FileImage className="w-4 h-4" />
        <span className="hidden sm:inline">Media</span>
      </Button>
      <Button
        size="sm"
        onClick={() => onTrigger('full')}
        disabled={!isAdmin}
        title={!isAdmin ? "Admin access required" : "Full backup (SQL + Media)"}
        className="gap-2"
      >
        <HardDrive className="w-4 h-4" />
        <span className="hidden sm:inline">Full Backup</span>
      </Button>
    </div>
  );
}
