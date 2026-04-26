export const SUCCESS_PHRASES = [
  "Brilliant!",
  "Sharp Move!",
  "Clean Tactic!",
  "Nice Find!",
  "Excellent Vision!",
  "Smart Play!",
  "Smooth Win!",
  "Tactical Beast",
  "Genius Spot",
] as const;

export const WRONG_PHRASES = [
  "Close one — try again.",
  "Nice try. Look for checks first.",
  "Good idea. There's a stronger move.",
  "You're learning fast.",
  "Almost had it.",
  "One more try",
  "Strong players miss these too.",
] as const;

export const MILESTONES: Record<number, string> = {
  3: "Nice Start",
  5: "On Fire",
  10: "Sharp Eyes",
  20: "Monster Form",
  50: "Tactical Machine",
};

export const REWARD_MULTIPLIERS = {
  speedBonus: { thresholdSec: 8, xp: 20 },
  noHintBonus: { xp: 15 },
  streakBonus: { minStreak: 3, xp: 30 },
  upsetWin: { xp: 40 },
} as const;

export const HINT_PROMPTS = [
  "Want a clue?",
  "Need a small nudge?",
  "Try a hint and keep going.",
] as const;

export const HINT_LEVELS = [
  { level: 1, text: "This piece is the key." },
  { level: 2, text: "Try moving to this square." },
  { level: 3, text: "Watch the follow-up." },
  { level: 4, text: "What happens after their reply?" },
  { level: 5, text: "Your first move creates this tactic." },
] as const;

export const DEFAULT_USER_RATING = 500;

export const RATING_VARIANCE = 100;

export const TARGET_SUCCESS_RATE = 0.7;

export const COMEBACK_DIFFICULTIES: ("Easy" | "Medium" | "Hard")[] = [
  "Easy",
  "Easy",
  "Easy",
  "Medium",
];