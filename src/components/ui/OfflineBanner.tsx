"use client";

import { useEffect, useState } from "react";
import { WifiOff, AlertTriangle } from "lucide-react";

export default function OfflineBanner() {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Initial check
    if (typeof navigator !== "undefined" && !navigator.onLine) {
      setIsOffline(true);
    }

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div
      role="alert"
      className="fixed bottom-4 right-4 z-50 p-4 rounded-xl pixel-box bg-red-950/90 border-2 border-red-500 text-red-200 shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom duration-300"
    >
      <WifiOff className="w-5 h-5 text-red-400 shrink-0 animate-pulse" />
      <div>
        <p className="text-xs font-bold font-title text-red-100">Connection to Guild Lost</p>
        <p className="text-[11px] text-red-300">Quests and progress will sync once the realm reconnects.</p>
      </div>
    </div>
  );
}
