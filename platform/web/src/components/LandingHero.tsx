import { useNavigate } from "react-router-dom";
import { useApp } from "@/store/app-store";

const presets = [1, 2, 5, 10];

const LandingHero = () => {
  const { mode, setMode, timerDurationSec, setTimerDurationSec } = useApp();
  const navigate = useNavigate();

  const handlePlay = () => {
    navigate(`/arena`);
  };

  return (
    <section className="w-full h-full">
      <div className="grid h-full grid-cols-1 gap-4 sm:grid-cols-[35%_65%] min-h-0">
        {/* Left column: logo (35%) and mode */}
        <div className="flex flex-col items-center justify-between gap-6 rounded-lg bg-surface/60 p-6 min-h-0">
          <div className="flex items-center justify-center flex-none">
            <img
              src="./assets/PaheliChess-Logo.png"
              alt="PaheliChess"
              className="w-44 h-44 object-contain"
            />
          </div>

          <div className="w-full flex-1 min-h-0">
            <div className="mt-2 flex w-full gap-2 rounded-full bg-muted p-1">
              <button
                aria-pressed={mode === "infinite"}
                onClick={() => setMode("infinite")}
                className={`flex-1 rounded-full px-3 py-2 text-sm font-semibold transition ${mode === "infinite" ? "bg-primary text-black" : "bg-transparent text-foreground/70"}`}
              >
                Infinite
              </button>
              <button
                aria-pressed={mode === "timer"}
                onClick={() => setMode("timer")}
                className={`flex-1 rounded-full px-3 py-2 text-sm font-semibold transition ${mode === "timer" ? "bg-primary text-black" : "bg-transparent text-foreground/70"}`}
              >
                Timer
              </button>
            </div>

            {mode === "timer" && (
              <div className="mt-3 flex w-full gap-2">
                {presets.map((p) => (
                  <button
                    key={p}
                    onClick={() => setTimerDurationSec(p * 60)}
                    className={`flex-1 rounded-md px-3 py-2 text-sm ${timerDurationSec === p * 60 ? "bg-primary text-black font-semibold" : "bg-surface text-foreground/80"}`}
                  >
                    {p}m
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right column: headline & CTA (65%) */}
        <div className="flex flex-col items-center justify-center gap-6 rounded-lg bg-surface/60 p-6 min-h-0">
          <div className="text-center">
            <h1 className="text-3xl font-extrabold">PaheliChess</h1>
            <p className="mt-2 max-w-prose text-sm text-muted-foreground">
              Fast, focused puzzle solving. Choose Infinite for uninterrupted
              practice or Timer mode to train under pressure.
            </p>
          </div>

          <div className="w-full max-w-xs">
            <button
              onClick={handlePlay}
              className="w-full rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-black shadow-md active:scale-[1.02] transition-transform"
              aria-label="Play now"
            >
              Play Now
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LandingHero;
