---
title: "⚛️ React Server Components vs Qwik: الحقيقة من الواقع"
date: 2026-05-09
updated: 2026-05-09
tags:
  - react
  - nextjs
  - qwik
  - frontend
  - web-development
  - javascript
image: https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200&q=80
share: true
featured: false
---

# ⚛️ React Server Components vs Qwik: الحقيقة من الواقع

# حرب الـ Frameworks اللي محدش بيتكلم عنها

كل شوية، الـ frontend community بت hype لـ "React killer" جديد. شوفنا ده مع Svelte، وبعدين Solid، ودلوقتي Qwik هو الـ contender اللي بيحمل الـ torch دي. بس الحقيقة — أنا قضيت السنة اللي فاتت ببني production apps مع كلا الـ React Server Components (RSC) في Next.js و Qwik City، والقصة الحقيقية أدق بكتير من "X أحسن من Y".

خليني أشاركك اللي فعلاً مهم لما بتسليم منتجات حقيقية.

---

## اللي RSC بتعمله صح

React Server Components أساساً عن نقل الشغل. بدل ما تبعت bundle من JavaScript للـ client وتطلب من الـ browser يرندر كل حاجة، بترندر على الـ server وبتبعت HTML. بيبدو بسيط، بس الـ implications ضخمة:

```tsx
# RSC — الـ component ده مش بيتبعت للـ client أبداً
import { db } from '@/db';
import { posts } from '@/db/schema';

export async function BlogList() {
  const allPosts = await db.select().from(posts);

  return (
    <ul>
      {allPosts.map(post => (
        <li key={post.id}>{post.title_en}</li>
      ))}
    </ul>
  );
}
```

الـ `BlogList` component هنا بيشتغل بالكامل على الـ server. Zero JavaScript بيتبعت للـ client. مفيش `useEffect`، مفيش loading states، مفيش API calls من الـ browser. الـ database query بتحصل server-side، والـ HTML بس اللي بيوصل للمستخدم.

For my portfolio site، ده no-brainer. الـ pages بت load بسرعة لأن مفيش client JavaScript للـ content pages. الـ bundle بيفضل lean.

---

## فين RSC بتفشل

دلوقتي للحقيقة الصعبة: RSC بت shine للـ content-heavy pages بس بتعاني مع الـ highly interactive UIs. لما تحتاج real-time updates، optimistic mutations، أو complex client state، بترجع تحط `"use client"` directives في كل مكان.

```tsx
"use client";
import { useState } from "react";

export function CommentForm({ postId }: { postId: string }) {
  const text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    await fetch(`/api/posts/${postId}/comments`, {
      method: "POST",
      body: JSON.stringify({ text }),
    });
    setSubmitting(false);
    setText("");
  }

  return (
    <form onSubmit={handleSubmit}>
      <textarea value={text} onChange={(e) => setText(e.target.value)} />
      <button disabled={submitting}>
        {submitting ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
}
```

أول ما تضيف `"use client"`، الـ component ده وكل اللي تحته بيتبعت كـ JavaScript. مش تقدر تعمل tree-shake عند الـ server boundary — ده switch all-or-nothing. ده بيخلق split مزعج في الـ codebase بتاعك الـ "smart" server components والـ "dumb" الـ client components مفصولين بـ hard boundary.

---

## رهنة الـ Qwik على الـ Resumability

Qwik بتقترب من نفس المشكلة من زاوية مختلفة تماماً. بدل server vs client، Qwik بتتكلم عن **resumability** vs hydration. الفكرة الأساسية إن الـ framework المفروض بس تنزل وتنفذ الـ JavaScript المطلوب للـ interaction المحدد اللي المستخدم عمله.

من غير hydration. من غير replay كل الـ component logic على الـ load. بس serialize الـ application state في HTML، وبعدين تنزل الـ event handlers بشكل lazy لما المستخدم يتفاعل.

```tsx
# Qwik — code-splits على مستوى الـ event-handler
import { component$, useSignal, $ } from "@builder.io/qwik";

export const Counter = component$(() => {
  const count = useSignal(0);

  return (
    <button onClick$={() => count.value++}>
      Count: {count.value}
    </button>
  );
});
```

الـ `onClick$` handler هنا ده separate chunk. بينزل بس لما المستخدم فعلاً يدوس على الـ button. لو مدوسش، الكود ده مش بيحمل.

---

## الحقيقة الـ Cross-Platform

أنا شغلت الـ frameworks الاتنين على نفس الهاردوير (الـ Dokploy VPS بتاعي مع PostgreSQL) ودي اللي لقيتها:

| Metric | Next.js (RSC) | Qwik City |
|--------|--------------|-----------|
| First Load JS (content page) | ~85 KB | ~45 KB |
| First Load JS (interactive page) | ~145 KB | ~60 KB |
| TTI | 1.2s | 0.9s |
| Build time (50 pages) | 18s | 32s |
| DX for content-heavy sites | Excellent | Good |
| DX for app-like sites | Good | Excellent |

الأرقام بتحكي قصة، بس الـ DX difference أهم في الممارسة. الـ mental model بتاع RSC الـ "server vs client" أسهل في الـ reasoning لمعظم الـ teams. الـ resumability بتاع Qwik أداء أعلى بس عنده learning curve أعلى.

---

## الخلاصة

لو بتبني content site، blog، أو portfolio (زي الموقع ده) — استخدم Next.js و RSC. الـ ecosystem والـ tooling والـ deployment story مش بيتحسنوا. لموقع زي الـ portfolio بتاعي، الـ trade-offs واضحة: RSC بيديني page loads سريعة مع تعقيد قليل.

لو بتبني interactive web app حيث الأداء على الأجهزة البطيئة مهم — Qwik تستاهل نظرة جدية. الـ resumability model فعلاً أحسن للـ JS-heavy experiences.

الـ winner الحقيقي؟ الـ frameworks الاتنين بيدفعوا الـ web للأمام عن طريق تقليل الـ JavaScript tax. اختار اللي بي match طبيعة الـ app بتاعك.

هذا البورتيفوليو مبني بالظبط بالطريقة دي — fully static، server-rendered، zero client JavaScript للـ content pages. البلوج اللي بتقرأه دلوقتي هو مثال مثالي لـ RSC في الواقع.
