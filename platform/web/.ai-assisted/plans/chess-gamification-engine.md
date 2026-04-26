# Chess Gamification Engine — Implementation Plan

## Overview

Build a comprehensive gamification engine for the swipe-based chess puzzle app. Focus on engagement systems: reward feedback, adaptive difficulty, hint progression, and ethical retention loops.

---

## Phase 1: Core State & Rewards Data

### New File: `src/data/rewards.ts`

- Rotating success phrases (9):
  - "Brilliant!"
  - "Sharp Move!"
  - "Clean Tactic!"
  - "Nice Find!"
  - "Excellent Vision!"
  - "Smart Play!"
  - "Smooth Win!"
  - "Tactical Beast 🔥"
  - "Genius Spot 👀"

- Wrong move phrases (7):
  - "Close one — try again."
  - "Nice try. Look for checks first."
  - "Good idea. There's a stronger move."
  - "You're learning fast."
  - "Almost had it."
  - "One more try 🔥"
  - "Strong players miss these too."

- Milestone map:
  - 3 → "Nice Start"
  - 5 → "On Fire"
  - 10 → "Sharp Eyes"
  - 20 → "Monster Form"
  - 50 → "Tactical Machine"

- Reward multipliers config:
  - Speed Bonus: +20 (solved under 8 sec)
  - No Hint Bonus: +15
  - Streak Bonus: +30 (3+ streak)
  - Upset Win: +40 (solved hard puzzle above level)

---

## Phase 2: Gamification Store

### New File: `src/store/gamification-store.tsx`

State managed:
- `userSkillRating`: number (starts at 500)
- `sessionCorrect`: number
- `sessionTotal`: number
- `recentResults`: array of last 5 puzzle results
- `themeFailures`: map of theme → failure count
- `hintLevelUsed`: current hint level for session
- `consecutiveHints`: count of hint-dependent puzzles
- `xpEarned`: total XP for session
- `lastSolveTime`: seconds for most recent solve
- `isHotStreak`: boolean (fast solving + streaking)

Update functions:
- `increaseRating(amount)`: +100 (3 correct), +20 (fast), +40 (upset), +50 (5 streak)
- `decreaseRating(amount)`: -75 (2 failures in 5), -25 (skip), -20 (hint dependency)
- `trackThemeFailure(theme)`: record failed theme
- `startSession()`: reset session stats
- `getRecommendedDifficulty()`: return rating ± variance

---

## Phase 3: Reward System Hook

### New File: `src/hooks/useRewardSystem.ts`

Functions:
- `triggerSuccess(puzzle, solveTime, hintsUsed, isStreak)`:
  - Select random success phrase
  - Calculate XP bonuses (speed, no hint, streak, upset)
  - Trigger visual feedback (glow pulse, success flash)
  - Play victory sound
  - Show XP popup
  - Check milestone

- `triggerWrong()`:
  - Select random wrong phrase
  - Trigger shake animation
  - Revert board smoothly
  - After 2 wrong: offer gentle hint prompt

- `calculateTotalXP(puzzle, solveTime, hintsUsed, streak)`

---

## Phase 4: Adaptive Difficulty Hook

### New File: `src/hooks/useAdaptiveDifficulty.ts`

- `getPuzzleVariance()`: return controlled variance for current rating
  - For rating 800: serve 700, 760, 810, 780, 920

- `selectNextPuzzle(puzzles)`:
  - Filter puzzles near current level
  - Apply emotional pacing: Easy → Easy → Medium → Easy → Hard → Easy
  - Implement comeback recovery: after 2+ fails, serve easy win

- `rateUserPerformance(result)`:
  - Update rating based on solve outcome
  - Track recent failures for comeback logic

- Hot streak detection: raise difficulty temporarily

---

## Phase 5: Progressive Hint System

### New File: `src/hooks/useHintEngine.ts`

Hint Levels 1-5:
1. Highlight best piece to move
2. Highlight destination square
3. Animate first move
4. Show opponent best response
5. Show full winning continuation (step-by-step)

Hint UX language:
- "Watch the follow-up."
- "What happens after their reply?"
- "Your first move creates this tactic."

XP Impact: reduces bonuses but doesn't heavily punish

---

## Phase 6: UI Components

### New Files:

#### `src/components/GamificationOverlay.tsx`
- Floating XP popup (+20 Speed Bonus, +15 No Hint, etc.)
- Streak flame animation at milestone
- Milestone celebration toast

#### `src/components/SessionStats.tsx`
- Compact stats bar: XP | Streak 🔥 | Rating
- Horizontal layout, positioned top-right

---

## Phase 7: CSS Animations

Add to `src/index.css`:

```css
/* Success flash */
@keyframes flash-success {
  0%, 100% { background-color: transparent; }
  50% { background-color: hsl(73 100% 50% / 0.15); }
}
.animate-flash-success { animation: flash-success 0.6s ease-out; }

/* Streak flame */
@keyframes streak-flame {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.2); opacity: 0.8; }
}
.animate-streak-flame { animation: streak-flame 0.8s ease-in-out infinite; }

/* XP popup float */
@keyframes xp-float-up {
  0% { opacity: 0; transform: translateY(20px); }
  20% { opacity: 1; transform: translateY(0); }
  80% { opacity: 1; }
  100% { opacity: 0; transform: translateY(-30px); }
}
.animate-xp-float { animation: xp-float-up 1.5s ease-out forwards; }

/* Milestone glow pulse */
@keyframes milestone-glow {
  0%, 100% { box-shadow: 0 0 0 0 hsl(73 100% 50% / 0.6); }
  50% { box-shadow: 0 0 20px 4px hsl(73 100% 50% / 0.4); }
}
.animate-milestone-glow { animation: milestone-glow 1s ease-out; }
```

---

## Phase 8: Integration

### Modify `src/store/app-store.tsx`

- Import from gamification-store
- Add `userSkillRating` to interface and persisted state

### Modify `src/components/PuzzleCard.tsx`

- Import reward hooks
- On solve: call `triggerSuccess()`
- On wrong: call `triggerWrong()`
- Show session stats bar
- Display streak badge with milestone styling

### Modify `src/components/PuzzleFeed.tsx`

- Import adaptive difficulty hook
- Filter puzzles by recommended difficulty
- Implement pacing logic

### Modify `src/components/ActionBar.tsx`

- Import streak flame animation
- Show milestone name when applicable

---

## Phase 9: Metrics Tracking

Add to `src/store/gamification-store.tsx`:

- `sessionStats`:
  - solvePercent: percentage of correct solves
  - avgSolveTime: average time per puzzle
  - hintUsagePercent: hints used / total attempts
  - quitAfterFailPercent: quits after fail / total fails
  - streakHighs: array of achieved streaks
  - bestDifficultyTolerated: highest rating solved consistently
  - sessionLength: total puzzles in session
  - consecutivePuzzleCount: sequential solves

---

## Final Feeling

Every user should feel:
- "I'm improving."
- "I'm smart."
- "Just one more puzzle."
- "That was fun."
- "I can beat my streak."

---

## File Summary

### New Files (8)
| Path | Purpose |
|------|---------|
| `src/data/rewards.ts` | All phrases, milestones, multipliers |
| `src/store/gamification-store.tsx` | Gamification state & updates |
| `src/hooks/useRewardSystem.ts` | Success/wrong triggers, XP calc |
| `src/hooks/useAdaptiveDifficulty.ts` | Puzzle selection, pacing |
| `src/hooks/useHintEngine.ts` | Progressive hint levels |
| `src/components/GamificationOverlay.tsx` | XP popups, milestone toast |
| `src/components/SessionStats.tsx` | Stats bar UI |
| `src/components/RewardFeedback.tsx` | Animation components |

### Modified Files (5)
| Path | Changes |
|------|---------|
| `src/store/app-store.tsx` | Bridge to gamification store |
| `src/lib/storage.ts` | Persist gamification state |
| `src/components/PuzzleCard.tsx` | Integrate rewards |
| `src/components/PuzzleFeed.tsx` | Adaptive selection |
| `src/index.css` | Animations |

---

## Timeline

1. Phase 1-2: Core data + store (1 hour)
2. Phase 3-4: Reward + adaptive logic (1.5 hours)
3. Phase 5-6: Hint system + UI (1 hour)
4. Phase 7-8: CSS + integration (1 hour)
5. Phase 9: Metrics + polish (0.5 hours)

Total: ~5 hours