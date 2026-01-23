# PostgreSQL SSL Certificate Setup for Dokploy

This guide explains how to configure proper SSL certificate verification between your Next.js application and PostgreSQL database when self-hosting on Dokploy.

## Overview

When using the `ghcr.io/railwayapp-templates/postgres-ssl:17` image, PostgreSQL generates a self-signed SSL certificate. To properly verify this certificate in your application, you need to:

1. Extract the certificate from the PostgreSQL container
2. Make it available to your Next.js application
3. Configure the database connection to use the certificate

## Step 1: Extract the SSL Certificate

First, access your PostgreSQL container and extract the certificate:

```bash
# Find your PostgreSQL container name
docker ps | grep postgres

# Copy the certificate from the container to your host
# For ghcr.io/railwayapp-templates/postgres-ssl:17, the certificate is at:
docker cp <postgres-container-name>:/lib/ssl/certs/ssl-cert-snakeoil.pem ./postgres-cert.crt

# Or extract it directly:
docker exec <postgres-container-name> cat /lib/ssl/certs/ssl-cert-snakeoil.pem > postgres-cert.crt
```

## Step 2: Add Certificate to Your Project

1. Create a `certs` directory in your project root:
```bash
mkdir -p certs
mv postgres-cert.crt certs/
```

2. Add the certificate to your `.gitignore` if it contains sensitive information:
```bash
echo "certs/*.crt" >> .gitignore
```

## Step 3: Update Database Configuration

Modify `src/db/index.ts` to use the certificate:

```typescript
import { drizzle } from "drizzle-orm/node-postgres"
import { Pool } from "pg"
import * as schema from "./schema"
import fs from "fs"
import path from "path"

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: true,
    ca: fs.readFileSync(path.join(process.cwd(), "certs", "postgres-cert.crt")).toString(),
  },
})

export const db = drizzle(pool, { schema })
```

## Step 4: Configure Database Connection with Certificate

### Option A: Use Environment Variable (Recommended for Dokploy)

This approach keeps the certificate out of your repository and makes it easy to manage in Dokploy's environment variables.

1. Convert the certificate to base64:
```bash
cat certs/postgres-cert.crt | base64 -w 0
```

2. Add to your `.env` file:
```env
POSTGRES_SSL_CERT=LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0t...(your base64 string)
```

3. Update `src/db/index.ts`:
```typescript
import { drizzle } from "drizzle-orm/node-postgres"
import { Pool } from "pg"
import * as schema from "./schema"

const sslConfig = process.env.POSTGRES_SSL_CERT
  ? {
      rejectUnauthorized: true,
      ca: Buffer.from(process.env.POSTGRES_SSL_CERT, "base64").toString("utf-8"),
    }
  : {
      rejectUnauthorized: false,
    }

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: sslConfig,
})

export const db = drizzle(pool, { schema })
```

4. In Dokploy, add the `POSTGRES_SSL_CERT` environment variable with the base64 string.

### Option B: Mount Certificate as Volume

If you prefer to mount the certificate file:

1. Update your `docker-compose.yml`:
```yaml
services:
  app:
    image: your-app-image
    volumes:
      - ./certs:/app/certs:ro
    environment:
      DATABASE_URL: "postgresql://myportfolio_user:8XuA5sLg8GWkr4Km@postgres-db:5432/myportfolio_db?sslmode=require"
    networks:
      - dokploy-network
```

2. Update `src/db/index.ts`:
```typescript
import { drizzle } from "drizzle-orm/node-postgres"
import { Pool } from "pg"
import * as schema from "./schema"
import fs from "fs"
import path from "path"

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: true,
    ca: fs.readFileSync(path.join(process.cwd(), "certs", "postgres-cert.crt")).toString(),
  },
})

export const db = drizzle(pool, { schema })
```

## Step 5: Update Connection String

Ensure your `DATABASE_URL` includes `sslmode=require`:

```env
DATABASE_URL="postgresql://myportfolio_user:8XuA5sLg8GWkr4Km@postgres-db:5432/myportfolio_db?sslmode=require"
```

## Step 6: Build and Deploy

1. Build your Docker image with the updated configuration
2. Deploy to Dokploy
3. Verify the connection works without SSL errors

## Troubleshooting

### Certificate Not Found Error

If you get a "certificate not found" error:
- Verify the certificate path is correct
- Ensure the certificate file is included in your Docker image or mounted volume
- Check file permissions (certificate should be readable)

### Certificate Expired

The default certificate lasts 365 days (configurable via `SSL_CERT_DAYS`). To regenerate:

```bash
# Stop the container
docker stop <postgres-container-name>

# Remove the old certificate
docker exec <postgres-container-name> rm /var/lib/postgresql/data/server.crt
docker exec <postgres-container-name> rm /var/lib/postgresql/data/server.key

# Restart to generate new certificate
docker restart <postgres-container-name>

# Re-extract the certificate (Step 1)
```

### Still Getting SSL Errors

If you continue to see SSL errors:
1. Verify the certificate matches the one used by PostgreSQL
2. Check that `sslmode=require` is in your connection string
3. Ensure `rejectUnauthorized: true` is set in your SSL config
4. Review PostgreSQL logs: `docker logs <postgres-container-name>`

## Alternative: Disable SSL Verification (Not Recommended for Production)

For development or if both services are in a trusted Docker network:

```typescript
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
})
```

Or remove SSL entirely from the connection string:
```env
DATABASE_URL="postgresql://myportfolio_user:8XuA5sLg8GWkr4Km@postgres-db:5432/myportfolio_db"
```

## Security Considerations

- **Self-signed certificates** provide encryption but not identity verification
- For production, consider using a proper CA-signed certificate
- Keep certificates out of version control
- Rotate certificates periodically
- Use environment variables or secrets management for sensitive data
