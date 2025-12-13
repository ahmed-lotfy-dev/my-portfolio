export type BackupType = 'full' | 'sql' | 'media';

export type BackupStatus = 'PENDING' | 'SUCCESS' | 'FAILED';

export interface BackupManifest {
  version: string;
  timestamp: string;
  type: BackupType;
  environment: string;
  checksums: {
    sql_dump?: string;
    media_manifest?: string;
  };
  stats: {
    media_objects_count: number;
    media_total_size_bytes: number;
    sql_dump_size_bytes: number;
    duration_ms: number;
  };
  artifacts: {
    sql_path?: string;
    media_path?: string;
    manifest_path: string;
  };
  meta: {
    git_commit?: string;
    app_version?: string;
  };
}

export interface BackupLogEntry {
  id: string; // uuid
  status: BackupStatus;
  type: BackupType;
  startedAt: Date;
  completedAt?: Date;
  path?: string; // S3 path to manifest or root of backup
  sizeBytes?: number; // Total size
  details?: string; // JSON string of stats or error message
}
