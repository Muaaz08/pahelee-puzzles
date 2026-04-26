import { useEffect, useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { PuzzleFeed } from "@/components/PuzzleFeed";
import { SettingsSheet } from "@/components/SettingsSheet";
import { DeviceEmulator } from "@/components/DeviceEmulator";
import { GamificationOverlay } from "@/components/GamificationOverlay";
import { SessionStats } from "@/components/SessionStats";
import { useApp } from "@/store/app-store";
import { GamificationProvider } from "@/store/gamification-store";

const Index = () => {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { mode, startTimer } = useApp();

  useEffect(() => {
    if (mode === "timer") {
      startTimer();
    }
  }, [mode, startTimer]);

  useEffect(() => {
    const setAppHeight = () => {
      const height = window.visualViewport?.height ?? window.innerHeight;
      document.documentElement.style.setProperty("--app-height", `${height}px`);
    };

    setAppHeight();
    window.visualViewport?.addEventListener("resize", setAppHeight);
    window.addEventListener("resize", setAppHeight);

    return () => {
      window.visualViewport?.removeEventListener("resize", setAppHeight);
      window.removeEventListener("resize", setAppHeight);
    };
  }, []);

  const appShell = (
    <GamificationProvider>
      <main className="relative flex h-[var(--app-height,100svh)] w-full flex-col bg-background text-foreground overflow-hidden">
        <AppHeader onOpenSettings={() => setSettingsOpen(true)} />
        <SessionStats />
        <PuzzleFeed />
        <GamificationOverlay />
        <SettingsSheet open={settingsOpen} onOpenChange={setSettingsOpen} />
      </main>
    </GamificationProvider>
  );

  return appShell;
};

export default Index;
