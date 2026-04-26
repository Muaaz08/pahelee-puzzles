import { useEffect } from "react";
import { DeviceEmulator } from "@/components/DeviceEmulator";
import LandingHero from "@/components/LandingHero";

const Landing = () => {
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

  return (
    <main className="relative flex h-[var(--app-height,100svh)] w-full items-center justify-center bg-background text-foreground overflow-hidden">
      <DeviceEmulator>
        <div className="w-full h-full max-w-4xl px-4 py-6">
          <LandingHero />
        </div>
      </DeviceEmulator>
    </main>
  );
};

export default Landing;
