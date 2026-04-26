import { Crown, Settings, ArrowLeft } from "lucide-react";
import { useApp } from "@/store/app-store";
import { useNavigate } from "react-router";

export function AppHeader({ onOpenSettings }: { onOpenSettings: () => void }) {
  const navigate = useNavigate();

  return (
    <header className="relative z-30 shrink-0 px-4 pt-[max(env(safe-area-inset-top),8px)] pb-1.5 sm:pt-[max(env(safe-area-inset-top),12px)] sm:pb-3">
      <div className="flex items-center justify-between pointer-events-auto">
        <button
          onClick={() => navigate("/")}
          className="h-10 w-10 sm:h-11 sm:w-11 flex items-center justify-center hover:text-primary transition-colors"
          aria-label="Back to home"
        >
          <ArrowLeft className="h-5 w-5 sm:h-6 sm:w-6 text-foreground/80" />
        </button>
        <h1
          className="text-2xl sm:text-3xl font-extrabold tracking-tight text-primary text-glow flex items-center gap-2"
          style={{ fontFamily: "'Space Grotesk', Inter, sans-serif" }}
        >
          pahelee
          <span aria-hidden className="text-primary text-2xl sm:text-3xl">♟</span>
        </h1>
        <button
          onClick={onOpenSettings}
          className="h-10 w-10 sm:h-11 sm:w-11 flex items-center justify-center hover:text-primary transition-colors"
          aria-label="Settings"
        >
          <Settings className="h-5 w-5 sm:h-6 sm:w-6 text-foreground/80" />
        </button>
      </div>
    </header>
  );
}
