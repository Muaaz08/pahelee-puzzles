import { Crown, Settings } from "lucide-react";
import { useApp } from "@/store/app-store";

export function AppHeader({ onOpenSettings }: { onOpenSettings: () => void }) {
  const { mode, setMode, streak, timerRemainingSec, timerActive, timerSolved } = useApp();

  const mm = String(Math.floor(timerRemainingSec / 60)).padStart(2, "0");
  const ss = String(timerRemainingSec % 60).padStart(2, "0");

  return (
    <header className="absolute top-0 left-0 right-0 z-30 px-4 pt-[max(env(safe-area-inset-top),12px)] pb-3 pointer-events-none">
      <div className="flex items-center justify-between pointer-events-auto">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-xl bg-card border border-border flex items-center justify-center glow-soft">
            <Crown className="h-5 w-5 text-primary" strokeWidth={2.2} />
          </div>
        </div>
        <h1 className="text-lg font-bold tracking-tight" style={{ fontFamily: "'Space Grotesk', Inter, sans-serif" }}>
          Pahelee
        </h1>
        <button
          onClick={onOpenSettings}
          className="h-9 w-9 rounded-xl bg-card border border-border flex items-center justify-center hover:border-primary/60 transition-colors"
          aria-label="Settings"
        >
          <Settings className="h-4.5 w-4.5 text-foreground/80" />
        </button>
      </div>

      <div className="mt-3 flex items-center gap-2 pointer-events-auto">
        <button
          onClick={() => setMode("infinite")}
          className={`flex-1 rounded-full px-3 py-1.5 text-xs font-semibold border transition-all ${
            mode === "infinite"
              ? "bg-primary text-primary-foreground border-primary glow-soft"
              : "bg-card text-muted-foreground border-border"
          }`}
        >
          ∞ Infinite · 🔥 {streak}
        </button>
        <button
          onClick={() => setMode("timer")}
          className={`flex-1 rounded-full px-3 py-1.5 text-xs font-semibold border transition-all ${
            mode === "timer"
              ? "bg-primary text-primary-foreground border-primary glow-soft"
              : "bg-card text-muted-foreground border-border"
          }`}
        >
          ⏱ Timer · {timerActive ? `${mm}:${ss}` : `${timerSolved}✓`}
        </button>
      </div>
    </header>
  );
}