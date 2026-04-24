import { Chess, Square } from "chess.js";
import { Chessboard } from "react-chessboard";
import { TouchBackend } from "react-dnd-touch-backend";
import { useEffect, useRef, useState } from "react";
import type { Puzzle } from "@/data/puzzles";

type Status = "idle" | "wrong" | "replying" | "solved";

type Props = {
  puzzle: Puzzle;
  onSolved: () => void;
  onWrong: () => void;
  onAttempt?: (correct: boolean) => void;
  hintRequested?: number; // increment to trigger hint
};

const dragBackendOptions = {
  enableMouseEvents: true,
  enableTouchEvents: true,
  touchSlop: 0,
};

export function PuzzleBoard({ puzzle, onSolved, onWrong, onAttempt, hintRequested }: Props) {
  const [position, setPosition] = useState(puzzle.fen);
  const [status, setStatus] = useState<Status>("idle");
  const [selected, setSelected] = useState<Square | null>(null);
  const [hintSquare, setHintSquare] = useState<Square | null>(null);
  const [solutionIndex, setSolutionIndex] = useState(0);
  const replyTimer = useRef<number | null>(null);

  // Reset whenever puzzle changes
  useEffect(() => {
    if (replyTimer.current) window.clearTimeout(replyTimer.current);
    setPosition(puzzle.fen);
    setStatus("idle");
    setSelected(null);
    setHintSquare(null);
    setSolutionIndex(0);
  }, [puzzle.id, puzzle.fen]);

  useEffect(() => {
    return () => {
      if (replyTimer.current) window.clearTimeout(replyTimer.current);
    };
  }, []);

  // Handle external hint trigger
  useEffect(() => {
    if (!hintRequested) return;
    const from = puzzle.solution[solutionIndex]?.slice(0, 2) as Square | undefined;
    if (from) {
      setHintSquare(from);
      const t = window.setTimeout(() => setHintSquare(null), 2200);
      return () => window.clearTimeout(t);
    }
  }, [hintRequested, puzzle.solution, solutionIndex]);

  const target = puzzle.solution[solutionIndex];

  const tryMove = (from: Square, to: Square): boolean => {
    if (status === "solved" || status === "replying" || !target) return false;
    const expectedFrom = target.slice(0, 2);
    const expectedTo = target.slice(2, 4);
    const promo = target.length > 4 ? target[4] : "q";

    // Validate move legality first via chess.js
    const trial = new Chess(position);
    let move;
    try {
      move = trial.move({ from, to, promotion: promo });
    } catch {
      move = null;
    }
    if (!move) return false; // illegal — let board snap back

    const playedUci = `${move.from}${move.to}${move.promotion ?? ""}`;
    const expectedUci = target.length > 4 ? target : `${expectedFrom}${expectedTo}`;
    const isCorrect = playedUci === expectedUci;
    onAttempt?.(isCorrect);

    if (isCorrect) {
      const afterUserMove = trial.fen();
      const nextIndex = solutionIndex + 1;
      setPosition(trial.fen());
      setSelected(null);
      setHintSquare(null);
      if (nextIndex >= puzzle.solution.length) {
        setStatus("solved");
        setSolutionIndex(nextIndex);
        onSolved();
        return true;
      }

      setStatus("replying");
      replyTimer.current = window.setTimeout(() => {
        const replyGame = new Chess(afterUserMove);
        const reply = puzzle.solution[nextIndex];
        try {
          replyGame.move({
            from: reply.slice(0, 2) as Square,
            to: reply.slice(2, 4) as Square,
            promotion: reply.length > 4 ? reply[4] : "q",
          });
          setPosition(replyGame.fen());
          setSolutionIndex(nextIndex + 1);
          setStatus(nextIndex + 1 >= puzzle.solution.length ? "solved" : "idle");
          if (nextIndex + 1 >= puzzle.solution.length) onSolved();
        } catch {
          setSolutionIndex(nextIndex);
          setStatus("idle");
        }
      }, 450);
      return true;
    }

    // Wrong but legal — flash, then revert
    setStatus("wrong");
    setPosition(trial.fen());
    setSelected(null);
    onWrong();
    window.setTimeout(() => {
      setPosition(position);
      setStatus("idle");
    }, 600);
    return false;
  };

  // Tap-to-move
  const handleSquareClick = (square: string) => {
    if (status === "solved" || status === "replying") return;
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
    const trial = new Chess(position);
    const piece = trial.get(sq);
    if (piece && piece.color === trial.turn()) {
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
    status === "wrong" ? "animate-shake" : status === "solved" ? "animate-pulse-glow" : "";

  return (
    <div className={`chess-drag-surface w-full ${boardClass} rounded-2xl overflow-hidden`}>
      <Chessboard
        id={`puzzle-${puzzle.id}`}
        position={position}
        boardOrientation={puzzle.sideToMove === "w" ? "white" : "black"}
        animationDuration={220}
        customDndBackend={TouchBackend}
        customDndBackendOptions={dragBackendOptions}
        snapToCursor
        allowDragOutsideBoard
        arePiecesDraggable={status !== "solved" && status !== "replying"}
        showBoardNotation={false}
        customLightSquareStyle={{ backgroundColor: "hsl(var(--board-light))" }}
        customDarkSquareStyle={{ backgroundColor: "hsl(var(--board-dark))" }}
        customSquareStyles={squareStyles}
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
