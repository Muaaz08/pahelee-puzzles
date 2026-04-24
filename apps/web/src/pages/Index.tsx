import { useEffect, useState } from "react";
import { AppProvider } from "@/store/app-store";
import { AppHeader } from "@/components/AppHeader";
import { PuzzleFeed } from "@/components/PuzzleFeed";
import { SettingsSheet } from "@/components/SettingsSheet";
import { DeviceEmulator } from "@/components/DeviceEmulator";

const Index = () => {
  const [settingsOpen, setSettingsOpen] = useState(false);

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
    <main className="relative flex h-[var(--app-height,100svh)] w-full flex-col bg-background text-foreground overflow-hidden">
      <AppHeader onOpenSettings={() => setSettingsOpen(true)} />
      <PuzzleFeed />
      <SettingsSheet open={settingsOpen} onOpenChange={setSettingsOpen} />
    </main>
  );

  return (
    <AppProvider>
      <DeviceEmulator>{appShell}</DeviceEmulator>
    </AppProvider>
  );
};

export default Index;
