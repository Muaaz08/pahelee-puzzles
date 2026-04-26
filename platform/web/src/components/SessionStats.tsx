import { motion, AnimatePresence } from "framer-motion";
import { useGamification } from "@/store/gamification-store";
import { MILESTONES } from "@/data/rewards";

export function SessionStats() {
  const { sessionXp, streak, userSkillRating, sessionCorrect, sessionTotal } = useGamification();
  const accuracy = sessionTotal > 0 ? Math.round((sessionCorrect / sessionTotal) * 100) : 0;
  const milestone = MILESTONES[streak as keyof typeof MILESTONES];

  return (
    <div className="pointer-events-none fixed top-14 right-4 z-40 flex items-center gap-2 sm:top-16 sm:right-6">
      <AnimatePresence mode="wait">
        {streak >= 3 && (
          <motion.div
            key="streak"
            initial={{ opacity: 0, scale: 0.8, x: 10 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.8, x: 10 }}
            className="flex items-center gap-1 rounded-full bg-card/80 border border-border px-2.5 py-1 backdrop-blur-md"
          >
            <motion.span
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 1 }}
              className="text-sm"
            >
              🔥
            </motion.span>
            <span className="text-sm font-bold text-primary tabular-nums">{streak}</span>
            {milestone && (
              <span className="hidden text-[10px] font-semibold text-primary/70 sm:inline">
                {milestone}
              </span>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center gap-1 rounded-full bg-card/80 border border-border px-2.5 py-1 backdrop-blur-md">
        <span className="text-sm font-bold text-primary tabular-nums">{sessionXp}</span>
        <span className="text-[10px] font-semibold text-primary/70">XP</span>
      </div>

      <div className="hidden items-center gap-1 rounded-full bg-card/80 border border-border px-2.5 py-1 backdrop-blur-md sm:flex">
        <span className="text-[10px] font-semibold text-muted-foreground">Rating</span>
        <span className="text-sm font-bold text-foreground tabular-nums">{userSkillRating}</span>
      </div>
    </div>
  );
}