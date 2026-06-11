# Portfolio Hero Section — Interactive 3D Avatar (Refined Vision)

## Vision Summary

A professional, animated 3D avatar that:
1. **Fades** between sections (not walks/scrolls)
2. **Scroll snap** — each section snaps into place
3. **Animated** — typing, clicking mouse, head moving between two screens
4. **Professional transitions** — smooth sliding from hero to next section

## Technical Approach

### Core Libraries
- **React Three Fiber** — 3D rendering in React
- **@react-three/drei** — helpers (animations, controls)
- **GSAP + ScrollTrigger** — scroll-linked animations
- **Framer Motion** — fade transitions between sections

### 3D Assets Needed
1. **Avatar** — stylized 3D character (low-poly or realistic)
   - ReadyPlayerMe or Mixamo for base model
   - Custom animations: typing, mouse clicking, head turning
2. **Desk Scene** — desk, chair, dual monitors
   - Sketchfab or Poly Pizza for base models
   - Customize to match your setup
3. **Screen Content** — looping video/animation of your actual work
   - Record your screen while coding
   - Or create Lottie animations

### Animation States Per Section

```
[Hero Section]
├── Avatar: Standing/waving (idle)
├── Scene: Full desk visible
└── Transition: Fade in

[About Section]
├── Avatar: Sits down at desk
├── Animation: Typing on keyboard
├── Screen: Code editor content
└── Transition: Fade from hero

[Projects Section]
├── Avatar: Working at computer
├── Animation: Mouse clicking, head turning between screens
├── Screen: Design tools / portfolio pieces
└── Transition: Fade from about

[Contact Section]
├── Avatar: Presenting/showing
├── Animation: Pointing at screen
├── Screen: Contact info / social links
└── Transition: Fade from projects
```

### Scroll Behavior

```css
/* Scroll snap for section snapping */
.scroll-container {
  scroll-snap-type: y mandatory;
  overflow-y: scroll;
  height: 100vh;
}

.section {
  scroll-snap-align: start;
  height: 100vh;
}
```

### Fade Transition System

```tsx
// Pseudocode for fade transitions
const [activeSection, setActiveSection] = useState(0);

useScrollTrigger({
  onScroll: (progress) => {
    const section = Math.floor(progress * totalSections);
    setActiveSection(section);
  }
});

// Avatar fades between poses
<AnimatePresence mode="wait">
  <motion.div
    key={activeSection}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.5 }}
  >
    <Avatar pose={poses[activeSection]} />
  </motion.div>
</AnimatePresence>
```

### File Structure

```
src/
├── components/
│   ├── hero/
│   │   ├── HeroScene.tsx          # Main 3D canvas
│   │   ├── Avatar.tsx             # 3D avatar with animations
│   │   ├── DeskScene.tsx          # Desk, chair, monitors
│   │   ├── ComputerScreen.tsx     # Screen content (video/Lottie)
│   │   ├── ScrollController.tsx   # GSAP scroll integration
│   │   └── SectionFade.tsx        # Fade transition wrapper
│   └── sections/
│       ├── AboutSection.tsx
│       ├── ProjectsSection.tsx
│       └── ContactSection.tsx
├── hooks/
│   ├── useScrollProgress.ts
│   └── useSectionDetection.ts
public/
└── 3d/
    ├── avatar.glb
    ├── desk.glb
    └── animations/
        ├── idle.glb
        ├── sit-down.glb
        ├── typing.glb
        └── mouse-click.glb
```

### Implementation Phases

**Phase 1: 3D Scene Setup**
- Load avatar and desk models
- Set up Three.js scene with proper lighting
- Position camera for hero view
- Add Suspense with static fallback

**Phase 2: Avatar Animations**
- Idle animation (standing, breathing)
- Sit-down animation
- Typing animation (loop)
- Mouse click animation
- Head turn animation (between screens)

**Phase 3: Scroll Integration**
- GSAP ScrollTrigger for section detection
- Map scroll progress to avatar pose changes
- Fade transitions between sections
- Scroll snap CSS

**Phase 4: Screen Content**
- Record screen while coding
- Create looping video
- Map to 3D screen texture
- Sync with avatar animations

**Phase 5: Performance & Polish**
- Lazy load 3D scene
- Optimize models (compress textures)
- Add prefers-reduced-motion fallback
- Mobile responsiveness

### Performance Considerations
- Lazy load 3D scene (don't block initial render)
- Use Suspense with static image fallback
- Optimize 3D models (reduce polygons, compress textures)
- Consider lower-quality models for mobile
- Add loading state while 3D assets load

### Accessibility
- Respect `prefers-reduced-motion`
- Provide static fallback for all animations
- Ensure content is readable without 3D
- Keyboard navigation support
