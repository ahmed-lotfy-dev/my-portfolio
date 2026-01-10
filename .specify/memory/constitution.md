<!--
Sync Impact Report
==================
Version change: n/a → 1.0.0
Modified principles: n/a (initial constitution)
Added sections:
  - Core Principles (5 principles defined)
  - Security Requirements
  - Performance Standards
  - Development Workflow
  - Governance

Templates requiring updates:
  ✅ .specify/templates/plan-template.md - No changes needed (generic Constitution Check section)
  ✅ .specify/templates/spec-template.md - No changes needed (generic requirements structure)
  ✅ .specify/templates/tasks-template.md - No changes needed (generic task organization)
  ✅ README.md - Already reflects project principles (performance, security, i18n)

Follow-up TODOs: None
-->

# My Portfolio Constitution

## Core Principles

### Performance First

All new features MUST maintain or improve the 91+ Lighthouse performance score. Images MUST be converted to WebP format, optimized for delivery with proper srcset and blur placeholders. Static assets MUST have long-term CDN caching (1+ year TTL). Bundle size MUST be monitored - use modular imports for large libraries (e.g., lucide-react). Core Web Vitals MUST be maintained: LCP < 2.5s, TBT < 200ms, CLS < 0.1.

**Rationale**: High performance is the project's key differentiator and directly impacts user experience, SEO rankings, and conversion rates.

### Type Safety & Validation

All code MUST use TypeScript with strict mode enabled. ALL external inputs (forms, API requests, environment variables) MUST be validated using Zod schemas before processing. Schema validation errors MUST provide clear, user-friendly messages. Type definitions MUST be maintained for all API contracts and database schemas.

**Rationale**: Type safety prevents runtime errors and catch bugs at compile time. Input validation prevents security vulnerabilities and ensures data integrity.

### Testing Discipline

All Zod schemas and utility functions MUST have corresponding unit tests using Vitest. Tests MUST follow the documented schema testing patterns: helper function pattern, AAA structure (Arrange-Act-Assert), comprehensive test coverage for all field constraints. Tests MUST be written BEFORE implementation (Red-Green-Refactor) or alongside the code being tested. All tests MUST pass before merging changes.

**Rationale**: Tests act as documentation, prevent regressions, and ensure code reliability. Following consistent patterns improves maintainability and onboarding.

### Security First

All admin routes MUST be protected with server-side authentication checks using Better Auth. All forms MUST implement CSRF protection (built into Next.js). All file uploads MUST sanitize filenames and validate file types. Security headers (CSP, HSTS, X-Frame-Options) MUST be configured. Environment variables MUST NOT be committed to git. All sensitive operations MUST be logged for audit trails.

**Rationale**: Security vulnerabilities can lead to data breaches, unauthorized access, and loss of trust. Defense-in-depth is critical for any web application.

### Accessibility & Internationalization

All content MUST support both English (LTR) and Arabic (RTL) languages using next-intl. UI components MUST be tested for RTL layout correctness. Accessibility MUST meet WCAG 2.1 AA standards (maintain 92+ Lighthouse accessibility score). All images MUST have descriptive alt text. Keyboard navigation MUST be supported throughout the application. Color contrast MUST meet minimum readability standards.

**Rationale**: Internationalization expands the audience reach. Accessibility ensures the site is usable by everyone, improves SEO, and is legally required in many jurisdictions.

## Security Requirements

- Authentication MUST use Better Auth with secure session management
- All API routes MUST validate incoming data using Zod schemas
- Database queries MUST use parameterized queries (Kysely/Drizzle ORM)
- File uploads MUST be validated for type, size, and sanitized filenames
- Admin routes MUST check session authentication server-side
- Security headers MUST be configured in next.config.js
- Environment secrets MUST use the .env.local pattern and never be committed
- Error messages MUST NOT expose sensitive system information

## Performance Standards

- Lighthouse Performance score: MUST maintain 91/100 or higher
- Core Web Vitals targets: LCP < 2.5s, FCP < 1.8s, TBT < 200ms, CLS < 0.1
- Image formats: WebP with 87%+ size reduction from source
- CDN caching: Static assets MUST have 1+ year TTL
- Bundle size: Monitor and optimize using modular imports
- Font loading: Preconnect to font origins to eliminate render-blocking
- Lazy loading: Implement for below-fold content and non-critical resources

## Development Workflow

- Create feature branches following pattern: `###-feature-name`
- Run `bun run lint` before committing - MUST pass with zero errors
- Run `bun run test` before merging - all tests MUST pass
- Database changes: Use Drizzle migrations (`bun run db:generate && bun run db:push`)
- Schema changes MUST include corresponding test updates
- Code reviews MUST verify: performance impact, security, accessibility, test coverage
- Follow schema testing patterns documented in `docs/testing/schema-testing-patterns.md`

## Governance

This constitution supersedes all other development practices. All code changes MUST comply with these principles before merging. Amendments to this constitution require:

1. Documentation of the proposed change
2. Impact analysis on existing code
3. Version increment following semantic versioning (MAJOR for principle removals/redefinitions, MINOR for additions, PATCH for clarifications)
4. Migration plan for existing code if breaking changes
5. Approval via pull request with clear rationale

All pull requests and code reviews MUST verify compliance with relevant principles. Complexity introduced in any PR MUST be explicitly justified against simpler alternatives. Use this constitution as the runtime guidance document for development decisions.

**Version**: 1.0.0 | **Ratified**: 2025-01-10 | **Last Amended**: 2025-01-10
