import { Crown, Settings, Timer } from "lucide-react";
import { useApp } from "@/store/app-store";

export function AppHeader({ onOpenSettings }: { onOpenSettings: () => void }) {
  const { mode, streak, timerRemainingSec, timerActive, timerSolved, puzzleTimeSec, puzzleTimerActive } = useApp();

  const formatTime = (sec: number) => {
    const mm = String(Math.floor(sec / 60)).padStart(2, "0");
    const ss = String(sec % 60).padStart(2, "0");
    return `${mm}:${ss}`;
  };

  const timerLabel = mode === "timer"
    ? (timerActive ? formatTime(timerRemainingSec) : `${timerSolved}✓`)
    : (puzzleTimerActive || puzzleTimeSec > 0 ? formatTime(puzzleTimeSec) : "--:--");

  const timerSubtitle = mode === "timer"
    ? (timerActive ? "Time remaining" : "Timer stopped")
    : `Streak: ${streak}`;

  return (
    <header className="relative z-30 shrink-0 px-4 pt-[max(env(safe-area-inset-top),8px)] pb-1.5 sm:pt-[max(env(safe-area-inset-top),12px)] sm:pb-3">
      <div className="flex items-center justify-between pointer-events-auto">
        <button className="h-10 w-10 sm:h-11 sm:w-11 flex items-center justify-center" aria-label="Profile">
          <Crown className="h-5 w-5 sm:h-6 sm:w-6 text-primary" strokeWidth={2.2} />
        </button>
        <h1
          className="text-xl sm:text-2xl font-bold tracking-tight text-primary text-glow flex items-center gap-1.5"
          style={{ fontFamily: "'Space Grotesk', Inter, sans-serif" }}
        >
          pahelee
          <span aria-hidden className="text-primary text-lg sm:text-xl">♟</span>
        </h1>
        <button
          onClick={onOpenSettings}
          className="h-10 w-10 sm:h-11 sm:w-11 flex items-center justify-center hover:text-primary transition-colors"
          aria-label="Settings"
        >
          <Settings className="h-5 w-5 sm:h-6 sm:w-6 text-foreground/80" />
        </button>
      </div>

      <div className="mt-2 sm:mt-3 flex justify-center pointer-events-auto">
        <div
          className={`min-h-10 sm:min-h-12 rounded-full px-4 sm:px-5 py-1.5 sm:py-2 border transition-all flex flex-col items-center justify-center gap-0.5 ${
            mode === "timer"
              ? "bg-primary text-primary-foreground border-primary glow-soft"
              : "bg-card text-foreground/85 border-border"
          }`}
        >
          <span className="flex items-center gap-1.5 text-[10px] sm:text-[11px] font-bold tracking-wider">
            <Timer className="h-4 w-4" />
            {mode === "timer" ? "TIMER MODE" : "INFINITE MODE"}
          </span>
          <span className="text-[16px] sm:text-lg font-extrabold font-mono tabular-nums">
            {timerLabel}
          </span>
          <span className="text-[10px] sm:text-xs font-medium opacity-75">
            {timerSubtitle}
          </span>
        </div>
      </div>
    </header>
  );
}
