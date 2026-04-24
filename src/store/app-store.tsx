import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { AppPersisted, loadState, saveState } from "@/lib/storage";

export type Mode = "infinite" | "timer";

type Ctx = {
  // persisted
  liked: Set<number>;
  saved: Set<number>;
  bestStreak: number;
  totalSolved: number;
  attempts: number;
  correctMoves: number;
  accuracy: number;

  // session
  mode: Mode;
  setMode: (m: Mode) => void;
  streak: number;
  registerSolve: (puzzleId: number) => void;
  registerWrong: () => void;
  registerAttempt: (correct: boolean) => void;
  toggleLike: (id: number) => void;
  toggleSave: (id: number) => void;
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
  const [mode, setMode] = useState<Mode>("infinite");
  const [streak, setStreak] = useState(0);

  const [timerDurationSec, setTimerDurationSec] = useState(120);
  const [timerRemainingSec, setTimerRemainingSec] = useState(120);
  const [timerActive, setTimerActive] = useState(false);
  const [timerSolved, setTimerSolved] = useState(0);

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

  const registerSolve = useCallback((_puzzleId: number) => {
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

  const toggleLike = useCallback((id: number) => {
    setPersisted((p) => {
      const next = new Set(p.liked);
      next.has(id) ? next.delete(id) : next.add(id);
      return { ...p, liked: Array.from(next) };
    });
  }, []);

  const toggleSave = useCallback((id: number) => {
    setPersisted((p) => {
      const next = new Set(p.saved);
      next.has(id) ? next.delete(id) : next.add(id);
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
    streak,
    registerSolve, registerWrong, registerAttempt,
    toggleLike, toggleSave, resetStreak,
    timerDurationSec, setTimerDurationSec,
    timerRemainingSec, timerActive, startTimer, stopTimer, timerSolved,
  }), [persisted, mode, streak, registerSolve, registerWrong, registerAttempt, toggleLike, toggleSave, resetStreak, timerDurationSec, timerRemainingSec, timerActive, startTimer, stopTimer, timerSolved]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}