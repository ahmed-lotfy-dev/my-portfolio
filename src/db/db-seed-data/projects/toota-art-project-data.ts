export const tootaArtProject = [{
  title_en: "Toota Art Portfolio",
  title_ar: "معرض توته للفنون",
  slug: "toota-art",
  desc_en: "A performance-first digital gallery for visual artists, built with the TALL stack and Cloudflare R2. Features server-side interactivity with Livewire 3, zero-egress object storage, and a comprehensive automated backup system.",
  desc_ar: "معرض رقمي يركز على الأداء للفنانين البصريين، مبني باستخدام TALL Stack و Cloudflare R2. يتميز بتفاعلية من جانب الخادم باستخدام Livewire 3، وتخزين كائنات بدون رسوم نقل، ونظام نسخ احتياطي آلي شامل.",
  content_en: `# Case Study: Toota Art Portfolio
**A Performance-First Digital Gallery for Visual Artists**

> **Role:** Full-Stack Developer
> **Stack:** Laravel 12, Livewire 3, Alpine.js, Tailwind CSS, PostgreSQL, Cloudflare R2
> **Live:** [toota-art.ahmedlotfy.site](https://toota-art.ahmedlotfy.site)

Professional artists need more than storage—they need a **high-performance stage**. This portfolio handles high-resolution artwork seamlessly while providing a fully bilingual experience (English & Arabic), all manageable by a non-technical user.

## Technical Architecture
Built with the **TALL Stack** to deliver SPA-like speed with traditional SEO reliability:

*   **Livewire 3** for server-side interactivity, reducing JavaScript bundle size.
*   **PostgreSQL 13+** for structured data with advanced features.
*   **Cloudflare R2** for zero-egress object storage.
*   **FrankenPHP on Dokploy** with custom Dockerfile for production deployment.
*   **Aggressive caching strategies** for instant gallery load times.

## Key Solutions

### Performance Optimization
Artists upload large, unoptimized files that would kill performance.
*   **Problem:** Heavy media assets slowing down the site.
*   **Solution:** I built an automated pipeline that converts uploads to **WebP** and generates responsive sizes on the fly.
*   **Result:** A 10MB upload becomes a crisp 150KB image for users—blazing fast globally with **zero egress fees**.

### Comprehensive Backup System
Content creators fear data loss and platform lock-in. I engineered a multi-layered backup center with:

*   **MediaArchiver Service:** Downloads thousands of images from R2, organized by project title.
*   **DataExportService:** Structured JSON exports of all content.
*   **PostgreSQL Dump Integration:** Smart binary detection across Docker/Dokploy/Nixpacks.
*   **Dual-Destination Strategy:** Local disk + R2 bucket for geographic redundancy.
*   **Smart Retention:** Daily (16 days), weekly (8 weeks), monthly (4 months), yearly (2 years).
*   **Automated Scheduling:** Configurable frequency with email notifications.
*   **Secure Downloads:** 5-minute expiring signed URLs for backup files.

Combined with automatic storage cleanup at 5GB threshold, the artist has complete peace of mind.

### Security First
Unlike social platforms, this is a dedicated professional portfolio.
*   **Public registration disabled** entirely.
*   **Strict Google OAuth** for the artist only.
*   Separates public viewing from private management, making the dashboard impenetrable to brute-force attacks.

## Features
*   **True RTL Support:** Fully localized interface with automatic layout flipping for Arabic.
*   **Live Admin Dashboard:** Manage projects, toggle featured status, rearrange categories in real-time.
*   **Automated SEO:** Daily sitemap generation via \`spatie/laravel-sitemap\` for instant Google indexing.
*   **One-Click Resilience:** Instant downloads of SQL dumps, JSON exports, or complete media archives.

## What I Learned
*   Mastering **Cloudflare R2 APIs** for cost-effective, high-performance media delivery.
*   Building complex **drag-and-drop uploaders** purely in PHP/Livewire.
*   Implementing **automated backup scheduling** with programmatic retention policies.
*   Operationalizing **SEO automation** for instant content discoverability.
`,
  content_ar: `# دراسة حالة: معرض توته للفنون
**معرض رقمي يركز على الأداء للفنانين البصريين**

> **الدور:** مطور واجهة كاملة (Full-Stack Developer)
> **التقنيات:** Laravel 12, Livewire 3, Alpine.js, Tailwind CSS, PostgreSQL, Cloudflare R2
> **المعاينة الحية:** [toota-art.ahmedlotfy.site](https://toota-art.ahmedlotfy.site)

يحتاج الفنانون المحترفون إلى أكثر من مجرد مساحة تخزين—هم بحاجة إلى **مسرح عالي الأداء**. هذا المعرض يتعامل مع الأعمال الفنية عالية الدقة بسلاسة تامة، مع توفير تجربة ثنائية اللغة بالكامل (الإنجليزية والعربية)، وكل ذلك قابل للإدارة من قبل مستخدم غير تقني.

## الهيكلية التقنية
تم البناء باستخدام **TALL Stack** لتقديم سرعة تشبه تطبيقات الصفحة الواحدة (SPA) مع موثوقية تحسين محركات البحث (SEO):

*   **Livewire 3** للتفاعلية من جانب الخادم، مما يقلل حجم حزمة JavaScript.
*   **PostgreSQL 13+** للبيانات المنظمة مع ميزات متقدمة.
*   **Cloudflare R2** لتخزين الكائنات بدون رسوم نقل بيانات (Zero-egress).
*   **FrankenPHP على Dokploy** مع Dockerfile مخصص لنشر الإنتاج.
*   **استراتيجيات تخزين مؤقت قوية** لضمان سرعة تحميل فورية للمعرض.

## حلول رئيسية

### تحسين الأداء
يقوم الفنانون برفع ملفات ضخمة وغير محسنة قد تقتل الأداء.
*   **المشكلة:** أصول وسائط ثقيلة تبطئ الموقع.
*   **الحل:** بنيت خط أنابيب آلي يحول التنزيلات إلى **WebP** ويولد أحجاماً متجاوبة فورياً.
*   **النتيجة:** ملف بحجم 10 ميجابايت يصبح صورة واضحة بحجم 150 كيلوبايت للمستخدمين—سرعة فائقة عالمياً **بدون رسوم نقل بيانات**.

### نظام نسخ احتياطي شامل
يخاف صناع المحتوى من فقدان البيانات أو الارتهان للمنصة. قمت بهندسة مركز نسخ احتياطي متعدد الطبقات يضم:

*   **خدمة MediaArchiver:** تنزيل آلاف الصور من R2، منظمة حسب عنوان المشروع.
*   **خدمة DataExportService:** تصدير JSON منظم لجميع المحتويات.
*   **دمج تفريغ PostgreSQL:** كشف ذكي للملفات الثنائية عبر بيئات Docker/Dokploy/Nixpacks.
*   **استراتيجية الوجهة المزدوجة:** قرص محلي + دلو R2 للتكرار الجغرافي.
*   **الاحتفاظ الذكي:** يومي (16 يوماً)، أسبوعي (8 أسابيع)، شهري (4 أشهر)، سنوي (سنتين).
*   **الجدولة الآلية:** تكرار قابل للتكوين مع إشعارات البريد الإلكتروني.
*   **تنزيلات آمنة:** روابط موقعة تنتهي صلاحيتها خلال 5 دقائق لملفات النسخ الاحتياطي.

مع التنظيف التلقائي للتخزين عند عتبة 5 جيجابايت، يتمتع الفنان بسلام تام.

### الأمن أولاً
على عكس المنصات الاجتماعية، هذا معرض احترافي مخصص.
*   **تعطيل التسجيل العام** تماماً.
*   **Google OAuth صارم** للفنان فقط.
*   يفصل المشاهدة العامة عن الإدارة الخاصة، مما يجعل لوحة التحكم محصنة ضد هجمات التخمين.

## المميزات
*   **دعم حقيقي للغة العربية (RTL):** واجهة معربة بالكامل مع قلب التخطيط تلقائياً.
*   **لوحة تحكم حية:** إدارة المشاريع، تبديل الحالة "مميز"، إعادة ترتيب الفئات في الوقت الفعلي.
*   **سيو (SEO) مؤتمت:** توليد خريطة الموقع يومياً عبر \`spatie/laravel-sitemap\` لأرشفة فورية من جوجل.
*   **مرونة بنقرة واحدة:** تنزيل فوري لتفريغ SQL، تصدير JSON، أو أرشيفات وسائط كاملة.

## ماذا تعلمت
*   تشغيل **أتمتة السيو (SEO)** لضمان اكتشاف المحتوى فورياً.
`,
  categories: ["Laravel", "Livewire", "Alpine.js", "Tailwind CSS", "PostgreSQL", "Cloudflare R2", "Docker", "Spatie"],
  published: true,
  repoLink: "https://github.com/ahmed-lotfy-dev/toota-portfolio",
  liveLink: "https://toota-art.ahmedlotfy.site",
  imageLink: "https://images.ahmedlotfy.site/projects/Projects-screencapture-toota-art-ahmedlotfy-site-2025-12-01-21_53_25%20(Edited)-1765597181426.webp",
  displayOrder: 6,
}];
