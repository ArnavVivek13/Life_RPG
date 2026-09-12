"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
      <h2 className="text-2xl font-bold font-title text-red-500">Something went wrong!</h2>
      <p className="text-sm text-slate-400 mt-2">{error.message || "An unexpected encounter occurred."}</p>
      <button
        onClick={() => reset()}
        className="mt-4 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold rounded-md border border-slate-700"
      >
        Try again
      </button>
    </div>
  );
}
