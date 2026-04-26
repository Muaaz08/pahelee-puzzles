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
      <div className="w-full h-full px-4 py-4 sm:px-6 sm:py-6 md:px-8 md:py-8 lg:w-[75%] lg:max-w-5xl lg:mx-auto">
        <LandingHero />
      </div>
    </main>
  );
};

export default Landing;
