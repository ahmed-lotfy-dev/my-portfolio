export const zamalekStoreProject = [{
  title_en: "Zamalek Store",
  title_ar: "متجر الزمالك",
  slug: "zamalek-store",
  desc_en: "A production-ready, bilingual e-commerce platform for Egyptian football fans. Built with Next.js 16, React 19, and Paymob/Kashier integration. Features a hybrid cart system, BullMQ background processing, and optimal mobile performance via Cloudflare R2.",
  desc_ar: "منصة تجارة إلكترونية احترافي ثنائية اللغة لمشجعي الكرة المصرية. مبنية بـ Next.js 16 و React 19 مع دمج بوابات دفع محلية. تتميز بنظام سلة هجين، معالجة خلفية بـ BullMQ، وأداء مثالي للموبايل عبر Cloudflare R2.",
  content_en: `# Case Study: Zamalek Store
**Production-Ready Bilingual E-Commerce Platform for the Egyptian Market**

> **Role:** Full-Stack Developer
> **Stack:** Next.js 16, React 19, TypeScript, PostgreSQL, Prisma, Redis, BullMQ, Docker
> **Payments:** Paymob, Kashier, Stripe
> **Live:** [zamalek-store.ahmedlotfy.site](https://zamalek-store.ahmedlotfy.site)

Building an e-commerce platform for the Egyptian market meant solving three critical challenges: **true RTL/LTR bilingual support**, **reliable local payment gateway integration**, and **high performance on mobile networks** with large product images.

## Technical Architecture
Chose **Next.js App Router** to leverage React Server Components for fast initial loads and reduced client bundles, moving heavy logic server-side.

### Database Design
*   **PostgreSQL with Prisma:** 15 relational models covering products, variants, orders, carts, coupons, reviews, and users.
*   **Bilingual at Schema Level:** \`name_ar\`, \`name_en\` fields instead of fragile JSON blobs.
*   **Fully Versioned:** All changes tracked via Prisma migrations.

### Hybrid Cart System
*   **Guests:** Cart in localStorage for instant interaction.
*   **Authenticated:** Cart synced to database.
*   **Automatic Merge:** No lost items when switching devices or logging in.
*   **Resilient:** Survives refreshes, logouts, and device changes.

### Background Processing
Implemented **BullMQ with Redis** to keep checkout fast:
*   Order confirmation emails sent asynchronously.
*   Automatic retries with exponential backoff.
*   Isolated worker process separate from web server.
*   Checkout stays instant even under load.

## Key Solutions

### Payment Security
Local gateways like Paymob require strict validation to prevent fraud and duplicate processing:
*   **HMAC signature verification:** Every webhook validated for authenticity.
*   **Idempotency checks:** Prevent duplicate order processing if gateways send webhooks multiple times.
*   **Centralized validation logic:** Auditable and secure payment flow.
Financial operations stay reliable even when gateways behave inconsistently.

### Image Optimization
High-resolution product images would kill performance on mobile networks. I built a client-side optimization pipeline:
*   Store on **Cloudflare R2** for zero egress fees.
*   Resize and compress to **WebP** in browser before upload.
*   Reduced image size from ~5MB to ~200KB.
*   Faster uploads, lower bandwidth costs, instant product pages.

### Component Architecture
Used **Shadcn UI** with **Radix primitives** instead of heavy UI frameworks:
*   **Full Ownership:** Components live in codebase, fully customizable.
*   **Zero Bloat:** No unused components in bundle.
*   **Built-in Accessibility:** Keyboard navigation, focus control, ARIA attributes.
*   **Strong TypeScript Support.**

## Engineering Decisions

### Decimal Serialization
Prisma decimals can't be passed to client components. Built a data-boundary layer that converts decimals before reaching client while preserving backend precision.

### Centralized Middleware
*   Locale detection.
*   Admin route protection.
*   Authentication checks.
All in one place to reduce duplication and simplify debugging.

### URL-Driven Search
Filters, search, and sorting in URL parameters with debounced updates. Fully shareable product URLs for better UX.

## Features
*   Full RTL/LTR layout support.
*   Comprehensive admin dashboard for products, orders, and analytics.
*   Product variants with stock tracking.
*   Flexible coupons and discounts system.
*   Reviews and ratings.
*   Wishlist with one-click add to cart.
*   Dockerized production deployment.

## What This Demonstrates
*   Secure handling of real payment systems with strict validation.
*   Production-level state management across guest and authenticated flows.
*   Server-first architecture for optimal performance.
*   Performance optimization under real-world constraints.
*   Clean separation of concerns across the entire stack.

This goes beyond CRUD—it reflects real engineering decisions, trade-offs, and scalability concerns for a production system.

## Production Scale
*   **15** Database Models
*   **30+** API Endpoints
*   **50+** Reusable Components
*   **2** Languages (Arabic/English)
*   **3** Payment Gateways
*   **Background Workers** with Redis
*   **Docker-ready** deployment
`,
  content_ar: `# دراسة حالة: متجر الزمالك
**منصة تجارة إلكترونية جاهزة للإنتاج للسوق المصري**

> **الدور:** مطور واجهة كاملة (Full-Stack Developer)
> **التقنيات:** Next.js 16, React 19, TypeScript, PostgreSQL, Prisma, Redis, BullMQ, Docker
> **المدفوعات:** Paymob, Kashier, Stripe
> **المعاينة الحية:** [zamalek-store.ahmedlotfy.site](https://zamalek-store.ahmedlotfy.site)

بناء منصة تجارة إلكترونية للسوق المصري كان يتطلب حل ثلاث تحديات حاسمة: **دعم ثنائي اللغة الحقيقي (RTL/LTR)**، **تكامل موثوق لبوابات الدفع المحلية**، و **أداء عالي على شبكات الهاتف** مع صور منتجات كبيرة.

## الهيكلية التقنية
اخترت **Next.js App Router** للاستفادة من React Server Components للتحميل الأولي السريع وتقليل حزم العميل، ونقل المنطق الثقيل إلى الخادم.

### تصميم قاعدة البيانات
*   **PostgreSQL مع Prisma:** 15 نموذجاً علائقياً تغطي المنتجات، المتغيرات، الطلبات، السلة، الكوبونات، المراجعات، والمستخدمين.
*   **ثنائية اللغة في المخطط:** حقول \`name_ar\` و \`name_en\` بدلاً من كائنات JSON الهشة.
*   **إصدارات كاملة:** تتبع جميع التغييرات عبر ترحيلات Prisma.

### نظام السلة الهجين
*   **الزوار:** السلة في \`localStorage\` للتفاعل الفوري.
*   **المسجلون:** مزامنة السلة مع قاعدة البيانات.
*   **الدمج التلقائي:** لا ضياع للعناصر عند تغيير الجهاز أو تسجيل الدخول.
*   **مرونة:** تنجو من التحديث، تسجيل الخروج، وتغيير الأجهزة.

### المعالجة الخلفية
نفذت **BullMQ مع Redis** للحفاظ على سرعة الدفع:
*   إرسال رسائل تأكيد البريد الإلكتروني بشكل غير متزامن.
*   إعادة المحاولة التلقائية مع تراجع أسي (Exponential Backoff).
*   عملية عامل (Worker) معزولة ومنفصلة عن خادم الويب.
*   عملية الدفع تظل فورية حتى تحت الضغط.

## حلول رئيسية

### أمان المدفوعات
تتطلب البوابات المحلية مثل Paymob تحققاً صارماً لمنع الاحتيال والمعالجة المزدوجة:
*   **التحقق من توقيع HMAC:** التحقق من صحة كل Webhook.
*   **فحوصات التكرار (Idempotency):** منع تكرار معالجة الطلب إذا أرسلت البوابة الإشعار أكثر من مرة.
*   **منطق تحقق مركزي:** تدفق دفع آمن وقابل للتدقيق.
تظل العمليات المالية موثوقة حتى عندما تتصرف البوابات بشكل غير متسق.

### تحسين الصور
صور المنتجات عالية الدقة تقتل الأداء على شبكات الهاتف. قمت ببناء خط أنابيب تحسين من جانب العميل:
*   التخزين على **Cloudflare R2** لعدم وجود رسوم نقل بيانات.
*   تغيير الحجم والضغط إلى **WebP** في المتصفح قبل الرفع.
*   تقليل حجم الصورة من ~5 ميجابايت إلى ~200 كيلوبايت.
*   رفع أسرع، تكلفة أقل، وصفحات منتجات فورية.

### هندسة المكونات
استخدمت **Shadcn UI** مع **Radix primitives** بدلاً من أطر العمل الثقيلة:
*   **ملكية كاملة:** المكونات تعيش في الكود، قابلة للتخصيص بالكامل.
*   **صفر تضخم (Zero Bloat):** لا مكونات غير مستخدمة في الحزمة.
*   **إمكانية الوصول المدمجة:** تنقل بلوحة المفاتيح، تحكم بالتركيز، وسمات ARIA.
*   **دعم TypeScript قوي.**

## قرارات هندسية

### تسلسل الأرقام العشرية (Decimal Serialization)
لا يمكن تمرير أرقام Prisma العشرية لمكونات العميل. بنيت طبقة حدود بيانات تحول الأرقام قبل وصولها للعميل مع الحفاظ على الدقة في الخلفية.

### البرمجيات الوسيطة المركزية (Middleware)
*   كشف اللغة.
*   حماية مسارات المسؤول.
*   فحوصات المصادقة.
كلها في مكان واحد لتقليل التكرار وتسهيل التصحيح.

### بحث مدفوع بالرابط (URL-Driven)
الفلاتر، البحث، والترتيب في معلمات URL مع تحديثات (Debounced). روابط منتجات قابلة للمشاركة بالكامل لتجربة مستخدم أفضل.

## المميزات
*   دعم تخطيط كامل RTL/LTR.
*   لوحة تحكم إدارية شاملة للمنتجات، الطلبات، والتحليلات.
*   متغيرات المنتج مع تتبع المخزون.
*   نظام مرن للكوبونات والخصومات.
*   مراجعات وتقييمات.
*   قائمة رغبات مع إضافة للسلة بنقرة واحدة.
*   نشر إنتاج Dockerized.

## ماذا يثبت هذا المشروع
*   تعامل آمن مع أنظمة الدفع الحقيقية بتحقق صارم.
*   إدارة حالة بمستوى الإنتاج عبر تدفقات الزوار والمسجلين.
*   هندسة الخادم أولاً (Server-first) للأداء الأمثل.
*   تحسين الأداء تحت قيود العالم الحقيقي.
*   فصل نظيف للاهتمامات عبر المكدس بالكامل.

هذا يتجاوز تطبيقات CRUD—إنه يعكس قرارات هندسية حقيقية، ومفاضلات، ومخاوف قابلية التوسع لنظام إنتاج.

## مقاييس الإنتاج
*   **15** نموذج قاعدة بيانات
*   **30+** نقطة API
*   **50+** مكون قابل لإعادة الاستخدام
*   **2** لغة (عربي / إنجليزي)
*   **3** بوابات دفع
*   **عمال خلفية** مع Redis
*   نشر **جاهز لـ Docker**
*   تنفيذ **أتمتة السيو (SEO)** لضمان اكتشاف المحتوى فورياً.
`,
  categories: [
    "Next.js 16",
    "React 19",
    "TypeScript",
    "Tailwind CSS",
    "PostgreSQL",
    "Prisma",
    "Redis",
    "BullMQ",
    "Docker",
    "Paymob",
    "Kashier",
    "Stripe",
    "Cloudflare R2",
  ],
  published: true,
  repoLink: "https://github.com/ahmed-lotfy-dev/zamalek-store",
  liveLink: "https://zamalek-store.ahmedlotfy.site",
  coverImage: "https://images.ahmedlotfy.site/projects/screencapture-zamalek-store-ahmedlotfy-site-en-2025-12-06-20_06_48-1765597020942.webp",
  displayOrder: 7,
}]