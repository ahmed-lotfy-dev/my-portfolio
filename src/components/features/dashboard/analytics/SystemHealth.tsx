
"use client";

import { use, useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/src/components/ui/card";
import { getBackupLogs } from "@/src/app/actions/backup/queries";
import { formatDistanceToNow } from "date-fns";

// Sub-components
import { BackupStats } from "./health-backup/BackupStats";
import { BackupControls } from "./health-backup/BackupControls";
import { BackupTable } from "./health-backup/BackupTable";

// Types
import { SystemHealthProps, BackupLog, BackupStats as IBackupStats } from "@/src/lib/types/analytics";

export default function SystemHealth({ isAdmin, cfAccountId, cfBucketName, logsPromise }: SystemHealthProps) {
  const initialData = use(logsPromise) as { success: boolean; data?: any[] };
  const [logs, setLogs] = useState<BackupLog>(initialData.data || []);
  const [loading, setLoading] = useState(false);

  const fetchLogs = async () => {
    setLoading(true);
    const result = await getBackupLogs();
    if (result.success && result.data) {
      setLogs(result.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    const interval = setInterval(fetchLogs, 30000);
    return () => clearInterval(interval);
  }, []);

  const triggerBackup = async (type: 'full' | 'sql' | 'media') => {
    if (!isAdmin) return;
    await fetch('/api/backup/trigger', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type })
    });
    fetchLogs();
  };

  const downloadBackup = async (key: string) => {
    try {
      const res = await fetch(`/api/backup/download?key=${encodeURIComponent(key)}`);
      const data = await res.json();
      if (data.success && data.url) {
        const fileRes = await fetch(data.url);
        const blob = await fileRes.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = key.split('/').pop() || 'backup.dump';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        alert('Failed to get download URL');
      }
    } catch (e) {
      console.error(e);
      alert('Error downloading backup');
    }
  };

  const deleteBackup = async (id: string, path: string | null, type: string) => {
    if (!confirm('Are you sure you want to delete this backup? This cannot be undone.')) return;
    try {
      const res = await fetch('/api/backup/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, path, type })
      });
      const data = await res.json();
      if (data.success) {
        fetchLogs();
      } else {
        alert('Failed to delete: ' + data.message);
      }
    } catch (e) {
      console.error(e);
      alert('Error deleting backup');
    }
  };

  const downloadCompleteBackup = async (log: any) => {
    try {
      const timestamp = log.path?.split('/')[2]?.replace('_manifest.json', '');
      if (!timestamp) {
        alert('Cannot determine backup timestamp');
        return;
      }

      const params = new URLSearchParams();
      if (log.type === 'full' || log.type === 'sql') params.append('sql', `backup/sql/db_${timestamp}.dump`);
      if (log.type === 'full' || log.type === 'media') params.append('media', `backup/media/${timestamp}/`);
      params.append('timestamp', timestamp);

      window.open(`/api/backup/zip?${params.toString()}`, '_blank');
    } catch (e) {
      console.error(e);
      alert('Error preparing backup download');
    }
  };

  const getR2Link = (path: string) => {
    if (!cfAccountId || !cfBucketName) return '#';
    return `https://dash.cloudflare.com/${cfAccountId}/r2/buckets/${cfBucketName}/objects?prefix=${encodeURIComponent(path)}`;
  };

  const stats: IBackupStats = {
    total: logs?.length || 0,
    successful: logs?.filter((l: any) => l.status === 'SUCCESS').length || 0,
    failed: logs?.filter((l: any) => l.status === 'FAILED').length || 0,
    totalSize: logs?.reduce((acc: number, l: any) => acc + (l.sizeBytes || 0), 0) || 0,
  };

  const lastSuccessful = logs?.find(l => l.status === 'SUCCESS');

  return (
    <div className="space-y-6" id="backups">
      <BackupStats stats={stats} />

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Backup Management</CardTitle>
              <CardDescription className="mt-1.5">
                {lastSuccessful
                  ? `Last successful backup: ${formatDistanceToNow(new Date(lastSuccessful.startedAt), { addSuffix: true })}`
                  : 'No successful backups yet'}
              </CardDescription>
            </div>
            <BackupControls isAdmin={isAdmin} onTrigger={triggerBackup} />
          </div>
        </CardHeader>
        <CardContent>
          <BackupTable
            logs={logs}
            loading={loading}
            onDownload={downloadBackup}
            onDownloadComplete={downloadCompleteBackup}
            onDelete={deleteBackup}
            getR2Link={getR2Link}
          />
        </CardContent>
      </Card>
    </div>
  );
}
