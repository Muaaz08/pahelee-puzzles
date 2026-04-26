import { motion, AnimatePresence } from "framer-motion";
import { useRewards } from "@/hooks/useRewards";

export function GamificationOverlay() {
  const { rewardState, wrongState } = useRewards();

  return (
    <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center">
      <AnimatePresence>
        {rewardState.showSuccess && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="text-center"
          >
            <div className="animate-green-flash absolute inset-0 -m-12 rounded-3xl" />
            <h2 className="relative text-3xl font-black text-primary text-glow animate-xp-bounce">
              {rewardState.successPhrase}
            </h2>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {rewardState.showXPFloating && rewardState.xpPopup !== null && (
          <motion.div
            key="xp"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.4 }}
            className="absolute top-1/3"
          >
            <div className="flex items-center gap-1 rounded-full bg-primary/20 px-4 py-2 animate-xp-float">
              <span className="text-lg font-bold text-primary">+{rewardState.xpPopup}</span>
              <span className="text-sm font-semibold text-primary/80">XP</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {rewardState.showMilestone && rewardState.milestoneName && (
          <motion.div
            key="milestone"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
            className="absolute top-1/2 -translate-y-1/2"
          >
            <div className="animate-milestone-glow rounded-2xl border-2 border-primary bg-card/90 px-8 py-4 backdrop-blur-md">
              <p className="text-xs font-semibold uppercase tracking-widest text-primary/70">
                Milestone Unlocked
              </p>
              <p className="text-2xl font-black text-primary text-glow">
                {rewardState.milestoneName}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {wrongState.showWrong && (
          <motion.div
            key="wrong"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute bottom-32"
          >
            <p className="rounded-full bg-card/90 px-4 py-2 text-sm font-semibold text-foreground/80 backdrop-blur-md">
              {wrongState.wrongPhrase}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}