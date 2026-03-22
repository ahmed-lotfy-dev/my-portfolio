
import { getBackupLogs } from "@/src/app/actions/backup/queries";

export type BackupLog = Awaited<ReturnType<typeof getBackupLogs>>['data'];

export interface BackupStats {
  total: number;
  successful: number;
  failed: number;
  totalSize: number;
}

export interface SystemHealthProps {
  isAdmin: boolean;
  cfAccountId?: string;
  cfBucketName?: string;
  logsPromise: ReturnType<typeof getBackupLogs>;
}
