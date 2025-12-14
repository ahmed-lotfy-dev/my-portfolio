# Performance Optimization Case Study

## Executive Summary

Transformed a Next.js portfolio from a failing **47/100** Lighthouse score to an excellent **91/100** through systematic performance optimization. Achieved **85% improvement in LCP** (10.4s → 1.5s) and **perfect TBT score** (0ms) while maintaining high code quality and user experience.

## The Challenge

### Initial State
- **Performance Score**: 47/100 (Failing)
- **LCP**: 10.4 seconds (Target: <2.5s)
- **TBT**: 1,360ms (Target: <200ms)
- **Image Sizes**: 702KB PNG files
- **Bundle Size**: Large, unoptimized JavaScript

### Business Impact
- Poor user experience on mobile devices
- High bounce rates due to slow loading
- Negative SEO implications
- Wasted bandwidth and storage costs

## Solution Architecture

### Phase 1: Image Optimization
**Problem**: Large PNG images causing slow LCP

**Implementation**:
```typescript
// Created automated optimization script
import sharp from 'sharp';

// Convert to WebP with responsive sizes
await sharp(input)
  .resize(size, null, { withoutEnlargement: true })
  .webp({ quality: 80, effort: 6 })
  .toFile(output);
```

**Results**:
- Hero image: 702KB → 93KB (87% reduction)
- About image: 840KB → 38KB (95% reduction)
- Generated responsive sizes: 280w, 400w, 500w, 640w, 750w

### Phase 2: LCP Optimization
**Problem**: Browser discovering hero image too late

**Implementation**:
```tsx
// Added preload in layout.tsx
<link
  rel="preload"
  href="/_next/static/media/improved_hero_background.42272c44.webp"
  as="image"
  type="image/webp"
  fetchPriority="high"
/>

// Optimized Image component
<Image
  src={HeroImage}
  priority={true}
  quality={75}
  sizes="(max-width: 640px) 280px, (max-width: 768px) 350px, (max-width: 1024px) 400px, 500px"
  placeholder="blur"
/>
```

**Results**:
- LCP: 10.4s → 1.5s (85% improvement)
- Resource load delay: 1,670ms → ~300ms

### Phase 3: JavaScript Optimization
**Problem**: Large bundle with unused code

**Implementation**:
```typescript
// next.config.ts
experimental: {
  optimizePackageImports: [
    'lucide-react',
    'framer-motion',
    '@radix-ui/*'
  ],
},
```

**Results**:
- Reduced unused JavaScript: 145 KiB
- Eliminated legacy polyfills: 22 KiB
- TBT: 1,360ms → 0ms (perfect!)

### Phase 4: Render-Blocking Elimination
**Problem**: CSS and fonts blocking initial render

**Implementation**:
```tsx
// Added font preconnect
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

// Optimized resource hints ordering
// 1. Preload critical resources
// 2. Preconnect to external domains
// 3. DNS prefetch as fallback
```

**Results**:
- Eliminated 260ms render-blocking time
- FCP: 1.5s → 1.2s (20% improvement)

### Phase 5: CDN & Caching Strategy
**Problem**: Poor cache utilization

**Implementation**:
```typescript
// next.config.ts
images: {
  formats: ['image/avif', 'image/webp'],
  minimumCacheTTL: 31536000, // 1 year
}

async headers() {
  return [
    {
      source: '/_next/static/:path*',
      headers: [
        { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }
      ]
    }
  ]
}
```

**Results**:
- Static assets cached for 1 year
- Repeat visits load instantly
- Reduced server load and bandwidth costs

## Technical Innovations

### Auto-Delete System
Implemented automatic cleanup of old cover images to prevent storage bloat:

```typescript
// Extract R2 key from URL
function extractKeyFromUrl(url: string): string | null {
  const urlObj = new URL(url);
  return urlObj.pathname.startsWith('/') 
    ? urlObj.pathname.slice(1) 
    : urlObj.pathname;
}

// Delete old image before uploading new one
if (oldImageUrl) {
  const oldKey = extractKeyFromUrl(oldImageUrl);
  await s3Client.send(new DeleteObjectCommand({
    Bucket: process.env.CF_BUCKET_NAME!,
    Key: oldKey,
  }));
}
```

**Benefits**:
- Prevents orphaned files in R2 storage
- Reduces storage costs
- Automatic, zero-maintenance solution

### PostHog Analytics Proxy
Configured reverse proxy to bypass ad blockers:

```typescript
// next.config.ts
async rewrites() {
  return [
    {
      source: '/:locale/ingest/:path*',
      destination: 'https://us.i.posthog.com/:path*',
    }
  ]
}
```

## Results

### Performance Metrics

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| **Performance Score** | 47 | 91 | +44 points |
| **LCP** | 10.4s | 1.5s | 85% faster |
| **FCP** | 1.5s | 1.2s | 20% faster |
| **TBT** | 1,360ms | 0ms | Perfect |
| **CLS** | 0 | 0 | Maintained |
| **SI** | 4.6s | 1.5s | 67% faster |

### Core Web Vitals
✅ **All metrics passing**
- LCP: 1.5s (target: <2.5s)
- FCP: 1.2s (target: <1.8s)
- TBT: 0ms (target: <200ms)
- CLS: 0 (target: <0.1)

### Resource Savings
- **Image size**: 87% reduction
- **JavaScript**: 167 KiB removed
- **Render-blocking**: 260ms eliminated
- **Storage**: Automatic cleanup prevents bloat

## Lessons Learned

### What Worked Well
1. **Systematic approach** - Tackled one issue at a time
2. **Measurement-driven** - Used Lighthouse to validate each change
3. **Automation** - Scripts for image optimization and cleanup
4. **Modern tools** - Next.js 16 features and Sharp for processing

### Challenges Overcome
1. **AVIF compatibility** - Switched to WebP for Turbopack support
2. **Image preload path** - Required exact hash for correct preloading
3. **SSR issues** - Fixed client-side hooks in server components
4. **Analytics blocking** - Implemented reverse proxy solution

### Best Practices Applied
- Responsive images with proper `sizes` attribute
- Blur placeholders for instant visual feedback
- Modular imports to reduce bundle size
- Aggressive caching with immutable headers
- Graceful error handling in all operations

## Future Optimizations

### Potential Improvements
- Server response time optimization (TTFB)
- Critical CSS inlining
- Service worker for offline support
- Further mobile LCP optimization

### Monitoring
- Continuous Lighthouse CI integration
- Real User Monitoring (RUM) with PostHog
- Core Web Vitals tracking
- Performance budgets enforcement

## Conclusion

Through systematic optimization and modern web technologies, we achieved a **94% improvement** in performance score while maintaining code quality and user experience. The portfolio now loads in **1.5 seconds** on desktop, providing an excellent first impression for visitors.

**Key Takeaway**: Performance is not a one-time task but an ongoing commitment. By implementing automated optimization scripts and monitoring, we ensure the portfolio remains fast as it grows.

---

**Technologies Used**: Next.js 16, Sharp, Cloudflare R2, PostHog, Docker
**Timeline**: Single optimization sprint
**Impact**: 91/100 Lighthouse score, 85% faster LCP, perfect TBT
