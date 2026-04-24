import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronUp, MoreHorizontal } from "lucide-react";
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
    <section className="relative h-full w-full snap-start-always flex flex-col overflow-hidden">
      <div className="flex-1 flex flex-col gap-1.5 px-4 pt-[clamp(96px,14svh,132px)] sm:gap-2 sm:pt-[clamp(112px,16svh,140px)] min-h-0">
        {/* Top group: meta + title */}
        <div className="shrink-0 space-y-1 sm:space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground border border-border rounded-full px-2.5 py-0.5">
              #{puzzle.id}
            </span>
            <span className={`text-xs font-extrabold tracking-wider ${diffColor[puzzle.difficulty]}`}>
              {puzzle.difficulty.toUpperCase()}
            </span>
            <button className="h-10 w-10 flex items-center justify-center text-muted-foreground" aria-label="More">
              <MoreHorizontal className="h-5 w-5" />
            </button>
          </div>

          <div className="text-center">
            <h2
              className="text-[clamp(1.35rem,5.8vw,2rem)] font-extrabold leading-tight"
              style={{ fontFamily: "'Space Grotesk', Inter, sans-serif" }}
            >
              <span className="text-primary text-glow">{sideLabel}</span>{" "}
              <span className="text-foreground">to move</span>
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5 sm:text-sm">Find the best move</p>
          </div>
        </div>

        {/* Middle: board — grows to fill available space */}
        <div className="flex-1 flex items-center justify-center min-h-0 py-0.5 sm:py-1">
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="w-full h-full max-w-md mx-auto flex items-center justify-center"
          >
            <div
              className="w-full max-h-full aspect-square"
              style={{ maxWidth: "min(28rem, calc(var(--app-height, 100svh) - 270px))" }}
            >
              <PuzzleBoard
                puzzle={puzzle}
                onSolved={handleSolved}
                onWrong={handleWrong}
                onAttempt={registerAttempt}
                hintRequested={hintRequested}
              />
            </div>
          </motion.div>
        </div>

        {/* Bottom group: status */}
        <div className="shrink-0">
          <div className="h-5 flex items-center justify-center">
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
        </div>
      </div>

      {showSwipeHint && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="shrink-0 flex flex-col items-center text-muted-foreground text-[10px] sm:text-[11px] pointer-events-none pt-0.5"
        >
          <span>Swipe up for next puzzle</span>
          <ChevronUp className="h-3.5 w-3.5 animate-bounce text-primary" />
        </motion.div>
      )}

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
