import { useState } from "react";
import { AppProvider } from "@/store/app-store";
import { AppHeader } from "@/components/AppHeader";
import { PuzzleFeed } from "@/components/PuzzleFeed";
import { SettingsSheet } from "@/components/SettingsSheet";
import { DeviceEmulator } from "@/components/DeviceEmulator";

const Index = () => {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const appShell = (
    <main className="relative h-[var(--app-height,100svh)] w-full bg-background text-foreground overflow-hidden">
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
