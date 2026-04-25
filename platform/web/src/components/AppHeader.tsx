import { Crown, Settings, Timer, Infinity as InfinityIcon } from "lucide-react";
import { useApp } from "@/store/app-store";

export function AppHeader({ onOpenSettings }: { onOpenSettings: () => void }) {
  const { mode, setMode, streak, timerRemainingSec, timerActive, timerSolved } = useApp();

  const mm = String(Math.floor(timerRemainingSec / 60)).padStart(2, "0");
  const ss = String(timerRemainingSec % 60).padStart(2, "0");
  const timerLabel = timerActive ? `${mm}:${ss}` : `${timerSolved}✓`;

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

      <div className="mt-2 sm:mt-3 grid grid-cols-2 gap-2 pointer-events-auto">
        <ModePill
          active={mode === "timer"}
          onClick={() => setMode("timer")}
          icon={<Timer className="h-4 w-4" />}
          title="TIMER MODE"
          subtitle={timerLabel}
        />
        <ModePill
          active={mode === "infinite"}
          onClick={() => setMode("infinite")}
          icon={<InfinityIcon className="h-4 w-4" />}
          title="INFINITE MOVE"
          subtitle={`Streak: ${streak}`}
        />
      </div>
    </header>
  );
}

function ModePill({
  active,
  onClick,
  icon,
  title,
  subtitle,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`min-h-10 sm:min-h-12 rounded-full px-2.5 sm:px-3 py-1.5 sm:py-2 border transition-all flex flex-col items-center justify-center gap-0.5 ${
        active
          ? "bg-primary text-primary-foreground border-primary glow-soft"
          : "bg-card text-foreground/85 border-border"
      }`}
    >
      <span className="flex items-center gap-1 text-[10px] sm:gap-1.5 sm:text-[11px] font-bold tracking-wider">
        {icon}
        {title}
      </span>
      <span className={`text-[11px] sm:text-xs font-semibold ${active ? "opacity-90" : "text-muted-foreground"}`}>
        {subtitle}
      </span>
    </button>
  );
}
