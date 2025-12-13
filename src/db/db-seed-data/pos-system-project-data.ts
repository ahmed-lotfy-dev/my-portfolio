export const posSystemProject = {
  basicInfo: {
    titleEn: "POS System",
    titleAr: "نظام نقاط البيع",
    slug: "pos-system",
  },
  shortDescription: {
    en: "A modern, full-stack Point of Sale system built with React, NestJS, and Prisma. Features include real-time inventory management, role-based access control, and a responsive UI designed for speed and reliability.",
    ar: "نظام نقاط بيع متكامل وعصري مبني باستخدام React و NestJS و Prisma. يتميز بإدارة المخزون في الوقت الفعلي، والتحكم في الوصول القائم على الأدوار، وواجهة مستخدم سريعة وموثوقة.",
  },
  caseStudy: {
    en: `# POS System Case Study

**Role:** Full Stack Developer  
**Tech Stack:** React 18, Vite, NestJS, Prisma, PostgreSQL, Docker, Tailwind CSS  
**Live Demo:** [View Demo](http://localhost:3000) *(Replace with actual link)*

---

## 🚀 The Context & Evolution

This project holds a special place in my journey. It started as one of my **first major full-stack applications**, built to master the fundamentals of web development. Initially, it was a proof of concept to understand how complex data flows between a React frontend and a Node.js backend.

However, software (and developers) must evolve. Recently, I decided to **modernize and revitalize** this codebase rather than letting it gather dust. This wasn't just a maintenance update; it was a complete overhaul:

*   **Performance:** Migrated from *Create React App* to **Vite** for instant server starts and optimized builds.
*   **Database:** Upgraded to the latest **Prisma** version to leverage improved type safety and performance.
*   **UI/UX:** Completely redesigned the interface using **HEROUI** and modern design principles, moving away from a "bootstrappy" look to a polished, professional aesthetic.
*   **Strictness:** Enforced stricter TypeScript configurations to eliminate legacy "any" types and improve reliability.

## 🎯 The Challenge

Retail businesses need speed, accuracy, and reliability. Use cases like a cashier processing a line of customers or a manager checking stock levels cannot tolerate lag or data inconsistencies.

My goal was to build a system that solves these core problems while serving as a playground for advanced architectural patterns. The technical challenge was dual-faceted:

1.  **Business Logic:** Handling complex relationships between Products, Categories, Units, and Orders while maintaining data integrity.
2.  **Modernization:** Refactoring a legacy code structure into a clean, modular **Monorepo** without breaking existing functionality.

## 🏗 Technical Architecture

I adopted a **Monorepo** structure to keep the client and server closely aligned.

### Backend (The Backbone)
*   **NestJS**: Chosen for its scalable, modular architecture. It forces good habits like dependency injection and separation of concerns.
*   **Prisma ORM**: A game-changer for working with PostgreSQL. Its type-safe generated client means database queries are validated at compile time, drastically reducing runtime errors.
*   **Authentication**: A robust JWT implementation with **Refresh Tokens**. This ensures users stay logged in securely without constantly re-entering credentials, a critical feature for POS terminals.

### Frontend (The Experience)
*   **React 18 & Vite**: Leveraging concurrent features and lightning-fast HMR.
*   **Redux Toolkit**: Used for complex global state, specifically managing the **POS Cart**. When a cashier adds items, applies discounts, or holds an order, Redux ensures this state is predictable and persistent.
*   **Design System**: Built with Tailwind CSS and Radix UI primitives (via Shadcn), ensuring accessibility and responsiveness.

## 💡 Solving Real Problems

### 1. The "Drift" Problem (Inventory Management)
*   **Problem:** In a busy store, two cashiers might sell the last item simultaneously, leading to negative stock.
*   **Solution:** Capable of handling high concurrency. I utilized proper database transactions via Prisma. When an order is placed, the stock deduction and order creation happen within a single atomic transaction. If one fails, both roll back.

### 2. Secure Access Control
*   **Problem:** A cashier should not be able to delete products or view sensitive admin analytics.
*   **Solution:** I implemented a robust **Role-Based Access Control (RBAC)** system. Using NestJS Guards (\`@Roles('ADMIN')\`), I secured endpoints so that only authorized personnel can perform sensitive actions, while Cashiers have a streamlined, restricted interface for sales only.

## ✨ Key Features

*   **Modern POS Interface:** A keyboard-friendly, fast interface for processing sales efficiently.
*   **Interactive Dashboard:** Real-time visualization of sales trends using **Recharts**, helping owners make data-driven decisions.
*   **Multi-Unit Support:** Flexible product management that handles different units (pcs, kg, etc.) and categories.
*   **Dockerized Deployment:** The entire stack (Frontend, Backend, Database) spins up with a single \`docker-compose up\` command, eliminating "it works on my machine" issues.

## 🧠 What I Learned

Revisiting this project taught me that **code is a living thing**. The difference between my initial implementation and the current version is night and day.

*   **Refactoring is a skill:** Learning how to migrate a live database and swap out build tools without downtime is as valuable as writing new code.
*   **Type Safety is king:** Moving to strict TypeScript saved me from countless bugs that would have only appeared in production.
*   **User Experience Matters:** A powerful backend is useless if the frontend is clunky. Investing time in a proper design system paid off in usability.
`,
    ar: `# دراسة حالة: نظام نقاط البيع (POS System)

**الدور:** مطور واجهات متكاملة (Full Stack Developer)  
**التقنيات المستخدمة:** React 18, Vite, NestJS, Prisma, PostgreSQL, Docker, Tailwind CSS  
**معاينة حية:** [رابط المشروع](http://localhost:3000) *(يستبدل بالرابط الفعلي)*

---

## 🚀 السياق والتطور

يحتل هذا المشروع مكانة خاصة في مسيرتي المهنية. بدأ كواحد من **أوائل تطبيقاتي المتكاملة (Full Stack)**، التي بنيتها لإتقان أساسيات تطوير الويب. في البداية، كان مجرد إثبات للمفهوم لفهم كيفية تدفق البيانات المعقدة بين واجهة React وخلفية Node.js.

ومع ذلك، البرمجيات (والمطورون) يجب أن تتطور. مؤخرًا، قررت **تحديث وإحياء** هذا الكود بدلاً من تركه يجمع الغبار. لم يكن مجرد تحديث للصيانة؛ بل كان إعادة بناء شاملة:

*   **الأداء:** الانتقال من *Create React App* إلى **Vite** لضمان تشغيل فوري للخادم وتحسين عمليات البناء.
*   **قاعدة البيانات:** الترقية إلى أحدث إصدار من **Prisma** للاستفادة من أمان النوع (Type Safety) والأداء المحسن.
*   **واجهة المستخدم (UI/UX):** إعادة تصميم الواجهة بالكامل باستخدام **HEROUI** ومبادئ التصميم الحديث، لنتقل من مظهر "تقليدي" إلى جمالية مصقولة واحترافية.
*   **الدقة:** فرض تكوينات TypeScript أكثر صرامة للتخلص من أنواع "any" القديمة وتحسين الموثوقية.

## 🎯 التحدي

تحتاج شركات التجزئة إلى السرعة والدقة والموثوقية. حالات الاستخدام مثل معالجة الكاشير لطابور من العملاء أو فحص المدير لمستويات المخزون لا تتحمل التأخير أو عدم تناسق البيانات.

كان هدفي بناء نظام يحل هذه المشاكل الأساسية وفي نفس الوقت يكون ملعبًا لتطبيق أنماط معمارية متقدمة. التحدي التقني كان مزدوجًا:

1.  **منطق الأعمال:** التعامل مع العلاقات المعقدة بين المنتجات، الفئات، الوحدات، والطلبات مع الحفاظ على سلامة البيانات.
2.  **التحديث:** إعادة هيكلة الكود القديم إلى بنية **Monorepo** نظيفة ومعيارية دون كسر الوظائف الموجودة.

## 🏗 البنية التحتية التقنية

اعتمدت هيكلية **Monorepo** للحفاظ على توافق وثيق بين العميل (Client) والخادم (Server).

### الواجهة الخلفية (العمود الفقري)
*   **NestJS**: تم اختياره لهيكليته القابلة للتوسع والمعيارية. يفرض عادات جيدة مثل حقن التبعيات (Dependency Injection) وفصل الاهتمامات.
*   **Prisma ORM**: نقلة نوعية للعمل مع PostgreSQL. عميله المولد آمن النوع يعني أن استعلامات قاعدة البيانات يتم التحقق منها وقت التجميع، مما يقلل بشكل كبير من أخطاء وقت التشغيل.
*   **المصادقة:** تنفيذ قوي لـ JWT مع **Refresh Tokens**. يضمن بقاء المستخدمين مسجلين دخول بأمان دون الحاجة لإعادة إدخال البيانات باستمرار، وهي ميزة حيوية لمحطات نقاط البيع.

### الواجهة الأمامية (التجربة)
*   **React 18 & Vite**: الاستفادة من الميزات المتزامنة (Concurrent Features) والتحديث السريع للوحدات (HMR).
*   **Redux Toolkit**: يستخدم لإدارة الحالة العامة المعقدة، وتحديداً إدارة **عربة التسوق (Cart)**. عندما يضيف الكاشير عناصر، أو يطبق خصومات، أو يعلق طلبًا، يضمن Redux أن تكون هذه الحالة متوقعة ومستمرة.
*   **نظام التصميم**: بني باستخدام Tailwind CSS وأساسيات Radix UI (عبر Shadcn)، لضمان سهولة الوصول والاستجابة.

## 💡 حل مشاكل واقعية

### 1. مشكلة "تضارب المخزون" (إدارة المخزون)
*   **المشكلة:** في متجر مزدحم، قد يبيع اثنان من الكاشير آخر قطعة في نفس اللحظة، مما يؤدي إلى مخزون بالسالب.
*   **الحل:** القدرة على التعامل مع التزامن العالي. استخدمت معاملات قاعدة البيانات الصحيحة عبر Prisma. عندما يتم تقديم طلب، يحدث خصم المخزون وإنشاء الطلب داخل معاملة ذرية واحدة (Atomic Transaction). إذا فشل أحدهما، يتم التراجع عن كليهما.

### 2. التحكم الآمن في الوصول
*   **المشكلة:** لا ينبغي أن يكون للكاشير القدرة على حذف المنتجات أو الاطلاع على تحليلات الإدارة الحساسة.
*   **الحل:** قمت بتطبيق نظام **تحكم في الوصول قائم على الأدوار (RBAC)** قوي. باستخدام NestJS Guards (\`@Roles('ADMIN')\`), قمت بتأمين نقاط النهاية بحيث لا يمكن إلا للموظفين المصرح لهم تنفيذ إجراءات حساسة، بينما يمتلك الكاشيرات واجهة مبسطة ومقيدة للمبيعات فقط.

## ✨ الميزات الرئيسية

*   **واجهة POS حديثة:** واجهة سريعة وصديقة للوحة المفاتيح لمعالجة المبيعات بكفاءة.
*   **لوحة تحكم تفاعلية:** تصور فوري لاتجاهات المبيعات باستخدام **Recharts**، مما يساعد المالكين على اتخاذ قرارات مبنية على البيانات.
*   **دعم متعدد الوحدات:** إدارة مرنة للمنتجات تتعامل مع وحدات مختلفة (قطعة، كجم، إلخ) وفئات متعددة.
*   **نشر مع Docker:** يتم تشغيل المجموعة الكاملة (الواجهة الأمامية، الخلفية، قاعدة البيانات) باستخدام أمر \`docker-compose up\` واحد، مما يقضي على مشاكل "إنه يعمل على جهازي".

## 🧠 ماذا تعلمت

إعادة زيارة هذا المشروع علمتني أن **الكود كائن حي**. الفرق بين تنفيذي الأولي والنسخة الحالية هو كالفرق بين الليل والنهار.

*   **إعادة الهيكلة مهارة:** تعلم كيفية ترحيل قاعدة بيانات حية وتبديل أدوات البناء دون توقف الخدمة لا يقل قيمة عن كتابة كود جديد.
*   **أمان النوع هو الملك:** الانتقال إلى TypeScript الصارم أنقذني من أخطاء لا حصر لها كانت ستظهر فقط في الإنتاج.
*   **تجربة المستخدم تهم:** الخلفية القوية عديمة الفائدة إذا كانت الواجهة الأمامية صعبة الاستخدام. استثمار الوقت في نظام تصميم مناسب آتى ثماره في سهولة الاستخدام.
`,
  },
  mediaMetadata: {
    categories: [
      "React",
      "NestJS",
      "Prisma",
      "PostgreSQL",
      "Docker",
      "Tailwind CSS",
    ],
    published: true,
    repoLink: "https://github.com/your-username/pos-system",
    liveLink: "http://localhost:3000",
    coverImage: "https://images.ahmedlotfy.site/Projects-Pos-System%20.png",
  },
  displayOrder: 4,
};
