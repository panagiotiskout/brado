"use client";

import { useEffect, useState } from "react";

/**
 * One-shot entrance: the wordmark sits bottom-left like a poster credit while a
 * blue rule sweeps across, then the whole plate fades. Once per session.
 */
export function CurtainEntrance() {
  const [phase, setPhase] = useState<"hold" | "leaving" | "done">("hold");

  useEffect(() => {
    let seen: boolean;
    try {
      seen = sessionStorage.getItem("brado-curtain") !== null;
    } catch {
      seen = true;
    }

    if (seen) {
      const skipTimer = setTimeout(() => setPhase("done"), 0);
      return () => clearTimeout(skipTimer);
    }

    document.body.style.overflow = "hidden";

    const leaveTimer = setTimeout(() => setPhase("leaving"), 1500);
    const doneTimer = setTimeout(() => {
      setPhase("done");
      document.body.style.overflow = "";
      try {
        sessionStorage.setItem("brado-curtain", "1");
      } catch {}
    }, 2200);

    return () => {
      clearTimeout(leaveTimer);
      clearTimeout(doneTimer);
      document.body.style.overflow = "";
    };
  }, []);

  if (phase === "done") return null;

  return (
    <div
      className={`curtain-overlay ${phase === "leaving" ? "curtain-fade" : ""}`}
      aria-hidden="true"
    >
      <div className="curtain-inner">
        <span className="micro micro-sm">ΑΚΤΗ ΘΕΜΙΣΤΟΚΛΕΟΥΣ 44 · ΠΕΙΡΑΙΑΣ</span>
        <div className="curtain-line mt-5 w-full" />
        <span className="curtain-wordmark mt-5 block skew-x-[-12deg]">
          Brado
        </span>
      </div>
    </div>
  );
}
