---
title: "PostgreSQL 17 to 18 Upgrade Guide"
date: 2026-05-18
updated: 2026-05-18
image: ""
tags:
  - dev-ops
  - postgresql
  - docker
  - upgrade
  - reference
  - postgres
  - production
published: true
share: true
---

# PostgreSQL 17 to 18 Major Version Upgrade Guide

This is the technical reference for upgrading a multi-database PostgreSQL instance running in Docker Compose from version 17 to version 18. The approach uses a binary storage migration strategy (`pg_upgrade` with hard links) to complete the entire upgrade in under 60 seconds with zero data loss and no changes required to application connection strings.

## Technical Concept

A traditional database upgrade requires exporting all data into text files (`pg_dumpall`) and importing them back into a new instance. For multiple databases, this takes hours.

Instead, this guide uses a **Binary Storage Upgrade** via the native PostgreSQL `pg_upgrade` utility:

1. It reads the raw database storage files directly from the disk
2. It upgrades internal system tables and metadata to the version 18 format
3. Using the `--link` flag, it creates filesystem hard links from the old files to the new directory

Because the actual data blocks are never copied or rewritten, the upgrade takes less than 30 seconds regardless of how many gigabytes or databases you host.

Custom SSL base images (such as the Railway template) nest database files inside a `/pgdata` subfolder instead of the root of the volume. This guide explicitly targets that internal path structure.

## Prerequisites

- PostgreSQL 17 running in Docker with data stored in a named Docker volume
- `wal_level=logical` already configured in the running instance
- Applications connecting via external IP or domain name
- Docker Compose managing the database service

## Step 1: Clean Up Stale Containers

```bash
docker stop postgres-18 2>/dev/null || true
docker rm postgres-18 2>/dev/null || true
```

## Step 2: Stop the Production Database

```bash
docker stop postgres-17
```

This begins the maintenance window. Applications will temporarily lose connection and begin retrying automatically.

## Step 3: Run the Binary Upgrade Tool

```bash
docker run --rm \
  -v postgres_data:/var/lib/postgresql/data \
  -e PGDATAOLD=/var/lib/postgresql/data/pgdata \
  -e PGDATANEW=/var/lib/postgresql/data/pgdata_v18 \
  -e PGUSER=my-pg-user \
  -e POSTGRES_INITDB_ARGS="-U my-pg-user" \
  tianon/postgres-upgrade:17-to-18 --link
```

**Flag explanations:**

| Flag / Variable | Purpose |
|---|---|
| `-v postgres_data:...` | Mounts the original data volume inside the upgrade container |
| `PGDATAOLD` | Path to the version 17 data subdirectory |
| `PGDATANEW` | Path where the new version 18 data will be written |
| `PGUSER` | The database superuser that owns the data |
| `--link` | Uses hard links instead of copying, completing in seconds |

Verify the log output ends with a clear success confirmation before proceeding.

## Step 4: Update Docker Compose

Update your `docker-compose.yml` to reflect the new engine version and the upgraded storage path:

```yaml
services:
  postgres-db:
    image: ghcr.io/railwayapp-templates/postgres-ssl:18
    restart: always
    environment:
      POSTGRES_USER: ${POSTGRES_USER:-my-pg-user}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:-my-pg-password}
      POSTGRES_DB: ${POSTGRES_DB:-my-pg-db}
      PGDATA: /var/lib/postgresql/data/pgdata_v18
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    networks:
      - production-network

networks:
  production-network:
    external: true

volumes:
  postgres_data:
    external: true
```

## Step 5: Deploy and Verify

```bash
docker compose up -d
```

Check the engine version:

```bash
docker exec -it postgres-db psql -U my-pg-user -c "SELECT version();"
```

Expected output: `PostgreSQL 18.x`

List all databases to confirm everything migrated:

```bash
docker exec -it postgres-db psql -U my-pg-user -c "\l"
```

## Troubleshooting

### PGDATA variable does not start with the expected volume mount path

The Railway SSL template requires `PGDATA` to be explicitly set. Ensure your compose file includes:

```yaml
PGDATA: /var/lib/postgresql/data/pgdata
```

### could not open version file "PG_VERSION": No such file or directory

The upgrade tool cannot find the version marker at the specified path. Inspect your volume to find the correct path:

```bash
docker run --rm -v postgres_data:/volume alpine ls -R /volume
```

Adjust `PGDATAOLD` to match the actual subdirectory where `PG_VERSION` lives.

### Container keeps restarting after upgrade

Check the logs:

```bash
docker logs --tail 50 postgres-db
```

Common causes: incorrect `PGDATA` path, permission issues on the volume, or the data directory not being properly initialized.

### Port already in use

If you get a port conflict when running a sidecar container, pick a different host port:

```yaml
ports:
  - "5445:5432"
```

## Post-Upgrade Cleanup

After verifying data integrity across all applications, the old `/pgdata` directory inside the volume remains as an offline backup. Remove it to reclaim disk space once you are confident everything is stable.

## Why Application URLs Do Not Change

Because the upgraded container exposes the same port (5432) on the same Docker network, and applications connect via an external IP or domain name, they see no difference. The database is back on the same port it was always on. No environment variables, connection strings, or application code needs updating.
