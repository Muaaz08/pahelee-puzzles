import { useEffect, useMemo, useRef, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { PuzzleCard } from "./PuzzleCard";
import { Button } from "@/components/ui/button";
import { fetchLichessPuzzles } from "@/lib/lichess-puzzles";
import { useApp } from "@/store/app-store";

export function PuzzleFeed() {
  const { puzzleTheme, puzzleDifficulty } = useApp();
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const query = useInfiniteQuery({
    queryKey: ["lichess-puzzles", puzzleTheme, puzzleDifficulty],
    initialPageParam: 0,
    queryFn: () => fetchLichessPuzzles({ theme: puzzleTheme, difficulty: puzzleDifficulty, count: 15 }),
    getNextPageParam: (lastPage, pages) => (lastPage.length > 0 ? pages.length : undefined),
    staleTime: 1000 * 60 * 5,
  });

  const stream = useMemo(
    () =>
      query.data?.pages.flatMap((page, pageIndex) =>
        page.map((puzzle, puzzleIndex) => ({
          key: `${puzzleTheme}-${puzzleDifficulty}-${puzzle.id}-${pageIndex}-${puzzleIndex}`,
          puzzle,
        })),
      ) ?? [],
    [puzzleDifficulty, puzzleTheme, query.data],
  );

  useEffect(() => {
    setActiveIndex(0);
    sectionRefs.current = [];
    containerRef.current?.scrollTo({ top: 0 });
  }, [puzzleTheme, puzzleDifficulty]);

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

  useEffect(() => {
    if (
      stream.length > 0 &&
      activeIndex >= stream.length - 5 &&
      query.hasNextPage &&
      !query.isFetchingNextPage
    ) {
      query.fetchNextPage();
    }
  }, [activeIndex, query, stream.length]);

  const advance = (fromIndex: number) => {
    const next = sectionRefs.current[fromIndex + 1];
    if (next) next.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  if (query.isPending) {
    return (
      <FeedState
        title="Loading Lichess puzzles"
        body="Finding fresh tactics for this theme..."
      />
    );
  }

  if (query.isError || stream.length === 0) {
    return (
      <FeedState
        title="Could not load puzzles"
        body="Check your connection, then try Lichess again."
        action={<Button onClick={() => query.refetch()}>Retry</Button>}
      />
    );
  }

  return (
    <div
      ref={containerRef}
      className="min-h-0 flex-1 w-full overflow-y-scroll scroll-snap-y no-scrollbar"
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
            showSwipeHint
          />
        </div>
      ))}
    </div>
  );
}

function FeedState({ title, body, action }: { title: string; body: string; action?: React.ReactNode }) {
  return (
    <div className="min-h-0 flex-1 w-full flex items-center justify-center px-6">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-5 text-center shadow-lg">
        <h2 className="text-lg font-extrabold text-foreground">{title}</h2>
        <p className="mt-2 text-sm text-muted-foreground">{body}</p>
        {action && <div className="mt-4 flex justify-center">{action}</div>}
      </div>
    </div>
  );
}
