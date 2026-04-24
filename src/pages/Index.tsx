import { useState } from "react";
import { AppProvider } from "@/store/app-store";
import { AppHeader } from "@/components/AppHeader";
import { PuzzleFeed } from "@/components/PuzzleFeed";
import { SettingsSheet } from "@/components/SettingsSheet";

const Index = () => {
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <AppProvider>
      <main className="relative h-[100svh] w-full bg-background text-foreground overflow-hidden">
        <AppHeader onOpenSettings={() => setSettingsOpen(true)} />
        <PuzzleFeed />
        <SettingsSheet open={settingsOpen} onOpenChange={setSettingsOpen} />
      </main>
    </AppProvider>
  );
};

export default Index;
