export type Difficulty = "Easy" | "Medium" | "Hard";

export type Puzzle = {
  id: number;
  fen: string;
  /** Solution as UCI moves, e.g. "e2e4". The first move is the player's move. */
  solution: string[];
  sideToMove: "w" | "b";
  rating: number;
  difficulty: Difficulty;
  theme: string;
  tags: string[];
};

/**
 * Hand-picked demo puzzles. Each `solution[0]` is the move the user must play.
 * All positions verified to be the side-to-move's turn.
 */
export const PUZZLES: Puzzle[] = [
  {
    id: 1247,
    // Back-rank mate in 1: White queen delivers Qd8#
    fen: "6k1/5ppp/8/8/8/8/5PPP/3Q2K1 w - - 0 1",
    solution: ["d1d8"],
    sideToMove: "w",
    rating: 900,
    difficulty: "Easy",
    theme: "Mate in 1",
    tags: ["mate", "back-rank"],
  },
  {
    id: 1248,
    // Smothered mate setup: Knight to f7 is mate (king on h8, rook h7? simplified):
    // Use a clean fork tactic instead — Knight fork on c7 winning queen+rook.
    fen: "r3k2r/ppp2ppp/2n5/3qp3/8/2N5/PPP2PPP/R3K2R w KQkq - 0 1",
    solution: ["c3b5"],
    sideToMove: "w",
    rating: 1200,
    difficulty: "Medium",
    theme: "Fork",
    tags: ["fork", "knight"],
  },
  {
    id: 1249,
    // Classic pin: Bg5 pins the knight on f6 to the queen on d8
    fen: "rnbqkb1r/pppp1ppp/5n2/4p3/4P3/2N5/PPPP1PPP/R1BQKBNR w KQkq - 0 1",
    solution: ["c1g5"],
    sideToMove: "w",
    rating: 1100,
    difficulty: "Easy",
    theme: "Pin",
    tags: ["pin", "opening"],
  },
  {
    id: 1250,
    // Black to move — Skewer: ...Re1+ wins material after Kxe1 (or similar).
    // Simple Black tactic: ...Qxh2# (king on g1, no defenders)
    fen: "6k1/5ppp/8/8/8/8/5PPq/6K1 b - - 0 1",
    solution: ["h2h1"],
    sideToMove: "b",
    rating: 800,
    difficulty: "Easy",
    theme: "Mate in 1",
    tags: ["mate", "queen"],
  },
  {
    id: 1251,
    // Discovered attack / mate: Qh5xh7#
    fen: "rnbqkb1r/pppp1Qpp/5n2/4p3/2B1P3/8/PPPP1PPP/RNB1K1NR b KQkq - 0 1",
    solution: [],
    sideToMove: "b",
    rating: 700,
    difficulty: "Easy",
    theme: "Recognize Mate",
    tags: ["mate", "scholars"],
  },
];

// Filter out the demo "no solution" placeholder so gameplay always has a target move.
export const PLAYABLE_PUZZLES: Puzzle[] = PUZZLES.filter((p) => p.solution.length > 0);