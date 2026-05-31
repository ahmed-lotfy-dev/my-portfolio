---
title: "How to Upgrade PostgreSQL 17 to 18 Without Downtime or Changing a Single DB URL"
date: 2026-05-18
updated: 2026-05-18
image: ""
tags:
  - dev-ops
  - postgresql
  - docker
  - database
  - upgrade
  - zero-downtime
  - guide
  - postgres
  - vps
  - production
published: true
share: true
---

# How to Upgrade PostgreSQL 17 to 18 Without Downtime or Changing a Single DB URL

Upgrading a production PostgreSQL instance is one of those tasks that sounds terrifying until you understand what is actually happening under the hood. The goal is simple: move from version 17 to version 18, keep every byte of data, and make sure none of your applications notice anything changed.

This is the exact process I used to upgrade a live VPS running 11 databases across multiple applications, with a total maintenance window of under 60 seconds and zero changes to any application connection string.

## Why This Is Harder Than It Sounds

PostgreSQL stores its data in a binary format that is specific to each major version. A version 18 server cannot read version 17 data files directly. If you just swap the Docker image tag from `:17` to `:18`, the container will crash on startup because the data directory is incompatible.

The traditional approach is to dump everything to SQL text files with `pg_dumpall`, spin up a new instance, and import everything back. For small databases this works fine. For production systems with multiple databases, this means hours of downtime.

There is a better way.

## The Strategy: Binary Storage Upgrade with pg_upgrade

PostgreSQL ships with a built-in utility called `pg_upgrade` that can convert data files from one major version to another. Instead of exporting and re-importing data as text, it rewrites the internal system catalogs and metadata in place.

When you use the `--link` flag, `pg_upgrade` creates filesystem hard links instead of copying data blocks. This means the upgrade completes in seconds regardless of how many gigabytes or databases you have. The actual data blocks on disk are never moved or rewritten.

The entire process looks like this:

1. Stop the running PostgreSQL 17 container (brief maintenance window begins)
2. Run a temporary upgrade container that mounts your data volume and converts the files
3. Update your Docker Compose to point to the new version and the new data path
4. Deploy. Done.

## Prerequisites

- PostgreSQL 17 running in Docker with data stored in a named Docker volume
- `wal_level=logical` already configured (needed if you ever want replication)
- Applications connecting via external IP or domain name (not Docker internal hostnames)
- A custom image like `ghcr.io/railwayapp-templates/postgres-ssl` that nests data inside `/pgdata`

## Step 1: Clean Up Any Stale Containers

If you have been experimenting with sidecar containers or temporary instances, remove them first so nothing conflicts with ports or volumes:

```bash
docker stop postgres-18 2>/dev/null || true
docker rm postgres-18 2>/dev/null || true
```

## Step 2: Stop the Production Database

This is the beginning of your maintenance window. Stopping the container ensures no writes are happening while the upgrade tool works on the data files:

```bash
docker stop postgres-17
```

Your applications will temporarily lose connection. They will queue or retry connections automatically. This is normal.

## Step 3: Run the Upgrade Tool

This is the core command. It mounts your production data volume, reads the old version 17 files from the `/pgdata` subdirectory, and writes upgraded version 18 files into a new `/pgdata_v18` subdirectory within the same volume:

```bash
docker run --rm \
  -v postgres_data:/var/lib/postgresql/data \
  -e PGDATAOLD=/var/lib/postgresql/data/pgdata \
  -e PGDATANEW=/var/lib/postgresql/data/pgdata_v18 \
  -e PGUSER=my-pg-user \
  -e POSTGRES_INITDB_ARGS="-U my-pg-user" \
  tianon/postgres-upgrade:17-to-18 --link
```

Here is what each part does:

- `-v postgres_data:/var/lib/postgresql/data` mounts your original Docker volume inside the upgrade container
- `PGDATAOLD` points to the subdirectory where your version 17 data lives (the `/pgdata` folder created by the Railway SSL image)
- `PGDATANEW` creates a fresh subdirectory for the version 18 data
- `PGUSER` and `POSTGRES_INITDB_ARGS` ensure the new cluster is initialized with the correct database user
- `--link` tells `pg_upgrade` to use filesystem hard links instead of copying, which makes the upgrade complete in seconds

Watch the terminal output. It will stream progress for about 15 to 30 seconds and end with a clear confirmation. If you see errors about `PG_VERSION` not being found, double-check that your `PGDATAOLD` path matches the actual subdirectory structure inside your volume.

## Step 4: Update Your Docker Compose

Open your `docker-compose.yml` and update the image version and the `PGDATA` environment variable to point to the new upgraded directory:

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

The critical changes are:

- `image` changed from `:17` to `:18`
- `PGDATA` now points to `/var/lib/postgresql/data/pgdata_v18` instead of the old path
- Everything else stays exactly the same

## Step 5: Deploy and Verify

Bring the stack back up:

```bash
docker compose up -d
```

Verify the new container is running on the correct version:

```bash
docker exec -it postgres-db psql -U my-pg-user -c "SELECT version();"
```

You should see `PostgreSQL 18.x` in the output.

Check that all your databases are present:

```bash
docker exec -it postgres-db psql -U my-pg-user -c "\l"
```

## Why Your Applications Do Not Need Any Changes

Because the upgraded container exposes the same port (5432) on the same Docker network, and your applications connect via an external IP or domain name (like `pg.yourdomain.com:5432`), they do not care what happened inside the container. They just see that the database is back online and reconnect automatically.

No environment variables need updating. No connection strings need changing. No application code needs touching.

## Troubleshooting

### "PG_VERSION: No such file or directory"

This means the upgrade tool cannot find the version marker file at the path you specified. Different Docker images store data in different subdirectories. To find the correct path, inspect your volume:

```bash
docker run --rm -v postgres_data:/volume alpine ls -R /volume
```

Look for where `PG_VERSION` actually lives and adjust `PGDATAOLD` accordingly.

### "PGDATA variable does not start with the expected volume mount path"

This is specific to the Railway SSL template image. It requires the `PGDATA` environment variable to be explicitly set. Make sure your Docker Compose includes:

```yaml
PGDATA: /var/lib/postgresql/data/pgdata
```

### Container keeps restarting after upgrade

Check the logs:

```bash
docker logs --tail 50 postgres-db
```

Common causes are incorrect `PGDATA` path pointing to a non-existent directory, or permission issues on the volume.

## Post-Upgrade Cleanup

After you have verified that all applications are working correctly and all data is intact, the old `/pgdata` directory inside your volume remains as an offline backup. You can keep it for a few days as a safety net, then remove it to reclaim disk space.

## Final Notes

This approach works because it operates at the storage level rather than the logical level. It does not care how many databases you have, how large they are, or what is inside them. The `pg_upgrade` tool handles all of it in a single pass.

The total maintenance window is the time it takes to stop the old container, run the upgrade command (usually under 30 seconds), and start the new container. For my setup with 11 databases, the entire process from stop to verified-and-running was under 60 seconds.

That is the difference between understanding how your tools work and being afraid of them.
