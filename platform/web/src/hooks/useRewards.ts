import { useCallback, useState } from "react";
import {
  SUCCESS_PHRASES,
  WRONG_PHRASES,
  MILESTONES,
  REWARD_MULTIPLIERS,
} from "@/data/rewards";
import { useApp } from "@/store/app-store";

export type RewardState = {
  showSuccess: boolean;
  successPhrase: string;
  xpPopup: number | null;
  showXPFloating: boolean;
  showMilestone: boolean;
  milestoneName: string | null;
};

export type WrongState = {
  showWrong: boolean;
  wrongPhrase: string;
  showHintPrompt: boolean;
};

export function useRewards() {
  const { streak, registerSolve } = useApp();
  
  const [rewardState, setRewardState] = useState<RewardState>({
    showSuccess: false,
    successPhrase: "",
    xpPopup: null,
    showXPFloating: false,
    showMilestone: false,
    milestoneName: null,
  });

  const [wrongState, setWrongState] = useState<WrongState>({
    showWrong: false,
    wrongPhrase: "",
    showHintPrompt: false,
  });

  const [wrongAttempts, setWrongAttempts] = useState(0);

  const getRandomPhrase = useCallback(<T extends readonly string[]>(arr: T): T[number] => {
    return arr[Math.floor(Math.random() * arr.length)];
  }, []);

  const calculateXP = useCallback((
    solveTimeSec: number,
    hintsUsed: number,
    currentStreak: number,
    isCorrect: boolean,
    puzzleRating: number
  ): number => {
    if (!isCorrect) return 0;

    let xp = 10;

    if (solveTimeSec < REWARD_MULTIPLIERS.speedBonus.thresholdSec) {
      xp += REWARD_MULTIPLIERS.speedBonus.xp;
    }

    if (hintsUsed === 0) {
      xp += REWARD_MULTIPLIERS.noHintBonus.xp;
    }

    if (currentStreak >= REWARD_MULTIPLIERS.streakBonus.minStreak) {
      xp += REWARD_MULTIPLIERS.streakBonus.xp;
    }

    return xp;
  }, []);

  const triggerSuccess = useCallback((
    puzzleId: number | string,
    solveTimeSec: number,
    hintsUsed: number,
    puzzleRating: number
  ) => {
    const currentStreak = streak;
    const xp = calculateXP(solveTimeSec, hintsUsed, currentStreak, true, puzzleRating);
    const phrase = getRandomPhrase(SUCCESS_PHRASES);

    const nextStreak = currentStreak + 1;
    const milestone = MILESTONES[nextStreak as keyof typeof MILESTONES];
    
    setRewardState({
      showSuccess: true,
      successPhrase: phrase,
      xpPopup: xp,
      showXPFloating: true,
      showMilestone: !!milestone,
      milestoneName: milestone || null,
    });

    registerSolve(puzzleId);

    setWrongAttempts(0);

    setTimeout(() => {
      setRewardState((s) => ({ ...s, showSuccess: false, showXPFloating: false, showMilestone: false }));
    }, 1500);
  }, [calculateXP, getRandomPhrase, registerSolve, streak]);

  const triggerWrong = useCallback((
    theme: string,
    onHintPrompt?: () => void
  ) => {
    const attempts = wrongAttempts + 1;
    setWrongAttempts(attempts);

    const phrase = getRandomPhrase(WRONG_PHRASES);
    const needsHint = attempts >= 2;

    setWrongState({
      showWrong: true,
      wrongPhrase: phrase,
      showHintPrompt: needsHint,
    });

    if (needsHint && onHintPrompt) {
      setTimeout(() => onHintPrompt(), 800);
    }

    setTimeout(() => {
      setWrongState((s) => ({ ...s, showWrong: false, showHintPrompt: false }));
    }, 700);
  }, [wrongAttempts, getRandomPhrase]);

  const dismissHintPrompt = useCallback(() => {
    setWrongState((s) => ({ ...s, showHintPrompt: false }));
    setWrongAttempts(0);
  }, []);

  const dismissSuccess = useCallback(() => {
    setRewardState((s) => ({ ...s, showSuccess: false, showXPFloating: false }));
  }, []);

  return {
    rewardState,
    wrongState,
    triggerSuccess,
    triggerWrong,
    dismissHintPrompt,
    dismissSuccess,
    calculateXP,
    wrongAttempts,
  };
}