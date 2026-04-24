import { Crown, Settings, Timer, Infinity as InfinityIcon } from "lucide-react";
import { useApp } from "@/store/app-store";

export function AppHeader({ onOpenSettings }: { onOpenSettings: () => void }) {
  const { mode, setMode, streak, timerRemainingSec, timerActive, timerSolved } = useApp();

  const mm = String(Math.floor(timerRemainingSec / 60)).padStart(2, "0");
  const ss = String(timerRemainingSec % 60).padStart(2, "0");
  const timerLabel = timerActive ? `${mm}:${ss}` : `${timerSolved}✓`;

  return (
    <header className="absolute top-0 left-0 right-0 z-30 px-4 pt-[max(env(safe-area-inset-top),12px)] pb-3 pointer-events-none">
      <div className="flex items-center justify-between pointer-events-auto">
        <button className="h-9 w-9 flex items-center justify-center" aria-label="Profile">
          <Crown className="h-6 w-6 text-primary" strokeWidth={2.2} />
        </button>
        <h1
          className="text-2xl font-bold tracking-tight text-primary text-glow flex items-center gap-1.5"
          style={{ fontFamily: "'Space Grotesk', Inter, sans-serif" }}
        >
          pahelee
          <span aria-hidden className="text-primary text-xl">♟</span>
        </h1>
        <button
          onClick={onOpenSettings}
          className="h-9 w-9 flex items-center justify-center hover:text-primary transition-colors"
          aria-label="Settings"
        >
          <Settings className="h-6 w-6 text-foreground/80" />
        </button>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 pointer-events-auto">
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
      className={`rounded-full px-3 py-2 border transition-all flex flex-col items-center gap-0.5 ${
        active
          ? "bg-primary text-primary-foreground border-primary glow-soft"
          : "bg-card text-foreground/85 border-border"
      }`}
    >
      <span className="flex items-center gap-1.5 text-[11px] font-bold tracking-wider">
        {icon}
        {title}
      </span>
      <span className={`text-xs font-semibold ${active ? "opacity-90" : "text-muted-foreground"}`}>
        {subtitle}
      </span>
    </button>
  );
}