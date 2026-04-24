import { Bookmark, Flame, Heart, Lightbulb, Share2 } from "lucide-react";
import { useApp } from "@/store/app-store";
import type { Puzzle } from "@/data/puzzles";

type Props = {
  puzzle: Puzzle;
  onHint: () => void;
  hintsUsed: number;
};

export function ActionBar({ puzzle, onHint, hintsUsed }: Props) {
  const { liked, saved, toggleLike, toggleSave, streak } = useApp();
  const isLiked = liked.has(puzzle.id);
  const isSaved = saved.has(puzzle.id);

  const share = async () => {
    const text = `Pahelee Puzzle #${puzzle.id} — ${puzzle.theme}. Can you find the best move?`;
    if (navigator.share) {
      try { await navigator.share({ title: "Pahelee", text }); } catch { /* dismissed */ }
    } else {
      try { await navigator.clipboard.writeText(text); } catch { /* ignore */ }
    }
  };

  return (
    <div className="shrink-0 px-4 pt-3 pb-[max(env(safe-area-inset-bottom),18px)]">
      <div className="flex items-end justify-between max-w-md mx-auto">
        <ActionButton
          icon={<Heart className={`h-6 w-6 ${isLiked ? "fill-primary text-primary" : "text-primary"}`} strokeWidth={1.8} />}
          label="128"
          onClick={() => toggleLike(puzzle.id)}
          active={isLiked}
        />
        <ActionButton
          icon={<Bookmark className={`h-6 w-6 ${isSaved ? "fill-primary text-primary" : "text-foreground/85"}`} strokeWidth={1.8} />}
          label="56"
          onClick={() => toggleSave(puzzle.id)}
          active={isSaved}
        />
        <HintButton onClick={onHint} count={hintsUsed} />
        <ActionButton
          icon={<Share2 className="h-6 w-6 text-foreground/85" strokeWidth={1.8} />}
          label="Share"
          onClick={share}
        />
        <ActionButton
          icon={<Flame className="h-6 w-6 text-primary" strokeWidth={1.8} />}
          label={`${streak}`}
          sublabel="Streak"
          onClick={() => {}}
        />
      </div>
    </div>
  );
}

function ActionButton({
  icon,
  label,
  sublabel,
  onClick,
  active,
}: {
  icon: React.ReactNode;
  label: string;
  sublabel?: string;
  onClick: () => void;
  active?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-1 select-none active:scale-95 transition-transform"
      aria-label={label}
    >
      <span
        className={`h-12 w-12 rounded-full border flex items-center justify-center backdrop-blur-md ${
          active ? "border-primary/70 bg-primary/10" : "border-border bg-card/60"
        }`}
      >
        {icon}
      </span>
      <span className="text-[11px] font-semibold text-foreground/85 leading-tight">{label}</span>
      {sublabel && <span className="text-[10px] font-medium text-muted-foreground leading-none">{sublabel}</span>}
    </button>
  );
}

function HintButton({ onClick, count }: { onClick: () => void; count: number }) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-1 select-none active:scale-95 transition-transform relative"
      aria-label="Hint"
    >
      <span className="relative h-14 w-14 rounded-full bg-primary flex items-center justify-center glow-primary">
        <Lightbulb className="h-7 w-7 text-primary-foreground" strokeWidth={2.2} />
        <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 rounded-full bg-card border border-border text-[10px] font-bold text-foreground flex items-center justify-center">
          {3 - Math.min(count, 3)}
        </span>
      </span>
      <span className="text-[11px] font-bold text-primary text-glow leading-tight">Hint</span>
    </button>
  );
}