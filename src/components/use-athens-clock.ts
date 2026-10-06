"use client";

import { useSyncExternalStore } from "react";
import { readAthensClock, type AthensClock } from "@/lib/hours";

/*
 * One shared clock for every consumer on the page: a single interval, a single
 * cached snapshot. The server snapshot is null so the markup matches on
 * hydration — these pages are statically generated, so a build-time clock
 * would be wrong anyway.
 */

let snapshot: AthensClock | null = null;
let timer: ReturnType<typeof setInterval> | undefined;
const listeners = new Set<() => void>();

function tick() {
  const next = readAthensClock();
  if (
    !snapshot ||
    snapshot.time !== next.time ||
    snapshot.dayKey !== next.dayKey ||
    snapshot.isOpen !== next.isOpen
  ) {
    snapshot = next;
    for (const listener of listeners) listener();
  }
}

function subscribe(onStoreChange: () => void) {
  listeners.add(onStoreChange);
  if (listeners.size === 1) {
    tick();
    timer = setInterval(tick, 30_000);
  } else {
    onStoreChange();
  }

  return () => {
    listeners.delete(onStoreChange);
    if (listeners.size === 0) {
      clearInterval(timer);
      timer = undefined;
    }
  };
}

const getSnapshot = () => snapshot;
const getServerSnapshot = () => null;

/** Athens wall clock and open/closed state, or null before it is read. */
export function useAthensClock() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
