# Disaster Recovery & Restore Runbook

> [!CAUTION]
> **Data Overwrite Warning**: Restoring a database dump will typically truncate or error on existing data. Ensure you are restoring to a clean database or have verified that overwriting is intended.

## Prerequisites
- `postgresql-client` (specifically `pg_restore` and `psql`) installed.
- `aws-cli` or similar S3 compatible tool for R2 downloads.
- Database Connection String.

## 1. Locate Backup Artifacts
Go to your R2 bucket `my-portfolio/backup/`.
Identify the backup you want to restore by date or manifest.
- **SQL Path**: `backup/sql/db_{timestamp}.dump`
- **Media Path**: `backup/media/{timestamp}/`
- **Manifest**: `backup/manifests/{timestamp}_manifest.json`

## 2. Restore Database (SQL)
1. **Download the Dump**:
   ```bash
   # Using AWS CLI with R2 endpoint
   aws s3 cp s3://my-portfolio-bucket/backup/sql/db_2025-XX-XX.dump ./restore.dump --endpoint-url https://<accountid>.r2.cloudflarestorage.com
   ```

2. **Run pg_restore**:
   ```bash
   # Restore schema and data to your database
   # -d: database url
   # -c: clean (drop objects before creating)
   # --no-owner: skip ownership (useful for different envs)
   
   pg_restore -d "postgres://user:pass@host:5432/dbname" --clean --no-owner ./restore.dump
   ```

3. **Verify**:
   Check row counts or log into psql:
   ```sql
   SELECT count(*) FROM projects;
   ```

## 3. Restore Media
1. **Sync from R2 Backup Folder**:
   We need to copy files FROM the backup folder back to the ROOT (or wherever your app serves images from).

   ```bash
   # Dry run first
   aws s3 sync s3://my-portfolio-bucket/backup/media/2025-XX-XX/ s3://my-portfolio-bucket/ \
     --endpoint-url https://<accountid>.r2.cloudflarestorage.com \
     --dryrun
   
   # Execute
   aws s3 sync s3://my-portfolio-bucket/backup/media/2025-XX-XX/ s3://my-portfolio-bucket/ \
     --endpoint-url https://<accountid>.r2.cloudflarestorage.com
   ```

## 4. Post-Restore
- Clear application cache if necessary.
- Verify the application Dashboard shows the restored projects/content.
- Run a new "Full Backup" to mark a clean slate point.
