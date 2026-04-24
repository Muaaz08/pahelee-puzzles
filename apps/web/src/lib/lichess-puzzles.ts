import { Chess } from "chess.js";
import type { Difficulty, Puzzle } from "@/data/puzzles";

export const LICHESS_PUZZLE_THEMES = [
  { value: "mix", label: "Mix" },
  { value: "mate", label: "Mate" },
  { value: "fork", label: "Fork" },
  { value: "pin", label: "Pin" },
  { value: "endgame", label: "Endgame" },
  { value: "opening", label: "Opening" },
  { value: "middlegame", label: "Middlegame" },
  { value: "advantage", label: "Advantage" },
] as const;

export const LICHESS_PUZZLE_DIFFICULTIES = [
  { value: "easiest", label: "Easiest", display: "Easy" },
  { value: "easier", label: "Easier", display: "Easy" },
  { value: "normal", label: "Normal", display: "Medium" },
  { value: "harder", label: "Harder", display: "Hard" },
  { value: "hardest", label: "Hardest", display: "Hard" },
] as const;

export type LichessPuzzleTheme = (typeof LICHESS_PUZZLE_THEMES)[number]["value"];
export type LichessPuzzleDifficulty = (typeof LICHESS_PUZZLE_DIFFICULTIES)[number]["value"];

type LichessPuzzleBatch = {
  puzzles: LichessPuzzleItem[];
};

export type LichessPuzzleItem = {
  game: {
    pgn: string;
  };
  puzzle: {
    id: string;
    rating: number;
    solution: string[];
    themes: string[];
    initialPly: number;
  };
};

export function buildLichessPuzzleUrl({
  theme,
  difficulty,
  count,
}: {
  theme: LichessPuzzleTheme;
  difficulty: LichessPuzzleDifficulty;
  count: number;
}) {
  const url = new URL(`https://lichess.org/api/puzzle/batch/${theme}`);
  url.searchParams.set("difficulty", difficulty);
  url.searchParams.set("nb", String(count));
  return url.toString();
}

export async function fetchLichessPuzzles({
  theme,
  difficulty,
  count = 15,
}: {
  theme: LichessPuzzleTheme;
  difficulty: LichessPuzzleDifficulty;
  count?: number;
}): Promise<Puzzle[]> {
  const response = await fetch(buildLichessPuzzleUrl({ theme, difficulty, count }), {
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    throw new Error(`Lichess puzzle request failed with ${response.status}`);
  }

  const batch = (await response.json()) as LichessPuzzleBatch;
  return batch.puzzles.map((item) => adaptLichessPuzzle(item, difficulty));
}

export function adaptLichessPuzzle(item: LichessPuzzleItem, difficulty: LichessPuzzleDifficulty): Puzzle {
  const game = new Chess();
  game.loadPgn(item.game.pgn);
  const moves = game.history();
  const position = new Chess();

  moves.slice(0, item.puzzle.initialPly + 1).forEach((move) => {
    position.move(move);
  });

  const primaryTheme = item.puzzle.themes.find((theme) => theme !== "long" && theme !== "short") ?? item.puzzle.themes[0] ?? "Puzzle";

  return {
    id: item.puzzle.id,
    fen: position.fen(),
    solution: item.puzzle.solution,
    sideToMove: position.turn(),
    rating: item.puzzle.rating,
    difficulty: mapLichessDifficulty(difficulty),
    theme: formatTheme(primaryTheme),
    tags: item.puzzle.themes,
  };
}

function mapLichessDifficulty(difficulty: LichessPuzzleDifficulty): Difficulty {
  return LICHESS_PUZZLE_DIFFICULTIES.find((item) => item.value === difficulty)?.display ?? "Medium";
}

function formatTheme(theme: string) {
  return theme
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}
