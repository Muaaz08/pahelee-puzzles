import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronUp, MoreHorizontal, Lightbulb } from "lucide-react";
import { PuzzleBoard } from "./PuzzleBoard";
import { ActionBar } from "./ActionBar";
import { useApp } from "@/store/app-store";
import type { Puzzle } from "@/data/puzzles";

type Props = {
  puzzle: Puzzle;
  isActive: boolean;
  onAdvance: () => void;
  showSwipeHint?: boolean;
};

const diffColor: Record<Puzzle["difficulty"], string> = {
  Easy: "text-primary",
  Medium: "text-yellow-300",
  Hard: "text-red-400",
};

export function PuzzleCard({ puzzle, isActive, onAdvance, showSwipeHint }: Props) {
  const { registerSolve, registerWrong, registerAttempt } = useApp();
  const [solved, setSolved] = useState(false);
  const [feedback, setFeedback] = useState<"" | "wrong">("");
  const [hintRequested, setHintRequested] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);

  if (!isActive && solved) {
    // no-op; reset happens via key remount
  }

  const handleSolved = () => {
    setSolved(true);
    registerSolve(puzzle.id);
    window.setTimeout(() => onAdvance(), 1200);
  };

  const handleWrong = () => {
    setFeedback("wrong");
    registerWrong();
    window.setTimeout(() => setFeedback(""), 700);
  };

  const sideLabel = puzzle.sideToMove === "w" ? "White" : "Black";

  return (
    <section className="relative h-full w-full snap-start-always flex flex-col">
      {/* Top spacer for header (logo + mode pills) */}
      <div className="h-[140px] shrink-0" />

      <div className="flex-1 flex flex-col px-4 min-h-0">
        {/* Meta row */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-muted-foreground border border-border rounded-full px-2.5 py-0.5">
            #{puzzle.id}
          </span>
          <span className={`text-xs font-extrabold tracking-wider ${diffColor[puzzle.difficulty]}`}>
            {puzzle.difficulty.toUpperCase()}
          </span>
          <button className="h-7 w-7 flex items-center justify-center text-muted-foreground" aria-label="More">
            <MoreHorizontal className="h-5 w-5" />
          </button>
        </div>

        {/* Centered title */}
        <div className="mt-1 text-center">
          <h2
            className="text-3xl font-extrabold leading-tight"
            style={{ fontFamily: "'Space Grotesk', Inter, sans-serif" }}
          >
            <span className="text-primary text-glow">{sideLabel}</span>{" "}
            <span className="text-foreground">to move</span>
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">Find the best move</p>
        </div>

        {/* Board */}
        <motion.div
          initial={{ opacity: 0, y: 12, scale: 0.99 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="mt-3 w-full max-w-md mx-auto"
        >
          <PuzzleBoard
            puzzle={puzzle}
            onSolved={handleSolved}
            onWrong={handleWrong}
            onAttempt={registerAttempt}
            hintRequested={hintRequested}
          />
        </motion.div>

        {/* Status line */}
        <div className="mt-2 h-5 flex items-center justify-center">
          <AnimatePresence mode="wait">
            {solved && (
              <motion.span
                key="ok"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-primary font-bold text-sm text-glow"
              >
                ✓ Brilliant! Next puzzle…
              </motion.span>
            )}
            {feedback === "wrong" && !solved && (
              <motion.span
                key="bad"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-red-400 font-bold text-sm"
              >
                Not quite — try again
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* Inspirational tip card */}
        <div className="mt-2 mx-auto w-full max-w-md rounded-2xl border border-border bg-card/70 px-4 py-3 flex items-start gap-3">
          <Lightbulb className="h-5 w-5 text-primary mt-0.5 shrink-0" />
          <p className="text-sm text-foreground/85 leading-snug">
            Think sharp, play smart.
            <br />
            Every puzzle, a stronger you.
          </p>
        </div>
      </div>

      <ActionBar
        puzzle={puzzle}
        hintsUsed={hintsUsed}
        onHint={() => {
          setHintsUsed((n) => n + 1);
          setHintRequested((n) => n + 1);
        }}
      />

      {showSwipeHint && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="absolute left-1/2 -translate-x-1/2 bottom-[max(env(safe-area-inset-bottom),12px)] flex flex-col items-center text-muted-foreground text-xs pointer-events-none"
        >
          <span>Swipe up for next puzzle</span>
          <ChevronUp className="h-4 w-4 animate-bounce text-primary" />
        </motion.div>
      )}
    </section>
  );
}