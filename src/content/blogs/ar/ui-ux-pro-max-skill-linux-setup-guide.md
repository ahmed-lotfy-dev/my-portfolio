---
title: "🎨 دليل تثبيت UI/UX Pro Max Skill على Linux"
date: 2026-01-25
updated: 2026-01-25
tags:
  - development
  - tools
  - ai
share: true
featured: true
image: /images/blogs/pasted_image_225902.png
---

# 🎨 دليل تثبيت UI/UX Pro Max Skill على Linux

الدليل ده بيغطي تثبيت وتكامل الـ **UI/UX Pro Max** skill لـ Linux environments، محخص لـ **Antigravity**.

---

## 🚀 التثبيت

### 1. المتطلب: Python 3.x

تأكد إن Python 3 متثبت (مطلوب للـ search & reasoning engine):

```bash
# Ubuntu/Debian
sudo apt update && sudo apt install python3 -y
```

### 2. تثبيت UI Pro CLI

ثبت الـ CLI بشكل global باستخدام npm:

```bash
sudo npm install -g uipro-cli
```

### 3. Init لـ Antigravity

روح لـ project directory بتاعك واربط الـ skill بالـ AI assistant:

```bash
cd /path/to/your/project
uipro init --ai antigravity
```

---

## 🛠️ الاستخدام في Antigravity

بعد التثبيت، الـ skill بيتفعّل تلقائياً لطلبات الـ UI/UX. تقدر كمان تفعّله بشكل صريح.

### الـ Prompting الأساسي

```
/ui-ux-pro-max Build a landing page for my SaaS product
```

### اللي بيحصل في الخلفية:

1. **Request Analysis**: الـ requirement بتاعك بيتحلل.
2. **Design System Generation**: الـ AI بي generate style guide كامل (Colors, Typography, Patterns).
3. **Execution**: Antigravity بي implement الـ code بناءً على القواعد دي.

---

## 💎 Advanced Design System (Master + Overrides)

خزن الـ design system بتاعك في ملفات للاستخدام المستمر عبر الـ sessions.

### Generate & Persist Master File

ده بيعمل `design-system/MASTER.md` file:

```bash
python3 .gemini/skills/ui-ux-pro-max/scripts/search.py "SaaS dashboard" --design-system --persist -p "MyAppName"
```

### Page-Specific Overrides

لو محتاج style معين لـ sub-page (مثلاً "Checkout"):

```bash
python3 .gemini/skills/ui-ux-pro-max/scripts/search.py "SaaS dashboard" --design-system --persist -p "MyApp" --page "checkout"
```

> [!TIP]
> **Context-Aware Retrieval**: لما تبني صفحة، قول:
> _"I am building the Checkout page. Please check design-system/MASTER.md and design-system/pages/checkout.md."_

---

## ✅ Pre-Delivery Checklist

قبل ما تخلص feature، تأكد إن:

- [x] **مفيش emojis كـ icons** (استخدم Lucide/Heroicons SVG)
- [ ] **Cursor-pointer** على كل العناصر القابلة للنقر
- [ ] **Smooth transitions** (150-300ms) للـ hover states
- [ ] **Accessibility**: contrast ratio 4.5:1 minimum (WCAG AA)
- [ ] **Responsive check**: 375px, 768px, 1024px, 1440px

---

## 🔍 Standalone Commands

مفيدة للـ quick reference من غير full code generation:

- **Style Search**: `python3 .gemini/skills/ui-ux-pro-max/scripts/search.py "glassmorphism" --domain style`
- **Typography Pairing**: `python3 .gemini/skills/ui-ux-pro-max/scripts/search.py "elegant serif" --domain typography`
- **Stack Guides**: `python3 .gemini/skills/ui-ux-pro-max/scripts/search.py "responsive layout" --stack html-tailwind`

---

مبادئ الـ developer experience هنا بتمتد لازاي ببني وأنشر كل حاجة — من الـ portfolio ده لـ [The Drive Center](/ar/projects/the-drive-center). نفس فلسفة "zero friction" بتطبق.

لأتمتة الـ deployment اللي بتخلي ده ممكن، شوف [دليل الـ Self-Hosting على Dokploy](/ar/blogs/self-host-nextjs-blog-on-dokploy).
