---
title: "بناء workflow من Obsidian للـ Portfolio بدون مجهود"
date: 2026-01-25
updated: 2026-01-25
tags:
  - automation
  - obsidian
  - cloudflare-r2
  - github
  - nextjs
image: /images/blogs/unnamed.jpg
share: true
featured: true
---

# بناء workflow من Obsidian للـ Portfolio بدون مجهود

تحويل ملاحظات محلية لـ portfolio blog احترافي بيبدو بسيط نظرياً، بس تخليه **أوتوماتيكي فعلاً** و **production-ready" على نطاق واسع محتاج تفكير معماري جاد.

أنا مكانش عايز workflow بنسخ و لصق. كنت عايز pipeline. أكتب، أعمل push، والموقع يتصرف لوحده. هنا هقولك الرحلة التقنية والتفكير على مستوى الـ senior اللي استخدمته عشان أتغلب على تحديات بناء content engine متوسط الحجم.

---

## التحدي 1: فوضى الـ Metadata

سنين من الملاحظات في الـ Obsidian vault بتاعي كان عندها frontmatter غير متناسق (أو مفيش أصلاً). بعض الـ folders كانت بتستخدم `tags`، وبعضها كان بيستخدم `keywords`. بناء blog موثوق على ده كان هيؤدي لـ runtime crashes و UI مكسور.

### طريقة التفكير:

Developer مش بيصلح 80 ملف يدوي. بيبني أداة. كنت محتاج طريقة ل normalization للداتا قبل ما توصل للـ frontend.

### الحل:

عملت **Bun-powered pre-processor**. بدل ما أثق في الملاحظات الخام، الـ script بي scan الـ vault، بيستخرج الـ titles من أسماء الملفات لما الـ metadata تكون ناقصة، وبيفرض schema صارم ومتوقع: `title`، `date`، `updated`، `tags`، و `share`. ده حول فوضى لـ **Headless CMS** متوقع.

---

## التحدي 2: فخ "Repo Bloat" على GitHub

تخزين الـ screenshots والـ assets مباشرة في الـ Git repository غلطة كلاسيكية. بيخلي الـ cloning بطيء، والـ dev-loops تقيلة، والـ repository بيبقى "تقيل" في الإدارة مع الوقت.

### طريقة التفكير:

Git للكود والـ text، مش للـ binary objects الكبيرة. كنت محتاج استراتيجية **CDN-First** تخلي الـ repo نضيف والـ workflow متكامل مع Obsidian.

### الحل:

دمجت **Cloudflare R2** في الـ workflow. دلوقتي، لما بسحب صورة في الـ note، بتترفع فوراً لـ R2. الـ local path بيتبدل programmatically لـ CDN URL محسن. ده خلى الـ GitHub repo مقتصر على **100% text**، والـ synchronization بقت lightning fast.

---

## التحدي 3: أزمة GitHub API Rate Limit

في الأول، الموقع كان بي fetch الملاحظات من GitHub API لكل زائر. ده اشتغل في الـ development، بس GitHub بيحدك بـ **60 request في الساعة** للـ Guest. أي زيادة في الـ traffic كانت هتخلي الـ blog كله ي crash.

### طريقة التفكير:

متعتمدش على third-party API كـ primary runtime data source. ده بطيء و محفوف بالمخاطر. كنت محتاج **Middleman Architecture** يوفر uptime 100% بغض النظر عن حالة GitHub.

### الحل:

انتقلت لنموذج **"Sync Station"**.

الـ Portfolio دلوقتي بيقرأ من local PostgreSQL database (من خلال Drizzle). عملنا `syncBlogPosts` service بي authenticate بـ `GITHUB_TOKEN` (بيفتح لك 5,000 req/hr) وبيعمل UPSERT للداتا في الـ DB بتاعنا. الزوار بياخدوا sub-millisecond load times، والموقع محصّن ضد الـ rate limits الخارجية.

---

## التحدي 4: React Hydration و HTML Nesting

Markdown parsers بتخبي تعقيد HTML. الـ renderer الأولاني بتاعي كان بي wrap الصور في `<div>` tags، والـ Markdown parser كان بيحاول يحطهم جوه `<p>` tags. في HTML، ده غير قانوني وبيسبب "React Hydration Mismatch" errors.

### طريقة التفكير:

دايماً Validate الـ output. موقع بي "يشتغل" بس عنده console errors مش production-ready. كنت محتاج rendering "ذكي" يفهم بنية الداتا اللي بيتعامل معاها.

### الحل:

عملت **Smart Paragraph Pattern**. عملت custom MDX component بيكتشف الـ block-level children (زي الصور) وبي switch الـ outer container من `<p>` لـ `<div>` بشكل dynamic. ده إصلاح دقيق بيخلي الموقع 100% مستقر ومن غير errors.

---

## التحدي 5: التحكم التحريري (Featured Posts)

لما الـ archive كبر، أحسن شغلي كان بيتدفن. مش كل ملاحظة تقنية بكتبها هي قطعة "headline"، وكنت محتاج طريقة أرشد الزوار للمحتوى الأكثر قيمة.

### طريقة التفكير:

Senior engineer بيفكر في **Curation** و **Information Architecture**. كنت محتاج طريقة أضيف "طبقة تحريرية" للـ pipeline الأوتوماتيكي من غير ما أعقد الـ workflow.

### الحل:

وسعت الـ sync engine والـ database schema عشان تدعم `featured` flag.

1. **Detection**: الـ script دلوقتي بيدور على `featured: true` في الـ Obsidian headers.
2. **Logic**: الـ backend repository بيدعم SQL filter مخصص للـ highlights دي.
3. **UI**: أضفت navigation tab "Featured" مميز و visual badges (نجوم ذهبية و borders بتلمعش) عشان الـ high-quality posts تبان فوراً.

---

## النتيجة: Workflow "Pro"

الـ pipeline النهائي دلوقتي مش بيبان و bulletproof:

1. **أكتب**: أكتب طبيعي في Obsidian باستخدام الـ templates المعيارية.
2. **Push**: أعمل push لـ GitHub. بس الحاجات اللي عليها `share: true` اللي بتدخل الـ pipeline.
3. **أتمتة**: Webhook (أو CLI command) بي ping الـ "Sync Station"، وبي refresh الـ PostgreSQL cache في ثواني.

**الحكم**: الـ Blog مش المفروض يكون مجرد collection من الملفات — المفروض يكون **content engine متين**. بالتركيز على الـ data normalization والـ caching والـ curation، بنيت portfolio سريع وقابل للتوسع واحترافي.

هذا البورتيفوليو شغال بالظبط زي ما وصفت هنا — static files، من غير database، منشر عبر Dokploy. لو عايز تفهم أكتر عن الـ multilingual routing مع Next.js App Router، اقرأ عن [React Server Components vs Qwik](/ar/blogs/react-server-components-vs-qwik-real-world-truth).

لو عايز تشوف production deployment حقيقي، شوف [The Drive Center](/ar/projects/the-drive-center) — منصة SaaS منشر بنفس الطريقة.
