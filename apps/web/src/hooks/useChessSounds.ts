'use client';

export function useChessSounds() {
  const playMove = () => {
    const audio = new Audio('/sounds/chess-move.mp3');
    audio.volume = 0.5;
    audio.play().catch(() => {});
  };

  const playIllegal = () => {
    const audio = new Audio('/sounds/illegal-move.mp3');
    audio.volume = 0.6;
    audio.play().catch(() => {});
  };

  const playVictory = () => {
    const audio = new Audio('/sounds/victory-bell.mp3');
    audio.volume = 0.7;
    audio.play().catch(() => {});
  };

  return { playMove, playIllegal, playVictory };
}