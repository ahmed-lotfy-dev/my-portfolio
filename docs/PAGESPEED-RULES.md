# PageSpeed Insights Optimization Rules

## Hero Section Best Practices

### Image Optimization
- Use Next.js Image component with all props:
```tsx
<Image
  src={HeroImage}
  alt="..."
  fill
  priority              // Critical for LCP
  loading="eager"       // Force eager load
  fetchPriority="high"  // High priority hint
  sizes="(max-width: 768px) 80vw, (max-width: 1024px) 50vw, 45vw"
  placeholder="blur"
/>
```

### Mobile Layout Order
- Use `order-first` on image for mobile to show above text:
```tsx
<div className="flex flex-col-reverse lg:flex-row ...">
  <m.div className="order-first lg:order-last ...">  // Image first on mobile
  <m.div className="order-last lg:order-first ...">   // Text below image on mobile
</div>
```

### Image Sizes for Mobile
- Use smaller max-width on mobile, larger on desktop:
```tsx
max-w-[280px] sm:max-w-[320px] lg:max-w-[380px]
```

### sizes Attribute
- Responsive sizes for different viewports:
```tsx
sizes="(max-width: 768px) 80vw, (max-width: 1024px) 50vw, 45vw"
```

## Framer Motion / GSAP Best Practices

### Defer Animations with useInView
```tsx
import { useInView } from "motion/react";
import { useRef } from "react";

export function AnimatedComponent() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <div ref={ref}>
      {isInView && (
        <m.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          Content
        </m.div>
      )}
    </div>
  );
}
```

### Add Margin to Viewport
- Always add margin to delay animation triggering:
```tsx
<m.div
  whileInView={{ opacity: 1 }}
  viewport={{ once: true, margin: "-100px" }}
>
```

### Static Animations for Critical Components
- Use pure CSS transitions for above-fold content:
```tsx
// Hero text - minimal initial state
<m.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
// Then let browser paint, animate later without blocking
```

### Simplify Initial States
- Start closer to final state:
```tsx
// Instead of big movement
initial={{ opacity: 0, y: -50 }}
whileInView={{ opacity: 1, y: 0 }}

// Use smaller movement
initial={{ opacity: 0, y: -15 }}
whileInView={{ opacity: 1, y: 0 }}
```

### Use CSS for Hover, Motion for Scroll
- CSS transitions for hover (instant, no JS):
```tsx
className="hover:scale-105 transition-transform duration-300"
// NOT: whileHover={{ scale: 1.05 }}
```

## Performance Metrics Targets

| Metric | Target | Critical |
|--------|--------|----------|
| LCP | < 2.5s | Hero image priority |
| FCP | < 1.8s | Inline critical CSS |
| TBT | < 200ms | Defer animations |
| CLS | < 0.1 | Set image dimensions |
| SI | < 3.4s | Minimize render blocking |

## Quick Wins

1. **Hero image: priority + fetchPriority="high"**
2. **Mobile: order-first on image**
3. **Animations: viewport margin "-100px"**
4. **Above-fold: static or CSS only**
5. **Hero text: minimal initial state**