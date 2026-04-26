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
    <section className="w-full h-full flex items-center justify-center">
      <div className="flex flex-col items-center justify-center gap-6 rounded-2xl bg-surface/60 p-6 sm:p-8 w-full max-w-lg lg:max-w-xl">
        <div className="flex items-center justify-center flex-none w-[85%] max-w-[280px] lg:max-w-[320px]">
          <img
            src="./assets/PaheliChess-Logo.png"
            alt="PaheliChess"
            className="w-56 h-56 lg:w-72 lg:h-72 object-contain"
          />
        </div>

        <div className="w-full flex flex-col items-center gap-4 min-h-[72px]">
          <div className="mt-2 flex w-full max-w-[280px] lg:max-w-[320px] gap-2 rounded-full bg-muted p-1">
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
            <div className="flex w-full max-w-[280px] lg:max-w-[320px] gap-2">
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

        <div className="text-center w-[75%] max-w-[300px] lg:max-w-[360px]">
          <h1 className="text-4xl lg:text-5xl font-extrabold">PaheliChess</h1>
          <p className="mt-2 max-w-prose text-base lg:text-lg text-muted-foreground">
            Fast, focused puzzle solving. Choose Infinite for uninterrupted
            practice or Timer mode to train under pressure.
          </p>
        </div>

        <div className="w-full max-w-[280px] lg:max-w-[320px]">
          <button
            onClick={handlePlay}
            className="w-full rounded-lg bg-primary px-6 py-3 text-sm lg:text-base font-semibold text-black shadow-md active:scale-[1.02] transition-transform"
            aria-label="Play now"
          >
            Play Now
          </button>
        </div>
      </div>
    </section>
  );
};

export default LandingHero;
