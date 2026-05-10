"use client";

import { useEffect } from "react";

export default function AdminError({
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
    <main className="grid min-h-screen place-items-center bg-white px-6">
      <div className="flex max-w-sm flex-col items-center text-center">
        <span className="text-[11px] font-medium uppercase tracking-widest text-[#DC3545]">
          Error
        </span>
        <h1 className="mt-3 text-xl font-semibold tracking-[-0.02em] text-ink">
          Algo salió mal
        </h1>
        <p className="mt-2 text-sm text-[#6B6B6B]">
          {error.message || "Hubo un problema al cargar esta vista."}
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-6 rounded-md bg-ink px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-ink-soft"
        >
          Reintentar
        </button>
      </div>
    </main>
  );
}
