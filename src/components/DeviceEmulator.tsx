import React, { useEffect, useState } from "react";

export function DeviceEmulator({ children }: { children: React.ReactNode }) {
  const [on, setOn] = useState<boolean>(() => {
    try {
      return localStorage.getItem("emulateMobile") === "1";
    } catch {
      return false;
    }
  });

  const [scale, setScale] = useState<number>(1);

  useEffect(() => {
    try {
      localStorage.setItem("emulateMobile", on ? "1" : "0");
    } catch {}
  }, [on]);

  useEffect(() => {
    if (!on) return;
    const update = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const frameW = 390;
      const frameH = 844;
      const padding = 48; // total padding around frame
      const scaleByHeight = (vh - padding) / frameH;
      const scaleByWidth = (vw - padding) / frameW;
      const s = Math.min(1, scaleByHeight, scaleByWidth);
      setScale(s > 0 ? s : 0.5);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [on]);

  return (
    <>
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={() => setOn((s) => !s)}
          className="h-9 px-3 rounded-full bg-card border border-border text-sm font-medium shadow-md"
          aria-pressed={on}
        >
          {on ? "Exit Mobile" : "Emulate Mobile"}
        </button>
      </div>

      {on ? (
        <div className="min-h-screen flex items-center justify-center p-6 bg-[rgba(0,0,0,0.35)]">
          <div
            className="rounded-3xl overflow-hidden border border-border bg-background shadow-2xl"
            style={{
              width: 390,
              height: 844,
              transform: `scale(${scale})`,
              transformOrigin: "top center",
            }}
          >
            {children}
          </div>
        </div>
      ) : (
        <>{children}</>
      )}
    </>
  );
}
