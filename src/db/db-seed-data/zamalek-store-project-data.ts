export const zamalekStoreProject = {
  basicInfo: {
    titleEn: "Zamalek Store",
    titleAr: "متجر الزمالك",
    slug: "zamalek-store",
  },
  shortDescription: {
    en: "A modern, bilingual e-commerce platform for Zamalek SC merchandise, built with Next.js 15 and specialized for the Egyptian market with local payments and optimization.",
    ar: "متجر إلكتروني حديث وثنائي اللغة لمنتجات نادي الزمالك، مبني باستخدام Next.js 15 ومصمم خصيصاً للسوق المصري مع دعم كامل للمدفوعات المحلية وتحسين الأداء.",
  },
  caseStudy: {
    en: `# Case Study: Zamalek Store
**Building a Bilingual E-Commerce Platform for the Egyptian Market**

> **Role:** Full-Stack Developer
> **Tech Stack:** Next.js 15, React 19, TypeScript, PostgreSQL, Prisma, Paymob/Kashier
> **Live Demo:** [zamalek-store.ahmedlotfy.site](https://zamalek-store.ahmedlotfy.site)

---

## The Challenge
Building an e-commerce store for **Zamalek SC** fans meant more than just listing products. I needed to solve three specific challenges relevant to the Egyptian market:
1. **Localization:** It had to work seamlessly in both Arabic (RTL) and English (LTR).
2. **Local Payments:** It needed to accept local payments (Paymob & Kashier) reliably.
3. **Performance:** Merchandise photos are heavy, but the site needed to load fast on mobile data.

## 1. Technical Architecture
I chose **Next.js 15 (App Router)** because it allows me to move heavy logic to the server.
*   **Database:** Used **PostgreSQL** with **Prisma ORM**. I designed the schema to handle bilingual data natively (e.g., \`name_ar\` and \`name_en\` columns) so I don't rely on fragile JSON files for product data.
*   **State Management:** I built a **hybrid cart system**. Guest users store items in \`localStorage\` for speed. When they log in, I automatically merge their local items with their database cart, ensuring no "lost" items during signup.

## 2. Solving Real Problems

### 💳 The Payment Integration Struggle
Integrating Egyptian gateways like Paymob was the hardest part. The documentation can be tricky, and webhooks sometimes fail.
*   **The Fix:** I implemented **HMAC Signature Verification**. Every time the payment gateway sends a webhook saying "Payment Success," my server cryptographically checks the signature to ensure it's actually from Paymob and not a hacker.
*   **Double-Check:** I also added a check to ensure we don't process the same order twice if the webhook is sent multiple times (Idempotency).

### 🚀 Optimizing Images (The "R2" Strategy)
Storing thousands of high-res jersey photos on the main server would be too expensive and slow.
*   **My Solution:** I used **Cloudflare R2** (cheaper than AWS S3).
*   **The Trick:** Instead of uploading heavy 5MB images directly, I use a browser script to resize and compress them to **WebP** format *before* they leave the user's device. This reduces a 5MB image to ~200KB, saving huge amounts of bandwidth and making uploads instant.

## 3. Key Features
*   **True RTL Support:** The entire layout flips automatically based on the language. I used Tailwind's logical properties (like \`ms-2\` instead of \`ml-2\`) so margins and padding automatically respect the direction.
*   **Admin Dashboard:** I built a custom dashboard where store managers can upload products, track orders, and generate sales reports.
*   **Real-time Email:** Using a background worker (BullMQ) to send order confirmation emails without slowing down the checkout response.

### ⚡ The HeroUI v3 Migration (Bundle Size Optimization)
When building for production, I noticed the bundle size was larger than necessary. The issue? I was importing components from the monolithic \`@heroui/react\` package.
*   **The Problem:** Importing from \`@heroui/react\` pulls in the entire component library, even if you only use a few components. This hurts performance, especially on mobile connections.
*   **The Solution:** HeroUI v3 uses a **modular package architecture**. Instead of \`import { Button, Input } from '@heroui/react'\`, I now import each component from its specific package: \`@heroui/button\`, \`@heroui/input\`, \`@heroui/card\`.
*   **The Result:** Webpack can now tree-shake unused components, reducing the bundle size. Only the components I actually use get shipped to the browser.
*   **Bonus:** The v3 API also uses cleaner patterns, like \`onValueChange\` instead of \`onChange\` for form inputs, which gives you the value directly instead of a synthetic event object.

## 4. The Thinking Process: Technical Deep Dives

### 🔢 Solving the "Decimal" Problem
One of the trickiest bugs I encountered was passing pricing data from the server (Prisma) to the client (React).
*   **The Issue:** Prisma uses a custom \`Decimal\` type for precision. Next.js Server Components can read this, but when passing it to a Client Component, React fails to serialize it because it's not a native JSON type.
*   **The Fix:** I created a utility to transform data at the boundary. Before passing any product object to a client component, the \`price\` field is converted to a plain number or string. This ensures the frontend gets clean, usable data without losing the precision usage on the backend.

### 🛡️ Centralized Middleware Architecture
I wanted to keep my authorization and localization logic clean, so I avoided scattering checks across every page.
*   **Proxy Pattern:** I implemented a \`proxy.ts\` module that acts as the central brain for request handling.
*   **Flow:**
    1.  **i18n First:** The middleware first resolves the locale (Arabic/English).
    2.  **Route Protection:** It then checks if the user is accessing an \`/admin\` route.
    3.  **Auth Check:** If it's an admin route, it verifies the session token *before* the request even hits the layout.
    This consolidation means I have **one single place** to debug routing logic, rather than juggling three different middleware responsibilities.

### 🔐 Why Better Auth?
I initially considered NextAuth (Auth.js) but switched to **Better Auth**.
*   **Type Safety:** Better Auth provided superior TypeScript inference out of the box.
*   **Performance:** It felt more lightweight and didn't require as much boilerplate for simple email/password and social login flows.
*   **Control:** It gave me finer control over session management, which was crucial for the "Hybrid Cart" feature where I needed to merge guest sessions with authenticated user sessions.

### 🔍 Shareable Search State
For the product listing page, I avoided local state (\`useState\`) for filters.
*   **URL-Driven State:** Instead, I pushed all search queries, category filters, and sort options directly to the URL parameters.
*   **Debouncing:** I implemented a debounced search input that updates the URL after 300ms of typing.
*   **Benefit:** This means users can share a link like \`.../products?search=jersey&sort=price_asc\` and the recipient sees *exactly* the same view. It makes the store feel much more professional and accessible.

## 5. What I Learned
This project pushed me to go beyond simple CRUD apps. I learned:
*   How to handle **real-world financial transactions** securely.
*   The complexity of **Server Actions** in Next.js 15 and how to use them for type-safe form submissions.
*   That **user experience** is in the details—like keeping the cart saved even if the user refreshes or switches devices.
`,
    ar: `# دراسة حالة: متجر الزمالك
**بناء منصة تجارة إلكترونية ثنائية اللغة للسوق المصري**

> **الدور:** مطور واجهة كاملة (Full-Stack Developer)
> **التقنيات المستخدمة:** Next.js 15, React 19, TypeScript, PostgreSQL, Prisma, Paymob/Kashier
> **المعاينة الحية:** [zamalek-store.ahmedlotfy.site](https://zamalek-store.ahmedlotfy.site)

---

## التحدي
بناء متجر إلكتروني لمشجعي **نادي الزمالك** كان يعني أكثر من مجرد عرض المنتجات. كان عليّ حل ثلاثة تحديات محددة تتعلق بالسوق المصري:
1. **التعريب (Localization):** يجب أن يعمل المتجر بسلاسة باللغتين العربية (من اليمين لليسار) والإنجليزية.
2. **المدفوعات المحلية:** قبول المدفوعات المحلية (Paymob & Kashier) بشكل موثوق.
3. **الأداء:** صور المنتجات ثقيلة، لكن الموقع يحتاج إلى سرعة تحميل عالية حتى على بيانات الهاتف.

## 1. الهيكلية التقنية
اخترت **Next.js 15 (App Router)** لأنه يسمح بنقل المنطق الثقيل إلى الخادم.
*   **قاعدة البيانات:** استخدمت **PostgreSQL** مع **Prisma ORM**. صممت المخطط للتعامل مع البيانات ثنائية اللغة محلياً (مثل أعمدة \`name_ar\` و \`name_en\`) لتجنب الاعتماد على ملفات JSON الهشة لبيانات المنتجات.
*   **إدارة الحالة:** قمت ببناء **نظام سلة هجين**. الزوار يحفظون العناصر في \`localStorage\` للسرعة. عند تسجيل الدخول، أقوم بدمج عناصرهم المحلية تلقائياً مع سلة قاعدة البيانات، لضمان عدم ضياع أي عناصر أثناء التسجيل.

## 2. حل مشاكل حقيقية

### 💳 صراع دمج بوابات الدفع
كان دمج بوابات الدفع المصرية مثل Paymob هو الجزء الأصعب. التوثيق قد يكون معقداً، والـ Webhooks تفشل أحياناً.
*   **الحل:** قمت بتنفيذ **التحقق من التوقيع (HMAC Signature Verification)**. في كل مرة ترسل فيها بوابة الدفع إشعاراً بنجاح الدفع، يقوم الخادم بالتحقق من التوقيع للتأكد من أنه قادم من Paymob فعلاً وليس من مخترق.
*   **تحقق مزدوج:** أضفت أيضاً تحققاً لضمان عدم معالجة نفس الطلب مرتين (Idempotency) إذا تم إرسال الـ Webhook عدة مرات.

### 🚀 تحسين الصور (استراتيجية R2)
تخزين آلاف الصور عالية الدقة سيكون مكلفاً وبطئياً.
*   **حلي:** استخدمت **Cloudflare R2** (أرخص من AWS S3).
*   **الحيلة:** بدلاً من رفع صور بحجم 5 ميجابايت مباشرة، أستخدم سكربت في المتصفح لتغيير حجمها وضغطها إلى صيغة **WebP** *قبل* أن تغادر جهاز المستخدم. هذا يقلل الصورة من 5 ميجابايت إلى حوالي 200 كيلوبايت، مما يوفر استهلاك الباقة وبجعل الرفع فورياً.

## 3. المميزات الرئيسية
*   **دعم حقيقي للغة العربية (RTL):** ينقلب التخطيط بالكامل تلقائياً بناءً على اللغة. استخدمت خصائص Tailwind المنطقية (مثل \`ms-2\` بدلاً من \`ml-2\`) لضمان احترام الاتجاهات تلقائياً.
*   **لوحة تحكم المشرف:** قمت ببناء لوحة تحكم مخصصة يمكن لمديري المتجر من خلالها رفع المنتجات، تتبع الطلبات، وإنشاء تقارير المبيعات.
*   **بريد إلكتروني فوري:** استخدام معالج خلفية (BullMQ) لإرسال رسائل تأكيد الطلب دون إبطاء استجابة الدفع.

### ⚡ الترحيل إلى HeroUI v3 (تحسين حجم الحزمة)
عند البناء للإنتاج، لاحظت أن حجم الحزمة كان أكبر من اللازم. السبب؟ كنت أستورد المكونات من حزمة \`@heroui/react\` الكبيرة.
*   **المشكلة:** الاستيراد من \`@heroui/react\` يسحب مكتبة المكونات بالكامل حتى لو استخدمت مكونات قليلة. هذا يضر بالأداء.
*   **الحل:** HeroUI v3 يستخدم **هيكلية حزم معيارية**. بدلاً من الاستيراد العام، أصبحت أستورد كل مكون من حزمته الخاصة.
*   **النتيجة:** يمكن لـ Webpack الآن استبعاد المكونات غير المستخدمة (tree-shake)، مما يقلل حجم الحزمة بشكل كبير.

## 4. عملية التفكير: نقاشات تقنية عميقة

### 🔢 حل مشكلة "الأرقام العشرية"
واحدة من أصعب الأخطاء كانت تمرير بيانات الأسعار من الخادم (Prisma) إلى العميل (React).
*   **المشكلة:** Prisma تستخدم نوع \`Decimal\` للدقة. مكونات الخادم تقرؤه، ولكن عند تمريره لمكون العميل، يفشل React في قراءته لأنه ليس نوع JSON أصلي.
*   **الحل:** أنشأت أداة لتحويل البيانات عند الحدود الفاصلة. قبل تمرير أي منتج، يتم تحويل حقل السعر إلى رقم عادي أو نص، لضمان وصول بيانات نظيفة للواجهة الأمامية.

### 🛡️ هندسة البرمجيات الوسيطة المركزية (Middleware)
أردت الحفاظ على نظافة منطق التحقق والتوثيق.
*   **نمط الوكيل (Proxy Pattern):** نفذت وحدة \`proxy.ts\` تعمل كعقل مدبر لمعالجة الطلبات.
*   **التدفق:** تحدد اللغة أولاً، ثم تتحقق من المسار، ثم تتحقق من صلاحيات المدير قبل الوصول للصفحة. هذا يعني مكاناً واحداً لتنقيح أخطاء التوجيه.

## 5. ماذا تعلمت
دفعني هذا المشروع لتجاوز تطبيقات CRUD البسيطة. تعلمت:
*   كيفية التعامل مع **الماملات المالية الحقيقية** بأمان.
*   تعقيد **Server Actions** في Next.js 15 وكيفية استخدامها لتقديم النماذج بأمان.
*   أن **تجربة المستخدم** تكمن في التفاصيل - مثل الحفاظ على السلة حتى لو قام المستخدم بتحديث الصفحة.
`,
  },
  mediaMetadata: {
    categories: ["React", "Next.js", "TypeScript", "Prisma", "PostgreSQL", "TailwindCSS"],
    published: true,
    repoLink: "https://github.com/ahmed-lotfy-dev/zamalek-store",
    liveLink: "https://zamalek-store.ahmedlotfy.site",
    coverImage: "https://images.ahmedlotfy.site/Projects-screencapture-zamalek-store-ahmedlotfy-site-en-2025-12-06-20_06_48-1765597020942.webp",
  },
  displayOrder: 7,
};


