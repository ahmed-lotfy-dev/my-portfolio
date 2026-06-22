---
title: "Next.js App Router vs Pages Router — امتى تستخدم كل واحد فيهم سنة 2026"
date: 2026-06-22
tags: ["next.js", "react", "app-router", "pages-router", "architecture"]
image: "/images/blogs/nextjs-routers-comparison.jpg"
share: true
featured: false
description: "أنا بنتشر بـ production apps بالـ routers الاتنين. دي رأيي الصريح امتى تستخدم App Router وامتى تستخدم Pages Router في 2026، مع أمثلة كود حقيقية وأنماط migration."
---

# Next.js App Router vs Pages Router — امتى تستخدم كل واحد فيهم سنة 2026

## السؤال اللي بيسألني كل شوية

الشهر اللي فات، جالي عميل بسؤال مباشر: "عندنا تطبيق Next.js مبني من سنتين. نعمل migration لـ App Router قبل ما نبدأ الـ feature rollout الكبيرة الجاية؟" أنا بقي بستلم نسخة من السؤال ده مرتين على الأقل كل شهر — من مؤسسين startups، عملاء freelance، و junior devs على Discord اتحطوا في كود مش بتاعهم.

الإجابة مش "روح App Router وخلاص." الإجابة مش "Pages Router مات يا معلم." الإجابة أعقد من كده بكتير، وبعد ما شغلت production apps بالـ routers الاتنين — بما فيهم dashboard لـ SaaS، متجر e-commerce، وبلوج content-heavy بيستقبل 50K زيارة شهرياً — عندي رأي واضح امتى كل واحد فيهم يكون الاختيار الصح.

البوست ده هو الإجابة اللي كنت نفسي حد يقوليا في 2023 وأنا باخد القرارات دي من غير playbook. هشرحلك الفروقات المعمارية الحقيقية، امتى كل router بيكسب، ازاي تعمل migration بشكل تدريجي، والأخطاء اللي بشوف الفرق بتكررها كل شوية.

## تاريخ مختصر: ليه Next.js عمل App Router أصلاً؟

Pages Router مكانش "الطريقة القديمة" وبس. لسنين، كان هو الطريقة الالوحيدة، وكان فعلاً كويس. `getServerSideProps`، `getStaticProps`، `getInitialProps` — الـ patterns دي حلت مشاكل حقيقية. دتني SSR لما احتجته، SSG للأداء، و ISR لأفضل حل بين الاتنين.

طيب ليه فريق Next.js بنى routing system جديد خالص؟

الإجابة القصيرة: React Server Components. Pages Router اتصمم في عصر مكونات React كانت بتشتغل بس على الـ client أو بتت render لـ HTML على الـ server أثناء الـ request. مكانش فيه concept لمكونات بتشتغل *بس* على الـ server، وبت stream أجزاء من الـ UI للـ client لما الـ data تيجي.

React 18 قدم Server Components كـ concept أساسي. لكن معمارية Pages Router — مع الـ `_app.tsx` wrapper، و الـ `getPageProps` mental model، والـ tight coupling مع دورة الـ client-side hydration — مكانش يقدر يستوعب مكونات مش بتبعت JavaScript للـ browser بشكل نضيف.

App Router اتبنى من الأول على تلات أفكار:

1. **Server components بشكل افتراضي** — كل component هو Server Component لحد ما انت تبص بشكل صريح بـ `"use client"`.
2. **Nested layouts مع shared UI** — مش hack بالـ `_app` + `_document`، لا ده layout system حقيقي بيستمر عبر الـ navigations من غير ما يعيد الـ re-rendering.
3. **Streaming و selective hydration** — القدرة إنك تعرض page skeleton فوراً وتعمل stream للمحتوى وهو بييجي، جزء جزء.

مكانش rewrite عشان يتكتب. ده كان shift معماري ضروري عشان يفتح أبواب الـ patterns اللي Pages Router مقدرش يدعمها فيزيائياً.

## الفرق المعماري في فقرة واحدة

الاتنين بيستخدموا file-system routing — هيكل الملفات بتاعك بيبقى هو هيكل الـ URLs. بس تحت الغطاء، مختلفين بشكل جذري. Pages Router بيعتبر كل page زي client-side React app ممكن يتعملها pre-rendering على الـ server وممكن لأ. الـ data fetching بيحصل من خلال دوال خاصة (`getServerSideProps`, `getStaticProps`) بتشتغل في وقت الـ request أو وقت الـ build، والـ page كلها بتعمل hydration كوحدة واحدة على الـ client. App Router بيقلب المعادلة: كل component هو Server Component بشكل افتراضي، يعني بيشتغل على الـ server، بيجيب الـ data بتاعته بنفسه، وبيعمل render لـ HTML — من غير client JavaScript يتبعت للـ component ده. انت بتختار الـ client-side interactivity بـ `"use client"`، والـ data fetching بيستخدم `async/await` مباشرة في جسم الـ component بدل ما يكون في دالة props منفصلة. النتيجة هي model الـ server بيشتغل أكتر، والـ client بيشتغل أقل، وانت بتاخد streaming و nested layouts و per-segment caching مجاناً.

## App Router: امتى بيبقى هو البطل

في 2026، أنا بستخدم App Router في أغلب المشاريع الجديدة. هنا الأماكن اللي فعلاً بيفوق فيها:

### 1. مواقع فيها Content كتير مع Layouts معقدة

لو بتبني dashboard، موقع documentation، أو بلوج فيه navigation nested، الـ layout system بتاع App Router بيفرق جداً. مؤخراً عملت rebuild لـ knowledge base لعميل باستخدام nested layouts، والـ DX improvement كان ملحوظ.

```tsx
// app/docs/[...slug]/page.tsx
import { getDocument } from '@/lib/docs';

export default async function DocPage({ params }: { params: { slug: string[] } }) {
  const doc = await getDocument(params.slug.join('/'));

  return (
    <article className="prose dark:prose-invert max-w-none">
      <h1>{doc.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: doc.content }} />
    </article>
  );
}
```

```tsx
// app/docs/layout.tsx
import { DocsSidebar } from '@/components/docs-sidebar';

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-8">
      <DocsSidebar />
      <main className="flex-1">{children}</main>
    </div>
  );
}
```

الـ sidebar بيستمر عبر الـ page navigations. من غير re-fetching، من غير layout shift، من غير `useEffect` hacks عشان تحافظ على الـ state. Pages Router مش يقدر يعمل كده من غير مجهود كبير.

### 2. تطبيقات محتاجة Streaming SSR

لما عملت analytics dashboard في الوقت الحقيقي لعميل في مجال الـ logistics، الـ `loading.tsx` والـ streaming capabilities بتاعة App Router وفرتلنا أسابيع من شغل الـ loading-state engineering.

```tsx
// app/dashboard/loading.tsx
export default function DashboardLoading() {
  return (
    <div className="grid grid-cols-3 gap-4 animate-pulse">
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonChart />
    </div>
  );
}
```

```tsx
// app/dashboard/page.tsx
import { Suspense } from 'react';
import { LiveMetrics } from '@/components/live-metrics';
import { HistoricalChart } from '@/components/historical-chart';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <Suspense fallback={<SkeletonMetrics />}>
        <LiveMetrics />
      </Suspense>
      <Suspense fallback={<SkeletonChart />}>
        <HistoricalChart />
      </Suspense>
    </div>
  );
}
```

الـ shell بيعمل render فوراً. كل قسم بيعمل stream بشكل مستقل. لو الـ historical chart بياخد 2 ثانية يعمل query على الـ database، المستخدم لسه بيشوف الـ live metrics على طول. في Pages Router، يا إما تستنى كل حاجة أو تبني client-side loading orchestration معقد.

### 3. Full-Stack Apps مع Server Actions

Server Actions، في رأيي، أكتر feature مش ماخدة حقها في App Router. أنا بستخدمها لـ form handling، mutations، وحتى multi-step workflows معقدة.

```tsx
// app/projects/actions.ts
'use server';

import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';

export async function createProject(formData: FormData) {
  const name = formData.get('name') as string;
  const description = formData.get('description') as string;

  const project = await db.project.create({
    data: { name, description },
  });

  revalidatePath('/projects');
  return project;
}
```

```tsx
// app/projects/new/page.tsx
import { createProject } from '../actions';

export default function NewProjectPage() {
  return (
    <form action={createProject}>
      <input name="name" required />
      <textarea name="description" />
      <button type="submit">Create Project</button>
    </form>
  );
}
```

من غير API route. من غير `fetch` call. من غير `useState` للـ form state. الـ form بيشتغل من غير JavaScript لو محتاج كده. ده أبسط بكتير من الـ Pages Router equivalent.

## Pages Router: امتى لسه هو الاختيار الصح

مش هأطلع ممثل وأقول إن Pages Router بقى قديم. فيه مواقف حقيقية هختارها فيها النهارده — أو على الأقل مش هتعب نفسي في migration لكود موجود.

### 1. تطبيقات Production مستقرة مش محتاجة Features جديدة

عندي عميل شغال على متجر e-commerce بـ Pages Router (Next.js 14) بيعمل معاملات بحوالي 200K دولار شهرياً. مستقر، سريع، والفريق عارفه كويس. الـ migration لـ App Router هتاخد أسابيع، هتدخل regressions، ومش هتقدم أي business value. مغالطة "الأحدث أحسن" كلفت شركات حقيقية فلوس حقيقية.

لو تطبيقك بـ Pages Router شغال كويس وانت بتضيف features بشكل تدريجي، قعد مكانك. Pages Router لسه مدعوم وبياخد security updates.

### 2. فرق محتاجة تسلم بكرة

App Router عنده learning curve أعلى. Server Components، حدود الـ `"use client"`، سلوك الـ caching اللي بيتغير بين الـ environments — دي concepts بتحير حتى الـ React developers الخبرة. شفت فرق ضاعت أسابيع بيعملوا debug ليه الـ `fetch` calls بتاعتهم بتتعملها caching من غير ما يعرفوا، أو ليه الـ component الـ client مش بيستقبل props من الـ server component.

لو فريقك صغير وتحت deadline وانت فاهم Pages Router كويس، استخده. الـ productivity gain من استخدام حاجة مألوفة في الغالب بيبقى أكتر من الفوائد المعمارية لـ App Router.

### 3. تطبيقات معتمدة بشكل كبير على Client-Side State

لو تطبيقك في الأساس SPA على الـ client بس بيستخدم Next.js للـ routing — فكر في أدوات زي Figma، interfaces معقدة للـ drag-and-drop، أو real-time collaborative editors — الـ model بتاع Pages Router أبسط. كل حاجة client component، الـ data fetching بيحصل في `useEffect` أو من خلال React Query، ومش محتاج تفكر في حدود الـ server/client.

```tsx
// pages/editor/[docId].tsx
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { DocumentCanvas } from '@/components/document-canvas';

export default function EditorPage() {
  const router = useRouter();
  const { docId } = router.query;
  const [doc, setDoc] = useState(null);

  useEffect(() => {
    if (!docId) return;
    fetch(`/api/documents/${docId}`)
      .then(res => res.json())
      .then(setDoc);
  }, [docId]);

  if (!doc) return <Loading />;

  return <DocumentCanvas document={doc} />;
}
```

الـ pattern ده مباشر، مفهوم، ومش محتاج تفكر في serialization boundaries أو server component passthrough.

### 4. لما تحتاج Ecosystem Compatibility ناضج

فيه libraries لسه مالحقتش تواكب Server Components. لو بتستخدم libraries بتفترض إن React على الـ client (versions قديمة من بعض الـ charting libraries، بعض الـ animation frameworks، أو packages داخلية قديمة)، Pages Router بيجنبك الـ compatibility headaches.

## خطة الـ Migration: الانتقال من Pages لـ App Router بشكل تدريجي

ده الجزء اللي أغلب الـ tutorials بتتجنبه. مش لازم تعيد كتابة كل حاجة مرة واحدة. Next.js بيدعم الـ routers الاتنين في نفس المشروع، وأنا استخدمت ده عشان أعمل migration لتطبيقات حقيقية جزء جزء.

دي الاستراتيجية اللي بستخدمها:

**الخطوة 1: حط الـ pages بتاعتك في مجلد `pages/` (لو مش موجودين هناك) واعمل مجلد `app/` جنبهم.**

```
my-app/
├── pages/          # Pages Router الموجود
│   ├── _app.tsx
│   ├── index.tsx
│   └── api/
├── app/            # App Router الجديد
│   └── (new features)/
├── next.config.js
```

**الخطوة 2: حدّث `next.config.js` عشان يتعامل مع الاتنين:**

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // ده بيفعّل App Router جنب Pages Router
  },
};

module.exports = nextConfig;
```

**الخطوة 3: ابدأ الـ features الجديدة في App Router.** مش هتعمل migration للصفحات الموجودة لحد ما يكون عندك سبب. الـ routes الجديدة تروح في `app/`.

**الخطوة 4: اعمل migration للصفحات الأعلى قيمة الأول.** عادة دي بتكون الـ landing page (بتستفيد من streaming SSR) أو صفحات المحتوى (بتستفيد من nested layouts).

**الخطوة 5: اتعامل مع الـ shared components بحذر.** المكونات اللي بتشتغل مع الـ routers الاتنين لازم تكون خالية من أوامر `"use client"` لو هتُستخدم في Server Components. أنا بعمل مجلد `shared/` للـ UI components اللي مش معتمدة على framework معين.

**الخطوة 6: انقل الـ API routes.** App Router بيستخدم Route Handlers بدل الـ API routes. الـ migration دي ميكانيكية:

```ts
// pages/api/users.ts (القديم)
import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.json({ users: [] });
}
```

```ts
// app/api/users/route.ts (الجديد)
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ users: [] });
}
```

الـ gotcha المهمة: Route Handlers معندهاش نفس الـ `req/res` Node.js objects. انت بتشتغل مع Web `Request` و `Response` بدل كده. بياخد حوالي ساعة تتعود عليه.

## مقارنة الأداء: أرقام حقيقية من تجربتي

عملت migration لموقع content marketing (40 صفحة، أغلبها SSG مع بعض SSG) من Pages Router لـ App Router واتابعت النتائج:

| المقياس | Pages Router | App Router | التغيير |
|--------|-------------|------------|--------|
| Lighthouse Performance Score | 78 | 94 | +20.5% |
| Time to Interactive (موبايل) | 3.2s | 1.8s | -43.7% |
| First Contentful Paint | 1.4s | 0.9s | -35.7% |
| JavaScript المرسل (homepage) | 287KB | 142KB | -50.5% |
| Build time (SSG) | 4m 12s | 3m 48s | -9.5% |

أكبر مكسب كان في تقليل JavaScript. Server Components مش بتبعت الكود بتاعها للـ client، فالصفحات اللي أغلب محتواها content شوفت انخفاض كبير جداً في حجم الـ bundle. الـ TTI improvement كان أكتر حاجة ملحوظة — المستخدمين على اتصالات بطيئة قالوا إن الموقع بقى "فوري" مقارنة بالأول.

بالنسبة لمتجر الـ e-commerce اللي ذكرته، الأرقام كانت أكبر. صفحة عرض المنتجات نزلت من 412KB JavaScript لـ 189KB، بشكل أساسي لأن الـ product grid والـ filters والـ recommendation widgets بقوا كلهم Server Components.

النتائج بتاعتك هتختلف. لو تطبيقك متحسّن بالفعل مع dynamic imports و code splitting في Pages Router، المكاسب هتكون أقل. بس لأغلب التطبيقات اللي اشتغلت عليها، App Router بيقدم performance improvement ملحوظ من غير مجهود إضافي.

## استراتيجية "استخدم الاتنين": ازاي ببني المشاريع الجديدة في 2026

دي طريقتي الفعلية للمشاريع الجديدة في 2026:

1. **ابدأ بـ App Router لكل حاجة.** ده الافتراضي. الـ features الجديدة، الصفحات الجديدة، الـ API endpoints الجديدة — كله يروح في `app/`.

2. **استخدم Pages Router لـ edge cases معينة.** لو قابلت library مش بتشتغل مع Server Components، أو لو محتاج prototype سريع مش هيستفيد من الـ streaming، أحطه في `pages/`.

3. **خلي الـ marketing/blog site في App Router.** فوائد الأداء لمواقع Content كبيرة جداً ومينفعش تتجاهلها. لو بتستضيف تطبيق Next.js بنفسه (كتبت عن [إعداد Dokploy](/blogs/self-host-nextjs-blog-on-dokploy))، كل KB JavaScript مش بتبعته هو bandwidth مش بتدفع فيه.

4. **استخدم Route Handlers للـ APIs، بس خلي خيار الـ Pages API routes موجود.** Route Handlers أنضف، بس لو عندك middleware أو API patterns موجودة بتعتمد على الـ Node.js `req/res` objects، Pages API routes لسه شغالة.

5. **انشر وراء Cloudflare Tunnel.** أنا بستخدم [Cloudflare Tunnels](/blogs/cloudflared-tunnel-full-guide) عشان أوصل التطبيقات اللي بستضيفها بنفسي، والـ streaming بتاع App Router بيشتغل معاه تمام. مفيش مشاكل مع WebSocket أو SSE.

الفكرة الأساسية: دول مش systems متنافسة. دول أدوات متكاملة في نفس الـ framework. استراتيجية "استخدم الاتنين" مش compromise — ده شغل عادي.

## أخطاء App Router الشائعة اللي بشوفها (مع الحلول)

### الخطأ 1: إضافة `"use client"` لكل حاجة

بشوفه باستمرار. developer جديد على App Router بيتوه من serialization error، بيضيف `"use client"` على الـ page component الرئيسي، وفجأة بيكون لغى كل فوائد Server Components.

**الحل:** بس ضيف `"use client"` لما فعلاً تحتاج interactivity على الـ browser — `onClick`, `useState`, `useEffect`, event listeners. لو الـ component بس بيعمل render لـ data، لازم يبقى Server Component.

```tsx
// ❌ غلط: تخلي الـ page كلها client component
'use client';
export default function Page() {
  const [items, setItems] = useState([]);
  // ...
}

// ✅ صح: Server Component مع client island صغيرة
export default async function Page() {
  const items = await getItems();
  return <ItemList items={items} />;
}
```

### الخطأ 2: مش فاهم سلوك الـ Caching

App Router بيعمل cache لـ `fetch` calls بشكل افتراضي في الـ production. ده ممتاز للأداء بس كارثي لل debugging لما تكون متوقع بيانات جديدة في كل طلب.

**الحل:** كون واضح بخصوص الـ caching:

```tsx
// بيتعمله cache بشكل افتراضي (كويس للمحتوى الثابت)
const data = await fetch('https://api.example.com/posts');

// من غير cache (كويس للبيانات في الوقت الحقيقي)
const data = await fetch('https://api.example.com/live-stats', {
  cache: 'no-store',
});

// يعمل revalidate كل 60 ثانية (كويس للمحتوى شبه الديناميكي)
const data = await fetch('https://api.example.com/trending', {
  next: { revalidate: 60 },
});
```

### الخطأ 3: نسيان إن الـ Props لازم تكون Serializable

مش تقدر تبعت functions، class instances، أو React elements من Server Components لـ Client Components. لازم تت serialize عبر الحد الفاصل.

**الحل:** عيد هيكلة تدفق البيانات:

```tsx
// ❌ ده هيعمل crash
<ClientComponent onClick={() => console.log('hi')} />

// ✅ استخدم Server Actions بدل كده
<form action={handleSubmit}>...</form>
```

### الخطأ 4: مش بتستخدم `loading.tsx` و `error.tsx`

App Router بيدك `loading.tsx`, `error.tsx`, و `not-found.tsx` لكل route segment. مش بتستخدمهم يعني بتفوّت على UX improvements مجانية.

**الحل:** دايماً اعمل `loading.tsx` على الأقل للـ routes اللي بتجيب بيانات. بيخلي تطبيقك يحسّن الـ feel وبيمنع ظهور محتوى من غير styling.

### الخطأ 5: الـ Over-Nesting في الـ Layouts

بس لأنك *تقدر* تعمل nest لـ 5 مستويات من layouts مش معناه إنك *لازم* تعمل كده. شفت route groups متnested لدرجة إن هيكل الملفات بقى أصعب في التنقل من الـ UI نفسه.

**الحل:** استخدم route groups `(folder)` للتنظيم من غير ما تضيف URL segments، وخلي الـ nesting لـ 2-3 مستويات كحد أقصى إلا لو عندك information architecture معقدة فعلاً.

## إطار القرار: Flowchart بسيط

لما حد يسألني "أنهي router أستخدم؟"، بمر على الـ checklist دي في دماغي:

**استخدم App Router لو:**
- بتبدأ مشروع جديد (الاختيار الافتراضي في 2026)
- تطبيقك فيه UI layouts معقدة و nested
- عايز streaming SSR أو partial prerendering
- ببني موقع content-heavy (بلوج، docs، marketing)
- عايز تستخدم Server Actions للـ mutations
- الأداء (خصوصاً حجم JavaScript bundle) مهم
- فريقك عنده وقت يتعلم الـ patterns الجديدة

**استخدم Pages Router لو:**
- عندك تطبيق Pages Router موجود ومستقر وشغال
- فريقك تحت deadline ضيقة وفاهم Pages Router كويس
- تطبيقك interactive بشكل أساسي على الـ client (زي SPA)
- بتستخدم libraries مش بتدعم Server Components لسه
- بتعمل migration بشكل تدريجي وملحقتش توصل للـ migration لسه

**استخدم الاتنين لو:**
- بتعمل migration من Pages لـ App Router
- عندك تطبيق Pages Router مستقر بس عايز تبني features جديدة في App Router
- محتاج patterns معينة من Pages Router (أنماط API routes معينة، middleware مخصص)

الخلاصة: في 2026، App Router هو الاختيار الافتراضي الصح للمشاريع الجديدة. بس Pages Router مش مات، وادّعاء العكس مش بيفيد حد. اختار الأداة اللي تناسب الـ context بتاعك، مش اللي ترند على Twitter.

## اقرأ أيضاً

لو بتغوص في عالم الـ self-hosting وتحسين تطبيقات Next.js، البوستات دي من البلوج بتاعي بتغطي الـ infrastructure side:

- [استضف بلوج Next.js بتاعك على Dokploy](/blogs/self-host-nextjs-blog-on-dokploy) — ازاي نقلت بلوجي من Vercel لـ server بتاعي
- [دليل Cloudflare Tunnel الكامل](/blogs/cloudflared-tunnel-full-guide) — ازاي توصل التطبيقات المستضافة ذاتياً بأمان من غير ما تفتح ports
- [إتقان استضافة PostgreSQL على Dokploy VPS](/blogs/master-postgresql-self-hosting-guide-dokploy-vps) — شغّل الـ database بتاعك جنب تطبيقاتك
- [الاتصال بـ PostgreSQL اللي شغال جوه Docker](/blogs/connecting-to-postgresql-running-inside-docker) — إعداد الـ network اللي فعلاً بيشتغل
- [ليه سيبت الـ Database وعملت Static Site](/blogs/why-i-ditched-database-for-static-site) — امتى تشيل الـ backend يكون هو القرار الصح

Happy routing. ولو لسه على Pages Router في 2027، برضو تمام — تطبيقك لسه شغال، وده اللي يهم.
