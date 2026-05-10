"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type Props = {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  /**
   * If true, starts the reveal as soon as the component mounts (useful for
   * above-the-fold content like the hero where we want a load-in animation
   * regardless of scroll). Defaults to scroll-triggered.
   */
  immediate?: boolean;
};

export function Reveal({ children, delay = 0, className, immediate = false }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    if (immediate) {
      const t = setTimeout(() => setRevealed(true), delay);
      return () => clearTimeout(t);
    }

    const node = ref.current;
    if (!node) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const t = setTimeout(() => setRevealed(true), delay);
          obs.disconnect();
          return () => clearTimeout(t);
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, [delay, immediate]);

  return (
    <div
      ref={ref}
      data-revealed={revealed || undefined}
      className={cn("reveal", className)}
    >
      {children}
    </div>
  );
}
