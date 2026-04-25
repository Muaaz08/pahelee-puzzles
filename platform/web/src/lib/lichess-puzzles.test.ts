import { describe, expect, it } from "vitest";
import {
  adaptLichessPuzzle,
  buildLichessPuzzleUrl,
  type LichessPuzzleItem,
} from "./lichess-puzzles";

const samplePuzzle: LichessPuzzleItem = {
  game: {
    pgn: "e4 e6 d4 c6 c4 d5 cxd5 cxd5 e5 h6 Nc3 Qa5 Bd2 Nc6 Nf3 Bd7 a3 Nge7 b4 Qc7",
  },
  puzzle: {
    id: "B5NPC",
    rating: 1377,
    solution: ["c3b5", "c7b8", "b5d6", "b8d6", "e5d6"],
    themes: ["opening", "crushing", "long"],
    initialPly: 19,
  },
};

describe("lichess puzzle adapter", () => {
  it("builds the Lichess batch URL", () => {
    expect(buildLichessPuzzleUrl({ theme: "mate", difficulty: "harder", count: 12 })).toBe(
      "https://lichess.org/api/puzzle/batch/mate?difficulty=harder&nb=12",
    );
  });

  it("adapts Lichess PGN puzzles into the app puzzle shape", () => {
    const puzzle = adaptLichessPuzzle(samplePuzzle, "easier");

    expect(puzzle).toMatchObject({
      id: "B5NPC",
      fen: "r3kb1r/ppqbnpp1/2n1p2p/3pP3/1P1P4/P1N2N2/3B1PPP/R2QKB1R w KQkq - 1 11",
      sideToMove: "w",
      rating: 1377,
      difficulty: "Easy",
      theme: "Opening",
      tags: ["opening", "crushing", "long"],
      solution: ["c3b5", "c7b8", "b5d6", "b8d6", "e5d6"],
    });
  });
});
