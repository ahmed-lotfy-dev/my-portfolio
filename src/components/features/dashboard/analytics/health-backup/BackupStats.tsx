
import { Card, CardContent } from "@/src/components/ui/card";
import { HardDrive, CheckCircle2, XCircle, Database } from "lucide-react";
import { BackupStats as IBackupStats } from "@/src/lib/types/analytics";

interface BackupStatsProps {
  stats: IBackupStats;
}

export function BackupStats({ stats }: BackupStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Backups</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
            <HardDrive className="w-8 h-8 text-muted-foreground opacity-50" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Successful</p>
              <p className="text-2xl font-bold text-green-600">{stats.successful}</p>
            </div>
            <CheckCircle2 className="w-8 h-8 text-green-600 opacity-50" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Failed</p>
              <p className="text-2xl font-bold text-red-600">{stats.failed}</p>
            </div>
            <XCircle className="w-8 h-8 text-red-600 opacity-50" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Size</p>
              <p className="text-2xl font-bold">{(stats.totalSize / 1024 / 1024).toFixed(1)} MB</p>
            </div>
            <Database className="w-8 h-8 text-muted-foreground opacity-50" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
