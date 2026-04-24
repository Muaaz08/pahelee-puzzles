const KEY = "pahelee:v1";

export type AppPersisted = {
  liked: number[];
  saved: number[];
  bestStreak: number;
  totalSolved: number;
  attempts: number;
  correctMoves: number;
};

const DEFAULTS: AppPersisted = {
  liked: [],
  saved: [],
  bestStreak: 0,
  totalSolved: 0,
  attempts: 0,
  correctMoves: 0,
};

export function loadState(): AppPersisted {
  if (typeof window === "undefined") return { ...DEFAULTS };
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { ...DEFAULTS };
    return { ...DEFAULTS, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULTS };
  }
}

export function saveState(s: AppPersisted) {
  try {
    localStorage.setItem(KEY, JSON.stringify(s));
  } catch {
    /* ignore */
  }
}