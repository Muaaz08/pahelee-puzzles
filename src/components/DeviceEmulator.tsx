import React, { useEffect, useState } from "react";

export function DeviceEmulator({ children }: { children: React.ReactNode }) {
  const [on, setOn] = useState<boolean>(() => {
    try {
      return localStorage.getItem("emulateMobile") === "1";
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("emulateMobile", on ? "1" : "0");
    } catch {}
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
          <div className="w-[390px] h-[844px] rounded-3xl overflow-hidden border border-border bg-background shadow-2xl">
            {children}
          </div>
        </div>
      ) : (
        <>{children}</>
      )}
    </>
  );
}
