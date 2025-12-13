export const tootaArtProject = {
  basicInfo: {
    titleEn: "Toota Art Portfolio",
    titleAr: "معرض توته للفنون",
    slug: "toota-art",
  },
  shortDescription: {
    en: "A performance-first digital gallery for visual artists, built with the TALL stack (Laravel 12, Livewire 3, Tailwind) and Cloudflare R2. Features a zero-egress media pipeline, automated backups, and a bilingual interface.",
    ar: "معرض رقمي يركز على الأداء للفنانين البصريين، مبني باستخدام مكدس TALL (Laravel 12, Livewire 3, Tailwind) وCloudflare R2. يتميز بخط أنابيب وسائط بدون رسوم نقل بيانات، ونسخ احتياطي آلي، وواجهة ثنائية اللغة.",
  },
  caseStudy: {
    en: `# Case Study: Toota Art Portfolio
**A Performance-First Digital Gallery for Visual Artists**

> **Role:** Full-Stack Developer
> **Tech Stack:** Laravel 12, Livewire 3, Alpine.js, Tailwind CSS, PostgreSQL, Cloudflare R2
> **Live Demo:** [toota-art.ahmedlotfy.site](https://toota-art.ahmedlotfy.site)

---

## The Challenge
Professional artists need more than just a storage folder for their work; they need a high-performance stage. The challenge was to build a portfolio that handles **high-resolution artwork** seamlessly without sacrificing speed, while providing a fully **bilingual experience** (English & Arabic) to cater to a diverse audience—all manageable by a non-technical user.

## 1. Technical Architecture
I chose the **TALL Stack (Tailwind, Alpine, Laravel, Livewire)** to deliver the speed of a Single Page App (SPA) with the SEO reliability of a traditional backend.
*   **Frontend logic on the Server:** Using **Livewire 3** allowed me to build complex, interactive interfaces (like the drag-and-drop uploader and real-time backup dashboard) entirely in PHP, reducing the JavaScript bundle size significantly.
*   **Database:** **PostgreSQL 13+** for structured data with advanced features, coupled with **Cloudflare R2** for object storage.
*   **Deployment:** Deployed on **Dokploy** using a custom Dockerfile with FrankenPHP, ensuring \`pg_dump\` binary availability for production backups.
*   **Smart Caching:** Implemented aggressive caching strategies for gallery pages to ensure instant load times even with heavy asset loads.

## 2. Solving Real Problems

### 🚀 Optimizing Heavy Art Assets (The "R2" Strategy)
Artists upload huge, unoptimized files. Serving these directly would kill performance and mobile data.
*   **The Solution:** I integrated **Cloudflare R2** for zero-egress object storage.
*   **The Logic:** Instead of just storing files, I built an upload pipeline that automatically converts images to **WebP** and generates responsive sizes on the fly. This ensures a 10MB upload is served as a crisply optimized 150KB image to the user, ensuring the site feels "blazing fast" globally.

### 🛡️ Data Sovereignty & Disaster Recovery
A common fear for content creators is platform lock-in or data loss.
*   **The Solution:** I engineered a comprehensive **Backup & Export Center** with multi-layered redundancy.
*   **The Logic:** I leveraged \`spatie/laravel-backup\` for robust database snapshots but extended it with custom services:
    *   **MediaArchiver Service**: Downloads thousands of project images from R2 and organizes them into a clean ZIP structure (folders named by "Project Title"), making the data human-readable offline.
    *   **DataExportService**: Generates structured JSON exports of all content (projects, categories, testimonials) for portability.
    *   **PostgreSQL Dump Integration**: Custom dumper with intelligent \`pg_dump\` binary detection that works across Docker, Dokploy, and Nixpacks environments.
    *   **Cloud Backup History**: Real-time dashboard displaying all R2 backups with size, date, and one-click download/delete functionality.
    *   **Automated Scheduler**: Configurable frequency (Daily/Weekly/Monthly) with smart retention policies (keep daily for 16 days, weekly for 8 weeks, monthly for 4 months, yearly for 2 years).
    *   **Dual-Destination Strategy**: Backups stored on both local disk and Cloudflare R2 bucket for geographic redundancy.
    *   **Temporary Signed URLs**: Security-first approach using 5-minute expiring download links for sensitive backup files.

Combined with email notifications for backup success/failure and automatic storage cleanup at 5GB threshold, the artist has total peace of mind without manual intervention.

### 🔐 Zero-Compromise Security
Unlike typical social platforms, this is a dedicated professional portfolio.
*   **The Fix:** I completely **disabled public registration** to prevent spam and unauthorized access.
*   **Access Control:** I implemented a strict **Google OAuth** flow specifically for the artist. This separates the "public viewing" experience from the "private management" implementation, ensuring the dashboard is impenetrable to standard brute-force attacks.

## 3. Key Features
*   **True RTL Support:** A fully localized interface where layouts, typography, and navigation automatically flip for Arabic users, ensuring the site feels native in both languages.
*   **Live Admin Dashboard:** A custom-built control panel allowing the artist to manage projects, toggle "Featured" status, and rearrange categories in real-time without touching a line of code.
*   **Automated SEO:** Integrated \`spatie/laravel-sitemap\` to auto-generate sitemaps daily, ensuring every new artwork is instantly indexed by Google without manual submission.
*   **One-Click Resilience:** Instant dashboard actions to download full SQL dumps, JSON data exports, or complete media archives.

## 4. What I Learned
Targeting an artistic audience required a different mindset than standard e-commerce. I learned:
*   **Object Storage Integration:** Mastering Cloudflare R2 APIs for cost-effective, high-performance media delivery.
*   **Advanced Livewire Patterns:** Building complex, drag-and-drop file uploaders and real-time filters purely in PHP/Livewire.
*   **Reliability Engineering:** Implementing automated cron-job scheduling for cloud backups and managing retention policies programmatically.
*   **SEO Automation:** Operationalizing \`spatie/laravel-sitemap\` to ensure every new artwork is instantly indexable by Google.
`,
    ar: `# دراسة حالة: معرض توته للفنون
**معرض رقمي يركز على الأداء للفنانين البصريين**

> **الدور:** مطور واجهة كاملة (Full-Stack Developer)
> **التقنيات المستخدمة:** Laravel 12, Livewire 3, Alpine.js, Tailwind CSS, PostgreSQL, Cloudflare R2
> **المعاينة الحية:** [toota-art.ahmedlotfy.site](https://toota-art.ahmedlotfy.site)

---

## التحدي
يحتاج الفنانون المحترفون إلى أكثر من مجرد مجلد تخزين لأعمالهم؛ فهم بحاجة إلى مسرح عالي الأداء. كان التحدي يتمثل في بناء معرض يتعامل مع **الأعمال الفنية عالية الدقة** بسلاسة دون التضحية بالسرعة، مع توفير **تجربة ثنائية اللغة بالكامل** (الإنجليزية والعربية) لتلبية احتياجات جمهور متنوع - وكل ذلك يمكن إدارته من قبل مستخدم غير تقني.

## 1. الهيكلية التقنية
اخترت **مكدس TALL (Tailwind, Alpine, Laravel, Livewire)** لتقديم سرعة تطبيقات الصفحة الواحدة (SPA) مع موثوقية تحسين محركات البحث للواجهة الخلفية التقليدية.
*   **منطق الواجهة الأمامية على الخادم:** استخدام **Livewire 3** سمح لي ببناء واجهات تفاعلية معقدة (مثل رافع الملفات بالسحب والإفلات ولوحة تحكم النسخ الاحتياطي في الوقت الفعلي) بالكامل بلغة PHP، مما قلل حجم حزمة JavaScript بشكل كبير.
*   **قاعدة البيانات:** **PostgreSQL 13+** للبيانات المنظمة مع ميزات متقدمة، مقترنة بـ **Cloudflare R2** لتخزين الكائنات.
*   **النشر:** تم النشر على **Dokploy** باستخدام Dockerfile مخصص مع FrankenPHP، مما يضمن توفر ملف \`pg_dump\` الثنائي للنسخ الاحتياطية في الإنتاج.
*   **التخزين المؤقت الذكي:** تطبيق استراتيجيات تخزين مؤقت قوية لصفحات المعرض لضمان أوقات تحميل فورية حتى مع أحمال الصور الثقيلة.

## 2. حل مشاكل حقيقية

### 🚀 تحسين أصول الفن الثقيلة (استراتيجية "R2")
يقوم الفنانون برفع ملفات ضخمة وغير محسنة. تقديم هذه الملفات مباشرة سيقتل الأداء ويستهلك بيانات الهاتف.
*   **الحل:** قمت بدمج **Cloudflare R2** لتخزين الكائنات بدون رسوم نقل بيانات.
*   **المنطق:** بدلاً من مجرد تخزين الملفات، قمت ببناء خط أنابيب رفع يحول الصور تلقائياً إلى **WebP** ويولد أحجاماً متجاوبة فورياً. هذا يضمن تقديم ملف حجمه 10 ميجابايت كصورة محسنة بدقة حجمها 150 كيلوبايت للمستخدم، مما يضمن أن الموقع يبدو "سريعاً جداً" عالمياً.

### 🛡️ سيادة البيانات والتعافي من الكوارث
الخوف الشائع لمنشئي المحتوى هو الارتهان للمنصة أو فقدان البيانات.
*   **الحل:** قمت بهندسة **مركز نسخ احتياطي وتصدير** شامل مع تكرار متعدد الطبقات.
*   **المنطق:** استفدت من \`spatie/laravel-backup\` لقطات قاعدة بيانات قوية ولكن قمت بتوسيعها بخدمات مخصصة:
    *   **خدمة MediaArchiver**: تقوم بتنزيل آلاف صور المشاريع من R2 وتنظيمها في هيكل ZIP نظيف (مجلدات مسماة بـ "عنوان المشروع")، مما يجعل البيانات قابلة للقراءة بشرياً دون اتصال بالإنترنت.
    *   **خدمة DataExportService**: تولد تصديرات JSON منظمة لجميع المحتويات (المشاريع، الفئات، الشهادات) للنقل.
    *   **دمج تفريغ PostgreSQL**: أداة تفريغ مخصصة مع كشف ذكي لثنائي \`pg_dump\` يعمل عبر بيئات Docker و Dokploy و Nixpacks.
    *   **تاريخ النسخ الاحتياطي السحابي**: لوحة تحكم في الوقت الفعلي تعرض جميع نسخ R2 الاحتياطية مع الحجم والتاريخ ووظيفة التنزيل/الحذف بنقرة واحدة.
    *   **المجدول الآلي**: تردد قابل للتكوين (يومي/أسبوعي/شهري) مع سياسات احتفاظ ذكية (الاحتفاظ باليومي لمدة 16 يوماً، والأسبوعي لمدة 8 أسابيع، والشهري لمدة 4 أشهر، والسنوي لمدة عامين).
    *   **استراتيجية الوجهة المزدوجة**: يتم تخزين النسخ الاحتياطية على كل من القرص المحلي ودلو Cloudflare R2 للتكرار الجغرافي.
    *   **عناوين URL الموقعة المؤقتة**: نهج يعطي الأولوية للأمان باستخدام روابط تنزيل تنتهي صلاحيتها خلال 5 دقائق لملفات النسخ الاحتياطي الحساسة.

بالإضافة إلى إشعارات البريد الإلكتروني لنجاح/فشل النسخ الاحتياطي وتنظيف التخزين التلقائي عند عتبة 5 جيجابايت، يتمتع الفنان بسلام تام دون تدخل يدوي.

### 🔐 أمان بلا مساومة
على عكس المنصات الاجتماعية التقليدية، هذا معرض أعمال احترافي مخصص.
*   **الإصلاح:** قمت **بتعطيل التسجيل العام** تماماً لمنع البريد العشوائي والوصول غير المصرح به.
*   **التحكم في الوصول:** نفذت تدفق **Google OAuth** صارم مخصص للفنان. هذا يفصل تجربة "المشاهدة العامة" عن تنفيذ "الإدارة الخاصة"، مما يضمن أن لوحة التحكم محصنة ضد هجمات القوة الغاشمة القياسية.

## 3. المميزات الرئيسية
*   **دعم حقيقي للغة العربية (RTL):** واجهة معربة بالكامل حيث تنقلب التخطيطات والخطوط والتنقل تلقائياً للمستخدمين العرب، مما يضمن أن الموقع يبدو أصلياً في كلتا اللغتين.
*   **لوحة تحكم المشرف المباشرة:** لوحة تحكم مبنية خصيصاً تسمح للفنان بإدارة المشاريع، وتبديل حالة "مميز"، وإعادة ترتيب الفئات في الوقت الفعلي دون لمس سطر من الكود.
*   **سيو (SEO) مؤتمت:** دمج \`spatie/laravel-sitemap\` لتوليد خرائط الموقع تلقائياً يومياً، مما يضمن أرشفة كل عمل فني جديد فوراً بواسطة Google دون تقديم يدوي.
*   **مرونة بنقرة واحدة:** إجراءات لوحة تحكم فورية لتنزيل تفريغ SQL كامل، أو تصديرات بيانات JSON، أو أرشيفات وسائط كاملة.

## 4. ماذا تعلمت
استهداف جمهور فني تطلب عقلية مختلفة عن التجارة الإلكترونية القياسية. تعلمت:
*   **دمج تخزين الكائنات:** إتقان واجهات برمجة تطبيقات (APIs) لـ Cloudflare R2 لتقديم وسائط عالية الأداء وفعالة من حيث التكلفة.
*   **أنماط Livewire المتقدمة:** بناء رافعات ملفات معقدة بالسحب والإفلات وفلاتر في الوقت الفعلي بـ PHP/Livewire فقط.
*   **هندسة الموثوقية:** تنفيذ جدولة آلية لمهام cron للنسخ الاحتياطي السحابي وإدارة سياسات الاحتفاظ برمجياً.
*   **أتمتة السيو (SEO):** تفعيل \`spatie/laravel-sitemap\` لضمان فهرسة كل عمل فني جديد فوراً بواسطة Google.
`,
  },
  mediaMetadata: {
    categories: ["Laravel", "Livewire", "Alpine.js", "Tailwind CSS", "PostgreSQL", "Cloudflare R2"],
    published: true,
    repoLink: "https://github.com/ahmed-lotfy-dev/toota-portfolio",
    liveLink: "https://toota-art.ahmedlotfy.site",
    coverImage: "https://images.ahmedlotfy.site/projects/Projects-screencapture-toota-art-ahmedlotfy-site-2025-12-01-21_53_25%20(Edited)-1765597181426.webp",
  },
  displayOrder: 6,
};
