import { useEffect, useMemo, useRef, useState } from "react";
import { PuzzleCard } from "./PuzzleCard";
import { PLAYABLE_PUZZLES } from "@/data/puzzles";

/**
 * Builds an "endless" stream by repeating the demo puzzles.
 * For MVP we render a generous window (50) which is more than enough.
 */
function buildStream(count = 50) {
  const out = [] as { key: string; puzzle: typeof PLAYABLE_PUZZLES[number] }[];
  for (let i = 0; i < count; i++) {
    const p = PLAYABLE_PUZZLES[i % PLAYABLE_PUZZLES.length];
    out.push({ key: `${p.id}-${i}`, puzzle: p });
  }
  return out;
}

export function PuzzleFeed() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const stream = useMemo(() => buildStream(50), []);

  // Track which puzzle is most centered
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

  return (
    <div
      ref={containerRef}
      className="h-full w-full overflow-y-scroll scroll-snap-y no-scrollbar"
      style={{ overscrollBehavior: "contain" }}
    >
      {stream.map((item, i) => (
        <div
          key={item.key}
          data-index={i}
          ref={(el) => (sectionRefs.current[i] = el)}
          className="h-full w-full snap-start-always"
        >
          <PuzzleCard
            puzzle={item.puzzle}
            isActive={i === activeIndex}
            onAdvance={() => advance(i)}
            showSwipeHint={i === 0}
          />
        </div>
      ))}
    </div>
  );
}
