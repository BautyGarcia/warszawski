"use client";

import { useEffect } from "react";

export default function GlobalError({
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
    <main className="grid min-h-screen place-items-center bg-bg px-6">
      <div className="flex max-w-md flex-col items-center text-center">
        <p className="font-display text-7xl font-light text-ink/30">!</p>
        <span className="mt-6 inline-block text-[11px] font-medium uppercase tracking-[0.3em] text-gold-dark">
          Error inesperado
        </span>
        <h1 className="mt-3 font-display text-3xl font-bold leading-tight tracking-[-0.02em] text-ink md:text-4xl">
          Algo salió mal
        </h1>
        <p className="mt-4 text-sm font-light leading-6 text-ink-soft">
          Hubo un problema al cargar esta página. Probá de nuevo en un momento.
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-8 rounded-xs bg-ink px-7 py-3 text-[13px] font-medium tracking-[0.06em] text-bg transition-colors hover:bg-ink-soft"
        >
          Reintentar
        </button>
      </div>
    </main>
  );
}
