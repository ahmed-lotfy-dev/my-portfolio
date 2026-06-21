---
title: "الدليل الشامل لـ PostgreSQL Self-Hosting (Dokploy + VPS)"
date: 2026-01-23
updated: 2026-01-25
tags:
  - development
  - backend
  - databases
image: /images/blogs/pasted_image_195930.png
share: true
featured: true
---

# الدليل الشامل لـ PostgreSQL Self-Hosting (Dokploy + VPS)

**الإصدار:** Postgres **17.7 (Server)** | Postgres **18.1 (Local Client)**
**الحالة:** ✅ SSL Enabled | ✅ WAL Logical Enabled | ✅ Multi-Tenant Ready

الدليل ده بيوثق **الإعداد والتشغيل الكامل** لـ production-ready, multi-tenant PostgreSQL instance مستضاف على **Oracle Cloud (OCI)**، منشر عبر **Dokploy**، ومؤمن بـ **SSL**.

كمان بيغطي **schema-level permissions** المطلوبة للـ stacks الحديثة زي **Next.js, Prisma, and migrations**.

---

## 0. المتطلبات

- OCI VM (Ubuntu/Debian مفضل)
- Dokploy متثبت
- Cloudflare DNS
- Docker & Docker Compose
- PostgreSQL client محلياً (`psql`)

---

## 1. Cloudflare DNS Configuration 🌐

عشان نعرض PostgreSQL بأمان على custom domain، **لازم Cloudflare proxy يكون disabled**.

### DNS Record

- **Type:** `A`
- **Name:** `pg`
- **IPv4:** `193.123.91.169`
- **Proxy Status:** ☁️ **DNS Only (Grey Cloud)**

> ⚠️ **مهم**
> Cloudflare's Orange Cloud **بيحجب الـ non-HTTP ports** زي `5432`.

---

## 2. Firewall & Network Security 🔐

Postgres لازم يتسمح على **مستوى OCI ومستوى الـ OS** كمان.

### A. OCI Security List

**Networking → Security Lists → Default Security List**

أضف **Ingress Rule**:

| Setting | Value |
|---------|-------|
| Source | `0.0.0.0/0` |
| Protocol | TCP |
| Port | `5432` |

---

### B. Server OS Firewall (Persistent)

شغل **على الـ host VM** (مش جوه Docker):

```bash
sudo iptables -I INPUT 6 -p tcp --dport 5432 -j ACCEPT
sudo netfilter-persistent save
```

---

## 3. Dokploy – PostgreSQL with SSL & WAL 🐳

الـ setup ده بيستخدم **PostgreSQL 17 image مع SSL معموله preconfigure** وبيفع **logical replication** (مطلوب لـ Prisma Pulse, CDC, etc.).

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

### الاتصال من الجهاز المحلي

```bash
psql postgresql://my-pg-user:***@pg.ahmedlotfy.site:5432/my-pg-db
```

المتوقع:

- ✅ SSL connection
- ✅ Server بيرد (من غير timeout)

---

## 5. Multi-Tenant Architecture (Users & Databases) 🏗️

كل مشروع بياخد:

- **database واحد**
- **user مخصص**
- **schema-level privileges**

ده بيتجنب الـ cross-project access وبي support الـ Prisma migrations.

---

## 6. Create Users & Databases 👤📦

شغل وانت متصل كـ **main Postgres admin user**.

### مثال

```sql
CREATE USER database_user WITH PASSWORD 'secure_password';
CREATE DATABASE example_db OWNER example_user;
GRANT ALL PRIVILEGES ON DATABASE example_db TO myportfolio_user;
```

> 🔐 **Best Practice**
> استخدم **passwords قوية ومختلفة** لكل user (و rotateها بعدين).

---

## 7. REQUIRED: Schema-Level Permissions (Very Important ⚠️)

> من غير ده، **Prisma / migrations هتفشل** حتى لو الـ DB ownership صح.

### Step 1: اتصل بالـ Target Database

```sql
\c zamalek_store_db
```

### Step 2: اعمل Grant للـ Schema Access

```sql
GRANT USAGE ON SCHEMA public TO example_user;
```

### Step 3: اعمل Grant للـ Tables & Sequences

```sql
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO example_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO example_user;
```

### Step 4: Auto-Grant للـ Future Tables (Migrations)

```sql
ALTER DEFAULT PRIVILEGES IN SCHEMA public
GRANT ALL ON TABLES TO example_user;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
GRANT ALL ON SEQUENCES TO example_user;
```

✅ ده بيضمن إن **الـ tables الجديدة اللي Prisma هتعملها هتشتغل تلقائياً**.

---

## 8. Connection String 🔗

استخدم الشكل ده **في كل مكان** (apps, Prisma, migrations):

```text
postgresql://user:***@pg.ahmedlotfy.site:5432/db_name?sslmode=require
```

---

## 9. Data Migration (Local → Server) 🚚

أ safest way للـ migration بين إصدارات Postgres مختلفة:

```bash
docker run --rm -i postgres:17-alpine psql \
"postgresql://user:***@vps-ip-or-domain:5432/db_name?sslmode=require" \
< your_local_dump.sql
```

---

## 10. Verification Checklist ✅

شغل دول جوه `psql`:

| Check | Command | Expected |
|-------|---------|----------|
| WAL Enabled | `SHOW wal_level;` | `logical` |
| SSL Active | `SELECT ssl_is_used();` | `t` |
| Version | `SELECT version();` | `PostgreSQL 17.x` |

---

## ✅ النتيجة النهائية

دلوقتي عندك:

- 🔐 SSL-secured PostgreSQL
- 🧱 Isolated multi-tenant databases
- 🔄 Prisma-ready permissions
- ☁️ OCI + Dokploy hardened setup
- 🧠 Playbook قابل لإعادة الاستخدام للمشاريع المستقبلية

---

لو عايز تعرف أكتر عن الـ deployment مع الـ SSL والـ networking، شوف [دليل Cloudflare Tunnels](/ar/blogs/the-no-open-ports-manual-cloudflare-tunnels-for-backend-devs) و [دليل الاتصال بـ PostgreSQL في Docker](/ar/blogs/connecting-to-postgresql-running-inside-docker).
