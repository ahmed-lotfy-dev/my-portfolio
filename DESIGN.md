# Design System: Ahmed Lotfy Portfolio

## 1. Visual Theme & Atmosphere

A cinematic, deep-space atmosphere with controlled blue luminosity. The background is a near-black marine depth (hsl 226 30% 4%) with layered radial-glow bleeds — soft blue coronas at the top-right and bottom-left that never compete with content. The visual density is restrained (4/10) — generous vertical rhythm, wide internal padding, each section breathes. Variance sits at 7/10 — asymmetric bento grids, left-aligned hero typography alternating with centered section headers, never symmetric for symmetry's sake. Motion is fluid (7/10) — slow-floating ambient orbs in the hero background, spring-animated navigation indicators, scroll-reveal stagger sequences. The mood is "precision workshop at dusk" — clinical, confident, with a single electric-blue accent cutting through the dark.

## 2. Color Palette & Roles

- **Abyss Black** (#0B0E17 / hsl 226 30% 4%) — Primary page background. Deepest surface. Not pure black.
- **Deep Slate** (#111522 / hsl 225 25% 7%) — Card and container surface. One step above abyss, creates subtle elevation.
- **Cloud White** (#EFF2F9 / hsl 220 20% 95%) — Primary text and headings. High contrast without being harsh white.
- **Misted Steel** (#6B7280 / hsl 220 12% 50%) — Secondary text, descriptions, metadata, placeholder labels.
- **Electric Blue** (#3B82F6 / hsl 217 91% 60%) — SINGLE accent. CTAs, active states, focus rings, link hovers, section badges, gradient text highlights. Saturation at 60% — vibrant but controlled.
- **Sky Glow** (#38BDF8 / hsl 199 89% 48%) — Secondary accent gradient partner. Used only in gradient fades with Electric Blue. Never standalone.
- **Charcoal Border** (rgba(59, 130, 246, 0.08–0.15)) — All structural borders. Blue-tinted to harmonize with the accent. 1px hairline.
- **Alert Red** (#EF4444 / hsl 0 72% 51%) — Destructive actions and validation errors only.
- **Success Green** (#22C55E / hsl 142 71% 45%) — Success states and status indicators.

**Banned:** Purple/violet tones, warm beige/cream, neon oversaturated anything, pure black (#000000).

## 3. Typography Rules

- **Display/Headlines:** Sora — Weight 900 for hero name, 700–800 for section headers. Tight tracking (-0.04em). Scale via `clamp(2.8rem, 7.5vw, 5.5rem)` for hero, `text-3xl md:text-5xl` for sections. Never use font-size alone for hierarchy — use weight and color.
- **Body:** Inter — Weight 400 at `text-sm` to `text-base`. Relaxed leading (`leading-relaxed`). Max 65ch width. Color at Misted Steel (#6B7280) for comfortable reading.
- **Arabic Body:** Tajawal — Weight 400–700. RTL layout with matching hierarchy.
- **Mono (code/metadata):** JetBrains Mono (inherited from system) — For tech stack pills, timestamps, version numbers.
- **Gradient Text:** Reserved exclusively for 1–2 word emphases per section. Electric Blue → Sky Glow `linear-gradient(135deg, #60a5fa, #38bdf8, #818cf8, #3b82f6)`. Never on full paragraphs.
- **Banned:** Poppins for display (too generic). Inter is acceptable as body only (already loaded). Serif fonts entirely banned — no Playfair, no Garamond, no Georgia. No font mixing within the same component.

## 4. Component Stylings

- **Buttons (Primary):** Electric Blue fill with animated gradient shimmer. Inner white highlight border. Deep blue shadow glow (0 4px 24px -4px rgba(37,99,235,0.5)). On hover: brightness 1.1, translateY(-2px), extended shadow. On active: scale(0.97), reduced shadow. Text: white, weight 700, 14px. Corner radius 12px (0.875rem).
- **Buttons (Secondary/Outline):** Transparent fill with rgba(59,130,246,0.15) border. On hover: border to 0.3 opacity, background to 0.08, text to Electric Blue. Frosted backdrop-blur. Same translateY hover.
- **Buttons (Ghost):** No border. Misted Steel text. On hover: fade to Cloud White. Used only for tertiary actions (CV download).
- **Cards:** Deep Slate (#111522) surface. Electric Blue gradient border mask (1px, inner edge only — `card-blue` class). Corner radius 16px (1rem). On hover: border opacity increases, blue shadow bloom. Cards used only for project grid — never for simple text sections.
- **Section Badges (eyebrow pills):** Electric Blue fill at 10% opacity. 0.5rem horizontal padding, 0.25rem vertical. 3px uppercase tracking. 11px font. 1px border at 15% opacity. Rounded-full. Max once per 3 sections.
- **Inputs:** Dark background (#0B0E17) at 50% opacity. Blue-tinted border (rgba 0.1). 12px label above. Error text below in Alert Red. Focus ring in Electric Blue at 30% opacity. 12px height. Corner radius 12px. Placeholder at Misted Steel 40%.
- **Loaders:** Section-specific skeletons matching final layout (rectangles for project cards, lines for text). No circular spinners.
- **Empty States:** Illustrated placeholder with action prompt. Never just "No data."
- **Navigation (Desktop):** Frosted glass pill (`backdrop-blur-xl`, 70% background opacity). Blue-tinged borders. Active link has an Electric Blue underline glow (shadow blur 12px) and a subtle background fill. Animated spring indicator (layoutId spring transition). Hover pill slides with shared layout animation.
- **Navigation (Mobile Bottom):** Fixed bottom bar. Frosted backdrops. Active icon scales to 1.1 with Electric Blue color. Top indicator line with blue glow. Icons from Lucide set.
- **Timeline (Experience):** Electric Blue vertical line with gradient fade. Dot indicator with blue glow shadow. Cards follow `card-blue` styling. Alternating left/right on desktop, stacked on mobile.
- **Status Badge (About):** Green pulse dot with glow. No animation when reduced-motion. Border card with frosted backing.

## 5. Layout Principles

- **Grid-first:** CSS Grid exclusively — `grid-cols-1 md:grid-cols-2 lg:grid-cols-3` for project cards. No flexbox percentage math.
- **Hero:** Left-aligned content. Asymmetric structure. Name spans full width, subtitle is a gradient line below. CTAs in a row. Background is the mesh-glow + floating orbs + grid overlay. No centered layout.
- **Section Bands:** Each content grouping wrapped in a `HomeSectionBand` — a rounded-3xl container with blue-tinted gradient background and a subtle top border highlight. Three variants: warm (blue 2% top), editorial (blue 1.5% radial), deep (blue 3% with backdrop).
- **Max-width containment:** Content at `max-w-5xl` (hero) to `max-w-6xl` (sections). Never edge-to-edge.
- **Vertical rhythm:** Section padding at `py-24 sm:py-32`. Internal band padding at `px-10 py-20`. Consistent clamp-based spacing.
- **Mobile collapse (< 768px):** Every multi-column layout collapses to single-column. No horizontal overflow. Hero CTA row stacks vertically. Timeline alternation becomes single left-rail.
- **Full-height sections:** Use `min-h-[100dvh]` never `h-screen`. Hero uses intrinsic height with generous padding.
- **Z-index scale:** 10 (orb backgrounds) → 20 (grid overlay) → 30 (bottom fade) → 40 (nav content) → 50 (nav container) → 60 (mobile nav) → 100 (toasts). No arbitrary stacking.

## 6. Motion & Interaction

- **Spring Physics (default):** `stiffness: 100–180, damping: 20–26` for all interactive transitions — nav pills, mobile nav indicators, card hover, button press. Weighty, premium feel. No linear easing anywhere.
- **Ambient Background:** Three hero orbs float on infinite 12–18s loops with scale oscillation. Blur at 120px. Opacity 35%. `will-change: transform`. GPU-composited.
- **Gradient Animations:** CTA button gradient shifts on 4s loop. Hero title gradient shifts on 6s loop. Both `background-size: 200%+` with `background-position` keyframes.
- **Scroll Reveal:** Motion's `whileInView` with staggerChildren (80ms delay between items). Items fade up 16–24px. `ease: [0.16, 1, 0.3, 1]` cubic bezier. `viewport: { once: true, amount: 0.3 }`.
- **Micro-interactions:** Badge dot pulses 2.5s. Section heading gradient shifts 4s. Button hover includes `filter: brightness(1.1)`. Card hover scales 1.02 with shadow bloom (500ms).
- **Performance:** All animations use `transform` and `opacity` exclusively. No animated width/height/top/left. Grain/blur effects on `pointer-events-none` pseudo-elements only.
- **Reduced Motion:** All animations degrade gracefully under `prefers-reduced-motion`. Spring stiffness increases to instant, loops stop, scroll reveals become instant-opacity.

## 7. Anti-Patterns (Banned)

- No emoji anywhere in UI — Lucide icons only
- No Inter for display/headline fonts (Sora is the display face; Inter is body-only)
- No serif fonts — no Playfair Display, no Garamond, no Georgia, no Times
- No pure black (#000000) — use Abyss Black (#0B0E17)
- No neon outer glows — use tinted diffuse shadows only
- No oversaturated accents — Electric Blue capped at 60% saturation
- No excessive gradient text — max 1–2 words per section, never full paragraphs
- No custom mouse cursors
- No overlapping elements — every component occupies its own spatial zone
- No 3-column equal card layouts (the project grid is the only 3-col layout and uses variable height content)
- No "Learn more" / "Scroll to explore" / bouncing chevrons / swipe-down indicators
- No generic placeholder names, no AI copywriting clichés ("Elevate", "Seamless", "Unleash", "Next-Gen", "Revolutionary")
- No fake round numbers — all stats are real (2+ years, 9 projects, 95+ score)
- No centered Hero sections — always left-aligned or split-screen
- No placeholder-as-label on form inputs — labels always above
- No pure white (#FFFFFF) — use Cloud White (#EFF2F9) for text, off-white for surfaces
