import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useApp } from "@/store/app-store";
import { LICHESS_PUZZLE_DIFFICULTIES, LICHESS_PUZZLE_THEMES } from "@/lib/lichess-puzzles";
import { Flame, Target, Trophy } from "lucide-react";

export function SettingsSheet({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const {
    bestStreak, totalSolved, accuracy,
    timerDurationSec, setTimerDurationSec,
    startTimer, stopTimer, timerActive, mode, setMode,
    puzzleTheme, setPuzzleTheme,
    puzzleDifficulty, setPuzzleDifficulty,
  } = useApp();

  const durations = [60, 120, 300, 600];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="bg-card border-border rounded-t-3xl">
        <SheetHeader>
          <SheetTitle className="text-foreground">Profile & Settings</SheetTitle>
        </SheetHeader>

        <div className="grid grid-cols-3 gap-2 mt-4">
          <Stat icon={<Trophy className="h-4 w-4 text-primary" />} label="Solved" value={totalSolved} />
          <Stat icon={<Flame className="h-4 w-4 text-primary" />} label="Best streak" value={bestStreak} />
          <Stat icon={<Target className="h-4 w-4 text-primary" />} label="Accuracy" value={`${accuracy}%`} />
        </div>

        <div className="mt-6">
          <h3 className="text-xs uppercase tracking-wider text-muted-foreground font-bold mb-2">Puzzle style</h3>
          <div className="grid grid-cols-4 gap-2">
            {LICHESS_PUZZLE_THEMES.map((theme) => (
              <button
                key={theme.value}
                onClick={() => setPuzzleTheme(theme.value)}
                className={`px-2 py-2 rounded-xl text-xs font-semibold border transition-all ${
                  puzzleTheme === theme.value
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background text-muted-foreground border-border"
                }`}
              >
                {theme.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-xs uppercase tracking-wider text-muted-foreground font-bold mb-2">Difficulty</h3>
          <div className="flex gap-2 flex-wrap">
            {LICHESS_PUZZLE_DIFFICULTIES.map((difficulty) => (
              <button
                key={difficulty.value}
                onClick={() => setPuzzleDifficulty(difficulty.value)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                  puzzleDifficulty === difficulty.value
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background text-muted-foreground border-border"
                }`}
              >
                {difficulty.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-xs uppercase tracking-wider text-muted-foreground font-bold mb-2">Timer mode</h3>
          <div className="flex gap-2 flex-wrap">
            {durations.map((d) => (
              <button
                key={d}
                onClick={() => setTimerDurationSec(d)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                  timerDurationSec === d
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background text-muted-foreground border-border"
                }`}
              >
                {d < 60 ? `${d}s` : `${d / 60} min`}
              </button>
            ))}
          </div>
          <div className="flex gap-2 mt-3">
            {!timerActive ? (
              <button
                onClick={() => { setMode("timer"); startTimer(); onOpenChange(false); }}
                className="flex-1 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-sm glow-soft"
              >
                Start timer
              </button>
            ) : (
              <button
                onClick={stopTimer}
                className="flex-1 px-4 py-2.5 rounded-xl bg-secondary text-foreground font-bold text-sm border border-border"
              >
                Stop timer
              </button>
            )}
            <button
              onClick={() => { setMode("infinite"); onOpenChange(false); }}
              className={`flex-1 px-4 py-2.5 rounded-xl font-bold text-sm border ${
                mode === "infinite" ? "bg-secondary border-primary/40 text-foreground" : "bg-background border-border text-muted-foreground"
              }`}
            >
              Infinite mode
            </button>
          </div>
        </div>

        <p className="text-[11px] text-muted-foreground mt-6 text-center">
          Puzzles are served by Lichess. Accounts and leaderboards coming soon.
        </p>
      </SheetContent>
    </Sheet>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: number | string }) {
  return (
    <div className="bg-background border border-border rounded-2xl p-3">
      <div className="flex items-center gap-1.5 text-muted-foreground text-[10px] font-semibold uppercase tracking-wide">
        {icon} {label}
      </div>
      <div className="text-xl font-extrabold mt-1" style={{ fontFamily: "'Space Grotesk', Inter, sans-serif" }}>
        {value}
      </div>
    </div>
  );
}
