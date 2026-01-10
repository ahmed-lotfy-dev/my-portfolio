---

description: "Task list for feature implementation"
---

# Tasks: Fix Arabic Skills Slider Layout

**Input**: Design documents from `/specs/001-fix-arabic-skills-layout/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Not requested for this UI fix

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/`, `tests/` at repository root
- **Web app**: `backend/src/`, `frontend/src/`
- **Mobile**: `api/src/`, `ios/src/` or `android/src/`
- Paths shown below assume single project - adjust based on plan.md structure

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Verify project dependencies are installed
- [x] T002 [P] Run development server to ensure project starts correctly

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T003 Examine current SkillsSlider.tsx implementation in src/components/features/homepage/SkillsSlider.tsx
- [x] T004 [P] Test current RTL behavior to confirm the bug exists

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Fix RTL Skills Slider Layout (Priority: P1) 🎯 MVP

**Goal**: Ensure the RTL slider loops seamlessly moving Left-to-Right, with no initial gap or delay

**Independent Test**: Switch language to Arabic, scroll to Skills section, verify smooth left-to-right flow with no initial gap

### Implementation for User Story 1

- [x] T005 [US1] Update initial x position logic for RTL in useEffect in src/components/features/homepage/SkillsSlider.tsx
- [x] T006 [US1] Modify animation reset logic for RTL in useAnimationFrame in src/components/features/homepage/SkillsSlider.tsx
- [x] T007 [US1] Test RTL slider behavior in Arabic locale
- [x] T008 [US1] Verify LTR slider behavior remains unchanged
- [x] T009 [US1] Run quickstart.md validation to confirm fix

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T010 [P] Code cleanup and refactoring in src/components/features/homepage/SkillsSlider.tsx
- [x] T011 Add inline comments explaining RTL logic changes
- [x] T012 Run quickstart.md validation

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories

### Within Each User Story

- Core implementation before testing
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, all user stories can start in parallel (if team capacity allows)

---

## Parallel Example: User Story 1

```bash
# Launch all tests for User Story 1 together:
Task: "Test RTL slider behavior in Arabic locale"
Task: "Verify LTR slider behavior remains unchanged"

# Core implementation:
Task: "Update initial x position logic for RTL in useEffect in src/components/features/homepage/SkillsSlider.tsx"
Task: "Modify animation reset logic for RTL in useAnimationFrame in src/components/features/homepage/SkillsSlider.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
