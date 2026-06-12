# Portfolio Hero Section — Interactive 3D Vision

## الرؤية بالعربي

الهيرو سيكشن في البورتفوليو يكون فيه:

1. **افاتار 3D بيتحرك** — شخصية كرتونية/3D بتتحرك في المشهد
2. **كمبيوتر مكتبي** — الأفاتار يقعد على الكرسي المكتب بتاعه
3. **الشاشة بتظهر عليها أبلكيشن** — بيفتح أبلكيشن ويعمل كل الشغل اللي أنت بتعمله (كود، ديزاين، إلخ)
4. **الأنيميشن مع السكرول** — لما تنزل لتحت، الأفاتار 3D ينزل ويتحرك وياخد مكانه مع كل سيكشن

يعني: كل ما تعمل سكرول، الأفاتار بيتحرك ويتفاعل مع المحتوى.

---

## Technical Planning

### Tools & Libraries Needed

| Tool | Purpose | Why |
|------|---------|-----|
| **Three.js** | 3D rendering in browser | Most popular WebGL library, huge community |
| **React Three Fiber** | Three.js + React integration | Declarative, works perfectly with Next.js |
| **@react-three/drei** | Helpers (animations, controls, loaders) | Saves tons of boilerplate |
| **Blender** | Create 3D avatar & scene | Free, industry standard |
| **Mixamo** | Character animations | Free, auto-rigging, tons of animations |
| **GSAP** | Scroll-triggered animations | Best for scroll-based interactions |
| **Lottie** | 2D animations fallback | Lightweight, After Effects export |

### 3D Assets Needed

1. **Avatar** — شخصية كرتونية بسيطة (low-poly أو stylized)
   - Option A: تصممها في Blender بنفسك
   - Option B: تستخدم جاهزة من [ReadyPlayerMe](https://readyplayerme.com) أو [Mixamo](https://mixamo.com)
   - Option C: تستخدم AI tool زي [Meshy.ai](https://meshy.ai) أو [CSM](https://csm.ai)

2. **Desk Scene** — مكتب + كرسي + كمبيوتر + شاشة
   - ممكن تلاقي جاهز على [Sketchfab](https://sketchfab.com) أو [Poly Pizza](https://poly.pizza)
   - أو تبنيها بسيطة في Blender

3. **Screen Content** — فيديو أو أنيميشن للشاشة
   - سجل شاشتك وأنت بتعمل كود/ديزاين
   - أو اعمل أنيميشن في After Effects / Lottie

### Animation Flow

```
[Hero Section - Top]
├── Avatar standing/waving (idle animation)
├── 3D desk scene visible
└── CTA button

[Scroll Down - Section 1]
├── Avatar sits down on chair
├── Computer screen lights up
├── Screen shows: coding animation
└── Section content: "About Me"

[Scroll Down - Section 2]
├── Avatar typing on keyboard
├── Screen shows: design tools
└── Section content: "Projects"

[Scroll Down - Section 3]
├── Avatar presenting/showing
├── Screen shows: portfolio pieces
└── Section content: "Contact"
```

### Implementation Steps

#### Phase 1: 3D Scene Setup
```
1. Create/load 3D avatar (GLB format)
2. Create/load desk scene
3. Set up Three.js scene with React Three Fiber
4. Add lighting (ambient + directional)
5. Position camera for hero view
```

#### Phase 2: Animations
```
1. Idle animation (standing, breathing, looking around)
2. Sit-down animation (triggered on scroll)
3. Typing animation (loop while sitting)
4. Screen content transitions
5. Scroll-linked position/rotation changes
```

#### Phase 3: Scroll Integration
```
1. Use GSAP ScrollTrigger
2. Map scroll progress to:
   - Avatar position (standing → sitting)
   - Camera angle (wide → close-up)
   - Screen content (changes per section)
3. Smooth transitions between states
```

#### Phase 4: Performance
```
1. Lazy load 3D scene (don't block initial render)
2. Use `Suspense` with fallback (static image)
3. Optimize 3D models (compress textures, reduce polygons)
4. Consider `framer-motion-3d` for simpler animations
5. Add `prefers-reduced-motion` check
```

---

## Prompts for AI Tools

### For 3D Avatar Generation (Meshy.ai / CSM)
```
Create a stylized 3D cartoon character, young male developer,
sitting at a desk, casual clothes, friendly expression,
low-poly style, game-ready, GLB format,
with rigging for sitting and typing animations
```

### For Scene Generation
```
Create a cozy developer desk setup, 3D scene,
wooden desk, office chair, computer monitor,
warm lighting, minimalist style,
low-poly, game-ready, GLB format
```

### For Animation (Mixamo)
```
Use Mixamo auto-rigging on the avatar character,
apply these animations:
1. Idle standing (breathing)
2. Sitting down
3. Typing on keyboard
4. Waving hello
5. Pointing/presenting
Download as FBX, convert to GLB
```

### For Screen Content (After Effects / Lottie)
```
Create a 10-second looping animation of:
- Code editor with typing effect
- Design tools (Figma-like interface)
- Terminal with commands running
Export as Lottie JSON for web
```

---

## File Structure

```
portfolio/
├── src/
│   ├── components/
│   │   ├── hero/
│   │   │   ├── HeroScene.tsx          # Main 3D scene
│   │   │   ├── Avatar.tsx             # Avatar component
│   │   │   ├── Desk.tsx               # Desk scene
│   │   │   ├── ComputerScreen.tsx     # Screen content
│   │   │   └── ScrollController.tsx   # GSAP scroll integration
│   │   └── ui/
│   │       └── HeroFallback.tsx       # Static fallback
│   ├── hooks/
│   │   └── useScrollProgress.ts       # Scroll progress hook
│   └── public/
│       └── 3d/
│           ├── avatar.glb
│           ├── desk.glb
│           └── animations/
│               ├── idle.glb
│               ├── sit-down.glb
│               └── typing.glb
```

---

## Alternative Approaches (Simpler)

### Option A: Video Background (Easiest)
- Record a video of the 3D animation
- Use as background with `object-cover`
- Overlay content on top
- Pros: Zero 3D code, works everywhere
- Cons: Not interactive, can't respond to scroll

### Option B: Lottie Animation (Medium)
- Create animation in After Effects
- Export as Lottie JSON
- Use `lottie-web` or `lottie-react`
- Pros: Lightweight, scalable, easy
- Cons: 2.5D only, limited interactivity

### Option C: Spline (No-Code 3D)
- Build scene in [Spline](https://spline.design)
- Export as embed/React component
- Pros: No 3D coding needed, visual editor
- Cons: Less control, paid for advanced features

### Option D: Full Three.js (Full Control)
- Everything above
- Pros: Complete control, best performance
- Cons: Steep learning curve, more code

---

## Recommendation

**Start with Option C (Spline)** to prototype fast, then move to Option D (Three.js) for production.

1. Build the scene in Spline (free tier)
2. Test the scroll interaction
3. If performance is good → keep it
4. If you need more control → rebuild in Three.js

---

## Resources

- [React Three Fiber Docs](https://docs.pmnd.rs/react-three-fiber)
- [Drei Helpers](https://github.com/pmndrs/drei)
- [Mixamo](https://mixamo.com) — Free animations
- [Sketchfab](https://sketchfab.com) — Free 3D models
- [Spline](https://spline.design) — No-code 3D
- [GSAP ScrollTrigger](https://greensock.com/docs/v3/Plugins/ScrollTrigger)
- [Meshy.ai](https://meshy.ai) — AI 3D generation
- [ReadyPlayerMe](https://readyplayerme.com) — Free avatar creator
