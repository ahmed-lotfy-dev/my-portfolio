# Ahmed Lotfy - Portfolio

> Modern, high-performance portfolio built with Next.js 16, featuring a 91/100 Lighthouse score and production-grade architecture.

[![Performance](https://img.shields.io/badge/Lighthouse-91%2F100-success)](https://ahmedlotfy.site)
[![Next.js](https://img.shields.io/badge/Next.js-16.0-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)

## 🚀 Features

### Core Functionality
- **Multilingual Support** - Full i18n with Arabic (RTL) and English
- **Dynamic Content** - Projects, certificates, and blog posts with admin dashboard
- **Authentication** - Secure admin access with Better Auth
- **Image Optimization** - WebP conversion with 87% size reduction
- **Auto-Delete System** - Automatic cleanup of old cover images from R2 storage

### Performance Optimizations
- **Desktop**: 91/100 Lighthouse score
- **LCP**: 1.5s (85% improvement from 10.4s)
- **TBT**: 0ms (perfect score)
- **Image Delivery**: Responsive WebP with blur placeholders
- **CDN Caching**: 1-year TTL for static assets
- **Bundle Optimization**: Modular imports for lucide-react

### Production Features
- **Automated Backups** - Scheduled database and media backups to R2
- **Docker Deployment** - Multi-stage builds with standalone output
- **Analytics** - PostHog integration with proxy for ad-blocker bypass
- **SEO Optimized** - Dynamic metadata, robots.txt, and sitemap
- **Error Handling** - Comprehensive error boundaries and logging

## 🛠 Tech Stack

### Framework & Runtime
- **Next.js 16** - React framework with App Router
- **React 19** - Latest React features
- **TypeScript** - Type-safe development
- **Bun** - Fast JavaScript runtime

### Database & Storage
- **PostgreSQL** - Primary database with Kysely query builder
- **Cloudflare R2** - Object storage for images and backups
- **Better Auth** - Modern authentication solution

### Styling & UI
- **Tailwind CSS** - Utility-first CSS framework
- **Shadcn/ui** - High-quality React components
- **Framer Motion** - Smooth animations
- **Lucide Icons** - Beautiful icon library

### DevOps & Monitoring
- **Docker** - Containerized deployment
- **PM2** - Process management for backup worker
- **PostHog** - Product analytics
- **Sharp** - High-performance image processing

## 📦 Installation

### Prerequisites
- Bun 1.3+
- PostgreSQL 14+
- Cloudflare R2 account

### Setup

```bash
# Clone repository
git clone https://github.com/ahmed-lotfy-dev/my-portfolio.git
cd my-portfolio

# Install dependencies
bun install

# Configure environment
cp .env.example .env.local
# Edit .env.local with your credentials

# Run database migrations
bun run db:migrate

# Seed initial data
bun run db:seed

# Start development server
bun run dev
```

Visit `http://localhost:3001`

## 🔧 Configuration

### Environment Variables

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/portfolio

# Authentication
BETTER_AUTH_SECRET=your-secret-key
ADMIN_EMAIL=your@email.com

# Cloudflare R2
CF_ACCOUNT_ID=your-account-id
CF_ACCESS_KEY_ID=your-access-key
CF_SECRET_ACCESS_KEY=your-secret-key
CF_BUCKET_NAME=your-bucket-name
CF_IMAGES_SUBDOMAIN=your-subdomain

# Analytics (Optional)
NEXT_PUBLIC_POSTHOG_KEY=your-posthog-key
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

## 🎨 Project Structure

```
my-portfolio/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── [locale]/          # Internationalized routes
│   │   ├── api/               # API endpoints
│   │   └── actions/           # Server actions
│   ├── components/            # React components
│   │   ├── homepage/         # Landing page sections
│   │   ├── dashboard-components/ # Admin dashboard
│   │   └── ui/               # Reusable UI components
│   ├── db/                   # Database layer
│   │   ├── schema/          # Kysely schema
│   │   └── db-seed-data/    # Seed data
│   └── lib/                  # Utilities and helpers
├── scripts/
│   ├── backup-worker/        # Automated backup system
│   └── optimize-images.ts    # Image optimization script
├── public/
│   └── images/
│       ├── optimized/        # WebP images
│       └── original-pngs/    # Source images
└── docs/                     # Documentation
```

## 🚢 Deployment

### Docker Build

```bash
# Build image
docker build -t my-portfolio .

# Run container
docker run -p 3000:3000 \
  --env-file .env.local \
  my-portfolio
```

### Backup System

The backup worker runs independently and can be scheduled via cron:

```bash
# Manual backup
docker exec <container> node backup-worker/dist/index.js --type=full

# Cron schedule (every 8 hours)
0 */8 * * * docker exec <container> node backup-worker/dist/index.js --type=full
```

## 📈 Performance Metrics

### Lighthouse Scores
- **Performance**: 91/100 (Desktop)
- **Accessibility**: 92/100
- **Best Practices**: 92/100
- **SEO**: 92/100

### Core Web Vitals
- **LCP**: 1.5s (target: <2.5s) ✅
- **FCP**: 1.2s (target: <1.8s) ✅
- **TBT**: 0ms (target: <200ms) ✅
- **CLS**: 0 (target: <0.1) ✅

### Optimizations Applied
- WebP image conversion (87% size reduction)
- Responsive image sizes with proper srcset
- LCP image preloading with fetchPriority
- Font preconnect to eliminate render-blocking
- Modular icon imports to reduce bundle size
- 1-year CDN caching for static assets

## 🔐 Security

- **Authentication**: Better Auth with secure session management
- **CSRF Protection**: Built-in Next.js protection
- **Input Validation**: Zod schemas for all forms
- **Image Sanitization**: Filename sanitization for uploads
- **Admin-Only Routes**: Server-side authentication checks
- **Security Headers**: CSP, HSTS, X-Frame-Options configured

## 📝 Development

### Available Scripts

```bash
bun run dev          # Start development server
bun run build        # Build for production
bun run start        # Start production server
bun run lint         # Run ESLint
bun run db:migrate   # Run database migrations
bun run db:seed      # Seed database
```

### Adding New Content

1. **Projects**: Use admin dashboard at `/dashboard/projects`
2. **Certificates**: Use admin dashboard at `/dashboard/certificates`
3. **Blog Posts**: Use admin dashboard at `/dashboard/blogs`

All content supports bilingual (English/Arabic) input with markdown support.

## 🤝 Contributing

This is a personal portfolio project, but suggestions and feedback are welcome!

## 📄 License

MIT License - feel free to use this as inspiration for your own portfolio.

## 🔗 Links

- **Live Site**: [ahmedlotfy.site](https://ahmedlotfy.site)
- **GitHub**: [ahmed-lotfy-dev](https://github.com/ahmed-lotfy-dev)

---

Built with ❤️ using Next.js 16 and modern web technologies.
