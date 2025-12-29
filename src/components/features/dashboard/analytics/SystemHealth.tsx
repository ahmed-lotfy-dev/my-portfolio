"use client";

import { use, useEffect, useState, useTransition } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/src/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/src/components/ui/table";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import { getBackupLogs } from "@/src/app/actions/backupActions";
import { formatDistanceToNow } from "date-fns";
import { Loader2, Database, FileImage, HardDrive, Download, Trash2, ExternalLink, CheckCircle2, XCircle, Clock, AlertCircle } from "lucide-react";

type BackupLog = Awaited<ReturnType<typeof getBackupLogs>>['data'];

interface SystemHealthProps {
  isAdmin: boolean;
  cfAccountId?: string;
  cfBucketName?: string;
  logsPromise: ReturnType<typeof getBackupLogs>;
}



export default function SystemHealth({ isAdmin, cfAccountId, cfBucketName, logsPromise }: SystemHealthProps) {
  const initialData = use(logsPromise);
  const [logs, setLogs] = useState<BackupLog>(initialData.data || []);
  const [loading, setLoading] = useState(false);
  const [isPending, startTransition] = useTransition();

  const fetchLogs = async () => {
    setLoading(true);
    const result = await getBackupLogs();
    if (result.success && result.data) {
      setLogs(result.data);
    }
    setLoading(false);
  };

  // Keep useEffect for polling interval (side effect)
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'SUCCESS':
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200 hover:bg-green-100">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Success
          </Badge>
        );
      case 'FAILED':
        return (
          <Badge className="bg-red-100 text-red-800 border-red-200 hover:bg-red-100">
            <XCircle className="w-3 h-3 mr-1" />
            Failed
          </Badge>
        );
      case 'PENDING':
        return (
          <Badge className="bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-100">
            <Clock className="w-3 h-3 mr-1" />
            Queued
          </Badge>
        );
      case 'RUNNING':
        return (
          <Badge className="bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-100 animate-pulse">
            <Loader2 className="w-3 h-3 mr-1 animate-spin" />
            Processing
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            <AlertCircle className="w-3 h-3 mr-1" />
            {status}
          </Badge>
        );
    }
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
      // For full backups, we need both SQL and media paths
      // The log.path is the manifest, we need to construct the actual paths
      const timestamp = log.path?.split('/')[2]?.replace('_manifest.json', '');

      if (!timestamp) {
        alert('Cannot determine backup timestamp');
        return;
      }

      // Construct paths based on backup structure
      const sqlPath = `backup/sql/db_${timestamp}.dump`;
      const mediaPrefix = `backup/media/${timestamp}/`;

      const params = new URLSearchParams();
      if (log.type === 'full' || log.type === 'sql') {
        params.append('sql', sqlPath);
      }
      if (log.type === 'full' || log.type === 'media') {
        params.append('media', mediaPrefix);
      }
      params.append('timestamp', timestamp);

      // Open in new window to trigger download
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

  // Calculate stats
  const stats = {
    total: logs?.length || 0,
    successful: logs?.filter(l => l.status === 'SUCCESS').length || 0,
    failed: logs?.filter(l => l.status === 'FAILED').length || 0,
    totalSize: logs?.reduce((acc, l) => acc + (l.sizeBytes || 0), 0) || 0,
  };

  const lastSuccessful = logs?.find(l => l.status === 'SUCCESS');

  return (
    <div className="space-y-6" id="backups">
      {/* Stats Cards */}
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

      {/* Main Backup Card */}
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
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => triggerBackup('sql')}
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
                onClick={() => triggerBackup('media')}
                disabled={!isAdmin}
                title={!isAdmin ? "Admin access required" : "Backup media files only"}
                className="gap-2"
              >
                <FileImage className="w-4 h-4" />
                <span className="hidden sm:inline">Media</span>
              </Button>
              <Button
                size="sm"
                onClick={() => triggerBackup('full')}
                disabled={!isAdmin}
                title={!isAdmin ? "Admin access required" : "Full backup (SQL + Media)"}
                className="gap-2"
              >
                <HardDrive className="w-4 h-4" />
                <span className="hidden sm:inline">Full Backup</span>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
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
                {loading && logs?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-32 text-center">
                      <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                        <Loader2 className="w-6 h-6 animate-spin" />
                        <p className="text-sm">Loading backups...</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : logs?.length === 0 ? (
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
                  logs?.map((log) => (
                    <TableRow key={log.id} className="group">
                      <TableCell>{getStatusBadge(log.status)}</TableCell>
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
                              {/* Download Complete Backup as Zip */}
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => downloadCompleteBackup(log)}
                                title="Download complete backup as ZIP"
                                className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                              >
                                <HardDrive className="w-4 h-4" />
                              </Button>

                              {/* Download Manifest/Single File */}
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => downloadBackup(log.path!)}
                                title={log.type === 'media' ? "Download manifest" : "Download SQL dump"}
                                className="h-8 w-8"
                              >
                                <Download className="w-4 h-4" />
                              </Button>

                              {/* View in R2 */}
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
                              onClick={() => deleteBackup(log.id, log.path, log.type)}
                              title="Delete backup"
                              className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
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
        </CardContent>
      </Card>
    </div>
  );
}
