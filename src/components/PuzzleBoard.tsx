import { Chess, Square } from "chess.js";
import { Chessboard } from "react-chessboard";
import { useEffect, useMemo, useState } from "react";
import type { Puzzle } from "@/data/puzzles";

type Status = "idle" | "wrong" | "correct";

// Standard Wikipedia/cburnett SVG chess pieces. White pieces have white fill
// + black stroke; black pieces have black fill + black stroke. This guarantees
// correct contrast on any board theme.
const PIECE_KEYS = ["wP","wN","wB","wR","wQ","wK","bP","bN","bB","bR","bQ","bK"] as const;
type PieceKey = typeof PIECE_KEYS[number];

const PIECE_URLS: Record<PieceKey, string> = {
  wK: "https://upload.wikimedia.org/wikipedia/commons/4/42/Chess_klt45.svg",
  wQ: "https://upload.wikimedia.org/wikipedia/commons/1/15/Chess_qlt45.svg",
  wR: "https://upload.wikimedia.org/wikipedia/commons/7/72/Chess_rlt45.svg",
  wB: "https://upload.wikimedia.org/wikipedia/commons/b/b1/Chess_blt45.svg",
  wN: "https://upload.wikimedia.org/wikipedia/commons/7/70/Chess_nlt45.svg",
  wP: "https://upload.wikimedia.org/wikipedia/commons/4/45/Chess_plt45.svg",
  bK: "https://upload.wikimedia.org/wikipedia/commons/f/f0/Chess_kdt45.svg",
  bQ: "https://upload.wikimedia.org/wikipedia/commons/4/47/Chess_qdt45.svg",
  bR: "https://upload.wikimedia.org/wikipedia/commons/f/ff/Chess_rdt45.svg",
  bB: "https://upload.wikimedia.org/wikipedia/commons/9/98/Chess_bdt45.svg",
  bN: "https://upload.wikimedia.org/wikipedia/commons/e/ef/Chess_ndt45.svg",
  bP: "https://upload.wikimedia.org/wikipedia/commons/c/c7/Chess_pdt45.svg",
};

const customPieces = PIECE_KEYS.reduce((acc, key) => {
  acc[key] = ({ squareWidth }: { squareWidth: number }) => (
    <div
      style={{
        width: squareWidth,
        height: squareWidth,
        backgroundImage: `url(${PIECE_URLS[key]})`,
        backgroundSize: "100%",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
      }}
    />
  );
  return acc;
}, {} as Record<PieceKey, (props: { squareWidth: number }) => JSX.Element>);

type Props = {
  puzzle: Puzzle;
  onSolved: () => void;
  onWrong: () => void;
  onAttempt?: (correct: boolean) => void;
  hintRequested?: number; // increment to trigger hint
};

export function PuzzleBoard({ puzzle, onSolved, onWrong, onAttempt, hintRequested }: Props) {
  const game = useMemo(() => new Chess(puzzle.fen), [puzzle.fen]);
  const [position, setPosition] = useState(puzzle.fen);
  const [status, setStatus] = useState<Status>("idle");
  const [selected, setSelected] = useState<Square | null>(null);
  const [hintSquare, setHintSquare] = useState<Square | null>(null);

  // Reset whenever puzzle changes
  useEffect(() => {
    game.load(puzzle.fen);
    setPosition(puzzle.fen);
    setStatus("idle");
    setSelected(null);
    setHintSquare(null);
  }, [puzzle.id, puzzle.fen, game]);

  // Handle external hint trigger
  useEffect(() => {
    if (!hintRequested) return;
    const from = puzzle.solution[0]?.slice(0, 2) as Square | undefined;
    if (from) {
      setHintSquare(from);
      const t = window.setTimeout(() => setHintSquare(null), 2200);
      return () => window.clearTimeout(t);
    }
  }, [hintRequested, puzzle.solution]);

  const target = puzzle.solution[0];

  const tryMove = (from: Square, to: Square): boolean => {
    if (status === "correct") return false;
    const expectedFrom = target.slice(0, 2);
    const expectedTo = target.slice(2, 4);
    const promo = target.length > 4 ? target[4] : "q";

    // Validate move legality first via chess.js
    const trial = new Chess(puzzle.fen);
    let move;
    try {
      move = trial.move({ from, to, promotion: promo });
    } catch {
      move = null;
    }
    if (!move) return false; // illegal — let board snap back

    const isCorrect = from === expectedFrom && to === expectedTo;
    onAttempt?.(isCorrect);

    if (isCorrect) {
      setStatus("correct");
      setPosition(trial.fen());
      setSelected(null);
      setHintSquare(null);
      onSolved();
      return true;
    }

    // Wrong but legal — flash, then revert
    setStatus("wrong");
    setPosition(trial.fen());
    setSelected(null);
    onWrong();
    window.setTimeout(() => {
      setPosition(puzzle.fen);
      setStatus("idle");
    }, 600);
    return false;
  };

  // Tap-to-move
  const handleSquareClick = (square: string) => {
    if (status === "correct") return;
    const sq = square as Square;
    if (selected) {
      if (sq === selected) {
        setSelected(null);
        return;
      }
      tryMove(selected, sq);
      return;
    }
    // Only select if there's a piece of the side to move
    const trial = new Chess(puzzle.fen);
    const piece = trial.get(sq);
    if (piece && piece.color === puzzle.sideToMove) {
      setSelected(sq);
    }
  };

  const handlePieceDrop = (sourceSquare: string, targetSquare: string) => {
    if (!targetSquare) return false;
    return tryMove(sourceSquare as Square, targetSquare as Square);
  };

  const squareStyles: Record<string, React.CSSProperties> = {};
  if (selected) {
    squareStyles[selected] = {
      boxShadow: "inset 0 0 0 4px hsl(var(--primary))",
      background: "hsl(var(--primary) / 0.18)",
    };
  }
  if (hintSquare) {
    squareStyles[hintSquare] = {
      boxShadow: "inset 0 0 0 4px hsl(var(--primary))",
      background: "hsl(var(--primary) / 0.28)",
    };
  }

  const boardClass =
    status === "wrong" ? "animate-shake" : status === "correct" ? "animate-pulse-glow" : "";

  return (
    <div className={`w-full ${boardClass} rounded-2xl overflow-hidden`}>
      <Chessboard
        id={`puzzle-${puzzle.id}`}
        position={position}
        boardOrientation={puzzle.sideToMove === "w" ? "white" : "black"}
        animationDuration={220}
        arePiecesDraggable={status !== "correct"}
        showBoardNotation={false}
        customLightSquareStyle={{ backgroundColor: "hsl(var(--board-light))" }}
        customDarkSquareStyle={{ backgroundColor: "hsl(var(--board-dark))" }}
        customSquareStyles={squareStyles}
        customPieces={customPieces}
        customBoardStyle={{
          borderRadius: "16px",
          boxShadow: "0 12px 40px hsl(0 0% 0% / 0.6), 0 0 0 1px hsl(var(--border))",
        }}
        onPieceDrop={handlePieceDrop}
        onSquareClick={handleSquareClick}
      />
    </div>
  );
}