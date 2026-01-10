# Phase 0: Research

## Problem Analysis
The `SkillsSlider` component handles infinite scrolling by duplicating the skills list 3 times: `[Skills, Skills, Skills]`.

### Current Behavior
- **LTR (`isRTL=false`)**: 
  - Starts at `-width/6`.
  - Moves Left (negative speed).
  - Resets when `x <= -width/3`.
  - This works because it moves deeper into the negative range, revealing the right-side clones.

- **RTL (`isRTL=true`)**:
  - Starts at `0`.
  - Moves Right (positive speed).
  - Resets when `x >= width/3`.
  - **Issue**: Starting at `0` (the leftmost edge of the content) and moving Right pushes the content away, leaving an empty gap on the left until the loop resets.

## Solution Strategy
To achieve a seamless "Left-to-Right" flow (items entering from the left) in RTL:
1. **Initial Position**: Start at `-width/3`. This positions the view at the start of the *second* set of skills.
2. **Movement**: Move Right (positive speed). `x` increases from `-width/3` towards `0`.
3. **Reset**: When `x >= 0` (reaching the start of the *first* set, which looks identical to the start of the second set), reset to `-width/3`.

This ensures that as we move Right, we reveal the "first" set of skills which was previously off-screen to the left (because we were viewing the second set).

## Decision
- Modify `SkillsSlider.tsx` to use the `[-width/3, 0]` range for RTL.
- Ensure initial `x` is set correctly on mount/resize.
