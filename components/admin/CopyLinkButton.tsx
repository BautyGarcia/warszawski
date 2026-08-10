"use client";

import { useState } from "react";

export function CopyLinkButton({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // clipboard bloqueado: no rompemos.
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="rounded-[5px] border border-black/10 px-3 py-1.5 text-[13px] text-[#6B6B6B] transition-colors hover:border-ink/30 hover:text-ink"
    >
      {copied ? "¡Copiado!" : "Copiar link"}
    </button>
  );
}
