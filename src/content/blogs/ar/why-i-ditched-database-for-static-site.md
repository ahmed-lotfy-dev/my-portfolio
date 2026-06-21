---
title: ليه شلت الداتابيز من موقعي (وليه انت كمان ممكن تعمل كده)
description: "شلت PostgreSQL و Better Auth و الداشبورد كله من موقعي. ليه الموقع الستاتيك بـ JSON أسرع وأبسط وأرخص."
excerpt: "ليه شلت الداتابيز وروحت ستاتيك. JSON + Markdown + build = أسرع وأبسط وأرخص. بدون ندم."
date: 2026-06-20
updated: 2026-06-20
image: /images/blogs/static-site-no-database.jpg
tags:
  - nextjs
  - static-site
  - architecture
  - performance
  - devops
  - javascript
share: true
featured: true
---

# ليه شلت الداتابيز من موقعي (وليه انت كمان ممكن تعمل كده)

من 3 شهور، موقعي كان شغال بـ Next.js مع داتابيز PostgreSQL و Better Auth للـ authentication و dashboard كامل لإدارة المحتوى و Drizzle ORM بيربط كل ده ببعض. كان ده "الطريقة الصحيحة" لبناء الموقع.

كان برضو بطيء، هش، ومعقد زيادة عن اللزوم.

الأسبوع اللي فات، شلت الـ database layer بالكامل. كل حاجة. الـ schema والـ auth والـ dashboard والـ ORM والـ server actions اللي كانت بتعمل query على Postgres — اتشالو. بدلهم: JSON files و Markdown و build process بيحوّل كل حاجة لـ artifact قابل للنشر.

النتيجة؟ الموقع بقى أسرع، أبسط، أرخص في الاستضافة، وبصدقك — مش وحشني الداتابيز ولا حتى ثانية.

خليني أرويلك ليه خدت القرار ده، ايه اللي خسرته، وايه اللي كسبته، ولو المفروض تعمل نفس الشيء ولا لأ.

---

## نقطة البداية: تطبيق Next.js "عادي"

موقعي كان مبني زي معظم الإنتشنز:

- **PostgreSQL** للـ blog posts والمشاريع والشهادات والـ testimonials والخبرات
- **Better Auth** للـ admin authentication
- **Drizzle ORM** كـ database layer
- **Dashboard** أقدر أعمل فيه CRUD للمحتوى
- **Server actions** بتعمل query للداتابيز في كل ريكوست
- **PostHog** للـ analytics (client و server-side)

ده stack معقول جداً. ده اللي كنت أنصح بيه لـ SaaS product أو مشروع عميل أو أي تطبيق فيه أكتر من مستخدم بيكتب داتا في نفس الوقت.

بس portfolio؟ ده حاجة تانية خالص.

---

## المشكلة: تعقيد من غير سبب

خليني أقولك كان شكل الـ page load عامل ازاي:

1. الريكوست بيوصل للـ Next.js server
2. الـ server action بيتنفذ
3. Drizzle ORM بيبني SQL query
4. الـ Query بيروح لـ PostgreSQL على الشبكة
5. الداتابيز بي parser الـ query بينفّذها ويرجع الـ rows
6. Drizzle بيحول الـ rows لـ TypeScript objects
7. الـ Server بي render الـ component بالداتا
8. الـ HTML بيتبعت للـ client

8 خطوات عشانرض list مشاريع بتتغير مرة في الشهر لو محظوظ.

ونقاط الفشل؟ خليني أعد:

- **مشاكل SSL**: الـ Postgres بتاعي الـ self-hosted مكانش عنده CA certificate. الـ `pg` driver كان بيرفض يتصل من غير `sslmode=verify-full`. اضطريت أ patch الكود عشان يشيل الـ SSL params.
- **حدود الـ connections**: الـ Postgres على VPS صغير عنده connections محدودة. تحت الـ load، الريكوستات كانت بتقف في الـ queue و تعمل timeout.
- **Cold starts**: بعد كل deployment، أول كام ريكوست كانوا بيفشلوا حد ما الـ connection pool يسخن.
- **Schema migrations**: كل تغيير في المحتوى محتاج migration. عايز تضيف field للـ blog posts table؟ ده `drizzle-kit push` و deployment.
- **Auth overhead**: Better Auth كان بيضيف ~40KB للـ client bundle لـ dashboard بستخدمه مرة في الشهر.

الداتابيز مكانش بيعمل حاجة مفيدة. كان في النص.

---

## اللحظة اللي غيرت كل حاجة: مين بيكتب الداتا؟

السؤال اللي غيّر كل حاجة: **مين بيكتب داتا على الموقع ده؟**

الإجابة: أنا. بس أنا. وأنا بكتب داتا عن طريق ما بعمل push لـ Markdown files و JSON على GitHub.

طيب ليه كنت ماشي على داتابيز؟ ما كنتش. كنت بستخدم الداتابيز كـ cache للمحتوى اللي أصلاً موجود في ملفات.

فكر في الموضوع ده:

- الـ Blog posts؟ ملفات Markdown في `src/content/blogs/`
- المشاريع؟ JSON array في `src/data/projects.json`
- الشهادات؟ JSON في `src/data/certificates.json`
- الـ Testimonials؟ JSON في `src/data/testimonials.json`
- الخبرات؟ JSON في `src/data/experiences.json`

الداتابيز كان مخزن نسخ من داتا موجودة أصلاً في الـ repo. كنت بحافظ على sources للحقيقة لما كنت محتاج source واحد بس.

---

## الـ Migration: عملتها ازاي

الـ migration الفعلي اخد حوالي ساعتين. دي الـ process:

### الخطوة 1: صدّر كل حاجة من Postgres

```bash
docker exec postgres-18 pg_dump -U my_portfolio my_portfolio > backup.sql
```

بعدين كتبت scripts تستخرج كل جدول للـ JSON المكافئ بتاعه. الـ Blog posts اتحولت من database rows لـ Markdown files بـ YAML frontmatter.

### الخطوة 2: استبدل الـ database queries بـ file reads

كل server action كان شكله كده:

```typescript
const posts = await db.select().from(blogPosts).orderBy(desc(blogPosts.date));
```

بقى كده:

```typescript
import posts from '@/data/blog-posts.json';
```

خلاص. من غير ORM. من غير connection pool. من غير SSL configuration. من غير migration files.

### الخطوة 3: احذف كود الداتابيز

شلت:
- `src/db/` (الـ database directory بالكامل مع الـ schema والـ connection والـ migrations)
- `src/app/dashboard/` (الـ admin panel)
- `src/app/actions/` (الـ server actions اللي كانت بتكتب في الداتابيز)
- `drizzle-orm`, `better-auth`, `@auth/drizzle-adapter`, `pg` (4 npm packages)
- 179 ملف في الـ total

الـ codebase بقى أصغر بشكل ملحوظ.

### الخطوة 4: اتعامل مع الـ contact form

القطعة الوحيدة من الـ dynamic functionality اللي احتفظت بيها: الـ contact form. بيبعت إيميلات عن طريق Resend API — من غير داتابيز. الـ server action بس بتعمل validate للـ input بـ Zod وبتنادي Resend:

```typescript
await resend.emails.send({
  from: 'contact@ahmedlotfy.site',
  to: 'ahmed@example.com',
  subject: `New message from ${name}`,
  text: message,
});
```

من غير داتابيز. من غير storage. بس API call.

---

## ايه اللي خسرته

خليني أكون صادق في الـ tradeoffs:

**مفيش admin dashboard.** مش بقدر أدخل وأعدل المحتوى من UI دلوقتي. دلوقتي بعدّل JSON files أو Markdown و أعمل commit و push. بالنسبلي، ده أسرع — أنا أصلاً عايش في الـ editor. بس لو انت content editor مش technical، ده خسارة حقيقية.

**مفيش real-time content updates.** مع الداتابيز، كنت أقدر أعدل المحتوى ويبقى live فوراً. دلوقتي محتاج أعمل push لـ GitHub و أستنى الـ build (حوالي دقيقتين). لـ portfolio بيتغير كل أسبوع، ده تمام. لموقع أخبار، مش هينفع.

**مفيش user-generated content.** لو محتاج comments أو user accounts أو أي form من الـ user-submitted data، محتاج داتابيز (أو خدمة تالتة). موقعي مفيش فيه حاجة من ده، فمكانش عندي قلق.

**مفيش complex queries.** مش بقدر أعمل `SELECT * FROM posts WHERE tags @> ARRAY['nextjs'] ORDER BY views DESC` دلوقتي. الـ "queries" بتاعتي هي `Array.filter()` و `Array.sort()` على JSON arrays. لمئات العناصر، دي بتكون instant. لملايين، مش هتكون.

---

## ايه اللي كسبته

**السرعة.** الـ Page loads نزلت من ~200ms (مع الـ database round-trip) لـ ~50ms (قراءة من الـ memory في وقت الـ build). الـ JSON files بتتـimport كـ modules — هي في الـ memory قبل ما أول ريكوست يوصل.

**الاستقرار.** مفيش "500 Internal Server Error" تاني لأن الـ database connection وقع. مفيش SSL handshake failures. مفيش connection pool exhaustion. الموقع يا بي build يا مبيبنيش. لو بي build، بيشتغل.

**البساطة.** الـ `package.json` بتاعي نزل من 45 dependency لـ 38. الـ Dockerfile بتاعي مش محتاج يستنى الداتابيز تبقى healthy قبل ما يبدأ. الـ docker-compose.yml فقد service كامل.

**التكلفة.** مش محتاج managed database تاني. مفيش PlanetScale، مفيش Neon، مفيش قلق على compute hours أو connection limits. الـ VPS بيشغل التطبيق وبس.

**تجربة المطور.** `git pull`، عدّل JSON file، `git push`. ده الـ content management workflow بالكامل. مفيش migrations، مفيش schema changes، مفيش `drizzle-kit push`.

---

## الأرقام

| المقياس | قبل (مع الداتابيز) | بعد (static) |
|---------|---------------------|--------------|
| الـ Page load (TTFB) | ~200ms | ~50ms |
| الـ Dependencies | 45 | 38 |
| الـ Docker services | 3 (app, worker, db) | 2 (app, worker) |
| الـ Build time | ~45s | ~30s |
| التكلفة الشهرية | ~$35 (VPS + managed DB) | ~$4.50 (VPS بس) |
| أخطاء 500/أسبوع | 3-5 | 0 |

---

## امتى تعمل كده (وامتى متعملوش)

**شيل الداتابيز لو:**
- انت الشخص الوحيد اللي بيعمل محتوى
- المحتوى بيتغير نادراً (كل أسبوع أو أقل)
- مرتاح وانت بتعدل ملفات في code editor
- موقعك read-heavy مع writes قليلة
- عايز تبسّط الـ stack وتقلل التكاليف

**خلّي الداتابيز لو:**
- أكتر من شخص محتاج يعمل/يعدل محتوى
- محتاج admin interface مش technical
- المحتوى بيتغير أكتر من مرة في اليوم
- عندك user accounts أو comments أو user-generated data
- محتاج complex queries أو full-text search أو real-time updates

---

## الدرس الأكبر

الموضوع مش عن الداتابيز في الحقيقة. الموضوع عن اختيار الأداة المناسبة للـ job.

إحنا — كمطورين — عندنا ميل نبني لـ scale مش هنوصله أبداً. بنضيف databases و message queues و caching layers و microservices لمشاريع بتخدم مئات الزوار في الشهر. بنحسّن لـ requirements مستقبلية افتراضية بدل الـ requirements الحالية الحقيقية.

موقعي مش محتاج داتابيز. ما كانش محتاج أبداً. ضفت واحد لأن ده اللي "المفروض" يتعمل. إني اتعلمت إنسى الافتراض ده وفرّعلي فلوس ووقت وكمية مفاجئة من الـ stress.

أحسن الـ architecture هي الأبسط اللي بتحل مشكلتك الفعلية. مش اللي بتشكل شكل كويس على رسم تصميم السيستم.

---

## جرب بنفسك

لو عندك موقع portfolio أو بلوج أو موقع شخصي مع داتابيز، اسأل نفسك: ايه اللي هيحصل لو استبدلته بـ JSON files؟ ممكن تتفاجأ قد ايه مش هتحس بالفرق.

لو عايز تشوف الـ technical breakdown الكامل للـ deployment، اقرأ [ازاي تستضيف بلوج Next.js بنفسك على Dokploy](/ar/blogs/self-host-nextjs-blog-on-dokploy). ولو مهتم بموضوع الـ self-hosting، بوست [Cloudflare Tunnels للـ Backend Devs](/ar/blogs/the-no-open-ports-manual-cloudflare-tunnels-for-backend-devs) بيغطي ازاي تعرض الـ services بتاعتك من غير ما تفتح ports.

الكود بتاع الموقع ده كله على [GitHub](https://github.com/ahmed-lotfy-dev/my-portfolio). خده fork، بوظه، واتعلم من أخطائي.
