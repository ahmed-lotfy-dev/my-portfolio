---
title: "الاتصال بـ PostgreSQL شغال جوه Docker"
date: 2026-01-24
updated: 2026-01-24
tags:
  - development
  - backend
  - databases
  - postgresql
  - psql
  - env
  - docker
  - containers
  - dev
  - devops
  - security
  - authentication
  - ssl-tls
image: ""
share: true
featured: true
---

# الاتصال بـ PostgreSQL شغال جوه Docker

الاتصال بـ PostgreSQL اللي شغال جوه Docker موضوع بسيط لو فاهم اللي بيحصل تحت السطح. معظم المشاكل بتيجي من خلط مفاهيم الـ container networking مع افتراضات الـ local machine. خلينا ننظم الموضوع خطوة بخطوة.

---

## الفكرة الأساسية

لما PostgreSQL بيشتغل جوه Docker container وانت بت expose الـ port، Docker بيشتغل كـ bridge. جهازك بيتكلم مع Docker، و Docker بيبعت الـ traffic للـ container.

يعني مش بتتصل بالـ container IP. بتتصل بجهازك أنت، عادةً `127.0.0.1`، على الـ port اللي Docker عمله expose.

---

## أمر الـ `psql` الصحيح محلياً

```bash
psql -h 127.0.0.1 -p 5432 -U my-pg-user my-pg-db
```

دي أشهر وأصح طريقة للـ local development.

شرح كل جزء:

- `-h 127.0.0.1` — بتتصل بجهازك. Docker بيسمع هنا وبي forward الاتصال لـ Postgres جوه الـ container.
- `-p 5432` — الـ port اللي Docker عمله expose. لو عملت mapping لـ `5432:5432`، ده الصحيح. لو استخدمت port تاني، استخدمه.
- `-U my-pg-user` — الـ database role اللي عملته لما عملت initialize لـ Postgres.
- `my-pg-db` — اسم الـ database اللي عايز تتصل بيه.

بعد ما تشغل الأمر ده، `psql` هيطلب الـ password.

---

## استخدام connection URL

Postgres بيدعم connection string واحد. ده مفيد للـ scripts والـ tooling:

```bash
psql "postgresql://example_user:***@127.0.0.1:5432/my-pg-db"
```

الشكل ده شائع في الـ ORMs والـ environment variables و الـ CI pipelines. بي Encode نفس المعلومات في string واحد.

---

## لما SSL يكون مطلوب

بعض الـ Docker images أو الـ setupات الـ production-like بتفرض SSL connections. في الحالة دي، Postgres هيرفض الاتصالات العادية من غير ما تطلب SSL صراحةً.

بتعمل كده مع `sslmode=require`:

```bash
psql "postgresql://example_user:***@127.0.0.1:5432/my-pg-db?sslmode=require"
```

لو SSL إجباري ونسيت الـ flag ده، رسالة الخطأ عادةً بتكون مش واضحة. إنك تعرف ده من الأول بيوفر وقت.

---

## تتجنب الـ passwords في الـ command history

حط الـ passwords مباشرة في الـ commands عنده مشكلتين:

- بتتحفظ في الـ shell history
- بتكون visible لـ الـ processes التانية من خلال tools زي `ps aux`

طريقة أ safer هي استخدام environment variable للأمر بس:

```bash
PGPASSWORD="example_password" psql -h 127.0.0.1 -p 5432 -U example_user example-db
```

دي بتتجنب كتابة الـ password وبتتجنب تخزينه بشكل دائم.

للـ setupات طويلة المدى، `.pgpass` أحسن، بس ده موضوع تاني.

---

## Docker sanity checks لما حاجة تفشل

لو الاتصال مش شغال، شوف Docker قبل ما تلمس إعدادات Postgres.

أولاً، تأكد إن الـ container شغال وبي expose الـ port:

```bash
docker ps
```

المفروض تشوف حاجة زي:

```
0.0.0.0:5432->5432/tcp
```

لو مش شايف الـ mapping ده، Postgres مش قابل للوصول من جهازك.

بعدين، شوف الـ logs:

```bash
docker logs postgres-db
```

عايز تشوف رسائل إن Postgres اشتغل بنجاح وبيسمع على الـ port المطلوب.

لو Postgres شغال والـ port متexpose، `psql` هيشتغل. لو مش شغال، المشكلة غالباً credentials أو اسم الـ database أو الـ sslmode.

---

## الـ Mental Model

```
Local machine
    → Docker port mapping
        → Postgres inside container
```

لما السلسلة دي تبقى واضحة، الاتصال بـ Postgres في Docker بيوقف يحس إنه mysterious وبيبدأ يحس إنه boring. والـ boring كويس في شغل الـ backend.

دي بالظبط الـ setup اللي بستخدمه في الـ production — Postgres شغال في Docker، متصل بالـ apps من خلال internal networking. لو عايز تشوف الـ deployment orchestration الكامل، شوف [دليل الـ Self-Hosting على Dokploy](/ar/blogs/self-host-nextjs-blog-on-dokploy).

لو عايز تعرف ليه اخترت الـ self-hosting بدل الـ managed databases، اقرأ [ليه شلت الداتابيز من موقعي](/ar/blogs/why-i-ditched-database-for-static-site).

## اقرأ أيضاً

- [استضافة PostgreSQL على Dokploy](/blogs/master-postgresql-self-hosting-guide-dokploy-vps)
- [النشر على Dokploy](/blogs/self-host-nextjs-blog-on-dokploy)
