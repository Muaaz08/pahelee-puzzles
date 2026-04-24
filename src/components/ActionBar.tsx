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
    <div className="absolute right-3 bottom-[max(env(safe-area-inset-bottom),16px)] z-20 flex flex-col gap-3">
      <ActionButton icon={<Heart className={`h-5 w-5 ${isLiked ? "fill-primary text-primary" : ""}`} />} label="Like" onClick={() => toggleLike(puzzle.id)} active={isLiked} />
      <ActionButton icon={<Bookmark className={`h-5 w-5 ${isSaved ? "fill-primary text-primary" : ""}`} />} label="Save" onClick={() => toggleSave(puzzle.id)} active={isSaved} />
      <ActionButton
        icon={<Lightbulb className="h-5 w-5" />}
        label={hintsUsed ? `${hintsUsed}` : "Hint"}
        onClick={onHint}
      />
      <ActionButton icon={<Share2 className="h-5 w-5" />} label="Share" onClick={share} />
      <ActionButton icon={<Flame className="h-5 w-5 text-primary" />} label={`${streak}`} onClick={() => {}} />
    </div>
  );
}

function ActionButton({
  icon,
  label,
  onClick,
  active,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  active?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-0.5 select-none active:scale-95 transition-transform`}
      aria-label={label}
    >
      <span
        className={`h-11 w-11 rounded-2xl border flex items-center justify-center backdrop-blur-md ${
          active ? "border-primary/70 bg-primary/10" : "border-border bg-card/80"
        }`}
      >
        {icon}
      </span>
      <span className="text-[10px] font-semibold text-muted-foreground">{label}</span>
    </button>
  );
}