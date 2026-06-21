---
title: ازاي تستضيف بلوج Next.js بنفسك على Dokploy (من غير ما تفقد أعصابك)
description: "دليل خطوة بخطوة لنشر بلوج Next.js على Dokploy — من إعداد VPS للإنتاج. بدون Kubernetes، بدون Vercel، بس Docker و$6/شهر."
excerpt: "انشر بلوج Next.js على Dokploy في 30 دقيقة. بدون Kubernetes، بدون Vercel — بس VPS وDocker و$6/شهر."
date: 2026-06-20
updated: 2026-06-20
image: /images/blogs/dokploy-nextjs-blog.jpg
tags:
  - nextjs
  - dokploy
  - self-hosting
  - docker
  - devops
  - tutorial
share: true
featured: true
---

# ازاي تستضيف بلوج Next.js بنفسك على Dokploy (من غير ما تفقد أعصابك)

هقولك حاجة اتأخرت كتير في فهمها: نشر تطبيق Next.js مش لازم يكون معقد. مش محتاج Kubernetes. مش محتاج AWS ECS. ومش محتاج تدفع 40 دولار في الشهر في باقة Vercel عشان تستخدم server actions.

كل اللي محتاجه VPS و Dokploy و حوالي 30 دقيقة.

مؤخراً عملت rebuild لموقعي بالكامل — بلوج Next.js فيه server actions و contact form و multilingual routing ومحتوى Markdown — ونشرته على Dokploy. تكلفة الاستضافة الكلية: 6 دولار في الشهر للVPS. بس كدي.

هنا هقولك بالظبط عملت ايه، والأهم من كده، الأخطاء اللي حتحت من وقتي عشان انت متكررهاش.

---

## ايه هو Dokploy وليه يهمك؟

Dokploy هو بديل مفتوح المصدر لـ Vercel/Netlify/Render. فكر فيه كـ PaaS (Platform as a Service) بتشغله على السيرفر بتاعك. بتحطه على VPS، بتربطه بـ GitHub repo، وهو بيعملك:

- Build للـ Docker image
- Run للـ container
- SSL certificates (من خلال Let's Encrypt)
- Reverse proxy (من خلال Traefik)
- Preview deployments
- Rollbacks

الـ UI شكله وحاسسه زي Vercel بس أبسط. لو استخدمت Vercel قبل كده، هتحس انك في البيت من أول دقيقتين.

الفرق الرئيسي: انت مالك كل حاجة. مفيش vendor lock-in. مفيش إيميلات "عفواً استهلكت الـ bandwidth". مفيش فواتير مفاجئة.

---

## الـ Architecture: بتعمل ايه بالظبط؟

الشكل النهائي للسيتب:

```
GitHub Repo
    │
    ▼
Dokploy (watching main branch)
    │
    ▼
Docker Compose (multi-stage Dockerfile)
    │
    ├── web container (Next.js, node:22-alpine)
    └── worker container (Bun cron jobs, oven/bun:1.3.10-alpine)
    │
    ▼
Traefik (reverse proxy + SSL)
    │
    ▼
yourdomain.com
```

containerين واحد reverse proxy واحد VPS. ده كل اللي في الموضوع.

---

## الخطوة 1: الـ Dockerfile اللي فعلاً بيشتغل

دي النقطة اللي معظم التوتوريالز بتفشل فيها. بيدوك Dockerfile بيشتغل local بس بيبوظ في الإنتاج. دي اللي وصلتيلها بعد حوالي 5 محاولات:

```dockerfile
# Stage 1: Dependencies
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# Stage 2: Builder
FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN bun run build

# Stage 3: Runner
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT=3000

CMD ["node", "server.js"]
```

عايز أبرزن كام حاجة مهمة:

**ليه `output: "standalone"` في `next.config.ts`؟** ده بيقول لـ Next.js يعمل server bundle فيه بس الملفات اللي فعلاً بتستخدمها الـ routes. أصغر وأسرع وده اللي عايزينه في الـ container. متستخدمش `output: 'export'` لو عندك server actions — ده بيشيلهم خالص.

**ليه user مش root؟** لأن تشغيل الـ container كـ root كارثة أمنية. الـ `nextjs` user بالـ UID 1001 مش هيقدر يتعامل مع أي حاجة برا الـ app directory.

**ليه `bun install --frozen-lockfile`؟** في الإنتاج، انت عايز installs محددة ومتوقعة. لو الـ lockfile مش مطابق للـ package.json، دي هتفشل بسرعة بدل ما تنstall versions مختلفة من غير ما تعرف.

---

## الخطوة 2: Docker Compose (خليه بسيط)

```yaml
services:
  web:
    build:
      context: .
      dockerfile: Dockerfile
    expose:
      - "3000"
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - RESEND_API_KEY=${RES...Y}
    restart: unless-stopped

  worker:
    build:
      context: .
      dockerfile: Dockerfile.worker
    environment:
      - DATABASE_URL=${DATABASE_URL}
    restart: unless-stopped
```

لاحظ إني بستخدم `expose` مش `ports`. Dokploy بي handles الـ reverse proxy من خلال Traefik، فمش محتاج تربط الـ ports بالـ host. ده أنضف وبيتجنب الـ port conflicts.

**خطأ شائع**: حط الـ environment variables مباشرة في الـ compose file. متعملش كده. استخدم `${VAR_NAME}` — Dokploy بي inject دي من الـ environment configuration في الـ UI.

---

## الخطوة 3: إنشاء Dokploy

1. **نزل Dokploy على الـ VPS:**

```bash
curl -sSL https://dokploy.com/install.sh | sh
```

2. **افتح الـ dashboard** على `http://your-vps-ip:3001` (Dokploy نفسه شغال على بورت 3001)

3. **اعمل application جديدة:**
   - روح على Applications → New
   - اختار "Docker Compose" كـ provider
   - اربط الـ GitHub repo
   - اختار الـ branch (عادة `main`)

4. **حط الـ environment variables** في الـ UI بتاع Dokploy:
   - `DATABASE_URL=postgresql://user:***@postgres:5432/dbname`
   - `RESEND_API_KEY=re_xxx...`

5. **دوس Deploy.**

خلاص. Dokploy هي clone الـ repo، يشغل `docker compose up -d --build`، ولو كل حاجة اشتغلت، موقعك بقى live.

---

## الخطوة 4: ربط الدومين

دي الجزء اللي حيرني شوية، فخليني أوفرك الـ صداع:

1. اعمل DNS A record من الدومين للـ IP بتاع الـ VPS
2. في Dokploy، روح لتطبيقك → Domains → Add Domain
3. حط الدومين (مثلاً: `ahmedlotfy.site`)
4. فعل "HTTPS" — Dokploy هي request شهادة Let's Encrypt تلقائياً
5. استنى 30-60 ثانية

تمام. موقعك دلوقتي على HTTPS بشهادة بتتجدد لوحدها.

أنا بستخدم Cloudflare كـ DNS provider (مش كـ proxy — بس DNS). ده معناه إني باخد سرعة Cloudflare من غير ما الـ proxy يعطّل إصدار شهادة الـ Let's Encrypt.

---

## الخطوة 5: إضافة Database (اختياري بس غالباً هتحتاجه)

لو تطبيقك محتاج داتابيز، Dokploy يقدر يشغل Postgres في container منفصل. هنا أتعلمت بالتجربة الصعبة:

**SSL مش بيشتغل في Postgres المستضاف ذاتياً من غير CA certificate.** تطبيقي كان بيفشل مع رسالة `The server does not support SSL connections`. الحل كان إضافة `sslmode=disable` في الـ connection string:

```
DATABASE_URL=postgresql://user:***@postgres-18:5432/mydb?sslmode=disable
```

بس المشكلة إن `sslmode=disable` مش دايمًا بيشتغل لأن الـ Node `pg` driver بيتعامل معاها مختلف. الحل الحقيقي هو تعديل `postgresql.conf` جوه الـ container:

```conf
ssl = off
```

و تعمل restart للـ container. دي مشكلة معروفة مع pgwire (الـ Postgres wire protocol اللي بعض الـ drivers بتستخدمه).

---

## الـ Gotchas اللي سرقت مني وقت

خليني أوفرلك كام ساعة:

### الـ Gotcha 1: الـ Build ينجح بس الـ runtime يفالـ

Dockerfile build ممكن يعدي بس الـ container بي crash عند الـ startup. شوف الـ logs:

```bash
docker logs <container-id>
```

السبب الشائع: environment متغيرات ناقصة. لو تطبيقك بيقرأ `process.env.DATABASE_URL` على مستوى الـ module (مش جوه الـ function)، هيفشل في الـ startup لو الـ variable مش موجود.

### الـ Gotcha 2: أخطاء "Cannot find module" في Docker

ده غالبًا معناه إن الـ `.dockerignore` بتاعك غلط أو إنت ناقص ملفات في خطوة الـ COPY. تأكد إن الـ `.dockerignore` بيشيلش ملفات الـ build محتاجها.

### الـ Gotcha 3: التعديلات مش بتظهر بعد deploy

الـ Docker caching عنيف. لو غيرت الكود بس الـ build استخدم cached layers، الكود الجديد مش هيتضمن. عمل force لـ clean rebuild:

```bash
docker compose build --no-cache
```

في Dokploy، شغل "Clean Build" في الـ deployment settings.

### الـ Gotcha 4: Server Actions مش بتشتغل

لو بتستخدم Next.js server actions ونشرت بـ `output: 'export'`، هم رايحين في سيميحة. الـ Server actions محتاجة server node شغال. استخدم `output: "standalone"` بدل كده.

---

## النتيجة

موقعي دلوقتي self-hosted بالكامل. البلوج بي render 19 بوست من ملفات Markdown. الـ contact form بيبعت إيميلات عن طريق Resend. الـ testimonials بتيجي من JSON file. كل حاجة بتبني من الأول مع كل push لـ `main`.

التكلفة الشهرية الكلية:

| الخدمة | التكلفة |
|--------|---------|
| VPS (Hetzner CX11) | $3.75/شهر |
| الدومين | ~$10/سنة |
| Resend (free tier) | $0 |
| Dokploy (open source) | $0 |
| **الإجمالي** | **~$4.50/شهر** |

قارن ده بـ Vercel Pro ($20/شهر) + PlanetScale ($29/شهر) + استضافة الصور على CDN. الـ Self-hosting أرخص وبتتتعلم كتير عن الـ deployment في الـ process.

---

## تعمل كده ولا لأ؟

الإجابة الصادقة: على حسب حالتك.

**اعمله لو:**
- عايز تتlearn الـ deployment بيشتغل ازاي فعلاً
- مرتاح مع Docker و Linux أساسيات
- عايز تحكم كامل على الـ infrastructure
- بتنشر side projects أو مواقع portfolio

**متعملوش لو:**
- محتاج 99.99% uptime (استخدم Vercel/Netlify)
- مش مهتم بال infrastructure خالص
- فريقك عايز push-to-deploy من غير أي configuration
- بتشغل تطبيق حرج للدخل (حد دلوقتي)

لموقع portfolio؟ بلوج؟ side project؟ الـ Self-hosting على Dokploy قرار مفيش فيه كلام.

لو عايز تشوف live example بالظبط على السيتب ده، زور [موقعي](/ar) — شغال بالطريقة دي دلوقتي. ولو عايز تعرف ايه اللي حصل لما شلت الـ Dاتابيز وحوّلت الموقع لـ static، اقرأ بوست [ليه شلت الداتابيز من موقعي](/ar/blogs/why-i-ditched-database-for-static-site).

عندك سؤال؟ كلمني على [Telegram](https://t.me/ahmed_lotfy_dev) — دايمًا ه leap مساعدة حد يتجنب الأخطاء اللي عملتها.
