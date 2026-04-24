import { useEffect, useMemo, useRef, useState } from "react";
import { PuzzleBoard } from "./PuzzleBoard";
import { ActionBar } from "./ActionBar";
import { PLAYABLE_PUZZLES } from "@/data/puzzles";
import { useApp } from "@/store/app-store";

function buildStream(count = 50) {
  const out = [] as { key: string; puzzle: typeof PLAYABLE_PUZZLES[number] }[];
  for (let i = 0; i < count; i++) {
    const p = PLAYABLE_PUZZLES[i % PLAYABLE_PUZZLES.length];
    out.push({ key: `${p.id}-${i}`, puzzle: p });
  }
  return out;
}

export function PuzzleFeed() {
  const { registerSolve, registerWrong, registerAttempt } = useApp();
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [hintRequested, setHintRequested] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const stream = useMemo(() => buildStream(50), []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && e.intersectionRatio > 0.6) {
            const idx = Number((e.target as HTMLElement).dataset.index);
            if (!Number.isNaN(idx)) setActiveIndex(idx);
          }
        });
      },
      { root: container, threshold: [0.6, 0.9] },
    );
    sectionRefs.current.forEach((el) => el && obs.observe(el));
    return () => obs.disconnect();
  }, [stream.length]);

  const advance = (fromIndex: number) => {
    const next = sectionRefs.current[fromIndex + 1];
    if (next) next.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const active = stream[activeIndex]?.puzzle;
  if (!active) return null;

  return (
    <div className="relative h-full w-full flex flex-col">
      {/* spacer for header */}
      <div className="h-[140px] shrink-0" />

      {/* Meta + title */}
      <div className="px-4">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <span className="text-xs font-semibold text-muted-foreground border border-border rounded-full px-2.5 py-0.5">#{active.id}</span>
          <span className="text-xs font-extrabold tracking-wider text-primary">{active.difficulty.toUpperCase()}</span>
          <button className="h-7 w-7 flex items-center justify-center text-muted-foreground" aria-label="More">
            {/* placeholder */}
          </button>
        </div>

        <div className="mt-1 text-center">
          <h2
            className="text-3xl font-extrabold leading-tight"
            style={{ fontFamily: "'Space Grotesk', Inter, sans-serif" }}
          >
            <span className="text-primary text-glow">{active.sideToMove === "w" ? "White" : "Black"}</span>{" "}
            <span className="text-foreground">to move</span>
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">Find the best move</p>
        </div>
      </div>

      {/* Scroll area: only boards move */}
      <div
        ref={containerRef}
        className="flex-1 w-full overflow-y-scroll scroll-snap-y no-scrollbar mt-3 px-4"
        style={{ overscrollBehavior: "contain" }}
      >
        {stream.map((item, i) => (
          <div
            key={item.key}
            data-index={i}
            ref={(el) => (sectionRefs.current[i] = el)}
            style={{ height: "100%" }}
            className="w-full snap-start-always flex items-center justify-center"
          >
            <div className="w-full max-w-md">
              <div className="bg-card-gradient rounded-2xl p-4">
                <PuzzleBoard
                  puzzle={item.puzzle}
                  onSolved={() => {
                    registerSolve(item.puzzle.id);
                    window.setTimeout(() => advance(i), 800);
                  }}
                  onWrong={() => registerWrong()}
                  onAttempt={(c) => registerAttempt(c)}
                  hintRequested={i === activeIndex ? hintRequested : 0}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Action bar fixed at bottom of layout */}
      <div className="shrink-0">
        <ActionBar
          puzzle={active}
          hintsUsed={hintsUsed}
          onHint={() => {
            setHintsUsed((n) => n + 1);
            setHintRequested((n) => n + 1);
          }}
        />
      </div>
    </div>
  );
}
