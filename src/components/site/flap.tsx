"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const GLYPHS = "0123456789:ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩABCDEFGHIJKLMNOPQRSTUVWXYZ";

/**
 * Split-flap text, as on the departure boards at the port. Each cell riffles
 * through glyphs before landing, left to right, whenever `text` changes.
 */
export function Flap({
  text,
  className,
  cells,
}: {
  text: string;
  className?: string;
  /** Pad to a fixed number of cells so the board doesn't reflow. */
  cells?: number;
}) {
  const target = cells ? text.padEnd(cells, " ").slice(0, cells) : text;
  /* Mid-riffle frame, or null once every cell has landed on `target` */
  const [riffle, setRiffle] = useState<string | null>(null);
  const prev = useRef<string | null>(null);
  const shown = riffle ?? target;

  useEffect(() => {
    const from = prev.current ?? target.replace(/\S/g, " ");
    if (from === target) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      prev.current = target;
      return;
    }

    let step = 0;
    const id = setInterval(() => {
      step++;
      let done = true;
      const next = [...target]
        .map((ch, i) => {
          const settleAt = 3 + i * 1.6;
          if (step >= settleAt || ch === from[i]) return ch;
          done = false;
          return ch === " " ? " " : GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        })
        .join("");
      setRiffle(done ? null : next);
      if (done) {
        clearInterval(id);
        prev.current = target;
      }
    }, 55);

    return () => clearInterval(id);
  }, [target]);

  return (
    <span className={cn("site-flap", className)} aria-label={text.trim()} role="text">
      {[...shown].map((ch, i) => (
        <span key={i} className="site-flap-cell" aria-hidden data-blank={ch === " " ? "" : undefined}>
          {ch}
        </span>
      ))}
    </span>
  );
}
