import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { AppPersisted, loadState, saveState } from "@/lib/storage";
import type { LichessPuzzleDifficulty, LichessPuzzleTheme } from "@/lib/lichess-puzzles";

export type Mode = "infinite" | "timer";

type Ctx = {
  // persisted
  liked: Set<number | string>;
  saved: Set<number | string>;
  bestStreak: number;
  totalSolved: number;
  attempts: number;
  correctMoves: number;
  accuracy: number;

  // session
  mode: Mode;
  setMode: (m: Mode) => void;
  puzzleTheme: LichessPuzzleTheme;
  setPuzzleTheme: (theme: LichessPuzzleTheme) => void;
  puzzleDifficulty: LichessPuzzleDifficulty;
  setPuzzleDifficulty: (difficulty: LichessPuzzleDifficulty) => void;
  streak: number;
  registerSolve: (puzzleId: number | string) => void;
  registerWrong: () => void;
  registerAttempt: (correct: boolean) => void;
  toggleLike: (id: number | string) => void;
  toggleSave: (id: number | string) => void;
  resetStreak: () => void;

  // timer
  timerDurationSec: number;
  setTimerDurationSec: (s: number) => void;
  timerRemainingSec: number;
  timerActive: boolean;
  startTimer: () => void;
  stopTimer: () => void;
  timerSolved: number;
};

const AppContext = createContext<Ctx | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [persisted, setPersisted] = useState<AppPersisted>(() => loadState());
  const [mode, setModeInternal] = useState<Mode>(() => loadState().mode);
  const [puzzleTheme, setPuzzleTheme] = useState<LichessPuzzleTheme>("mix");
  const [puzzleDifficulty, setPuzzleDifficulty] = useState<LichessPuzzleDifficulty>("normal");
  const [streak, setStreak] = useState(0);

  const [timerDurationSec, setTimerDurationSecInternal] = useState(() => loadState().timerDurationSec);
  const [timerRemainingSec, setTimerRemainingSec] = useState(() => loadState().timerDurationSec);
  const [timerActive, setTimerActive] = useState(false);
  const [timerSolved, setTimerSolved] = useState(0);

  const setMode = useCallback((m: Mode) => {
    setModeInternal(m);
    setPersisted((p) => ({ ...p, mode: m }));
  }, []);

  const setTimerDurationSec = useCallback((s: number) => {
    setTimerDurationSecInternal(s);
    setTimerRemainingSec(s);
    setPersisted((p) => ({ ...p, timerDurationSec: s }));
  }, []);

  useEffect(() => saveState(persisted), [persisted]);

  // Timer tick
  useEffect(() => {
    if (!timerActive) return;
    if (timerRemainingSec <= 0) {
      setTimerActive(false);
      return;
    }
    const t = window.setTimeout(() => setTimerRemainingSec((s) => s - 1), 1000);
    return () => window.clearTimeout(t);
  }, [timerActive, timerRemainingSec]);

  const startTimer = useCallback(() => {
    setTimerRemainingSec(timerDurationSec);
    setTimerSolved(0);
    setTimerActive(true);
  }, [timerDurationSec]);

  const stopTimer = useCallback(() => {
    setTimerActive(false);
  }, []);

  const registerSolve = useCallback((_puzzleId: number | string) => {
    setPersisted((p) => ({
      ...p,
      totalSolved: p.totalSolved + 1,
      bestStreak: Math.max(p.bestStreak, streak + 1),
    }));
    setStreak((s) => s + 1);
    if (mode === "timer" && timerActive) setTimerSolved((n) => n + 1);
  }, [mode, streak, timerActive]);

  const registerWrong = useCallback(() => {
    setStreak(0);
  }, []);

  const registerAttempt = useCallback((correct: boolean) => {
    setPersisted((p) => ({
      ...p,
      attempts: p.attempts + 1,
      correctMoves: p.correctMoves + (correct ? 1 : 0),
    }));
  }, []);

  const toggleLike = useCallback((id: number | string) => {
    setPersisted((p) => {
      const next = new Set(p.liked);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return { ...p, liked: Array.from(next) };
    });
  }, []);

  const toggleSave = useCallback((id: number | string) => {
    setPersisted((p) => {
      const next = new Set(p.saved);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return { ...p, saved: Array.from(next) };
    });
  }, []);

  const resetStreak = useCallback(() => setStreak(0), []);

  const value = useMemo<Ctx>(() => ({
    liked: new Set(persisted.liked),
    saved: new Set(persisted.saved),
    bestStreak: persisted.bestStreak,
    totalSolved: persisted.totalSolved,
    attempts: persisted.attempts,
    correctMoves: persisted.correctMoves,
    accuracy: persisted.attempts ? Math.round((persisted.correctMoves / persisted.attempts) * 100) : 0,
    mode, setMode,
    puzzleTheme, setPuzzleTheme,
    puzzleDifficulty, setPuzzleDifficulty,
    streak,
    registerSolve, registerWrong, registerAttempt,
    toggleLike, toggleSave, resetStreak,
    timerDurationSec, setTimerDurationSec,
    timerRemainingSec, timerActive, startTimer, stopTimer, timerSolved,
  }), [persisted, mode, setMode, puzzleTheme, puzzleDifficulty, streak, registerSolve, registerWrong, registerAttempt, toggleLike, toggleSave, resetStreak, timerDurationSec, setTimerDurationSec, timerRemainingSec, timerActive, startTimer, stopTimer, timerSolved]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}
