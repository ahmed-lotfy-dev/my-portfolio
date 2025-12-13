export const projectsData = [
  {
    title: "Books App",
    desc: "This project was part of a 6-week internship with Chingu.io. I worked with a team of four on a full-stack project built with Vite for the front-end and Express on the back-end. The authentication was implemented using Passport.js. I gained experience collaborating on team-based projects and practicing the Agile methodology.",
    repoLink: "https://github.com/chingu-voyages/v43-tier2-team-14",
    liveLink: "https://books-app.ahmedlotfy.site/",
    imageLink: "https://images.ahmedlotfy.site/Projects-Books-Project.png",
    categories: ["featured"],
  },
  {
    title: "DevChallenges Frontend Projects Collection",
    desc: "A collection of multiple front-end challenges completed from DevChallenges.io to practice responsive design, accessibility, and performance optimization. Each mini-project was built with modern best practices — semantic HTML, CSS Grid/Flexbox, and optimized images for fast loading. Projects include the 404 Not Found Page, Interior Consultant, Recipe Page, My Gallery, and Checkout Page. The collection demonstrates consistency in coding standards, UI fidelity to Figma designs, and strong attention to performance and accessibility.",
    repoLink: "https://github.com/ahmed-lotfy-dev/dev-challenges-io",
    liveLink: "https://dev-challenges.ahmedlotfy.site",
    imageLink:
      "https://images.ahmedlotfy.site/Projects-Generated Image September 30, 2025 - 12_40PM.png",
    categories: [""],
  },
  {
    title: "Pos System App",
    desc: "A full stack POS (Point of Sale) application designed to serve various types of businesses and handle multiple customers simultaneously. The back-end was developed with NestJS, featuring authentication, authorization, and JWT. The front-end was built using a Vite React app with React Router v6 for navigation. This project helped me deepen my understanding of NestJS and full-stack best practices.",
    repoLink: "https://github.com/ahmed-lotfy-dev/POS-System",
    liveLink: "https://pos-system-app.ahmedlotfy.site/",
    imageLink: "https://images.ahmedlotfy.site/Projects-Pos-System%20.png",
    categories: ["featured"],
    content: `
## 🚀 The Context & Evolution
This project holds a special place in my journey. It started as one of my first major full-stack applications, built to master the fundamentals of web development. Initially, it was a proof of concept to understand how complex data flows between a React frontend and a Node.js backend.

However, software (and developers) must evolve. Recently, I decided to modernize and revitalize this codebase rather than letting it gather dust. This wasn't just a maintenance update; it was a complete overhaul:

- **Performance**: Migrated from Create React App to Vite for instant server starts and optimized builds.
- **Database**: Upgraded to the latest Prisma version to leverage improved type safety and performance.
- **UI/UX**: Completely redesigned the interface using **HEROUI** and modern design principles, moving away from a "bootstrappy" look to a polished, professional aesthetic.
- **Strictness**: Enforced stricter TypeScript configurations to eliminate legacy "any" types and improve reliability.

## 🎯 The Challenge
Retail businesses need speed, accuracy, and reliability. Use cases like a cashier processing a line of customers or a manager checking stock levels cannot tolerate lag or data inconsistencies.

My goal was to build a system that solves these core problems while serving as a playground for advanced architectural patterns. The technical challenge was dual-faceted:

1.  **Business Logic**: Handling complex relationships between Products, Categories, Units, and Orders while maintaining data integrity.
2.  **Modernization**: Refactoring a legacy code structure into a clean, modular Monorepo without breaking existing functionality.

## 🏗 Technical Architecture
I adopted a Monorepo structure to keep the client and server closely aligned.

### Backend (The Backbone)
- **NestJS**: Chosen for its scalable, modular architecture. It forces good habits like dependency injection and separation of concerns.
- **Prisma ORM**: A game-changer for working with PostgreSQL. Its type-safe generated client means database queries are validated at compile time, drastically reducing runtime errors.
- **Authentication**: A robust JWT implementation with Refresh Tokens. This ensures users stay logged in securely without constantly re-entering credentials, a critical feature for POS terminals.

### Frontend (The Experience)
- **React 18 & Vite**: Leveraging concurrent features and lightning-fast HMR.
- **Redux Toolkit**: Used for complex global state, specifically managing the POS Cart. When a cashier adds items, applies discounts, or holds an order, Redux ensures this state is predictable and persistent.
- **Design System**: Built with Tailwind CSS and Radix UI primitives (via Shadcn), ensuring accessibility and responsiveness.

## 💡 Solving Real Problems

### 1. The "Drift" Problem (Inventory Management)
> **Problem**: In a busy store, two cashiers might sell the last item simultaneously, leading to negative stock.

**Solution**: Capable of handling high concurrency. I utilized proper database transactions via Prisma. When an order is placed, the stock deduction and order creation happen within a single atomic transaction. If one fails, both roll back.

### 2. Secure Access Control
> **Problem**: A cashier should not be able to delete products or view sensitive admin analytics.

**Solution**: I implemented a robust Role-Based Access Control (RBAC) system. Using NestJS Guards (\`@Roles('ADMIN')\`), I secured endpoints so that only authorized personnel can perform sensitive actions, while Cashiers have a streamlined, restricted interface for sales only.

## ✨ Key Features
- **Modern POS Interface**: A keyboard-friendly, fast interface for processing sales efficiently.
- **Interactive Dashboard**: Real-time visualization of sales trends using Recharts, helping owners make data-driven decisions.
- **Multi-Unit Support**: Flexible product management that handles different units (pcs, kg, etc.) and categories.
- **Dockerized Deployment**: The entire stack (Frontend, Backend, Database) spins up with a single \`docker-compose up\` command, eliminating "it works on my machine" issues.

## 🧠 What I Learned
Revisiting this project taught me that code is a living thing. The difference between my initial implementation and the current version is night and day.

- **Refactoring is a skill**: Learning how to migrate a live database and swap out build tools without downtime is as valuable as writing new code.
- **Type Safety is king**: Moving to strict TypeScript saved me from countless bugs that would have only appeared in production.
- **User Experience Matters**: A powerful backend is useless if the frontend is clunky. Investing time in a proper design system paid off in usability.
`,
  },
  {
    title: "SelfTracker Fitness App",
    desc: "A React Native mobile app for Android and iOS that helps users track their weight and workouts. The app includes a calendar view, charts for data visualization, and a built-in task manager — all designed to support lifestyle improvement through better tracking and consistency.",
    repoLink: "https://expo.dev/artifacts/eas/xphsBDKRYpbeHSEBcvE8r5.apk",
    liveLink: "https://expo.dev/artifacts/eas/xphsBDKRYpbeHSEBcvE8r5.apk",
    imageLink:
      "https://images.ahmedlotfy.site/Projects-ezgif.com-animated-gif-maker(1).gif",
    categories: ["featured", "app", "mobile"],
  },
  {
    title: "hi-x.net LinkTree",
    desc: "A client project where I restructured and optimized a website originally built as a single HTML file. I improved the mobile view, added background images, replaced Font Awesome with SVG icons, and implemented lazy loading for performance. I also used responsive images via the `<picture>` tag to boost Lighthouse scores and meet industry standards.",
    repoLink: "https://github.com/ahmed-lotfy-dev/hi-x",
    liveLink: "https://hi-x.net",
    imageLink:
      "https://images.ahmedlotfy.site/Projects-hi-x-net-2025-10-07-18_23_54.png",
    categories: ["featured"],
  },
]
