# بيانات التقديم لموقع مستقل

هذا الملف يحتوي على البيانات الكاملة للمشاريع الثلاثة التي سيتم إضافتها لمعرض الأعمال على موقع مستقل.

---

## المشروع الأول: متجر الزمالك

### عنوان العمل
**متجر الزمالك - منصة تجارة إلكترونية للفرق الرياضية**

### وصف العمل
منصة تجارة إلكترونية احترافية مخصصة لبيع منتجات نادي الزمالك، مبنية بأحدث التقنيات وجاهزة للإنتاج بالكامل.

**المميزات الرئيسية:**
- 🌐 **ثنائي اللغة كاملاً** - دعم العربية والإنجليزية مع تخطيط RTL/LTR احترافي
- 💳 **بوابات دفع محلية** - تكامل كامل مع Paymob و Kashier و Stripe للدفع الآمن
- 🛒 **نظام سلة هجين** - يعمل للزوار والمستخدمين المسجلين مع مزامنة تلقائية
- 📦 **إدارة متقدمة** - نظام متكامل للمنتجات، المتغيرات، المخزون، والطلبات
- 🎯 **معالجة خلفية** - استخدام BullMQ مع Redis لإرسال الإيميلات وتحديث الطلبات بشكل غير متزامن
- 🖼️ **تحسين الصور** - ضغط وتحويل الصور تلقائياً لـ WebP مع Cloudflare R2 بدون رسوم نقل
- 🔐 **نظام أمان متقدم** - حماية كاملة لعمليات الدفع مع HMAC signature verification
- 📱 **تصميم متجاوب** - واجهة احترافية تعمل بسلاسة على جميع الأجهزة
- 🎁 **نظام كوبونات** - خصومات وعروض مرنة
- ⭐ **مراجعات وتقييمات** - للمنتجات
- ❤️ **قائمة الرغبات** - مع إضافة سريعة للسلة

**التقنيات المستخدمة:**
- Next.js 16 (App Router)
- React 19
- TypeScript
- PostgreSQL + Prisma ORM
- Redis + BullMQ
- Tailwind CSS + Shadcn/ui
- Cloudflare R2
- Docker

**مقاييس المشروع:**
- 15 نموذج قاعدة بيانات
- 30+ API Endpoint
- 50+ مكون قابل لإعادة الاستخدام
- 3 بوابات دفع مدمجة
- عمال خلفية (Background Workers)

### رابط المعاينة
https://zamalek-store.alotfy.site

### صورة مصغرة
`coverImage: https://images.alotfy.site/projects/screencapture-zamalek-store-ahmedlotfy-site-en-2025-12-06-20_06_48-1765597020942.webp`

### تاريخ الإنجاز
ديسمبر 2025

### المهارات
- Next.js
- React
- TypeScript
- PostgreSQL
- Prisma
- Redis
- BullMQ
- Docker
- Tailwind CSS
- Cloudflare R2
- بوابات الدفع (Paymob, Kashier, Stripe)
- التجارة الإلكترونية
- تطوير ويب متكامل (Full Stack)
- تطوير APIs
- تحسين الأداء
- SEO

---

## المشروع الثاني: نظام نقاط البيع (POS System)

### عنوان العمل
**نظام نقاط البيع - حل متكامل لإدارة المبيعات والمخزون**

### وصف العمل
نظام نقاط بيع (Point of Sale) احترافي ومتكامل للمحلات التجارية والمطاعم، يوفر إدارة كاملة للمبيعات، المخزون، والموظفين.

**المميزات الرئيسية:**
- 💼 **واجهة POS سريعة** - معالجة مبيعات فورية ودعم كامل للوحة المفاتيح
- 📊 **لوحة تحكم تحليلية** - رسوم بيانية حية لاتجاهات المبيعات باستخدام Recharts
- 🔐 **نظام صلاحيات متقدم** - RBAC (Role-Based Access Control) للتحكم في وصول المستخدمين
- 📦 **إدارة مخزون ذكية** - تتبع دقيق للمنتجات مع دعم وحدات قياس متعددة
- 🔄 **معاملات آمنة** - استخدام Database Transactions لضمان سلامة البيانات
- 👥 **إدارة متعددة المستخدمين** - للمسؤولين والكاشيرات
- 📱 **تصميم متجاوب** - يعمل على جميع الأجهزة
- 🐳 **نشر سهل** - كل المشروع يعمل بأمر Docker Compose واحد

**التحديات التقنية المحلولة:**
- **مشكلة تضارب المخزون**: حل مشكلة بيع آخر منتج من كاشيرين في نفس الوقت باستخدام Atomic Transactions
- **الأمان**: حماية endpoints الحساسة بنظام Guards في NestJS
- **الأداء**: استخدام Vite بدلاً من Create React App لتحميل أسرع
- **Type Safety**: TypeScript صارم للقضاء على الأخطاء

**التقنيات المستخدمة:**
- React 18 + Vite
- NestJS (Backend)
- Prisma ORM
- PostgreSQL
- Redux Toolkit
- Tailwind CSS + Radix UI
- JWT + Refresh Tokens
- Docker + Docker Compose

**الخبرة المكتسبة:**
- بناء Monorepo structure
- تطبيق Dependency Injection
- Database Transaction Management
- إعادة الهيكلة (Refactoring) لمشروع قديم
- Strict TypeScript Configuration

### رابط المعاينة
https://pos-system-app.alotfy.site

### صورة مصغرة
`coverImage: https://images.alotfy.site/projects/Pos-System%20.png`

### تاريخ الإنجاز
نوفمبر 2025

### المهارات
- React
- NestJS
- TypeScript
- PostgreSQL
- Prisma
- Docker
- Redux Toolkit
- Tailwind CSS
- JWT Authentication
- REST APIs
- تطوير ويب متكامل (Full Stack)
- هندسة البرمجيات
- أنظمة المؤسسات
- Database Design
- تحسين الأداء

---

## المشروع الثالث: SelfTracker - تطبيق تتبع الإنجازات

### عنوان العمل
**SelfTracker - تطبيق جوال لتتبع النمو الشخصي**

### وصف العمل
تطبيق جوال بسيط وعالي الأداء لتتبع مقاييس النمو الشخصي (الوزن، التمارين الرياضية، المهام اليومية) مع تركيز على الأداء والاستخدام دون اتصال.

**المميزات الرئيسية:**
- 📱 **تطبيق موبايل أصلي** - يعمل على iOS و Android
- ⚡ **أداء فائق** - 60 إطار في الثانية حتى مع آلاف السجلات
- 📴 **يعمل بدون إنترنت** - Offline-first architecture
- 🏋️ **تتبع التمارين** - سجل كامل لتمارينك مع تفاصيل الأوزان والتكرارات
- ⚖️ **تتبع الوزن** - رسوم بيانية لتقدمك عبر الوقت
- ✅ **قائمة مهام** - لتنظيم يومك
- 🔄 **مزامنة تلقائية** - عند توفر الإنترنت
- 🎨 **واجهة نظيفة** - تصميم minimalist وسهل الاستخدام

**التحديات التقنية المحلولة:**
- **الأداء مع بيانات كبيرة**: استخدام FlashList من Shopify بدلاً من FlatList العادية
- **العمل بدون إنترنت**: استخدام AsyncStorage مع Local-first architecture
- **سرعة Backend**: استخدام Bun مع Hono لأداء خارق
- **Type Safety**: Drizzle ORM للتعامل الآمن مع قاعدة البيانات

**التقنيات المستخدمة:**
- React Native
- Expo
- TypeScript
- Bun Runtime
- Hono (Backend Framework)
- Drizzle ORM
- PostgreSQL
- FlashList
- AsyncStorage

**الخبرة المكتسبة:**
- تطوير تطبيقات Mobile Cross-platform
- تحسين أداء القوائم الطويلة
- Offline-first strategies
- استخدام Bun runtime الحديث

### رابط المعاينة
https://drive.google.com/file/d/1r1qLiMZwX0oDeq7lQaouEdSs3vUhC8Fg/view?usp=drive_link

### صورة مصغرة
`coverImage: https://images.alotfy.site/projects/ezgif.com-animated-gif-maker(1).gif`

### تاريخ الإنجاز
أكتوبر 2025

### المهارات
- React Native
- Expo
- TypeScript
- Mobile Development
- Bun
- Hono
- Drizzle ORM
- PostgreSQL
- Offline-first Apps
- Performance Optimization
- Cross-platform Development
- تطوير تطبيقات الجوال
- UI/UX للموبايل

---

## المشروع الرابع: تطبيق المكتبة الافتراضية (Virtual Book App)

### عنوان العمل
**تطبيق المكتبة الافتراضية - منصة بحث وإدارة الكتب**

### وصف العمل
منصة حديثة ومتكاملة لاستكشاف الكتب والبحث فيها مع إدارة مكتبة شخصية، تعتمد على بيانات حقيقية من Google Books و New York Times APIs.

**المميزات الرئيسية:**
- 📚 **تكامل مع APIs خارجية** - عرض بيانات حية من Google Books و NYT Bestsellers
- ⚡ **تخزين مؤقت ذكي** - استخدام Redis لتسريع الاستجابة وتقليل استهلاك APIs
- 🔍 **بحث متقدم** - تصفية حسب الفئة، اللغة، وخيارات الترتيب
- 📖 **عرض تفصيلي** - صفحات مفصلة لكل كتاب مع deep linking
- ❤️ **قائمة الأمنيات** - حفظ الكتب المفضلة
- 🔐 **OAuth Integration** - تسجيل دخول سلس عبر Google
- 🎨 **واجهة متجاوبة** - مبنية بـ React و TailwindCSS
- 💾 **Type-Safe Backend** - Drizzle ORM مع PostgreSQL

**التحديات التقنية المحلولة:**
- **مشكلة التأخير**: حل بطء APIs الخارجية باستخدام Redis caching layer
- **Type Safety**: استخدام Drizzle ORM لضمان أمان الأنواع من البداية للنهاية
- **State Management**: استخدام Zustand لإدارة الحالة العامة بشكل خفيف وفعال
- **Performance**: تحسين أوقات التحميل للبيانات المتكررة

**التقنيات المستخدمة:**
- React
- TypeScript
- Node.js
- PostgreSQL
- Drizzle ORM
- Redis
- Zustand
- TailwindCSS
- Google Books API
- NY Times API
- OAuth 2.0

### رابط المعاينة
https://books-app.alotfy.site/

### صورة مصغرة
`coverImage: https://images.alotfy.site/projects/Books-Project.png`

### تاريخ الإنجاز
سبتمبر 2025

### المهارات
- React
- TypeScript
- Node.js
- PostgreSQL
- Drizzle ORM
- Redis
- API Integration
- OAuth
- Zustand
- TailwindCSS
- تطوير ويب متكامل (Full Stack)
- Performance Optimization
- Caching Strategies

---

## المشروع الخامس: معرض توته للفنون (Toota Art Portfolio)

### عنوان العمل
**معرض توته للفنون - منصة احترافية لعرض الأعمال الفنية**

### وصف العمل
معرض رقمي عالي الأداء للفنانين البصريين، مع نظام إدارة محتوى متقدم ونظام نسخ احتياطي شامل.

**المميزات الرئيسية:**
- 🎨 **معرض احترافي** - عرض أعمال فنية عالية الدقة بأداء ممتاز
- 🌐 **ثنائي اللغة كاملاً** - دعم العربية والإنجليزية مع RTL/LTR
- 🖼️ **تحسين الصور التلقائي** - تحويل لـ WebP وإنشاء أحجام متجاوبة
- ☁️ **Cloudflare R2** - تخزين بدون رسوم نقل بيانات
- 💾 **نظام نسخ احتياطي متقدم** - 
  - تحميل تلقائي لآلاف الصور من R2
  - تصدير JSON للبيانات
  - PostgreSQL dumps
  - استراتيجية احتفاظ ذكية (يومي، أسبوعي، شهري، سنوي)
  - روابط تحميل آمنة منتهية الصلاحية
- 📱 **واجهة حية** - Livewire 3 لسرعة SPA مع SEO تقليدي
- 🔐 **أمان عالي** - Google OAuth فقط، لا تسجيل عام
- 🎯 **SEO تلقائي** - إنشاء Sitemap يومي للأرشفة الفورية

**التحديات التقنية المحلولة:**
- **ملفات كبيرة**: تحويل صور 10MB تلقائياً لـ 150KB WebP
- **النسخ الاحتياطي**: نظام متعدد الطبقات مع redundancy جغرافي
- **الأداء**: تخزين مؤقت قوي لتحميل فوري للمعرض
- **الأمان**: فصل المشاهدة العامة عن الإدارة الخاصة

**التقنيات المستخدمة:**
- Laravel 12
- Livewire 3
- Alpine.js
- Tailwind CSS
- PostgreSQL
- Cloudflare R2
- FrankenPHP
- Docker
- Spatie Packages

### رابط المعاينة
https://toota-art.alotfy.site

### صورة مصغرة
`coverImage: https://images.alotfy.site/projects/Projects-screencapture-toota-art-ahmedlotfy-site-2025-12-01-21_53_25%20(Edited)-1765597181426.webp`

### تاريخ الإنجاز
ديسمبر 2025

### المهارات
- Laravel
- Livewire
- Alpine.js
- Tailwind CSS
- PostgreSQL
- Cloudflare R2
- Docker
- PHP
- Image Optimization
- Backup Systems
- SEO
- تطوير ويب متكامل (Full Stack)

---

## المشروع السادس: hi-x.net - صفحة Captain X

### عنوان العمل
**hi-x.net - صفحة تواصل احترافية لخبير أسواق مالية**

### وصف العمل
صفحة LinkTree احترافية ومحسّنة لمحمد علي (Captain X)، خبير الأسواق المالية وتحليل النسبة الذهبية، مع تحسينات شاملة للأداء والتصميم.

**المميزات الرئيسية:**
- 💼 **علامة تجارية مميزة** - تصميم يعكس احترافية خبير الأسواق المالية
- 🌐 **ثنائي اللغة** - عربي وإنجليزي مع تخطيطات RTL/LTR صحيحة
- ⚡ **تحسين أداء شامل** - 
  - استبدال Font Awesome بأيقونات SVG محسّنة
  - صور WebP متجاوبة باستخدام `<picture>` tag
  - CSS و JavaScript مضغوطة
- 📱 **تصميم متجاوب كامل** - محسّن خصيصاً للموبايل
- 🎨 **تصميم حديث** - خطوط احترافية (Inter, Poppins, Cairo)
- 📄 **صفحة من نحن** - محتوى غني عن الخبير
- 🔍 **SEO محسّن** - Meta tags للغتين

**التحديات المحلولة:**
- **الأداء**: تحسين وقت التحميل بإزالة المكتبات الثقيلة
- **الموبايل**: إعادة تصميم خاصة لعرض مثالي على الهواتف
- **البنية**: إعادة هيكلة الكود لصيانة أسهل
- **التحسين**: عملية build نظيفة مع minification

**التقنيات المستخدمة:**
- HTML5
- CSS3
- Vanilla JavaScript
- SVG Icons
- WebP Images
- Responsive Design
- SEO Optimization
- Performance Optimization

**نوع المشروع**: عمل مع عميل حقيقي

### رابط المعاينة
https://hi-x.com

### صورة مصغرة
`coverImage: https://images.alotfy.site/projects/hi-x-net-2025-10-07-18_23_54.png`

### تاريخ الإنجاز
أكتوبر 2025

### المهارات
- HTML
- CSS
- JavaScript
- تحسين الأداء
- تصميم متجاوب
- SEO
- تصميم الويب
- Web Optimization
- ثنائية اللغة
- Frontend Development

---

## المشروع السابع: المعرض الشخصي (Personal Portfolio)

### عنوان العمل
**معرض أعمال شخصي عالي الأداء - 91/100 Lighthouse**

### وصف العمل
معرض أعمال شخصي احترافي ثنائي اللغة بأداء استثنائي، يثبت التميز التقني من خلال المشروع نفسه.

**المميزات الرئيسية:**
- ⚡ **أداء استثنائي** - تحسين من 47 إلى 91 في Lighthouse
- 🖼️ **تحسين صور شامل** - تقليل 87% في حجم الصور
  - تحويل PNG لـ WebP
  - أحجام متجاوبة متعددة
  - صورة البطل: 702KB → 93KB
- 🚀 **LCP محسّن** - تحسين 85% (من 10.4s إلى 1.5s)
  - Preload للصور الحرجة
  - fetchPriority="high"
  - أحجام متجاوبة مثالية
- ⚙️ **JavaScript مثالي** - TBT من 1,360ms إلى 0ms
  - استيرادات معيارية
  - إزالة polyfills القديمة (22 KiB)
  - تقليل الكود غير المستخدم (145 KiB)
- 💾 **نظام نسخ احتياطي تلقائي** - Worker مستقل مع جدولة R2
- 🗑️ **حذف تلقائي** - منع تضخم التخزين
- 📊 **لوحة تحكم إدارية** - إدارة محتوى ثنائية اللغة
- 📈 **تحليلات** - PostHog مع reverse proxy

**النتائج المحققة:**
- **Performance**: 47 → 91 (+44 نقطة)
- **LCP**: 10.4s → 1.5s (85% أسرع)
- **TBT**: 1,360ms → 0ms (مثالي!)
- **Core Web Vitals**: كلها ناجحة ✅

**التقنيات المستخدمة:**
- Next.js 16
- React 19
- TypeScript
- PostgreSQL
- Kysely
- Cloudflare R2
- Sharp
- Docker
- PostHog
- Better Auth
- Shadcn/ui
- Framer Motion
- Tailwind CSS

### رابط المعاينة
https://alotfy.site

### صورة مصغرة
`coverImage: https://images.alotfy.site/projects/portfolio-cover.webp`

### تاريخ الإنجاز
ديسمبر 2025

### المهارات
- Next.js
- React
- TypeScript
- Performance Optimization
- Image Optimization
- PostgreSQL
- Kysely
- Cloudflare R2
- Docker
- SEO
- Core Web Vitals
- Lighthouse Optimization
- تطوير ويب متكامل (Full Stack)

---

## المشروع الثامن: DevChallenges Portfolio

### عنوان العمل
**معرض تحديات DevChallenges - حلول تطوير الويب**

### وصف العمل
معرض شامل لحلولي لتحديات تطوير الويب من منصة DevChallenges.io، يغطي تصميم الويب المتجاوب، JavaScript، ومكتبات Frontend الحديثة.

**المميزات الرئيسية:**
- 🎯 **معرض موحد** - مكان مركزي لعرض جميع التحديات المكتملة
- 🏗️ **مشاريع متنوعة** - من landing pages بسيطة لتطبيقات Full-stack معقدة
- 💻 **كود نظيف** - تركيز على القابلية للقراءة والصيانة وأفضل الممارسات
- 📱 **تصميم متجاوب** - جميع المشاريع تعمل بسلاسة على كل الأجهزة
- 🎨 **UI/UX محترف** - تحويل مفاهيم التصميم لكود عامل

**المجالات المغطاة:**
- **HTML & CSS**: ترميز دلالي وتصميم متجاوب بدون اعتماد كلي على Frameworks
- **JavaScript**: منطق أساسي، معالجة DOM، برمجة غير متزامنة
- **Frameworks**: تطبيق React و Next.js حيث مناسب
- **Web Design**: ترجمة تصاميم واقعية لكود عامل

**الهدف من المشروع:**
إثبات الفهم الشامل لأساسيات تطوير الويب والممارسات الحديثة، مع التركيز على بناء واجهات حقيقية وليس فقط "معرفة" الكود.

**التقنيات المستخدمة:**
- HTML5
- CSS3
- Vanilla JavaScript
- React
- Responsive Design
- Flexbox & Grid
- CSS Animations
- DOM Manipulation
- Async JavaScript

### رابط المعاينة
https://dev-challenges.ahmedlotfy.surge.sh

### صورة مصغرة
`coverImage: https://images.alotfy.site/projects/Generated%20Image%20September%2030,%202025%20-%2012_40PM.png`

### تاريخ الإنجاز
سبتمبر 2025

### المهارات
- HTML
- CSS
- JavaScript
- React
- Responsive Design
- Frontend Development
- UI/UX Implementation
- Web Design
- CSS Grid
- Flexbox
- تطوير واجهات المستخدم

---

## ملاحظات مهمة

### صور إضافية مقترحة لكل مشروع:

**Zamalek Store:**
- لقطة شاشة للصفحة الرئيسية
- صفحة المنتج
- عربة التسوق
- عملية الدفع
- لوحة التحكم الإدارية

**POS System:**
- واجهة POS الرئيسية
- لوحة التحكم (Dashboard)
- صفحة إدارة المنتجات
- صفحة التقارير
- واجهة تسجيل الدخول

**SelfTracker:**
- الشاشة الرئيسية
- صفحة تتبع الوزن
- صفحة سجل التمارين
- قائمة المهام
- الرسوم البيانية

**Virtual Book App:**
- الصفحة الرئيسية مع Bestsellers
- صفحة البحث والفلاتر
- صفحة تفاصيل الكتاب
- قائمة الأمنيات
- نتائج البحث

**Toota Art:**
- الصفحة الرئيسية للمعرض
- صفحة عرض مشروع
- لوحة التحكم الإدارية
- صفحة النسخ الاحتياطي
- معرض الصور

**hi-x.net:**
- الصفحة الرئيسية (عربي)
- الصفحة الرئيسية (إنجليزي)
- صفحة من نحن
- عرض موبايل

**Personal Portfolio:**
- الصفحة الرئيسية
- صفحة المشاريع
- صفحة المدونة
- لوحة التحكم
- نتائج Lighthouse

**DevChallenges:**
- صفحة المعرض الرئيسية
- أمثلة من التحديات المكتملة
- عروض متجاوبة

### نصائح للتقديم:
1. ✅ استخدم الصور عالية الجودة (WebP محسنة)
2. ✅ اذكر النتائج والتأثير (مثل: تحسين الأداء بنسبة 85%)
3. ✅ ركز على حل المشاكل وليس فقط التقنيات
4. ✅ اذكر التحديات التي واجهتها وكيف حلّيتها
5. ✅ أضف روابط حية قابلة للتجربة
6. ✅ أكد أن كل الأعمال من تنفيذك الشخصي
7. ✅ نوّع المشاريع حسب احتياج العميل المحتمل

### ترتيب الأولوية حسب نوع العميل:

**للعملاء التجاريين:**
1. Zamalek Store
2. POS System
3. Virtual Book App

**للمؤسسات:**
1. POS System
2. Zamalek Store
3. Personal Portfolio

**للمشاريع الشخصية/الفنية:**
1. Toota Art
2. Personal Portfolio
3. hi-x.net

**للعملاء المحليين المصريين:**
1. Zamalek Store (بوابات دفع محلية)
2. POS System
3. hi-x.net (عمل عميل حقيقي)

**لعرض التنوع التقني:**
1. Zamalek Store (E-commerce)
2. POS System (Enterprise)
3. SelfTracker (Mobile)

### مقترحات للاستخدام:
- اختر 3 مشاريع فقط في البداية (حسب الشرط)
- يمكنك تحديث المعرض لاحقاً بمشاريع إضافية
- نوّع المشاريع لتظهر قدرات مختلفة
- استخدم أقوى 3 مشاريع تناسب السوق المستهدف
