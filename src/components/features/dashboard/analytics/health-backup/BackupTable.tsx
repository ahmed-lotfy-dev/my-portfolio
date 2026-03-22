
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/src/components/ui/table";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import { Loader2, HardDrive, Download, ExternalLink, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { StatusBadge } from "./StatusBadge";
import { BackupLog } from "@/src/lib/types/analytics";

interface BackupTableProps {
  logs: BackupLog;
  loading: boolean;
  onDownload: (key: string) => void;
  onDownloadComplete: (log: any) => void;
  onDelete: (id: string, path: string | null, type: string) => void;
  getR2Link: (path: string) => string;
}

export function BackupTable({
  logs,
  loading,
  onDownload,
  onDownloadComplete,
  onDelete,
  getR2Link
}: BackupTableProps) {
  return (
    <div className="rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-[120px]">Status</TableHead>
            <TableHead className="w-[100px]">Type</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-right w-[100px]">Size</TableHead>
            <TableHead className="text-right w-[140px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading && (!logs || logs.length === 0) ? (
            <TableRow>
              <TableCell colSpan={5} className="h-32 text-center">
                <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <p className="text-sm">Loading backups...</p>
                </div>
              </TableCell>
            </TableRow>
          ) : !logs || logs.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="h-32 text-center">
                <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                  <HardDrive className="w-12 h-12 opacity-20" />
                  <p className="text-sm font-medium">No backups found</p>
                  <p className="text-xs">Create your first backup using the buttons above</p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            logs.map((log) => (
              <TableRow key={log.id} className="group">
                <TableCell><StatusBadge status={log.status} /></TableCell>
                <TableCell>
                  <Badge variant="outline" className="capitalize">
                    {log.type}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {formatDistanceToNow(new Date(log.startedAt), { addSuffix: true })}
                </TableCell>
                <TableCell className="text-right text-sm font-mono">
                  {log.sizeBytes ? `${(log.sizeBytes / 1024 / 1024).toFixed(2)} MB` : '-'}
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-1">
                    {log.status === 'SUCCESS' && log.path && (
                      <>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => onDownloadComplete(log)}
                          title="Download complete backup as ZIP"
                          className="h-8 w-8 text-primary hover:bg-primary/10 hover:text-primary-light"
                        >
                          <HardDrive className="w-4 h-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => onDownload(log.path!)}
                          title={log.type === 'media' ? "Download manifest" : "Download SQL dump"}
                          className="h-8 w-8"
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                        <a
                          href={getR2Link(log.path!)}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Button
                            size="icon"
                            variant="ghost"
                            title="View in R2 Dashboard"
                            className="h-8 w-8"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                        </a>
                      </>
                    )}
                    {(log.status === 'SUCCESS' || log.status === 'FAILED') && (
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => onDelete(log.id, log.path, log.type)}
                        title="Delete backup"
                        className="h-8 w-8 text-red-300 hover:bg-red-500/10 hover:text-red-200"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
