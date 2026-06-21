---
title: "Docker Compose للمطورين — من الصفر للـ Production"
date: 2025-12-20
tags: ["docker", "docker-compose", "deployment", "devops"]
image: "/images/blogs/docker-compose-guide.jpg"
share: true
featured: false
description: "الدليل الشامل لـ docker-compose — من أول docker compose up لحد deployment جاهز للـ production مع healthchecks و secrets و multi-environment configs."
---

# Docker Compose للمطورين — من الصفر للـ Production

## ليه كتبت ده

أنا بأشغل VPS واحد. سيرفر واحد بس. عليه أكتر من 15 container شغالين في أي وقت — بلوج Next.js، داتابيز PostgreSQL، Redis، Cloudflare Tunnel، أدوات مراقبة، CI runner، وشوية side projects رفضت أقتلها لأنها "لسه بتشتغل". إدارة كل ده كانت تعني كتابة أوامر `docker run` طويلة، نسيان نص الـ flags، وبعدين أفقد كل حاجة لما الـ server بيعمل reboot.

بعدين أنا اتعلمت docker-compose صح. مش نوعية "نسخت YAML من توتوريال" — لأ، نوعية "بوظت الـ production 3 مرات وبقى فاهم ليه كل حاجة موجودة".

الدليل ده هو اللي كنت نفسي حد يديلي من 4 سنين. مش مقدمة لطيفة. ده الحاجة الحقيقية: من أول `docker compose up` لحد production setup تقدر تثق فيه مع traffic حقيقي.

## docker-compose هو ايه بالظبط؟

خلينا نخطي فقرة "Docker هو منصة حاويات". انت عارف ايه هو Docker، وللأ كنت مش عارف كنت مش هتكون هنا.

Docker Compose هو أداة orchestration لتطبيقات متعددة الحاويات. بيخليك تعرّف كل الـ stack بتاعك — كل خدمة، شبكة، volume، و environment variable — في ملف واحد اسمه `docker-compose.yml`. وبعدين ترفع كل ده بأمر واحد.

خلاص. ده هو الموضوع كله.

الحاجة اللي بتخليه قوي هي الـ **declarative infrastructure**. انت بتصف اللي عايزه، مش ازاي تبنيه. بتقول "أنا محتاج داتابيز PostgreSQL بالباسورد ده، Redis cache، و Node.js app بيتكلم معالاتنين"، و Compose بيظبط الـ ordering والـ networking والـ lifecycle.

الـ CLI الحديث بيستخدم `docker compose` (مسافة، مش شرطة) كـ plugin مدمج في Docker Engine. الـ binary القديم `docker-compose` لسه بيشتغل، بس المفروض تستخدم الـ V2 plugin. أسرع، متحدث، وبيدعم ميزات أحدث في الـ Compose specification.

## تشريح ملف docker-compose.yml

ملف Compose هو YAML. الـ indentation مهم. الـ tabs محرمة. أنا عملت debug لفشل "غامض" الساعة 2 الصبح طلع إنه tab واحد. استخدم spaces.

ده هيكل كل ملف Compose بكتبه:

```yaml
version: "3.9"  # اختياري في الـ spec الجديد، بس بكتبه للوضوح

services:
  # كل مفتاح هو اسم الـ container
  app:
    image: node:20-alpine
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    depends_on:
      - db
    volumes:
      - ./app:/app
    networks:
      - frontend
      - backend

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_PASSWORD: "supersecretpassword"
    volumes:
      - db_data:/var/lib/postgresql/data
    networks:
      - backend

volumes:
  db_data:

networks:
  frontend:
  backend:
```

الـ top-level keys اللي لازم تعرفها:

- **`services`** — كل container عايز تشغله. كل خدمة بتاخد مفتاح، و Compose بيستخدم المفتاح ده كـ DNS name للـ inter-container communication.
- **`volumes`** — Named volumes بتحتفظ بالـ data حتى لو الـ container اتعمله restart. من غير دول، الداتابيز بتاعك هيكون فاضي كل ما تعمل rebuild.
- **`networks`** — شبكات مخصصة لعزل الـ traffic. الـ containers على نفس الشبكة بتقدر تتكلم مع بعض بالـ service name.
- **`configs`** و **`secrets`** — للـ Swarm mode، بس نمط إخراج الـ secrets من الكود بينطبق في كل مكان.

أي حاجة تانية — `build`، `ports`، `environment`، `depends_on`، `healthcheck`، `restart` — بتكون تحت تعريف الـ service.

## أول مشروع حقيقي: Web App + PostgreSQL + Redis

خلينا نبني حاجة حقيقية. تطبيق Next.js مع PostgreSQL للـ data و Redis للـ caching والـ sessions. ده الـ stack اللي بأشغله على الـ VPS بتاعي، فكل سطر هنا اتجرب في الـ production.

```yaml
services:
  app:
    build:
      context: ./app
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: "postgresql://appuser:***@db:5432/myapp"
      REDIS_URL: "redis://cache:6379"
      NODE_ENV: production
    depends_on:
      db:
        condition: service_healthy
      cache:
        condition: service_started
    networks:
      - app_network
    restart: unless-stopped

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: appuser
      POSTGRES_PASSWORD: dbpassword123
      POSTGRES_DB: myapp
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U appuser -d myapp"]
      interval: 10s
      timeout: 5s
      retries: 5
      start_period: 15s
    networks:
      - app_network
    restart: unless-stopped

  cache:
    image: redis:7-alpine
    command: redis-server --requirepass redispassword456 --maxmemory 128mb --maxmemory-policy allkeys-lru
    volumes:
      - redis_data:/data
    networks:
      - app_network
    restart: unless-stopped

volumes:
  postgres_data:
  redis_data:

networks:
  app_network:
    driver: bridge
```

شوية حاجات عايز أبينها:

**`depends_on` مع `condition: service_healthy`** — ده مهم جداً. من غير الـ healthcheck condition، الـ app container بيبدأ بمجرد ما الـ PostgreSQL container يبدأ، مش لما PostgreSQL فعلاً يكون *جاهز يستقبل connections*. أنا شوفت ده يسبب cascading failures عند الـ boot. الـ app بيعمل crash، يعمل restart، يعمل crash تاني، وانت قاعد مستغرب ليه الداتابيز "مش شغال".

**Redis مع باسورد وحدود ذاكرة** — الـ default Redis config مفيهوش authentication ولا حد للذاكرة. في الـ production، ده حادثة أمنية و OOM kill مستني يحصل. الـ `command` override بيحط باسورد ويحط حد للذاكرة عند 128 MB مع LRU eviction.

**Named volumes للداتابيزات** — الداتابيز بتاعك بيفضل شغال حتى لو الـ containers اتعملها restart أو rebuild، وحتى لو عملت `docker compose down` (إلا لو ضفت `-v`). ده مش اختياري للـ stateful services.

## Environment Variables وإدارة الـ Secrets

حط الباسوردات في ملف الـ Compose مباشرة كويس للـ local development. بس مش كويس للـ production. ده بتعامل معاه:

**الحل الأول: ملف `.env` (كويس للـ single-server deployments)**

اعمل ملف `.env` في نفس الـ directory اللي فيه `docker-compose.yml`:

```env
POSTGRES_USER=appuser
POSTGRES_PASSWORD=dbpassword123
REDIS_PASSWORD=redispassword456
APP_SECRET=some-random-string-for-sessions
```

وبعدين ارجع ليهم في ملف الـ Compose:

```yaml
services:
  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
```

Docker Compose بيقرأ ملف `.env` تلقائياً. الـ variables في ملف الـ Compose بتستخدم `${VAR_NAME}` syntax. لو الـ variable مش موجود، Compose بيرمي error بشكل افتراضي — ممكن تخليه اختياري بـ `${VAR_NAME:-defaultvalue}`.

**حط `.env` في `.gitignore`.** مش ببالغ لو قلتلك أنا مرة عملت commit لباسورد داتابيز في public repo عشان نسيت. كان مكلف ومحرج.

**الحل الثاني: ملف بيئة مع `env_file`**

للـ services اللي محتاجة variables كتير:

```yaml
services:
  app:
    env_file:
      - ./app.env
    environment:
      NODE_ENV: production
```

الـ `env_file` بيحمل الـ key-value pairs مباشرة. الـ variables المحطوطة في `environment:` بت override القيم من `env_file`.

**الحل الثالث: Docker Secrets (للـ Swarm، بس النمط بينطبق)**

لو بتشغل Docker Swarm، استخدم الـ `secrets` top-level key. للـ single-server setups، أنا بحط الـ secrets في ملف منفصل بصلاحيات مقيدة:

```bash
echo "supersecretpassword" | sudo tee /run/secrets/db_password
sudo chmod 600 /run/secrets/db_password
```

وبعدين أعمل mount ليه:

```yaml
services:
  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_PASSWORD_FILE: /run/secrets/db_password
    secrets:
      - db_password

secrets:
  db_password:
    file: /run/secrets/db_password
```

المبدأ واحد في كل مكان: **متحطش secrets في version control، متكتبهاش في Dockerfiles، ومتديها كـ command-line arguments** (بتظهر في `ps aux`).

## Healthchecks اللي فعلاً بتشتغل

أغلب الـ healthchecks اللي بشوفها في التوتوريالز وحشة. بتكون شكلها كده:

```yaml
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost:3000"]
  interval: 30s
  timeout: 10s
  retries: 3
```

ده وحش لأسباب كتير. أول حاجة، `curl` مش موجود في الـ Alpine-based images. تاني حاجة، الـ root path مش معناه إن الـ app شغال — ممكن يرجع 200 والـ connection بالـ database ميت. تالت حاجة، 30 ثانية بين كل check معناه الـ container ممكن يبقى "unhealthy" لمدة 90 ثانية قبل ما أي حاجة تتفاعل.

ده اللي أنا بستخدمه فعلاً:

**لتطبيق ويب:**

```yaml
healthcheck:
  test: ["CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://localhost:3000/api/health"]
  interval: 10s
  timeout: 5s
  retries: 3
  start_period: 20s
```

الـ `/api/health` endpoint المفرود يفحص الـ database connection والـ Redis وأي dependency حرج. لو أي واحد فيهم مش شغال، يرجع non-200 status. ده الـ healthcheck الوحيد اللي له معنى.

**لـ PostgreSQL:**

```yaml
healthcheck:
  test: ["CMD-SHELL", "pg_isready -U appuser -d myapp"]
  interval: 10s
  timeout: 5s
  retries: 5
  start_period: 15s
```

`pg_isready` موجود في الـ PostgreSQL image. بيتشيك لو الـ server بيقبل connections. ده الـ check الصح.

**لـ Redis:**

```yaml
healthcheck:
  test: ["CMD", "redis-cli", "-a", "redispassword456", "ping"]
  interval: 10s
  timeout: 5s
  retries: 3
```

الـ `start_period` مهم للـ services البطيئة زي الداتابيزات. خلال الـ `start_period`، الـ healthchecks الفاشلة مش بتتحسب ضد الـ retry limit. من غيره، PostgreSQL ممكن يفشل 3 checks ويتت unhealthy قبل ما يخلص الـ initialization أصلاً.

## Restart Policies مشروحة بسيناريوهات حقيقية

Docker بيقدم 4 restart policies. ده اللي بيعملوه فعلاً، مش اللي في الـ documentation:

**`no`** — متعملش restart أبداً. ده الـ default. لو الـ container خرج، بيفضل ميت. استخدده للـ one-shot tasks زي database migrations.

```yaml
services:
  migrate:
    image: node:20-alpine
    command: ["npx", "prisma", "migrate", "deploy"]
    restart: no
    depends_on:
      db:
        condition: service_healthy
```

**`always`** — دايماً اعمل restart، بغض النظر عن الـ exit code. حتى لو الـ container خرج بـ code 0، Docker هيعمله restart. ده ممكن يكون مفيد بس غالباً غلط — بيعمل restart loops للـ containers اللي المفروض تخرج.

**`unless-stopped`** — دايماً اعمل restart، إلا لو وقفت الـ container بشكل صريح بـ `docker compose stop` أو `docker stop`. ده اللي بستخدمه لـ 90% من الـ services. بيعيش بعد الـ crashes والـ reboots والـ Docker daemon restarts.

**`on-failure`** — اعمل restart بس لو الـ container خرج بـ non-zero code. مفيد للـ batch jobs أو الـ workers اللي المفروض توقف لما تخلص بنجاح بس تعمل retry لو حصل خطأ.

```yaml
services:
  worker:
    build: ./worker
    restart: on-failure
    restart_policy:
      max_attempts: 5
      window: 120s
```

قاعدتي: **`unless-stopped` للـ long-running services، `no` للـ one-shot tasks، `on-failure` للـ workers.** أنا تقريباً مابستخدمش `always` أبداً.

## الـ Networking بين الـ Containers

في حاجة بتتلخبط كل مبتدئ: الـ containers في نفس ملف الـ Compose بتقدر تتكلم مع بالـ service name. مش محتاج `links`. مش محتاج تدور على IP addresses.

في المثال اللي فوق، الـ `app` بيتكلم مع PostgreSQL باستخدام `db:5432` كـ hostname. الـ `db` ده هو الـ service name من ملف الـ Compose. الـ internal DNS في Docker بيحلله تلقائياً.

**ليه الـ networks أحسن من الـ links:**

الـ `links` ده legacy. كان الطريقة القديمة لربط الـ containers، وكان عنده مشاكل: كان بيعمل dependency ordering (اللي `depends_on` بيعمله دلوقتي)، كان بيحقن environment variables بتسرب بيانات الـ connection، وكان بيشتغل بس في ملف Compose واحد.

الـ custom networks بتديك:

- **عزل** — حط الداتابيز على شبكة الـ frontend مش يوصلها. بس الـ app service بتقدر توصلها.
- **DNS resolution** — كل container على نفس الشبكة بتقدر توصل لأي container تاني بالـ service name.
- **Multiple networks** — الـ service ممكن يكون على أكتر من شبكة، وده ازاي تبني DMZ-style architectures.

```yaml
services:
  app:
    networks:
      - frontend
      - backend

  db:
    networks:
      - backend  # بس الـ app بتقدر توصل دي

networks:
  frontend:
  backend:
    internal: true  # مفيش internet access من الشبكة دي
```

الـ `internal: true` flag على الـ backend network معناه إن الـ containers عليه مش هتقدر توصل للـ internet. الداتابيز بتاعك مش محتاج يتكلم مع العالم الخارجي، فمتخليش يعمل كده.

## استراتيجيات الـ Volumes: Bind Mounts vs Named Volumes

ده المكان اللي بشوف فيه أكتر لبس، فخليني أكون مباشر.

**Named volumes** بتكون مُدارة من Docker. بتعيش في الـ storage directory بتاع Docker (`/var/lib/docker/volumes/` على Linux). بترجع ليها بالاسم في ملف الـ Compose.

**Bind mounts** بتعمل mapping لـ path معين على الـ host machine لـ path جوه الـ container.

**امتى تستخدم named volumes:**

- بيانات الداتابيز. دايماً. انت عايز Docker يدير الـ storage، وعايز الداتابيز تفضل موجودة حتى لو حذفت الـ source code directory.
- أي بيانات لازم تفضل موجودة بشكل مستقل عن الـ project directory بتاعك.

```yaml
volumes:
  postgres_data:
    driver: local
```

**امتى تستخدم bind mounts:**

- في الـ development، لما عايز الـ live code reloading. بتغير ملف على الـ host، والـ container بيشوفه فوراً.
- ملفات الـ config اللي عايز تعدل من غير ما تعمل rebuild للـ container.

```yaml
services:
  app:
    volumes:
      - ./config/app.conf:/etc/app/config.conf:ro  # :ro = read-only
```

**الغلطة اللي عملتها:** أنا استخدمت bind mount لبيانات PostgreSQL في الـ development. بعدين عملت `rm -rf ./postgres-data` عشان "أبدأ من الأول". فقدت 3 شهور من seed data و test users و migration history. استخدم named volumes لأي حاجة بتفرق معاك.

**Pro tip:** ممكن تجمع الاتنين. استخدم named volume للداتابيز و bind mount لملفات الـ config:

```yaml
services:
  db:
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./init-scripts:/docker-entrypoint-initdb.d:ro
```

الـ init scripts في `/docker-entrypoint-initdb.d` بتشتغل بس في أول startup، وده مثالي للـ seeding.

## Multi-Stage Builds لصور أصغر

الـ production image المفروض ميكونش فيه الـ build tools. ميكونش فيه `node_modules` من الـ development. المفروض يكون فيه الحد الأدنى اللي محتاجه عشان يشغل الـ application.

ده multi-stage Dockerfile لتطبيق Next.js:

```dockerfile
# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Production
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# بنسخ بس اللي محتاجينه من الـ builder
COPY --from=builder /app/package.json /app/package-lock.json ./
RUN npm ci --omit=dev

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.js ./

USER node
EXPOSE 3000
CMD ["npm", "start"]
```

الـ builder image حوالي ~500 MB مع كل الـ dev dependencies. الـ runner image حوالي ~180 MB مع بس الـ production dependencies. على VPS ب bandwidth ومساحة محدودة، ده بيفرق. وكمان بيقلل الـ attack surface — مفيش build tools معناه مفيش build tools ممكن تتexploit.

في ملف الـ Compose، ارجع للـ build context:

```yaml
services:
  app:
    build:
      context: ./app
      dockerfile: Dockerfile
      target: runner  # حدد الـ runner stage بشكل صريح
```

## قائمة مراجعة الـ Production Deployment

قبل ما توجه traffic حقيقي لـ Compose setup، راجع القائمة دي. كل نقطة فيها اتعلمتها بالطريقة الصعبة.

- [ ] **مفيش secrets مكتوبة بالكود.** استخدم `.env` files، Docker secrets، أو secrets manager. تأكد بـ `grep -r "password" .` قبل كل commit.
- [ ] **Healthchecks على كل service.** لو الـ service معندوش healthcheck، مش عارف لو شغال.
- [ ] **`restart: unless-stopped`** على كل الـ long-running services. الـ server بتاعك هيعمل reboot. الـ containers لازم ترجع.
- [ ] **Named volumes لكل الـ stateful data.** شغل `docker volume ls` وتأكد إن كل داتابيز عنده named volume.
- [ ] **Resource limits.** ضيف `deploy.resources.limits` عشان تمنع أي container واحد من أكل كل الـ RAM.
- [ ] **Read-only root filesystem** لما تقدر. ضيف `read_only: true` واستخدم tmpfs للـ directories اللي محتاجة writes.
- [ ] **Non-root user.** شغل الـ containers كـ non-root user. في الـ Dockerfile، ضيف `USER node` أو اعمل user مخصص.
- [ ] **Logging limits.** من غير log rotation، الـ containers هتملأ الـ disk. حط الـ logging options:

```yaml
services:
  app:
    logging:
      driver: json-file
      options:
        max-size: "10m"
        max-file: "3"
```

- [ ] **Backup strategy.** `docker exec db pg_dump` مش backup strategy. اكتب cron job بيعمل dump و compression و upload للـ object storage.
- [ ] **اختبر الـ recovery.** احذف container. احذف volume. اعمل reboot للـ server. تقدر ترجع؟ لو لأ، معندكش production setup.

## أخطاء عملتها (وازاي تتجنبها)

**الغلطة 1: الـ `latest` tag.** أنا كنت بستخدم `image: postgres:latest` في الـ production. يوم من الأيام، PostgreSQL عمل major version update. Docker سحب الـ image الجديدة في الـ rebuild. الداتابيز بتاعي بقى مش compatible مع النسخة الجديدة. Data loss. دلوقتي أنا ب pin نسخ محددة: `postgres:16.4-alpine`.

**الغلطة 2: تجاهل الـ `depends_on` conditions.** كان عندي Node.js app بتعمل crash في كل reboot عشان كانت بتحاول تتصل بـ PostgreSQL قبل ما PostgreSQL يكون جاهز. الـ container كان "شغال" بس الداتابيز مش كان بيقبل connections. إضافة `condition: service_healthy` حلتها فوراً.

**الغلطة 3: ماحطتش memory limits على Redis.** Redis كان بيستخدم كل الـ RAM المتاحة، الـ OOM killer قتل الـ app container، وموقعي نزل. دلوقتي دايماً بحط `--maxmemory` وبستخدم `restart: unless-stopped`.

**الغلطة 4: استخدام `docker compose down` من غير ما أقرأ الـ docs.** أنا شغلت `docker compose down -v` فاكر إن `-v` يعني "verbose". هو يعني "remove volumes". فقدت الداتابيز كلها. مفيش backup. قضيت الأسبوع اللي جاي أبني الـ data من browser caches و email receipts.

**الغلطة 5: كشف بورتات الداتابيز للـ internet.** كان عندي `ports: - "5432:5432"` على الـ PostgreSQL service عشان كنت عايز أتصل بـ pgAdmin من الـ laptop. بوت لقاه في 48 ساعة. دلوقتي الداتابيزات معندهمش published ports. أنا بتوصل عن طريق [Cloudflare Tunnel](/blogs/cloudflared-tunnel-full-guide) أو SSH tunnel بدل كده.

**الغلطة 6: مابقرأش الـ logs.** لما حاجة بتكسر، `docker compose logs` هو أول أمر بشغله. كنت بأحاول fixes عشوائية لساعات قبل ما أشوف الـ logs. الـ logs دايماً بتقولك بالظبط ايه اللي غلط. اقراهم.

## اقرأ أيضاً

البوست ده جزء من سلسلة عن الـ self-hosting والـ DevOps. لو لقيته مفيد، البوستات دي بتتعمق في مواضيع محددة:

- [استضافة بلوج Next.js بنفسك على Dokploy](/blogs/self-host-nextjs-blog-on-dokploy) — ازاي أنشر الـ stack بالكامل مع zero-downtime deploys
- [Cloudflare Tunnel: الدليل الشامل](/blogs/cloudflared-tunnel-full-guide) — ازاي تكشف الـ services من غير ما تفتح بورتات (الطريقة الصح للوصول للداتابيز عن بعد)
- [إتقان استضافة PostgreSQL على VPS](/blogs/master-postgresql-self-hosting-guide-dokploy-vps) — كل حاجة عن تشغيل PostgreSQL في الـ production على سيرفر بميزانية محدودة
- [الاتصال بـ PostgreSQL اللي شغال جوه Docker](/blogs/connecting-to-postgresql-running-inside-docker) — تفاصيل الـ networking اللي تخطيتها في البوست ده
- [ليه تخلّيت عن الداتابيز وعملت Static Site](/blogs/why-i-ditched-database-for-static-site) — أحياناً أحسن architecture هو مفيش architecture

---

*لو واجهت مشاكل مع الـ Compose setup بتاعك، أول مكان تشوفه هو `docker compose logs <service>`. تاني مكان هو البوست ده. التالت مكان هو [Docker Compose specification](https://docs.docker.com/compose/compose-file/) — هو في الحقيقة مكتوب كويس، وده نادر في الـ official docs.*
