import { useCallback, useMemo, useState, createContext, useContext } from "react";
import { DEFAULT_USER_RATING } from "@/data/rewards";
import type { Difficulty } from "@/data/puzzles";

export type PuzzleResult = {
  puzzleId: number | string;
  rating: number;
  correct: boolean;
  solveTimeSec: number;
  hintsUsed: number;
  timestamp: number;
};

type Ctx = {
  userSkillRating: number;
  sessionCorrect: number;
  sessionTotal: number;
  sessionXp: number;
  streak: number;
  recentResults: PuzzleResult[];
  themeFailures: Record<string, number>;
  consecutiveHints: number;
  isHotStreak: boolean;
  lastSolveTime: number;

  increaseRating: (amount: number) => void;
  decreaseRating: (amount: number) => void;
  addSessionXp: (amount: number) => void;
  incrementStreak: () => void;
  resetStreak: () => void;
  registerPuzzleResult: (result: Omit<PuzzleResult, "timestamp">) => void;
  trackThemeFailure: (theme: string) => void;
  registerHintUse: () => void;
  resetSession: () => void;
  getRecommendedDifficulty: () => Difficulty;
  getPuzzleVariance: () => number;
  isComebackMode: () => boolean;
};

const GamificationContext = createContext<Ctx | null>(null);

export function GamificationProvider({ children }: { children: React.ReactNode }) {
  const [userSkillRating, setUserSkillRating] = useState(DEFAULT_USER_RATING);
  const [sessionCorrect, setSessionCorrect] = useState(0);
  const [sessionTotal, setSessionTotal] = useState(0);
  const [sessionXp, setSessionXp] = useState(0);
  const [streak, setStreak] = useState(0);
  const [recentResults, setRecentResults] = useState<PuzzleResult[]>([]);
  const [themeFailures, setThemeFailures] = useState<Record<string, number>>({});
  const [consecutiveHints, setConsecutiveHints] = useState(0);
  const [isHotStreak, setIsHotStreak] = useState(false);
  const [lastSolveTime, setLastSolveTime] = useState(0);

  const increaseRating = useCallback((amount: number) => {
    setUserSkillRating((r) => Math.min(r + amount, 2500));
  }, []);

  const decreaseRating = useCallback((amount: number) => {
    setUserSkillRating((r) => Math.max(r - amount, 100));
  }, []);

  const addSessionXp = useCallback((amount: number) => {
    setSessionXp((xp) => xp + amount);
  }, []);

  const incrementStreak = useCallback(() => {
    setStreak((s) => s + 1);
  }, []);

  const resetStreak = useCallback(() => {
    setStreak(0);
  }, []);

  const registerPuzzleResult = useCallback((result: Omit<PuzzleResult, "timestamp">) => {
    setRecentResults((prev) => {
      const updated = [...prev, { ...result, timestamp: Date.now() }];
      return updated.slice(-5);
    });
    setSessionTotal((t) => t + 1);
    if (result.correct) {
      setSessionCorrect((c) => c + 1);
      setSessionXp((xp) => xp + 10);
      setStreak((s) => s + 1);
    } else {
      setStreak(0);
    }
    setLastSolveTime(result.solveTimeSec);

    const fastAndStreak = result.solveTimeSec < 8 && result.correct;
    setIsHotStreak(fastAndStreak);

    if (result.correct && result.hintsUsed === 0) {
      setConsecutiveHints(0);
    }
  }, []);

  const trackThemeFailure = useCallback((theme: string) => {
    setThemeFailures((prev) => ({
      ...prev,
      [theme]: (prev[theme] || 0) + 1,
    }));
    setConsecutiveHints((h) => h + 1);
  }, []);

  const registerHintUse = useCallback(() => {
    setConsecutiveHints((h) => h + 1);
  }, []);

  const resetSession = useCallback(() => {
    setSessionCorrect(0);
    setSessionTotal(0);
    setSessionXp(0);
    setStreak(0);
    setRecentResults([]);
    setIsHotStreak(false);
    setLastSolveTime(0);
  }, []);

  const getRecommendedDifficulty = useCallback((): Difficulty => {
    const rating = userSkillRating;
    if (rating < 600) return "Easy";
    if (rating < 900) return "Medium";
    return "Hard";
  }, [userSkillRating]);

  const getPuzzleVariance = useCallback((): number => {
    const rating = userSkillRating;
    if (rating < 500) return 50;
    if (rating < 800) return 75;
    return 100;
  }, [userSkillRating]);

  const isComebackMode = useCallback((): boolean => {
    const last5 = recentResults.slice(-5);
    const failures = last5.filter((r) => !r.correct).length;
    return failures >= 2;
  }, [recentResults]);

  const value = useMemo<Ctx>(() => ({
    userSkillRating,
    sessionCorrect,
    sessionTotal,
    sessionXp,
    streak,
    recentResults,
    themeFailures,
    consecutiveHints,
    isHotStreak,
    lastSolveTime,
    increaseRating,
    decreaseRating,
    addSessionXp,
    incrementStreak,
    resetStreak,
    registerPuzzleResult,
    trackThemeFailure,
    registerHintUse,
    resetSession,
    getRecommendedDifficulty,
    getPuzzleVariance,
    isComebackMode,
  }), [
    userSkillRating,
    sessionCorrect,
    sessionTotal,
    sessionXp,
    streak,
    recentResults,
    themeFailures,
    consecutiveHints,
    isHotStreak,
    lastSolveTime,
    increaseRating,
    decreaseRating,
    addSessionXp,
    incrementStreak,
    resetStreak,
    registerPuzzleResult,
    trackThemeFailure,
    registerHintUse,
    resetSession,
    getRecommendedDifficulty,
    getPuzzleVariance,
    isComebackMode,
  ]);

  return (
    <GamificationContext.Provider value={value}>
      {children}
    </GamificationContext.Provider>
  );
}

export function useGamification() {
  const ctx = useContext(GamificationContext);
  if (!ctx) throw new Error("useGamification must be used inside GamificationProvider");
  return ctx;
}