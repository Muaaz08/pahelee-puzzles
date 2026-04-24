import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronUp } from "lucide-react";
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
  Easy: "text-primary border-primary/40 bg-primary/10",
  Medium: "text-yellow-300 border-yellow-300/40 bg-yellow-300/10",
  Hard: "text-red-400 border-red-400/40 bg-red-400/10",
};

export function PuzzleCard({ puzzle, isActive, onAdvance, showSwipeHint }: Props) {
  const { registerSolve, registerWrong, registerAttempt } = useApp();
  const [solved, setSolved] = useState(false);
  const [feedback, setFeedback] = useState<"" | "wrong">("");
  const [hintRequested, setHintRequested] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);

  // Reset local state when puzzle changes
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

  return (
    <section className="relative h-full w-full snap-start-always flex flex-col">
      {/* Top spacer for header */}
      <div className="h-[124px] shrink-0" />

      <div className="flex-1 flex flex-col items-center justify-start px-4 pb-4">
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-md mx-auto bg-card-gradient border border-border rounded-3xl p-4 glow-soft"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-muted-foreground">#{puzzle.id}</span>
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${diffColor[puzzle.difficulty]}`}>
              {puzzle.difficulty}
            </span>
          </div>

          <div className="mb-3">
            <h2 className="text-2xl font-extrabold leading-tight" style={{ fontFamily: "'Space Grotesk', Inter, sans-serif" }}>
              {puzzle.sideToMove === "w" ? "White" : "Black"} to move
            </h2>
            <p className="text-sm text-muted-foreground mt-0.5">Find the best move · {puzzle.theme}</p>
          </div>

          <PuzzleBoard
            puzzle={puzzle}
            onSolved={handleSolved}
            onWrong={handleWrong}
            onAttempt={registerAttempt}
            hintRequested={hintRequested}
          />

          <div className="mt-3 h-6 flex items-center justify-center">
            <AnimatePresence mode="wait">
              {solved && (
                <motion.span
                  key="ok"
                  initial={{ opacity: 0, y: 8 }}
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
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-red-400 font-bold text-sm"
                >
                  Not quite — try again
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {showSwipeHint && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-4 flex flex-col items-center text-muted-foreground text-xs"
          >
            <ChevronUp className="h-5 w-5 animate-bounce text-primary" />
            <span>Swipe up for next puzzle</span>
          </motion.div>
        )}
      </div>

      <ActionBar
        puzzle={puzzle}
        hintsUsed={hintsUsed}
        onHint={() => {
          setHintsUsed((n) => n + 1);
          setHintRequested((n) => n + 1);
        }}
      />
    </section>
  );
}