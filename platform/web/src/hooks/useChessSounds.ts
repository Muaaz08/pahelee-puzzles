'use client';

const SOUND_SRC = {
  move: './assets/chess-move.mp3',
  illegal: './assets/illegal-move.mp3',
  victory: './assets/victory-bell.mp3',
  incorrect: './assets/incorrect-move.mp3',
};

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
  }
  return audioCtx;
}

function playTone(freq: number, duration: number, type: OscillatorType = 'sine', volume = 0.3) {
  try {
    const ctx = getAudioContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(freq, ctx.currentTime);
    
    gainNode.gain.setValueAtTime(volume, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
    
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration);
  } catch {
    // Silent fail
  }
}

function playChord(frequencies: number[], duration: number) {
  try {
    const ctx = getAudioContext();
    frequencies.forEach((freq, i) => {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(freq, ctx.currentTime);
      
      const startTime = ctx.currentTime + i * 0.1;
      gainNode.gain.setValueAtTime(0, startTime);
      gainNode.gain.linearRampToValueAtTime(0.25, startTime + 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
      
      oscillator.start(startTime);
      oscillator.stop(startTime + duration);
    });
  } catch {
    // Silent fail
  }
}

export function useChessSounds() {
  const playMove = async () => {
    try {
      const audio = new Audio(SOUND_SRC.move);
      audio.volume = 0.5;
      await audio.play();
    } catch {
      playTone(880, 0.1);
    }
  };

  const playIllegal = async () => {
    try {
      const audio = new Audio(SOUND_SRC.illegal);
      audio.volume = 0.6;
      await audio.play();
    } catch {
      playTone(200, 0.3, 'sawtooth', 0.3);
    }
  };

  const playVictory = async () => {
    try {
      const audio = new Audio(SOUND_SRC.victory);
      audio.volume = 0.7;
      await audio.play();
    } catch {
      playChord([523, 659, 784, 1047], 0.6);
    }
  };

  const playIncorrect = async () => {
    try {
      const audio = new Audio(SOUND_SRC.incorrect);
      audio.volume = 0.6;
      await audio.play();
    } catch {
      playTone(440, 0.2, 'square', 0.2);
    }
  };

  return { playMove, playIllegal, playVictory, playIncorrect };
}