export const portfolioProjectData = [{
  "title_en": "Personal Portfolio",
  "title_ar": "المعرض الشخصي",
  "slug": "personal-portfolio",
  "desc_en": "A high-performance, bilingual portfolio achieving 91/100 Lighthouse score. Built with Next.js 16 and optimized through systematic performance engineering, reducing LCP from 10.4s to 1.5s. Features automated backups, admin dashboard, and production-grade architecture.",
  "desc_ar": "معرض أعمال عالي الأداء ثنائي اللغة بتقييم 91/100 في Lighthouse. مبني بـ Next.js 16 ومُحسّن من خلال هندسة أداء منهجية، مع تقليل LCP من 10.4 ثانية إلى 1.5 ثانية. يتضمن نسخ احتياطي تلقائي، لوحة تحكم إدارية، وهيكلية جاهزة للإنتاج.",
  "content_en": `# The Vision
I needed a portfolio that wasn't just a showcase—it had to demonstrate technical excellence through the portfolio itself. The goal was to build a **production-grade platform** with enterprise-level performance while maintaining rich features and animations.

# The Challenge
The initial build had critical performance issues:
- **Lighthouse Score**: 47/100 (Failing)
- **LCP**: 10.4 seconds (Target: <2.5s)
- **TBT**: 1,360ms (Target: <200ms)
- **Image Sizes**: 702KB unoptimized PNGs

# The Solution
I systematically optimized every aspect of the application:

## Image Optimization (87% Reduction)
- Converted PNG to WebP with automated script using Sharp
- Generated responsive sizes: 280w, 400w, 500w, 640w, 750w
- Hero image: 702KB → 93KB (87% reduction)
- Implemented blur placeholders for instant visual feedback

## LCP Optimization (85% Improvement)
- Added preload link for critical hero image
- Set \`fetchPriority="high"\` for LCP image
- Optimized responsive sizes with proper \`sizes\` attribute
- Result: LCP improved from 10.4s to 1.5s

## JavaScript Optimization (Perfect TBT)
- Configured modular imports for lucide-react
- Optimized package imports for Radix UI components
- Eliminated legacy polyfills (22 KiB)
- Reduced unused JavaScript (145 KiB)
- Result: TBT improved from 1,360ms to 0ms

## Production Features
- **Automated Backup System**: Standalone worker with scheduled backups to R2
- **Auto-Delete**: Prevents storage bloat by cleaning old images
- **Admin Dashboard**: Full content management with bilingual support
- **Analytics**: PostHog with reverse proxy to bypass ad blockers

# The Results
- **Performance**: 47 → 91 (+44 points)
- **LCP**: 10.4s → 1.5s (85% faster)
- **TBT**: 1,360ms → 0ms (perfect!)
- **All Core Web Vitals**: Passing ✅`,
  "content_ar": `# الرؤية
كنت بحاجة إلى معرض أعمال ليس مجرد عرض—بل يجب أن يثبت التميز التقني من خلال المعرض نفسه. كان الهدف بناء **منصة جاهزة للإنتاج** بأداء على مستوى المؤسسات مع الحفاظ على الميزات الغنية والرسوم المتحركة.

# التحدي
كان للبناء الأولي مشاكل أداء حرجة:
- **تقييم Lighthouse**: 47/100 (فاشل)
- **LCP**: 10.4 ثانية (الهدف: <2.5 ثانية)
- **TBT**: 1,360 مللي ثانية (الهدف: <200 مللي ثانية)
- **أحجام الصور**: 702 كيلوبايت PNG غير محسّنة

# الحل
قمت بتحسين كل جانب من جوانب التطبيق بشكل منهجي:

## تحسين الصور (تقليل 87%)
- تحويل PNG إلى WebP بسكريبت تلقائي باستخدام Sharp
- توليد أحجام متجاوبة: 280w، 400w، 500w، 640w، 750w
- صورة البطل: 702 كيلوبايت → 93 كيلوبايت (تقليل 87%)
- تنفيذ عناصر نائبة ضبابية للتغذية البصرية الفورية

## تحسين LCP (تحسين 85%)
- إضافة رابط تحميل مسبق للصورة الحرجة
- تعيين \`fetchPriority="high"\` لصورة LCP
- تحسين الأحجام المتجاوبة مع سمة \`sizes\` المناسبة
- النتيجة: تحسن LCP من 10.4 ثانية إلى 1.5 ثانية

## تحسين JavaScript (TBT مثالي)
- تكوين الاستيرادات المعيارية لـ lucide-react
- تحسين استيرادات الحزم لمكونات Radix UI
- إزالة polyfills القديمة (22 كيلوبايت)
- تقليل JavaScript غير المستخدم (145 كيلوبايت)
- النتيجة: تحسن TBT من 1,360 مللي ثانية إلى 0 مللي ثانية

## ميزات الإنتاج
- **نظام النسخ الاحتياطي التلقائي**: عامل مستقل مع نسخ احتياطية مجدولة إلى R2
- **الحذف التلقائي**: يمنع تضخم التخزين بتنظيف الصور القديمة
- **لوحة التحكم الإدارية**: إدارة محتوى كاملة مع دعم ثنائي اللغة
- **التحليلات**: PostHog مع بروكسي عكسي لتجاوز حاجبات الإعلانات

# النتائج
- **الأداء**: 47 → 91 (+44 نقطة)
- **LCP**: 10.4 ثانية → 1.5 ثانية (أسرع بنسبة 85%)
- **TBT**: 1,360 مللي ثانية → 0 مللي ثانية (مثالي!)
- **جميع Core Web Vitals**: ناجحة ✅`,
  "categories": [
    "Next.js 16",
    "React 19",
    "TypeScript",
    "Tailwind CSS",
    "PostgreSQL",
    "Kysely",
    "Cloudflare R2",
    "Sharp",
    "Docker",
    "PostHog",
    "Better Auth",
    "Shadcn/ui",
    "Framer Motion"
  ],
  "published": true,
  "repoLink": "https://github.com/ahmed-lotfy-dev/my-portfolio",
  "liveLink": "https://ahmedlotfy.site",
  "coverImage": "https://images.ahmedlotfy.site/projects/portfolio-cover.webp",
  "displayOrder": 8,
  "completedAt": new Date("2026-01-01"),
}
];
