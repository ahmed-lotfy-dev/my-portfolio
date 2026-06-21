---

title: Master PostgreSQL Self-Hosting Guide (Dokploy+VPS)
description: "Master guide to self-hosting PostgreSQL on Dokploy + VPS — installation, SSL, WAL logical replication, multi-tenant setup, and backups."
excerpt: "Self-host PostgreSQL on Dokploy + VPS: SSL, WAL replication, multi-tenant, backups. Complete guide."
date: 2026-01-23
updated: 2026-01-25
tags: ["postgresql", "self-hosting", "dokploy", "database"]
image: /images/blogs/pasted_image_195930.png
share: true
featured: true

---

![Pasted image 20260125195930](/images/blogs/pasted_image_195930.png)**Version:** Postgres **17.7 (Server)** | Postgres **18.1 (Local Client)**  
**Status:** ✅ SSL Enabled | ✅ WAL Logical Enabled | ✅ Multi-Tenant Ready

This guide documents the **complete setup and operation** of a production-ready, multi-tenant PostgreSQL instance hosted on **Oracle Cloud (OCI)**, deployed via **Dokploy**, and secured with **SSL**.

It also covers **proper schema-level permissions** required for modern stacks like **Next.js, Prisma, and migrations**.

---

## 0. Prerequisites

- OCI VM (Ubuntu/Debian recommended)
    
- Dokploy installed
    
- Cloudflare DNS
    
- Docker & Docker Compose
    
- PostgreSQL client locally (`psql`)
    

---

## 1. Cloudflare DNS Configuration 🌐

To expose PostgreSQL safely over a custom domain, **Cloudflare proxy must be disabled**.

### DNS Record

- **Type:** `A`
    
- **Name:** `pg`
    
- **IPv4:** `193.123.91.169`
    
- **Proxy Status:** ☁️ **DNS Only (Grey Cloud)**
    

> ⚠️ **Important**  
> Cloudflare’s Orange Cloud **blocks non-HTTP ports** like `5432`.

---

## 2. Firewall & Network Security 🔐

Postgres must be allowed at **both OCI level and OS level**.

### A. OCI Security List

**Networking → Security Lists → Default Security List**

Add **Ingress Rule**:

|Setting|Value|
|---|---|
|Source|`0.0.0.0/0`|
|Protocol|TCP|
|Port|`5432`|

---

### B. Server OS Firewall (Persistent)

Run **on the host VM** (not inside Docker):

```bash
sudo iptables -I INPUT 6 -p tcp --dport 5432 -j ACCEPT
sudo netfilter-persistent save
```

---

## 3. Dokploy – PostgreSQL with SSL & WAL 🐳

This setup uses a **PostgreSQL 17 image with SSL preconfigured** and enables **logical replication** (required for Prisma Pulse, CDC, etc.).

```yaml
services:
  postgres-db:
    image: ghcr.io/railwayapp-templates/postgres-ssl:17
    restart: always
    environment:
      POSTGRES_USER: ${POSTGRES_USER:-my-pg-user}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:-my-pg-password}
      POSTGRES_DB: ${POSTGRES_DB:-my-pg-db}
    command:
      - "postgres"
      - "-c"
      - "wal_level=logical"
      - "-c"
      - "max_replication_slots=10"
      - "-c"
      - "max_wal_senders=10"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    networks:
      - dokploy-network

networks:
  dokploy-network:
    external: true

volumes:
  postgres_data:
```

---

## 4. Initial Connection & Verification 🔌

### Connect from Local Machine

```bash
psql postgresql://my-pg-user:***@pg.ahmedlotfy.site:5432/my-pg-db
```

Expected:

- ✅ SSL connection
    
- ✅ Server responds (no timeout)
    

---

## 5. Multi-Tenant Architecture (Users & Databases) 🏗️

Each project gets:

- **One database**
    
- **One dedicated user**
    
- **Schema-level privileges**
    

This avoids cross-project access and supports Prisma migrations.

---

## 6. Create Users & Databases 👤📦

Run while connected as the **main Postgres admin user**.

### Example Projects Created

```sql
CREATE USER database_user WITH PASSWORD 'secure_password';
CREATE DATABASE example_db OWNER example_user;
GRANT ALL PRIVILEGES ON DATABASE example_db TO myportfolio_user;
```

> 🔐 **Best Practice**  
> Use **strong unique passwords** per user (later rotated).

---

## 7. REQUIRED: Schema-Level Permissions (Very Important ⚠️)

> Without this, **Prisma / migrations will fail** even if DB ownership is correct.

---

### Step 1: Connect to Target Database

```sql
\c zamalek_store_db
```

---

### Step 2: Grant Schema Access

```sql
GRANT USAGE ON SCHEMA public TO example_user;
```

---

### Step 3: Grant Table & Sequence Permissions

```sql
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO example_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO example_user;
```

---

### Step 4: Auto-Grant for Future Tables (Migrations)

```sql
ALTER DEFAULT PRIVILEGES IN SCHEMA public
GRANT ALL ON TABLES TO example_user;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
GRANT ALL ON SEQUENCES TO example_user;
```

✅ This ensures **new tables created by Prisma automatically work**.

---

## 8. Connection String 🔗

Use this format **everywhere** (apps, Prisma, migrations):

```text
postgresql://user:***@pg.ahmedlotfy.site:5432/db_name?sslmode=require
```

---

## 9. Data Migration (Local → Server) 🚚

Safest way to migrate across Postgres versions:

```bash
docker run --rm -i postgres:17-alpine psql \
"postgresql://user:***@vps-ip-or-domain:5432/db_name?sslmode=require" \
< your_local_dump.sql
```

---

## 10. Verification Checklist ✅

Run these inside `psql`:

|Check|Command|Expected|
|---|---|---|
|WAL Enabled|`SHOW wal_level;`|`logical`|
|SSL Active|`SELECT ssl_is_used();`|`t`|
|Version|`SELECT version();`|`PostgreSQL 17.x`|

---

## ✅ Final Result

You now have:

- 🔐 SSL-secured PostgreSQL
    
- 🧱 Isolated multi-tenant databases
    
- 🔄 Prisma-ready permissions
    
- ☁️ OCI + Dokploy hardened setup
    
- 🧠 A reusable playbook for future projects
    

---

If you want, next we can:

- 🔁 Turn this into a **template for new projects**
    
- 🔐 Add **read-only users**
    
- 📊 Add **pgAdmin / monitoring**
    
- 🧪 Add **backup + restore automation**
    

Just say the word 🚀
If you're wondering why I moved away from managed databases, read my story on [Why I Ditched My Database for a Static Site](/en/blogs/building-zero-effort-obsidian-to-portfolio-workflow) and how I handle [PostgreSQL running inside Docker](/en/blogs/connecting-to-postgresql-running-inside-docker).

Looking to self-host your own apps? Check out my [Dokploy + VPS setup](/en/projects/the-drive-center) for a real-world example of production deployments.

## Further Reading

- [connecting to PostgreSQL running inside Docker](/blogs/connecting-to-postgresql-running-inside-docker)
- [self-hosting a Next.js blog on Dokploy](/blogs/self-host-nextjs-blog-on-dokploy)
- [securing connections with Cloudflare Tunnel](/blogs/cloudflared-tunnel-full-guide)
- [why I eventually ditched my database](/blogs/why-i-ditched-database-for-static-site)
- [Docker Compose from zero to production](/blogs/docker-compose-from-zero-to-production)
