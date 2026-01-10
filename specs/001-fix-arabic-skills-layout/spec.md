# Feature Specification: Fix Arabic Skills Slider Layout

## Requirement
The "Skills" slider in the Arabic (RTL) version has a visual bug.
- **Issue**: The content starts "too far to the left" (or creates a gap) and takes time to appear in the view.
- **Cause**: The `framer-motion` animation for RTL moves the container to the right (positive `x`). Since the container starts at `x=0` (left aligned), moving right creates an empty space on the left.
- **Goal**: Ensure the RTL slider loops seamlessly moving Left-to-Right, with no initial gap or delay.
- **Mechanism**: The slider should start at a negative offset (e.g., `-width/3`) so that off-screen content (the first clone) slides IN from the left. The loop should range from `-width/3` to `0` (or similar equivalent), snapping back to `-width/3` when `0` is reached.

## Functional Changes
- Update `SkillsSlider.tsx` logic for RTL direction.
- Adjust initial `x` value for RTL.
- Adjust reset logic in `useAnimationFrame` for RTL.
